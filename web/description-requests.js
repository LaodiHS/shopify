import { body, validationResult, param } from "express-validator";
import {
  withoutOptions,
  withLanguageOption,
  withProductDetails,
  withLanguageAndProductOption,
} from "./chat-gpt.js";
import { enqueueApiRequest } from "./bull-queue.js";
import { hasExceededUsageLimit } from "./subscriptionManager.js";
import natural from "natural";
// Common function to handle different types of endpoints
async function handleEndpoints(app, endpointType, queue) {
  const allowedEndpoints = [
    "empty-template",
    "language-options",
    "focus-options",
    "focus-language-options",
  ];

  app.post(
    `/api/ai/${endpointType}/:endpoints`,
    [
      param("endpoints")
        .custom((value) => allowedEndpoints.includes(value))
        .withMessage("Invalid endpoint value."),
      body("productData")
        .exists()
        .withMessage("productData is required")
        .notEmpty()
        .withMessage("productData cannot be empty"),
      body("subscriptions").notEmpty().withMessage("subscriptions is required"),
      body("language").exists().isArray(),
      body("focus").exists().isArray(),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { shop } = res.locals.shopify.session;
        const { endpoints } = req.params;
        const { productData, language, focus } = req.body;

        let selectedOptions;
        if (!language?.length && !focus?.length) {
          // Handle request with no options
          selectedOptions = withoutOptions(productData);
        } else if (language?.length && !focus?.length) {
          // Handle request with language option
          console.log("with language option", focus);
          selectedOptions = withLanguageOption(productData, language);
        } else if (!language?.length && focus?.length) {
          // Handle request with product option
          selectedOptions = withProductDetails(productData, focus);
        } else if (language?.length && focus?.length) {
          // Handle request with both language and product options
          selectedOptions = withLanguageAndProductOption(
            productData,
            language,
            focus
          );
        }
        const { prompt, documentType, legend } = selectedOptions;
        const tokenCount = countTokens(prompt);
        console.log("prompt token count", tokenCount);
        const exceedsLimit = await hasExceededUsageLimit(shop, tokenCount);

        if (exceedsLimit) {
     
          return res
            .status(200)
            .json({ exceedsLimit, message: "Your current selection exceeds the usage limit. Don't worry, we've saved it for you! To get even more amazing results, consider upgrading to a higher subscription to support our work. Thank you for being part of our community!", legend });
        } else {
          enqueueApiRequest({
            prompt,
            shop,
            documentType,
            queue,
            processFunction: "chatGptTurbo",
          });

          return res
            .status(200)
            .json({ exceedsLimit, message: prompt, legend });
        }
      } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );
}

export async function handleDescriptionEndpoints(app, queue) {
  await handleEndpoints(app, "description", queue);
}

export async function handleArticleEndpoints(app, queue) {
  await handleEndpoints(app, "article", queue);
}

export async function handlePostEndpoints(app, queue) {
  await handleEndpoints(app, "post", queue);
}

function countTokens(text) {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);
  return tokens.length;
}
