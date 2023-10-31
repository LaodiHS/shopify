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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/react";
import {
  informationCircleOutline,
  exitOutline,
  informationCircle,
} from "ionicons/icons";
import { Context } from "../../utilities/data-context";

import {
  useNavigationDataContext,
  ReactRenderingComponent,
  addMarkup,
} from "../providers";
import { productViewCache } from "../../utilities/store";
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
  useDataProvidersContext,
  quicksBarConfig,
  UseGridStack,
  ChartComponent,
  ReadabilityStats,
  BarChartComponent,
  WordCloud,
  useTinyMCEDataContext,
} from "../../components";
import { select } from "d3";

export function Accordion({
  setAccordionModalPopUp,
  // subscriptions,
  setAccordionLoadingState,
  //currentSession,
}) {
  const [legend, setLegend] = useState([]);

  const [alertHeader, setAlertHeader] = useState();
  const [alertMessage, setAlertMessage] = useState();
  const [accordionOptions, setAccordionOptions] = useState({});
  const [currentAccordion, setCurrentAccordion] = useState(null);
  const scrollRef = useRef([]);
  const [sessionToken, setSessionToken] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirm state
  const [hashedBlogName, setHashBlogName] = useState("");
  const { aiWorkStation, aiWorkStationSetter } = useNavigationDataContext();

  const [words, setWords] = useState([]);
  const [serverWords, setServerWords] = useState([]);
  const [progress, setProgress] = useState(0);
  const resolveWithConfirm = useRef(null);
  const accordionGroupRef = useRef(null);
  // Function to resolve the promise with confirmation

  const [handlerMessage, setHandlerMessage] = useState("");
  const [roleMessage, setRoleMessage] = useState("");
  const [presentToast] = useIonToast();

  const [displayDocument, setDisplayDocument] = useState({
    article: "",
    description: "",
    post: "",
  });
  const accordionRefs = useRef({});

  const [displayDocumentType, setDisplayDocumentType] = useState("text");
  const blogSelectionRef = useRef(null);

  const {
    productData,
    updateProductProperty,
    selectedImageMap,
    checkFeatureAccess,
    subscriptions,
    currentSession,
    productDetailOptions,
    languageOptions,
    uncachedFetchData,
    assignLegend,
    assignAssistRequest,
    assignUpdateArticleMethod,
    markupText,
    setMarkupText,
    setServerSentEventLoading,
    setContentSaved,
    eventEmitter,
    assignClearAssistMethod,
    mappedLegend,
    isProductsLoading,
    pageIngCache,
    formatProducts,
    lockAllTasks,
    DataProviderNavigate,
  } = useProductDataContext();

  const location = useLocation();
  const navigate = useNavigate();
  const app = useAppBridge();
  const fetch = useAuthenticatedFetch();
  const shopifySession = useShopifyContext();

  console.log("selectedImageMap: ", selectedImageMap);

  const Popover = () => (
    <IonContent className="ion-padding">Hello World!</IonContent>
  );
  const [present, dismiss] = useIonPopover(Popover, {
    onDismiss: (data, role) => dismiss(data, role),
  });


  useEffect(() => {
    if (productData) {
      setWords([productData.description]);
      setMarkupText(productData.description);
    } else {
      console.log('reroute hit for root!!!!!!!!!!!!!!!!!!!!!!!!!')
      DataProviderNavigate("/",{target:"host"})
   
    }
  }, []);


  useEffect(() => {
    // console.log("aiworkstation", aiWorkStation);
    if (aiWorkStation !== null) {
      setAccordionOptions({ [aiWorkStation]: true });
      setCurrentAccordion(aiWorkStation);
    }
  }, [aiWorkStation]);

  useEffect(async () => {
    // const blogName = await generateHash(currentSession.shop);
    // setHashBlogName(blogName);
  }, []);

  useEffect(() => {
    assignUpdateArticleMethod(() => handleUpdateClick);
  }, []);

  useEffect(() => {
    setMarkupText(addMarkup(words.join("")));
  }, [words]);

  useEffect(async () => {
    const token = await getSessionToken(app);
    setSessionToken(token);

    let session = await app.getState();

    return () => {};
  }, [app]);
  useEffect(() => {
    assignAssistRequest(() => handleNonSelectedItems);
  }, []);


  useEffect(() => {
    assignClearAssistMethod("handleClearClick", handleClearClick);
  }, []);
  function handleClearClick(id) {
    setDisplayDocument((previous) => ({ ...previous, [id]: "" }));
    setWords([]);
    setServerWords([]);
  }

  function addToAccordionRefs(name, el) {
    accordionRefs.current[name] = el;
  }
  function assignMarkupText(text) {
    setMarkupText(text);
  }

  function addArticleClick() {
    // Access and trigger the handleChildAction function in the child component

    if (blogSelectionRef.current) {
      console.log("blogSelectionRef.current", blogSelectionRef.current);
      blogSelectionRef.current.handleAddArticle();
    }
  }

  async function addPostClick(id) {
    const { data, error } = await uncachedFetchData({
      url: "/api/blog/id",
      method: "POST",
      body: { id },
    });
    console.log("error", error);
    console.log("data", data);
  }

  function defineDisplayDocument(accordionId, documentType, document) {
    // Clear the current display
    // Set the display area
    setDisplayDocumentType(documentType);
    // Call the appropriate function from setDocuments
    setDocuments[documentType](accordionId, document);
  }

  function toggleOpenAccordion(selectedAccordion) {
    console.log("current accordion", currentAccordion);
    console.log("selected accordion", selectedAccordion);
    console.log("accordionRefs-->", accordionRefs);
    const accordion = accordionRefs.current[aiWorkStation];

    if (!accordion) {
      return;
    }
    const nativeEl = accordion;

    nativeEl.value = selectedAccordion;
  }

  // Define the setDocuments object outside the function
  const setDocuments = {
    html: (accordionId, document) => {
      console.log("received html document: ", document);
      setDisplayDocument((previous) => ({
        ...previous,
        [accordionId]: document,
      }));
    },
    text: (accordionId, document) => {
      setDisplayDocument((previous) => ({
        ...previous,
        [accordionId]: document,
      }));
    },
  };

  async function eventSource({
    accordionId,
    eventEmitter,
    selectedImageMap,
    mappedLegend,
  }) {
    // Check if the EventSource is already initialized and return the existing Promise if available
if(!mappedLegend){
  throw new Error('no mappedLegend', mappedLegend);
}
    setServerWords([]);
    const local = { ...currentSession };
    const locals = JSON.stringify(local);
    console.log("locals----", locals);
    // Create a new Promise for the EventSource connection
    const eventSourcePromise = await new Promise((resolve, reject) => {
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
          setServerSentEventLoading(false);
          eventSource.close();
        }
      }, 10000); // Set the timeout to 10 seconds (adjust as needed)

      eventSource.onopen = () => {
        console.log("accordion opening");
        toggleOpenAccordion("requirements");

        setServerSentEventLoading(true);

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
      const scrollSmoothly = (accordionId) => {
        // scrollRef.current[accordionId].scrollIntoView({
        //   behavior: "smooth",
        //   block: "end",
        //   inline: "center",
        //   scrollMode: "always",
        //    blockOffset: 70,
        // });
      };
      let activityTimer = false;
      const activityTimeoutId = setTimeout(() => {
        if (!activityTimer) {
          eventSource.close();
          setServerSentEventLoading(false);
          presentToast({
            message: "There was a network error, Please try again later.",
            duration: 9000,
            position: "middle", // top, bottom, middle
            color: "warning",
            onDidDismiss: (e) => {
              //setRoleMessage(`Dismissed with role: ${e.detail.role}`);
            },
          });
          activityTimer = false;
          console.log("activity timer end");
        }
      }, 20000);

      eventEmitter.on("error", (error) => {
        clearTimeout(activityTimeoutId);
        eventSource.close();
        setServerSentEventLoading(false);
        presentToast({
          message: "There was a network error, Please try again later.",
          duration: 9000,
          position: "middle", // top, bottom, middle
          color: "warning",
          onDidDismiss: (e) => {
            setServerSentEventLoading(false);

            //setRoleMessage(`Dismissed with role: ${e.detail.role}`);
          },
        });
      });

      let str = "";
      console.log("mappedLegend-: ", mappedLegend.mappedLegend);
      eventSource.addEventListener("message", (event) => {
        // Handle the received SSE message

        const eventData = JSON.parse(event.data);

        // Handle the received SSE message

        if (eventData.message === "Job stream") {
          activityTimer = true;

          const delta = eventData.delta;
          const word = delta.content;
          const finish_reason = delta.finish_reason;
          Debounce(scrollSmoothly(accordionId), 400);
          str += word;
          
          // console.log('word: ' , word);
          eventEmitter.emit("streamData", eventData);
          //  setServerWords((prevWords) => [...prevWords, word]);
          // eventEmitter.emit("description_assist", cleanText(word));

          if (finish_reason) {
            console.log("finish_reason", finish_reason);
            console.log("mappedLegend: ", mappedLegend);
            const pureText = cleanText({ str, selectedImageMap, mappedLegend: mappedLegend.mappedLegend });
            setMarkupText((pre) => pre.concat(pureText));
            str = "";
            //  eventEmitter.emit("description_assist", pureText);
            //setWords((prevWords) => [...prevWords, cleanText(str)]);
            eventSource.close();
            setServerSentEventLoading(false);
          }
        }

        // Check if the job is completed or perform other actions based on the event data
        if (eventData.message === "Job completed") {
          const data = eventData.result;

          if (data.error) {
            console.log("error", data.error);
            console.log("error message received: " + data.error);
            presentToast({
              message: "There was a network error! We are working on it.",
              duration: 9000,
              position: "top", // top, bottom, middle
              onDidDismiss: (e) => {
                setServerSentEventLoading(false);

                //setRoleMessage(`Dismissed with role: ${e.detail.role}`);
              },
            });
          } else {
            const { documentType } = data;
            const document = data[documentType];
            defineDisplayDocument(accordionId, documentType, document);
          }

          setServerSentEventLoading(false);
          eventSource.close();
          //setAccordionLoadingState(false);
        }

        if (eventData.message.includes("Error: Job")) {
          //const result = eventData.result;
          presentToast({
            message: "There was a error! We are working on it.",
            duration: 9000,
            position: "top", // top, bottom, middle
            onDidDismiss: (e) => {
              setServerSentEventLoading(false);

              //setRoleMessage(`Dismissed with role: ${e.detail.role}`);
            },
          });
          setServerSentEventLoading(false);
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
          setServerSentEventLoading(false);
          clearTimeout(timeoutId); // Clear the timeout on error
          reject(error); // Reject the promise with the specific error
        }
        setServerSentEventLoading(false);
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

        setServerSentEventLoading(false);
      };
    });

    return eventSourcePromise;
  }

  async function aiRequest(
    { productData, focus, language, accordionId },
    route,
    endpoint
  ) {
    try {
      console.log("route", route, language);
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
          accordionId,
        }),
      });

      if (response.ok) {
        const generatedPrompt = await response.json();
        assignLegend(generatedPrompt.legend);
        console.log(generatedPrompt.message);
        return generatedPrompt;
      } else {
        eventEmitter.emit("error", response.statusText);
        const generatedPrompt = await response.json();
        console.log(generatedPrompt.message);
        return generatedPrompt;
      }
    } catch (error) {
      console.log("error emitted");
      eventEmitter.emit("error", error);
      throw new Error(error.message);
    }
  }

  async function setDataListener({
    accordionId,
    template,
    languageOptions,
    selectedImageMap,
    mappedLegend,
  }) {
const Legend = {}
    if(!mappedLegend){
      throw new Error("no mapped legend", mappedLegend);
    }
    const listenerSet = await eventSource({
      accordionId,
      eventEmitter,
      selectedImageMap,
      mappedLegend: Legend,
    });
    console.log("listenerSet: ", listenerSet);

    if (listenerSet.active) {
      const promptTextAndLegend = await aiRequest(
        {
          productData,
          focus: productDetailOptions,
          language: languageOptions,
          accordionId,
        },
        accordionId,
        template
      );
      setTimeout(() => {
        scrollRef.current[accordionId].scrollIntoView({
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
            setServerSentEventLoading(false);

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
               Legend["mappedLegend"] = promptTextAndLegend.legend;
        setLegend(promptTextAndLegend.legend);
 
        console.log("legend", promptTextAndLegend.legend);
      }
    } else {
      presentToast({
        message: "There was a network error!",
        duration: 3000,
        onDidDismiss: (e) => {
          setServerSentEventLoading(false);
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
  function onInputTextAreaChange(event, accordionId) {
    if (!initialOpenTab) {
      toggleOpenAccordion("presentation");
      initialOpenTab = true;
    }

    setWords([event.target.value]);
  }
  function handleTextBoxChange(event, accordionId) {
    setDisplayDocument((previous) => ({
      ...previous,
      [accordionId]: event.detail.value,
    }));
  }

  async function handleNonSelectedItems(accordionId) {
    const showAlert = async (title, message, template) => {
      const confirm = await showConfirmAlert(title, message);
if(!mappedLegend ){
  throw new Error('no mapped legend found')
}
      if (confirm) {
        await setDataListener({
          accordionId,
          template,
          languageOptions,
          selectedImageMap,
          mappedLegend,
        });
      }
      return null;
    };

    if (!languageOptions.length && !productDetailOptions.length) {
      return await showAlert(
        "No Selections Made",
        "The standard audience and product focus will be applied",
        "empty-template"
      );
    }

    if (!productDetailOptions?.length) {
      return await showAlert(
        "No Product Highlights Selected",
        "A general product focus will be applied",
        "language-options"
      );
    }

    if (!languageOptions.length) {
      return await showAlert(
        "No Audience Selected",
        "A general audience will be applied",
        "focus-options"
      );
    }

    await setDataListener({
      accordionId,
      template: "focus-language-options",
      languageOptions,
      selectedImageMap,
      mappedLegend,
    });
  }

  async function handleUpdateClick(type, markupText) {
    console.log("type", type);
    console.log("markup Text", markupText);
    const descriptionHtml = markupText;
    if (type === "description" && markupText.length) {
      const productId = productData.slice().id.split("/").pop();

      const { data, error } = await uncachedFetchData({
        url: "/api/products/update/description",
        method: "POST",
        body: {
          productId,
          descriptionHtml,
        },
      });
      console.log(`data: ${data}`);
      console.log(`error: ${error}`);

      if (error === null) {
        const { productUpdate } = data;
        const { product } = productUpdate;
        const { descriptionHtml } = product;
        setContentSaved(true);
        console.log("save");
        await updateProductProperty("description", descriptionHtml);
        setMarkupText(descriptionHtml);
        console.log("current Cursor", productData.currentCursor);
   
        console.log("product updated");
      }
      return;
    }
    if (type === "article" && markupText.length) {
      console.log("article update hit");
      addArticleClick(descriptionHtml);
    } else if (type === "post" && markupText.length) {
      addPostClick(hashedBlogName);
    }
  }

  async function showConfirmAlert(header, message) {
    if (!header || !message) {
      throw new Error("Please select a header and a message");
    }
    setAlertHeader(header);
    setAlertMessage(message);
    return await new Promise((resolve) => {
      setShowConfirmModal(true);
      resolveWithConfirm.current = resolve;
    });
  }

  function handleConfirmModalDismiss() {
    setShowConfirmModal(false);
    resolveWithConfirm.current(false); // Resolve the promise with false to indicate cancellation
  }

  function handleConfirmModalConfirm() {
    setShowConfirmModal(false);
    resolveWithConfirm.current(true); // Resolve the promise with true to indicate confirmation
  }

  const accordions = [
    {
      index: 0,
      // markupText,   setMarkupText,
      // checkFeatureAccess,
      assignMarkupText,
      scrollRef,
      aiWorkStation,
      addToAccordionRefs,
      accordionId: "description",
      label: "Description Assist",
      header: "Updating Your Description",
      message: "You Will Be Updating Your Description",
      placeholder: "Create or Modify Your Description Here",
      helperNotesClear: "Clear the Description",
      helperNotesAssist:
        "Utilize the audience templates and product particulars to aid in shaping your description.",
      helperNotesUpdate:
        "Once you've sourwood your content, incorporate it into your product details",
      buttonNames: {
        generate: "Description Assist",
        update: "Update Description",
        clear: "Clear Description",
      },
      productData,
    },
    {
      index: 1,
      // markupText,  setMarkupText,
      // checkFeatureAccess,

      scrollRef,
      aiWorkStation,
      addToAccordionRefs,
      accordionId: "article",
      label: "Article Assist",
      placeholder: "Create or Modify Your Article Here",
      helperNotesClear: "Clear the Article",
      helperNotesAssist:
        "Utilize the audience templates and product particulars to aid in shaping your article.",
      helperNotesUpdate:
        "Once you've sourwood your content, incorporate it into your blog as an article. Be sure to choose or create a fitting title for both your blog and the article.",
      buttonNames: {
        generate: "Article Assist",
        update: "Add Article",
        clear: "Clear Article",
      },
      productData,
    },
    {
      index: 2,
      // markupText,    setMarkupText,
      // checkFeatureAccess,

      scrollRef,
      aiWorkStation,
      addToAccordionRefs,
      accordionId: "post",
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
  ]
    .map((accordion) =>
      Object.assign(accordion, {
        eventEmitter,
        assignClearAssistMethod,
        mappedLegend,
        selectedImageMap,
        checkFeatureAccess,
      })
    )
    .filter((acc) => acc.accordionId === aiWorkStation);

  return (
    <IonRow key="IonRow">
      <IonCol className="ion-padding" key="IonCol1" size="12">
        <SelectedOptions
          productDescOptions={languageOptions}
          title="Selected Tailored Discourse"
          legend={legend}
        />

        <SelectedOptions
          productDescOptions={productDetailOptions}
          title="Selected Attributes"
          legend={legend}
        />
      </IonCol>
      <IonCol key="ionColAccordionGroup" size="12">
        <IonAccordionGroup
          key="IonAccordionGroupAnimated"
          animated={true}
          expand="inset"
          ref={accordionGroupRef}
          multiple={true}
        >
          {accordions.length &&
            accordions.map((accordion) =>
              renderAccordionItem({
                ...accordion,
                displayText: displayDocument,
                displayHTML: displayDocument,
                currentAccordion,
                accordionOptions,
                markupText,
                blogSelectionRef,
                serverWords,
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

function renderAccordionItem({
  index,
  accordionId,
  productData,
  accordionOptions,
  scrollRef,
  aiWorkStation,
  addToAccordionRefs,
  blogSelectionRef,
  serverWords,
  eventEmitter,
  assignClearAssistMethod,
  mappedLegend,
  // selectedImageMap,
}) {
  const [markupViewLock, setMarkupViewLock] = useState(null);
  const { Editor } = useTinyMCEDataContext();
  const {
    checkFeatureAccess,
    markupText,
    serverSentEventLoading,
    setMarkupText,
    // eventEmitter,
    DataProviderNavigate,
    // assignClearAssistMethod,
    // mappedLegend,
    selectedImageMap,
    lockAllTasks
  } = useDataProvidersContext();

  useEffect(() => {
    setMarkupViewLock(checkFeatureAccess(["sourwood"]));
  }, [checkFeatureAccess]);

  if (!markupViewLock) {
    return null;
  }

  async function autosaveContent(editor) {
    const content = editor.getContent();
    await productViewCache.set("autosaveContent", content);
    console.log(" Editor Content autosaved to localStorage:");
  }

  return (
    <div
      className={accordionOptions[accordionId] ? "" : "ion-hide"}
      key={index + 1}
      value={index + 2}
    >
      <IonGrid style={{ margin: "0px", padding: "0px" }} key={index + 3}>
        <IonGrid style={{ margin: "0px", padding: "0px" }} key={index + 4}>
          <IonRow key={index + 5}>
            {accordionId === "article" && (
              <BlogSelection
                currentBox={aiWorkStation}
                article={markupText}
                ref={blogSelectionRef}
              />
            )}
          </IonRow>
        </IonGrid>

        <IonRow key={index + 6}>
          <IonCol key={index + 7} size="12">
            <IonAccordionGroup
 
              expand="inset"
              ref={(el) => {
                addToAccordionRefs(accordionId, el);
              }}
              multiple={true}
            >
              <IonAccordion key={index + 8} value="requirements">
                <AccordionInformationHeader
                  accordionName={`Requirements`} //HighlightHub
                  boxName={aiWorkStation}
                  lock={true}
                  note={`Your requirements and selections are visually highlighted within the document.`}
                />

                <div className="ion-padding" slot="content">
                  <TextWithMarkers
                    eventEmitter={eventEmitter}
                    assignClearAssistMethod={assignClearAssistMethod}
                    mappedLegend={mappedLegend}
                    selectedImageMap={selectedImageMap}
                  />
                </div>
              </IonAccordion>

              {/* <IonAccordion
                key={index + 9}
                disabled={!markupViewLock.hasAccess}
                ref={(ref) => (scrollRef.current[accordionId] = ref)}
                value="markup"
              >
                <AccordionInformationHeader
                  accordionName={
                    markupViewLock.hasAccess
                      ? `MarkUp`
                      : markupViewLock.message(`MarkUp`)
                  }
                  boxName={aiWorkStation}
                  lock={markupViewLock.hasAccess}
                  note={`Examine the original text content of your descriptions, websites, blogs, and articles.`}
                />
                <div className="ion-padding" slot="content">

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
                  : displayDocument[accordionId]
              }
              onIonInput={onInputTextAreaChange}
              autoGrow={true}
              className="description-textarea"
              debounce={200}
              // onIonChange={(e) => handleTextBoxChange(e, accordionId)}
            ></IonTextarea>

                </div>
              </IonAccordion> */}

              <IonAccordion
                ref={(ref) => (scrollRef.current[accordionId] = ref)}
                key={index + 10}
                // disabled={!markupViewLock.hasAccess}
                value="present"
                readonly={!markupViewLock.hasAccess}
                onClick={async (e) => {
                  if (!markupViewLock.hasAccess) {
                    console.log("e=---->", e);
                    await DataProviderNavigate("/subscriptions");
                  }
                }}
              >
                <AccordionInformationHeader
                  accordionName={
                    markupViewLock.hasAccess
                      ? `Presentation`
                      : markupViewLock.message(`Presentation`)
                  }
                  boxName={aiWorkStation}
                  note={`Preview how the content will appear on your websites, blogs, and articles.`}
                  lock={markupViewLock.hasAccess}
                />
                <div className="ion-padding" slot="content">
                  <Editor
                    value={markupText}
                    inline
                    disabled={true}
                    scriptLoading={
                      {
                        // async?: boolean;
                        // defer?: boolean;
                        // delay: 600,
                      }
                    }
                    init={{
                      branding: false,

                      promotion: false,
                      theme: false,
                      skin: false,
                      content_css:
                        "tinymce/skins/content/tinymce-5/content.min.css",
                      // content_style:editorStyles,
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
                  {/* <ReactRenderingComponent text={markupText} /> */}
                </div>
              </IonAccordion>
              <IonAccordion
                key={index + 11}
                disabled={lockAllTasks}
                value="seo"
                readonly={!markupViewLock.hasAccess}
                onClick={async (e) => {
                  if (!markupViewLock.hasAccess) {
                    console.log("e=---->", e);
                    await DataProviderNavigate("/subscriptions");
                  }
                }}
              >
                <AccordionInformationHeader
                  accordionName={
                    markupViewLock.hasAccess
                      ? `SEO Analytics`
                      : markupViewLock.message(`SEO Analytics`)
                  }
                  boxName={aiWorkStation}
                
                  lock={markupViewLock.hasAccess}
                  note={`RealTime Document Analytics.`}
                />

                <IonGrid
                  style={{ margin: "0px", padding: "0px" }}
                  key={index + 12}
                  slot="content"
                >
                  <IonRow key={index + 13}>
                    <IonCol key={index + 15} size-sm="12" size-md="6" size="12">
                      <IonRow key={index + 16}>
                        <IonCol size="12" key={index + 17}>
                          <ChartComponent key={index + 18} text={markupText} />
                        </IonCol>
                        <IonCol key={index + 19}>
                          <BarChartComponent
                            key={index + 20}
                            text={markupText}
                          />
                        </IonCol>
                      </IonRow>
                    </IonCol>
                    <IonCol size-sm="12" size-md="6" size="12" key={index + 20}>
                      <IonCol size="12">
                        <ReadabilityStats
                          key={index + 21}
                          checkFeatureAccess={checkFeatureAccess}
                          text={markupText}
                        />
                      </IonCol>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonAccordion>
            </IonAccordionGroup>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonGrid style={{ margin: "0px", padding: "0px" }}>
        <IonRow>
          <IonCol size="12">
            <IonItem lines="full">
              <IonIcon
                size="small"
                color="secondary"
                slot="end"
                aria-label="Include existing description in composition"
                id={`explainer-${accordionId}-info` + aiWorkStation}
                icon={informationCircleOutline}
              ></IonIcon>
            </IonItem>
            <IonPopover
              key={"Include existing description in composition"}
              translucent={true}
              animated="true"
              trigger={`explainer-${accordionId}-info` + aiWorkStation}
              triggerAction="hover"
            >
              <IonContent className="ion-padding">
                <IonText>
                  <p>
                    <sub>Edit Your Content Using Our In Context Editor.</sub>
                    {/* <sub>
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
                    </sub> */}
                  </p>
                </IonText>
                <IonText color="secondary">
                  <sub>
                    <IonIcon icon={exitOutline}></IonIcon> click outside box to
                    close
                  </sub>
                </IonText>
              </IonContent>
            </IonPopover>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Editor</IonCardTitle>
                <IonCardSubtitle>{productData.title}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                {/* {markupText} */}
                <Editor
                  // initialValue={markupText}
                  value={markupText}
                  onEditorChange={(e) => {
                    setMarkupText(e);
                  }}
                  content_security_policy="default-src '*'"
                  setBaseUrl={"/tinymce"}
                  inline
                  //disabled={serverSentEventLoading}
                  // toolbar_sticky={true}
                  init={{
                    branding: false,
                    promotion: false,
                    content_security_policy: "default-src '*'",
                    // theme: false,
                    // content_css:
                    //   "tinymce/skins/content/tinymce-5/content.min.css",
                    inline_styles: true,
                    inline_boundaries: true,
                    // autoresize_overflow_padding: 50,

                    min_height: 500,
                    height: 500,

                    image_caption: true,
                    image_advtab: true,
                    image_description: false,
                    image_title: true,
                    a11y_acacia_options: true,
                    // ui_mode: "split",
                    //ui_mode 'split'enables support for editors in scrollable containers and adjusts the behaviour as follows:Popups, menus and inline dialogs are rendered in a separate container and inserted as a sibling to the editor. These UI elements move together as you scroll the editor’s container.If toolbar_sticky is set to true, the UI element can be docked on both page and container scroll. This means the UI element will stay in the same place relative to the container, regardless of how much you scroll the page or the container itself.
                    // readyOnly: true,
                    // disable: true,
                    // draggable_modal: true,
                    // quickbars_selection_toolbar:"bold italic | formatselect | quicklink blockquote ",
                    // quickbars_insert_toolbar:"link image | hr pagebreak | alignleft aligncenter alignright |  imageoptions | 'quickimage quicktable | hr pagebreak",
                    // imagetools_toolbar:"rotateleft rotateright | flipv fliph | editimage imageoptions",
                    // uickbars_image_toolbar:"alignleft aligncenter alignright | rotateleft rotateright | imageoptions",
                    // quickbars_automatic_toolbar:"styleselect | bold italic | alignleft aligncenter alignright | link image",
                    // quickbars_automatic_toolbar_minimal:"styleselect | bold italic | link image",
                    // quickbars_automatic_toolbar_extended:"styleselect | bold italic underline | numlist bullist | alignleft aligncenter alignright | link image",
                    // image_advtab: true,
                    // image_dimensions: true,
                    // image_caption: true,
                    // link_title: true,
                    // link_assume_external_targets: true,

                    plugins: [
                      // "autosave",
                      "lists",
                      "autolink",
                      "link",
                      "image",
                      "media",
                      "advlist",
                      "wordcount",
                      "autoresize",
                      "importcss",
                      "quickbars",
                      "insertdatetime",
                      "pagebreak",
                      "preview",
                      "table",
                      "template",
                      "visualblocks",
                      "visualchars",
                      "emoticons",
                      "accordion",
                      "code",
                      "directionality",
                      // "streamingai",
                      // "ai",
                    ],

                    setup: (editor) => {
                      let cursor;

                      let selection;

                      eventEmitter.on("description_assist", (text) => {
                        // editor.fire("description_assist", text);
                        // console.log("range", editor, selection);
                        // const newContentElement = cursor.startContainer
                        //   newContentElement.scrollIntoView({
                        //         behavior: 'smooth',
                        //         block: 'end',
                        //       })
                        //  editor.selection.setContent(text);
                        // cursor = cursor || editor.selection.getBookmark();
                        // editor.selection.moveToBookmark(cursor);
                        // editor.selection.setContent(text);
                      });

                      editor.on("description_assist", (text) => {
                        // console.log('editor.selection',editor)
                        // editor.selection.moveToBookmark(cursor);
                        // editor.selection.setContent(text,{type:"raw"});
                      });
                      // editor.addMenuItem('image', {
                      //   icon: 'image',
                      //   text: 'Image',
                      //   onclick: Dialog(editor).open,
                      //   context: 'insert',
                      //   cmd: 'mceImage',
                      //   prependToContext: true
                      // });

                      editor.on("Click", function (e) {
                        cursor = editor.selection.getBookmark();
                      });
                      editor.on("focus", function (e) {
                        editor.focus();
                        cursor = editor.selection.getBookmark();
                      });

                      editor.on("blur", function (e) {
                        cursor = editor.selection.getBookmark();
                      });

                      editor.ui.registry.addButton("title-image", {
                        text: "Select Image Title",
                        // onAction: () => editor.windowManager.open(page1Config),
                      });

                      // editor.ui.registry.addGroupToolbarButton("title-Image", {
                      //   text: "Select Article Image",
                      //   tooltip: "image",
                      //   items: "image",
                      //   onClick: () => {
                      //     console.log("on click");
                      //   },
                      // });
                      editor.on("mceImage", () => {
                        console.log("on click ");
                      });
                      // Listen for changes in the editor's content
                      editor.on("change", function (e) {
                        // Implement your own autosave logic here
                        // For demonstration purposes, we're using a simple timeout
                        // clearTimeout(editor._autosaveTimer);
                        // editor._autosaveTimer = setTimeout(function () {
                        //   autosaveContent(editor);
                        // }, 5000); // Autosave after 5 seconds of inactivity
                      });

                      // setTimeout(() => {
                      //   editor.fire("assistFire", {
                      //     newText: "hello world",
                      //     editorView: accordionId,
                      //   });
                      // }, 6000);

                      editor.on("init", () => {
                        editor.focus();

                        console.log("editor selecton", editor.selection);
                        cursor = editor.selection.getBookmark();
                        selection = editor.selection;

                        //   const contentLength = editor.getContent();
                        // console.log("contentLength", contentLength);
                        // Set the cursor to the bottom of the editor's content
                        // editor.selection.setCursorLocation(contentLength.length);
                      });
                    },
                    ...quicksBarConfig(eventEmitter),
                    mobile: {
                      menubar: false,

                      plugins: [
                        //  "autosave",
                        "lists",
                        "autolink",
                        "link",
                        "image",
                      ],
                      toolbar: ["undo", "bold", "italic", "styleselect"],
                    },
                    // autosave_interval: 10, // Autosave every 10 seconds
                    //autosave_prefix: "my-editor-autosave-", // Prefix for autosave keys
                    //autosave_restore_when_empty: true,
                    //autosave_retention: "30s",
                  }}
                />

                {/* <UseGridStack /> */}
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
        {/* <IonRow className="ion-justify-content-between  ion-justify-content-evenly  ">
          <IonCol size="12">
            <IonRow className="ion-justify-content-evenly">
              <IonCol size="4">
                {buttonNames?.generate && (
                  <IonButtonInformation
                    ButtonName={buttonNames.generate}
                    hoverId={
                      "box-button" + accordionId + "-" + buttonNames.generate
                    }
                    PopoverContent={helperNotesAssist}
                    disabledButton={disableButtons}
                    clickHandler={handleNonSelectedItems}
                    clickArgs={[accordionId]}
                  />
                )}
              </IonCol>
              <IonCol size="4">
                {buttonNames?.update && (
                  <IonButtonInformation
                    ButtonName={buttonNames.update}
                    hoverId={
                      "box-button-update" +
                      accordionId +
                      "-" +
                      buttonNames.update
                    }
                    PopoverContent={helperNotesUpdate}
                    disabledButton={disableButtons}
                    clickHandler={handleUpdateClick}
                    clickArgs={[productData, accordionId]}
                  />
                )}
              </IonCol>
              <IonCol size="4">
                {buttonNames?.clear && (
                  <IonButtonInformation
                    ButtonName={buttonNames.clear}
                    hoverId={
                      "box-button-clear" +
                      accordionId +
                      "-" +
                      buttonNames.update
                    }
                    PopoverContent={helperNotesClear}
                    disabledButton={disableButtons}
                    clickHandler={handleClearClick}
                    clickArgs={[accordionId]}
                  />
                )}
              </IonCol>
            </IonRow>
          </IonCol>
        </IonRow> */}
      </IonGrid>
    </div>
  );
}
