// import "@tensorflow/tfjs-backend-cpu";
// import "@tensorflow/tfjs-backend-webgl";
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import * as tf from "@tensorflow/tfjs";
// import { loadGraphModel } from "@tensorflow/tfjs-converter";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  createRef,
} from "react";
import {
  // useIonViewDidEnter,
  // useIonViewWillEnter,
  // useIonViewDidLeave,
  // useIonViewWillLeave,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonText,
  IonButtons,
  IonButton,
  IonIcon,
  IonPage,
  IonList,
  IonProgressBar,
} from "@ionic/react";
import {
  //useAuthenticatedFetch,
  useAppBridge,
} from "@shopify/app-bridge-react";
import {
  LHistory,
  productViewCache,
  pageIngCache,
  formatProducts,
} from "../../utilities/store";
import { indexDb } from "../../utilities/IndexDB";
import { useLocation, useNavigate } from "react_router_dom";
import { request } from "@shopify/app-bridge/actions/AuthCode";
import { useShopifyContext } from "../providers/ShopifyContext";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import { Redirect } from "@shopify/app-bridge/actions";
import { SessionToken, TitleBar } from "@shopify/app-bridge/actions";
import { useIonToast, useIonRouter } from "@ionic/react";
import { AnimatedContent } from "./";
import { NavigationRefs } from "./";

import {
  beehive,
  readingTree,
  honeyCombGridDrop,
  readingBag,
} from "../../assets";

import {
  useWorkersContext,
  ImageCachePre,
  ImageCacheSrc,
  CreateWorkers,
} from "../../components";
import { useAuthenticatedFetch } from "../../hooks";
const svgAssets = import.meta.glob("../../assets/*.svg");
// import {TRAINING_DATA} from 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/fashion-mnist.js';
// import { useWorkerContext } from './ImageCache';
// async function loadYOLOModel() {
//   const model = await loadGraphModel('path_to_yolo_model/model.json');
//   return model;
// }
if (import.meta.hot) {
  console.log("hot reload detected");
}
// async function detectObjects(imageElement, yoloModel) {
//   // Convert the image to a tensor
//   const imageTensor = tf.browser.fromPixels(imageElement);
//   const expandedDims = imageTensor.expandDims(0);

//   // Normalize the image data
//   const normalized = tf.div(expandedDims, 255.0);

//   // Make predictions
//   const predictions = await yoloModel.predict(normalized);

//   // Process predictions
//   const boxes = await predictions[0].array();
//   const scores = await predictions[1].array();
//   const classes = await predictions[2].array();

//   // Release the tensors
//   imageTensor.dispose();
//   expandedDims.dispose();
//   normalized.dispose();
//   predictions.forEach(tensor => tensor.dispose());

//   return { boxes, scores, classes };
// }

// async function LoadModel(){

//   const model = await loadGraphModel('https://example.com/fashion-mnist/model.json');

//   const imageUrl = 'https://example.com/image.jpg';
//   const imageElement = document.createElement('img');

//   imageElement.onload = async () => {
//     const tensor = tf.browser.fromPixels(imageElement).toFloat();
//     const normalizedTensor = tensor.div(255);
//     const inputTensor = normalizedTensor.reshape([1, 28, 28, 1]);

//     const predictions = await model.executeAsync(inputTensor);
//     const outputTensor = predictions[0];
//     const predictionScores = outputTensor.dataSync();

//     // Process the prediction scores as needed for your specific use case
//     // For example, identify the class with the highest score to determine the predicted clothing item.

//     tensor.dispose();
//     normalizedTensor.dispose();
//     inputTensor.dispose();
//     outputTensor.dispose();
//     predictions.forEach(prediction => prediction.dispose());
//   };

//   imageElement.src = imageUrl;

// }

// async function ObjectImageDetectionData(imgUrl) {
//   const response = await fetch(imgUrl);
//   const blob = await response.blob();

//   // Convert blob to a data URL
//   const reader = new FileReader();
//   reader.onload = () => {
//     const dataUrl = reader.result;

//     // Create an image element
//     const img = new Image();
//     img.onload = async () => {
//       // Load the model.
//       const model = await cocoSsd.load();

//       // Classify the image.
//       const predictions = await model.detect(img);

