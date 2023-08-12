import { Configuration, OpenAIApi } from "openai";
import "dotenv/config";
// Import missing dependencies (userStore functions)
import * as userStore from "./userStore.js";
import {
  mockGptTurboResponse,
  testNonNetWorkErrorOnChatGptTurboFailure,
} from "./testMethods.js";
import { updateTokenUsageAfterJob } from "./subscriptionManager.js";
const { OPEN_AI_SECRET_KEY } = process.env;

const configuration = new Configuration({
  apiKey: OPEN_AI_SECRET_KEY,
});

const apiKey = OPEN_AI_SECRET_KEY;
const openai = new OpenAIApi(configuration);
class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}
function isNetworkError(error) {
  if (typeof error === "string") {
    return error.toLowerCase().includes("network error");
  }

  if (error instanceof Error) {
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ECONNABORTED" ||
      error.message.toLowerCase().includes("network error") ||
      error.message.includes("timeout")
    ) {
      return true;
    }

    if (error.code === "NETWORK_ERROR") {
      return true;
    }

    // Check if the error object has an HTTP response
    if (error.response && error.response.status >= 500 && error.response.status < 600) {
      return true;
    }
  }

  // Not a network error
  return false;
}

const chatGptTurboConfig = ({ prompt }) => ({
  data: {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",

        content: prompt,
      },
    ],
    max_tokens: 450,

    presence_penalty: 0.7,

    temperature: 0.7,

    n: 1, // Specify the number of completions you want here (in this example, it's set to 3).
  },

  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
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
  }) {
    try {
      testNonNetWorkErrorOnChatGptTurboFailure();

      
      const mockData = await mockGptTurboResponse(
      {...arguments[0]}
      );

      
      if (mockData) {
        return mockData;
      }
        const res = await generatorCall()
       return {res, ...arguments[0]}


      console.log("hitting chat-gptTurbo");
      const { data } = chatGptTurboConfig({ prompt });

      const completion = await openai.createChatCompletion(data);

      const storeData = await userStore.readJSONFromFileAsync(shop);

      storeData.documentType = documentType;

      storeData.shop = shop;

      storeData.gptText = completion.data.choices[0].message.content;

      await userStore.writeJSONToFileAsync(shop, storeData);

      await updateTokenUsageAfterJob(shop, completion?.data?.usage.total_tokens);

      return {
        documentType: documentType,

        [documentType]: completion.data.choices[0].message.content,

        shop,
        processFunction,
      };
    } catch (error) {
      // Custom error handling and logging

      if (isNetworkError(error)) {
        console.error("Network error occurred in chatGptTurbo:", error);
        throw error; // Rethrow the network error to let BullMQ retry the job
      } else {
        // Log the error for debugging and tracing purposes
        error.processFunction = processFunction;
        console.error("An error occurred in chatGptTurbo:", error);

        // Handle explicitly thrown errors
        if (error instanceof Error && error.message === "request error") {
          // Custom error handling for the explicitly thrown error
          return { error: "Custom error: " + error.message };
        } else {
          // Handle other errors (e.g., errors from third-party API)

          // Log the generic error for debugging purposes
          console.error("An unexpected error occurred in chatGptTurbo:", error);

          // You can add more detailed error messages based on the type of error
          let errorMessage = "An unexpected error occurred";

          // Return the formatted error message
          return { error: errorMessage };
        }
      }
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

async function* generateOpenAIMessages() {
  try {
    
    const res = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",

            content:
              "tell me a short story about rambo, and use only 10 word tokens to do it",
          },
        ],
        max_tokens: 20,
        temperature: 0,
        stream: true,
      },
      { responseType: "stream" }
    );

    console.log("tokens===>", res.data);

    for await (const data of res.data) {
      const lines = data
        .toString()
        .split("\n")
        .filter((line) => line.trim() !== "");
      for (const line of lines) {
        const message = line.replace(/^data: /, "");
        if (message === "[DONE]") {
          return; // Stream finished
        }
        try {
          //{ index: 0, delta: { content: ' passed' }, finish_reason: null }
          const parsed = JSON.parse(message);
          console.log("parsed message1===>", parsed.choices[0]);
          console.log("parsed message2===>", parsed.choices[0].delta.content);
          parsed.choices[0].index;
          yield parsed.choices[0].delta;
        } catch (error) {
          console.error("Could not JSON parse stream message", message, error);
        }
      }
    }
  } catch (error) {
    if (error.response?.status) {
      console.error(error.response.status, error.message);
      for await (const data of error.response.data) {
        const message = data.toString();
        try {
          const parsed = JSON.parse(message);
          console.error("An error occurred during OpenAI request: ", parsed);
        } catch (error) {
          console.error("An error occurred during OpenAI request: ", message);
        }
      }
    } else {
      console.error("An error occurred during OpenAI request", error);
    }
  }
}

// Usage example:
async () => {
  const messageGenerator = generateOpenAIMessages();
  for await (const message of messageGenerator) {
    console.log(message);
  }
};

async function generatorCall(prompt) {
  try {
    const res = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",

            content:
              "  Use only 20 word for the text of the story."
          },
        ],
        max_tokens: 10,
        temperature: 0,
        stream: true,
      },
      { responseType: "stream" }
    );

    return res;
  } catch (error) {

    if (error.response?.status) {
      console.error(error.response.status, error.message);
      for await (const data of error.response.data) {
        const message = data.toString();
        try {
          const parsed = JSON.parse(message);
          console.error("An error occurred during OpenAI request: ", parsed);
        } catch (error) {
          console.error("An error occurred during OpenAI request: ", message);
        }
      }
    } else {
      console.error("An error occurred during OpenAI request", error);
    }
  }
}
