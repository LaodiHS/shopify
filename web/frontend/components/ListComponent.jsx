import React, { useState, useEffect } from "react";

import { useNavigate } from "react_router_dom";
import { Page, Layout, Image, Text } from "@shopify/polaris";
import { ListDetailComponent } from "./ListDetailComponent";
import { Context } from "../utilities/data-context";

import {
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
import {
  PaidFeature,
  ProductsCard,
  useProductDataContext,
  useDataProvidersContext,
  ImageCache,ImageCachePre
} from "../components";
import { deskLamp } from "../assets";
export function ListComponent({}) {
  const { DataProviderNavigate } = useDataProvidersContext();
  const {
    isProductsLoading,
    setProductsLoading,
    productsData,
    defineProductData,
  } = useProductDataContext();

  const navigate = useNavigate();

  const createNarrative = (e, item, index) => {
    defineProductData(index);

    DataProviderNavigate("/product-details", { target: "host" });
  };

  const [selectedImages, setSelectedImages] = useState([]);
  const handleThumbnailClick = (productIndex, imageIndex) => {
    setSelectedImages((prevSelectedImages) => {
      const newSelectedImages = [...prevSelectedImages];
      newSelectedImages[productIndex] = imageIndex;
      return newSelectedImages;
    });
  };

  // useIonViewWillEnter(() => {
  //   // Your animation code here

  //   console.log("Component is about to enter the view.");
  // });
  const parentKeyScope = "ListComponet";
  //clears the image data on load when paging
  useEffect(() => {
    const initialSelectedImages = productsData.productsData.map(() => 0);
    setSelectedImages(initialSelectedImages);
  }, [productsData]);

  const handleRenderElement = () => {};
  console.log("isProductsLoading", isProductsLoading);
  if (isProductsLoading || !productsData || !productsData.productsData.length) {
    return <SkeletonComponent />;
  }
  const cardTitleStyle = {
    fontSize: "1.2rem", // Use relative 'rem' unit for font size
    fontWeight: "bold",
    whiteSpace: "normal",
    wordWrap: "break-word",
  };

  return (
    <IonContent key={parentKeyScope + "ionContent----"}>
      <IonGrid key={parentKeyScope + "iongrid----"}>
        <IonRow key={parentKeyScope + "ionrow----"}>
          {productsData.productsData.map((product, productIndex) => {
          
            const selectedImageIndex = selectedImages[productIndex];
    

           const imageSrc= product.images[selectedImageIndex]?.transformedSrc || "https://placehold.co/300x200?text=No+Image+Available"
         
           if(!imageSrc){
            return (
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
            )
           }

    const { images } = product;

            return (
              <IonCol
                key={productIndex + "ioncol126233"}
             
                size="12"
                sizeMd="6"
                sizeSm="12"
                sizeXl="3"
              >
                <IonCard key={productIndex + "ionCard"}>
                  <IonCardHeader key={productIndex + "ionCardHeader"}>
                    <IonCardTitle
                      key={productIndex + "ioncardtitle"}
                      style={cardTitleStyle}
                      className="ion-padding"
                    >
                      {product.title.length > 100
                        ? product.title.substring(0, 100) + "..."
                        : product.title}
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent key={productIndex + "cardContent"}>
                    <IonGrid key={`imageProductTitleImageGrid_${productIndex}`}>
                      <IonRow key={productIndex + "row"}>
                        <IonCol
                          key={productIndex + "col"}
                          size="6"
                          sizeMd="12"
                          sizeSm="12"
                        >
                          <ImageCache
                            key={`imageProductTitleImageCache_${productIndex}`}
                            src={
                              imageSrc
                            }
                          />
                          {/* <IonImg
                            key={`DisplayImageProductsDisplay_${productIndex}`}
                            src={
                              images[selectedImageIndex]?.transformedSrc ||
                              "https://placehold.co/300x200?text=No+Image+Available"
                            }

                          /> */}
                          <div
                            key={
                              productIndex + "displayContainer" + parentKeyScope
                            }
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              Top: "10px",
                            }}
                          >
                            {images.map((image, imageIndex) => (
                              <ImageCache
                                sliderImg={true}
                                key={`thumbnail_${productIndex}_${imageIndex}`}
                                src={image.transformedSrc}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  border:
                                    imageIndex === selectedImageIndex
                                      ? "2px solid blue"
                                      : "none",
                                  marginRight: "5px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleThumbnailClick(productIndex, imageIndex)
                                }
                              />
                            ))}
                          </div>
                        </IonCol>
                        <IonCol
                          key={product.description + productIndex}
                          size="6"
                          sizeMd="12"
                          sizeSm="12"
                        >
                          <p
                            className="ion-text-wrap"
                            key={product.description + productIndex + "p"}
                          >
                            {product.description.length > 100
                              ? product.description.substring(0, 100) + "..."
                              : product.description}
                          </p>
                          <IonBadge
                            key={
                              product.description + productIndex + "ionBadge"
                            }
                            style={{ wordBreak: "break-word" }}
                            className="ion-text-wrap"
                            color="secondary"
                          >
                            {product.tags.slice(0, 5).join(", ")}
                            {product.tags.length > 5 && <li>...</li>}
                          </IonBadge>
                          <h4 key={productIndex + "variants"}>Variants:</h4>
                          <ul key={productIndex + "wordBreak"}style={{ wordBreak: "break-word" }}>
                            {product.variants.slice(0, 5).map((variant) => (
                              <li key={variant.id}>
                                {variant.title} - ${variant.price} (
                                {variant.inventoryQuantity} in stock)
                              </li>
                            ))}
                            {product.variants.length > 5 && <li>...</li>}
                          </ul>
                          <h4 key={productIndex + "Options3232"}>Options:</h4>
                          <ul  key={productIndex + "break-word"} style={{ wordBreak: "break-word" }}>
                            {product.options.slice(0, 5).map((option) => (
                              <li key={option.id}>
                                {option.name}: {option.values.join(", ")}
                              </li>
                            ))}
                            {product.options.length > 5 && <li>...</li>}
                          </ul>
                          <h4>Collections:</h4>
                          <ul style={{ wordBreak: "break-word" }}>
                            {product.collections
                              .slice(0, 5)
                              .map((collection, index) => (
                                <li key={collection.id}>{collection.title}</li>
                              ))}
                            {product.collections.length > 5 && <li>...</li>}
                          </ul>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <IonButtons>
                              <IonButton
                                fill="clear"
                                disabled={true}
                                size="large"
                              >
                                {" "}
                                <IonIcon
                                  slot="icon-only"
                                  color="dark"
                                  icon={deskLamp}
                                ></IonIcon>
                              </IonButton>
                              <IonButton
                                className="ion-padding-top ion-padding-right"
                                key={product.id}
                                fill="clear"
                                onClick={(e) =>
                                  createNarrative(e, product, productIndex)
                                }
                                expand="block"
                                size="small"
                              >
                                Enhance Content
                              </IonButton>
                            </IonButtons>
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            );
          })}
        </IonRow>
      </IonGrid>
    </IonContent>
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