//       console.log("Predictions: ");
//       console.log(predictions);
//     };

//     // Set the data URL as the source of the image
//     img.src = dataUrl;
//   };
//   reader.readAsDataURL(blob);
// }

function logShopifyResponse(errorCode) {
  switch (errorCode) {
    case 200:
      console.log(
        "200 OK - The request was successfully processed by Shopify."
      );
      break;
    case 201:
      console.log(
        "201 Created - The request has been fulfilled and a new resource has been created."
      );
      break;
    case 202:
      console.log(
        "202 Accepted - The request has been accepted, but not yet processed."
      );
      break;
    case 204:
      console.log(
        "204 No Content - The request has been accepted, but no content will be returned."
      );
      break;
    case 205:
      console.log(
        "205 Reset Content - The request has been accepted, but no content will be returned. The client must reset the document from which the original request was sent."
      );
      break;
    case 303:
      console.log(
        "303 See Other - The response to the request can be found under a different URL in the Location header and can be retrieved using a GET method on that resource."
      );
      break;
    case 400:
      console.log(
        "400 Bad Request - The request wasn't understood by the server, generally due to bad syntax or because the Content-Type header wasn't correctly set to application/json."
      );
      break;
    case 401:
      console.log(
        "401 Unauthorized - The necessary authentication credentials are not present in the request or are incorrect."
      );
      break;
    case 402:
      console.log(
        "402 Payment Required - The requested shop is currently frozen. The shop owner needs to log in to the shop's admin and pay the outstanding balance to unfreeze the shop."
      );
      break;
    case 403:
      console.log(
        "403 Forbidden - The server is refusing to respond to the request. This status is generally returned if you haven't requested the appropriate scope for this action."
      );
      break;
    case 404:
      console.log(
        "404 Not Found - The requested resource was not found but could be available again in the future."
      );
      break;
    case 405:
      console.log(
        "405 Method Not Allowed - The server recognizes the request but rejects the specific HTTP method. This status is generally returned when a client-side error occurs."
      );
      break;
    case 406:
      console.log(
        "406 Not Acceptable - The requested resource is only capable of generating content not acceptable according to the Accept headers sent in the request."
      );
      break;
    case 409:
      console.log(
        "409 Resource Conflict - The requested resource couldn't be processed because of conflict in the request."
      );
      break;
    case 414:
      console.log(
        "414 URI Too Long - The server is refusing to accept the request because the Uniform Resource Identifier (URI) provided was too long."
      );
      break;
    case 415:
      console.log(
        "415 Unsupported Media Type - The server is refusing to accept the request because the payload format is in an unsupported format."
      );
      break;
    case 422:
      console.log(
        "422 Unprocessable Entity - The request body was well-formed but contains semantic errors."
      );
      break;
    case 423:
      console.log("423 Locked - The requested shop is currently locked.");
      break;
    case 429:
      console.log(
        "429 Too Many Requests - The request was not accepted because the application has exceeded the rate limit."
      );
      break;
    case 430:
      console.log(
        "430 Shopify Security Rejection - The request was not accepted because the request might be malicious."
      );
      break;
    case 500:
      console.log(
        "500 Internal Server Error - An internal error occurred in Shopify."
      );
      break;
    case 501:
      console.log(
        "501 Not Implemented - The requested endpoint is not available on that particular shop."
      );
      break;
    case 502:
      console.log(
        "502 Bad Gateway - The server received an invalid response from the upstream server."
      );
      break;
    case 503:
      console.log(
        "503 Service Unavailable - The server is currently unavailable."
      );
      break;
    case 504:
      console.log(
        "504 Gateway Timeout - The request couldn't complete in time."
      );
      break;
    case 530:
      console.log(
        "530 Origin DNS Error - Cloudflare can't resolve the requested DNS record."
      );
      break;
    case 540:
      console.log(
        "540 Temporarily Disabled - The requested endpoint isn't currently available."
      );
      break;
    case 783:
      console.log("783 Unexpected Token");
      break;
    default:
      console.log("Unknown error code.");
      break;
  }
}

// function useMap(initialEntries = []) {
//   const [mapStateForUseMap, setMapStateForUseMap] = useState(
//     new Map(initialEntries)
//   );

