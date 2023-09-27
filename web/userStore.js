import { promises as fs } from "fs";
import path from "path";
import Ajv from "ajv";
import { isValid, parseISO } from "date-fns";
import { mkdtemp } from "fs/promises";
const ajv = new Ajv({ coerceTypes: true });
const currentFilePath = new URL(import.meta.url).pathname;
const currentDir = path.dirname(currentFilePath);
const USERS_FOLDER_PATH = path.resolve(currentDir, "users");
let redis;

export function setRedis(redisIo) {
  redis = redisIo;
}

function getDefaultValueByType(type) {
  switch (type) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    // Add more cases for other types as needed
    default:
      return null; // Default to null for unknown types
  }
}

const userSchema = {
  type: "object",
  properties: {
    // Define your JSON schema here
    // Example:
    capped_usage: { type: "number" },
    shop: { type: "string" },
    gptText: { type: "string" },
    documentType: { type: "string" },
    subscription_name: { type: "string" },
    usage_limit: { type: "number" },
    current_usage: { type: "number" },
    last_payment_date: { type: "string" },
    created_at: { type: "string" },
    updated_at: { type: "string" },
    currency: { type: "string" },
    capped_amount: { type: "number" },
    status: { type: "string" },
    seen: { type: "boolean" },

    // Add more properties as needed
  },
  required: ["shop"], // Specify the required properties
};

const validate = ajv.compile(userSchema);

async function createUsersFolderAsync() {
  try {
    await fs.access(USERS_FOLDER_PATH);
  } catch (err) {
    if (err.code === "ENOENT") {
      const tempDir = await mkdtemp(path.join(currentDir, "temp-"));
      await fs.rename(tempDir, USERS_FOLDER_PATH);
      console.log("Users folder created successfully.");
    } else {
      throw err;
    }
  }
}

async function readJSONFromFileAsync(storeName) {
  try {
    let exists;
    try {
      exists = await redis.exists(storeName);
    } catch (error) {
      console.error(`Error checking if hash '${key}' exists:`, error);
      throw error;
    }
    if (!exists) {
      const defaultData = {};
      Object.entries(userSchema.properties).forEach(([key, value]) => {
        defaultData[key] = getDefaultValueByType(value.type);
      });

      return defaultData;
    }

    const jsonData = await getRedisUserSchema(storeName);

    const jsonMap = Object.entries(jsonData);

    for (const [key, isValid] of jsonMap) {
      const valid = checkDateString(isValid) === "valid date";
      if (valid === "valid date") {
        jsonData[key] = new Date(isValid);
      }
      if (valid === "bad date") {
        jsonData = {};
        return;
      }

      if (isValid === null) {
        jsonData[key] = 0;
      }
    }

    return jsonData;
  } catch (err) {
    console.log("error getting Redis user schema", err);
  }

  const filePath = path.join(USERS_FOLDER_PATH, `${storeName}.json`);
  try {
    const data = await fs.readFile(filePath, "utf8");
    let jsonData;

    try {
      jsonData = JSON.parse(data);
    } catch (err) {
      console.error("parse error: ", err);
      throw err;
    }

    // Convert the last_payment_date string to a Date object
    const jsonMap = Object.entries(jsonData);

    for (const [key, isValid] of jsonMap) {
      const valid = checkDateString(isValid) === "valid date";
      if (valid === "valid date") {
        jsonData[key] = new Date(isValid);
      }
      if (valid === "bad date") {
        jsonData = {};
        return;
      }

      if (isValid === null) {
        jsonData[key] = 0;
      }
    }

    return jsonData;
  } catch (err) {
    if (err.code === "ENOENT") {
      const defaultData = {};
      Object.entries(userSchema.properties).forEach(([key, value]) => {
        defaultData[key] = getDefaultValueByType(value.type);
      });
      return defaultData;
    } else {
      throw err;
    }
  }
}

