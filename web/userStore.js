import { promises as fs } from 'fs';
import path from 'path';
import Ajv from 'ajv';
import { mkdtemp } from 'fs/promises';

const currentFilePath = new URL(import.meta.url).pathname;
const currentDir = path.dirname(currentFilePath);
const USERS_FOLDER_PATH = path.resolve(currentDir, 'users');

function getDefaultValueByType(type) {
  switch (type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    // Add more cases for other types as needed
    default:
      return null; // Default to null for unknown types
  }
}


const userSchema = {
  type: 'object',
  properties: {
    // Define your JSON schema here
    // Example: 
    shop: { type: 'string' },

    gptText: { type: 'string' },
    documentType:{ type: 'string' },
    subscription_name:{ type:'string'},
    usage_limit: { type: 'number' },
    current_usage:{type: 'number'},
    last_payment_date:{type:'string'}
    // Add more properties as needed
  },
  required: ['shop'], // Specify the required properties
};

async function createUsersFolderAsync() {
  try {
    await fs.access(USERS_FOLDER_PATH);
 
  } catch (err) {
    if (err.code === 'ENOENT') {
      const tempDir = await mkdtemp(path.join(currentDir, 'temp-'));
      await fs.rename(tempDir, USERS_FOLDER_PATH);
      console.log('Users folder created successfully.');
    } else {
      throw err;
    }
  }
}

async function readJSONFromFileAsync(storeName) {
  const filePath = path.join(USERS_FOLDER_PATH, `${storeName}.json`);

  try {
    const data = await fs.readFile(filePath, 'utf8');
    
    const jsonData = JSON.parse(data);



  // Convert the last_payment_date string to a Date object
  if (jsonData.last_payment_date) {
    jsonData.last_payment_date = new Date(jsonData.last_payment_date);
  }

  return jsonData;

  } catch (err) {
    if (err.code === 'ENOENT') {
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
 
 
 
 
  console.log('jsonObject', jsonObject);
  const ajv = new Ajv();
  const valid = ajv.validate(userSchema, jsonObject);

  if (!valid) {
    const validationError = new Error('JSON data does not conform to the schema.');
    validationError.errors = ajv.errors;
    throw validationError;
  }

  const filePath = path.join(USERS_FOLDER_PATH, `${storeName}.json`);
  const jsonData = JSON.stringify(jsonObject, null, 2);

  try {
    await fs.writeFile(filePath, jsonData);
    console.log('Data written to the file successfully.');
  } catch (err) {
    throw err;
  }
}

// Graceful shutdown function
async function handleGracefulShutdown() {
  console.log('Graceful shutdown initiated...');
  // Perform any cleanup operations here, if necessary
  console.log('Cleanup completed. Exiting the application.');
  process.exit(0); // Exit the process with a success code
}

// Listen for 'SIGINT' and 'SIGTERM' signals
process.on('SIGINT', handleGracefulShutdown);
process.on('SIGTERM', handleGracefulShutdown);

export {
  createUsersFolderAsync,
  readJSONFromFileAsync,
  writeJSONToFileAsync
};
