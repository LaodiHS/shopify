import { Page, Layout, Image, Text } from "@shopify/polaris";
import {
  useEffect,
  useState,
  Link,
  createContext,
  useContext,
  useRef,
} from "react";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./themes/variables.css";
import "typeface-lato";
import "typeface-roboto";
import "./components/ListDetail/styles/GridStack.css";
import "./components/ListDetail/styles/App.css";

import "animate.css";

import {
  newspaperOutline,
  documentTextOutline,
  chatbubbleOutline,
  homeOutline,
  lockClosed,
  arrowForwardOutline,
  arrowDownOutline,
  chevronBack,
} from "ionicons/icons";

import { IonReactRouter } from "@ionic/react-router";

import {
  setupIonicReact,
  IonApp,
  IonContent,
  IonRouterOutlet,
  IonPage,
  useIonRouter,
  IonNavLink,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonButton,
  IonLabel,
  IonHeader,
  IonGrid,
  IonRow,
  IonButtons,
  IonCol,
  IonSpinner,
  IonToolbar,
  IonTitle,
  IonText,
  useIonViewDidEnter,
  withIonLifeCycle,
  IonNav,
} from "@ionic/react";
setupIonicReact({ mode: "ios" });

import {
  ListComponent,
  ListDetailComponent,
  ProductsCard,
  SubscriptionComponent,
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
  ProductDataProvider,
  NavigationDataProvider,
  useNavigationDataContext,
  DataProvidersProvider,
  useDataProvidersContext,
  Search,
  Accordion,
  AnimatedContent,
} from "./components";
import { useAuthenticatedFetch } from "./hooks";
import { NavigationMenu } from "@shopify/app-bridge-react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
} from "react_router_dom";

import { Context } from "./utilities/data-context";
// import { useUniqueKeys, UniqueKeysProvider } from "./utilities/utility-methods";

