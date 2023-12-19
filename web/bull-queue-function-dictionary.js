import { OpenAI } from "openai";
import "dotenv/config";
import {
  mockGptTurboResponse,
  testNonNetWorkErrorOnChatGptTurboFailure,
  max_tokens,
  MockGptTurboPrompt,
  MockGptResponse,
} from "./testMethods.js";

// import { updateTokenUsageAfterJob } from "./subscriptionManager.js";
// import * as userStore from "./userStore.js";
const { OPEN_AI_SECRET_KEY } = process.env;
const openai = new OpenAI({
  apiKey: OPEN_AI_SECRET_KEY,
});


export const processFunctions = {
  async chatGptTurbo({
    shop,
    prompt,
    url,
    config,
    documentType,
    api,
    promptTokenCountEstimate,
    processFunction,
    max_tokens,
  }) {
    try {
      testNonNetWorkErrorOnChatGptTurboFailure();

      // console.log("arguments[0]", JSON.stringify(arguments) );

      if (MockGptResponse) {
        const mockData = await mockGptTurboResponse({ ...arguments[0] });

        if (mockData) {
          return mockData;
        }

        throw new Error("Error mockData not correct", mockData);
      } else {
        // console.log("prompt", prompt);
        try {
          const stream = await chatGPTurboStream(prompt, max_tokens);

          return { stream, ...arguments[0] };
        } catch (error) {
          throw Error(error);
        }
      }
    } catch (error) {
      // Return the formatted error message
      return { error };
    }
  },
  async processTypeB(data) {
    try {
      // Processing logic for type B
      const result = "/* ... */";
      return { result };
    } catch (error) {
      return { error: error.message };
    }
  },
  // Add more processing functions as needed
};

async function chatGPTurboStream(prompt, max_tokens) {


if(!max_tokens){
  throw new Error("max_tokens must be a number:::", max_tokens);
}

  if (prompt.length <= 0) {
    throw new Error("no prompt present in generatorCall:::", prompt);
  }
  // console.log('prompt: ' + prompt);
  try {
    return openai.beta.chat.completions.stream({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",

          content: MockGptTurboPrompt || prompt,
        },
      ],
      max_tokens,
      temperature: 0.0,
      frequency_penalty:0.2,
       presence_penalty:0.8,
      stream: true,
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status); // e.g. 401
      console.error(error.message); // e.g. The authentication token you passed was invalid...
      console.error(error.code); // e.g. 'invalid_api_key'
      console.error(error.type); // e.g. 'invalid_request_error'
    } else {
      // Non-API error
      console.log(error);
    }
    throw Error(error);
  }
}


// model: Specifies the language model to use. For GPT-3, this would typically be "text-davinci-003" or another version depending on the updates and releases.

// temperature: Controls the randomness of the model's output. Higher values like 0.8 make the output more random, while lower values like 0.2 make it more deterministic.

// max_tokens: Specifies the maximum number of tokens (words or characters) in the generated output. Use this to limit the length of the response.

// top_p (formerly nucleus): It is used for nucleus sampling. It sets a probability threshold for including tokens in the output. It helps in controlling the diversity of the generated text.

// frequency_penalty: Controls the penalty for using frequent tokens. Higher values will make the output more focused, while lower values will allow for a more diverse output. (important to keep this value low for referencing)

// presence_penalty: This parameter encourages the model to avoid certain tokens. A higher presence_penalty value makes it less likely for the model to repeat certain phrases.

// stop: A list of tokens where the generation should stop. This can be useful to limit the length of the generated text or to prevent the model from generating beyond a certain point.

// temperature: Controls the randomness of the model's output. Higher values like 0.8 make the output more random, while lower values like 0.2 make it more deterministic.