import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { Page, Layout, Image, Text } from "@shopify/polaris";
import { ListDetailComponent } from "./ListDetailComponent";
import { Context } from "../utilities/data-context";
import { PaidFeature, ProductsCard } from "../components";
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
  useIonViewWillEnter,
} from "@ionic/react";
import { useProductDataContext } from "../components";

export function ListComponent({  }) {
  const navigate = useNavigate();

  const createNarrative = (e, item, index) => {
    defineProductData(index);

    navigate("/product-details");
  };

  const [selectedImages, setSelectedImages] = useState([]);
  const handleThumbnailClick = (productIndex, imageIndex) => {
    setSelectedImages((prevSelectedImages) => {
      const newSelectedImages = [...prevSelectedImages];
      newSelectedImages[productIndex] = imageIndex;
      return newSelectedImages;
    });
  };

  const {
    isProductsLoading,
    setProductsLoading,
    productsData,
    defineProductData,
  } = useProductDataContext();
  useIonViewWillEnter(() => {
    // Your animation code here

    console.log("Component is about to enter the view.");
  });

  //clears the image data on load when paging
  useEffect(() => {
    const initialSelectedImages = productsData.productsData.map(() => 0);
    setSelectedImages(initialSelectedImages);
  }, [productsData]);

  const handleRenderElement = () => {};
console.log('isProductsLoading', isProductsLoading)
  if (isProductsLoading || !productsData || !productsData.productsData.length) {
    return (
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
      </IonContent>
    );
  }
  const cardTitleStyle = {
    fontSize: "1.2rem", // Use relative 'rem' unit for font size
    fontWeight: "bold",
    whiteSpace: "normal",
    wordWrap: "break-word",
  };

  return (
    <IonContent>
      <IonGrid>
        <IonRow>
          {productsData.productsData.map((product, productIndex) => {
            const { images } = product;
            const selectedImageIndex = selectedImages[productIndex];

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
                    <IonCardTitle
                      style={cardTitleStyle}
                      className="ion-padding"
                    >
                      {product.title.length > 100
                        ? product.title.substring(0, 100) + "..."
                        : product.title}
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid key={`imageProductTitleImageGrid_${productIndex}`}>
                      <IonRow>
                        <IonCol size="6" sizeMd="12" sizeSm="12">
                          <IonImg
                            key={`DisplayImageProductsDisplay_${productIndex}`}
                            src={
                              images[selectedImageIndex]?.transformedSrc ||
                              "https://placehold.co/300x200?text=No+Image+Available"
                            }
                          />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "10px",
                            }}
                          >
                            {images.map((image, imageIndex) => (
                              <IonImg
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
                        <IonCol size="6" sizeMd="12" sizeSm="12">
                          <p className="ion-text-wrap">
                            {product.description.length > 100
                              ? product.description.substring(0, 100) + "..."
                              : product.description}
                          </p>
                          <IonBadge
                            style={{ wordBreak: "break-word" }}
                            className="ion-text-wrap"
                            color="secondary"
                          >
                            {product.tags.slice(0, 5).join(", ")}
                            {product.tags.length > 5 && <li>...</li>}
                          </IonBadge>
                          <h4>Variants:</h4>
                          <ul style={{ wordBreak: "break-word" }}>
                            {product.variants.slice(0, 5).map((variant) => (
                              <li key={variant.id}>
                                {variant.title} - ${variant.price} (
                                {variant.inventoryQuantity} in stock)
                              </li>
                            ))}
                            {product.variants.length > 5 && <li>...</li>}
                          </ul>
                          <h4>Options:</h4>
                          <ul style={{ wordBreak: "break-word" }}>
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
                            <IonButton
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
