import React, { useState, useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { ListComponent } from "./ListComponent";
import { useProductDataContext } from "../components";
import { useNavigate } from "react_router_dom";
import {
  IonSpinner,
  IonText,
  IonButton,
  IonButtons,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonHeader,
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import { pageIngCache, History, formatProducts } from "../utilities/store";

export function ProductsCard() {
  const pagingHistory = History;
  const fetch = useAuthenticatedFetch();



  const productsPerPage = 20;


  const {
    isProductsLoading,
    setProductsLoading,
    currentIndexPage,
    defineCurrentIndexPage,
    hasNextIndexPage,
    defineNextIndexPage,
    productsData,
    defineProductsData,
  
    setPaging,
  } = useProductDataContext();




  const handleNextPage = async () => {

    setProductsLoading(true);
    if (productsData?.pageInfo?.hasNextPage) {
      const { endCursor } = productsData.pageInfo;
      if (pagingHistory.hasNextPage()) {
        const cached = pageIngCache.getPage(pagingHistory.getNextPage());
        const formattedData = cached;
        setPaging(formattedData);
        setProductsLoading(false);
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
            after: endCursor
          }),
        });

        const data = await response.json();
        const format = formatProducts(data);
        setPaging(format);
        setProductsLoading(false);
      } catch (error) {
        setProductsLoading(false);
        console.error("There was an Error getting the Data:", error);
      }
    }
  };

  const handlePreviousPage = async () => {
  

    if (
      productsData?.pageInfo?.hasPreviousPage &&
      pagingHistory?.hasPreviousPage()
    ) {
      setProductsLoading(true);
      const cachedData = pageIngCache.getPage(pagingHistory.getPreviousPage());
      const formattedData = cachedData;
      setPaging(formattedData); 
      setProductsLoading(false);
    }
  
  };

  

  // console.log('isProductsLoading', isProductsLoading)
  if (isProductsLoading || !productsData || !productsData.productsData.length) {
    return (
      <IonPage>
      <IonContent>
        <IonGrid style={{ height: "100vh" }}>
          <IonRow
            className="ion-justify-content-center ion-align-items-center"
            style={{ height: "100%" }}
          >
            <IonCol size="auto">
              <IonSpinner
                style={{ width: "100px", height: "100px" }}
                color="tertiary"
              ></IonSpinner>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent></IonPage>
    );
  }
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="secondary">
            <IonButton
              fill="clear"
              size="small"
              className="ion-padding-end"
              onClick={handlePreviousPage}
              disabled={currentIndexPage === 0}
            >
              <IonIcon icon={chevronBack} />
              Previous
            </IonButton>
          </IonButtons>
          <IonButtons slot="primary">
            <IonButton
              fill="clear"
              size="small"
              className="ion-padding-start"
              onClick={handleNextPage}
              disabled={!hasNextIndexPage}
            >
              Next
              <IonIcon icon={chevronForward} />
            </IonButton>
          </IonButtons>
          <IonTitle>Product List</IonTitle>
        </IonToolbar>
      </IonHeader>

      {!isProductsLoading && productsData.productsData.length > 0 ? (
        <ListComponent />
      ) : (
        <div className="ion-padding">
          <IonText color="medium" className="ion-text-center">
            No products found.
          </IonText>
        </div>
      )}
    </IonPage>
  );
}
