import "dotenv/config";
import {readJSONFromFileAsync} from "./userStore.js";
import {Readable, pipeline} from "stream"


const MockGptTurboResponse = true;
export const max_tokens = 750; 
let MockGptTurboPrompt=  false

const TestBullMqJobProcessFailure = false;
const TestNonNetWorkErrorOnChatGptTurboFailure = false;




const CheckRequiredProps = true;


// ChatGpt Function Inline Error Triggers
if(MockGptTurboPrompt){
  MockGptTurboPrompt =  "Use only 20 word for the text of the story."
}

export {MockGptTurboPrompt};



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
 {shop,
  prompt,
  url,
  config,
  documentType,
  api,
  promptTokenCountEstimate,
  processFunction}
) {
  if (MockGptTurboResponse) {
   
    const storeData = await readJSONFromFileAsync(shop);
    
    await new Promise(resolve => setTimeout(() => {resolve(true)},100));

    

    const sampleTexts = [
      "Introducing the NIKE | SWOOSH PRO FLAT PEAK CAP, the perfect accessory for those who want to add a touch of style and sophistication to their everyday look. Made with high-quality materials and designed with efficiency in mind, this cap is a must-have for any fashion-forward individual. \n\nImagine yourself strolling down the street, wearing the NIKE | SWOOSH PRO FLAT PEAK CAP. The sun is shining, and you feel confident and cool as you sport this trendy cap. With its sleek design and customizable fit, it's like having a personal stylist on your head. (sophisticated_jpg - #facbfb)\n\nThis cap is not just any ordinary cap; it's a statement piece that showcases your unique style. With its flat peak and the iconic NIKE swoosh logo, it's a symbol of your individuality and love for the brand. (efficient_1_jpg - #d3c7eb)\n\nBut it's not just about style; it's about functionality too. The NIKE | SWOOSH PRO FLAT PEAK CAP is designed to provide maximum comfort and protection. Made with high-quality materials, it ensures durability and long-lasting wear. (high-quality_0_jpg - #d2e7dd)\n\nWhat sets this cap apart from the rest is its customizable fit. With an adjustable strap at the back, you can easily find the perfect fit for your head. Whether you prefer a snug or loose fit, this cap has got you covered. (customizable_3_jpg - #efd1f0)\n\nThe NIKE | SWOOSH PRO FLAT PEAK CAP comes in a classic white color, perfect for any outfit and occasion. Whether you're heading to the gym or meeting up with friends, this cap will effortlessly elevate your look. (white - #f2edf4)\n\nSo why wait? Step up your cap game with the NIKE | SWOOSH PRO FLAT PEAK CAP. It's not just a cap; it's a fashion statement, an egnition-sample-data of style and functionality. Embrace your inner fashionista and let your cap do the talking. (cap - #eafdc8) (egnition-sample-data - #e3caed) (nike - #efe3ed)\n\nIn a world where fashion is constantly evolving, the NIKE | SWOOSH PRO FLAT PEAK CAP is a timeless piece that will never go out of style. Don't miss out on this opportunity to own a piece of fashion history. Get yours today and join the NIKE revolution. (chiasmus - #f1f8e4) (hyperbole - #fcd3fb) (metaphor - #efd7ce) (simile - #c8e1fb)\n\nStatistics show that those who wear the NIKE | SWOOSH PRO FLAT PEAK CAP are 50% more likely to receive compliments on their style. So why not be part of the trend and turn heads wherever you go? Upgrade your wardrobe with this must-have accessory and let your fashion sense shine. (statistics - #f3eaeb)\n\nGet ready to take your style to new heights with the NIKE | SWOOSH PRO FLAT PEAK CAP. It's time to make a statement and show the world your unique sense of fashion. Don't miss out on this opportunity to elevate your look and join the NIKE family. Order yours today and step into a world of style and sophistication. (NIKE - #fce5fd) (casual - #f8d9d7) (storytelling - #f4eae9)".split(" ").map(item=> ' '+ item + " "),
      " as they become available, creating a chat-like experience. In this blog, we will explore how to configure and implement streaming in OpenAI's chat completions API. We will also look at how to consume these streams using Node.js, highlighting the differences between OpenAI's streaming API and standard SSE.".split(" ").map(item=> ' '+ item + " "),
      "Streaming is a technique that allows data to be sent and received incrementally, without waiting for the entire data to be ready. This can improve performance and user experience, especially for large or dynamic data. [DONE]".split(" ").map(item=> ' '+ item + " "),
    ].flat(Infinity);
    
    const responseStream = createChatGptTurboResponse(sampleTexts);
   
    
    return {
      res:{data: responseStream},
      documentType: documentType,
      [documentType]: storeData.gptText,
    ...arguments[0]
    };
  }else{
    return false;
  }
}




function createChatGptTurboResponse(texts) {
  let currentIndex = 0;

  return new Readable({
    async read() {
      if (currentIndex >= texts.length) {
        // When there's no more data, push null to signal the end of the stream
        this.push(null);
        return;
      }

      // Simulate some delay before sending the next message
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Create a message similar to what you'd get from chatgptturbo
      const message = JSON.stringify({
        choices: [
          {
            index: currentIndex,
            delta: { content: texts[currentIndex++] , finish_reason: currentIndex < texts.length ? null : "end"},
           
            usage: {
              total_tokens: texts[currentIndex - 1].split(" ").length,
            },
          },
        ],
      });

      // Push the message to the stream
      this.push(`data: ${message}\n\n`);
    },
  });
}


