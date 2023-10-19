import { indexDb } from "./IndexDB";
import * as zip from "lzutf8";

const ProductsMap = new Map();
const cachedCursorKeys = new Set();

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
  if (!value ){
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
        typeof(value) !== "string"
          ? JSON.stringify(value)
          : value;
      compressedData = zip.compress(pageString, {
        outputEncoding: "StorageBinaryString",
      });

      try {
        if (typeof(value) === "string") {
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

  if (isCursor) {
    cachedCursorKeys.add(key);
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

    // Also remove from cachedCursorKeys if it exists
    if (cachedCursorKeys.has(key)) {
      cachedCursorKeys.delete(key);
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

async function clearCursorKey(key) {
  if (cachedCursorKeys.has(key)) {
    cachedCursorKeys.delete(key);
    removeCache(key);
    ProductsMap.delete(key);
  }
}

export const productViewCache = {
  set: setCache,
  get: getCache,
  has: hasCache,
  remove: removeCache,
  clearAll: clearAllCaches,
  clearKey,
};
// for product cursors look for setPage
export const pageIngCache = {
  setPage: setCache,
  getPage: getCache,
  clearAllCaches,
  clearCursorKey,
};

export const urlCache = {
  setCache,
  getCache,
  clearAllCaches,
  clearCursorKey,
};

class LHistory {
  constructor(name) {
    this.name = name;
    this.pageState = new Map();

    const pageHistory = this.retrieveDataFromLocalStorage();
    if (pageHistory) {
      this.validateAndSyncState(pageHistory);
    } else {
      this.resetToDefaultState();
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
}

export { LHistory };
async function clearAllCaches() {
 for(const key of  cachedCursorKeys) {
  await productViewCache.remove(key);
  };
  await indexDb.db.clear();
  cachedCursorKeys.clear();
  ProductsMap.clear();
}

export const formatProducts = (productData, key) => {
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
      urlCache.clearCursorKey(key);
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

const l = {
  antanaclasis: "The repeated use of a word in different senses or meanings.",
  oxymoron: "The juxtaposition of two contradictory terms or ideas.",
  chiasmus: "The reversal of the order of words in two parallel clauses.",
  antithesis:
    "The juxtaposition of contrasting ideas in a balanced or parallel structure.",
};

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
