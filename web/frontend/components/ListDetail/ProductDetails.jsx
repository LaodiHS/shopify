import React,{useEffect, useState} from "react";

import {
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonImg,
  IonContent,
  IonTextarea,
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
  IonList,
  IonBadge,
} from "@ionic/react";

import { useNavigate } from "react-router-dom";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";

const handleProductDescriptionUpdate = async (productId, descriptionHtml) => {
  const fetch = useAuthenticatedFetch();
  const response = await fetch("/api/products/update/description", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: productId,
      descriptionHtml: descriptionHtml,
    }),
  });

  console.log("response", response);

  if (response.ok) {
    //  await refetchProductCount();
  }
};

const handleProductMetafieldsUpdate = async (variantId, metaFieldsArray) => {
  const fetch = useAuthenticatedFetch();
  const response = await fetch("/api/products/update/description", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      variantId: variantId,
      dmetafieldsArray: metafieldsArray,
    }),
  });

  console.log("response", response.json());

  if (response.ok) {
    //  await refetchProductCount();
  }
};

export function ProductDetails({ handleIncludeChange, data }) {
  const [product, setProduct] = useState(data)

  const navigate = useNavigate();
 
  useEffect(() => {




    console.log('data----->', product);
    if (!product) {

      navigate("/")
    }





  }, [product, navigate])

  
if(!product){
  setProduct({})
  navigate("/");
return;
}
  const {
    images,
    title,
    description,
    handle,
    variants,
    options,
    tags,
    metafields,
  } = product;

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" size-md="4">
          {images.length ? images
            .slice(0, 1)
            .map((image, index) => (
              <IonImg
                key={index}
                className={`ion-padding ${index > 0 ? "ion-hide-sm-down" : ""}`}
                src={image.transformedSrc}
                alt={title}
              />
            )) :(
            <IonImg className="ion-padding" src="https://placehold.co/300x200?text=No+Image+Available" />
          )}

          <IonLabel className="ion-padding">{title}</IonLabel>
        </IonCol>
        <IonCol key={"aaa"} size="12" size-md="8">
          <IonItem>
            <IonTextarea
              label="Product Title"
              label-placement="stacked"
              aria-label="description"
              autoGrow={true}
              style={{ fontSize: "12px" }}
              value={title}
              readonly
            />
            <IonRadioGroup
              onIonChange={(e) =>
                handleIncludeChange(e, {
                  title: e?.detail?.value ? title : "delete",
                })
              }
              allowEmptySelection={true}
            >
              <IonRadio color="success" value="include">
                include
              </IonRadio>
            </IonRadioGroup>
          </IonItem>

          <IonItem>
            <IonTextarea
              label="Description"
              label-placement="stacked"
              aria-label="description"
              value={description || "no description"}
              autoGrow={true}
              style={{ fontSize: "12px" }}
              className="ion-text-wrap ion-padding-end"
              readonly
            />

            <IonRadioGroup
              allowEmptySelection={true}
              onIonChange={(e) =>
                handleIncludeChange(e, {
                  "product-description": e?.detail?.value
                    ? description
                    : "delete",
                })
              }
            >
              <IonRadio color="success" value="include">
                include
              </IonRadio>
            </IonRadioGroup>
          </IonItem>
          {options &&
            options.map((option, index) => {
              const { name, values } = option;
              return (
                <IonItem key={index}>
                  <IonTextarea
                    key={index}
                    label={name}
                    label-placement="stacked"
                    aria-label={name}
                    autoGrow={true}
                    style={{ fontSize: "12px" }}
                    value={values.join(" ")}
                    readonly
                  />

                  <IonRadioGroup
                    key={index + name}
                    allowEmptySelection={true}
                    onIonChange={(e) =>
                      handleIncludeChange(e, {
                        productOptions: e?.detail?.value
                          ? name + "s: " + values.join(" , ")
                          : "delete",
                      })
                    }
                  >
                    <IonRadio
                      key={values.join()}
                      color="success"
                      value="include"
                    >
                      include
                    </IonRadio>
                  </IonRadioGroup>
                </IonItem>
              );
            })}

          {variants &&
            variants.map((variant, index) => {
              const {
                id,
                namespace,
                value,
                price,
                inventoryQuantity,
                title,
                weight,
                weightUnit,
              } = variant;

              const description = `price: $${price} | inventory: ${inventoryQuantity} | weight: ${weight} ${weightUnit}`;

              return (
                <IonItem key={title}>
                  <IonTextarea
                    key={description}
                    label={title}
                    label-placement="stacked"
                    aria-label="description"
                    autoGrow={true}
                    style={{ fontSize: "12px" }}
                    value={description}
                    readonly
                  />

                  <IonRadioGroup
                    key={id}
                    allowEmptySelection={true}
                    onIonChange={(e) =>
                      handleIncludeChange(e, {
                        ["option-" + title]: e?.detail?.value
                          ? description
                          : "delete",
                      })
                    }
                  >
                    <IonRadio color="success" value="include">
                      include
                    </IonRadio>
                  </IonRadioGroup>
                </IonItem>
              );
            })}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
