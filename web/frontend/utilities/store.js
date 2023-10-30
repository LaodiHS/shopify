import { indexDb } from "./IndexDB";
import * as zip from "lzutf8";

const ProductsMap = new Map();

// Check if a value can be parsed into JSON
function isJson(item) {
  try {
    JSON.parse(typeof item !== "string" ? JSON.stringify(item) : item);
    return true;
  } catch (e) {
    return false;
  }
}

// Check if a value is an integer
function isInt(n) {
  return Number.isInteger(n);
}

// Check if a value is a float
function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

// Check if a string is valid base64
function isBase64(str) {
  try {
    return btoa(atob(str)) === str;
  } catch (error) {
    return false;
  }
}

// Encode a single digit
function encodeSingleDigit(num) {
  const encodedNum = btoa(String(num));
  return encodedNum;
}

// Decode a single digit
function decodeSingleDigit(num) {
  const decodedNum = parseInt(atob(num), 10);
  return decodedNum;
}

// Encode and store data in the cache
async function encode(key, value) {
  if (!key) {
    throw new Error("no key provided", key);
  }
  if (!value) {
    throw new Error("no value provided", value);
  }

  try {
    let compressedKey = zip.compress(key, {
      outputEncoding: "StorageBinaryString",
    });
    let compressedData;

    if (isInt(value) || isFloat(value)) {
      ProductsMap.set(key, value);
      compressedData = zip.compress(encodeSingleDigit(value), {
        outputEncoding: "StorageBinaryString",
      });
    } else {
      const pageString =
        typeof value !== "string" ? JSON.stringify(value) : value;
      compressedData = zip.compress(pageString, {
        outputEncoding: "StorageBinaryString",
      });

      try {
        if (typeof value === "string") {
          ProductsMap.set(key, value);
        } else {
          ProductsMap.set(key, JSON.parse(JSON.stringify(value)));
        }
      } catch (error) {
        console.error("An error occurred while storing data:", error);
      }
    }
    if (!compressedData) {
      throw new Error(" no compressed data: ", compressedData);
    }
    if (!compressedKey) {
      throw new Error(" no compressed key: ", compressedKey);
    }
    await indexDb.db.setItem(compressedKey, compressedData);
  } catch (error) {
    console.error("An error occurred while encoding and storing data:", error);
  }
}

// Decode and retrieve data from the cache
async function decode(key) {
  if (!key) {
    throw new Error("Please provide a key to decode.", key);
  }

  try {
    if (ProductsMap.has(key)) {
      return ProductsMap.get(key);
    }

    const encodedKey = await indexDb.db.getItem(
      zip.compress(key, { outputEncoding: "StorageBinaryString" })
    );

    if (encodedKey) {
      const decodedValue = zip.decompress(encodedKey, {
        inputEncoding: "StorageBinaryString",
      });

      if (isBase64(decodedValue)) {
        const decodedValue = decodeSingleDigit(decodedValue);
        ProductsMap.set(key, decodedValue); // Update ProductsMap
        return decodedValue;
      }

      if (isJson(decodedValue)) {
        const parsedValue = JSON.parse(decodedValue);
        ProductsMap.set(key, parsedValue); // Update ProductsMap
        return parsedValue;
      }

      return decodedValue;
    }
  } catch (error) {
    throw new Error(
      `An error occurred while retrieving data for key '${key}': ${error.message}`
    );
  }

  return null;
}

// Set data in the cache
async function setCache(key, pageObject, isCursor = false) {
  if (!key) {
    throw new Error("Please provide a key to set the cache.", key);
  }

  await encode(key, pageObject);
}

// Get data from the cache
async function getCache(key) {
  if (!key) {
    throw new Error("Please provide a key to get the cache.");
  }
  try {
    return await decode(key);
  } catch (e) {
    console.log("error decoding key: ", e);
  }
}
async function removeCache(key) {
  if (!key) {
    throw new Error("Please provide a key to remove from the cache.");
  }

  try {
    await indexDb.db.removeItem(
      zip.compress(key, { outputEncoding: "StorageBinaryString" })
    );

    // Also remove from ProductsMap if it exists
    if (ProductsMap.has(key)) {
      ProductsMap.delete(key);
    }
  } catch (error) {
    throw new Error(
      `An error occurred while removing data for key '${key}': ${error.message}`
    );
  }
}

