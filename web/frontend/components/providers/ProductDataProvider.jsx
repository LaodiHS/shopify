import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react_router_dom";
import {
  productViewCache,
  pageIngCache,
  History,
  formatProducts,
} from "../../utilities/store";
import { useAuthenticatedFetch } from "../../hooks";

const ProductDataContext = createContext(null);

export function useProductDataContext() {
  return useContext(ProductDataContext);
}

export function ProductDataProvider({ children }) {
  const pagingHistory = History;
  const fetch = useAuthenticatedFetch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [currentIndexPage, setCurrentIndexPage] = useState(
    pagingHistory.getCurrentIndex()
  );
  const [hasNextIndexPage, setNextIndexPage] = useState(false);
  const productsPerPage = 20;

  function defineCurrentIndexPage(currentIndexPage) {
    setCurrentIndexPage(currentIndexPage);
  }

  function defineNextIndexPage(hasNextIndexPage) {
    setNextIndexPage(hasNextIndexPage);
  }

  function setProductsLoading(loading) {
    setIsProductsLoading(loading);
  }

  const [productsData, setProductsData] = useState({});

  const setPaging = (formattedData) => {
    const { startCursor } = formattedData.pageInfo;
    pageIngCache.setPage(startCursor, formattedData);



    if (!pagingHistory.includes(startCursor)) {
      pagingHistory.push(startCursor);
    }

  defineNextIndexPage(formattedData?.pageInfo?.hasNextPage);
    defineCurrentIndexPage(pagingHistory.getCurrentIndex());


    defineProductsData(formattedData);

    const cashedProductIndex = productViewCache.get("cashedProductIndex");

    const index = parseInt(cashedProductIndex, 10);
    if (!isNaN(index) && index >= 0) {
      setProductData(formattedData.productsData[index]);
    }

  
  };

  const fetchData = async () => {
    setProductsLoading(true);
    if (pagingHistory.hasCurrentPage()) {
      const cachedData = pageIngCache.getPage(pagingHistory.getCurrentPage());
      if (cachedData) {
        const formattedData = cachedData;
        setPaging(formattedData);
        setProductsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/products/paging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first: productsPerPage,
      
          after: null,
        }),
      });

      const data = await response.json();
      const format = formatProducts(data);
      setPaging(format);
      setProductsLoading(false);
    } catch (error) {
      setProductsLoading(false);
  
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [productData, setProductData] = useState(null);


  function defineProductData(currentIndex) {


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
        productViewCache.set("cashedProductIndex", index.toString());
      }
    }
  }

  function defineProductsData(productsData) {
    setProductsData({ ...productsData });
  }

  useEffect(() => {
    if (location.pathname === "/product-details") {
      if (!productsData) {
        fetchData();
        return;
      }

      const cashedProductIndex = productViewCache.get("cashedProductIndex");

      // If both productData and cashedProductData are unavailable and the current route is "product-detail"

      if (productsData === null && location.pathname === "/product-details") {
        fetchData();
        const index = productViewCache.get("cashedProductIndex");
        console.log("product Index:", index);
        if (index >= 0) {
          setProductData(productsData.productsData[index]);
        } else {
          navigate("/"); // Navigate to the root of the application
        }
      }

      if (productData === null && cashedProductIndex !== null) {
        // Parse the cashedProductIndex to an integer before using it
        const index = parseInt(cashedProductIndex, 10);
        defineProductData(index);
      }
    }
  }, [location.pathname, navigate]);

  function updateProductProperty(prop, value) {
    const updatedProduct = { ...productData, [prop]: value };

    // Find the index of the current productData in productsData
    const arr = productsData.productsData.map((product) =>
      product.id === productData.id ? updatedProduct : product
    );

    // Create a new array with the updated productData
    const updatedProductsData = [...arr];

    // Update the state with the new productData and productsData
    setProductData({ ...updatedProduct });
    setPaging({ ...productsData, productsData: [...arr] });

    console.log("updated product property", productsData);
  }

  const value = {
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
  };

  return (
    <ProductDataContext.Provider value={value}>
      {children}
    </ProductDataContext.Provider>
  );
}
