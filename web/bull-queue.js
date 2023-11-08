import { Queue, Worker, QueueEvents } from "bullmq";
import { shopify } from "./shopify.js";
import { inspect } from "util";
import * as userStore from "./userStore.js";
import { processFunctions } from "./bull-queue-function-dictionary.js";
import { testBullMqJobProcessFailure } from "./testMethods.js";
import { countTokens } from "./tokenTools.js";
import { updateTokenUsageAfterJob } from "./subscriptionManager.js";

const dataCallbacks = new Map();

// Function to emit data
function emitData(identifier, data) {
  // Get the callback associated with the identifier
  const callback = dataCallbacks.get(identifier);

  if (callback) {
    // Call the callback with the data
    callback(data);

    // Remove the entry from the Map
    dataCallbacks.delete(identifier);
  }
}

// Function to listen for data
function listenForData(identifier, callback) {
  // Store the identifier and callback in the Map
  dataCallbacks.set(identifier, callback);
}

const queueName = "api-request-queue";

const queueConfig = {
  limiter: {
    max: 100, // Limit to 100 requests per minute
    duration: 120000, // default is 60,000 ms (1 minute) set to 2 mim
  },
  defaultJobOptions: {
    priority: 1, // Set default priority to medium
    attempts: 2, // Max retries
    backoff: {
      type: "exponential", // Exponential backoff
      delay: 1000, // 1 second initial delay
    },
    timeout: 30000, // 30 seconds timeout for each job
    removeOnComplete: true, // Remove completed jobs
    removeOnFail: 3, // Move jobs to DLQ after 5 retries
  },
  settings: {
    lockDuration: 300000, // Lock duration in milliseconds
    maxStalledCount: 5, // Max stalled count before re-queueing
    stalledInterval: 30000, // Check for stalled jobs every 30 seconds
    defaultJobPriority: 1, // Set default job priority to medium
    drainDelay: 5000, // Delay in milliseconds before closing workers during shutdown
    maxCompletedJobs: 1000, // Maximum completed jobs to keep in the queue
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
    const queue = new Queue(queueName, {
      connection: redisClient,
      ...queueConfig,
    });

    const worker = new Worker(queueName, processJob, {
      connection: redisClient,
      concurrency: 2, // Set the desired concurrency level
      serializer: customSerializer,
    });

    worker.on("completed", (job) => {
      console.log(`${job.id} has completed!`);
    });

    worker.on("failed", (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
    });

    worker.on("stalled", (job, err) => {
      console.log(`${job.id} has stalled with ${err.message}`);
    });

    return { queue, worker };
  } catch (e) {
    console.error("Bullmq setup error: ", e);
    throw new Error("Bull MQ setup error: " + e.message);
  }
}

