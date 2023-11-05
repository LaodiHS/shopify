import MyWorker from "../../utilities/imageWorker?worker";
import React, { useEffect, useState, useContext, createContext } from "react";
import { IonImg, IonSkeletonText } from "@ionic/react";
import { useDataProvidersContext } from "../../components";
//navigator.hardwareConcurrency || 4; // Number of worker instances in the pool

function getOptimalNumThreads(defaultNumThreads = 10) {
  let optimalThreads =
    typeof defaultNumThreads !== "number" ||
    defaultNumThreads <= 2 ||
    !Number.isInteger(defaultNumThreads)
      ? 3
      : defaultNumThreads;

  if (
    navigator &&
    navigator.hardwareConcurrency &&
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency > 2
  ) {
    // If hardwareConcurrency is available and reasonable, use it as the number of threads.
    optimalThreads = Math.min(
      optimalThreads,
      navigator.hardwareConcurrency - 2
    );
  }

  return Math.max(optimalThreads, 1); // Ensure at least 1 thread.
}
const threadId = 1;
function createImageCacheWorker() {
  try {
    const worker = new MyWorker({ type: "module" });
    worker.isProcessing = false; // Initialize worker state
    return worker;
  } catch (error) {
    console.log("create worker error: ", error);
    throw new Error("create worker error", error);
  }
}

let workerPool;
const taskQueue = [];

const CreateWorkers = createContext(null);

export const useWorkersContext = () => {
  return useContext(CreateWorkers);
};

export { CreateWorkers };

export function Workers({ children }) {
  const [workersLoaded, setWorkersLoaded] = useState(false);

  let loadedWorkersCount = 0;

  const checkAllWorkersLoaded = (optimalWorkersCount) => {
    loadedWorkersCount++;
    // console.log('loaded workers: ',  loadedWorkersCount, ' total workers: ', optimalWorkersCount);
    if (loadedWorkersCount === optimalWorkersCount) {
      console.log("all workers loaded");
      setWorkersLoaded(true);
    }
  };

  useEffect(() => {
    try {
      const optimalWorkersCount = getOptimalNumThreads();

      workerPool = new Array(optimalWorkersCount).fill(null).map((_, index) => {
        try {
          const worker = createImageCacheWorker();
          // Listen for 'message' event to determine when the worker has loaded
          worker.postMessage({ id: index + 1 });

          worker.onmessage = (event) => {
            if (event.data.loaded) {
              console.log("loaded :", event.data.id);
              checkAllWorkersLoaded(optimalWorkersCount);
            }
          };
          return worker;
        } catch (error) {
          console.error("error creating worker :", error);
        }
      });
    } catch (error) {
      setWorkersLoaded(false);
      throw new Error("creating working pool error", error);
    }
    return () => {
      try {
        workerPool.forEach((worker) => worker.terminate());
      } catch (error) {
        throw new Error("error terminating worker pool", error);
      }
    };
  }, []);

  const values = {
    workersLoaded,
  };

  return (
    <CreateWorkers.Provider value={values}>{children}</CreateWorkers.Provider>
  );
}

