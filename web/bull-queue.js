import { Queue, Worker, QueueEvents } from "bullmq";
import { shopify } from "./shopify.js";
import { inspect } from "util";
import * as userStore from "./userStore.js";
import { processFunctions } from "./bull-queue-function-dictionary.js";
import { testBullMqJobProcessFailure } from "./testMethods.js";
import { countTokens } from "./tokenTools.js";
import { updateTokenUsageAfterJob } from "./subscriptionManager.js";
import fs from "fs";
// import { QueryClient } from '@tanstack/react-query';
const clients = new Map();
function createEventEmitter() {
  const listeners = {};

  function on(eventType, callback) {
    if (!listeners[eventType]) {
      listeners[eventType] = [];
    }
    listeners[eventType].push(callback);
  }

  function emit(eventType, data) {
    const eventListeners = listeners[eventType];
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        callback(data);
      });
    }
  }
  function removeListener(eventType, callback) {
    const eventListeners = listeners[eventType];
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }
  }
  return { on, emit, removeListener };
}

const emitter = createEventEmitter();

const streamingQueueEventName = "api-request-queue";

const queueConfig = {
  limiter: {
    max: 100, // Limit to 100 requests per minute
    duration: 120000, // default is 60,000 ms (1 minute) set to 2 mim
  },
  defaultJobOptions: {
    priority: 1, // Set default priority to medium
    attempts: 1, // Max retries
    backoff: {
      type: "exponential", // Exponential backoff
      delay: 1000, // 1 second initial delay
    },
    timeout: 30000, // 30 seconds timeout for each job
    removeOnComplete: true, // Remove completed jobs
    removeOnFail: true, // Move jobs to DLQ after 5 retries
  },
  settings: {
    lockDuration: 30000, // Lock duration in milliseconds
    maxStalledCount: 3, // Max stalled count before re-queueing default 5
    stalledInterval: 30000, // Check for stalled jobs every 30 seconds
    defaultJobPriority: 1, // Set default job priority to medium
    drainDelay: 5000, // Delay in milliseconds before closing workers during shutdown default is 5000
    maxCompletedJobs: 10, // Maximum completed jobs to keep in the queue default is 1000
  },
};

const customSerializer = (data) => {
  // Exclude the 'socket' property from serialization
  const dataToSerialize = { ...data };
  delete dataToSerialize.socket;
  // try {
  //   const d = JSON.stringify(dataToSerialize);
  //   console.log("d", d);
  // } catch (e) {
  //   console.log("error", error);
  // }
  // Serialize the modified data using JSON.stringify
};

export async function setupBullMQServer(redisClient) {
  try {
    await userStore.createUsersFolderAsync();

    const streamingQueue = new Queue(streamingQueueEventName, {
      connection: redisClient,
      ...queueConfig,
    });

    const streamingWorker = new Worker(streamingQueueEventName, processJob, {
      connection: redisClient,
      concurrency: 2, // Set the desired concurrency level
      serializer: customSerializer,
    });

    streamingWorker.on("completed", (job) => {
      console.log(`${job.id} has completed!`);
    });

    streamingWorker.on("failed", (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
    });

    streamingWorker.on("stalled", (job, err) => {
      console.log(`${job.id} has stalled with ${err.message}`);
    });

    return { queue: streamingQueue, worker: streamingWorker };
  } catch (e) {
    console.error("Bullmq setup error: ", e);
    throw new Error("Bull MQ setup error: " + e.message);
  }
}

async function processJob(job) {
  testBullMqJobProcessFailure();
  const {
    shop,
    // url, data, config, documentType,
    processFunction,
  } = job.data;
  if (!processFunctions[processFunction]) {
    console.error(`No processing function found for type: ${processFunction}`);
    // throw new Error(
    //   `No processing function found for type: ${processFunction}`
    // );
    return {
      error: "no processing function found",
      shop,
      processFunction,
    };
  }

  const processingFunction = processFunctions[processFunction];

  try {
    const processingResult = await processingFunction(job.data);
    // console.log("processing result: ", processingResult);
    if (processingResult.error) {
      processingResult.shop = shop;
      processingFunction.processFunction = processFunction;
      console.error(
        `Error processing job of type '${processFunction}':`,
        processingResult.error
      );

      // return processingResult; // contains the .error
      //maybe handle other non network error retry. Throwing wil trigger bullMq error handling
      // throw new Error(
      //   `Error processing job of type '${processFunction}': ${processingResult.error}`
      // );
    }


    const { sendSSEMessage, closeSSE } = clients.get(job.data.shop);
    if (!sendSSEMessage || !closeSSE) {
      throw new Error("missing sendSSEMessage and closeSSE");
    }

    
    sendSSEMessage( { type: "connect", message: "open" })
    console.log('connect::::::::::::::')
    await generateOpenAIMessages(processingResult, sendSSEMessage);


    clients.delete(job.data.shop);
  } catch (error) {
    console.error(`Error processing job of type '${processFunction}':`, error);
    throw error;
  }
}

