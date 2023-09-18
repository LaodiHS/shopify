import React, { useState, useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks";

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
import { ListComponent } from "./ListComponent";
import { useProductDataContext, IonicHeaderComponent } from "../components";
export function ProductsCard({ animationRef }) {
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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(productsData.productsData || []);
  }, [productsData.productsData]);

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
            after: endCursor,
          }),
        });
        console.log("data", response);
        const data = await response.json();
        const format = formatProducts(data);
        setPaging(format);
        setProductsLoading(false);
      } catch (error) {
        console.error("There was an Error getting the Data:", error);
        setProductsLoading(false);
      }
    }
  };

  const handlePreviousPage = async () => {
    console.log(
      " productsData?.pageInfo?.hasPreviousPage ",
      productsData?.pageInfo?.hasPreviousPage
    );
    console.log(
      "      pagingHistory?.hasPreviousPage()",
      pagingHistory?.hasPreviousPage()
    );
    if (
      productsData?.pageInfo?.hasPreviousPage &&
      pagingHistory?.hasPreviousPage()
    ) {
      setProductsLoading(true);
      const cachedData = pageIngCache.getPage(pagingHistory.getPreviousPage());
      console.log("cachedData", cachedData);
      const formattedData = cachedData;
      setPaging(formattedData);
      setProductsLoading(false);
    }
  };

  // console.log('isProductsLoading', isProductsLoading)
  // if (isProductsLoading) {
  //   return <SkeletonComponent />;
  // }

  return (
    <IonPage ref={animationRef}>
      <IonicHeaderComponent
        left={
          <IonButtons slot="secondary">
            <IonButton
            color="neural"
              fill="clear"
              size="small"
              className="ion-padding-end"
              onClick={handlePreviousPage}
              disabled={
                currentIndexPage === 0 || isProductsLoading || !products.length
              }
            >
              <IonIcon icon={chevronBack} />
              Previous
            </IonButton>
          </IonButtons>
        }
        centerText={"Product List"}
        right={
          <IonButtons slot="primary">
            <IonButton
             color="neural"
              fill="clear"
              size="small"
              className="ion-padding-start"
              onClick={handleNextPage}
              disabled={
                !hasNextIndexPage || isProductsLoading || !products.length
              }
            >
              Next
              <IonIcon icon={chevronForward}  />
            </IonButton>
          </IonButtons>
        }
      />

      <DisplayContents />
    </IonPage>
  );
}

function DisplayContents({}) {
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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(productsData.productsData || []);
  }, [productsData.productsData]);
  if (isProductsLoading) {
    return <SkeletonComponent />;
  }

  if (products.length > 0) {
    console.log("hit");
    return <ListComponent />;
  }

  if (products.lengthen == 0) {
    return (
      <div className="ion-padding ion-text-center">
        <IonText color="medium" className="ion-text-center">
          No products found.
        </IonText>
      </div>
    );
  }
  return null;
}

function SkeletonComponent() {
  // Define the number of skeleton items to render (should match the number of products)
  const numberOfSkeletonItems = 20; // Change this to your desired number

  return (
    <IonContent>
      <IonGrid>
        <IonRow>
          {[...Array(numberOfSkeletonItems).keys()].map((productIndex) => (
            <IonCol
              key={productIndex}
              size="12"
              sizeMd="6"
              sizeSm="12"
              sizeXl="3"
            >
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle style={{ marginBottom: "16px" }}>
                    <IonSkeletonText animated style={{ width: "80%" }} />
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="6" sizeMd="12" sizeSm="12">
                        <IonSkeletonText
                          animated
                          style={{ width: "100%", height: "150px" }}
                        />
                      </IonCol>
                      <IonCol size="6" sizeMd="12" sizeSm="12">
                        <IonSkeletonText animated style={{ width: "80%" }} />
                        <IonSkeletonText animated style={{ width: "80%" }} />
                        <IonSkeletonText animated style={{ width: "80%" }} />
                        <IonSkeletonText animated style={{ width: "80%" }} />
                        <IonSkeletonText animated style={{ width: "80%" }} />
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
