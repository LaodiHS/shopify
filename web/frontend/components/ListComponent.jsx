import React, { useState, useEffect, useRef } from "react";
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
  IonChip,

} from "@ionic/react";

import {
  useProductDataContext,
  useDataProvidersContext,
  ImageCache,
  AnimatedContent,
  useWinkDataContext,

} from "../components";
import { alertCircleOutline } from "ionicons/icons";
import { deskLamp,  imagePlaceHolder } from "../assets";

export function ListComponent() {



  const { productsData, defineProductData } = useProductDataContext();


  const [products, setProducts] = useState([]);
  const [mainDisplayImages, setMainDisplayImages] = useState({});
  const elementRefs = useRef([]);
  const { DataProviderNavigate } = useDataProvidersContext();
  const { cardDataStats, generateComplementaryColor, getColor } =
    useWinkDataContext();
  const [cardTitleStyle, setCardTitleStyle] = useState({
    fontSize: "1.2rem", // Use relative 'rem' unit for font size
    fontWeight: "bold",
    whiteSpace: "normal",
    wordWrap: "break-word",
  });
  const parentKeyScope = "ListComponent";
  useEffect(() => {}, [products]);

  useEffect(() => {
    setProducts(productsData.productsData);


    const mainImagesSrc = productsData?.productsData?.reduce(
      (acc, product, productIndex) => {
        acc[productIndex] = {
          img:
            product?.images[0]?.transformedSrc
              ||imagePlaceHolder
            ,
          index: 0,
        };
        return acc;
      },
      {}
    );
    console.log('images changed', mainImagesSrc)
    setMainDisplayImages(mainImagesSrc);
    elementRefs.current = elementRefs.current.slice(
      0,
      productsData.productsData.length
    );
  }, [productsData.productsData]);

  
  function handleThumbnailClick(productIndex, imageIndex) {
    setMainDisplayImages((prev) => {
      return {
        ...mainDisplayImages,
        [productIndex]: {
          img: products[productIndex].images[imageIndex].transformedSrc,
          index: imageIndex,
        },
      };
    });
  }

  async function createNarrative(e, item, index, ref) {
    AnimatedContent({ current: ref }, "fadeOutUpBig", {
      duration: 0.3,
      onComplete: async () => {
        ref.style.display = "none";
        defineProductData(index);
        await DataProviderNavigate(
          "/product-details",
          { target: "host" },
          {
            initialViewAnimation: "fadeOutLeft",
            endingViewAnimation: "fadeInRight",
          }
        );
      },
    });
  }

  return (
    <IonContent key={parentKeyScope + "ionContent"}>
      <IonGrid key={parentKeyScope + "ionGrid"}>
        <IonRow key={parentKeyScope + "ionRow"}>
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
                  <IonCard key="listComponentCard">
                    <IonCardHeader key="IonCardHeader">
                      <IonCardTitle style={{ marginBottom: "16px" }}>
                        <IonSkeletonText 
                          animated
                          style={{ height: "300px", width: "80%" }}
                        />
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
            const cardStats = cardDataStats(product.description);

            const sentiment = cardStats.readabilityStats().sentiment;
            const percentageTagsMatch = cardStats.metaTagPMatchTextPercent(
              product.tags
            );

            const { images } = product;

            return (
              <IonCol
                key={productIndex + "ionCol"}
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
                      key={productIndex + "ionCardTitle"}
                      style={cardTitleStyle}
                      className="ion-padding"
                    >
                      {product.title.length > 100
                        ? product.title.substring(0, 100) + "..."
                        : product.title}
                    </IonCardTitle>
                    <IonCardSubtitle
                      style={{ color: getColor(sentiment.score) }}
                    >
                      SEO Health: {sentiment.status}{" "}
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent key={productIndex + "cardContent"}>
                    <IonGrid key={`imageProductTitleImageGrid_${productIndex}`}>
                      <IonRow key={productIndex + "row"}>
                        <IonCol
                          key={productIndex + "col"}
                          size="12"
                          sizeMd="12"
                          sizeSm="12"
                        >
            
                          <ImageCache
                            style={{ minHeight: "300px" }}
                            key={`imageProductTitleImageCache_${productIndex}`}
                            src={mainDisplayImages[productIndex]?.img }
                          />
                     
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
                            {images.map((image, imageIndex) => {
                              return (
                               
                              
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
                                    handleThumbnailClick(
                                      productIndex,
                                      imageIndex
                                    )
                                  }
                                />
                              
                              );
                            })}
                          </div>
                        </IonCol>
                        <IonCol
                          key={product.description + productIndex}
                          size="12"
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
                          <h4
                            key={productIndex + "sentiment"}
                            className="ion-padding-top"
                          >
                            Description Analysis:
                          </h4>

                          <IonItem lines="none">
                            <IonLabel
                              style={{ color: getColor(sentiment.score) }}
                              className="ion-text-wrap"
                            >
                              {sentiment.val}
                            </IonLabel>{" "}
                            <IonIcon
                              size="large"
                              style={{
                                wordBreak: "break-word",
                                color: getColor(sentiment.score),
                              }}
                              icon={
                                sentiment.score <= 0.39
                                  ? alertCircleOutline
                                  : ""
                              }
                            />
                          </IonItem>
                          {(product?.tags?.length || "") && (
                            <h4
                              key={productIndex + "Tags ion-padding-bottom"}
                              className="ion-padding-bottom ion-padding-top"
                            >
                              Tags :
                            </h4>
                          )}
                          <IonBadge
                            key={"tags" + productIndex + "ionBadge"}
                            style={{ wordBreak: "break-word" }}
                            className="ion-text-wrap"
                            color="secondary"
                          >
                            {product.tags.slice(0, 5).join(", ")}
                            {product.tags.length > 5 && <li>...</li>}
                          </IonBadge>

                          <h4
                            key={productIndex + "TagsMatch"}
                            className="ion-padding-top"
                          >
                            Tag Match:
                          </h4>

                          <IonItem lines="none">
                            <IonLabel
                              style={{
                                color: getColor(percentageTagsMatch / 100),
                              }}
                              className="ion-text-wrap"
                            >
                              {percentageTagsMatch}% of the tags match your
                              product description.
                            </IonLabel>
                            <IonIcon
                              size="large"
                              style={{
                                wordBreak: "break-word",
                                color: getColor(percentageTagsMatch / 100),
                              }}
                              icon={
                                percentageTagsMatch <= 50
                                  ? alertCircleOutline
                                  : ""
                              }
                            />
                          </IonItem>

                          <h4
                            key={productIndex + "variants"}
                            className="ion-padding-bottom ion-padding-top"
                          >
                            Variants:
                          </h4>
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
                            <IonButtons key={productIndex + "IonButtons"}>
                              <IonButton
                                fill="clear"
                                disabled={true}
                                size="large"
                                style={{
                                  backgroundImage: `url(${deskLamp})`,
                                  backgroundPosition: "right",
                                  backgroundSize: "contain",
                                  backgroundRepeat: "no-repeat",
                                  height: "80px",
                                  width: "200px",
                                }}
                              >
                                {" "}
                                {/* <IonIcon
                                  slot="icon-only"
                                  color="dark"
                                  icon={deskLamp}
                                ></IonIcon> */}
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
                                size="large"
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
