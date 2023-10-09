import "typeface-baloo";
import "typeface-roboto";
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
import "./components/ListDetail/styles/Chartist.css";
import "./components/ListDetail/styles/App.css";
import "animate.css";
import "./themes/variables.css";
import { productViewCache } from "./utilities/store";
// import "./components/ListDetail/styles/GridStack.css";
import { Page, Layout, Image, Text } from "@shopify/polaris";
import {
  useEffect,
  useState,
  Link,
  createContext,
  useContext,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  newspaperOutline,
  documentTextOutline,
  chatbubbleOutline,
  homeOutline,
  lockClosed,
  arrowForwardOutline,
  arrowDownOutline,
  chevronBack,
  informationCircleOutline,
} from "ionicons/icons";
import {
  descriptionWorkStation,
  clear,
  bookshelf,
  save,
  aiIcon,
  pencilCase,
  newsPaperWorStation,
  halfMoon,
  readingTree,
  honeyCombGridDrop,
  beehive,
  honeyPot,
} from "./assets";
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
  useIonPopover,
  IonPopover,
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
  tinymceCustomPlugins,
  ImageCacheWorker,
  TokenUsageComponent,
  IonicHeaderComponent,
  useWinkDataContext,
  WinkDataProvider,
  TinyMCEDataProvider,
  useProductDataContext,
  LoadingPageComponent,
  AnimatedContent,
} from "./components";
import { indexDb } from "./utilities/IndexDB";
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

tinymceCustomPlugins(tinymce);

