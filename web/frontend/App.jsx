import { Page, Layout, Image, Text } from "@shopify/polaris";
import { useEffect, useState, Link, createContext, useContext } from "react";
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
import "./components/ListDetail/styles/App.css";
import {
  newspaperOutline,
  documentTextOutline,
  chatbubbleOutline,
  homeOutline,
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
} from "react-router-dom";
import { Context } from "./utilities/data-context";
// import { useUniqueKeys, UniqueKeysProvider } from "./utilities/utility-methods";

const DataContext = createContext();
function DataProvider({ children }) {
  const [flag, setFlag] = useState(false);
  const [subscriptions, setSubscriptions] = useState(["free"]);
  const [currentSession, setCurrentSession] = useState({});
  const setRouteSubscriptions = (activeSubscriptions, activeSession) => {
    setSubscriptions(activeSubscriptions);
    setCurrentSession(activeSession);
  };

  Context.listen("SubscriptionUpdate", ({ subscriptions, activeSession }) => {
    setRouteSubscriptions(subscriptions, activeSession);
  });

  useEffect(() => {}, [subscriptions,currentSession]);

  const setRouteFlag = (flag) => {
    setFlag(flag);
  };

  return (
    <DataContext.Provider
      value={{
        currentSession,
        subscriptions,
        flag,
     
        setRouteSubscriptions,
        setRouteFlag,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

let navigation;


function Dashboard() {
  const navigation = useNavigate();
  const fetch = useAuthenticatedFetch();
  const { flag, setRouteFlag, setRouteSubscriptions } = useContext(DataContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!flag) {
        try {
          const subscriptionsResponse = await fetch(
            "/api/current/subscription/status"
          );

          // if (!subscriptionsResponse.ok) {
          //   // If the response status is not ok (e.g., 401 Unauthorized or 403 Forbidden),
          //   // it means the user is not authenticated or doesn't have access.
          //   // Redirect the user to the login page or show an error message.
          //   // navigation("/login");
          //   return;
          // }

          const data = await subscriptionsResponse.json();
          const { activeSubscriptions, session } = data;

          setRouteFlag(true);
          setRouteSubscriptions(activeSubscriptions, session);
        } catch (err) {
          // Handle network errors or other unexpected errors here.
       
          const retryInterval = 4000; // 4 seconds
          setTimeout(fetchData, retryInterval);
          console.error("Error fetching data", err);
        }
      }
    };

    fetchData();
  }, [flag, fetch, navigation, setRouteFlag, setRouteSubscriptions]);

  return <div></div>;
}

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
                ]}
              />
               {/* <Routes pages={pages} /> */}
               <DataProvidersProvider>
               <NavigationDataProvider>
               < ProductDataProvider>
              <DataProvider>
                <Dashboard />

                <IonMenuNav />
              </DataProvider>
              </ProductDataProvider>
              </NavigationDataProvider>
              </DataProvidersProvider>
            </QueryProvider>
          </AppBridgeProvider>
        </BrowserRouter>
      </PolarisProvider>
    </IonApp>
  );
}

function Home() {
  return <ProductsCard />;
}

function ProductDetails() {
  const { subscriptions, currentSession } = useContext(DataContext);

  return (
    <ListDetailComponent
      subscriptions={subscriptions}
      currentSession={currentSession}
    />
  );
}

function Subscriptions() {
  const { subscriptions } = useContext(DataContext);

  return <SubscriptionComponent subscriptions={subscriptions} />;
}
// Other page components...

function NoMatch() {
  return <IonPage>404 Not Found</IonPage>;
}

function IonMenuNav() {
  const location = useLocation();
  const navigate = useNavigate();
const {aiWorkStationSetter} = useNavigationDataContext();
  const [currentRoute, setCurrentRoute] = useState("/");
  location;
  useEffect(() => {
    // console.log("pathname", location.pathname);
    setCurrentRoute(location.pathname);
  }, [location.pathname]);

  const tabs = {
    "/subscriptions": [
      {
        label: "Home",
        icon: homeOutline,
        clickHandler: (event) => {
          navigate("/", { replace: true });
          //  Context.sendData("DataWindowModal", {category:"article"}, "IonMenuNavComponent" )
          console.log("Subscription Home tab clicked");
        },
      },
    ],
    "/": [],
    "/product-details": [
      {
        label: "Home",
        icon: homeOutline,
        clickHandler: (event) => {
          navigate("/", { replace: true });
          //  Context.sendData("DataWindowModal", {category:"article"}, "IonMenuNavComponent" )
          console.log("Subscription Home tab clicked");
        },
      },
      {
        label: "Description",
        icon: newspaperOutline,
        clickHandler: (event) => {
          aiWorkStationSetter("description")

          console.log("Description tab clicked");
        },
      },
      {
        label: "Article",
        icon: documentTextOutline,
        clickHandler: (event) => {
          aiWorkStationSetter("article")
       
        }
      },
      {
        label: "Post",
        icon: chatbubbleOutline,
        clickHandler: (event) => {
          aiWorkStationSetter("post")
        },
      },
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
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          {tabs[currentRoute]?.map((tab, index) => (
            <IonTabButton
              key={index}
              tab={currentRoute}
              onClick={tab.clickHandler}
            >
              <IonIcon icon={tab.icon} />
              <IonLabel>{tab.label}</IonLabel>
            </IonTabButton>
          ))}
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}
