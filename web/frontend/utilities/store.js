import { createContext } from "react";

const ProductsMap = new Map();
const cachedCursorKeys = new Set();

export const productViewCache = {
  set: function (key, value) {
    try {
      ProductsMap.set(key, JSON.parse(JSON.stringify(value)));
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("error", error);
    }
  },
  get: function (key) {
    if (ProductsMap.has(key)) {
      return ProductsMap.get(key);
    }
    const page = localStorage.getItem(key);
    if (page) {
      try {
        return JSON.parse(page);
      } catch (error) {
        console.log("error", error);
      }
    }

    return null;
  },
};

export const pageIngCache = {
  setPage: function (key, pageObject) {
    if (!key) {
      throw new Error(
        "Please provide a key to the pageIngCache setPage method"
      );
    }

    try {
      ProductsMap.set(key, JSON.parse(JSON.stringify(pageObject)));
      localStorage.setItem(key, JSON.stringify(pageObject));
      cachedCursorKeys.add(key);
    } catch (error) {
      console.error("An error occurred while storing data:", error);
    }
  },

  getPage: function (key) {
    if (!key) {
      throw new Error(
        "Please provide a key to the pageIngCache getPage method"
      );
    }

    try {
      if (ProductsMap.has(key)) {
        return ProductsMap.get(key);
      }
      const page = localStorage.getItem(key);
      if (page) {
        return JSON.parse(page);
      }
    } catch (error) {
      console.error("An error occurred while retrieving data:", error);
    }

    return null;
  },
  clearAllCaches() {
    cachedCursorKeys.forEach((key) => {
      localStorage.removeItem(key);
    });
    cachedCursorKeys.clear();
    ProductsMap.clear();
  },
  clearKey(key) {
    if (cachedCursorKeys.has(key)) {
      cachedCursorKeys.delete(key);
      localStorage.removeItem(key);
      ProductsMap.clear();
    }
  },
};

export const urlCache = {
  setCache: function (key, pageObject) {
    if (!key) {
      throw new Error(
        "Please provide a key to the pageIngCache setPage method"
      );
    }

    try {
      ProductsMap.set(key, JSON.parse(JSON.stringify(pageObject)));
      localStorage.setItem(key, JSON.stringify(pageObject));
      cachedCursorKeys.add(key);
    } catch (error) {
      console.error("An error occurred while storing data:", error);
    }
  },

  getCache: function (key) {
    if (!key) {
      throw new Error(
        "Please provide a key to the pageIngCache getPage method"
      );
    }

    try {
      if (ProductsMap.has(key)) {
        return ProductsMap.get(key);
      }
      const page = localStorage.getItem(key);

      if (page) {
        return JSON.parse(page);
      }
    } catch (error) {
      console.error("An error occurred while retrieving data:", error);
    }

    return null;
  },
  clearAllCaches() {
    cachedCursorKeys.forEach((key) => {
      localStorage.removeItem(key);
    });
    cachesData.clear();
    ProductsMap.clear();
  },
  clearKey(key) {
    if (cachedCursorKeys.has(key)) {
      cachedCursorKeys.delete(key);
      localStorage.removeItem(key);
      ProductsMap.clear();
    }
  },
};

class LHistory {
  constructor(name) {
    this.name = name;
    this.pageState = new Map();
    const pageHistory = localStorage.getItem(name);
    if (pageHistory) {
      try {
        const storedState = JSON.parse(pageHistory);
        this.validateAndSyncState(storedState);
      } catch (error) {
        console.error("Error parsing stored state:", error);
      }
    } else {
      this.pageState.set("index", 0);
      this.pageState.set("pagingState", []);
      this.saveState();
    }
  }

  validateAndSyncState(storedState) {
    const requiredKeys = ["index", "pagingState"];

    if (requiredKeys.every((key) => key in storedState)) {
      this.pageState = new Map(
        Object.entries(storedState).map(([key, val]) => [key, val])
      );
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

  retrieveDataFromLocalStorage() {
    const pageHistory = localStorage.getItem(this.name);
    if (pageHistory) {
      try {
        const storedState = JSON.parse(pageHistory);
        return storedState;
      } catch (error) {
        console.error("Error parsing stored state from local storage:", error);
      }
    }
    return null;
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
    localStorage.setItem(
      this.name,
      JSON.stringify(Object.fromEntries(this.pageState))
    );
  }

  push(item) {
    this.checkFallbackState()
    this.pageState.get("pagingState").push(item);
    this.pageState.set("index", this.pageState.get("pagingState").length - 1);
    this.saveState();
  }
  includes(item) {
    this.checkFallbackState()
    return this.pageState.get("pagingState").includes(item);
  }

  getPreviousPage() {
   this.checkFallbackState()

    const index = this.pageState.get("index");

    if (index >= 0) {
      this.pageState.set("index", index - 1);
      this.saveState();
      return this.pageState.get("pagingState")[index - 1];
    }
  }

  getCurrentPage() {
    this.checkFallbackState()

    const pagingState = this.pageState.get("pagingState");
    return pagingState[this.pageState.get("index")];
  }

  hasCurrentPage() {
    this.checkFallbackState()
    const pagingState = this.pageState.get("pagingState");

    return pagingState.length >= 1;
  }

  hasNextPage() {
    this.checkFallbackState()
    const index = this.pageState.get("index");
    return index < this.pageState.get("pagingState").length - 1;
  }
  hasPreviousPage() {
    this.checkFallbackState()
    const index = this.pageState.get("index");
    return index > 0;
  }
  getNextPage() {
    this.checkFallbackState()
    if (this.hasNextPage()) {
      const index = this.pageState.get("index") + 1;
      this.pageState.set("index", index);
      this.saveState();
      return this.pageState.get("pagingState")[index];
    }
  }
  getCurrentIndex() {
    this.checkFallbackState()
    const index = this.pageState.get("index");
    return index;
  }
}

const History = new LHistory("pagingHistory");
export { History };

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
      urlCache.clearKey(key);
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