export default function App() {
  // productViewCache.clear();
  const [dependenciesLoaded, setDependenciesLoaded] = useState({});


  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const navigationPanel = !DEPLOYMENT_ENV
    ? [
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
      ]
    : [];
  useEffect(() => {
    return () => {
      const handleBeforeUnload = (event) => {
        // event.preventDefault();
        //  event.returnValue = "Are you sure you want to leave this page?";

        window.addEventListener("unload", clearLocalStorage);
      };

      const clearLocalStorage = () => {
        if (DEPLOYMENT_ENV) {
          productViewCache.clear();
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    };
  }, []);

  
   return  (<IonApp force-theme="light">
      <PolarisProvider>
        <BrowserRouter>
          <AppBridgeProvider>
            <QueryProvider>
              <NavigationDataProvider>
                <NavigationMenu navigationLinks={navigationPanel} />
                <TinyMCEDataProvider>
                  <WinkDataProvider>
                    <DataProvidersProvider>
                      <ProductDataProvider>
                        <ImageCacheWorker />
                        <IonMenuNav />
                      </ProductDataProvider>
                    </DataProvidersProvider>
                  </WinkDataProvider>
                </TinyMCEDataProvider>
              </NavigationDataProvider> 
            </QueryProvider>
          </AppBridgeProvider>
        </BrowserRouter>
      </PolarisProvider>
    </IonApp>) 
}

function LandingPage({ animationRef }) {
  const arrowRef = useRef(null);
  const [arrowAnimation, setArrowAnimation] = useState("animate__bounceIn");
  const {
    subscriptions,
    subscriptionRetrievalLoading,
    setUser,
    uncachedFetchData,
    DataProviderNavigate,
  } = useDataProvidersContext();

  useIonViewDidEnter(() => {
    arrowRef.current?.addEventListener("animationend", () => {
      setArrowAnimation("animate__tada"); // Apply another animation after the bounce
    });
  });

  useEffect(() => {
    return () => (arrowRef.current = null);
  }, []);
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
      await DataProviderNavigate("/", {
        target: "host",
        relative: "path",
        state: "/welcome",
      });
    }

    setTimeout(async () => {
      DataProviderNavigate("/", { target: "host" });
    }, 2000); // Set the duration as needed
  };

  return (
    <IonPage
      ref={(el) => {
        animationRef.current = el; // Attach the IonPage element to animationRef
        // Forward the ref to the parent component
      }}
    >
      <IonicHeaderComponent />
      {/* <IonHeader translucent={true}>
        <IonToolbar
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.7)), url(${honeyCombGridDrop})`,

            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            minHeight: "50px",
          }}
        >
          <IonTitle> Neural Nectar</IonTitle>
        </IonToolbar>
      </IonHeader> */}

      <IonContent className="ion-padding">
        {/* <div class="container">
          <div class="photo">
            {/* <img src="https://www.svgrepo.com/show/300968/monitor-graph.svg" /> 
          </div>
          <div class="info"></div>
          <div class="tag"></div>
          <div class="comment"></div>
          <div class="album"></div>
          <div class="rotate"></div>
        </div> */}

        <IonText class="ion-padding-top">
          <IonGrid>
            <IonRow>
              <IonCol
                style={{
                  backgroundImage: `url(${honeyCombGridDrop})`,
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  height: "100px",
                }}
                className="ion-text-center"
                size="12"
              >
                <IonRow>
                  <IonCol>
                    <h1
                      style={{
                        color: "#ef8561",
                        letterSpacing: "9px",
                        fontFamily: "'Baloo', sans-serif",
                        wordSpacing: "40px",
                        fontSize: "5vw",
                        float: "right",
                        paddingRight: "51px",
                        whiteSpace: "nowrap" /* Prevents wrapping */,
                        // overflow: "hidden", /* Clips content that overflows */
                        // textOverflow: "ellipsis"
                      }}
                    >
                      neural
                    </h1>
                  </IonCol>
                  <IonCol>
                    <h1
                      style={{
                        color: "#ef8561",
                        letterSpacing: "9px",

                        float: "left",
                        fontFamily: "'Baloo', sans-serif",
                        wordSpacing: "40px",
                        fontSize: "5vw",
                        paddingLeft: "53px",
                        whiteSpace: "nowrap" /* Prevents wrapping */,
                        // overflow: "hidden", /* Clips content that overflows */
                        // textOverflow: "ellipsis"
                      }}
                    >
                      nectar
                    </h1>
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>
          </IonGrid>
          <div
            style={{
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              height: "300px",

              backgroundImage: `url(${readingTree})`,
            }}
          ></div>
          <p className="ion-text-center">
            Experience a seamless journey with our amazing features.
          </p>
          <IonText color="dark">
            <h3
              style={{ fontFamily: "Baloo, san serif" }}
              className="ion-text-center ion-padding-top"
            >
              Thank You For Becoming a
            </h3>
            <h2
              style={{ fontFamily: "Baloo, sans-serif" }}
              className="ion-text-center ion-text-capitalize"
            >
              <IonText
                style={{ fontFamily: "Baloo, sans-serif" }}
                color="neural"
              >
                {subscriptions.join(" ")} Honey
              </IonText>
            </h2>
            <p
              style={{ fontFamily: "Baloo, sans-serif" }}
              className="ion-text-center"
            >
              Member
            </p>
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
            style={{ letterSpacing: "3px", fontFamily: "Baloo, sans-serif" }}
            fill="clear"
            expand="block"
            color="shoe"
            onClick={handleGetStarted}
          >
            Get Started
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

function Home({ animationRef }) {
  const [releaseLoadingState, setReleaseLoadingState] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fetchedData, setFetchedData] = useState(false);

  const {
    productsData: data,
    defineProductData: defineData,
    fetchData,
    sessionLoaded,
    pagingHistory,
  } = useProductDataContext();

  useEffect(() => {
    if (data.productsData, pagingHistory) {
      setReleaseLoadingState(true);
    }
  }, []);

  useEffect(async () => {
    if (sessionLoaded && pagingHistory) {
      await fetchData();
      setFetchedData(true);

      return () => {
        setFetchedData(false);
      };
    }
  }, [sessionLoaded, pagingHistory]);

  useEffect(() => {
    let id;
    if (sessionLoaded) {
      id = setTimeout(() => {
        setReleaseLoadingState(true);
      }, 10000);
    }
    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [sessionLoaded]);

  //  return  <LoadingPageComponent  type="indeterminate" progress={progress} />

  return !releaseLoadingState ? (
    <LoadingPageComponent type="indeterminate" progress={progress} />
  ) : (
    <ProductsCard animationRef={animationRef} />
  );
}
function ProductDetails({ animationRef }) {
  return <ListDetailComponent animationRef={animationRef} />;
}

function Subscriptions({ animationRef }) {
  const { subscriptionRetrievalLoading } = useDataProvidersContext();

  return <SubscriptionComponent animationRef={animationRef} />;
}

// Other page components...

function NoMatch() {
  return <IonPage>404 Not Found</IonPage>;
}

function Description() {
  const {
    // assistRequest,
    // clearAssistResult,
    // updateArticleMethod,
    // markupText,
    // AnimatedContent,
    refDictionary,
    DataProviderNavigate,
    serverSentEventLoading,
    contentSaved,
    user,
  } = useDataProvidersContext();

  return (
    <IonPage ref={refDictionary["/description"]}>
      <IonicHeaderComponent
        centerText={"Description Workstation"}
        left={
          <IonButtons key={"12"} slot="start">
            <IonButton
              color="neural"
              disabled={serverSentEventLoading}
              onClick={async () => {
                await DataProviderNavigate("/product-details");
              }}
              key={"13"}
            >
              <IonIcon slot="icon-only" key={"14"} icon={chevronBack} />
            </IonButton>
          </IonButtons>
        }
        right={
          <>
            {contentSaved && (
              <IonButton
                fill="clear"
                color={contentSaved && "success"}
                size="small"
                slot="end"
              >
                saved
              </IonButton>
            )}
            <IonButton
              size="small"
              disabled={true}
              fill="clear"
              color="neural"
              slot="end"
            >
              <IonIcon
                slot="icon-only"
                size="large"
                icon={descriptionWorkStation}
              />
            </IonButton>
            <IonButtons slot="end"></IonButtons>
          </>
        }
      />

      <IonContent>
        <TokenUsageComponent tokenUsage={user} />
        <Accordion />
      </IonContent>
    </IonPage>
  );
}

function Article() {
  const {
    // assistRequest,
    // clearAssistResult,
    // updateArticleMethod,
    // markupText,
    // AnimatedContent,
    refDictionary,
    DataProviderNavigate,
    serverSentEventLoading,
    contentSaved,
  } = useDataProvidersContext();

  return (
    <IonPage key="IonPage/article" ref={refDictionary["/article"]}>
      <IonicHeaderComponent
        left={
          <IonButtons key={"12"} onClick={() => {}} slot="start">
            <IonButton
              color="neural"
              key="Ionbuttons/article"
              disabled={serverSentEventLoading}
              onClick={() => {
                DataProviderNavigate("/product-details");
              }}
            >
              <IonIcon key={"14"} icon={chevronBack} />
            </IonButton>
          </IonButtons>
        }
        centerText={"Article Workstation"}
        right={
          <>
            {contentSaved && (
              <IonButton
                fill="clear"
                color={contentSaved && "success"}
                size="small"
                slot="end"
              >
                saved
              </IonButton>
            )}
            <IonButton
              key="ionbutton/icon/asset"
              size="small"
              disabled={true}
              fill="clear"
              color="neural"
              slot="end"
            >
              <IonIcon
                key="ion/icon/asset/svg"
                slot="icon-only"
                size="large"
                icon={newsPaperWorStation}
              />
            </IonButton>
          </>
        }
      />
      <IonContent>
        <Accordion />
      </IonContent>
    </IonPage>
  );
}

function IonMenuNav() {
  const [currentRoute, setCurrentRoute] = useState("/");
  const location = useLocation();
  const router = useIonRouter();

  const {
    checkFeatureAccess,
    assistRequest,
    clearAssistResult,
    updateArticleMethod,
    markupText,
    // AnimatedContent,
    refDictionary,
    DataProviderNavigate,
    serverSentEventLoading,
    contentSaved,
    sessionLoaded,
  } = useDataProvidersContext();
  const { aiWorkStationSetter, aiWorkStation } = useNavigationDataContext();

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
        clickHandler: async (event, hasAccess, router) => {
          await DataProviderNavigate("/", { target: "host" });
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

        icon: pencilCase,
        clickHandler: async (event) => {
          // AnimatedContent(refDictionary["/description"], "fadeOutRight", {
          //   onComplete: () => {
          //     navigate("/product-details", { target: "host" });
          //     AnimatedContent(refDictionary["/product-details"], "fadeInRight");
          //   },
          // });

          await DataProviderNavigate("/product-details");
        },
      },
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Description Assist",
        icon: aiIcon,

        clickHandler: (event) => {
          console.log("aiWorkStation", aiWorkStation);

          assistRequest(aiWorkStation);
          // DataProviderNavigate("/product-details", { target: "host" });
        },
      },
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Clear Description",

        icon: clear,
        clickHandler: (event) => {
          clearAssistResult(aiWorkStation);
          // DataProviderNavigate("/product-details", { target: "host" });
        },
      },
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Save Description",

        saveSignal: true,
        icon: save,
        clickHandler: (event) => {
          updateArticleMethod(aiWorkStation, markupText);
        },
      },
    ],
    "/article": [
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Description Selection",

        icon: pencilCase,
        clickHandler: (event) => {
          DataProviderNavigate("/product-details", { target: "host" });
        },
      },
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Description Assist",
        icon: aiIcon,

        clickHandler: (event) => {
          console.log("aiWorkStation", aiWorkStation);
          assistRequest(aiWorkStation);
          // DataProviderNavigate("/product-details", { target: "host" });
        },
      },
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Clear Description",

        icon: clear,
        clickHandler: (event) => {
          clearAssistResult(aiWorkStation);
          // DataProviderNavigate("/product-details", { target: "host" });
        },
      },
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Save Description",

        saveSignal: true,
        icon: save,
        clickHandler: (event) => {
          console.log("aiWorkStation", aiWorkStation);
          updateArticleMethod(aiWorkStation, markupText);
          // DataProviderNavigate("/product-details", { target: "host" });
        },
      },
    ],
    "/product-details": [
      {
        access: checkFeatureAccess(["free"]),
        disabled: false,
        label: "Products Pages",

        icon: bookshelf,
        clickHandler: async (event) => {
          await DataProviderNavigate("/", { target: "host" });
        },
      },
      {
        access: checkFeatureAccess(["chestnut"]),

        label: "Description Workstation",
        icon: descriptionWorkStation,

        clickHandler: async (event, hasAccess) => {
          if (!hasAccess) {
            await DataProviderNavigate("/subscriptions");
          } else {
            aiWorkStationSetter("description");

            // router.push("/description")
            await DataProviderNavigate("/description");
          }
        },
      },
      {
        access: checkFeatureAccess(["sourwood"]),
        label: "Article Workstation",

        icon: newsPaperWorStation,
        clickHandler: async (event, hasAccess) => {
          if (!hasAccess) {
            await DataProviderNavigate("/subscriptions");
          } else {
            aiWorkStationSetter("article");
            await DataProviderNavigate("/article");
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
    <IonReactRouter key="ionreactrouter">
      <IonTabs key="IonTabs">
        <IonRouterOutlet key="IonRouterOutlet">
          <Routes key="Routes">
            <Route
              key="/"
              index
              path="/"
              element={<Home animationRef={refDictionary["/"]} />}
            />
            <Route
              key="/product-details"
              path="/product-details"
              element={
                <ProductDetails
                  animationRef={refDictionary["/product-details"]}
                />
              }
            />
            <Route
              key="/subscriptions"
              path="/subscriptions"
              element={
                <Subscriptions animationRef={refDictionary["/subscriptions"]} />
              }
            />
            <Route
              key="/search"
              path="/search"
              element={<Search animationRef={refDictionary["/search"]} />}
            />
            <Route
              key={"/welcome"}
              path="/welcome"
              element={
                <LandingPage
                  key="landingPage"
                  animationRef={refDictionary["/welcome"]}
                />
              }
            />
            <Route
              key="/description"
              path="/description"
              element={<Description />}
            />
            <Route key="/article" path="/article" element={<Article />} />
            <Route key="noMatch" path="*" element={<NoMatch />} />
          </Routes>
        </IonRouterOutlet>
        <IonTabBar
          translucent={true}
          style={{ "--background": "none" }}
          key="iontabbar"
          slot="bottom"
        >
          {tabs[currentRoute]?.map((tab, index) => {
            const buttonId = "tabButtonId" + index;

            return (
              <IonTabButton
                size="large"
                id={buttonId}
                disabled={serverSentEventLoading || tab.disabled}
                key={index}
                tab={currentRoute}
                onClick={(e) =>
                  tab.clickHandler(e, tab.access.hasAccess, router)
                }
              >
                <IonIcon
                  color={contentSaved && tab.saveSignal ? "success" : "neural"}
                  key={"icon" + index}
                  src={tab.access.hasAccess && tab.src}
                  icon={!tab.src && tab.access.hasAccess ? tab.icon : beehive}
                  className="custom-icon"
                />
                <IonLabel
                  key={index}
                  color={tab.access.hasAccess ? "primary" : "danger"}
                >
                  {serverSentEventLoading}
                  {tab.access.message(tab.label)}
                </IonLabel>
              </IonTabButton>
            );
          })}
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}

function IonPopovers() {
  return (
    <IonPopover
      key="Include existing description in composition"
      translucent={true}
      animated="true"
      trigger="acacia-options-select-options-hover-trigger"
      triggerAction="hover"
      area-label="Advanced Language and Formatting Options"
    >
      <IonContent className="ion-padding">
        <IonText>
          <p>
            Explore Advanced Language and Formatting Choices. Choose your
            preferred categories from the acacia menu options, and they will be
            displayed below.
          </p>
        </IonText>
        <IonText color="secondary">
          {" "}
          <sub>
            {" "}
            <IonIcon icon={exitOutline}></IonIcon> click outside box to close
          </sub>
        </IonText>
      </IonContent>
    </IonPopover>
  );
}
