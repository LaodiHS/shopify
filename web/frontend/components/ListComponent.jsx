import React, { useState, useEffect, useMemo, useRef } from "react";
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
  useCurrentScreenWidth,
} from "../components";
import { alertCircleOutline } from "ionicons/icons";
import { deskLamp, imagePlaceHolder } from "../assets";

export function ListComponent({productsData}) {
  const [mainDisplayImages, setMainDisplayImages] = useState({});
  const [imgContainerHeight, setImgContainerHeight] = useState(
    new Array(100).fill("300px")
  );
  const {
    // productsData,
    defineProductData,
    DataProviderNavigate,
    eventEmitter,
    setProductsLoading,
  } = useProductDataContext();

  const [products, setProducts] = useState(productsData || []);

  const elementRefs = useRef([]);
  const cardWidthRef = useRef([]);
  const { cardDataStats, generateComplementaryColor, getColor } =
    useWinkDataContext();
  const [cardTitleStyle, setCardTitleStyle] = useState({
     fontSize: "1.8vw", // Use relative 'rem' unit for font size
    fontWeight: "normal",
    fontFamily: "baloo",
    whiteSpace: "normal",
    wordWrap: "break-word",
    minHeight: "110px",
    maxHeight: "900px",
  });

  const [mainImageStyles, setMainImageStyle] = useState({
    height: "100%",
    maxHeight: "100%",
    minHeight: "303px",
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
  });

  useEffect(() => {
    if (cardWidthRef.current.length > 0) {
      let i = 0;
      for (const ref of cardWidthRef.current) {
        imgContainerHeight[i] = 0.7202 * ref.offsetWidth + "px";
        i++;
      }

      setMainImageStyle((prev) => ({
        ...prev,
        maxHeight: 0.7162 * cardWidthRef.current[0].offsetWidth + "px",
        minHeight: 0.7162 * cardWidthRef.current[0].offsetWidth + "px",
      }));
      setImgContainerHeight((prev) => [...imgContainerHeight]);
    }
  }, [cardWidthRef.current]);

  const parentKeyScope = "ListComponent";

  const { GetFontSize, getCardRef } = useCurrentScreenWidth();

 

  useEffect(() => {
    setProductsLoading(true);
    setProducts(productsData);

    const mainImagesSrc = productsData?.reduce(
      (acc, product, productIndex) => {
        acc[productIndex] = {
          img: product?.images[0]?.transformedSrc || imagePlaceHolder,
          index: 0,
        };
        return acc;
      },
      {}
    );
    console.log("images changed", mainImagesSrc);

    setMainDisplayImages(mainImagesSrc);
    elementRefs.current = elementRefs.current.slice(
      0,
      productsData.length
    );
    setProductsLoading(false)
  }, [productsData]);

  function handleThumbnailClick(productIndex, imageIndex) {
    setProductsLoading(true);
    setMainDisplayImages((prev) => {
      return {
        ...mainDisplayImages,
        [productIndex]: {
          img: products[productIndex].images[imageIndex].transformedSrc,
          index: imageIndex,
        },
      };
    });
    setProductsLoading(false)
  }

  async function createNarrative(e, item, index, ref) {
    AnimatedContent({ current: ref }, "fadeOutUpBig", {
      duration: 0.3,
      onComplete: async () => {
        ref.style.display = "none";
        await defineProductData(index);
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
                      <IonCardTitle
                        key="IonSkeletonCard"
                        style={{ marginBottom: "56px" }}
                      >
                        <IonSkeletonText
                          key="IonSkeleton1"
                          animated
                          style={{ ...mainImageStyles }}
                        />
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent key="IonSkeleton2">
                      <IonGrid key="IonSkeleton3">
                        <IonRow key="IonSkeleton4">
                          <IonCol
                            key="IonSkeleton5"
                            size="6"
                            sizeMd="12"
                            sizeSm="12"
                          >
                            <IonSkeletonText
                              key="IonSkeleton6"
                              animated
                              style={{ width: "1600px", height: "1600px" }}
                            />
                          </IonCol>
                          <IonCol
                            key="IonSkeleton6"
                            size="6"
                            sizeMd="12"
                            sizeSm="12"
                          >
                            <IonSkeletonText
                              key="IonSkeleton7"
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              key="IonSkeleton8"
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              key="IonSkeleton9"
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              key="IonSkeleton10"
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              key="IonSkeleton11"
                              animated
                              style={{ width: "80%" }}
                            />
                          </IonCol>
                          <IonCol size="6" sizeMd="12" sizeSm="12">
                            <IonSkeletonText
                              key="IonSkeleton12"
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              key="IonSkeleton13"
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              key="IonSkeleton14"
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              key="IonSkeleton15"
                              animated
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              key="IonSkeleton16"
                              animated
                              style={{ width: "80%" }}
                            />
                          </IonCol>
                          <IonCol
                            size="6"
                            sizeMd="12"
                            sizeSm="12"
                            key="IonSkeleton17"
                          >
                            <IonSkeletonText
                              animated
                              key="IonSkeleton18"
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              key="IonSkeleton19"
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              key="IonSkeleton20"
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              key="IonSkeleton21"
                              style={{ width: "80%" }}
                            />
                            <IonSkeletonText
                              animated
                              key="IonSkeleton22"
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
                size="auto"
                sizeLg="auto"
                sizeMd="6"
                sizeSm="12"
                sizeXl="3"
                sizeXs="auto"
              >
                <IonCard
                  ref={(ref) => {
                    if(ref){
                    getCardRef(ref, productIndex),
                      (elementRefs.current[productIndex] = ref);
                    cardWidthRef.current[productIndex] = ref;
                    }
                  }}
                  key={productIndex + "ionCard"}
                >
                  <IonCardHeader key={productIndex + "ionCardHeader"}>
                    <GetFontSize
                      key="fontSize"
                      index={productIndex }
                      Element={
                        <IonCardTitle
                          key={productIndex + "ionCardTitle"}
                          style={cardTitleStyle}
                          className="ion-padding ion-text-capitalize"
                        >
                          {product.title.length > 100
                            ? product.title.substring(0, 100) + "..."
                            : product.title}
                        </IonCardTitle>
                      }
                    />
                    <IonCardSubtitle
                      key="cardSubTitle"
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
                          <IonCol
                            size="12"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              height: imgContainerHeight[productIndex],
                              maxHeight: imgContainerHeight[productIndex],
                              minHeight: imgContainerHeight[productIndex],
                            }}
                          >
                            <ImageCache
                              style={mainImageStyles}
                              key={`mainProductImage_${productIndex}`}
                              src={mainDisplayImages[productIndex]?.img}
                            />
                          </IonCol>
                          <IonCol className="ion-padding"
                            key={
                              productIndex + "displayContainer" + parentKeyScope
                            }
                            size="12"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              Top: "10px",
                            }}
                          >
                            <IonRow style={{ display:"flex",    
                                 justifyContent:"center"}}>
                          
                            {images.map((image, imageIndex) => {
                              const sliderImageStyles = {
                                display:"flex",    
                                 justifyContent:"center",
                                height: "60px",
                                width: "60px",
                                minHeight: "60px",
                                minWidth: "60px",
                           
                                cursor: "pointer",
                                border:
                                  imageIndex ===
                                  mainDisplayImages[productIndex].index
                                    ? "2px solid blue"
                                    : "none",
                              };

                              return (
                                <IonCol key={imageIndex + "thumbnailPick"} size= "1"  style={sliderImageStyles}>
                                <ImageCache 
                                  sliderImg={true}
                                  key={`thumbnail_${imageIndex}`}
                                  src={image.transformedSrc}
                                  style={{   
                                  height: "50px",
                                  width: "50px",
                                  minHeight: "50px",
                                  minWidth: "50px"
                                }}
                                  // style={sliderImageStyles}
                                  onClick={() => {
                                    image.transformedSrc !==
                                      mainDisplayImages[productIndex]?.img &&
                                      handleThumbnailClick(
                                        productIndex,
                                        imageIndex
                                      );
                                  }}
                                />
                                </IonCol>
                              );
                            })}</IonRow>
                          </IonCol>
                        </IonCol>
                        <IonCol
                          key={product.description + productIndex}
                          size="12"
                          sizeMd="12"
                          sizeSm="12"
                        >
                          <p
                            key={product.description + productIndex + "p"}
                            className="ion-text-wrap"
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
