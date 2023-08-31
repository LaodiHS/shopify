import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import { Context, SharedData } from "../../utilities/data-context.js";
import { updateObject } from "../../utilities/utility-methods";
import { audienceModel } from "../../utilities/language-model";
import { useAuthenticatedFetch, useAppBridge } from "@shopify/app-bridge-react";
import { useLocation, useNavigate } from "react_router_dom";
import { request } from "@shopify/app-bridge/actions/AuthCode";
import { useShopifyContext } from "../providers/ShopifyContext";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import { Redirect } from "@shopify/app-bridge/actions";
import { SessionToken, TitleBar } from "@shopify/app-bridge/actions";
import { useIonToast, useIonRouter } from "@ionic/react";
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

export function DataProvidersProvider({ children }) {
  const fetch = useAuthenticatedFetch(); // Make sure you have this hook defined somewhere
  const navigate = useNavigate();
  const [plans, setPlans] = useState({});
  const app = useAppBridge();
  const context = useShopifyContext();
  useEffect(async () => {
    console.log("context", context);
    const token = await getSessionToken(app);

    let session = await app.getState();
    //   console.log('app---->',app)
    // console.log('session---->', session)
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
          return;
        }

        const data = await subscriptionsResponse.json();
        const { activeSubscriptions, session, user, redirectUri } = data;
        const redirect = Redirect.create(app);
        console.log("subscription redirectUri: ", redirectUri);
        redirect.dispatch(Redirect.Action.REMOTE, { url: redirectUri });
        setPlans(data.plans);
        assignUser(user);
        setRouteSubscriptions(activeSubscriptions, session);

        if (user && user.seen === false) {
          navigate("/welcome");
        }
      } catch (err) {
        // Handle network errors or other unexpected errors here.
        setPlans(err.plans);
        const retryInterval = 4000; // 4 seconds
        setTimeout(fetchDataSession, retryInterval);
        console.error("Error fetching data", err);
      }
      setSubscriptionRetrievalLoading(false);
    };

    fetchDataSession();
  }, []);

  const freeOptions = ["free", "basic", "crafted", "advanced", "premiere"];

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
    "crafted",
    "advanced",
  ]);
  const basic_crafted_advanced = checkFeatureAccess([
    "basic",
    "crafted",
    "advanced",
  ]);
  const FeatureAccess = {
    includeProductImagesFeature,
    basic_crafted_advanced,
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
      console.log(
        "This is a cached fetchDataWithCache call: ",
        mapState.get(cached_url_method_body_parameters)
      );
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
  const [languageOptions, setLanguageOptions] = useState([]);
  const handleSelectChange = async (event, category) => {
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

      return Object.values(map);
    });
  };

  const [productDetailOptions, setProductDetailOptions] = useState([]);

  const optionChange = (propName, data) => {
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
      return Object.values(map);
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

  const imageSelectionChanged = (selected_images, all_product_images) => {
    optionChange("images", selected_images);
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
  // useIonViewWillEnter(() => {

  //   // Your animation code here

  //   console.log("Component is----- about to enter the view.");
  // });

  const value = {
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
  };

  Object.assign(value, SubscriptionAndSession);
  Object.assign(value, FeatureAccess);

  return (
    <DataProvidersContext.Provider value={value}>
      {children}
    </DataProvidersContext.Provider>
  );
}
