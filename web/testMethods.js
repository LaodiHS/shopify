import "dotenv/config";
import {readJSONFromFileAsync} from "./userStore.js";
import {Readable, pipeline} from "stream"


const MockGptTurboResponse = true;
let MockGptTurboPrompt=  false

const TestBullMqJobProcessFailure = false;
const TestNonNetWorkErrorOnChatGptTurboFailure = false;




const CheckRequiredProps = true;
export const max_tokens = 750; 

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
      "Introducing the CONVERSE | CHUCK TAYLOR ALL STAR II HI – the perfect footwear choice for men who seek both style and comfort. With its sleek design and innovative features, these shoes are sure to become a staple in every man's wardrobe.\n\n(value proposition - #d0fbfa)\n\nImagine stepping into a pair of shoes that not only make you look good, but also make you feel good. That's exactly what the CHUCK TAYLOR ALL STAR II HI offers. Designed by CONVERSE, a brand known for its quality and craftsmanship (#CONVERSE - #dfe4f9), these shoes are built to last and provide the utmost comfort throughout the day.\n\n(compassionate - #f2e9d2)\n\nBut what sets these shoes apart from the rest? Well, let me tell you. The CHUCK TAYLOR ALL STAR II HI is equipped with a premium cushioning system that ensures maximum support and shock absorption. Whether you're running errands or going on a long walk, these shoes will keep your feet feeling fresh and energized.\n\n(alliteration - #f5c4e5)\n\nAnd let's not forget about the stylish details. The black color option adds a touch of sophistication to any outfit, making it versatile for any occasion (#black - #c2c9ef). Whether you're wearing jeans and a t-shirt or dressing up for a night out, these shoes will complement your style effortlessly.\n\n(rhetorical question - #dae8d3)\n\nNow, let's talk about the variants available. For those who prefer the size 7, we have the \"7 / black\" option in stock. With a price of $140.00 (#price 140.00 - #eed5d8) and a quantity of 19 pairs left (#quantity 19 - #fadcee), now is the perfect time to get your hands on these amazing shoes.\n\n(polysyndeton - #dae9e8)\n\nBut wait, there's more! We also have the \"4 / black\" option available. With the same price of $140.00 (#price 140.00 - #e3f2f6) and a quantity of 10y".split(" ").map(item=> ' '+ item + " "),
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