async function hasCache(key) {
  if (!key) {
    throw new Error("Please provide a key to remove from the cache.");
  }

  let hasValue;
  try {
    if (ProductsMap.has(key)) {
      hasValue = ProductsMap.has(key);
      return hasValue;
    }

    hasValue = await indexDb.db.hasItem(
      zip.compress(key, { outputEncoding: "StorageBinaryString" })
    );

    return hasValue;
  } catch (error) {
    throw new Error(
      `An error occurred while removing data for key '${key}': ${error.message}`
    );
  }
}

async function clearKey(key) {
  await productViewCache.remove(key);
  ProductsMap.delete(key);
}

function compressData(inputData) {
  try {
    // Perform compression
    return zip.compress(inputData, {
      compressionLevel: 9,
      outputEncoding: "StorageBinaryString",
    });
  } catch (error) {
    console.error("Error during compression:", error);
    // Handle the error (e.g., show a user-friendly message)
    return null;
  }
}

function decompressData(compressedData) {
  try {
    // Perform decompression
    return zip.decompress(compressedData, {
      inputEncoding: "StorageBinaryString",
    });
  } catch (error) {
    console.error("Error during decompression:", error);
    // Handle the error (e.g., show a user-friendly message)
    return null;
  }
}
export const productViewCache = {
  set: setCache,
  get: getCache,
  has: hasCache,
  remove: removeCache,
  clearAll: clearAllCaches,
  clearKey,
  compress: (str) => compressData(str),
  decompress: (str) => decompressData(str),
};
// for product cursors look for setPage
export const pageIngCache = {
  setPage: setCache,
  getPage: getCache,
  clearAllCaches,
};
let hit = false;
class LHistory {
  constructor(name) {
    this.name = name;
    this.pageState = new Map();
    
  }
  async getPagingState() {
    try {
      let pageHistoryPromise = await this.retrieveDataFromLocalStorage();
      if (pageHistoryPromise) {
        await this.validateAndSyncState(pageHistoryPromise);
      } else {
        await this.resetToDefaultState();
      }

      console.log("pageHistory: ", pageHistoryPromise);
      console.log("this.state: ", this.pageState);
      return this;
    } catch (error) {
      console.log("error: ", error);
    }
  }

  async retrieveDataFromLocalStorage() {
    const pageHistory = await productViewCache.get(this.name);
    try {
      return pageHistory;
    } catch (error) {
      console.error("Error parsing stored state from local storage:", error);
    }
    return null;
  }

  async validateAndSyncState(storedState) {
    const requiredKeys = ["index", "pagingState"];

    if (requiredKeys.every((key) => key in storedState)) {
      this.pageState = new Map(Object.entries(storedState));
      await this.saveState();
    } else {
      console.warn("Stored state is invalid. Resetting to default state.");
      this.resetToDefaultState();
    }
  }

  async resetToDefaultState() {
    this.pageState.set("index", 0);
    this.pageState.set("pagingState", []);
    await this.saveState();
  }

  async getFallbackPageState() {
    return await this.retrieveDataFromLocalStorage();
  }

  async checkFallbackState() {
    if (!this.pageState.has("index") || !this.pageState.has("pagingState")) {
      const fallbackState = await this.getFallbackPageState();
      if (fallbackState) {
        this.validateAndSyncState(fallbackState);
      }
    }
  }

  async saveState() {
    await productViewCache.set(this.name, Object.fromEntries(this.pageState));
  }

  async push(item) {
    await this.checkFallbackState();
    const pagingState = this.pageState.get("pagingState");
    pagingState.push(item);
    this.pageState.set("index", pagingState.length - 1);
    await this.saveState();
  }

  async includes(item) {
    await this.checkFallbackState();
    return this.pageState.get("pagingState").includes(item);
  }

