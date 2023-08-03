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
  useIonToast,
  IonProgressBar,
} from "@ionic/react";
import "./styles/generateDescription.css";
import { Context } from "../../utilities/data-context";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthenticatedFetch, useAppBridge } from "@shopify/app-bridge-react";
import { SelectedOptions } from "./SelectedOptions";
import { request } from "@shopify/app-bridge/actions/AuthCode";
import { useShopifyContext } from "../providers/ShopifyContext";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import { SessionToken } from "@shopify/app-bridge/actions";
import { pageIngCache, History, formatProducts } from "../../utilities/store";
import {
  useProductDataContext,
  TextWithMarkers,
  cleanText,
} from "../../components";
const shortenText = (text) =>
  text && text.length > 20 ? text.substring(0, 30) + "..." : text;

function extractText(htmlString) {
  const parser = new DOMParser();

  // Parse the HTML string to a Document object
  const doc = parser.parseFromString(htmlString, "text/html");

  // Extract the text from the parsed document
  const extractedText = doc.body.textContent;

  return extractedText;
}
export function Accordion({
  setAccordionModalPopUp,
  subscriptions,
  setAccordionLoadingState,
  currentSession,
}) {
  let { productData, updateProductProperty } = useProductDataContext();

  const accordionGroupRef = useRef(null);

  const [legend, setLegend] = useState([]);

  const [focusOptions, setProductDescOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [alertHeader, setAlertHeader] = useState();
  const [alertMessage, setAlertMessage] = useState();
  const [accordionOptions, setAccordionOptions] = useState({});

  const scrollRef = useRef([]);
  const [sessionToken, setSessionToken] = useState();
  const [showModal, setShowModal] = useState(false); // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirm state
  const navigate = useNavigate();
  const app = useAppBridge();

  Context.listen("DataWindowModal", ({ category }, location) => {
    setAccordionModalPopUp(true);
    setAccordionOptions({ [category]: true });
  });
  const [displayDocument, setDisplayDocument] = useState({
    article: "",
    description: "",
    post: "",
  });

  const [documentLoading, setDocumentLoading] = useState(false);
  const [displayDocumentType, setDisplayDocumentType] = useState("text");

  // Define the setDocuments object outside the function
  const setDocuments = {
    html: (requestType, document) => {
      console.log("received html document: ", document);
      setDisplayDocument((previous) => ({
        ...previous,
        [requestType]: document,
      }));
    },
    text: (requestType, document) => {
      setDisplayDocument((previous) => ({
        ...previous,
        [requestType]: document,
      }));
    },
  };

  function defineDisplayDocument(requestType, documentType, document) {
    // Clear the current display

    // Set the display area
    setDisplayDocumentType(documentType);

    // Call the appropriate function from setDocuments

    setDocuments[documentType](requestType, document);
  }

  // Function to get the value of a query parameter from the URL
  const getQueryParam = (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  };

  // Get the value of the 'host' query parameter from the URL
  const host = getQueryParam("host");

  // Check if the 'host' parameter is present in the URL
  if (host) {
    console.log("host: " + host);
  }
  const [words, setWords] = useState([]);
  function eventSource(requestType, callback) {
    // Check if the EventSource is already initialized and return the existing Promise if available

    const local = { ...currentSession };
    const locals = JSON.stringify(local);
    console.log("locals----", locals);
    // Create a new Promise for the EventSource connection
    const eventSourcePromise = new Promise((resolve, reject) => {
      const eventSource = new EventSource(
        `/sse/stream?shop=${currentSession.shop}&locals=${encodeURIComponent(
          locals
        )}`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      let isResolved = false; // To avoid resolving or rejecting multiple times

      const timeoutId = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          reject(new Error("EventSource connection timeout"));
          eventSource.close();
        }
      }, 10000); // Set the timeout to 10 seconds (adjust as needed)

      eventSource.onopen = () => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId); // Clear the timeout since the connection is successful
          resolve({ active: true, event: eventSource }); // Resolve the promise with 'true' on successful connection
        }
      };

      eventSource.addEventListener("message", (event) => {
        // Handle the received SSE message
        setDocumentLoading(true);
        const eventData = JSON.parse(event.data);
        setAccordionLoadingState(true);
        // Handle the received SSE message

        if (eventData.message === "Job stream") {
          const data = eventData.result;
          const word = data.content;
          const finish_reason = data.finish_reason;



          setWords((prevWords) => [...prevWords, word]);



          if (finish_reason) {
            setDocumentLoading(false);
            eventSource.close();
          }
        }

        // Check if the job is completed or perform other actions based on the event data
        if (eventData.message === "Job completed") {
          const data = eventData.result;

          if (data.error) {
            console.log("error message received: " + data.error);
            presentToast({
              message: "There was a network error! We are working on it.",
              duration: 9000,
              position: "top", // top, bottom, middle
              onDidDismiss: (e) => {
                setDisableButtons(false);

                //setRoleMessage(`Dismissed with role: ${e.detail.role}`);
              },
            });
          } else {
            const { documentType } = data;
            const document = data[documentType];
            defineDisplayDocument(requestType, documentType, document);
          }

          setDocumentLoading(false);
          eventSource.close();
          setAccordionLoadingState(false);
        }

        if (eventData.message.includes("Error: Job")) {
          //const result = eventData.result;
          presentToast({
            message: "There was a error! We are working on it.",
            duration: 9000,
            position: "top", // top, bottom, middle
            onDidDismiss: (e) => {
              setDisableButtons(false);

              //setRoleMessage(`Dismissed with role: ${e.detail.role}`);
            },
          });
          setDocumentLoading(false);
          eventSource.close();
        }
      });

      eventSource.addEventListener("open", () => {
        console.log("SSE connection established");
      });

      eventSource.addEventListener("error", (error) => {
        console.error("SSE error:", error);
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId); // Clear the timeout on error
          reject(error); // Reject the promise with the specific error
          eventSource.close(); // Close the EventSource
          setDocumentLoading(false);
        }
        eventSource.close();
      });

      eventSource.onclose = () => {
        // Cleanup on successful connection (optional)
        console.log("Connection closed");
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId); // Clear the timeout on successful connection
          console.log("Connection closed");
          resolve({ active: true, event: eventSource }); // Resolve the promise with 'true' on successful connection
        }

        setDocumentLoading(false);
      };
    });

    return eventSourcePromise;
  }

  useEffect(async () => {
    const token = await getSessionToken(app);
    setSessionToken(token);

    let session = await app.getState();

    return () => {};
  }, []);

  Context.listen("AudienceOptions", ({ serverOptions }, route) => {
    if (serverOptions["option-requirements"]) {
      serverOptions["option-requirements"] = {
        ...serverOptions["option-requirements"],
      };

      setLanguageOptions(
        Object.entries(serverOptions["option-requirements"]).map(
          ([key, value]) => {
            if (typeof value === "string") {
              return [key, [value]];
            }

            if (Array.isArray(value)) {
              return [key, value];
            }
          }
        )
      );
    } else {
      setLanguageOptions([]);
    }

    if (serverOptions["included-product-details"]) {
      const includedProductDetails = [
        ...Object.entries(serverOptions["included-product-details"]),
      ];

      includedProductDetails.sort((a, b) => b[0].localeCompare(a[0]));

      setProductDescOptions(includedProductDetails);
    } else {
      setProductDescOptions([]);
    }
  });

  const fetch = useAuthenticatedFetch();
  const shopifySession = useShopifyContext();
  const [progress, setProgress] = useState(0);

  async function aiRequest(
    { productData, focus, language, requestType },
    route,
    endpoint
  ) {
    try {
      const response = await fetch(`/api/ai/${route}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productData,
          focus,
          language,
          subscriptions,
          requestType,
        }),
      });

      const generatedPrompt = await response.json();
      console.log(generatedPrompt.message);
      return generatedPrompt;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  const resolveWithConfirm = useRef(null);
  // Function to resolve the promise with confirmation

  const [disableButtons, setDisableButtons] = useState(false);
  const [handlerMessage, setHandlerMessage] = useState("");
  const [roleMessage, setRoleMessage] = useState("");
  const [presentToast] = useIonToast();
  async function setDataListener(requestType, template, language, route) {
    const listenerSet = await eventSource(requestType);
    console.log("listenerSet", listenerSet);
    const focus = focusOptions;
    if (listenerSet.active) {
      const promptTextAndLegend = await aiRequest(
        {
          productData,
          focus,
          language,
          requestType,
        },
        route,
        template
      );
      setTimeout(() => {
        scrollRef.current[requestType].scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "center",
          scrollMode: "always",
        });
      }, 200);

      if (promptTextAndLegend.exceedsLimit) {
        listenerSet.event.close();
        console.log("we closed the connection---->", listenerSet.event.CLOSED);
        console.log("we open theXXXX connection---->", listenerSet.event.OPEN);
        console.log("event source ready state", listenerSet.event.readyState);
        presentToast({
          message: promptTextAndLegend.message,
          duration: 20000,
          position: "middle", // top, bottom, middle
          onDidDismiss: (e) => {
            setDisableButtons(false);

            //setRoleMessage(`Dismissed with role: ${e.detail.role}`);
          },
          buttons: [
            {
              text: "Upgrade",
              role: "info",
              handler: () => {
                navigate("/subscriptions");
              },
            },
            {
              text: "Dismiss",
              role: "cancel",
              handler: () => {
                setHandlerMessage("Dismiss clicked");
              },
            },
          ],
          cssClass: "custom-toast",
        });
      } else {
        setLegend(promptTextAndLegend.legend);
      }
    } else {
      setDisableButtons(true);
      presentToast({
        message: "There was a network error!",
        duration: 3000,
        onDidDismiss: (e) => {
          setDisableButtons(false);
          setRoleMessage(`Dismissed with role: ${e.detail.role}`);
        },
        buttons: [
          {
            text: "Try again later",
            role: "info",
            handler: () => {
              setHandlerMessage("More Info clicked");
            },
          },
          {
            text: "Dismiss",
            role: "cancel",
            handler: () => {
              setHandlerMessage("Dismiss clicked");
            },
          },
        ],
      });
    }
  }

  function handleTextBoxChange(event, requestType) {
    setDisplayDocument((previous) => ({
      ...previous,
      [requestType]: event.detail.value,
    }));
  }

  const handleAiRequest = async (requestType, id) => {
    const route = requestType;
    const language = Object.entries(languageOptions);
    const focus = focusOptions;

    const showAlert = async (title, message, template) => {
      const confirm = await showConfirmAlert(title, message);

      if (confirm) {
        await setDataListener(requestType, template, language, route);
      }
      return null;
    };

    if (!language.length && !focus.length) {
      return await showAlert(
        "No Selections Made",
        "The standard audience and product focus will be applied",
        "empty-template"
      );
    }

    if (!focus?.length) {
      return await showAlert(
        "No Product Highlights Selected",
        "A general product focus will be applied",
        "language-options"
      );
    }

    if (!language.length) {
      return await showAlert(
        "No Audience Selected",
        "A general audience will be applied",
        "focus-options"
      );
    }

    setDataListener(requestType, "focus-language-options", language, route);
  };

  const handleUpdateClick = async (header, message, productData, text) => {
    if (text.length) {
      const productId = productData.id.split("/").pop();
      const response = await fetch("/api/products/update/description", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          productId,
          descriptionHtml: text,
        }),
      });

      if (response.ok) {
        console.log("current Cursor", productData.currentCursor);
        pageIngCache.clearKey(productData.currentCursor);
        console.log("updated");
      }

      // const confirmed = await showConfirmAlert(header, message);

      // if (confirmed) {
      //   // Handle the confirmed action
      //   // This code will execute when the user confirms the action
      //   console.log("Confirmed");
      // } else {
      //   // Handle the cancel action
      //   // This code will execute when the user cancels the action
      //   console.log("Cancelled");
      // }
    }
  };
  const showConfirmAlert = async (header, message) => {
    if (!header || !message) {
      throw new Error("Please select a header and a message");
    }
    setAlertHeader(header);
    setAlertMessage(message);
    return await new Promise((resolve) => {
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
      header: "Updating Your Description",
      message: "You Will Be Updating Your Description",
      placeholder: "Generate a description",
      buttonNames: {
        generate: "Generate Description",
        update: "Update Description",
        clear: "Clear Description",
      },
      productData,
    },
    {
      index: 1,
      id: "article",
      requestType: "article",
      label: "Generate an Article",
      placeholder: "Generate an Article",
      buttonNames: {
        generate: "Generate Article",
        update: "Add Article",
        clear: "Clear Article",
      },
      productData,
    },
    {
      index: 2,
      id: "post",
      requestType: "post",
      label: "Generate a Post",
      placeholder: "Generate a Post",
      buttonNames: {
        generate: "Generate Post",
        clear: "clear Post",
      },
      productData,
    },
  ];
  const handleUpdateDescription = () => {
    updateProductProperty(
      "description",
      "my description has changed for the better of line-height"
    );
  };
  const handleClearClick = (id) => {
    handleUpdateDescription();

    setDisplayDocument((previous) => ({ ...previous, [id]: "" }));
  };

  const renderAccordionItem = ({
    index,
    id,
    header,
    message,
    label,
    placeholder,
    buttonNames,
    productData,
    requestType,
    displayText,
    displayHTML,
  }) => {
    // if (accordionOptions[id])
    return (
      <div
        className={accordionOptions[id] ? "" : "ion-hide"}
        key={index}
        value={index}
      >
        <IonGrid>
          <IonRow>
            <IonCol size="12">
            words: {words}
            {displayDocumentType === "text" ? (
                  <TextWithMarkers markedText={words.join(" ")} />
                ) : displayDocumentType === "html" ? (
                  <p
                    className={
                      displayDocumentType === "text" ? "typewriter" : ""
                    }
                    dangerouslySetInnerHTML={{
                      __html: displayDocument[requestType],
                    }}
                  />
                ) : (
                  <div></div>
                )}


              <IonCol className="">Document Validation Tracker:</IonCol>
              <IonCol size="12">
                {displayDocumentType === "text" ? (
                  <TextWithMarkers markedText={displayDocument[requestType]} />
                ) : displayDocumentType === "html" ? (
                  <p
                    className={
                      displayDocumentType === "text" ? "typewriter" : ""
                    }
                    dangerouslySetInnerHTML={{
                      __html: displayDocument[requestType],
                    }}
                  />
                ) : (
                  <div></div>
                )}
              </IonCol>
            </IonCol>
            <IonCol></IonCol>

            <IonCol size="12"></IonCol>

            <IonCol size="12"></IonCol>
          </IonRow>
        </IonGrid>
        <IonItem slot="header" color="light">
          <IonLabel>{label}</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
          <IonItem>
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <IonTextarea
                    key={id}
                    // ref={(ref) => ref && addTextareaRef(id, ref)}
                    aria-label={label}
                    label={label}
                    labelPlacement="stacked"
                    placeholder={placeholder}
                    value={
                      displayDocumentType === "text"
                        ? cleanText(displayDocument[requestType])
                        : displayDocument[requestType]
                    }
                    autoGrow={true}
                    className="description-textarea"
                    debounce={300}
                    onIonChange={(e) => handleTextBoxChange(e, requestType)}
                  ></IonTextarea>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonItemDivider>
                  <IonButtons slot="end">
                    {buttonNames?.generate && (
                      <IonButton
                        disabled={disableButtons}
                        onClick={() => handleAiRequest(requestType, id)}
                      >
                        {buttonNames.generate}
                      </IonButton>
                    )}
                    {buttonNames?.update && (
                      <IonButton
                        disabled={disableButtons}
                        onClick={() =>
                          handleUpdateClick(
                            header,
                            message,
                            productData,
                            displayText[requestType]
                          )
                        }
                      >
                        {buttonNames.update}
                      </IonButton>
                    )}
                    {buttonNames?.clear && (
                      <IonButton
                        disabled={disableButtons}
                        key={requestType}
                        ref={(ref) => (scrollRef.current[requestType] = ref)}
                        onClick={() => {
                          handleClearClick(id);
                        }}
                      >
                        {buttonNames.clear}
                      </IonButton>
                    )}
                  </IonButtons>
                </IonItemDivider>
              </IonRow>
            </IonGrid>
          </IonItem>
        </div>
      </div>
    );
  };

  return (
    <IonRow>
      <IonCol className="ion-padding" size="12">
        <SelectedOptions
          productDescOptions={languageOptions}
          title="Selected Tailored Discourse"
          legend={legend}
        />
        <SelectedOptions
          productDescOptions={focusOptions}
          title="Selected Attributes"
          legend={legend}
        />
      </IonCol>
      <IonCol size="12">
        <IonAccordionGroup
          animated={true}
          expand="inset"
          ref={accordionGroupRef}
          multiple={true}
        >
          {accordions.map((accordion) =>
            renderAccordionItem({
              ...accordion,
              displayText: displayDocument,
              displayHTML: displayDocument,
            })
          )}
        </IonAccordionGroup>
      </IonCol>

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