let eq_count = 0;
export async function enqueueApiRequest(promptObject) {
  try {
    const { shop, queue } = promptObject;

    const data = { ...promptObject, queue: null };
    eq_count++;

    await queue.add(shop, data, {
      attempts: 3, // Max retries for this specific job (overrides default)
      timeout: 120000, // 1 minute timeout for this specific job (overrides default)
      priority: 3, // High priority for this specific job
    });
    console.log("eq_count", eq_count);
  } catch (e) {
    console.error("error: ", e);
    throw e;
  }
}

export function serverSideEvent(app, redisClient, queue) {
  // EventSource route for Server-Sent Events

  app.get("/sse/stream", (req, res, next) => {
    try {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.flushHeaders();
      function closeSSE({ closeType, message }) {
        if (typeof message !== "string") {
          throw new Error("message must be a string");
        }
        if (!res.writable) {
          console.log("Response stream is closed. Unable to send SSE message.");
          return;
        }

        const closeObject = JSON.stringify({
          type: "close",
          closeType,
          message,
        });

        res.write(`data: ${closeObject}\n\n`);
        //res.end(`event: close\ndata: ${closeObject}\n\n`);
        res.end();

        queueEvents.close();
      }
      const { shop } = req.query;
      if (!shop) {
        console.log("no shop name error");
        closeSSE({ closeType: "no_shop_name", message: "no shop name" });
        return;
      }

      // Function to send SSE messages to the client
      function sendSSEMessage(messageData) {
        try {
          // Check if the response stream is still open
          if (!res.writable) {
            console.log(
              "Response stream is closed. Unable to send SSE message."
            );
            return;
          }
          const eventData = JSON.stringify(messageData);
          // Check for errors during serialization
          if (eventData === undefined) {
            console.error("Failed to serialize message data:", messageData);
            return;
          }
          const sendString = `data: ${eventData}\n\n`;
          // Write the SSE message to the response stream
          // console.log("sendString: ", sendString);
          if(messageData.type ==='connect'){
            console.log('message::::', messageData)
          }
          res.write(sendString);
        } catch (error) {
          // Log any unexpected errors
          console.error("Error while sending SSE message:", error);
        }
      }
      const failed = async (job) => {
        console.log(
          "job failed: ",
          job,
          "jobId: ",
          jobId,
          "failedReason: ",
          job.failedReason
        );
        const jobData = await queue.getJob(job.jobId);
        const jobShop = jobData.data.shop;
        const jobProcessFunction = jobData.data.processFunction;
        if (jobShop === shop && jobProcessFunction === "chatGptTurbo") {
          sendSSEMessage({
            message: `Error: Job failed`,
            result: `${job.jobId} failed: ${job.failedReason}`,
          });
        }

        closeSSE({
          closeType: "failed",
          message: `failed: ${job.failedReason}`,
        });
      };

      const stalled = async (job) => {
        console.log("stalled---->: ", job);
        const jobData = await queue.getJob(job.jobId);
        const jobShop = jobData.data.shop;
        const jobProcessFunction = jobData.data.processFunction;
        await job.retry();
        if (jobShop === shop && jobProcessFunction === "chatGptTurbo") {
          closeSSE({ closeType: "stalled", message: `stalled: ${job.jobId}` });
        }
      };

      const completed = async (job) => {
        console.log("SSE completed", job);

        closeSSE({
          closeType: "completed",
          message: `job: ${job.jobId} completed`,
        });
      };

      req.on("close", () => {
        try {
          console.log("Closed connection socket");
          queueEvents.off("completed", completed);
          queueEvents.off("stalled", stalled);
          queueEvents.off("failed", failed);
        } catch (e) {
          console.log("listen for data error: ", e);
        }
      });

      const queueEvents = new QueueEvents(streamingQueueEventName, {
        connection: redisClient,
      });

      const initialMessage = JSON.stringify({ type: "open", message: "open" });
      res.write(` data: ${{ ...initialMessage }}\n\n`);

      console.log("added shop and function::", shop);
      clients.set(shop, { sendSSEMessage, closeSSE });

      queueEvents.on("stalled", stalled);
      queueEvents.on("failed", failed);
      queueEvents.on("completed", completed);
      // If the client disconnects, stop sending SSE messages
    } catch (err) {
      next(err); // Pass any uncaught errors to the error handling middleware
    }
  });

  const sseErrorHandler = (err, req, res, next) => {
    // Your custom error handling logic for the SSE route
    console.error("Error occurred in SSE---->:", err);
    res.status(500).json({ error: "Internal Server Error in SSE" });
  };
  app.use("/sse/stream", sseErrorHandler);
}

