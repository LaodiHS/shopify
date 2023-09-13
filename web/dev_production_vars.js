import "dotenv/config";
import { env } from "./envVars.js";


const { SCOPES, SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_API_URL,REDIS_API_UPSTASH_PASSWORD, REDIS_API_UPSTASH_PASSWORD_TEST_ENV, REDIS_LAB_PRODUCTION, REDIS_LAB_TEST_ENV } = process.env;

export const RedisConnectionString = process.env.NODE_ENV === "production" ? REDIS_API_UPSTASH_PASSWORD :  REDIS_API_UPSTASH_PASSWORD_TEST_ENV;
const REDIS_LAB = process.env.NODE_ENV === "production" ? REDIS_LAB_PRODUCTION : REDIS_LAB_TEST_ENV ;



function parseRedisConnectionString(connectionString) {
    const parts = connectionString.split('://')[1].split('@');
    if (parts.length !== 2) {
      throw new Error('Invalid Redis connection string format');
    }
  
    const [credentials, hostAndPort] = parts;
    const [username, password] = credentials.split(':');
    const [host, port] = hostAndPort.split(':');
    const portNumber = parseInt(port, 10);
  
    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      throw new Error('Invalid port number');
    }
  
    return { username, password, host, port: portNumber };
  }
// console.log('RedisConnectionString', RedisConnectionString)

const BullREDIS = parseRedisConnectionString(REDIS_LAB)


export {BullREDIS}



const isProduction = process.env.NODE_ENV === "production";