//   const mapActions = {
//     get: (key) => mapStateForUseMap.get(key),
//     set: (key, value) => {
//       if (mapStateForUseMap.get(key) !== value) {
//         const newMap = new Map(mapStateForUseMap);
//         newMap.set(key, value);
//         setMapStateForUseMap(newMap);
//       }
//     },
//     delete: (key) => {
//       if (mapStateForUseMap.has(key)) {
//         const newMap = new Map(mapStateForUseMap);
//         newMap.delete(key);
//         setMapStateForUseMap(newMap);
//       }
//     },
//     clear: () => {
//       if (mapStateForUseMap.size > 0) {
//         setMapStateForUseMap(new Map());
//       }
//     },
//     entries: () => mapStateForUseMap.entries(),
//     forEach: (callback) => mapStateForUseMap.forEach(callback),
//     has: (key) => mapStateForUseMap.has(key),
//     keys: () => mapStateForUseMap.keys(),
//     values: () => mapStateForUseMap.values(),
//     get size() {
//       return mapStateForUseMap.size;
//     },
//   };

//   return [mapStateForUseMap, mapActions];
// }

const DataProvidersContext = createContext(null);

export const useDataProvidersContext = () => {
  return useContext(DataProvidersContext);
};
export { DataProvidersContext };
function modifyState(setter, updateOptions) {
  return setter((prevState) => {
    return typeof updateOptions === "function"
      ? updateOptions(prevState)
      : updateOptions;
  });
}
function createEventEmitter() {
  const listeners = {};

  function on(eventType, callback) {
    if (!listeners[eventType]) {
      listeners[eventType] = [];
    }
    listeners[eventType].push(callback);
  }

  function emit(eventType, data) {
    const eventListeners = listeners[eventType];
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        callback(data);
      });
    }
  }
  function removeListener(eventType, callback) {
    const eventListeners = listeners[eventType];
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }
  }
  return { on, emit, removeListener };
}

