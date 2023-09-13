import Redis from "ioredis";
import "dotenv/config";
import { createClient } from "redis";

import { BullREDIS } from "./dev_production_vars.js";
let redisClient;

export async function connectToRedis() {
  const { host, port, password } = BullREDIS;
  return new Promise((resolve, reject) => {
    if (redisClient) {
      resolve(redisClient); // If the client is already connected, resolve immediately
    } else {
      redisClient = new Redis(
        // RedisConnectionString,{ maxRetriesPerRequest: null}
        {
          host,
          port,
          password,
          retryStrategy: (times) => {
            if (times > 5) {
              // Stop retrying after 5 attempts
              return undefined;
            }
            // Retry with an exponential backoff strategy
            return Math.min(times * 50, 2000);
          },
          maxRetriesPerRequest: null, // Set maxRetriesPerRequest to null
        }
      );

      redisClient.on("ready", () => {
        console.log("Redis client is ready to accept commands.");
        resolve(redisClient); // Resolve the promise with the connected client
      });

      redisClient.on("error", (error) => {
        console.error("Error connecting to Redis:", error);
        reject(error); // Reject the promise if there's an error
      });
    }
  });
}

// export async function connectToRedis() {

//   const client = createClient({
//     url: RedisConnectionString,
//   });
//   await client.connect();

//   return client;
// }
