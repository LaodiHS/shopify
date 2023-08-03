import React, { useRef, useEffect, useState } from "react";
// import { Redirect } from 'react-router-dom';
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
  IonText,
  IonIcon,
  IonButtons,
} from "@ionic/react";
import { informationCircleOutline,exitOutline, informationCircle } from "ionicons/icons";
import AppTypeahead from "./AppTypeahead";
import {
  Context,
  SharedData,
  SubscriptionChecker,
} from "../../utilities/data-context.js";
import { shortenText } from "../../utilities/utility-methods";
import { useNavigate } from "react-router-dom";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";

// import { navigate } from "ionicons/icons";

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

export function ProductDetails({ data, subscriptions }) {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedCollections, setSelectedCollections] = useState({
    collections: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImageText, setSelectedImageText] = useState("0 Items");
  const [selectedImages, setSelectedImages] = useState([]);

  const optionChange = (propName, data) => {
    console.log(propName, " data ", data);
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
  };

  function updateCollections() {
    setSelectedCollections((prev) => ({
      ...prev,
      collections:
        selectedOptions?.collections?.map(
          (obj) =>
            Object.entries(obj)?.find(
              ([key, value]) => key !== "id" && value
            )[1]
        ) || [],
    }));
  }

 




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

  const formatData = (data) => {
    if (data.length === 1) {
      const image = images.find((image) => image.transformedSrc === data[0]);
      return image.transformedSrc;
    }
  };

  const imageSelectionChanged = (images) => {
    optionChange("images", images);
    setSelectedImages(images);
    setSelectedImageText(formatData(images));
    setIsOpen(false);
  };

  const checker = new SubscriptionChecker(subscriptions);
  const basic_crafted_advanced = checker.checkFeatureAccess([
    "basic",
    "crafted",
    "advanced",
  ]);
  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonRow>
            <IonCol key="first" size="12">
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
                  key="placeholderImageProductDetails"
                  className="ion-padding"
                  src="https://placehold.co/300x200?text=No+Image+Available"
                />
              )}
            </IonCol>

            <IonCol
              style={{ display: "flex", justifyContent: "center" }}
              size="12"
            >
              <IonItem lines="none">
                <IonLabel
                  // id="hover-trigger"
                  style={{ fontSize: "12px" }}
                >
                  {shortenText(title)}
                </IonLabel>

                <IonPopover
                  key={title}
                  translucent={true}
                  animated="true"
                  // trigger={title.length > 30 ? "hover-trigger" : ""}
                  // triggerAction="hover"
                >
                  <IonContent className="ion-padding">{title}</IonContent>
                  <IonText color="secondary"> <sub> <IonIcon icon={exitOutline}></IonIcon> click outside box to close</sub></IonText>
                </IonPopover>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonCol>
        <IonCol key="second" size="12" size-md="7">
          <IonRow>
            {/* <IonCol size="12" className={title ? "" : " ion-hide"} key={title}>
              <IonItem lines="none">
                <IonInput
                  label="Product Title"
                  label-placement="stacked"
                  aria-label="description"
                  autoGrow={true}
                  style={{ fontSize: "12px" }}
                  value={title}
                  readonly
                />
              </IonItem>
            </IonCol> */}

            <IonCol style={{ padding: 0, margin: 0 }} size="12">
              <IonRow className={"ion-align-items-end"}>
                <IonCol key="fourth" size="9">
                  <IonItem lines="none">
                    <IonTextarea
                      key={description}
                      label="Description"
                      label-placement="stacked"
                      aria-label="description"
                      value={description || "no description"}
                      autoGrow={true}
                      style={{ fontSize: "12px" }}
                      readonly
                    />
                  </IonItem>
                </IonCol>
                <IonCol key="fifth" size="3" className="ion-text-end">
                  <IonItem lines="none">
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
                        className="ion-padding"
                      >
                        include
                      </IonRadio>
                    </IonRadioGroup>{" "}
                    <IonIcon
                      size="small"
                      color="secondary"
                      slot="end"
                      aria-label="Include existing description in composition"
                      id="include-description-hover-trigger"
                      icon={informationCircleOutline}
                    ></IonIcon>
                  </IonItem>
                </IonCol>{" "}
                <IonPopover
                  key="Include existing description in composition"
                  translucent={true}
                  animated="true"
                  trigger="include-description-hover-trigger"
                  triggerAction="hover"
                >
                  <IonContent className="ion-padding">
                  <IonText><p>Include existing description in composition.</p></IonText>
                    <IonText color="secondary"> <sub> <IonIcon icon={exitOutline}></IonIcon> click outside box to close</sub></IonText>
                  </IonContent>
                </IonPopover>
              </IonRow>
            </IonCol>

            <SelectOptions
              optionName={Object.keys({ tags }).pop()}
              options={tags}
              selectedOptions={selectedOptions}
              optionChange={optionChange}
              validUser={basic_crafted_advanced}
            />

            <IonCol
              key="seventh"
              className={collections.length ? "" : " ion-hide"}
            >
              <IonItem lines="none">
                <IonLabel>
                  <IonText
                    style={{ fontSize: "11px" }}
                    className="ion-text-wrap"
                    color={basic_crafted_advanced.hasAccess ? "" : "medium"}
                  >
                    {basic_crafted_advanced.message("Collections")}
                  </IonText>
                </IonLabel>
                <IonIcon
                  size="small"
                  color="secondary"
                  slot="end"
                  aria-label="Include existing description in composition"
                  id={"collection-select-options-hover-trigger"}
                  icon={informationCircleOutline}
                ></IonIcon>
              </IonItem>

              <IonItem key="collections">
                <IonSelect
                  disabled={!basic_crafted_advanced.hasAccess}
                  label="Select A Collection"
                  aria-label="Select A Collection"
                  style={{ fontSize: "12px" }}
                  labelPlacement="stacked"
           
                  interface="action-sheet"
                  placeholder={"Include A Collection"}
                  multiple="true"
                  values={selectedCollections.collections}
                  onIonChange={(e) => {
                    optionChange("collections", e.detail.value);
                  }}
                >
                  {collections &&
                    collections.map((collection, index) => {
                      const { title, description, value } = collection;

                      return (
                        <IonSelectOption color="success" key={index + title} value={collection}>
                        {title}
                        </IonSelectOption>
                      );
                    })}
                </IonSelect>
              </IonItem>
              <IonPopover
                key={"collection-select-options-hover-trigger"}
                translucent={true}
                animated="true"
                trigger={"collection-select-options-hover-trigger"}
                triggerAction="hover"
              >
                <IonContent className="ion-padding ion-text-capitalize">
                 <IonText><p> select collection options to include in the composition.</p></IonText>
                    <IonText color="secondary"> <sub> <IonIcon icon={exitOutline}></IonIcon> click outside box to close</sub></IonText>
                </IonContent>
              </IonPopover>
            </IonCol>
            {metafields &&
              metafields.length > 0 &&
              (() => {
                const values = metafields.map(
                  (metafield, index) => metafield.value
                );

                return (
                  <SelectOptions
                    key="metafields"
                    optionName={Object.keys({ metafields }).pop()}
                    options={values}
                    selectedOptions={selectedOptions}
                    optionChange={optionChange}
                    validUser={basic_crafted_advanced}
                    sizes={{ size: "12", "size-md": "4" }}
                  />
                );
              })()}

            <IonCol size="12">
              <IonRow>
                {options &&
                  options.map((option, index) => {
                    let { name, values } = option;
                    name = name.toLowerCase();
                    const key = "option_" + name;

                    return (
                      <SelectOptions
                        key={index}
                        optionName={key}
                        options={values}
                        selectedOptions={selectedOptions}
                        optionChange={optionChange}
                        validUser={basic_crafted_advanced}
                        sizes={{ size: "12", "size-md": "4" }}
                      />
                    );
                  })}
              </IonRow>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12"></IonCol>
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

                const key = "variant_" + title;

                const values = Object.entries(displayVariant).map(
                  ([key, value]) => key + ": " + value
                );

                return (
                  <SelectOptions
                    key={index}
                    optionName={key}
                    options={values}
                    selectedOptions={selectedOptions}
                    optionChange={optionChange}
                    validUser={basic_crafted_advanced}
                    sizes={{ size: "12", "size-md": "4" }}
                  />
                );
              })}{" "}
          </IonRow>
        </IonCol>
        <IonCol
          size="12"
          key="ImageSelection"
          className={images && images.length ? "image-selection" : "ion-hide"}
        >
          <IonItem className="ion-no-padding" lines="none">
       
           
            <IonLabel slot="end">
              <IonText
                style={{ fontSize: "11px" }}
                className="ion-text-wrap"
                color={basic_crafted_advanced.hasAccess ? "" : "medium"}
              >
                {basic_crafted_advanced.message("Images")}
              </IonText>
            </IonLabel>
            <IonIcon
              size="small"
              color="secondary"
              slot="end"
              aria-label="Information about Images"
              id="Image-options-hover-trigger"
              icon={informationCircleOutline}
            ></IonIcon>
             <IonItem lines="none"
              slot="end"
              button={false}
              disabled={!basic_crafted_advanced.hasAccess}
              key="images"
              onClick={() => {
                setIsOpen((prevIsOpen) => !prevIsOpen);
              }}
              detail={false}
            >
              <IonButton size="small" color="tertiary" fill="clear">
                Select Images
              </IonButton>
            </IonItem>
          </IonItem>
          <IonPopover
            key="Image-options-hover-trigger"
            translucent={true}
            animated="true"
            trigger="Image-options-hover-trigger"
            triggerAction="hover"
          >
            <IonContent className="ion-padding ion-text-capitalize">
             <IonText><p> select collection options to include in the composition.</p></IonText>
                    <IonText color="secondary"> <sub> <IonIcon icon={exitOutline}></IonIcon> click outside box to close</sub></IonText>
            </IonContent>
          </IonPopover>
        </IonCol>
      </IonRow>
      <IonModal key="typeHead" isOpen={isOpen}>
        <AppTypeahead
          title="Include Images"
          items={images}
          selectedItems={selectedImages}
          onSelectionCancel={() => setIsOpen(false)}
          onSelectionChange={imageSelectionChanged}
        />
      </IonModal>
    </IonGrid>
  );
}

