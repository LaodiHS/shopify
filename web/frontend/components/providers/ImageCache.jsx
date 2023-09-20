import React, { useEffect, useState, useMemo } from "react";
import {
  IonImg,
  IonSkeletonText,
  IonGrid,
  IonCol,
  IonRow,
  IonThumbnail,
} from "@ionic/react";
import { useDataProvidersContext } from "../../components";
//navigator.hardwareConcurrency || 4; // Number of worker instances in the pool

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
let imageCacheMap;
const taskQueue = [];

export function ImageCacheWorker() {
  useEffect(() => {
    workerPool = new Array(getOptimalNumThreads())
      .fill(null)
      .map(createImageCacheWorker);
    imageCacheMap = new Map();
    return () => {
      workerPool.forEach((worker) => worker.terminate());
      imageCacheMap.clear();
    };
  }, []);

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

export function ImageCache({ src, alt, sliderImg, ...props }) {
  //  const { imageCache, setImageCache } = useDataProvidersContext()
  //  console.log('imageCache', imageCache)
  const [cachedSrc, setCachedSrc] = useState(src);
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
    const preloadImages = async () => {
      if (imageCacheMap.has(src)) {
        setCachedSrc(imageCacheMap.get(src));
        setImageLoading(false);
        return;
      }

      return new Promise((resolve) => {
        taskQueue.push({ src, resolve });
        processTaskQueue();
      }).then((imageSrc) => {
        if (imageSrc) {
          imageCacheMap.set(imageSrc);
          if (canLoad) {
            setCachedSrc(imageSrc);
          }
       
          if (imageLoading) {
            setImageLoading(false);
          }
        }
      });
    };

    preloadImages();
  }, [src]);

  const height = sliderImg ? "60px" : "300px";
  const width = sliderImg ? "60px" : "100%";
  function SkeletonImage() {
    return (
      <IonSkeletonText
        key="animatedplace=holder"
        animated
        style={{ width, height, display: !imageLoading ? "none" : "block" }}
      />
    );
  }

  return (
    <>
      <SkeletonImage />

      <IonImg
        onIonImgDidLoad={imageDidLoad()}
        style={{
          minHeight: "300px",
          height,
          width,
          maxHeight: height,
          display: imageLoading ? "none" : "block",
        }}
        key={src}
        src={
          cachedSrc ||
          src ||
          "https://placehold.co/300x200?text=No+Image+Available"
        }
        rel="preload"
        as="image"
        alt={alt}
        {...props}
      />
    </>
  );
}

export function ImageCachePre(src) {
  if (imageCacheMap.has(src)) {
    return;
  }
  new Promise((resolve) => {
    taskQueue.push({ src, resolve });
    processTaskQueue();
  }).then((imageSrc) => {
    if (imageSrc) {
      imageCacheMap.set(imageSrc);
    }
  });
}
