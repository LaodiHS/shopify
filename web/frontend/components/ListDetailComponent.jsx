import React, { useState, use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IonItem,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonButtons,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonToolbar,
  IonContent,
  IonTextarea,
  IonAccordion,
  IonAccordionGroup,
  IonItemDivider,
  IonIcon,
  IonTitle,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import { arrowBack } from "ionicons/icons";
import { Accordion } from "./ListDetail/Accordion";
import { ProductDetails } from "./ListDetail/ProductDetails";
import { Toggles } from "./ListDetail/Toggles";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import { audienceModel } from "../utilities/language-model";
import { Context } from "../utilities/data-context.js";
import { History } from "../utilities/store";
import { updateObject } from "../utilities/utility-methods";
import { SharedData } from "../utilities/data-context.js";

const toggles = {
  tone: true,
  introduction: true,
  features: true,
  evocative: true,
  narrative: false,
  rhetorical: false,
  socialMedia: false,
};

export function ListDetailComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const { pageTitle, sections } = audienceModel;

  const [hiddenElements, setHiddenElements] = useState(toggles);
  const [selectedOptions, setSelectedOptions] = useState({});

  function onToggleChange(selectElementId) {
    setHiddenElements((prevHiddenElements) => ({
      ...prevHiddenElements,
      [selectElementId]: toggles[selectElementId],
    }));
  }

  const handleSelectChange = async (event, category) => {
    console.log("SharedData.serverOptions: 1", SharedData.serverOptions);
    const newSelectedOptions = {
      ...selectedOptions,
      [category]: event.detail.value,
    };
    setSelectedOptions(newSelectedOptions);

    SharedData.optionRequirements[category] = SharedData.optionRequirements[category] || {};

    if (!event?.detail?.value || event?.detail?.value === "none") {
      delete SharedData.optionRequirements[category];
      SharedData.optionRequirements = updateObject(SharedData.optionRequirements);
      setSelectedOptions(SharedData.optionRequirements);
    } else {
      SharedData.optionRequirements[category] = event.detail.value;
      SharedData.optionRequirements = updateObject(SharedData.optionRequirements);
      setSelectedOptions(SharedData.optionRequirements);
    }

    if (!Object.entries(SharedData.optionRequirements).length) {
      delete SharedData.serverOptions["option-requirements"];
    } else {
      SharedData.serverOptions["option-requirements"] = SharedData.optionRequirements;
    }
const serverOptions = SharedData.serverOptions
    Context.sendData("AudienceOptions", {
      serverOptions
    },'handleSelectChange');
  };

  const navigateBack = () => {
    navigate("/");
  };

  const data = JSON.parse(location.state);
  useEffect(() => {
    if (!data) {
      navigateBack();
    }
    return () => {
     

       SharedData.clearSharedData()
      const serverOptions = {...SharedData.serverOptions}
      Context.sendData("AudienceOptions", { serverOptions },'useEffect');
     
      if (!data) {
        navigateBack();
      }
    };
  }, []);


  return (
    <React.Fragment key="ListDetailComponent">
      <div
        className="ion-padding"
        style={{ display: "flex", justifyContent: "flex-start" }}
      >
        <IonButton
          fill="clear"
          className="ion-padding-end"
          onClick={navigateBack}
          // disabled={currentPage === 1}
        >
          <IonIcon slot="start" icon={arrowBack}></IonIcon>
          Back
        </IonButton>
      </div>
      <ProductDetails
        serverOptions={SharedData.serverOptions}
        includeProductDetails={SharedData.includeProductDetails}
        optionRequirements={SharedData.optionRequirements}
        key="productDetails"
        data={data}
      />



      <Toggles onToggleChange={onToggleChange} toggles={toggles} />
      {sections.map((section, sectionIndex) => (
    
       
          <IonGrid>
               <IonItem>
            <div>{section.sectionTitle}</div>
          </IonItem>
            {section.IonItems.map((item, itemIndex) => {
              const {
                IonElement,
                category,
                multiple,
                label,
                placeholder,
                values,
                events,
              } = item;

              const { tag, options } = values;

              return (
                <IonRow key={category}>
                  <IonCol size="12" size-md="12">
                    <IonItem
                      class={!hiddenElements[item.category] ? "ion-hide" : ""}
                    >
                      {React.createElement(
                        IonSelect,
                        {
                          key: itemIndex + item.category,
                          category: category,
                          multiple: multiple,
                          value: selectedOptions[category] || item.default,
                          label: label,
                          placeholder: placeholder,
                          onIonChange: (e) => handleSelectChange(e, category),
                          "label-placement": "stacked",
                        },

                        options.map((option, index) => {
                          const TagName = tag;
                          const { value, title } = option;

                          return (
                            <IonSelectOption key={index} value={value}>
                              {title}
                            </IonSelectOption>
                          );
                        })
                      )}
                    </IonItem>
                  </IonCol>
                </IonRow>
              );
            })}
            <Accordion productData={data} key={"accordion"} />
          </IonGrid>
   
      ))}
    </React.Fragment>
  );
}

