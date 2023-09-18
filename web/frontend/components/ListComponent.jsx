import React, { useState, useEffect, useRef } from "react";

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
  ImageCache,
  ImageCachePre,
  AnimatedContent,
} from "../components";
import { deskLamp, pictures} from "../assets";
export function ListComponent({}) {
  const { DataProviderNavigate } = useDataProvidersContext();
  const { productsData, defineProductData } = useProductDataContext();

  const [products, setProducts] = useState([]);
  const elementRefs = useRef([]);
  const [mainDisplayImages, setMainDisplayImages] = useState({});

  const handleThumbnailClick = (productIndex, imageIndex) => {
    setMainDisplayImages((prev) => {
      return {
        ...mainDisplayImages,
        [productIndex]: {
          img: products[productIndex].images[imageIndex].transformedSrc,
          index: imageIndex,
        },
      };
    });
  };

  useEffect(() => {}, [products]);

  useEffect(() => {
    setProducts(productsData.productsData);

    const mainImagesSrc = productsData?.productsData?.reduce(
      (acc, product, productIndex) => {
        acc[productIndex] = {
          img:
            product?.images[0]?.transformedSrc ||
            "https://placehold.co/300x200?text=No+Image+Available",
          index: 0,
        };
        return acc;
      },
      {}
    );
    setMainDisplayImages(mainImagesSrc);
    elementRefs.current = elementRefs.current.slice(
      0,
      productsData.productsData.length
    );
  }, [productsData.productsData]);

  const createNarrative = (e, item, index, ref) => {
    AnimatedContent({ current: ref }, "fadeOutTopRight", {
      duration: 0.3,
      onComplete: () => {
        ref.style.display = "none";
        defineProductData(index);
        DataProviderNavigate(
          "/product-details",
          { target: "host" },
          {
            initialViewAnimation: "fadeOutLeft",
            endingViewAnimation: "fadeInRight",
          }
        );
      },
    });
  };

  const cardTitleStyle = {
    fontSize: "1.2rem", // Use relative 'rem' unit for font size
    fontWeight: "bold",
    whiteSpace: "normal",
    wordWrap: "break-word",
  };
  const parentKeyScope = "ListComponet";

  return (
    <IonContent key={parentKeyScope + "ionContent----"}>
      <IonGrid key={parentKeyScope + "iongrid----"}>
        <IonRow key={parentKeyScope + "ionrow----"}>
          {products.map((product, productIndex) => {
            if (!mainDisplayImages[productIndex]?.img) {
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
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                          </IonCol>
                          <IonCol size="6" sizeMd="12" sizeSm="12">
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                          </IonCol>
                          <IonCol size="6" sizeMd="12" sizeSm="12">
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              style={{ width: "80%" }}
                            />
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              );
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
                <IonCard
                  ref={(e) => (elementRefs.current[productIndex] = e)}
                  key={productIndex + "ionCard"}
                >
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
                       
                          <ImageCache style={{minHeight:"300px"}}
                            key={`imageProductTitleImageCache_${productIndex}`}
                            src={mainDisplayImages[productIndex]?.img}
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
                                key={
                                  `thumbnail_${productIndex}_${imageIndex}` +
                                  image.transformedSrc
                                }
                                src={image.transformedSrc}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  border:
                                    imageIndex ===
                                    mainDisplayImages[productIndex].index
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
                          <ul
                            key={productIndex + "wordBreak"}
                            style={{ wordBreak: "break-word" }}
                          >
                            {product.variants.slice(0, 5).map((variant) => (
                              <li key={productIndex + variant.id}>
                                {variant.title} - ${variant.price} (
                                {variant.inventoryQuantity} in stock)
                              </li>
                            ))}
                            {product.variants.length > 5 && <li>...</li>}
                          </ul>
                          <h4 key={productIndex + "Options3232"}>Options:</h4>
                          <ul
                            key={productIndex + "break-word"}
                            style={{ wordBreak: "break-word" }}
                          >
                            {product.options.slice(0, 5).map((option, indx) => (
                              <li key={productIndex + indx + 1}>
                                {option.name}: {option.values.join(", ")}
                              </li>
                            ))}
                            {product.options.length > 5 && (
                              <li key={productIndex + indx + 2}>...</li>
                            )}
                          </ul>
                          <h4 key={productIndex + "Collections"}>
                            Collections:
                          </h4>
                          <ul
                            key={productIndex + "UlCollectionsTitle"}
                            style={{ wordBreak: "break-word" }}
                          >
                            {product.collections
                              .slice(0, 5)
                              .map((collection, index) => (
                                <li key={productIndex + collection.id + index}>
                                  {collection.title}
                                </li>
                              ))}
                            {product.collections.length > 5 && (
                              <li
                                key={
                                  productIndex +
                                  "collection.id + index li " +
                                  "..."
                                }
                              >
                                ...
                              </li>
                            )}
                          </ul>
                          <div
                            key={productIndex + "flex + flex-end_34"}
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <IonButtons
                              key={productIndex + "desklampIonButtons"}
                            >
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
                                key={productIndex + product.id}
                                fill="clear"
                                onClick={(e) =>
                                  createNarrative(
                                    e,
                                    product,
                                    productIndex,
                                    elementRefs.current[productIndex]
                                  )
                                }
                                expand="block"
                                size="small"
                                color="warning"
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
