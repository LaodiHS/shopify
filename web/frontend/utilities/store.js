import { createContext } from "react";
import * as zip from "lzutf8";
const ProductsMap = new Map();
const cachedCursorKeys = new Set();
function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}
function isBase64(str) {
  try {
    return btoa(atob(str)) == str;
  } catch (error) {
    return false;
  }
}

function encodeSingleDigit(num) {
  console.log("encoded", num);
  const b = btoa(String(num));
  console.log('b:   ',b);
  return b;
}
function decodeSingleDigit(num) {
  console.log("numb", num);
  const a = parseInt(atob(num));
  console.log("decoded   ", a);
  return a;
}

function encode(key, pageObject){

  if (isInt(pageObject) || isFloat(pageObject)) {
    ProductsMap.set(key, pageObject);
    console.log('pageObject:    ',pageObject)
    sessionStorage.setItem(zip.compress(key,{outputEncoding: "StorageBinaryString"}), zip.compress(encodeSingleDigit(pageObject),{outputEncoding: "StorageBinaryString"}) );
    return;
  }

  sessionStorage.setItem(zip.compress(key,{outputEncoding: "StorageBinaryString"}), zip.compress(stringifiedObject,{outputEncoding: "StorageBinaryString"}) );

  try {
    const stringifiedObject = JSON.stringify(pageObject);

    ProductsMap.set(key, JSON.parse(stringifiedObject));
    sessionStorage.setItem(zip.compress(key,{outputEncoding: "StorageBinaryString"}), zip.compress(stringifiedObject,{outputEncoding: "StorageBinaryString"}) );


  } catch (error) {
    console.error("An error occurred while storing data:", error);
  }
}

function decode(key){

  if (!key) {
    throw new Error("Please provide a key to get the cache.");
  }

    const element =   sessionStorage.getItem(zip.compress(key,{outputEncoding: "StorageBinaryString"}));

    if (element) {
      console.log('element', element, typeof(element))
        const page =  zip.decompress(element,{inputEncoding: "StorageBinaryString"} )
      if (isBase64(page)) {
        console.log('page ', page)
        return decodeSingleDigit(page);
      }

      return JSON.parse(page);
    }



  try {
    if (ProductsMap.has(key)) {
      return ProductsMap.get(key);
    }

    // const keyE = JSON.stringify(zip.compress(key)) 





    // if(sessionStorage.getItem(keyE)){

  } catch (error) {
    console.error("An error occurred while retrieving data:", error);
  }

  return null;


}
function setCache(key, pageObject, isCursor = false) {
  if (!key) {
    throw new Error("Please provide a key to set the cache.");
  }
  if (isCursor) {
    console.log("cursor---key", key);
    cachedCursorKeys.add(key);
  }
 
           // encode(key, pageObject)

  try {
    const stringifiedObject = JSON.stringify(pageObject);

    ProductsMap.set(key, JSON.parse(stringifiedObject));
    sessionStorage.setItem(key, stringifiedObject) ;


  } catch (error) {
    console.error("An error occurred while storing data:", error);
  }
}

function getCache(key) {
  if (!key) {
    throw new Error("Please provide a key to get the cache.");
  }

  
    



  try {
    if (ProductsMap.has(key)) {
      return ProductsMap.get(key);
    }

    // const keyE = JSON.stringify(zip.compress(key)) 


  const element = sessionStorage.getItem(key);

  
      
  
      return JSON.parse(element);


    // if(sessionStorage.getItem(keyE)){

  } catch (error) {
    console.error("An error occurred while retrieving data:", error);
  }

  return null;
}

function clearKey(key) {
  sessionStorage.removeItem(key);
  ProductsMap.delete(key);
}

function clearCursorKey(key) {
  if (cachedCursorKeys.has(key)) {
    cachedCursorKeys.delete(key);
    sessionStorage.removeItem(key);
    ProductsMap.delete(key);
  }
}

export const productViewCache = {
  set: setCache,
  get: getCache,
  clear: clearAllCaches,
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

  retrieveDataFromLocalStorage() {
    const pageHistory = sessionStorage.getItem(this.name);
    try {
      return JSON.parse(pageHistory);
    } catch (error) {
      console.error("Error parsing stored state from local storage:", error);
    }
    return null;
  }

  validateAndSyncState(storedState) {
    const requiredKeys = ["index", "pagingState"];

    if (requiredKeys.every((key) => key in storedState)) {
      this.pageState = new Map(Object.entries(storedState));
      this.saveState();
    } else {
      console.warn("Stored state is invalid. Resetting to default state.");
      this.resetToDefaultState();
    }
  }

  resetToDefaultState() {
    this.pageState.set("index", 0);
    this.pageState.set("pagingState", []);
    this.saveState();
  }

  getFallbackPageState() {
    return this.retrieveDataFromLocalStorage();
  }

  checkFallbackState() {
    if (!this.pageState.has("index") || !this.pageState.has("pagingState")) {
      const fallbackState = this.getFallbackPageState();
      if (fallbackState) {
        this.validateAndSyncState(fallbackState);
      }
    }
  }

  saveState() {
    sessionStorage.setItem(
      this.name,
      JSON.stringify(Object.fromEntries(this.pageState))
    );
  }

  push(item) {
    this.checkFallbackState();
    const pagingState = this.pageState.get("pagingState");
    pagingState.push(item);
    this.pageState.set("index", pagingState.length - 1);
    this.saveState();
  }

  includes(item) {
    this.checkFallbackState();
    return this.pageState.get("pagingState").includes(item);
  }

  getPreviousPage() {
    this.checkFallbackState();
    const index = this.pageState.get("index");

    if (index >= 0) {
      this.pageState.set("index", index - 1);
      this.saveState();
      return this.pageState.get("pagingState")[index - 1];
    }
  }

  getCurrentPage() {
    this.checkFallbackState();
    return this.pageState.get("pagingState")[this.pageState.get("index")];
  }

  hasCurrentPage() {
    this.checkFallbackState();
    return this.pageState.get("pagingState").length >= 1;
  }

  hasNextPage() {
    this.checkFallbackState();
    const index = this.pageState.get("index");
    return index < this.pageState.get("pagingState").length - 1;
  }

  hasPreviousPage() {
    this.checkFallbackState();
    return this.pageState.get("index") > 0;
  }

  getNextPage() {
    this.checkFallbackState();

    if (this.hasNextPage()) {
      const index = this.pageState.get("index") + 1;
      this.pageState.set("index", index);
      this.saveState();
      return this.pageState.get("pagingState")[index];
    }
  }

  getCurrentIndex() {
    this.checkFallbackState();
    return this.pageState.get("index");
  }
}

let History = new LHistory("pagingHistory");
export { History };
function clearAllCaches() {
  cachedCursorKeys.forEach((key) => {
    sessionStorage.removeItem(key);
  });

  cachedCursorKeys.clear();
  ProductsMap.clear();
  History = new LHistory("pagingHistory");
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
