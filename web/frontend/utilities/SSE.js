// SSEWorker.js

import { throttle } from "lodash";
class WordTokenizer {
  constructor() {
    this.buffer = ''; // Buffer to accumulate characters
  }

  processChunk(chunk) {
    // Concatenate the new chunk with the existing buffer
    this.buffer += chunk;

    // Split the buffer into words
    const words = this.buffer.split(/\s+/);

    // The last element is potentially an incomplete word
    const incompleteWord = words.pop();

    // Update the buffer with the incomplete word
    this.buffer = incompleteWord;

    // Return the complete words
    return words;
  }

  flush() {
    // Return any remaining words in the buffer
    const words = this.buffer.split(/\s+/);
    this.buffer = ''; // Clear the buffer
    return words;
  }
}
class ActivityTimer {
  constructor() {
    // this.resetActivityTimer();
    // this.detectActivity();
    this.onTimeout;
    this.detectedActivity = false;
    this.activityTimer = true;
    this.disabled = true;
  }

  resetActivityTimer() {
    clearTimeout(this.activityTimeoutId);
    clearInterval(this.activityIntervalId);

    if (this.disabled) return;

    this.activityTimeoutId = setTimeout(() => {
      console.log("timeout cleared");

      if (this.disabled) return;
      if (!this.activityTimer) {
        this.onTimeout();
      } else {
        this.activityTimer = false;

        this.resetActivityTimer();
      }
    }, 8000);
  }

  detectActivity() {
    // Simulate activity detection by setting activityTimer to true
    // For example, you might call this when user interacts with the page
    this.detectedActivity = true;
    this.activityTimer = true;

    // Reset the activity timer to start a new period

    this.resetActivityTimer();
  }

  handleTimeout(onTimeout) {
    this.disabled = false;
    this.detectedActivity = false;
    this.activityTimer = true;
    console.log("handle timeout hit");

    this.onTimeout = onTimeout;

    //  this.resetActivityTimer();
    this.detectActivity();
  }

  disableActivityTimer() {
    clearTimeout(this.activityTimeoutId);
    clearInterval(this.activityIntervalId);
    this.activityTimer = true;
    this.disabled = true;
    console.log("Activity timer disabled");
  }

  // Example: Disable the activity timer after a certain condition is met
  disableAfterDelay(delay) {
    if (this.detectedActivity === false) {
      console.log("delay", delay);
      setTimeout(() => {
        this.detectActivity();
      }, delay);
    }
  }
}
let dataStreamArray = [];
let sections = [""];
let j = 0;
let k = 0;
const markers = {};
let insideDoubleBrackets = 0;

function replaceDoubleBrackets(packets) {
  const words = packets.join("");

  // console.log('words',words)

  for (; j < words.length - 1; j++) {
if(words[j+1]=== undefined){
  break;
}

    while (words[j] === "(" && words[j+1] !== undefined) {
      if (words[j + 1] !== "(" && sections[k] !== "(") {
        sections[++k] = words[j];
      }

      insideDoubleBrackets++;
      j++;
    }

    while (words[j] === ")" && words[j+1] !== undefined) {
      if (words[j + 1] !== ")" && sections[k] !== ")") {
        sections[++k] = words[j];
      }

      insideDoubleBrackets--;
      j++;
    }

    if (insideDoubleBrackets > 0) {
      sections[++k] = words[j];
    }

    if (insideDoubleBrackets === 0) {
      let section = words[j];

      while (
        j + 1 < words.length &&
        words[j + 1] !== "(" &&
        words[j + 1] !== ")"
      ) {
        section += words[j + 1];

        j++;
      }

      sections[++k] = section;
    }
  }

  return sections;
}

let currentElement = "";
let openBrackets = 0;
let i = 0;
const result = [];
function processIncompleteDataWithBrackets() {
  replaceDoubleBrackets(dataStreamArray);

  for (; i < sections.length; i++) {
    const letter = sections[i];

    switch (letter) {
      case "(":
        openBrackets++;
        currentElement += openBrackets === 1 ? letter : "";
        break;
      case ")":
        openBrackets--;
        currentElement += openBrackets === 0 ? letter : "";
        break;
      default:
        currentElement += letter;
        break;
    }
  }
  // console.log('sections: ', sections)

  // console.log('openBrackets: ',openBrackets, 'currentElement: ', currentElement)
  openBrackets === 0 &&
    ((result[result.length] = currentElement), (currentElement = ""));
  return result;
}

