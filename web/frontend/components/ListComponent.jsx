import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
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
} from "@ionic/react";

function parseHTML(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.innerText;
}

export function ListComponent({ data }) {
  const navigate = useNavigate();

  const createNarrative = (item) => {
    console.log("item", item);
    navigate("/productdetail", { state: JSON.stringify(item) });
  };
  const [selectedImages, setSelectedImages] = useState([]);
  const handleThumbnailClick = (productIndex, imageIndex) => {
    setSelectedImages((prevSelectedImages) => {
      const newSelectedImages = [...prevSelectedImages];
      newSelectedImages[productIndex] = imageIndex;
      return newSelectedImages;
    });
  };


  //clears the image data on load when paging
  useEffect(() => {
    const initialSelectedImages = data.map(() => 0);
    setSelectedImages(initialSelectedImages);
  }, [data]);

  return (
    <>
      {data.map((product, productIndex) => {
        const { images } = product;
        const selectedImageIndex = selectedImages[productIndex];

        return (
          <IonCard key={productIndex}>
            <IonCardHeader>
              <IonCardTitle>{product.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" size-md="6">
                    <IonImg
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
                          key={imageIndex}
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
                  <IonCol size="12" size-md="6">
                    <p>{product.description}</p>
                    <IonBadge color="secondary">
                      {product.tags.join(", ")}
                    </IonBadge>
                    <h4>Variants:</h4>
                    <ul>
                      {product.variants.map((variant) => (
                        <li key={variant.id}>
                          {variant.title} - ${variant.price} (
                          {variant.inventoryQuantity} in stock)
                        </li>
                      ))}
                    </ul>
                    <h4>Options:</h4>
                    <ul>
                      {product.options.map((option) => (
                        <li key={option.id}>
                          {option.name}: {option.values.join(", ")}
                        </li>
                      ))}
                    </ul>
                    <h4>Collections:</h4>
                    <ul>
                      {product.collections.map((collection) => (
                        <li key={collection.id}>{collection.title}</li>
                      ))}
                    </ul>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <IonButton fill="clear" onClick={()=>createNarrative(product)} expand="block" size="large">
                        Create a Narrative
                      </IonButton>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        );
      })}
    </>
  );
}