  async getPreviousPage() {
    await this.checkFallbackState();
    const index = this.pageState.get("index");

    if (index >= 0) {
      this.pageState.set("index", index - 1);
      await this.saveState();
      return this.pageState.get("pagingState")[index - 1];
    }
  }

  async getCurrentPage() {
    await this.checkFallbackState();
    console.log(
      "current page",
      this.pageState.get("pagingState")[this.pageState.get("index")]
    );
    return this.pageState.get("pagingState")[this.pageState.get("index")];
  }

  async hasCurrentPage() {
    await this.checkFallbackState();
    return this.pageState.get("pagingState").length >= 1;
  }

  async hasNextPage() {
    await this.checkFallbackState();
    const index = this.pageState.get("index");
    return index < this.pageState.get("pagingState").length - 1;
  }

  async hasPreviousPage() {
    await this.checkFallbackState();
    return this.pageState.get("index") > 0;
  }

  async getNextPage() {
    await this.checkFallbackState();

    if (this.hasNextPage()) {
      const index = this.pageState.get("index") + 1;
      this.pageState.set("index", index);
      await this.saveState();
      return this.pageState.get("pagingState")[index];
    }
  }

  async getCurrentIndex() {
    await this.checkFallbackState();
    return this.pageState.get("index");
  }
  async sync_push(item) {
    await this.checkFallbackState();
    const pagingState = this.pageState.get("pagingState");
    pagingState.push(item);

    await this.saveState();
  }
  sync_getCurrentCursors() {
    return this.pageState.get("pagingState");
  }

  async *sync_fetchSyncData(uncachedFetchData, productsPerPage) {
    const existingCursors = this.sync_getCurrentCursors();
    console.log("existing cursors", existingCursors);
    let cost;
    if (existingCursors.length > 0) {
      for (const cursor of existingCursors) {
        try {
          const response = await uncachedFetchData({
            url: "/api/products/paging",
            method: "POST",
            body: {
              first: productsPerPage,
              after: cursor,
            },
          });
          console.log("sync fetch data", response);
          const { data, error } = response;
          console.log("data", data);
          if (error !== null) throw new Error(error);
          cost = data?.body?.extensions?.cost;
          const formattedData = await formatProducts(response);
          productViewCache.set(cursor, formattedData);
        } catch (error) {
          console.log("error", error);
        }
        yield cost;
      }
    }
  }
  async runSyncDataFetcher(uncachedFetchData, productsPerPage) {
    let restoreTime;
    const initialTimeout = 20000;
    console.log("hit sync");

    const syncDataGenerator = this.sync_fetchSyncData(
      uncachedFetchData,
      productsPerPage
    );

    while (true) {
      try {
        await new Promise((resolve) =>
          setTimeout(resolve, restoreTime || initialTimeout)
        );

        const next = await syncDataGenerator.next();
        if (!next.value) break;
        console.log("next:", next.value);
        restoreTime = this.calculateNextInterval(next.value);
        if (next.done) {
          console.log("done");
          break;
        }
      } catch (error) {
        console.log("error:", error);
      }
    }
  }

  calculateNextInterval({
    throttleStatus,
    actualQueryCost,
    safetyMargin = 20,
  }) {
    if (
      typeof throttleStatus !== "object" ||
      typeof actualQueryCost !== "number" ||
      typeof safetyMargin !== "number"
    ) {
      throw new Error(
        "Invalid input. Ensure throttleStatus is an object, actualQueryCost is a number, and safetyMargin is a number."
      );
    }

    const remainingQueries =
      throttleStatus.currentlyAvailable - actualQueryCost;
    if (remainingQueries < 0) {
      // return seven min if negative;
      return 7 * 60000;
    }
    // Calculate interval based on remainingQueries
    const nextInterval =
      (1 / remainingQueries) * actualQueryCost * safetyMargin;

    const adaptiveRestoreTime = nextInterval * 1000; // Convert seconds to milliseconds
    console.log("adaptive restore time: ", adaptiveRestoreTime);

    return adaptiveRestoreTime;
  }







}
export { LHistory };
async function clearAllCaches() {
  await indexDb.db.clear();

  ProductsMap.clear();
}

