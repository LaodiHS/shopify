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

const apiKey = OPEN_AI_SECRET_KEY;
const openai = new OpenAI({
  apiKey: OPEN_AI_SECRET_KEY,
});
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
          const stream = await chatGPTurboStream(prompt);

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

async function chatGPTurboStream(prompt) {
  if (prompt.length <= 0) {
    throw new Error("no prompt present in generatorCall");
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
      temperature: 0,
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
