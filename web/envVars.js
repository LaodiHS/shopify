import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

// Get the URL of the current module
const currentModuleUrl = import.meta.url;

// Convert the URL to a file path
const currentModulePath = fileURLToPath(currentModuleUrl);

// Get the parent directory's path
const parentDirPath = dirname(currentModulePath);

// Construct the path to the parent directory's .env file
const parentEnvPath = resolve(parentDirPath, '../.env');

// Load the .env file
dotenv.config({ path: parentEnvPath });

// Now you can access your environment variables using process.env

const {env} = process;
export {env}