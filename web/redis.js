import Redis from "ioredis";
import 'dotenv/config'
const { REDIS_API_PASSWORD} = process.env;

let redisClient;


export async function connectToRedis() {
  return new Promise((resolve, reject) => {
    if (redisClient) {
      resolve(redisClient); // If the client is already connected, resolve immediately
    } else {
      redisClient = new Redis({
        host: "redis-12960.c60.us-west-1-2.ec2.cloud.redislabs.com",
        port: 12960,
        password: REDIS_API_PASSWORD,
        retryStrategy: (times) => {
          if (times > 5) {
            // Stop retrying after 5 attempts
            return undefined;
          }
          // Retry with an exponential backoff strategy
          return Math.min(times * 50, 2000);
        },
        maxRetriesPerRequest: null, // Set maxRetriesPerRequest to null
      });

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


