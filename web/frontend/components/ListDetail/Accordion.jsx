import React, { useRef, useState, useEffect } from "react";
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
  IonModal,
  IonAlert,
} from "@ionic/react";
import "./styles/generateDescription.css";
import { Context } from "../../utilities/data-context";
import { useLocation } from "react-router-dom";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { SelectedOptions } from "./SelectedOptions"

const shortenText = (text) =>
  text && text.length > 20 ? text.substring(0, 30) + "..." : text;

export function Accordion({ productData }) {
  const textareaRefs = useRef([]);
  const accordionGroup = useRef(null);
  const [descDisplayOptions, setDescDisplayOptions] = useState([]);
  const [descOptions, setDescOptions] = useState({});
  const [alertHeader, setAlertHeader] = useState();
  const [alertMessage, setAlertMessage] = useState();
  const [accordionOptions, setAccordionOptions] = useState([]);

  const [showModal, setShowModal] = useState(false); // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirm state

  Context.listen("AudienceOptions", ({ serverOptions }, route) => {
   
   
    if (serverOptions["option-requirements"]) {
        serverOptions["option-requirements"] = {...serverOptions["option-requirements"]};

      setDescOptions(serverOptions["option-requirements"]);
    } else {
      setDescOptions({});
    }

    if (serverOptions["included-product-details"]) {
      const includedProductDetails = [
        ...Object.entries(serverOptions["included-product-details"]),
      ];
      setDescDisplayOptions(includedProductDetails);
    } else {
      setDescDisplayOptions([]);
    }
     console.log("serverOptions", serverOptions);
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

  useEffect(() => {

  }, []);

  async function sendGeneralAiRequest({
    productData,
    includedFocusPoints,
    languageAndFormattingOptions,
    requestType,
  }) {
    try {
      
      
      console.log('includedFocusPoints', JSON.stringify(includedFocusPoints));
      
    
    
    const response = await fetch("/api/ai/general-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productData,
          includedFocusPoints,
          languageAndFormattingOptions,
          requestType
        })
      });


      const responseData = await response.json();

      return responseData.data;
    } catch (error) {
      console.error("error-->", error);
    }
  }

  const resolveWithConfirm = useRef(null); // Function to resolve the promise with confirmation
  const handleGenerateDescription = async (index, requestType) => {
    // setShowModal(true);
    console.log("options", descOptions);
    const languageAndFormattingOptions = Object.entries(descOptions);

    const includedFocusPoints = descDisplayOptions;

    console.log("descOptions", descOptions);
    if (!languageAndFormattingOptions.length && !includedFocusPoints.length) {
      const confirm = await showConfirmAlert(
        "No Selections Made",
        "The standard audience and product focus will be applied"
      );
      if (confirm) {
        console.log("moving forward with standard template");

        const response = await sendGeneralAiRequest({
          productData,
          includedFocusPoints,
          languageAndFormattingOptions,
          requestType,
        });

        console.log("response:  ", response);
      } else {
        console.log("they cancelled");
      }

      return;
    }

    if (!includedFocusPoints.length) {
      const confirm = await showConfirmAlert(
        "No Product Highlights Selected",
        "A general product focus will be applied"
      );
      if (confirm) {
        const response = await sendGeneralAiRequest({
          productData,
          includedFocusPoints,
          languageAndFormattingOptions,
          requestType,
        });
      } else {
        console.log("they cancelled");
      }
      return;
    }

    if (!languageAndFormattingOptions.length) {
      const confirm = await showConfirmAlert(
        "No Audience Selected",
        "A general audience will be applied"
      );
      if (confirm) {
        const response = await sendGeneralAiRequest({
          productData,
          includedFocusPoints,
          languageAndFormattingOptions,
          requestType,
        });
      } else {
        console.log("they cancelled");
      }
      return;
    }

    const response = await sendGeneralAiRequest({
      productData,
      includedFocusPoints,
      languageAndFormattingOptions,
      requestType,
    });

    //   if (options["included-product-details"]) {
    //  const result =  await sendGeneralAiRequest(productData);
    //     console.log("product", productData);
    //   } else {
    //   const requirements= {}
    //     const result = await sendFocusedAiRequest(requirements)
    //   console.log('result', result)
    //   }
    // }
  };

  const handleUpdateClick = async () => {
    const confirmed = await showConfirmAlert(header, message);
console.log('click')
    if (confirmed) {
      // Handle the confirmed action
      // This code will execute when the user confirms the action
      console.log("Confirmed");
    } else {
      // Handle the cancel action
      // This code will execute when the user cancels the action
      console.log("Cancelled");
    }

    // handleRequest();

    // Perform the update operation in the database using the generated descriptions, articles, or posts
  };
  const showConfirmAlert = (header, message) => {
    if (!header || !message) {
      throw new Error("Please select a header and a message");
    }
    setAlertHeader(header);
    setAlertMessage(message);
    return new Promise((resolve) => {
      setShowConfirmModal(true);
      resolveWithConfirm.current = resolve;
    });
  };

  const handleConfirmModalDismiss = () => {
    setShowConfirmModal(false);
    resolveWithConfirm.current(false); // Resolve the promise with false to indicate cancellation
  };

  const handleConfirmModalConfirm = () => {
    setShowConfirmModal(false);
    resolveWithConfirm.current(true); // Resolve the promise with true to indicate confirmation
  };

  const accordions = [
    {
      index: 0,
 
      id: "description",
      requestType: "description",
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
      requestType: "article",
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
      requestType: "post",
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

  // console.log("request: ", descDisplayOptions);
  const addTextareaRef = (ref) => {
    textareaRefs.current.push(ref);
  };

  const renderAccordionItem = ({
    index,
    id,
   
    label,
    placeholder,
    buttonNames,
    data,
    requestType,
  }) => {
    // if (accordionOptions[id])
    
      return (
        <IonAccordion class={accordionOptions[id]? "": "ion-hide"} key={index} value={index}>
          <IonItem slot="header" color="light">
            <IonLabel>{label}</IonLabel>
          </IonItem>
          <div className="ion-padding" slot="content">
            <IonItem>
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    <SelectedOptions descDisplayOptions={descDisplayOptions}/>
             
                  </IonCol>
                  <IonCol size="12">
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
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonItemDivider>
                    <IonButtons slot="end">
                      {buttonNames?.generate && (
                        <IonButton
                          onClick={() =>
                            handleGenerateDescription(index, requestType)
                          }
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
                </IonRow>
              </IonGrid>
            </IonItem>
          </div>
        </IonAccordion>
      );
  };

  return (
    <IonRow>
      <IonCol size="12">
        <IonAccordionGroup animated={true} expand="inset" ref={accordionGroup} multiple={true}>
          {accordions.map((accordion) => renderAccordionItem(accordion))}
        </IonAccordionGroup>
      </IonCol>
      {/* Modal */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonContent>
          <div className="modal-content">
            <h2>You need to include product details.</h2>
          </div>
        </IonContent>
      </IonModal>
      <IonAlert
        isOpen={showConfirmModal}
        onDidDismiss={handleConfirmModalDismiss}
        header={alertHeader}
        message={alertMessage}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: handleConfirmModalDismiss,
          },
          {
            text: "Confirm",
            handler: handleConfirmModalConfirm,
          },
        ]}
      />
    </IonRow>
  );
}
