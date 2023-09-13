import React, { useState, useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { ListComponent } from "./ListComponent";
import { useProductDataContext } from "../components";
import { useNavigate } from "react_router_dom";
import {
  
  IonToolbar,

  IonTitle,
  IonHeader,


  IonItem,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonCard,
  IonListHeader,
  IonImg,
  IonThumbnail,
  IonSkeletonText,
  IonLabel,
  IonButtons,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonText,
  IonBadge,
  createAnimation,
  IonNavLink,
  IonContent,
  IonPage,
  IonSpinner,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import { pageIngCache, History, formatProducts } from "../utilities/store";

export function ProductsCard({animationRef}) {
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
      <SkeletonComponent />
          )
  }
  return (
    <IonPage  ref={animationRef} >
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


function SkeletonComponent() {
  // Define the number of skeleton items to render (should match the number of products)
  const numberOfSkeletonItems = 20; // Change this to your desired number

  return (
    <IonContent>
      <IonGrid>
        <IonRow>
          {[...Array(numberOfSkeletonItems).keys()].map((productIndex) => (
            <IonCol key={productIndex} size="12" sizeMd="6" sizeSm="12" sizeXl="3">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle style={{ marginBottom: '16px' }}>
                    <IonSkeletonText animated style={{ width: '80%' }} />
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="6" sizeMd="12" sizeSm="12">
                        <IonSkeletonText animated style={{ width: '100%', height: '150px' }} />
                      </IonCol>
                      <IonCol size="6" sizeMd="12" sizeSm="12">
                        <IonSkeletonText animated style={{ width: '80%' }} />
                        <IonSkeletonText animated style={{ width: '80%' }} />
                        <IonSkeletonText animated style={{ width: '80%' }} />
                        <IonSkeletonText animated style={{ width: '80%' }} />
                        <IonSkeletonText animated style={{ width: '80%' }} />
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </IonContent>
  );
}