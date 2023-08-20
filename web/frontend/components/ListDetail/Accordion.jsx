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
  IonIcon,
  IonPopover,
  IonText,
  useIonPopover,
} from "@ionic/react";
import {
  informationCircleOutline,
  exitOutline,
  informationCircle,
} from "ionicons/icons";
import { Context } from "../../utilities/data-context";
import { pageIngCache, History, formatProducts } from "../../utilities/store";
import {
  stableFetchComponent,
  useNavigationDataContext,
  ReactRenderingComponent,
  addMarkup,
} from "../providers";
import bcrypt from "bcryptjs";
import { useLocation, useNavigate } from "react_router_dom";
import { useAuthenticatedFetch, useAppBridge } from "@shopify/app-bridge-react";

import { request } from "@shopify/app-bridge/actions/AuthCode";
import { useShopifyContext } from "../providers/ShopifyContext";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import { SessionToken } from "@shopify/app-bridge/actions";

import {
  useProductDataContext,
  TextWithMarkers,
  cleanText,
  AccordionInformationHeader,
  BlogSelection,
  SelectedOptions,
  IonButtonInformation,
  useDataProvidersContext
} from "../../components";

const shortenText = (text) =>
  text && text.length > 20 ? text.substring(0, 30) + "..." : text;

const generateHash = async (id) => {
  const saltRounds = 10;
  try {
    // const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(id, "$2a$10$agg0ld9ZpiH/fVKYZDq/Tu");
    return hash;
  } catch (error) {
    console.log("hash error", error);
  }
};
export function Accordion({
  setAccordionModalPopUp,
  // subscriptions,
  setAccordionLoadingState,
  //currentSession,
}) {

const {checkFeatureAccess,subscriptions,currentSession} = useDataProvidersContext()

  const Popover = () => (
    <IonContent className="ion-padding">Hello World!</IonContent>
  );
  const [present, dismiss] = useIonPopover(Popover, {
    onDismiss: (data, role) => dismiss(data, role),
  });
  const popoverRef = useRef(null);

  let { productData, updateProductProperty } = useProductDataContext();

  const accordionGroupRef = useRef(null);

  const [legend, setLegend] = useState([]);

  const [focusOptions, setProductDescOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [alertHeader, setAlertHeader] = useState();
  const [alertMessage, setAlertMessage] = useState();
  const [accordionOptions, setAccordionOptions] = useState({});
  const [currentAccordion, setCurrentAccordion] = useState(null);
  const scrollRef = useRef([]);
  const [sessionToken, setSessionToken] = useState();
  const [showModal, setShowModal] = useState(false); // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirm state
  const [hashedBlogName, setHashBlogName] = useState("");
  const { aiWorkStation, aiWorkStationSetter } = useNavigationDataContext();

  useEffect(() => {
    if (aiWorkStation !== null) {
      setAccordionModalPopUp(true);
      setAccordionOptions({ [aiWorkStation]: true });
      setCurrentAccordion(aiWorkStation);
      aiWorkStationSetter(null);
    }
  }, [aiWorkStation]);
  useEffect(async () => {
    const blogName = await generateHash(currentSession.shop);
    setHashBlogName(blogName);
  }, []);

  const blogSelectionRef = useRef(null);

  const addArticleClick = () => {
    // Access and trigger the handleChildAction function in the child component

    if (blogSelectionRef.current) {
      blogSelectionRef.current.handleAddArticle();
    }
  };

  const addPostClick = async (id) => {
    console.log("id: " + id);

    const { data, error } = await stableFetchComponent.post_async(
      { url: "/api/blog/id", body: { id } },
      fetch
    );
    console.log("error", error);
    console.log("data", data);
  };

  const navigate = useNavigate();
  const app = useAppBridge();

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
  const [serverWords, setServerWords] = useState([]);
  const [markupText, setMarkupText] = useState("");
  const accordionRefs = useRef({});
  const addToAccordionRefs = (name, el) => {
    accordionRefs.current[name] = el;
  };

  const toggleOpenAccordion = (selectedAccordion) => {
    const accordion = accordionRefs.current[currentAccordion];

    if (!accordion) {
      return;
    }
    const nativeEl = accordion;

    nativeEl.value = selectedAccordion;
  };

  function eventSource(requestType, callback) {
    // Check if the EventSource is already initialized and return the existing Promise if available

    setServerWords([]);
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
        toggleOpenAccordion("requirements");

        setDocumentLoading(true);

        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId); // Clear the timeout since the connection is successful
          resolve({ active: true, event: eventSource }); // Resolve the promise with 'true' on successful connection
        }
      };

      const Debounce = (callback, delay) => {
        let timerId;
        return (...args) => {
          clearTimeout(timerId);
          timerId = setTimeout(() => {
            callback(...args);
          }, delay);
        };
      };
      const scrollSmoothly = (requestType) => {
        scrollRef.current[requestType].scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "center",
          scrollMode: "always",
          blockOffset: 70,
        });
      };
      let str = "";
      eventSource.addEventListener("message", (event) => {
        // Handle the received SSE message

        const eventData = JSON.parse(event.data);

        // Handle the received SSE message

        if (eventData.message === "Job stream") {
          const delta = eventData.delta;
          const word = delta.content;
          const finish_reason = delta.finish_reason;
          Debounce(scrollSmoothly(requestType), 300);
          str += word;
          setServerWords((prevWords) => [...prevWords, word]);

          if (finish_reason) {
            setWords((prevWords) => [...prevWords, cleanText(str)]);
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
          resolve({ active: true, event: eventSource });
          // Resolve the promise with 'true' on successful connection
        }

        setDocumentLoading(false);
      };
    });

    return eventSourcePromise;
  }

  useEffect(() => {
    setMarkupText(addMarkup(words.join("")));
  }, [words]);

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
        console.log("legend", promptTextAndLegend.legend);
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
  let initialOpenTab = false;
  function onInputTextAreaChange(event, requestType) {
    if (!initialOpenTab) {
      toggleOpenAccordion("presentation");
      initialOpenTab = true;
    }

    setWords([event.target.value]);
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

  const handleUpdateClick = async (productData, type) => {
    const descriptionHtml = markupText;
    if (type === "description" && markupText.length) {
      const productId = productData.id.split("/").pop();

      const { data, error } = await stableFetchComponent.post_async(
        {
          url: "/api/products/update/description",
          body: {
            productId,
            descriptionHtml,
          },
        },
        fetch
      );
      console.log("data: " + data);
      console.log("error: " + error);

      if (error === null) {
        updateProductProperty("description", markupText);
        console.log("current Cursor", productData.currentCursor);
        pageIngCache.clearKey(productData.currentCursor);
        console.log("product updated");
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
    } else if (type === "article" && markupText.length) {
      addArticleClick(descriptionHtml);
    } else if (type === "post" && markupText.length) {
      addPostClick(hashedBlogName);
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
      label: "Description Assist",
      header: "Updating Your Description",
      message: "You Will Be Updating Your Description",
      placeholder: "Create or Modify Your Description Here",
      helperNotesClear: "Clear the Description",
      helperNotesAssist:
        "Utilize the audience templates and product particulars to aid in shaping your description.",
      helperNotesUpdate:
        "Once you've crafted your content, incorporate it into your product details",
      buttonNames: {
        generate: "Description Assist",
        update: "Update Description",
        clear: "Clear Description",
      },
      productData,
    },
    {
      index: 1,
      id: "article",
      requestType: "article",
      label: "Article Assist",
      placeholder: "Create or Modify Your Article Here",
      helperNotesClear: "Clear the Article",
      helperNotesAssist:
        "Utilize the audience templates and product particulars to aid in shaping your article.",
      helperNotesUpdate:
        "Once you've crafted your content, incorporate it into your blog as an article. Be sure to choose or create a fitting title for both your blog and the article.",
      buttonNames: {
        generate: "Article Assist",
        update: "Add Article",
        clear: "Clear Article",
      },
      productData,
    },
    {
      index: 2,
      id: "post",
      requestType: "post",
      label: "Post Assist",
      helperNotesClear: "Clear the content Post",
      helperNotesAssist:
        "Utilize the audience templates and product particulars to aid in shaping your post content.",
      helperNotesUpdate:
        "After creating your content, seamlessly integrate it into your social media posts, advertisements, and blend it into your other spontaneous creative pieces.( Please note this will generate a new Blog called " +
        hashedBlogName +
        " where we will store your content)",
      placeholder: "Create or Modify Your Post Here",
      buttonNames: {
        generate: "Post Assist",
        update: "Add your post",
        clear: "clear Post",
      },
      productData,
    },
  ];

  const handleClearClick = (id) => {
    setDisplayDocument((previous) => ({ ...previous, [id]: "" }));
    setWords([]);
    setServerWords([]);
  };

  const accordionGroup = useRef(null);
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
    helperNotesClear,
    helperNotesAssist,
    helperNotesUpdate,
  }) => {

    const {checkFeatureAccess} = useDataProvidersContext()

    const[markupViewLock, setMarkupViewLock] = useState(checkFeatureAccess(["crafted"]));
    const [renderedViewLock, setRenderedViewLock] = useState(checkFeatureAccess(["crafted"]).hasAccess);
    // if (accordionOptions[id])
    return (
      <div
        className={accordionOptions[id] ? "" : "ion-hide"}
        key={index}
        value={index}
      >
        <IonGrid>
          <IonGrid>
            <IonRow>
              {id === "article" && (
                <BlogSelection
                  currentBox={currentAccordion}
                  article={markupText}
                  ref={blogSelectionRef}
                />
              )}
            </IonRow>
          </IonGrid>

          <IonRow>
            <IonCol size="12">
              <IonAccordionGroup
                expand="inset"
                ref={(el) => {
                  addToAccordionRefs(requestType, el);
                }}
                multiple={true}
              >
                <IonAccordion value="requirements">
                  <AccordionInformationHeader
                    accordionName={`Requirements`} //HighlightHub
                    boxName={currentAccordion}
                    lock={true}
                    note={`Your requirements and selections are visually highlighted within the document.`}
                  />

                  <div className="ion-padding" slot="content">
                    <TextWithMarkers markedText={serverWords.join("")} />
                  </div>
                </IonAccordion>
                <IonAccordion
                disabled={!markupViewLock.hasAccess}
                  ref={(ref) => (scrollRef.current[requestType] = ref)}
                  value="markup"
                >
                  <AccordionInformationHeader
              
                    accordionName={markupViewLock.hasAccess ? `MarkUp`: markupViewLock.message(`MarkUp`)}
                    boxName={currentAccordion}
                    lock={markupViewLock.hasAccess}
                    note={`Examine the original text content of your descriptions, websites, blogs, and articles.`}
                  />
                  <div className="ion-padding" slot="content">
                    {markupText}
                  </div>
                </IonAccordion>
                <IonAccordion
                disabled={!markupViewLock.hasAccess} 
                value="present">
                  <AccordionInformationHeader
                    accordionName={markupViewLock.hasAccess ? `Presentation`: markupViewLock.message(`Presentation`)}
                    boxName={currentAccordion}
                    note={`Preview how the content will appear on your websites, blogs, and articles.`}
                    lock={markupViewLock.hasAccess}
                  />
                  <div className="ion-padding" slot="content">
                    <ReactRenderingComponent text={words.join("")} />
                  </div>
                </IonAccordion>
              </IonAccordionGroup>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonItem lines="full">
                <IonIcon
                  size="small"
                  color="secondary"
                  slot="end"
                  aria-label="Include existing description in composition"
                  id={`explainer-${id}-info` + currentAccordion}
                  icon={informationCircleOutline}
                ></IonIcon>{" "}
              </IonItem>
              <IonPopover
                key={"Include existing description in composition"}
                translucent={true}
                animated="true"
                trigger={`explainer-${id}-info` + currentAccordion}
                triggerAction="hover"
              >
                <IonContent className="ion-padding">
                  <IonText>
                    <p>
                      <sub>
                        We Support your favorite Markdown syntax.
                        <br /> Html :{" "}
                        <IonText color="tertiary">
                          {`<strong>...</strong><bold>...</bold><h1>...</h1>...`}
                        </IonText>
                        <br /> Markdown :{" "}
                        <IonText color="tertiary">
                          {`< $E=mc^2$, 
                          # Main Title
                          ## Subtitle
                          ### Sub-subtitle,    
                          - [x] Task 1
                          - [ ] Task 2
                          - [ ] Task 3
                          ...`}
                        </IonText>
                        <br />
                        Katex :{" "}
                        <IonText color="tertiary">
                          {`$$\displaystyle\sum_{i=1}^n $$`}
                        </IonText>
                        <br />
                        Use your favorite syntax to preview and format your
                        document.
                        <a
                          target="_top"
                          href="https://www.markdownguide.org/cheat-sheet/"
                        >
                          Mark Down
                        </a>
                        ,{" "}
                        <a
                          target="_top"
                          href="https://www.markdownguide.org/cheat-sheet/"
                        >
                          KATEX
                        </a>
                      </sub>
                    </p>
                  </IonText>
                  <IonText color="secondary">
                    <sub>
                      <IonIcon icon={exitOutline}></IonIcon> click outside box
                      to close
                    </sub>
                  </IonText>
                </IonContent>
              </IonPopover>{" "}
              <IonTextarea
                key={id}
                // ref={(ref) => ref && addTextareaRef(id, ref)}
                ariaLabel={"Create a document and preview it here"}
                label={"Create a document and preview it here"}
                labelPlacement="stacked"
                placeholder={placeholder}
                value={
                  displayDocumentType === "text"
                    ? words.join("")
                    : displayDocument[requestType]
                }
                onIonInput={onInputTextAreaChange}
                autoGrow={true}
                className="description-textarea"
                debounce={200}
                // onIonChange={(e) => handleTextBoxChange(e, requestType)}
              ></IonTextarea>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-between  ion-justify-content-evenly  ">
            <IonCol size="12">
              <IonRow className="ion-justify-content-evenly">
                <IonCol size="4">
                  {buttonNames?.generate && (
                    <IonButtonInformation
                      ButtonName={buttonNames.generate}
                      hoverId={"box-button" + id + "-" + buttonNames.generate}
                      PopoverContent={helperNotesAssist}
                      disabledButton={disableButtons}
                      clickHandler={handleAiRequest}
                      clickArgs={[requestType, id]}
                    />
                  )}
                </IonCol>
                <IonCol size="4">
                  {buttonNames?.update && (
                    <IonButtonInformation
                      ButtonName={buttonNames.update}
                      hoverId={
                        "box-button-update" + id + "-" + buttonNames.update
                      }
                      PopoverContent={helperNotesUpdate}
                      disabledButton={disableButtons}
                      clickHandler={handleUpdateClick}
                      clickArgs={[productData, requestType]}
                    />
                  )}
                </IonCol>
                <IonCol size="4">
                  {buttonNames?.clear && (
                    <IonButtonInformation
                      ButtonName={buttonNames.clear}
                      hoverId={
                        "box-button-clear" + id + "-" + buttonNames.update
                      }
                      PopoverContent={helperNotesClear}
                      disabledButton={disableButtons}
                      clickHandler={handleClearClick}
                      clickArgs={[requestType]}
                    />
                  )}
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
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
