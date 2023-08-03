import { Queue, Worker, QueueEvents } from "bullmq";
import shopify from "./shopify.js";

import * as userStore from "./userStore.js";
import { processFunctions } from "./bull-queue-function-dictionary.js";
import { testBullMqJobProcessFailure } from "./testMethods.js";
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
    console.log("processing result: ", processingResult);
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

    return processingResult;
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
      attempts: 1, // Max retries for this specific job (overrides default)
      timeout: 120000, // 1 minute timeout for this specific job (overrides default)
      priority: 3, // High priority for this specific job
    });
  } catch (e) {
    throw e;
  }
}

export function serverSideEvent(app, redisClient, queue) {
  // EventSource route for Server-Sent Events

  const errorHandler = (err, req, res, next) => {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  };

  app.get("/sse/stream", (req, res, next) => {
    try {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");

      const { shop } = req.query;
      console.log("sse/sream--->", shop);
      console.log("res locals", res.locals);
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

      // Set up event listeners to send SSE messages to the client
      queueEvents.on("completed", async (job) => {
        const result = job.returnvalue;
        if (result.shop === shop) {
                             
        console.log('result--->', job)
       
     
          if (true) {
          
            for await (const delta of  generateOpenAIMessages(result.res)) {
         
              const stream = delta.content;
              console.log('stream--->', stream)
              sendSSEMessage({ message: "Job stream",    delta });
            }
          } else {
            sendSSEMessage({ message: "Job completed", result });
          }
        }
      });

      queueEvents.on("stalled", async (job) => {
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
        queueEvents.off("completed");
        queueEvents.off("stalled");
        queueEvents.off("failed");
      });
    } catch (err) {
      next(err); // Pass any uncaught errors to the error handling middleware
    }
  });
  app.use(errorHandler);
}







async function* generateOpenAIMessages(res) {

try{
  for await (const data of res.data) {
    const lines = data.toString().split('\n').filter(line => line.trim() !== '');
    for (const line of lines) {
      const message = line.replace(/^data: /, '');
      if (message === '[DONE]') {
        return; // Stream finished
      }
  
      try {
        //{ index: 0, delta: { content: ' passed' }, finish_reason: null }
        const parsed = JSON.parse(message);
        console.log('parsed message1===>', parsed.choices[0])
        console.log('parsed message2===>', parsed.choices[0].delta.content);
        parsed.choices[0].index
        yield parsed.choices[0].delta;
      } catch (error) {
        console.error('Could not JSON parse stream message', message, error);
      }
    }
  }
  }catch(error){
   console.log('error', error)       
  }
}