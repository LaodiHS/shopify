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

import { ListComponent } from "./ListComponent";
import { useProductDataContext, IonicHeaderComponent } from "../components";
export function ProductsCard({ animationRef }) {
  const [products, setProducts] = useState([]);

 

  const {
    uncachedFetchData,
    isProductsLoading,
    setProductsLoading,
    currentIndexPage,
    productsPerPage,
    hasNextIndexPage,
    productsData,
    setPaging,
    pagingHistory,
    formatProducts,
    pageIngCache,

  } = useProductDataContext();

  useEffect(() => {
    setProducts(productsData.productsData || []);
  }, [productsData.productsData]);

  const handleNextPage = async () => {
    console.log('handleNextPage')
    setProductsLoading(true);
    if (productsData?.pageInfo?.hasNextPage) {
      const { endCursor } = productsData.pageInfo;
      if (await pagingHistory.hasNextPage()) {
        const cached =  await pageIngCache.getPage( await pagingHistory.getNextPage());
        const formattedData = cached;
  
       await setPaging(formattedData);
        setProductsLoading(false);
    
      }

      try {
        const response = await uncachedFetchData({
          url: "/api/products/paging",
          method: "POST",
          body: {
            first: productsPerPage,
            after: endCursor,
          },
        });
        console.log("data", response);
        const data = await response;
        const format = formatProducts(data);
      await setPaging(format);

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
      await pagingHistory?.hasPreviousPage()
    );  
    setProductsLoading(true);
    if (
      productsData?.pageInfo?.hasPreviousPage &&
    await  pagingHistory?.hasPreviousPage()
    ) {
    
      const cachedData = await pageIngCache.getPage(await pagingHistory.getPreviousPage());
      console.log("cachedData", cachedData);
      const formattedData = cachedData;
     await setPaging(formattedData);
 
    }
         setProductsLoading(false);
  };

  // console.log('isProductsLoading', isProductsLoading)
  // if (isProductsLoading) {
  //   return <SkeletonComponent />;
  // }

  return (
    <IonPage ref={(el) => {
      animationRef.current = el; // Attach the IonPage element to animationRef
      // Forward the ref to the parent component
    }}>
    
      <IonicHeaderComponent
      type={isProductsLoading ? 'indeterminate' : 'determinate'}
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
             isProductsLoading   ||   !hasNextIndexPage|| !products.length
              }
            >
              Next
              <IonIcon icon={chevronForward} />
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
    productsData,
  } = useProductDataContext();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(productsData.productsData || []);
  }, [productsData.productsData]);
  if (isProductsLoading) {
    return <SkeletonComponent />;
  }

  if (products.length > 0) {
   
    return <ListComponent productsData={productsData.productsData} />;
  }

  if (products.length === 0) {
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

  const {
   
    productsPerPage
    

  } = useProductDataContext();
  // Define the number of skeleton items to render (should match the number of products)
// Change this to your desired number
  const [cardTitleStyle, setCardTitleStyle] = useState({
    fontSize: "1.8vw", // Use relative 'rem' unit for font size
    fontWeight: "bold",
    fontFamily:"baloo",
    whiteSpace: "normal",
    wordWrap: "break-word",
    minHeight: "200px",
    maxHeight: "200px"
  });
  const mainImageStyles = {
    height: "100%",
    maxHeight: "100%",
    minHeight: "200px",
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
  };
  return (
    <IonContent>
      <IonGrid>
        <IonRow>
          {[...Array(productsPerPage).keys()].map((productIndex) => (
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
                    <IonSkeletonText animated style={{ width: "80%" ,height:"30px" }} />
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="6" sizeMd="12" sizeSm="12">
                        <IonSkeletonText
                          animated
                          style={{ ...mainImageStyles }}
                        />
                      </IonCol>
                      <IonCol size="6" sizeMd="12" sizeSm="12">
                        <IonSkeletonText animated style={{ width: "80%" }} />
                        <IonSkeletonText animated style={{ width: "70%" }} />
                        <IonSkeletonText animated style={{ width: "80%" }} />
                        <IonSkeletonText animated style={{ width: "50%" }} />
                        <IonSkeletonText animated style={{ width: "80%" }} />
                        <IonSkeletonText animated style={{ width: "70%" }} />
                        <IonSkeletonText animated style={{ width: "80%" }} />
                        <IonSkeletonText animated style={{ width: "30%" }} />
                        <IonSkeletonText animated style={{ width: "80%" }} />
                        <IonSkeletonText animated style={{ width: "40%" }} />
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
