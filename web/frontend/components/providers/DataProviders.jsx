import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { loadGraphModel } from "@tensorflow/tfjs-converter";
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
  useIonViewDidEnter,
  useIonViewWillEnter,
  useIonViewDidLeave,
  useIonViewWillLeave,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from "@ionic/react";
import { useAuthenticatedFetch, useAppBridge } from "@shopify/app-bridge-react";
import { useLocation, useNavigate } from "react_router_dom";
import { request } from "@shopify/app-bridge/actions/AuthCode";
import { useShopifyContext } from "../providers/ShopifyContext";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import { Redirect } from "@shopify/app-bridge/actions";
import { SessionToken, TitleBar } from "@shopify/app-bridge/actions";
import { useIonToast, useIonRouter } from "@ionic/react";
import { AnimatedContent } from "./";
import { NavigationRefs } from "./";

// import {TRAINING_DATA} from 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/fashion-mnist.js';
// async function loadYOLOModel() {
//   const model = await loadGraphModel('path_to_yolo_model/model.json');
//   return model;
// }

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

const DataProvidersContext = createContext(null);

export function useDataProvidersContext() {
  return useContext(DataProvidersContext);
}

function modifyState(setter, updateOptions) {
  return setter((prevState) => {
    if (typeof updateOptions === "function") {
      return updateOptions(prevState);
    } else {
      return updateOptions;
    }
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
const eventEmitter = createEventEmitter();
export function DataProvidersProvider({ children }) {
  const fetch = useAuthenticatedFetch(); // Make sure you have this hook defined somewhere
  const navigate = useNavigate();
  const [plans, setPlans] = useState({});
  const app = useAppBridge();
  const context = useShopifyContext();

  useEffect(async () => {
    const token = await getSessionToken(app);

    let session = await app.getState();

    return () => {};
  }, []);

  const [user, setUser] = useState({});
  const [subscriptions, setSubscriptions] = useState(["free"]);
  const [currentSession, setCurrentSession] = useState({});
  const [subscriptionRetrievalLoading, setSubscriptionRetrievalLoading] =
    useState(false);

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
  useEffect(() => {
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
          return;
        }
        const data = await subscriptionsResponse.json();

        const { activeSubscriptions, session, user, redirectUri } = data;
        const redirect = Redirect.create(app);
        console.log("subscription redirectUri: ", redirectUri);

        setPlans(data.plans);
        console.log("user", user);
        assignUser(user);
        setRouteSubscriptions(activeSubscriptions, session);

        if (user && user.seen === false) {
          navigate("/welcome");
        }

        if (!DEPLOYMENT_ENV) {
          if (redirectUri) {
            localStorage.clear();
          } else {
            localStorage.setItem("plans", JSON.stringify(data.plans));
            localStorage.setItem("user", JSON.stringify(user));

            localStorage.setItem(
              "activeSubscriptions",
              JSON.stringify(activeSubscriptions)
            );
            localStorage.setItem("session", JSON.stringify(session));
          }
        }
        redirect.dispatch(Redirect.Action.REMOTE, { url: redirectUri });
      } catch (err) {
        // Handle network errors or other unexpected errors here.
        setPlans(err.plans);
        const retryInterval = 4000; // 4 seconds
        setTimeout(fetchDataSession, retryInterval);
        console.error("Error fetching data", err);
      }
      setSubscriptionRetrievalLoading(false);
    };
    if (!DEPLOYMENT_ENV) {
      const activeSubscriptions = localStorage.getItem("activeSubscriptions");
      const session = localStorage.getItem("session");
      const plans = localStorage.getItem("plans");
      const user = localStorage.getItem("user");
      if (plans && user && activeSubscriptions && session) {
        try {
          setPlans(JSON.parse(plans));
          assignUser(JSON.parse(user));
          setRouteSubscriptions(
            JSON.parse(activeSubscriptions),
            JSON.parse(session)
          );
        } catch (error) {
          console.log("error", error);
          fetchDataSession();
        }
      } else {
        fetchDataSession();
      }
    } else {
      fetchDataSession();
    }

    // fetchDataSession();
  }, []);

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
      const requiredLabel = required.join(", ");

      return {
        hasAccess: false,
        message: (label) => `${label}: ( with ${requiredLabel} subscription. )`,
        some: () => `Some Features Require A ${requiredLabel} Subscription.`,
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

  const [contextualOptions, setContextualOptions] = useState({});
  function assignContextualOptions(updateOptions) {
    modifyState(setContextualOptions, updateOptions);
  }

  const [presentToast] = useIonToast();

  function useMap(initialEntries = []) {
    const [mapState, setMapState] = useState(new Map(initialEntries));

    const mapActions = {
      get: (key) => mapState.get(key),
      set: (key, value) => {
        if (mapState.get(key) !== value) {
          const newMap = new Map(mapState);
          newMap.set(key, value);
          setMapState(newMap);
        }
      },
      delete: (key) => {
        if (mapState.has(key)) {
          const newMap = new Map(mapState);
          newMap.delete(key);
          setMapState(newMap);
        }
      },
      clear: () => {
        if (mapState.size > 0) {
          setMapState(new Map());
        }
      },
      entries: () => mapState.entries(),
      forEach: (callback) => mapState.forEach(callback),
      has: (key) => mapState.has(key),
      keys: () => mapState.keys(),
      values: () => mapState.values(),
      get size() {
        return mapState.size;
      },
    };

    return [mapState, mapActions];
  }

  const [mapState, mapActions] = useMap();

  async function fetchDataWithCache({ url, method, body }) {
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

        if (response.ok) {
          const data = await response.json();
          success = true;

          if (response.status === 404) {
            return [];
          }
          mapActions.set(cached_url_method_body_parameters, data.data);
          return data.data;
        } else {
          retryCount--;
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
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
  }

  const uncachedFetchData = async ({ url, method = "GET", body }) => {
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
      const data = await response_data.json();

      boxed.data = data?.data;
      if (response_data.error) {
        boxed.error = response_data.error;
      }
      if (data?.error) {
        boxed.error = data.error;
      }
    } catch (error) {
      if (error.code === 500) {
        presentToast({
          message: "There was a network error! Please try again later.",
          duration: 5000,
          position: "middle", // top, bottom, middle
          onDidDismiss: (e) => {
            //setDisableButtons(false);
          },
        });
      }
      presentToast({
        message: JSON.stringify(error),
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
  };

  const [selectedCollections, setSelectedCollections] = useState([]);

  const [selectedImageText, setSelectedImageText] = useState("0 Items");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageMap, setSelectedImageMap] = useState({});
  const [languageOptions, setLanguageOptions] = useState([]);
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

  const [imageSelectionModalIsOpen, setImageSelectionModalIsOpen] =
    useState(false);

  function assignImageSelectionModalIsOpen(bool_value) {
    modifyState(setImageSelectionModalIsOpen, bool_value);
  }

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
        const symbol_name = compressString(image, all_product_images) + "_jpg";

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

  const [assistRequestInstance, setAssistRequestInstance] = useState(null);

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

  const [clearAssistResultMethod, setClearAssistResultMethod] = useState(
    new Map()
  );

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

  const [updateArticleMethod, setUpdateArticleMethod] = useState(null);

  function assignUpdateArticleMethod(updateOption) {
    modifyState(setUpdateArticleMethod, updateOption);
  }

  const [markupText, setMarkupText] = useState("");
  function assignMarkupText(text) {
    modifyState(setMarkupText, text);
  }

  const [refDictionary, setRefDictionary] = useState(NavigationRefs);

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

  const [serverSentEventLoading, setServerSentEventLoading] = useState(false);

  function assignServerSentEventLoading(updateOption) {
    modifyState(setServerSentEventLoading, updateOption);
  }

  const [contentSaved, setContentSaved] = useState(false);

  function assignContentSaved(updateOptions) {
    modifyState(setContentSaved, updateOptions);
    setTimeout(() => {
      setContentSaved(false);
    }, 5000);
  }
  const [mappedLegend, setMappedLegend] = useState([[]]);
  const [legendReversed, setLegendReversed] = useState({});
  const [legend, setLegend] = useState({});

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

  const value = {
    mappedLegend,
    legend,
    legendReversed,
    assignLegend,
    selectedImageMap,
    eventEmitter,
    contentSaved,
    setContentSaved: assignContentSaved,
    setServerSentEventLoading: assignServerSentEventLoading,
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
      {subscriptionRetrievalLoading ? <Loading /> : children}
    </DataProvidersContext.Provider>
  );
}

function Loading() {
  return (
    <IonContent>
      <IonGrid style={{ height: "100vh" }}>
        <IonRow
          className="ion-justify-content-center ion-align-items-center"
          style={{ height: "100%" }}
        >
          <IonCol size="auto">
            <IonSpinner
              style={{ width: "100px", height: "100px" }}
              color="tertiary"
            ></IonSpinner>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
}