async function writeJSONToFileAsync(storeName, jsonObject) {
  // Convert the last_payment_date to a string in ISO 8601 format
  if (jsonObject.last_payment_date instanceof Date) {
    jsonObject.last_payment_date = jsonObject.last_payment_date.toISOString();
  }
  // console.log("jsob-->", jsonObject);
  const ajv = new Ajv();
  const valid = ajv.validate(userSchema, jsonObject);

  if (!valid) {
    const validationError = new Error(
      "JSON data does not conform to the schema."
    );
    validationError.errors = ajv.errors;
    throw validationError;
  }

  const filePath = path.join(USERS_FOLDER_PATH, `${storeName}.json`);

  let jsonLocalData;
  let jsRedisData;
  try {
    jsonLocalData = JSON.stringify(jsonObject, null, 2);
    jsRedisData = JSON.parse(jsonLocalData);
  } catch (error) {
    console.error("json stringify failed: ", err);
  }
  try {
    await fs.writeFile(filePath, jsonLocalData);
    // console.log("Data written to the file successfully.");
  } catch (err) {
    throw err;
  }
  try {
    await setUserSchema(storeName, sanitizeObjectForRedis(jsRedisData));
    // console.log("user saved to Redis");
  } catch (err) {
    throw err;
  }
}

// Graceful shutdown function
async function handleGracefulShutdown() {
  console.log("Graceful shutdown initiated...");
  // Perform any cleanup operations here, if necessary
  console.log("Cleanup completed. Exiting the application.");
  process.exit(0); // Exit the process with a success code
}

// Listen for 'SIGINT' and 'SIGTERM' signals
process.on("SIGINT", handleGracefulShutdown);
process.on("SIGTERM", handleGracefulShutdown);

export { createUsersFolderAsync, readJSONFromFileAsync, writeJSONToFileAsync };

function checkDateString(input) {
  if (typeof input !== "string") {
    return "not string";
  }

  const date = new Date(input);

  if (isNaN(date.getTime())) {
    return "not date";
  } else if (isValid(parseISO(input))) {
    // return "Valid date string with valid date";
    return "valid date";
  } else {
    //return "Valid date string with invalid date";
    return "bad date";
  }
}

//

async function setUserSchema(shop, userData) {
  try {
    await redis.hmset(shop, userData);
    console.log(`User schema set for shop: ${shop}`);
  } catch (error) {
    console.error(`Error setting user schema for shop ${shop}:`, error);
    throw error; // Propagate the error up the call stack
  }
}

async function getRedisUserSchema(shop) {
  try {
    const userSchema = await redis.hgetall(shop);
    const isValid = validate(userSchema);

    if (!isValid) {
      console.error("Validation errors:", validate.errors);
    } else {
      console.log("Data is valid");
      // console.log("Processed data:", userSchema); // This is the coerced object
    }
    const user = sanitizeObjectForJS(userSchema);

    return user || {}; // Return an empty object if no data is found
  } catch (err) {
    console.error(`Error getting user schema for shop ${shop}:`, err);
    throw err; // Propagate the error up the call stack
  }
}

export async function getUserFieldFromHashRedis(key, field) {
  try {
    const value = await redis.hget(key, field);
    return value;
  } catch (error) {
    console.error(`Error getting field '${field}' from hash '${key}':`, error);
    throw error; // Propagate the error up the call stack
  }
}

export async function updateRedisUserField(shop, fieldName, data) {
  if (!fieldName || !shop) {
    throw Error("no field name or shop provided for Redis update field");
  }
  data = sanitizeFieldForRedis(data);
  try {
    await redis.hset(shop, fieldName, data);
    console.log(`Field ${fieldName} updated for shop: ${shop}`);
  } catch (err) {
    console.error(`Error updating field ${fieldName} for shop ${shop}:`, err);
    throw err; // Propagate the error up the call stack
  }
}

function sanitizeObjectForRedis(obj) {
  const sanitizedObj = {};

  for (const [key, value] of Object.entries(obj)) {
    // Check for invalid Redis values (null, undefined, empty string)
    if (value === null || value === undefined || value === "" || value === "") {
      sanitizedObj[key] = "__EMPTY_FIELD__"; // Replace with null
    } else {
      sanitizedObj[key] = value; // Keep the original value
    }
  }
  return sanitizedObj;
}

function sanitizeFieldForRedis(data) {
  if (data === null || data === undefined || data === "" || data === "") {
    return "__EMPTY_FIELD__";
  }

  return data;
}

function sanitizeObjectForJS(obj) {
  const sanitizedObj = {};

  for (const [key, value] of Object.entries(obj)) {
    // Check for invalid Redis values (null, undefined, empty string)
    if (value === "__EMPTY_FIELD__") {
      sanitizedObj[key] = ""; // Replace with null
    } else {
      sanitizedObj[key] = value; // Keep the original value
    }
  }

  return sanitizedObj;
}
