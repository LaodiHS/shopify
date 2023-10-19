//const modules = import.meta.glob('./utilities/store.js')
import { indexDb } from "./IndexDB";
import { productViewCache } from "../utilities/store";
import { start } from "@shopify/app-bridge/actions/Loading";
//this.productViewCache;
//importScripts('./store.js');
let workerStarted = false;
async function startWorker() {
  if (workerStarted) return;
  if (!indexDb.db) {
    await indexDb.startIndexDB();
  }
  if (!indexDb.db) {
    throw new Error("Database not started", indexDb.db);
  }

  const reader = new FileReader();

  async function readRawData(blob, memType) {
    return await new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = async function () {
        const raw = reader.result;
        resolve(raw);
      };
      try {
        reader.readAsDataURL(new Blob([blob], { type: memType }));
      } catch (error) {
        reject(error);
      }
    });
  }
  async function convertDataUrlToBlobUrl(dataUrl) {
    return URL.createObjectURL(await fetch(dataUrl).then((res) => res.blob()));
  }

  async function sendToFileReaderAndStore(src, blob, memType) {
    if (!src) {
      throw new Error("InValid src");
    }
    if (!memType) {
      throw new Error("InValid memType", memType);
    }

    const raw = await readRawData(blob, memType);
    if (!raw) {
      throw new Error("no raw data in worker", raw);
    }
    await productViewCache.set(src, raw);

    return raw;
    // const backtoUrl = await convertDataUrlToBlobUrl(raw)
    // console.log('backtoUrl ', backtoUrl);
  }

  try {
    self.addEventListener("message", async (event) => {
      const { srcList } = event.data;
     
      try {
        const cache = await caches.open("image-cache");
        const responses = [];
        // console.log("getting worker event data");
        //  console.log('srcList:  ', srcList)
        if (srcList.length <= 0) {
          throw new Error("srcList must not be empty", srcList);
        }
        for (const elementObject of srcList) {
          const { src, memType } = elementObject;
          try {
            const cachedResponse = await cache.match(src);

            if (cachedResponse) {
              const blob = await cachedResponse.blob();
              const rawData = await sendToFileReaderAndStore(
                src,
                blob,
                memType
              );

              responses.push({ src, blob: rawData });
            } else {
              const response = await fetch(src);
              await cache.put(src, response.clone());
              const blob = await response.blob();
              const raw = await sendToFileReaderAndStore(src, blob, memType);
              responses.push({ src, blob: raw });
              // await productViewCache.set(src, blob);
            }
          } catch (error) {
            responses.push({ src, error: error.message });
          }
        }

        self.postMessage(responses);
      } catch (error) {
        console.log("error", error);
        self.postMessage({ srcList, error: error.message });
      }
    });
  } catch (error) {
    console.log("worker error: ", error);
  }
  workerStarted = true;
}

self.addEventListener("message", async (event) => {
  if (event.data.id) {
    // console.log('event.data.id', event.data.id);
    await startWorker();
    self.postMessage({ id: event.data.id, loaded: true });
    console.log("image worker started:", event.data.id);
    // Remove the event listener after it has been triggered once
  }
});

//startWorker()