// Modified generateOpenAIMessages function to accept the res object as a parameter
async function generateOpenAIMessages(
  { stream, shop, documentType, openai, api, promptTokenCountEstimate },
  sendSSEMessage
) {
  let storeData;
  let tokensUsed;
  let totalTokenUsage;
  const responseContentCompleteText = [];
  try {
    // let i = 0;
    // console.log('res inspect===>', inspect(res, {depth:null, colors:true, compact:false}))
    // Access the stream data directly from the response object
    // console.log('stream: ' , JSON.stringify(stream) );

    for await (const parsed of stream) {
      if (parsed.choices[0].finish_reason) {
        // console.log('res inspect===>', inspect(res.headers, {depth:null, colors:true, compact:false}))
        //https://community.openai.com/t/how-to-get-total-tokens-from-a-stream-of-completioncreaterequests/110700

        const estimateOverheadForStream = 43;
        //console.log('token count nlp', countTokens(responseContentCompleteText))
        const tokenUsage =
          countTokens(responseContentCompleteText.join("")) +
          promptTokenCountEstimate +
          estimateOverheadForStream;
        tokensUsed = tokenUsage;
        console.log("total tokens used", tokenUsage);
        await updateTokenUsageAfterJob(shop, tokenUsage);
        storeData = await userStore.readJSONFromFileAsync(shop);

        storeData.documentType = documentType;
        storeData.shop = shop;
        storeData.gptText = responseContentCompleteText.join("");
        // console.log('storeData', storeData);
        const text = storeData.gptText;
    
        storeData.documentType = documentType;
        totalTokenUsage = storeData.current_usage; 
           writeJsonToFile("legendAndModifiedText.json", {...storeData,text });
        await userStore.writeJSONToFileAsync(shop, storeData);
      }
      try {
        // console.log('parsed message1===>', JSON.stringify(parsed));
        // console.log('parsed choices===>', parsed.choices);
        // console.log('parsed content===>', parsed.choices[0]);
        // Access the usage tokens from the response data

        const delta = parsed.choices[0].delta;

        responseContentCompleteText[responseContentCompleteText.length] =
          parsed.choices[0].delta?.content || "";

        delta.finish_reason = parsed.choices[0].finish_reason;

        // console.log("delta:   ", JSON.stringify(delta));
       // delta.content = delta.finish_reason ? " done" : parsed.choices[0].delta?.content;
        sendSSEMessage({
          type: "stream",
          message: "Job stream",
          delta,
          totalTokenUsage,
          tokensUsed,
          storeData,
        });
      } catch (error) {
        console.error("Could not JSON parse stream message", parsed, error);
      }
    }
  } catch (error) {
    // Handle errors
    console.error("An error occurred during OpenAI request", error);
    return false;
  }
  return true;
}
function writeJsonToFile(filePath, data) {
  try {
    // Convert the JavaScript object to a JSON string
    const jsonString = JSON.stringify(data, null, 2); // The third parameter (2) specifies the number of spaces for indentation

    // Write the JSON string to the file
    fs.writeFileSync(filePath, jsonString);

    console.log(`JSON data has been written to ${filePath}`);
  } catch (error) {
    console.error(`Error writing JSON to ${filePath}: ${error.message}`);
  }
}