function getNextAvailableWorker() {
  return workerPool.find((worker) => !worker.isProcessing) || null; // Find the first available worker
}
function processTaskQueue() {
  const worker = getNextAvailableWorker();
  if (worker && taskQueue.length > 0) {
    const { elementObject, resolve } = taskQueue.shift();

    worker.isProcessing = true;

    worker.postMessage({ srcList: [elementObject] });

    // Handle worker response
    worker.onmessage = (event) => {
      const data = event.data;

      if (Array.isArray(data)) {
        for (const item of data) {
          if (item.blob) {
            resolve(item.blob);
            worker.isProcessing = false;
            processTaskQueue(); // Process the next task in the queue
            return;
          }
        }
      } else {
        console.error(`Error loading image: ${data.error}`);
        resolve(null);
        worker.isProcessing = false;
        processTaskQueue(); // Process the next task in the queue
      }
    };
  }
}
async function convertDataUrlToBlobUrl(rawData) {
  return URL.createObjectURL(await fetch(rawData).then((res) => res.blob()));
}
// async function setImageMap(urlKey, imageBlobUrl, productViewCache) {
//   if (!urlKey) {
//     throw new Error("image requires key");
//   }
//   if (!imageBlobUrl) {
//     throw new Error("image requires blob");
//   }
//   try {
//     await productViewCache.set(urlKey, imageBlobUrl);
//   } catch (error) {
//     throw new Error(`Error storing image`, error);
//   }
// }
export function ImageCache({ src, style, alt, sliderImg, ...props }) {
  const { productViewCache, allAssets } = useDataProvidersContext();
  const [cachedSrc, setCachedSrc] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [canLoad, setCanLoad] = useState(true);

  function imageDidLoad() {
    if (imageLoading) {
      setImageLoading(false);
    }
  }
  useEffect(() => {
    return () => {
      setImageLoading(false);
      setCanLoad(false);
    };
  }, []);

  useEffect( () => {
    setImageLoading(true);
    const preloadImages = async (src) => {
      if (await productViewCache.has(src)) {
        const cachedImageBlob = await productViewCache.get(src);
        const cachedBlobUrl = await convertDataUrlToBlobUrl(cachedImageBlob);
        setCachedSrc(cachedBlobUrl);
        setImageLoading(false);
        return;
      }
      return await new Promise((resolve) => {
        taskQueue.push({
          elementObject: { src, memType: "image/png" },
          resolve,
        });
        processTaskQueue();
      }).then(async (blob) => {
        if (!(blob && canLoad)) {
          return;
        }
        const blobUrl = await convertDataUrlToBlobUrl(blob);
        setCachedSrc(blobUrl);
        setImageLoading(false);
      });
    };
    const checkAsset = async () => {
      if (src === allAssets.imagePlaceHolder) {
        setCachedSrc(allAssets.imagePlaceHolder), setImageLoading(false);
      } else {
        await preloadImages(src);
      }
    };
    checkAsset();
  }, [src]);

  return (
    <>
      {imageLoading ? (
        <IonSkeletonText
          key={`${src}animatedPlace=holder`}
          animated
          style={{ ...style, display: "block" }}
        />
      ) : (
        <IonImg
          // onIonImgDidLoad={imageDidLoad()}
          style={{
            ...style,
            display: "block",
          }}
          key={src}
          src={cachedSrc}
          as="image"
          alt={alt}
          {...props}
        />
      )}
    </>
  );
}

export async function ImageCachePre(productViewCache, src, memType) {
  if (!productViewCache || !src || !memType) {
    throw new Error("missing productViewCache src cache or memType");
  }
  // const { productViewCache } = useDataProvidersContext();
  if (await productViewCache.has(src)) {
    const cachedBlob = await productViewCache.get(src);
    return await convertDataUrlToBlobUrl(cachedBlob);
  }
  return await new Promise((resolve) => {
    taskQueue.push({ elementObject: { src, memType }, resolve });
    processTaskQueue();
  }).then(async (imageBlob) => {
    if (imageBlob) {
      await productViewCache.set(src, imageBlob);
      return await convertDataUrlToBlobUrl(imageBlob);
    }
  });
}

export async function ImageCacheSrc(productViewCache, src, memType) {
  if (!productViewCache || !src || !memType) {
    throw new Error("missing productViewCache src cache or memType");
  }
  // const { productViewCache } = useDataProvidersContext();
  if (await productViewCache.has(src)) {
    const cachedBlob = await productViewCache.get(src);
    const blobUrl = await convertDataUrlToBlobUrl(cachedBlob);
    return blobUrl;
  }
  return await new Promise((resolve) => {
    taskQueue.push({ elementObject: { src, memType }, resolve });
    processTaskQueue();
  }).then(async (imageBlob) => {
    if (imageBlob) {
      const cachedBlob = await productViewCache.set(src, imageBlob);
      return await convertDataUrlToBlobUrl(cachedBlob);
    }
  });
}
