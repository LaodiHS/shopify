import { createContext } from "react";

const cachedData = new Set();
const pagingHistory = [];
export const pageIngCache = {
  setPage: function (key, pageObject) {
    if (!key) {
      throw new Error(
        "Please provide a key to the pageIngCache setPage method"
      );
    }

 
    try {
      localStorage.setItem(key, JSON.stringify(pageObject));
      cachedData.add(key);
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
    cachedData.forEach((key) => {
      localStorage.removeItem(key);
    });
    cachedData.clear();
  },
  clearKey(key) {
    if (cachedData.has(key)) {
      cachedData.delete(key);
      localStorage.removeItem(key);
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
      localStorage.setItem(key, JSON.stringify(pageObject));
      cachedData.add(key);
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
    cachedData.forEach((key) => {
      localStorage.removeItem(key);
    });
    cachesData.clear();
  },
  clearKey(key) {
    if (cachedData.has(key)) {
      cachedData.delete(key);
      localStorage.removeItem(key);
    }
  },
};



export class History {
  constructor(name) {
    this.name = name;
    this.index = 0;
    this.pagingState = [];

    const pageHistory = localStorage.getItem(name);
    if (pageHistory) {
      const storedState = JSON.parse(pageHistory);
      this.pagingState = storedState.pagingState;
      this.index = storedState.index;
    } else {
      this.index = 0;
      this.pagingState = [];
      this.saveState();
    }
  }

  saveState() {
    const storedState = {
      pagingState: this.pagingState,
      index: this.index,
    };
    localStorage.setItem(this.name, JSON.stringify(storedState));
  }

  push(item) {
    // if (this.index < this.pagingState.length - 1) {
    //   this.pagingState.splice(this.index + 1);
    // }

    this.pagingState.push(item);
    this.index = this.pagingState.length - 1;
    this.saveState();
  }
  includes(item) {
    return this.pagingState.includes(item);
  }

  getPreviousPage() {
    if (this.index >= 0) {
      this.index--;
      this.saveState();
      return this.pagingState[this.index];
    }
  }

  getCurrentPage() {
    return this.pagingState[this.index];
  }

  hasCurrentPage() {
    return this.pagingState.length > 1;
  }

  hasNextPage() {
    return this.index < this.pagingState.length - 1;
  }
  hasPreviousPage() {
    return this.index > 0;
  }
  getNextPage() {
    if (this.hasNextPage()) {
      this.index++;

      this.saveState();
      return this.pagingState[this.index];
    }
  }
  getCurrentIndex() {
    return this.index;
  }
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
    formattedProducts.pageInfo = productData.data.body.data.products.pageInfo;
    formattedProducts.extensions = productData.data.body.extensions;

    return formattedProducts;
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


