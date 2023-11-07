import { Configuration, OpenAIApi } from "openai";
import "dotenv/config";
import {
  mockGptTurboResponse,
  testNonNetWorkErrorOnChatGptTurboFailure,
  max_tokens,
  MockGptTurboPrompt,
} from "./testMethods.js";

// import { updateTokenUsageAfterJob } from "./subscriptionManager.js";
// import * as userStore from "./userStore.js";
const { OPEN_AI_SECRET_KEY } = process.env;

const configuration = new Configuration({
  apiKey: OPEN_AI_SECRET_KEY,
});

const apiKey = OPEN_AI_SECRET_KEY;
const openai = new OpenAIApi(configuration);
// class NetworkError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'NetworkError';
//   }
// }
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
    if (
      error.response &&
      error.response.status >= 500 &&
      error.response.status < 600
    ) {
      return true;
    }
  }

  // Not a network error
  return false;
}

//     max_tokens: max_tokens,

//     presence_penalty: 0.7,

//     temperature: 0.7,

//     n: 1, // Specify the number of completions you want here (in this example, it's set to 3).

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
// console.log('arguments[0]', arguments);
      const mockData = await mockGptTurboResponse({ ...arguments[0] });

      if (mockData) {
        return mockData;
      }
      console.log("prompt", prompt);
      const res = await generatorCall(prompt);
      return { res, ...arguments[0] };
    } catch (error) {
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

async function generatorCall(prompt) {
  if (prompt.length <= 0) {
    throw new Error("no prompt present in generatorCall");
  }
  // console.log('prompt: ' + prompt);
  try {
    const res = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",

            content: MockGptTurboPrompt || prompt,
          },
        ],
        max_tokens,
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
