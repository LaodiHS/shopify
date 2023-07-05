import React, { useRef, useEffect, useState } from "react";

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
  IonSelect,
  IonSelectOption,
  IonModal,
  IonButton,
  IonThumbnail,
  IonPopover,
  IonAvatar,
} from "@ionic/react";
import AppTypeahead from "./AppTypeahead";
import { Context, SharedData } from "../../utilities/data-context.js";
import { shortenText } from "../../utilities/utility-methods.js";
import { useNavigate } from "react-router-dom";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import {
  replaceSpacesWithUnderscore,
  updateObject,
} from "../../utilities/utility-methods.js";
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
let selectedOptions_ = {};
export function ProductDetails({ data }) {
  const [selectedOptions, setSelectedOptions] = useState({});

  const modal = useRef(null);

  const optionChange = (propName, data) => {
    if (data.length) {
      SharedData.includeProductDetails[propName] = data;
    } else {
      delete SharedData.includeProductDetails[propName];
    }

    if (!Object.entries(SharedData.includeProductDetails).length) {
      delete SharedData.serverOptions["included-product-details"];
    } else {
      SharedData.serverOptions["included-product-details"] =
        SharedData.includeProductDetails;
    }

    SharedData.includeProductDetails = { ...SharedData.includeProductDetails };

    setSelectedOptions(SharedData.includeProductDetails);
    const serverOptions = { ...SharedData.serverOptions };
    Context.sendData("AudienceOptions", { serverOptions }, "optionChange");
    console.log("SharedData.serverOptions", SharedData.serverOptions);
  };

  useEffect(() => {
    console.log(
      "ProductDetail_SharedData.serverOptions",
      SharedData.serverOptions
    );

    return () => {};
  }, [selectedOptions]);

  const handleIncludeChange = (event, category) => {
    Object.entries(category).forEach(([key, value]) => {
      if (value === "delete") {
        delete SharedData.includeProductDetails[key];
      } else if (value) {
        SharedData.includeProductDetails[key] = value;
      } else {
        delete SharedData.includeProductDetails[key];
      }
    });

    if (Object.entries(SharedData.includeProductDetails).length > 0) {
      SharedData.serverOptions["included-product-details"] =
        SharedData.includeProductDetails;
    } else {
      delete SharedData.serverOptions["included-product-details"];
    }

    const serverOptions = SharedData.serverOptions;
    Context.sendData(
      "AudienceOptions",
      { serverOptions },
      "handleIncludeChange"
    );
  };
  
  console.log("tags", selectedOptions["tags"]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFruitsText, setSelectedFruitsText] = useState('0 Items');
  const [selectedFruits, setSelectedFruits] = useState([]);


  const handleOpenModal = (id) => {
    console.log("open modal");
    setIsOpen(true);
  };

  let {
    images,
    title,
    description,
    handle,
    variants,
    options,
    tags,
    metafields,
    collections,
  } = data;
  console.log('images', images);
  const formatData = (data) => {
    if (data.length === 1) {
      const image = images.find((image) => image.transformedSrc === data[0]);
      return image.transformedSrc;
    }
  }
  const fruitSelectionChanged = (images) => {
    setSelectedFruits(images);
    setSelectedFruitsText(formatData(images));
   setIsOpen(false);
  };
  return (
    <IonGrid>
      <IonRow>
        <IonCol key="first" size="12" size-md="4">
          {images.length ? (
            images
              .slice(0, 1)
              .map((image, index) => (
                <IonImg
                  key={index}
                  className={`ion-padding ${
                    index > 0 ? "ion-hide-sm-down" : ""
                  }`}
                  src={image.transformedSrc}
                  alt={title}
                />
              ))
          ) : (
            <IonImg
              className="ion-padding"
              src="https://placehold.co/300x200?text=No+Image+Available"
            />
          )}

          <IonLabel
            className="ion-padding"
            id="hover-trigger"
            style={{ fontSize: "12px" }}
          >
            {shortenText(title)}
            <IonPopover
              translucent={true}
              animated="true"
              trigger={title.length > 30 ? "hover-trigger" : ""}
              triggerAction="hover"
            >
              <IonContent class="ion-padding">{title}</IonContent>
            </IonPopover>
          </IonLabel>
        </IonCol>

        <IonCol key="second" size="12" size-md="8">
          {title && (
            <IonGrid>
              <IonRow>
                <IonCol key="third">
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
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
          )}
          {description && description.length && (
            <IonItem>
              <IonGrid>
                <IonRow>
                  <IonCol
                    key="fourth"
                    size="9"
                    class={tags.length ? "" : " ion-hide"}
                  >
                    <IonTextarea
                      key={description}
                      label="Description"
                      label-placement="stacked"
                      aria-label="description"
                      value={description || "no description"}
                      autoGrow={true}
                      style={{ fontSize: "12px" }}
                      className="ion-text-wrap ion-padding-end"
                      readonly
                    />
                  </IonCol>
                  <IonCol
                    key="fifth"
                    size="3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                    className="ion-text-end"
                  >
                    <IonRadioGroup
                      allowEmptySelection={true}
                      onIonChange={(e) =>
                        handleIncludeChange(e, {
                          description: e?.detail?.value
                            ? [description]
                            : "delete",
                        })
                      }
                    >
                      <IonRadio
                        key="descriptionInclude"
                        style={{ fontSize: "12px" }}
                        color="success"
                        value="include"
                      >
                        include
                      </IonRadio>
                    </IonRadioGroup>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          )}
          <IonGrid>
            <IonRow>
              <IonCol
                key="sixth"
                class={tags && tags.length ? "" : " ion-hide"}
              >
                <IonLabel
                  style={{ fontSize: "11px" }}
                  class="ion-padding-start"
                ></IonLabel>
                <IonItem key="tags">
                  <IonSelect
                    label="Select Tags"
                    aria-label="Select Tags"
                    style={{ fontSize: "12px" }}
                    labelPlacement="stacked"
                    placeholder={"Include " + "Tag Names"}
                    multiple="true"
                    value={selectedOptions["tags"]}
                    onIonChange={(e) => optionChange("tags", e.detail.value)}
                  >
                    {tags &&
                      tags.map((tag, index) => {
                        return (
                          <IonSelectOption key={index + tag} value={tag}>
                            {tag}
                          </IonSelectOption>
                        );
                      })}
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol
                key="seventh"
                class={collections.length ? "" : " ion-hide"}
              >
                <IonLabel
                  style={{ fontSize: "11px" }}
                  class="ion-padding-start"
                ></IonLabel>
                <IonItem key="collection">
                  <IonSelect
                    label="Select A Collection"
                    aria-label="Select A Collection"
                    style={{ fontSize: "12px" }}
                    labelPlacement="stacked"
                    interface="action-sheet"
                    placeholder={"Include A Collection"}
                    multiple="true"
                    value={selectedOptions["collection"]}
                    onIonChange={(e) =>
                      optionChange("collection", e.detail.value)
                    }
                  >
                    {collections &&
                      collections.map((collection, index) => {
                        const { title, description } = collection;
                        const selection = `${title},  ${description}`;
                        return (
                          <IonSelectOption key={index} value={description}>
                            {description}
                          </IonSelectOption>
                        );
                      })}
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol
                key="twelfth"
                class={images && images.length ? "" : " ion-hide"}
              >
                <IonLabel
                  style={{ fontSize: "11px" }}
                  class="ion-padding-start"
                ></IonLabel>
                <IonList inset={true}>
                  <IonItem button={true} onClick={()=>{isOpen? setIsOpen(false): setIsOpen(true)}} detail={false} >
                    <IonLabel         style={{ fontSize: "11px" }}>Select Images</IonLabel>
                    {/* <div slot="end" id="selected-fruits">
                      {selectedFruitsText}
                    </div> */}
                  </IonItem>
                </IonList>
              </IonCol>
              <IonCol
                key="eighth"
                class={metafields && metafields.length ? "" : " ion-hide"}
              >
                <IonLabel
                  style={{ fontSize: "11px" }}
                  class="ion-padding-start"
                >
                  Metafields:
                </IonLabel>
                <IonItem key="metafields">
                  <IonSelect
                    label="Select A Metafield"
                    aria-label="Select A Metafield"
                    style={{ fontSize: "12px" }}
                    labelPlacement="stacked"
                    interface="action-sheet"
                    placeholder={"Include A Metafield Description"}
                    multiple="true"
                    value={selectedOptions["metafields"]}
                    onIonChange={(e) =>
                      optionChange("metafields", e.detail.value)
                    }
                  >

                    {metafields &&
                      metafields.map((metafield, index) => {
                        const { description } = metafield;

                        return (
                          <IonSelectOption key={index} value={{ description }}>
                            {description}
                          </IonSelectOption>
                        );
                      })}
                  </IonSelect>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonGrid class={options && options.length ? "" : " ion-hide"}>
            <IonLabel style={{ fontSize: "11px" }} class={"ion-padding-start"}>
              Options:
            </IonLabel>
            <IonRow>
              {options &&
                options.map((option, index) => {
                  let { name, values } = option;
                  name = name.toLowerCase();
                  const key = "option_" + name;

                  return (
                    <IonCol
                      key={key} // Replace with a unique identifier for the component
                      className={values.length ? "" : "ion-hide"}
                    >
                      <IonItem key={key}>
                        {" "}
                        {/* Replace with a unique identifier for the item */}
                        <IonSelect
                          label={name}
                          aria-label={name}
                          style={{ fontSize: "12px" }}
                          labelPlacement="stacked"
                          placeholder={"Include " + name + "s"}
                          multiple={true} // Update to use a boolean value
                          value={selectedOptions[key]}
                          onIonChange={(e) => optionChange(key, e.detail.value)}
                        >
                          {values &&
                            values.map((value, index) => {
                              return (
                                <IonSelectOption
                                  key={index}
                                  value={name + ":  " + value}
                                >
                                  {name + ":  " + value}
                                </IonSelectOption>
                              );
                            })}
                        </IonSelect>
                      </IonItem>
                    </IonCol>
                  );
                })}
            </IonRow>
          </IonGrid>
          <IonGrid>
            <IonLabel style={{ fontSize: "11px" }} class="ion-padding-start">
              Variants:
            </IonLabel>
            <IonRow>
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
                  const displayVariant = JSON.parse(JSON.stringify(variant));
                  delete displayVariant.id;
                  delete displayVariant.sku;

                  for (const [key, value] of Object.entries(displayVariant)) {
                    if (!value) {
                      delete displayVariant[key];
                    }
                  }
                  if (displayVariant.weight) {
                    displayVariant.weight += " " + displayVariant.weightUnit;
                  }
                  delete displayVariant.weightUnit;
                  return (
                    <IonCol key={index} size="12" size-md="4">
                      <IonItem key={index}>
                        <IonSelect
                          label={title}
                          aria-label={title}
                          style={{ fontSize: "12px" }}
                          labelPlacement="stacked"
                          placeholder={"Include " + "variant option" + "s"}
                          multiple="true"
                          value={selectedOptions["variant_" + title]}
                          onIonChange={(e) =>
                            optionChange("variant_" + title, e.detail.value)
                          }
                        >
                          {displayVariant &&
                            Object.entries(displayVariant).map(
                              ([key, value], index) => {
                                return (
                                  <IonSelectOption
                                    key={index}
                                    value={key + ": " + value}
                                  >
                                    {key + ":  " + value}
                                  </IonSelectOption>
                                );
                              }
                            )}
                        </IonSelect>
                      </IonItem>
                    </IonCol>
                  );
                })}{" "}
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
      <IonModal key="typeHead" isOpen={isOpen}>
        <AppTypeahead
          title="Include Images"
          items={images}
          selectedItems={selectedFruits}
          onSelectionCancel={() => setIsOpen(false)}
          onSelectionChange={fruitSelectionChanged}
        />
      </IonModal>
    </IonGrid>
  );
}