function throttleSetRefArray({ parsed }) {
  throttle(
    ({ parsed }) => {
      try {
        // console.log("result:::", result);
        const parsedContent = dataStreamArray
        // processIncompleteDataWithBrackets();

        const sentenceElements = parseText({
          text: parsedContent.join(""), //.replace(/#([0-9A-Fa-f]{1,5})(?![0-9A-Fa-f])/g, ""),
          
        });
        // console.log('sentences:', sentences)

        self.postMessage({
          type: "stream",
          stream: true,
          eventData: { ...parsed, parsedContent, sentenceElements },
        });
      } catch (error) {
        console.error("Error in throttleSetRefArray:", error);
      }
    },
    90,
    {
      // leading: true,
      trailing: true,
    }
  )({ parsed }); // Adjust the debounce delay as needed
}
let parts = [];
let processedSentences = {};
let processedImages = {};
let mappedLegend;
let mappedObject;
let selectedImageMapPureKeys;
let imagePlaceHolder;

class SSEHandler {
  constructor() {
    this.eventSource = null;
// let wordTokenizer = new wordTokenizer();
    this.buffer = [];
    this.activityTimer = new ActivityTimer(this.handleTimeout);
  }

  startStream({ shop, locals, sessionToken, imagePlaceHolder }) {
    try {
      console.log("new stream started:::");
      this.eventSource = new EventSource(
        `/sse/stream?shop=${shop}&locals=${encodeURIComponent(locals)}`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      this.eventSource.onopen = (event) => {
        if (shop) {
          console.log("opening SSE ", shop);
          self.postMessage({ type: "open", setLoading: true });
   
          //  this.activityTimer.disableAfterDelay(9000);

          console.log("Connection opened", JSON.stringify(event));
        }
      };
       function handelTimeout() {
            self.postMessage({
              type: "error",
              error: "A Time Error Occurred,",
            });
          }

       
      this.eventSource.onmessage = (event) => {
        try {
          // console.log("event", event.data);

          // console.log("Message received", JSON.stringify(buffer));
          let parsed;
          let finish_reason;
          try {
            parsed = JSON.parse(event.data);
            console.log('type:::::   ',parsed)
            const content = Boolean(parsed?.delta) && parsed?.delta?.content;
            finish_reason = Boolean(parsed.delta) && Boolean(parsed.delta.finish_reason)  && parsed.delta.finish_reason
            if (content) {
              dataStreamArray[dataStreamArray.length] = content;
            }
     
          } catch (e) {
            console.log("error parsing sse stream:::: ",'parsed::', parsed, '   message:::', e.message);
            parsed = {};
          }
          this.activityTimer.detectActivity();

          switch (parsed.type) {
            case "connect":
              console.log("connection open", JSON.stringify(event));
              this.activityTimer.handleTimeout(handelTimeout);
              // self.postMessage({ type: "open" });
              break;
            case "stream":
              try {
                // console.log('event data', parsed )
                // console.log('finish_reason', finish_reason);

                switch (finish_reason) {
                  case false:
                    // console.log('data processed::')
                    throttleSetRefArray({
                      parsed,
                    });
                    break;

                  default:
                  
                    const storeData = parsed.storeData || {};
                    dataStreamArray[dataStreamArray.length] = "\u0003"
                    throttleSetRefArray({
                 
                      parsed,
               
                    });

                    setTimeout(() => {
                      self.postMessage({
                        type: "close",
                        setLoading: false,
                        storeData,
                        finish_reason:
                          parsed.delta.finish_reason ||
                          parsed.delta["finish reason"],
                        completeText: dataStreamArray.join(""),
                        mappedLegend,mappedObject
                      });
               
                    }, 10);

                     console.log("finish reason close SSE",  parsed.delta.finish_reason);
                    break;
                }
              } catch (e) {
                console.log(" stream error occurred:", e);
              }
              break;
            case "close":
              console.log("closing stream from server:", JSON.stringify(event));
              this.stopStream();
              console.log("disable activity timer");
              this.activityTimer.disableActivityTimer();
              break;

            default:
              console.log(
                "did not capture event:",
                JSON.stringify(event),
                Object.keys(event.data),
                Object.values(event.data)
              );
              break;
          }
        } catch (error) {
          console.log("parse error: ", JSON.stringify(error));
        }
      };

      this.eventSource.onerror = (error) => {
        console.log("SSE Error: ", JSON.stringify(error), Object.values(error));
      };
    } catch (error) {
      console.log("EventSource error:", error);
    }
  }

  stopStream() {
    if (this.eventSource) {
      console.log("main stream closed");

      this.eventSource.close();
      this.eventSource = null;
      dataStreamArray = [];

      sections = [""];
      j = 0;
      k = 0;
      insideDoubleBrackets = 0;
      currentElement = "";
      openBrackets = 0;
      i = 0;
      result.length = 0;
      parts.length = 0;
      processedSentences = {};
      processedImages = {};
      mappedLegend = null;
      mappedObject = null;
    }
  }
}

// Usage:
const sseHandler = new SSEHandler();

onmessage = (event) => {
  const { shop, locals, sessionToken, action } = event.data;
  if (action === "start") {
    console.log(
      "start::",
      shop,
      locals,
      sessionToken,
      action,
      imagePlaceHolder
    );
    sseHandler.startStream({ shop, locals, sessionToken, imagePlaceHolder });
  } else if (action === "stop") {
    sseHandler.stopStream();
  } else if (action === "update") {
    // const {mappedLegend, selectedImageMapPureKeys} = event.data;
    console.log(
      "updated mapped legend: ",
      mappedLegend,
      selectedImageMapPureKeys
    );
    mappedLegend = event.data.mappedLegend;
    mappedObject = event.data.mappedObject;
    console.log('mappedObject: ', mappedObject)
    selectedImageMapPureKeys = event.data.selectedImageMapPureKeys;
    imagePlaceHolder = event.data.imagePlaceHolder;
  }
};

function parseText({
  text,
  variableListItemHeight = 95,

}) {
  const idWithBracketsRegex =
    /\(([^)]+)\s*-\s*#([0-9A-Fa-f]{6})\)|\{([^}]+)\s*-\s*#([0-9A-Fa-f]{6})\}|\[([^\]]+)\s*-\s*#([0-9A-Fa-f]{6})\]|#([0-9A-Fa-f]{6})|(\([^\)]+\s*-\s*#([0-9A-Fa-f]{6})\))/g;
  let i = 0;
  text = text.replace(/(?:\r\n|\r|\n)/g, "");
  const sentences = text.split(/([.!?]\s)/);
 // console.log("text", text);
  for (let index = 0; index < sentences.length; index++) {
    let sentence = sentences[index];

    if ([". ", "! ", "? ", ".\n"].includes(sentence)) {
      continue;
    }

    const punctuation = [". ", "! ", "? "].includes(sentences[index + 1])
      ? sentences[index + 1]
      : "";

    if (punctuation) {
      sentence = sentence.trimEnd() + punctuation;
    }

    const sentenceHash = `${sentence}-${index}`;

    const cleanedSentence = sentence;
    //.replace(/[.!?]$/, "").trim();
    let lastIndex = 0;
    let match;
    while ((match = idWithBracketsRegex.exec(cleanedSentence)) !== null) {
      const [
        ,
        roundLabel,
        roundId,
        curlyLabel,
        curlyId,
        squareLabel,
        squareId,
        id,
      ] = match;

      const labelRaw = roundLabel || curlyLabel || squareLabel || "";
      const idValue = roundId || curlyId || squareId || id;
      const label = labelRaw.replace(/#/g, "").trim();

      if (match.index > lastIndex) {
     //   const mainString = cleanedSentence.slice(lastIndex, match.index).replace(/[()]/g,'');
        // parts[i++] = {
        //   function: "wrapSubstringInPTags",
        //   mappedLegend,
        //   mainString,
        //   size: variableListItemHeight,
        //   sentenceEnd: "",
        // };
      }
if(mappedObject[`#${idValue}`]){
      const ImageSrc = mappedObject[`#${idValue}`]?.url || imagePlaceHolder;

      const markerSize = mappedObject[`#${idValue}`].height

      const markerType = mappedObject[`#${idValue}`].type 
     

      const key = mappedObject[`#${idValue}`]?.name || "KeyError";

      const hashImageElement = `${label}-${markerSize}-${idValue}-${index}-${i}`;

      parts[i++] = processedImages[hashImageElement]
        ? processedImages[hashImageElement]
        : (processedImages[hashImageElement] = {
            function: "variant",
            tag: "Marker",
            ImageSrc,
            label: key,
            markerType,
            size: markerSize,
            type: markerType,
            color: idValue ? `#${idValue}` : "#FFFFFF",
          });
        }
      lastIndex = idWithBracketsRegex.lastIndex;
    }

    // if (cleanedSentence.length && lastIndex < cleanedSentence.length) {
      const lastSentence = cleanedSentence.slice(
        //lastIndex
        )
         .replace(/\(+/g,'(').replace(/\)+/g,')').replace(/\([^)]*\)/g,'').replace(/#([0-9A-Fa-f]{1,5})(?![0-9A-Fa-f])/g, "").replace(/#([0-9A-Fa-f]{1,6})/g, "");
      parts[i++] = {
        function: "wrapSubstringInPTags",
        mappedLegend,
        mainString: lastSentence,
        size: variableListItemHeight,
        sentenceEnd: "",
        //punctuation.slice(),
      };
    // }
  }
  // console.log("parts: ", parts);
  return parts;
}