function PremiumAccessLabels() {
  return (
    <IonItem lines="none">
      <IonLabel>
        <IonText
          style={{ fontSize: "11px" }}
          className="ion-text-wrap"
          color={basic_crafted_advanced.hasAccess ? "" : "medium"}
        >
          {basic_crafted_advanced.message("Tags")}{" "}
        </IonText>
      </IonLabel>
    </IonItem>
  );
}

function SelectOptions({
  optionName,
  options,
  selectedOptions,
  optionChange,
  validUser,
  sizes,
}) {
  let displayName = optionName.split("_").join(" ");

  if (displayName[displayName.length - 1] !== "s") {
    displayName += "s";
  }

  return (
    <IonCol
      {...sizes}
      className={options && options.length ? "" : " ion-hide"}
      key="sixth"
    >
      <IonItem lines="none">
        <IonLabel>
          <IonText
            style={{ fontSize: "11px" }}
            className="ion-text-wrap ion-text-capitalize"
            color={validUser.hasAccess ? "" : "medium"}
          >
            {validUser.message(displayName)}{" "}
          </IonText>
        </IonLabel>{" "}
        <IonIcon
          size="small"
          color="secondary"
          slot="end"
          aria-label="Include existing description in composition"
          id={displayName + "-select-options-hover-trigger"}
          icon={informationCircleOutline}
        ></IonIcon>
      </IonItem>

      <IonItem key={displayName}>
        <IonSelect
          className="ion-text-capitalize"
          disabled={!validUser?.hasAccess}
          label={"Select " + displayName}
          aria-label={"Select " + displayName}
          style={{ fontSize: "12px" }}
          labelPlacement="stacked"
          placeholder={"Include " + displayName}
          multiple="true"
          value={selectedOptions[optionName]}
          onIonChange={(e) => optionChange(optionName, e.detail.value)}
        >
          {options &&
            options.map((optionValue, index) => {
              return (
                <IonSelectOption key={index + optionValue} value={optionValue}>
                  {optionValue}
                </IonSelectOption>
              );
            })}
        </IonSelect>
      </IonItem>
      <IonPopover
        key={displayName + "-select-options-hover-trigger"}
        translucent={true}
        animated="true"
        trigger={displayName + "-select-options-hover-trigger"}
        triggerAction="hover"
      >
        <IonContent className="ion-padding ion-text-capitalize">
        <IonText><p>select {displayName} options to include in the composition.</p></IonText>
                    <IonText color="secondary"> <sub> <IonIcon icon={exitOutline}></IonIcon> click outside box to close</sub></IonText>
        </IonContent>
      </IonPopover>
    </IonCol>
  );
}
