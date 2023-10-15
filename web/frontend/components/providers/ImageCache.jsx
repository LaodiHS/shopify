import React, { useEffect, useState} from "react";
import {
  IonImg,
  IonSkeletonText
} from "@ionic/react";
import {
  useDataProvidersContext,
  useProductDataContext,
} from "../../components";
//navigator.hardwareConcurrency || 4; // Number of worker instances in the pool
import { imagePlaceHolder } from "../../assets";
import { productViewCache } from "../../utilities/store";
function getOptimalNumThreads(defaultNumThreads = 3) {
  if (navigator && navigator.hardwareConcurrency) {
    // If hardwareConcurrency is available, use it as the number of threads
    const hardwareThreads = navigator.hardwareConcurrency - 2;
    return hardwareThreads > 0 ? hardwareThreads : defaultNumThreads;
  } else {
    // If hardwareConcurrency is not available, use the default number of threads
    return defaultNumThreads;
  }
}
// Worker code as a string literal
const workerCode = `
self.addEventListener('message', async (event) => {
    const { srcList } = event.data;

    try {
      const cache = await caches.open('image-cache');
      const responses = [];

      for (const src of srcList) {
        try {
          const cachedResponse = await cache.match(src);

          if (cachedResponse) {
            const blob = await cachedResponse.blob();
            responses.push({ src, blob });
          } else {
            const response = await fetch(src);
            await cache.put(src, response.clone());
            const blob = await response.blob();
            responses.push({ src, blob });
          }
        } catch (error) {
          responses.push({ src, error: error.message });
        }
      }

      self.postMessage(responses);
    } catch (error) {
      self.postMessage({ srcList, error: error.message });
    }
  });
`;

function createImageCacheWorker() {
  const workerBlob = new Blob([workerCode], { type: "application/javascript" });
  const worker = new Worker(URL.createObjectURL(workerBlob));
  worker.isProcessing = false; // Initialize worker state
  return worker;
}

let workerPool;
const taskQueue = [];

export function ImageCacheWorker() {
  const { sessionLoaded, indexDb } = useProductDataContext();
  useEffect(() => {
    if (sessionLoaded) {
      workerPool = new Array(getOptimalNumThreads())
        .fill(null)
        .map(createImageCacheWorker);

      return () => {
        workerPool.forEach((worker) => worker.terminate());
      };
    }
  }, [sessionLoaded]);

  return null;
}

function getNextAvailableWorker() {
  return workerPool.find((worker) => !worker.isProcessing) || null; // Find the first available worker
}
function processTaskQueue() {
  const worker = getNextAvailableWorker();
  if (worker && taskQueue.length > 0) {
    const { src, resolve } = taskQueue.shift();
    worker.isProcessing = true;
    worker.postMessage({ srcList: [src] });

    // Handle worker response
    worker.onmessage = (event) => {
      const data = event.data;

      if (Array.isArray(data)) {
        for (const item of data) {
          if (item.blob) {
            resolve(URL.createObjectURL(item.blob));
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

async function setImageMap(key, obj, productViewCaches) {
  if (!key) {
    throw new Error("image requires key");
  }
  if (!obj) {
    throw new Error("image requires blob");
  }
  try {
    await productViewCaches.set(key, obj);
  } catch (error) {
    throw new Error(`Error storing image`, error);
  }
}
export function ImageCache({ src, style, alt, sliderImg, ...props }) {
  const { productViewCaches } = useDataProvidersContext();
  //  console.log('imageCache', imageCache)
  const [cachedSrc, setCachedSrc] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [canLoad, setCanLoad] = useState(true);
  // const loading = false;

  function imageDidLoad() {
    if (imageLoading) {
      setImageLoading(false);
    }
  }
  useEffect(() => {
    return () => {
      setCanLoad(false);
    };
  }, []);

  useEffect(async () => {
    setImageLoading(true);
    const preloadImages = async (src) => {
      if (productViewCache.has(src)) {
        const cachedImage = await productViewCache.get(src);

        setCachedSrc(cachedImage);
        setImageLoading(false);
        return;
      }

      return new Promise((resolve) => {
        taskQueue.push({ src, resolve });
        processTaskQueue();
      }).then(async (imageSrc) => {
        if (imageSrc) {

          await setImageMap(src, imageSrc, productViewCaches);

          if (canLoad) {
            setCachedSrc(imageSrc);
          }

          if (imageLoading) {
            setImageLoading(false);
          }
        }
      });
    };
    src !== imagePlaceHolder
      ? await preloadImages(src)
      : setCachedSrc(imagePlaceHolder);
  }, [src]);

 
  function SkeletonImage() {
    return (
      <IonSkeletonText
        key= {src + "animatedPlace=holder"}
        animated
        style={{ ...style, display: !imageLoading ? "none" : "block" }}
      />
    );
  }

  return (
    <>
      <SkeletonImage />
      <IonImg
        onIonImgDidLoad={imageDidLoad()}
        style={{
          ...style,
          display: imageLoading ? "none" : "block",
        }}
        key={cachedSrc || src || imagePlaceHolder}
        src={cachedSrc || src || imagePlaceHolder}
      
        as="image"
        alt={alt}
        {...props}
      />
    </>
  );
}

export async function ImageCachePre(src) {
  const { productViewCaches } = useDataProvidersContext();
  if (productViewCaches.has(src)) {
    return;
  }
  await new Promise((resolve) => {
    taskQueue.push({ src, resolve });
    processTaskQueue();
  }).then((imageSrc) => {
    if (imageSrc) {
      productViewCaches.set(src, imageSrc);
    }
  });
}
