import React, { useRef, useEffect, useState, useMemo } from "react";
// import { Redirect } from 'react_router_dom';
// import { Editor } from "@tinymce/tinymce-react";
// import "tinymce/tinymce";
// import "tinymce/models/dom/model";
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
import {
  informationCircleOutline,
  exitOutline,
  informationCircle,
} from "ionicons/icons";
import { trash, pictures, beehive, } from "../../assets";

import { Context, SharedData } from "../../utilities/data-context.js";
import { shortenText } from "../../utilities/utility-methods";
import { ReactRenderingComponent } from "../providers";

import {
  AppTypeahead,
  extractTextFromHtml,
  useDataProvidersContext,
  ImageLoader,
  // Tinymce,
  ImageCache,
  useTinyMCEDataContext, NoImagePlaceHolder
} from "../../components";
// import { navigate } from "ionicons/icons";

export function ProductDetails({ data }) {
  //const fetch = useAuthenticatedFetch();
const {Editor} = useTinyMCEDataContext()

  const {
    includeProductImagesFeature,
    chestnut_sourwood_acacia,
    productDetailOptions,

    optionChange,
    selectedImageMap,
    selectedImages,

    clearSelection,
    imageSelectionChanged,
    DataProviderNavigate,
    imageSelectionModalIsOpen,
    assignImageSelectionModalIsOpen,
  } = useDataProvidersContext();
  // console.log('descriptio', productDetailOptions)
  // console.log('descriptoin------>', productDetailOptions.find(([key, value]) => key === "description"))
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

  return (
    <>
      <IonGrid style={{ padding: 0, margin: 0 }}>
        <IonRow>
          <IonCol>
            <IonRow>
              <IonCol key="first" size="12">
                {images.length ? (
                  images
                    .slice(0, 1)
                    .map((image, index) => (
                      <ImageCache
                        key={index}
                        className={`ion-padding ${
                          index > 0 ? "ion-hide-sm-down" : ""
                        }`}
                        src={image.transformedSrc}
                        alt={title}
                      />
                    ))
                ) : (
                  <NoImagePlaceHolder
                    key="placeholderImageProductDetails"
                    className="ion-padding"
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
                    <IonText color="secondary">
                      <sub>
                        <IonIcon icon={exitOutline}></IonIcon> click outside box
                        to close
                      </sub>
                    </IonText>
                  </IonPopover>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonCol>
          <IonCol key="second" size="12" size-md="7">
            <IonRow>
              <IonCol size="12">
                {" "}
                <IonButtons className="ion-float-end">
                  <IonButton
                    onClick={clearSelection}
                    fill="clear"
                    size="small"
                    color="primary"
                    className="ion-float-end ion-padding-top"
                  >
                    Clear Selections
                  </IonButton>
                  <IonButton
                    color="neural"
                    onClick={clearSelection}
                    className="ion-float-start"
                    size="large"
                  >
                    <IonIcon slot="icon-only" icon={trash}></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonCol>

              <IonCol style={{ padding: 0, margin: 0 }} size="12">
                <IonRow className={"ion-align-items-end"}>
                  <IonCol key="fourth" size="12">
                    <IonItem lines="none">
                      <Editor
                        value={description}
                        inline
                        disabled={true}
                        init={{
                          content_security_policy: "default-src '*'",
                          branding: false,
                          promotion: false,
                          // theme: false,
                          //   content_css:"tinymce/skins/content/tinymce-5/content.min.css",
                          inline_styles: true,
                          inline_boundaries: true,

                          menubar: false,
                          toolbar_sticky: false,
                          min_height: 400,
                          height: 400,
                          readyOnly: true,
                          disable: true,
                        }}
                      />
                      {/* <ReactRenderingComponent
                      text={description || "no description"}
                    /> */}
                    </IonItem>
                  </IonCol>
                  <IonCol key="fifth" size="5" offset="7">
                    <IonItem
                      button="false"
                      lines="none"
                      color="transparent"
                      detail="false"
                    >
                      <IonItem lines="none" slot="end" color="transparent">
                        <IonRadioGroup
                          slot="start"
                          allowEmptySelection={true}
                          onIonChange={(e) =>
                            // console.log('-----',Boolean(e.detail.value)) &&
                            optionChange(
                              "description",
                              Boolean(e?.detail?.value)
                                ? extractTextFromHtml(description).slice(10)
                                : null
                            )
                          }
                        >
                          <IonRadio
                            key="descriptionInclude"
                            style={{ fontSize: "12px" }}
                            color="success"
                            value="include"
                            checked={productDetailOptions.find(
                              ([key, value]) => key === "description"
                            )}
                            className="ion-padding"
                          >
                            include
                          </IonRadio>
                        </IonRadioGroup>
                      </IonItem>
                      <IonIcon
                        size="small"
                        color="secondary"
                        slot="end"
                        aria-label="Tap on include add the existing description in the composition assist"
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
                      <IonText>
                        <p>Include existing description in composition.</p>
                      </IonText>
                      <IonText color="secondary">
                        {" "}
                        <sub>
                          {" "}
                          <IonIcon icon={exitOutline}></IonIcon> click outside
                          box to close
                        </sub>
                      </IonText>
                    </IonContent>
                  </IonPopover>
                </IonRow>
              </IonCol>

              <SelectOptions
                optionName={Object.keys({ tags }).pop()}
                options={tags}
                // selectedProperty={"title"}
              />
              <SelectOptions
                optionName={Object.keys({ collections }).pop()}
                options={collections}
                selectedProperty={"title"}
              />

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
                          // selectedProperty={"title"}
                          optionName={key}
                          options={values}
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
                  displayVariant.title = displayVariant.title.toLowerCase();

                  delete displayVariant.id;

                  for (const [key, value] of Object.entries(displayVariant)) {
                    if (!value) {
                      delete displayVariant[key];
                    }
                  }
                  if (displayVariant.weight) {
                    displayVariant.weight += " " + displayVariant.weightUnit;
                  }
                  delete displayVariant.weightUnit;

                  const key =
                    "variant_" +
                    displayVariant.title.replace(/ /g, "_").toLowerCase();

                  const values = Object.entries(displayVariant).map(
                    ([key, value]) => key + ": " + value
                  );

                  return (
                    <SelectOptions
                      key={index}
                      optionName={key}
                      options={values}
                      optionChange={optionChange}
                      validUser={chestnut_sourwood_acacia}
                      sizes={{ size: "12", "size-md": "4" }}
                    />
                  );
                })}{" "}
            </IonRow>
          </IonCol>
        </IonRow>

        <IonModal key="typeHead" isOpen={imageSelectionModalIsOpen}>
          <AppTypeahead
            title="Include Images"
            items={images}
            selectedItems={selectedImages}
            onSelectionCancel={() => assignImageSelectionModalIsOpen(false)}
            onSelectionChange={imageSelectionChanged}
          />
        </IonModal>
      </IonGrid>
      <div
        style={{ padding: 0, margin: 0 }}
        size="12"
        key="ImageSelection"
        className={images && images.length ? "image-selection" : "ion-hide"}
      >
        <IonItem lines="none" button={false} key="images" detail={false}>
          <IonButtons slot="end">
          
          {includeProductImagesFeature.hasAccess ? "" :<>
             <IonButton
              className="ion-padding-top"
              size="small"
        
              fill="clear"
            >
              {includeProductImagesFeature.message("")}
            </IonButton>

            <IonButton onClick={e => DataProviderNavigate("/subscriptions") } slot="icon-only" >
              <IonIcon size="large" icon={beehive}></IonIcon>
            </IonButton>
          </>}
          
         
            
        
            <IonButton
              className="ion-padding-top"
              size="small"
              color="primary"
              fill="clear"
              disabled={!includeProductImagesFeature.hasAccess}
              onClick={() => {
                assignImageSelectionModalIsOpen((prevIsOpen) => !prevIsOpen);
              }}
            >
              Select Images
            </IonButton>

            <IonButton
              color="neural"
              size="large"
              disabled={!includeProductImagesFeature.hasAccess}
              onClick={() => {
                assignImageSelectionModalIsOpen((prevIsOpen) => !prevIsOpen);
              }}
            >
              <IonIcon slot="icon-only" icon={pictures}></IonIcon>
            </IonButton>


            <IonIcon
              size="small"
              color="secondary"
              slot="end"
              aria-label="Information about Images"
              id="Image-options-hover-trigger"
              icon={informationCircleOutline}
            ></IonIcon>

          </IonButtons>
        </IonItem>

        <IonPopover
          key="Image-options-hover-trigger"
          translucent={true}
          animated="true"
          trigger="Image-options-hover-trigger"
          triggerAction="hover"
        >
          <IonContent className="ion-padding ion-text-capitalize">
            <IonText>
              <p>
                Choose the images you wish to incorporate into the document.
              </p>
            </IonText>
            <IonText color="secondary">
              {" "}
              <sub>
                {" "}
                <IonIcon icon={exitOutline}></IonIcon> click outside box to
                close
              </sub>
            </IonText>
          </IonContent>
        </IonPopover>
      </div>
    </>
  );
}