export const DataProvidersProvider = ({ children }) => {
  const [eventEmitter, setEventEmitter] = useState(createEventEmitter());
  const [user, setUser] = useState({});
  const [subscriptions, setSubscriptions] = useState(["free"]);
  const [currentSession, setCurrentSession] = useState({});
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [subscriptionRetrievalLoading, setSubscriptionRetrievalLoading] =
    useState(false);
  const [contextualOptions, setContextualOptions] = useState({});
  const [selectedCollections, setSelectedCollections] = useState([]);

  const [selectedImageText, setSelectedImageText] = useState("0 Items");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageMap, setSelectedImageMap] = useState({});
  const [languageOptions, setLanguageOptions] = useState([]);
  const [assistRequestInstance, setAssistRequestInstance] = useState(null);
  const [imageSelectionModalIsOpen, setImageSelectionModalIsOpen] =
    useState(false);

  const [wordList, setWordList] = useState([
    "Reliable",
    "Innovative",
    "Stylish",
    "Durable",
    "Efficient",
    "High-quality",
    "Versatile",
    "User-friendly",
    "Affordable",
    "Sleek",
    "Cutting-edge",
    "Compact",
    "Eco-friendly",
    "Elegant",
    "Powerful",
    "Convenient",
    "Modern",
    "Safe",
    "Customizable",
    "Premium",
    "Lightweight",
    "Trendy",
    "Practical",
    "Functional",
    "Sophisticated",
    "Trustworthy",
    "Eco-conscious",
    "Luxurious",
    "Ergonomic",
    "Sleek",
  ]);
  const [pagingHistory, setPagingHistory] = useState(null);

  const [clearAssistResultMethod, setClearAssistResultMethod] = useState(
    new Map()
  );
  const [refDictionary, setRefDictionary] = useState(NavigationRefs);
  const [mappedLegend, setMappedLegend] = useState([[]]);
  const [legendReversed, setLegendReversed] = useState({});
  const [legend, setLegend] = useState({});
  const [contentSaved, setContentSaved] = useState(false);
  const [serverSentEventLoading, setServerSentEventLoading] = useState(false);
  const [lockAllTasks, setLockAllTasks] = useState(false);
  const [updateArticleMethod, setUpdateArticleMethod] = useState(null);
  const [markupText, setMarkupText] = useState("");

  const [plans, setPlans] = useState({});

  const [shopifyDown, setShopifyDown] = useState(false);

  const [retrySession, setRetrySession] = useState(false);

  const [dependenciesLoaded, setDependenciesLoaded] = useState({});
  const [AllDependenciesLoaded, setAllDependenciesLoaded] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [allAssets, setAllAssets] = useState({}); 
  const { workersLoaded} = useWorkersContext();


   const [presentToast] = useIonToast();
   const app = useAppBridge();
   const context = useShopifyContext();
   const navigate = useNavigate();
  const fetch = useAuthenticatedFetch(); // Make sure you have this hook defined somewhere

  function defineShopifyDown(retryValue) {
    return modifyState(setRetrySession, retryValue);
  }

    


  async function fetchDataWithCache({ url, method, body }) {
    if (sessionLoaded) {
      const cached_url_method_body_parameters =
        url + JSON.stringify(method) + JSON.stringify(body);

      if (mapState.has(cached_url_method_body_parameters)) {
        // console.log(
        //   "This is a cached fetchDataWithCache call: ",
        //   mapState.get(cached_url_method_body_parameters)
        // );
        return mapState.get(cached_url_method_body_parameters);
      }

      let retryCount = 3;
      let success = false;

      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (body) {
        try {
          options.body = JSON.stringify(body);
        } catch (error) {
          console.log("json stringify error", error);
        }
      }

      while (!success && retryCount > 0) {
        try {
          const response = await fetch(url, options);

          if (!response.ok) {
            console.error("response ok", logShopifyResponse(response.status));
          }

          if (response.ok) {
            const data = await response.json();
            success = true;

            if (response.status === 404) {
              return [];
            }
            mapActions.set(cached_url_method_body_parameters, data.data);
            return data.data;
          }
          retryCount--;
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } catch (error) {
          retryCount--;

          if (retryCount === 0) {
            presentToast({
              message: "There was a network error! Please try again later.",
              duration: 5000,
              position: "middle",
            });
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        }
      }
    } else {
      console.error("call made outside session: ", url);
    }
  }
  async function uncachedFetchData({ url, method = "GET", body }) {
    if (sessionLoaded) {
      if (!fetch) {
        throw new Error("authenticated fetch required");
      }

      const boxed = { data: null, error: null };
      try {
        const options = {
          method,
          headers: {
            "Content-Type": "application/json",
          },
        };

        if (body) {
          options.body = JSON.stringify(body);
        }

        const response_data = await fetch(url, options);

        if (!response_data.ok) {
          console.error("response ok", logShopifyResponse(response.status));
        }

        const data = await response_data.json();

        boxed.data = data?.data;
        if (response_data.error) {
          boxed.error = response_data.error;
        }
        if (data?.error) {
          boxed.error = data.error;
        }
      } catch (error) {
        console.error("fetch error:", error);
        presentToast({
          message: "There was a network error! Please try again later.",
          duration: 5000,
          position: "middle", // top, bottom, middle
          onDidDismiss: (e) => {
            //setDisableButtons(false);
          },
        });

        console.log("error", error);
        boxed.error = error || null;
      }
      return boxed;
    } else {
      console.error("call made outside session: ", url);
    }
  }
  useEffect(async () => {
    const token = await getSessionToken(app);
    console.log("token: ", token);

  
    let session = await app.getState();
    console.log("session: ", session);
    return () => {};
  }, []);

  useEffect(async () => {
    if (workersLoaded) {
      if (!indexDb.db) {
        const db = await indexDb.startIndexDB();
        if (!db) {
          throw new Error("db is not started:", db);
        }
        setDependenciesLoaded((prev) => ({
          ...prev,
          IndexedSessionStorage: Boolean(db),
        }));

        const assets = Object.entries(svgAssets);

        for (const [src, svg] of assets) {
          try {
            const blobUrl = await ImageCachePre(
              productViewCache,
              src,
              "image/svg+xml"
            );

            const assetName = src.slice().split("/").pop();

            //  setAllAssets((pre) => ({ ...pre, [assetName]: blobUrl }));
            allAssets[assetName] = blobUrl;
          } catch (error) {
            console.error("error preloading svg assets: ", error);
          }
        }

        setAssetsLoaded(true);
        const pageHistory = new LHistory("pagingHistory");
        pageHistory.getPagingState();
        setPagingHistory(pageHistory);
        setDependenciesLoaded((prev) => ({ ...prev, pagingHistory: true }));
      
      }
      return async () => {
        console.log("closing db connection");
        if (!indexDb) {
          throw new Error("no db specified: ", indexDb.db);
        }
        if (indexDb.db) {
          await indexDb.stopIndexDB();
     
          setDependenciesLoaded((prev) => ({
            ...prev,
            IndexedSessionStorage: false,
          }));
        }
      };
    }
  }, [workersLoaded]);

  async function getSVGAsset(src, memType) {
    return await ImageCacheSrc(productViewCache, src, memType);
  }

  useEffect(() => {
    console.log("hit number allDep: ", Object.entries(dependenciesLoaded));

    if (Object.values(dependenciesLoaded).length === 2) {
      setAllDependenciesLoaded(
        Object.values(dependenciesLoaded).every((val) => val === true)
      );
    }
  }, [dependenciesLoaded]);

  const setRouteSubscriptions = (activeSubscriptions, activeSession) => {
    setSubscriptions(activeSubscriptions);
    setCurrentSession(activeSession);
  };

  function assignSubscriptions(activeSubscriptions) {
    modifyState(setSubscriptions, activeSubscriptions);
  }

  function assignUser(user) {
    modifyState(setUser, user);
  }

  useEffect(async () => {
    if (!AllDependenciesLoaded) {
      return;
    }
    console.log("all dependencies loaded");
    const fetchDataSession = async () => {
      try {
        setSubscriptionRetrievalLoading(true);
        const subscriptionsResponse = await fetch(
          "/api/current/subscription/status"
        );

        if (!subscriptionsResponse.ok) {
          // If the response status is not ok (e.g., 401 Unauthorized or 403 Forbidden),
          // it means the user is not authenticated or doesn't have access.
          // Redirect the user to the login page or show an error message.
          // navigation("/login");
          setSubscriptionRetrievalLoading(false);

          throw new Error("unable to find your subscription");
        }
        if (!(await productViewCache.has("installed"))) {
          await productViewCache.set("installed", "true");
        }
        setShopifyDown(false);
        const data = await subscriptionsResponse.json();
        console.log("session loaded");
        setSessionLoaded(true);

        const { activeSubscriptions, session, user, redirectUri } = data;
        const redirect = Redirect.create(app);
        console.log("subscription redirectUri: ", redirectUri);

        setPlans(data.plans);

        assignUser(user);
        setRouteSubscriptions(activeSubscriptions, session);
  
        if(location.pathname !== "/"){
            navigate("/", {target:"host"});
        }
        if (user && user.seen === false) {
          navigate("/welcome");
        }

        if (!DEPLOYMENT_ENV) {
          console.log("redirectUri  ", redirectUri);
          if (redirectUri) {
            await productViewCache.remove("user");
            await productViewCache.remove("plans");
            // await productViewCache.clearAll();
          } else {
            console.log("user", user);
            console.log("plans", plans);
            await productViewCache.set("plans", data.plans);
            await productViewCache.set("user", user);

            await productViewCache.set(
              "activeSubscriptions",
              activeSubscriptions
            );
            await productViewCache.set("session", session);
          }
        }
        redirect.dispatch(Redirect.Action.REMOTE, { url: redirectUri });
      } catch (err) {
        // Handle network errors or other unexpected errors here.
        setShopifyDown(true);
        setPlans(err.plans);
        // const retryInterval = 4000; // 4 seconds
        // setTimeout(fetchDataSession, retryInterval);

        console.error("Error fetching data", err);
      }
      setSubscriptionRetrievalLoading(false);
    };
    // if (false && !DEPLOYMENT_ENV) {
    //   const activeSubscriptions = await productViewCache.get(
    //     "activeSubscriptions"
    //   );
    //   const session = await productViewCache.get("session");
    //   const plans = await productViewCache.get("plans");
    //   const user = await productViewCache.get("user");
    //   if (plans && user && activeSubscriptions && session) {
    //     try {
    //       setPlans(plans);
    //       assignUser(user);

    //       setRouteSubscriptions(activeSubscriptions, session);

    //       setSessionLoaded(true);
    //     } catch (error) {
    //       console.log("error", error);
    //       await fetchDataSession();
    //     }
    //   } else {
    //     await fetchDataSession();
    //   }
    // } else {
    try {

      if (await productViewCache.has("installed")) {
        await fetchDataSession();
      } else {
        setTimeout(async () => {
          await fetchDataSession();
        }, 3000);
      }
    } catch (error) {
      console.log("token Error: ", error);
    }
    // fetchDataSession();
  }, [AllDependenciesLoaded, retrySession]);

  const freeOptions = ["free", "chestnut", "sourwood", "acacia", "premiere"];

  function checkFeatureAccess(requiredSubscriptions) {
    if (
      !requiredSubscriptions ||
      !requiredSubscriptions[requiredSubscriptions.length - 1] ||
      !subscriptions
    ) {
      // console.log("subscriptions", subscriptions);
      throw Error("no subscriptions", JSON.stringify(requiredSubscriptions));
    }
    const lastRequiredSubscription = requiredSubscriptions.slice().pop();
    const lastRequiredSubscriptionIndex = freeOptions.indexOf(
      lastRequiredSubscription
    );

    if (lastRequiredSubscriptionIndex === -1) {
      throw new Error(
        "Invalid last required subscription: " + lastRequiredSubscription
      );
    }

    const additionalOptions = freeOptions.slice(
      lastRequiredSubscriptionIndex + 1
    );
    const combinedSubscriptions = [
      ...new Set([...requiredSubscriptions, ...additionalOptions]),
    ];

    const hasAccess = combinedSubscriptions.some((requiredSubscription) =>
      subscriptions.includes(requiredSubscription)
    );

    if (hasAccess) {
      return {
        hasAccess: true,
        message: (label) => label,
      };
    } else {
      const required = combinedSubscriptions.slice();

      if (required.length > 1) {
        required[required.length - 1] = "or " + required[required.length - 1];
      }
      const requiredLabel = required;

      if (!requiredLabel) return null;

      return {
        hasAccess: false,
        lockButton: (text) => (
          <IonList>
            <IonItem
              className="ion-padding-top ion-text-capitalize ion-text-wrap"
              button="true"
              slot="start"
              fill="clear"
              onClick={(e) => DataProviderNavigate("/subscriptions")}
              color="warning"
            >
              {requiredLabel && requiredLabel?.slice(0, 1)[0]}{" "}
              <IonLabel slot="start" className="ion-text-wrap ion-padding-top">
                Honey Members{" "}
              </IonLabel>{" "}
              <IonIcon size="large" slot="end" icon={beehive}></IonIcon>
            </IonItem>
          </IonList>
        ),
        message: (label) => (
          <IonText
            style={{ cursor: "pointer" }}
            onClick={(e) => DataProviderNavigate("/subscriptions")}
            color="warning"
            className="ion-text-capitalize ion-text-wrap"
          >
            With {requiredLabel && requiredLabel?.slice(0, 1)[0]} Honey
          </IonText>
        ),
        some: () => (
          <IonText
            style={{ cursor: "pointer" }}
            onClick={(e) => DataProviderNavigate("/subscriptions")}
            color="warning"
            className="ion-text-capitalize ion-text-wrap"
          >
            Some Features Require A {requiredLabel.slice().join(", ")}{" "}
            Subscription.
          </IonText>
        ),
      };
    }
  }

  const SubscriptionAndSession = {
    subscriptions,
    currentSession,
    checkFeatureAccess,
    setSubscriptions: assignSubscriptions,
    setUser: assignUser,
    freeOptions,
    plans,
    user,
    subscriptionRetrievalLoading,
  };

  const includeProductImagesFeature = checkFeatureAccess([
    "sourwood",
    "acacia",
  ]);
  const chestnut_sourwood_acacia = checkFeatureAccess([
    "chestnut",
    "sourwood",
    "acacia",
  ]);
  const FeatureAccess = {
    includeProductImagesFeature,
    chestnut_sourwood_acacia,
  };

  function assignContextualOptions(updateOptions) {
    modifyState(setContextualOptions, updateOptions);
  }

  const handleSelectChange = async (event, category) => {
    console.log("select_change", event, category);
    category = category.trim();
    setLanguageOptions((previous) => {
      const map = {};
      const categoryValues = [event.detail?.value?.slice()]
        .filter(Boolean)
        .flat(Infinity);
      previous.forEach(
        ([key, value]) =>
          value.length && key !== category && (map[key] = [key, value.slice()])
      );
      if (categoryValues.length && !categoryValues.includes("none")) {
        map[category] = [category, categoryValues];
      }

      const toneOptions = Object.values(map);
      console.log("Tone options", toneOptions);
      return toneOptions;
    });
  };

  const [productDetailOptions, setProductDetailOptions] = useState([]);

  const optionChange = (propName, data) => {
    console.log("data", data);
    propName = propName.trim().toLowerCase();
    setProductDetailOptions((previous) => {
      const map = {};
      const categoryValues = [data?.slice()].filter(Boolean).flat(Infinity);
      previous.forEach(
        ([key, value]) =>
          value.length && key !== propName && (map[key] = [key, value.slice()])
      );
      if (categoryValues.length && !categoryValues.includes("none")) {
        map[propName] = [propName, categoryValues];
      }
      const objectValues = Object.values(map);
      console.log("objectValue", objectValues);
      return objectValues;
    });
  };

  const handleIncludeChange = (event, category) => {};

  function addCollection(obj) {
    setSelectedCollections([...obj]);
  }

  function clearSelection() {
    setProductDetailOptions([]);
    setLanguageOptions([]);
  }
  const location = useLocation();

  useEffect(async () => {
    console.log("location", location);

    if (
      !["/product-details", "/description", "/article"].includes(
        location.pathname
      )
    ) {
      clearSelection();
    }

    return () => {};
  }, [location.pathname]);

  const formatData = (selected_images, all_product_images) => {
    if (selected_images.length === 1) {
      const image = all_product_images.find(
        (image) => image.transformedSrc === selected_images[0]
      );
      return image.transformedSrc;
    }
  };

  function assignImageSelectionModalIsOpen(bool_value) {
    modifyState(setImageSelectionModalIsOpen, bool_value);
  }

  // const permutations = generatePermutations(wordList);

  // Example usage:
  // console.log(permutations);

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function compressString(input, all_product_images) {
    const word = wordList[getRandomInt(0, wordList.length)].toLowerCase();
    return (
      word +
      "_" +
      all_product_images.findIndex((image) => image.transformedSrc === input)
    );
  }

  const imageSelectionChanged = async (selected_images, all_product_images) => {
    const sel_images = [];
    setSelectedImageMap((prev) => {
      const selImages = { ...prev };
      sel_images.length = 0;
      selected_images.forEach((image) => {
        const symbol_name =
          "image: " + compressString(image, all_product_images) + "_.jpg";

        sel_images.push(symbol_name);
        selImages[symbol_name] = {
          name: symbol_name,
          url: image,
        };
      });

      return selImages;
    });

    optionChange("images", sel_images);

    setSelectedImages(selected_images);
    setSelectedImageText(formatData(selected_images, all_product_images));
    assignImageSelectionModalIsOpen(false);
  };

  const router = useIonRouter();

  function navigateRoute(path) {
    console.log("router", router);
    router.push(path);
  }

  function assignAssistRequest(updateOption) {
    modifyState(setAssistRequestInstance, updateOption);
  }

  async function assistRequest(id) {
    if (assistRequest) {
      await assistRequestInstance(id);
    } else {
      console.error("assist request not assigned");
    }
  }

  function assignClearAssistMethod(key, updateOption) {
    modifyState(setClearAssistResultMethod, (prevState) => {
      const newMap = new Map(prevState);
      newMap.set(key, updateOption);
      return newMap;
    });
  }

  async function clearAssistResult(id) {
    clearAssistResultMethod.get("handleClearClick")(id);
    clearAssistResultMethod.get("clearSentences")();
  }

  function assignUpdateArticleMethod(updateOption) {
    modifyState(setUpdateArticleMethod, updateOption);
  }

  function assignMarkupText(text) {
    modifyState(setMarkupText, text);
  }

  // useEffect(() => {

  //   // Update the refDictionary state
  //   setRefDictionary(routeRefs);
  // }, []);

  async function DataProviderNavigate(
    route,
    options = { host: true, replace: true },
    pa = {
      initialViewAnimation: "fadeOutRight",
      endingViewAnimation: "fadeInRight",
    }
  ) {
    await AnimatedContent(
      refDictionary[location.pathname],
      pa.initialViewAnimation,
      {
        //timingFunction:"ease",
        onComplete: () => {
          navigate(route, options);
          AnimatedContent(refDictionary[route], pa.endingViewAnimation, {
            //  timingFunction
            duration: 0.09,
          });
        },
      }
    );
  }

  function assignServerSentEventLoading(updateOption) {
    modifyState(setServerSentEventLoading, updateOption);
  }

  useEffect(() => {
    const lockEvents = [serverSentEventLoading, contentSaved];
    if (lockEvents.some((event) => event === true)) {
      setLockAllTasks(true);
    }
    if (lockEvents.every((event) => event === false)) {
      setLockAllTasks(false);
    }
  }, [serverSentEventLoading, contentSaved]);

  function assignContentSaved(updateOptions) {
    modifyState(setContentSaved, updateOptions);
    setTimeout(() => {
      setContentSaved(false);
    }, 5000);
  }

  function assignLegend(rawLegend) {
    setMappedLegend(rawLegend);
    const formattedLegend = {};
    const formattedReversedLegend = {};
    rawLegend.forEach(([key, value]) => {
      formattedLegend[value] = key;
      formattedReversedLegend[key] = value;
    });
    setLegend(formattedLegend);
    setLegendReversed(formattedReversedLegend);
    console.log("formattedLegend:  ", formattedLegend);
  }

  useEffect(() => {
    return () => {
      const handleBeforeUnload = (event) => {
        // event.preventDefault();
        //  event.returnValue = "Are you sure you want to leave this page?";

        window.addEventListener("unload", clearLocalStorage);
      };

      const clearLocalStorage = async () => {
        if (location.pathname === "/description") {
          console.log("hit description refresh");
          navigate("/");
        }
        if (DEPLOYMENT_ENV) {
          // await productViewCache.clearAll();
        }
      };

      window.addEventListener("beforeunload", clearLocalStorage);

      // return () => {
      //   window.removeEventListener("beforeunload", handleBeforeUnload);
      // };
    };
  }, []);

  const value = {
    shopifyDown,
    defineShopifyDown,
    allAssets,
    getSVGAsset,
    assetsLoaded,
    AllDependenciesLoaded,
    modifyState,
    pagingHistory,
    productViewCache,
    pageIngCache,
    formatProducts,
    sessionLoaded,
    mappedLegend,
    legend,
    legendReversed,
    assignLegend,
    selectedImageMap,
    eventEmitter,
    contentSaved,
    setContentSaved: assignContentSaved,
    setServerSentEventLoading: assignServerSentEventLoading,
    lockAllTasks,
    serverSentEventLoading,
    languageOptions,
    productDetailOptions,
    imageSelectionModalIsOpen,
    assignImageSelectionModalIsOpen,
    setSelectedCollections,
    imageSelectionChanged,
    clearSelection,
    selectedImageText,
    selectedImages,
    handleSelectChange,
    addCollection,
    optionChange,
    handleIncludeChange,
    fetchData: fetchDataWithCache,
    async_fetchData: uncachedFetchData,
    fetchDataWithCache,
    uncachedFetchData,
    contextualOptions,
    setContextualOptions: assignContextualOptions,
    navigateRoute,
    assignAssistRequest,
    assistRequest,
    assignClearAssistMethod,
    clearAssistResult,
    assignUpdateArticleMethod,
    updateArticleMethod,
    markupText,
    setMarkupText: assignMarkupText,
    AnimatedContent,
    refDictionary,
    DataProviderNavigate,
  };

  Object.assign(value, SubscriptionAndSession);
  Object.assign(value, FeatureAccess);

  return (
    <DataProvidersContext.Provider value={value}>
      {children}
    </DataProvidersContext.Provider>
  );
};
