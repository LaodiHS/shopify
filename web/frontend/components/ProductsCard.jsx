import React, { useState, useEffect } from "react";
import { Card, TextContainer, Text, Button, Spinner } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch, products } from "../hooks";
import { ListComponent } from "./ListComponent";
import {
  IonButtons,
  IonContent,
  IonButton,
  IonSpinner,
  IonText,
} from "@ionic/react";
import {
  urlCache,
  pageIngCache,
  History,
  formatProducts,
} from "../utilities/store";

const pagingHistory = new History("pagingHistory");

export function ProductsCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndexPage, setCurrentIndexPage] = useState(pagingHistory.getCurrentIndex());
  const [hasNextIndexPage, setNextIndexPage] = useState(false);
  const fetch = useAuthenticatedFetch();

  const productsPerPage = 5;
  const [productData, setProductData] = useState(null);

  const setReactStates = (formattedData) => {
    setNextIndexPage(formattedData?.pageInfo?.hasNextPage);
   
    setProductData(formattedData);
    setCurrentIndexPage(pagingHistory.getCurrentIndex());
    setIsLoading(false);
  };

  const setPaging = (data) => {
    const formattedData = formatProducts(data);
    const { startCursor } = formattedData.pageInfo;
    pageIngCache.setPage(startCursor, data);
    if (!pagingHistory.includes(startCursor)) {
       pagingHistory.push(startCursor);
     }
   
    setReactStates(formattedData);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      if (pagingHistory.hasCurrentPage()) {
        const cachedData = pageIngCache.getPage(pagingHistory.getCurrentPage());
        if (cachedData) {
        // setPaging(cachedData)
          const formattedData = formatProducts(cachedData);
          setReactStates(formattedData);
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
            before: "",
            after: "",
          }),
        });

        const data = await response.json();
        setPaging(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave this page?";
      window.addEventListener("unload", clearLocalStorage);
    };

    const clearLocalStorage = () => {
       localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleNextPage = async () => {
    setIsLoading(true);

    if (productData?.pageInfo?.hasNextPage) {
      const { endCursor } = productData.pageInfo;

      if (pagingHistory.hasNextPage()) {
        const cached = pageIngCache.getPage(pagingHistory.getNextPage());
        const formattedData = formatProducts(cached);
        setReactStates(formattedData);
        return;
      }

      try {
        const response = await fetch("/api/products/paging", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first: productsPerPage,
            before: "",
            after: endCursor,
          }),
        });

        const data = await response.json();
        setPaging(data);
      } catch (error) {
        console.error("There was an Error getting the Data:", error);
      }
    }
  };

  const handlePreviousPage = async () => {
    setIsLoading(true);
    if (
      productData?.pageInfo?.hasPreviousPage &&
      pagingHistory?.hasPreviousPage()
    ) {
      const cachedData = pageIngCache.getPage(pagingHistory.getPreviousPage());
      const formattedData = formatProducts(cachedData);
      setReactStates(formattedData);
    }
  };
  const dataArray = isLoading ? [] : productData;
  // const productsList = { pageTitle: "products", sections: dataArray };

  return (
    <>
      <div
        className="ion-padding"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <IonButton
          fill="clear"
          className="ion-padding-end"
          onClick={handlePreviousPage}
          disabled={currentIndexPage === 0}
        >
          Previous Page
        </IonButton>
        <IonButton
          fill="clear"
          className="ion-padding-start"
          onClick={handleNextPage}
          disabled={!hasNextIndexPage}
        >
          Next Page
        </IonButton>
      </div>
      {isLoading ? (
        <div
          className="ion-padding"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <IonSpinner color="primary" />
        </div>
      ) : dataArray.length > 0 ? (
        <ListComponent data={dataArray} />
      ) : (
        <div className="ion-padding">
          <IonText color="medium" className="ion-text-center">
            No products found.
          </IonText>
        </div>
      )}
    </>
  );
}