async function processJob(job) {
  testBullMqJobProcessFailure();
  const { shop, url, data, config, documentType, processFunction } = job.data;
  if (!processFunctions[processFunction]) {
    console.error(`No processing function found for type: ${processFunction}`);
    // throw new Error(
    //   `No processing function found for type: ${processFunction}`
    // );
    return {
      error: "no processing function found",
      shop: shop,
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

    console.log("shop---->", shop);
    emitData(shop, processingResult);
  } catch (error) {
    console.error(`Error processing job of type '${processFunction}':`, error);
    throw error;
  }
}
let eq_count = 0;
export async function enqueueApiRequest(promptObject) {
  const { shop, queue } = promptObject;

  const data = { ...promptObject, queue: null };
  eq_count++;

  console.log("eq_count", eq_count);

  try {
    await queue.add(shop, data, {
      attempts: 3, // Max retries for this specific job (overrides default)
      timeout: 120000, // 1 minute timeout for this specific job (overrides default)
      priority: 3, // High priority for this specific job
    });
  } catch (e) {
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
      const { shop } = req.query;
      if (!shop) {
        res.end();

        //  throw new Error('no shop specified in sse')
      }

      const queueEvents = new QueueEvents(queueName, {
        connection: redisClient,
      });

      // Send initial SSE message

      const initialMessage = JSON.stringify({ message: "Connected" });
      res.write(`data: ${initialMessage}\n\n`);

      // Function to send SSE messages to the client
      const sendSSEMessage = (messageData) => {
        const eventData = JSON.stringify(messageData);
        res.write(`data: ${eventData}\n\n`);
      };

      if (!shop) {
        console.log("no shop name");
        res.write("event: close\n");
        res.write("data: Connection closed by the server\n\n");
        res.end();
      }
      listenForData(shop, async (data) => {
        const {
          res: gptStream,
          // shop,
          // openai,
          // api,
          // promptTokenCountEstimate,
        } = data;
        let finish_reason = false;

        if (gptStream && gptStream.data) {
          const dataGenerator = generateOpenAIMessages(data);
          for await (const delta of dataGenerator) {
            // Process each delta of data as it arrives

            // console.log('delta', delta.data.content)
            finish_reason = delta.data.finish_reason ? true : false;

            sendSSEMessage({
              message: "Job stream",
              delta: delta.data,
              totalTokenUsage: delta.totalTokenUsage,
              tokensUsed: delta.tokensUsed,
              storeData: delta.storeData,
            });
          }
        }

        if (!finish_reason) {
          sendSSEMessage({
            message: "Job stream",
            delta: {
              finish_reason: true,
              delta: "",
              content: "",
              tokenUsage: "",
            },
          });
        }
        queueEvents.close();
        res.write("event: close\n");
        res.write("data: Connection closed by the server\n\n");
        res.end();
      });

      // Set up event listeners to send SSE messages to the client
      queueEvents.on("completed", async (job) => {
        // console.log('completed', job);
        // const result = job.returnvalue;
        // if (result.shop === shop) {
        // console.log('result--->', job)
        // if (result.res && result.res.data) {
        //   const dataGenerator = generateOpenAIMessages(result.res);
        //   for await (const delta of dataGenerator) {
        //     // Process each delta of data as it arrives
        //     console.log('delta: ', delta);
        //    // sendSSEMessage({ message: "Job stream", delta:delta.content });
        //   }
        //   } else {
        //     //sendSSEMessage({ message: "Job completed", result });
        //   }
        // }
      });

      queueEvents.on("stalled", async (job) => {
        console.log("stalled: ", job);
        const jobData = await queue.getJob(job.jobId);
        const jobShop = jobData.data.shop;
        const jobProcessFunction = jobData.data.processFunction;
        if (jobShop === shop && jobProcessFunction === "chatGptTurbo") {
          sendSSEMessage({
            message: `Error: Job stalled`,
            result: `${job.id} stalled`,
          });
        }
      });

      queueEvents.on("failed", async (job, err) => {
        console.log("failed: ", job);
        const jobData = await queue.getJob(job.jobId);
        const jobShop = jobData.data.shop;
        const jobProcessFunction = jobData.data.processFunction;
        if (jobShop === shop && jobProcessFunction === "chatGptTurbo") {
          sendSSEMessage({
            message: `Error: Job failed`,
            result: `${job.jobId} failed: ${err.message}`,
          });
        }
      });

      // If the client disconnects, stop sending SSE messages
      req.on("close", () => {
        console.log("Closed connection socket");

        // queueEvents.off("completed");
        // queueEvents.off("stalled");
        // queueEvents.off("failed");
      });
    } catch (err) {
      next(err); // Pass any uncaught errors to the error handling middleware
    }
  });

  const sseErrorHandler = (err, req, res, next) => {
    // Your custom error handling logic for the SSE route
    console.error("Error occurred in SSE:", err);
    res.status(500).json({ error: "Internal Server Error in SSE" });
  };
  app.use("/sse/stream", sseErrorHandler);
}

// Modified generateOpenAIMessages function to accept the res object as a parameter
async function* generateOpenAIMessages({
  res,
  shop,
  documentType,
  openai,
  api,
  promptTokenCountEstimate,
}) {
  let storeData;
  let tokensUsed;
  let totalTokenUsage;
  const responseContentCompleteText = [];
  try {
    // console.log('res inspect===>', inspect(res, {depth:null, colors:true, compact:false}))
    // Access the stream data directly from the response object
    const stream = res.data;

    // Use the 'for await' loop to process the data stream
    for await (const data of stream) {
      const lines = data
        .toString()
        .split("\n")
        .filter((line) => line.trim() !== "");
      for (const line of lines) {
        const message = line.replace(/^data: /, "");

        if (message.includes("[DONE]")) {
          // console.log('res inspect===>', inspect(res.headers, {depth:null, colors:true, compact:false}))

          //https://community.openai.com/t/how-to-get-total-tokens-from-a-stream-of-completioncreaterequests/110700

          const estimateOverheadForStream = 43;
          //console.log('token count nlp', countTokens(responseContentCompleteText))
          const tokenUsage =
            countTokens(responseContentCompleteText.join("")) +
            promptTokenCountEstimate +
            estimateOverheadForStream;
          tokensUsed = tokenUsage;
          // console.log("total tokens used", tokenUsage);
          await updateTokenUsageAfterJob(shop, tokenUsage);
          storeData = await userStore.readJSONFromFileAsync(shop);

          storeData.documentType = documentType;
          storeData.shop = shop;
          storeData.gptText = responseContentCompleteText.join("");
          //  console.log('storeData', storeData);

          storeData.documentType = documentType;
          totalTokenUsage = storeData.current_usage;
          await userStore.writeJSONToFileAsync(shop, storeData);

        }
        try {
          const parsed = JSON.parse(message);

          // console.log('parsed message1===>', JSON.stringify(parsed));
          // console.log('parsed choices===>', parsed.choices);
          // console.log('parsed content===>', parsed.choices[0]);
          // Access the usage tokens from the response data
          if (parsed.choices[0].delta?.content) {
            responseContentCompleteText[responseContentCompleteText.length] =
              parsed.choices[0].delta?.content;
          }

          //countTokens(parsed.choices[0].delta.content);

          // Process the rest of the data as needed
          parsed.choices[0].index;
          yield {
            data: parsed.choices[0].delta,
            totalTokenUsage,
            tokensUsed,
            storeData,
          };
        } catch (error) {
          console.error("Could not JSON parse stream message", message, error);
        }
      }
    }
  } catch (error) {
    // Handle errors
    console.error("An error occurred during OpenAI request", error);
  }
}