function PremiumAccessLabels() {
  return (
    <IonItem lines="none">
      <IonLabel>
        <IonText
          style={{ fontSize: "11px" }}
          className="ion-text-wrap"
          color={chestnut_sourwood_acacia.hasAccess ? "" : "medium"}
        >
          {chestnut_sourwood_acacia.message("Tags")}{" "}
        </IonText>
      </IonLabel>
    </IonItem>
  );
}

function SelectOptions({ optionName, options, selectedProperty, sizes }) {
  const { productDetailOptions, optionChange, chestnut_sourwood_acacia } =
    useDataProvidersContext();

  const selections = productDetailOptions.find(
    (option) => option[0] === optionName
  );

  const selectedOption = selections ? selections[1] : [];

  const selectedText = (selectedProperty, allOptions) =>
    selectedProperty ? allOptions[selectedProperty] : allOptions;

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength - 3) + "...";
    }
    return text;
  };

  function getName() {
    let name = optionName.split("_").join(" ");
    if (name[name.length - 1] !== "s") {
      name = name + "s";
    }
    return name;
  }

  const displayName = getName();

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
            color={chestnut_sourwood_acacia.hasAccess ? "" : "medium"}
          >
            {chestnut_sourwood_acacia.message(displayName)}{" "}
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
      {/* {JSON.stringify(selectedOption)} */}
      <IonItem key={displayName}>
        <IonSelect
          className="ion-text-capitalize"
          disabled={!chestnut_sourwood_acacia?.hasAccess}
          label={"Select ".concat(
            /variant/i.test(displayName) ? "your variant options" : displayName
          )}
          aria-label={"Select " + displayName}
          style={{ fontSize: "12px" }}
          labelPlacement="stacked"
          placeholder={"Include " + displayName}
          multiple="true"
          value={selectedOption}
          selectedText={
            selectedProperty && selectedText(selectedProperty, selectedOption)
          }
          onIonChange={(e) => optionChange(optionName, e.detail.value)}
        >
          {options &&
            options.map((optionValue, index) => {
              return (
                <IonSelectOption key={index + optionValue} value={optionValue}>
                  {truncateText(
                    selectedText(selectedProperty, optionValue),
                    20
                  )}
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
          <IonText>
            <p>select {displayName} to include in the composition.</p>
          </IonText>
          <IonText color="secondary">
            {" "}
            <sub>
              {" "}
              <IonIcon icon={exitOutline}></IonIcon> click outside box to close
            </sub>
          </IonText>
        </IonContent>
      </IonPopover>
    </IonCol>
  );
}