export const formatProducts = async (productData, key) => {
  if (
    productData.data &&
    productData.data.body &&
    productData.data.body.data &&
    productData.data.body.data.products &&
    productData.data.body.data.products.edges
  ) {
    const formattedProducts = productData.data.body.data.products.edges.map(
      (edge) => {
        const product = edge.node;
        const formattedProduct = {
          id: product.id,
          title: product.title,
          handle: product.handle,
          description: product.descriptionHtml,
          images: product.images.edges.map((imageEdge) => {
            const image = imageEdge.node;
            return {
              id: image.id,
              altText: image.altText,
              transformedSrc: image.transformedSrc,
              width: image.width,
              height: image.height,
              originalSrc: image.originalSrc,
            };
          }),
          variants: product.variants.edges.map((variantEdge) => {
            const variant = variantEdge.node;
            return {
              id: variant.id,
              title: variant.title,
              price: variant.price,
              sku: variant.sku,
              barcode: variant.barcode,
              weight: variant.weight,
              weightUnit: variant.weightUnit,
              inventoryQuantity: variant.inventoryQuantity,
            };
          }),
          options: product.options.map((option) => {
            return {
              id: option.id,
              name: option.name,
              values: option.values,
            };
          }),
          collections: product.collections.edges.map((collectionEdge) => {
            const collection = collectionEdge.node;
            return {
              id: collection.id,
              title: collection.title,
              handle: collection.handle,
              description: collection.description,
            };
          }),
          tags: product.tags,
          metafields: product.metafields.edges.map((metafieldEdge) => {
            const metafield = metafieldEdge.node;
            return {
              id: metafield.id,
              namespace: metafield.namespace,
              key: metafield.key,
              value: metafield.value,
            };
          }),
        };
        return formattedProduct;
      }
    );
    const productsObject = {
      productsData: formattedProducts,
      pageInfo: JSON.parse(
        JSON.stringify(productData.data.body.data.products.pageInfo)
      ),
      extensions: JSON.parse(JSON.stringify(productData.data.body.extensions)),
    };

    return productsObject;
  } else {
    if (key) {
      await productViewCache.clearKey(key);
    }
    throw new Error("Invalid Products object");
  }
};

const handlePopulate = async () => {
  setIsLoading(true);
  const response = await fetch.get("/api/products/create");

  if (response.ok) {
    await refetchProductCount();
    setToastProps({
      content: t("ProductsCard.productsCreatedToast", {
        count: productsPerPage,
      }),
    });
  } else {
    setIsLoading(false);
    setToastProps({
      content: t("ProductsCard.errorCreatingProductsToast"),
      error: true,
    });
  }
};

// const l = {
//   antanaclasis: "The repeated use of a word in different senses or meanings.",
//   oxymoron: "The juxtaposition of two contradictory terms or ideas.",
//   chiasmus: "The reversal of the order of words in two parallel clauses.",
//   antithesis:
//     "The juxtaposition of contrasting ideas in a balanced or parallel structure.",
// };

// function store(key, input) {
//   if (!key || !input) {
//     console.log('no input or key provided', key, 'no input input provided', input)
//     throw new Error("no key or input");
//   }
//   if (typeof input === "string") {
//     sessionStorage.setItem(key, zip.compress(input));
//   } else {
//     try {
//       const toStr = JSON.stringify(input);
//       try {
//         const compressed = zip.compress(toStr);
//         sessionStorage.setItem(key, compressed);
//       } catch (e) {
//         console.log('failed to compress', toStr)
//         sessionStorage.setItem(key, toStr);
//       }
//     } catch (e) {
//       console.log("error:", e);
//     }
//   }
// }
// function retrieve(key) {
//   if(!key){
//     console.log('no key for retrieve', key)
//      return null;
//   }

//   if (key) {
//     const result = sessionStorage.getItem(key);
//     if(!result) return null;
//     if (!isCompressed(result)) return result;
//     if (!result) return result;
//     try {
//       return zip.decompress(result);
//     } catch (e) {
//       console.log('key: ' ,key, 'failed to decompress', result)
//       return result;
//     }
//   }
//   return null;
// }
