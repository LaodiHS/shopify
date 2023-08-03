import "dotenv/config";
import {readJSONFromFileAsync} from "./userStore.js";



const MockGptTurboResponse = true;
const TestBullMqJobProcessFailure = false;
const TestNonNetWorkErrorOnChatGptTurboFailure = false;



const CheckRequiredProps = true;


// ChatGpt Function Inline Error Triggers



export function checkRequiredProps(obj) {
  // Check if we are in a testing/development environment
  // Or use any other custom flag
  if (CheckRequiredProps) {
    // If not in testing environment, just return without performing the check
    return;
  }

  const functionString = arguments.callee.toString();


  const paramNames =
    functionString
      .slice(functionString.indexOf("(") + 1, functionString.indexOf(")"))
      .match(/([^\s,]+)/g) || [];
  // console.log('paramNames: ' + paramNames)
  // console.log('functionString: ' + functionString)
  const requiredProps = paramNames.slice(1); // Excluding the first parameter, which is obj

  const missingProps = requiredProps.filter((prop) => !(prop in obj));
  if (missingProps.length > 0) {
    const functionName = checkRequiredProps.caller.name || "Unknown function";
    const errorMessage = `Missing required properties '${missingProps.join(
      ", "
    )}' in function '${functionName}'`;
    throw new Error(errorMessage);
  }


}



export function testBullMqJobProcessFailure() {
  if (TestBullMqJobProcessFailure) {
    throw new Error("Job processing failed");
  }
}

export function testNonNetWorkErrorOnChatGptTurboFailure() {
  if (TestNonNetWorkErrorOnChatGptTurboFailure) {
    throw Error("failed to process");
  }
}

export async function mockGptTurboResponse(
  shop,
  prompt,
  url,
  config,
  documentType,
  processFunction
) {
  if (MockGptTurboResponse) {
   
    const storeData = await readJSONFromFileAsync(shop);
    
    await new Promise(resolve => setTimeout(() => {resolve(true)},2000));

    return {
      documentType: documentType,

      [documentType]: storeData.gptText,

      shop,
      processFunction,
    };
  }else{
    return false;
  }
}
