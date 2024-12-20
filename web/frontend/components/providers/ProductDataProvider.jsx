import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react_router_dom";

import { useAuthenticatedFetch } from "../../hooks";
import { useDataProvidersContext } from "../../components";
import { LoadingPageComponent } from "../../components";
import { ShopifyOutage } from "../../components";
const ProductDataContext = createContext(null);

export function useProductDataContext() {
  return useContext(ProductDataContext);
}

export function ProductDataProvider({ children }) {
  const {
    shopifyDown,
    lockAllTasks,
    defineShopifyDown,
    selectedImageMap,
    uncachedFetchData,
    sessionLoaded,
    IntroLoadingPage,
    subscriptions,
    currentSession,
    user,
    handleSelectChange,
    DataProviderNavigate,
    checkFeatureAccess,
    productDetailOptions,
    languageOptions,
    assignLegend,
    assignAssistRequest,
    assignUpdateArticleMethod,
    allAssets,
    sSEWorker,
    markupText,
    setMarkupText,
    setServerSentEventLoading,
    setContentSaved,
    eventEmitter,
    assignClearAssistMethod,
    mappedLegend,
    pagingHistory,
    productViewCache,
    pageIngCache,
    formatProducts,
    AllDependenciesLoaded,
    modifyState,
    setUser,
  } = useDataProvidersContext();

  const location = useLocation();
  const navigate = useNavigate();

  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [currentIndexPage, setCurrentIndexPage] = useState(null);
  const [hasNextIndexPage, setNextIndexPage] = useState(false);
  const [displayContents, setDisplayContents] = useState(false);
  const productsPerPage = 10;
  const [productsData, setProductsData] = useState({});
  const [productData, setProductData] = useState(null);
  const [loadingStream, setLoadingStream] = useState(false);

  async function defineProductData(currentIndex) {
    const index = parseInt(currentIndex, 10);

    if (!isNaN(index) && index >= 0) {
      if (!productsData.productsData) {
        fetchData();
      }

      if (
        productsData &&
        productsData.productsData &&
        productsData.productsData[index]
      ) {
        setProductData(productsData.productsData[index]);
        await productViewCache.set("cashedProductIndex", index.toString());
      }
    }
  }
  function defineCurrentIndexPage(currentIndexPage) {
    modifyState(setCurrentIndexPage, currentIndexPage);
  }

  function defineNextIndexPage(hasNextIndexPage) {
    modifyState(setNextIndexPage, hasNextIndexPage);
  }

  function setProductsLoading(loading) {
    modifyState(setIsProductsLoading, loading);
  }
  function defineLoadingStream(value) {
  setLoadingStream( value);
  }
  useEffect(() => {
    const setIndex = async () => {
      if (pagingHistory && sessionLoaded) {
        setCurrentIndexPage(await pagingHistory.getCurrentIndex());
      }
    };
    setIndex();
  }, [pagingHistory, sessionLoaded]);

  async function setPaging(formattedData) {
    console.log("formattedData", formattedData);
    const { startCursor } = formattedData.pageInfo;
    await pageIngCache.setPage(startCursor, formattedData);
    if (!(await pagingHistory.includes(startCursor))) {
      await pagingHistory.push(startCursor);
    }
    defineNextIndexPage(formattedData?.pageInfo?.hasNextPage);
    defineCurrentIndexPage(await pagingHistory.getCurrentIndex());
    defineProductsData(formattedData);
    const cashedProductIndex = await productViewCache.get("cashedProductIndex");
    const index = parseInt(cashedProductIndex, 10);
    if (!isNaN(index) && index >= 0) {
      setProductData(formattedData.productsData[index]);
    }
  }

  const fetchData = async () => {
    setProductsLoading(true);
    if (await pagingHistory.hasCurrentPage()) {
      const currentPage = await pagingHistory.getCurrentPage();
      const cachedData = await pageIngCache.getPage(currentPage);
      if (cachedData) {
        console.log("cachedData  ", cachedData);
        await setPaging(cachedData);
        setProductsLoading(false);
        return;
      }
    }

    try {
      const response = await uncachedFetchData({
        url: "/api/products/paging",
        method: "POST",
        body: {
          first: productsPerPage,
          after: null,
        },
      });

      const data = response;
      const format = await formatProducts(data);
      await setPaging(format);
      setProductsLoading(false);
    } catch (error) {
      console.log("error", error);
      setProductsLoading(false);
    }
  };

  function defineProductsData(productsData) {
    setProductsData({ ...productsData });
  }

  // useEffect(async () => {
  //   if (sessionLoaded &&  location.pathname === "/product-details") {
  //   console.log('productsData from details: ', productsData);
  //       if (!productsData) {
  //         await fetchData();
  //         console.log("products data fetched");

  //         return;
  //       }

  //       const cashedProductIndex = await productViewCache.get(
  //         "cashedProductIndex"
  //       );

  //       // If both productData and cashedProductData are unavailable and the current route is "product-detail"

  //       if (productsData === null && location.pathname === "/product-details") {
  //         await fetchData();
  //         console.log("product data fetched");
  //         const index = await productViewCache.get("cashedProductIndex");
  //         console.log("product Index:", index);
  //         if (index >= 0) {
  //           setProductData(productsData.productsData[index]);
  //         } else {
  //           navigate("/"); // Navigate to the root of the application
  //         }
  //       }

  //       if (productData === null && cashedProductIndex !== null) {
  //         // Parse the cashedProductIndex to an integer before using it
  //         const index = parseInt(cashedProductIndex, 10);
  //         await defineProductData(index);
  //       }

  //   }
  // }, [location.pathname, navigate, pagingHistory, sessionLoaded]);

  useEffect(() => {
    const runSyncDataFetcher = async () => {
      if (sessionLoaded) {
        await pagingHistory.runSyncDataFetcher(
          uncachedFetchData,
          productsPerPage
        );
      }
    };
    // runSyncDataFetcher()
  }, [sessionLoaded]);

  async function updateProductProperty(prop, value) {
    const updatedProduct = { ...productData, [prop]: value };
    // Find the index of the current productData in productsData
    const arr = productsData.productsData.map((product) =>
      product.id === productData.id ? updatedProduct : product
    );
    // Create a new array with the updated productData
    const updatedProductsData = [...arr];
    // Update the state with the new productData and productsData
    setProductData({ ...updatedProduct });
    await setPaging({ ...productsData, productsData: [...arr] });
  }

  const value = {
    loadingStream,
    setLoadingStream: defineLoadingStream,
    lockAllTasks,
    sSEWorker,
    selectedImageMap,
    pagingHistory,
    productViewCache,
    pageIngCache,
    formatProducts,
    checkFeatureAccess,
    productDetailOptions,
    languageOptions,
    assignLegend,
    assignAssistRequest,
    assignUpdateArticleMethod,
    markupText,
    setMarkupText,
    setServerSentEventLoading,
    setContentSaved,
    eventEmitter,
    assignClearAssistMethod,
    mappedLegend,
    uncachedFetchData,
    sessionLoaded,
    IntroLoadingPage,
    subscriptions,
    currentSession,
    user,
    productsPerPage,
    handleSelectChange,
    DataProviderNavigate,
    isProductsLoading,
    setProductsLoading,
    currentIndexPage,
    defineCurrentIndexPage,
    hasNextIndexPage,
    defineNextIndexPage,
    productsData,
    defineProductData,
    productData,
    defineProductsData,
    updateProductProperty,
    setPaging,
    fetchData,
    AllDependenciesLoaded,
    allAssets,
    setUser,
  };

  useEffect(() => {
    const LoadSession = async () => {
      let id;
      if (sessionLoaded) {
        console.log("sessionLoaded: ", sessionLoaded);
        await fetchData();
        console.log("fetched product data");
        id = setTimeout(() => {
          setDisplayContents(true);
        }, 10000);

        return () => {
          clearTimeout(id);
          // setFetchedData(false);
        };
      }
    };
    LoadSession();
  }, [sessionLoaded]);

  return (
    <ProductDataContext.Provider value={value}>
      {shopifyDown ? (
        <ShopifyOutage retrySession={defineShopifyDown} />
      ) : displayContents ? (
        children
      ) : (
        <LoadingPageComponent />
      )}
    </ProductDataContext.Provider>
  );
}