export default function App() {
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  useEffect(() => {
    return () => {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave this page?";
        window.addEventListener("unload", clearLocalStorage);
      };

      const clearLocalStorage = () => {
        // localStorage.clear();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    };
  }, []);

  return (
    <IonApp>
      <PolarisProvider>
        <BrowserRouter>
          <AppBridgeProvider>
            <QueryProvider>
              <NavigationMenu
                navigationLinks={[
                  {
                    label: "Products Page",
                    destination: "/",
                  },

                  {
                    label: "Subscription",
                    destination: "/subscriptions",
                  },
                  {
                    label: "welcome",
                    destination: "/welcome",
                  },
                  {
                    label: "search",
                    destination: "/search",
                  },
                ]}
              />
              {/* <Routes pages={pages} /> */}
              {/* <IonReactRouter>  */}
              <NavigationDataProvider>
                <ProductDataProvider>
                  <DataProvidersProvider>
                    <IonMenuNav />
                  </DataProvidersProvider>
                </ProductDataProvider>
              </NavigationDataProvider>
              {/* </IonReactRouter> */}
            </QueryProvider>
          </AppBridgeProvider>
        </BrowserRouter>
      </PolarisProvider>
    </IonApp>
  );
}

function loading() {
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

function LandingPage() {
  const arrowRef = useRef(null);
  const [arrowAnimation, setArrowAnimation] = useState("animate__bounceIn");
  const {
    subscriptions,
    subscriptionRetrievalLoading,
    setUser,
    uncachedFetchData,
  } = useDataProvidersContext();
  useIonViewDidEnter(() => {
    arrowRef.current?.addEventListener("animationend", () => {
      setArrowAnimation("animate__tada"); // Apply another animation after the bounce
    });
  });

  const handleGetStarted = async () => {
    // Handle navigation to the next page

    // Start animation when "Get Started" button is clicked
    setArrowAnimation("animate__flip");
    const textElement = document.querySelector(".vibrating-text");
    const particleElement = document.querySelector(".particle");

    // Wait for a short duration before removing the text and particles

    const { data, error } = await uncachedFetchData({
      url: "/api/welcome/subscriber",
      method: "POST",
    });

    if (error === null) {
      setUser(data);
    } else {
      navigate("/", { target: "host", relative: "path", state: "/welcome" });
    }

    setTimeout(async () => {
      navigate("/");
    }, 2000); // Set the duration as needed
  };

  console.log("subscriptions", subscriptions);
  const navigate = useNavigate();

  if (subscriptionRetrievalLoading) {
    return loading();
  } else {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Welcome to VibeFenWei</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText class="">
            <h1 className="ion-text-center">VibeFenWei</h1>

            <p className="ion-text-center">
              Experience a seamless journey with our amazing features.
            </p>
            <IonText color="dark">
              <p className="ion-text-center">Thank You For Becoming a</p>
              <h2 className="ion-text-center ion-text-capitalize">
                {subscriptions.join(" ")}
              </h2>
              <p className="ion-text-center">Subscriber</p>
            </IonText>
          </IonText>
          <div className="ion-text-center">
            <IonIcon
              ref={arrowRef}
              icon={
                arrowAnimation === "animate__flip"
                  ? arrowDownOutline
                  : arrowForwardOutline
              }
              size="large"
              color="primary"
              className={`animate__animated ${arrowAnimation}`}
            />
          </div>
          <div className="ion-text-center animate__animated animate__fadeInUp">
            <IonButton
              fill="clear"
              expand="block"
              color="primary"
              onClick={handleGetStarted}
            >
              Get Started
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }
}

function Home() {
  const { subscriptionRetrievalLoading } = useDataProvidersContext();

  if (subscriptionRetrievalLoading) {
    return loading();
  }

  return <ProductsCard />;
}

function ProductDetails() {
  const { subscriptionRetrievalLoading } = useDataProvidersContext();

  if (subscriptionRetrievalLoading) {
    return loading();
  }
  const animationConfig = {
    direction: "in",
    duration: 500,
    startX: 300, // Start off-screen to the left
    endX: 0, // Slide in to on-screen position
  };

  return (
    <div>
      {/* <AnimatedContent animationConfig={animationConfig } > */}

      <ListDetailComponent />

      {/* </AnimatedContent> */}

      {/* <ListDetailComponent /> */}
    </div>
  );
}

function Subscriptions() {
  const { subscriptionRetrievalLoading } = useDataProvidersContext();

  if (subscriptionRetrievalLoading) {
    return loading();
  }
  return <SubscriptionComponent />;
}

// Other page components...

function NoMatch() {
  return <IonPage>404 Not Found</IonPage>;
}

function IonMenuNav() {
  const { checkFeatureAccess, freeOptions, navigateRoute } =
    useDataProvidersContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { aiWorkStationSetter } = useNavigationDataContext();
  const { assistRequest } = useDataProvidersContext();
  const [currentRoute, setCurrentRoute] = useState("/");
  const router = useIonRouter();
  location;

  const handleNavigation = (path, animationConfig) => {
    navigate(path);

    // Pass the animation configuration to the AnimatedContent
    // The animation will be triggered automatically based on the configuration
    setContentAnimation(animationConfig);
  };

  useEffect(() => {
    // console.log("pathname", location.pathname);
    setCurrentRoute(location.pathname);
  }, [location.pathname]);

  const tabs = {
    "/subscriptions": [
      {
        access: checkFeatureAccess(["free"]),

        label: "Home",
        icon: homeOutline,
        clickHandler: (event, hasAccess, router) => {
          navigate("/", { target: "host" });
          //  router.push("/")
          // router.tab = "/home"
          // console.log('router', router)
        },
      },
    ],
    "/": [],

    "/description": [

      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Description Selection",
        src: "../assets/description-select.svg",
        icon: homeOutline,
        clickHandler: (event) => {
          navigate("/product-details", { target: "host" });
        },
      },
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Description Assist",
        icon: homeOutline,
        src: "../assets/ai-icon.svg",
        clickHandler: (event) => {
          console.log("event", event);
          assistRequest("description");
          // navigate("/product-details", { target: "host" });
        },
      },
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Clear Description",
        src: "../assets/clear2.svg",
        icon: homeOutline,
        clickHandler: (event) => {
          navigate("/product-details", { target: "host" });
        },
      },
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Save Description",
        src: "../assets/save.svg",
        icon: homeOutline,
        clickHandler: (event) => {
          navigate("/product-details", { target: "host" });
        },
      },
    ],
    "/article": [
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "product details",
        icon: homeOutline,
        clickHandler: (event) => {
          navigate("/product-details", { target: "host" });
        },
      },
    ],
    "/product-details": [
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Home",
        icon: homeOutline,
        clickHandler: (event) => {
          navigate("/", { target: "host" });
        },
      },
      {
        access: checkFeatureAccess(["basic"]),

        label: "Description",
        icon: newspaperOutline,
        clickHandler: (event, hasAccess) => {
          if (!hasAccess) {
            navigate("/subscriptions");
          } else {
            aiWorkStationSetter("description");

            // router.push("/description")
            navigate("/description");
          }
        },
      },
      {
        access: checkFeatureAccess(["crafted"]),

        label: "Article",
        icon: documentTextOutline,
        clickHandler: (event, hasAccess) => {
          if (!hasAccess) {
            navigate("/subscriptions");
          } else {
            aiWorkStationSetter("article");
            navigate("/article");
          }
        },
      },
      // {
      //   label: "Post",
      //   icon: chatbubbleOutline,
      //   clickHandler: (event) => {
      //     aiWorkStationSetter("post");
      //   },
      // },
    ],
  };

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/product-details" element={<ProductDetails />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/search" element={<Search />} />
            <Route path="/welcome" element={<LandingPage />} />
            <Route
              path="/description"
              element={
                <IonPage>
                  {" "}
                  <IonHeader key={"10"} translucent={true}>
                    <IonToolbar key={"11"}>
                      <IonButtons key={"12"} onClick={() => {}} slot="start">
                        <IonButton key={"13"}>
                          <IonIcon key={"14"} icon={chevronBack} />
                        </IonButton>
                      </IonButtons>
                      <IonTitle key={"15"}>Description</IonTitle>
                      <IonButtons slot="end"></IonButtons>
                    </IonToolbar>
                  </IonHeader>
                  <IonContent>
                    <Accordion />
                  </IonContent>
                </IonPage>
              }
            />
            <Route
              path="/article"
              element={
                <IonPage>
                  {" "}
                  <IonHeader key={"10"} translucent={true}>
                    <IonToolbar key={"11"}>
                      <IonButtons key={"12"} onClick={() => {}} slot="start">
                        <IonButton key={"13"}>
                          <IonIcon key={"14"} icon={chevronBack} />
                        </IonButton>
                      </IonButtons>
                      <IonTitle key={"15"}>Article</IonTitle>
                      <IonButtons slot="end"></IonButtons>
                    </IonToolbar>
                  </IonHeader>
                  <IonContent>
                    <Accordion />
                  </IonContent>
                </IonPage>
              }
            />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          {tabs[currentRoute]?.map((tab, index) => (
            <IonTabButton
              // disabled= {tab.disabled}
              key={index}
              tab={currentRoute}
              onClick={(e) => tab.clickHandler(e, tab.access.hasAccess, router)}
            >
              <IonIcon
                src={tab.src && tab.src}
                icon={!tab.src && tab.access.hasAccess ? tab.icon : lockClosed}
              />
              <IonLabel color={tab.access.hasAccess ? "secondary" : "danger"}>
                {tab.access.message(tab.label)}
              </IonLabel>
            </IonTabButton>
          ))}
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}
