import React, { useRef, useState } from "react";
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
  IonToolbar,
  IonContent,
  IonTextarea,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
  IonItemDivider,
  IonBadge,
} from "@ionic/react";
import "./styles/generateDescription.css";
import { Context } from "../../utilities/data-context";
import { useLocation } from "react-router-dom";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
export function Accordion({
  aiContent,
  handleRequest,
  productData,
  selectedAccordionsToShow,
  handleAccordionSelections,
}) {
  const textareaRefs = useRef([]);

  const [descDisplayOptions, setDescDisplayOptions] = useState([]);
  const [descOptions, setDescOptions] = useState({});
  const [accordionOptions, setAccordionOptions] = useState([]);

  Context.listen("AudienceOptions", ({ options }) => {
    setDescOptions(options);
    setDescDisplayOptions(Object.entries(options));

 
  });

  Context.listen("AccordionOptions", function (change, name) {
    setAccordionOptions(change.checkBoxes);
  });

  const fetch = useAuthenticatedFetch();

  async function sendFocusedAiRequest(options) {
    try {
      const response = await fetch("/api/ai/focused-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          options,
        }),
      });

      const responseData = await response.json();
     
      return responseData;

     
    } catch (error) {
      console.error(error);
    }
  }

  async function sendGeneralAiRequest(options) {
    try {
      console.log('options', options)
      const response = await fetch("/api/ai/general-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          options,
        }),
      });

      const responseData = await response.json();

      return responseData;
    } catch (error) {
      console.error("error-->", error);
    }
  }

  const handleGenerateDescription = async (index) => {

    if (options["included-product-details"]) {
   const result =  await sendGeneralAiRequest(productData);
      console.log("product", productData);
    } else {
    const requirements= {}


      const result = await sendFocusedAiRequest(requirements)



    console.log('result', result)
    }
  }


  const accordions = [
    {
      index: 0,
      id: "description",
      requestType: "generate-description",
      label: "Generate a Description",
      placeholder: "Generate a description",
      buttonNames: {
        generate: "Generate Description",
        update: "Update Description",
        clear: "Clear Description",
      },
      data: productData,
    },
    {
      index: 1,
      id: "article",
      requestType: "generate-article",
      label: "Generate a Article",
      placeholder: "Generate a Article",
      buttonNames: {
        generate: "Generate Article",
        update: "Add Article",
      },
      data: productData,
    },
    {
      index: 2,
      id: "post",
      requestType: "generate-post",
      label: "Generate a Post",
      placeholder: "Generate a Post",
      buttonNames: {
        generate: "Generate Post",
      },
      data: productData,
    },
  ];


  const handleClearClick = (index) => {
    const textarea = textareaRefs.current[index];
    textarea.value = ""; // Clear the textarea value


    const requestType = accordions[index].requestType;



    console.log("request: ", descDisplayOptions);
  };

  const addTextareaRef = (ref) => {
    textareaRefs.current.push(ref);
  };

  const handleUpdateClick = () => {
    handleRequest();

    // Perform the update operation in the database using the generated descriptions, articles, or posts
  };

  const renderAccordionItem = ({
    index,
    id,
    label,
    placeholder,
    buttonNames,
    data,
  }) => {
    if (accordionOptions.includes(id))
      return (
        <IonAccordion key={index} value={index}>
          <IonItem slot="header" color="light">
            <IonLabel>{label}</IonLabel>
          </IonItem>
          <div className="ion-padding" slot="content">
            <IonItem>
              <ion-grid>
                <ion-row>
                  {descDisplayOptions.map(([key, value], index) => {
                    if (!Array.isArray(value)) {
                      return (
                        <div key={index} className="option">
                          <IonLabel className="option-label">{key}:</IonLabel>
                          <IonBadge className="option-value">{value}</IonBadge>
                        </div>
                      );
                    } else {
                      return (
                        <div className="option" key={index}>
                          <IonLabel className="option-label">{key}:</IonLabel>
                          <div className="option-values">
                            {value.map((item, index) => (
                              <IonBadge key={index} className="option-value">
                                {item}
                              </IonBadge>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  })}
                  <IonTextarea
                    ref={(ref) => addTextareaRef(ref)}
                    aria-label={label}
                    label={label}
                    labelPlacement="stacked"
                    placeholder={placeholder}
                    value={productData.description || ""}
                    autoGrow={true}
                    className="description-textarea"
                    debounce={300}
                  ></IonTextarea>
                </ion-row>
                <ion-row>
                  <IonItemDivider>
                    <IonButtons slot="end">
                      {buttonNames?.generate && (
                        <IonButton
                          onClick={() => handleGenerateDescription(index)}
                        >
                          {buttonNames.generate}
                        </IonButton>
                      )}
                      {buttonNames?.update && (
                        <IonButton onClick={() => handleUpdateClick(index)}>
                          {buttonNames.update}
                        </IonButton>
                      )}
                      {buttonNames?.clear && (
                        <IonButton onClick={() => handleClearClick(index)}>
                          {buttonNames.clear}
                        </IonButton>
                      )}
                    </IonButtons>
                  </IonItemDivider>
                </ion-row>
              </ion-grid>
            </IonItem>
          </div>
        </IonAccordion>
      );
  };

  return (
    <IonRow>
      <IonCol size="12">
        <IonAccordionGroup>
          {accordions.map((accordion) => renderAccordionItem(accordion))}
        </IonAccordionGroup>
      </IonCol>
    </IonRow>
  );
}
