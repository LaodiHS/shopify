/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "./themes/variables.css"
setupIonicReact({ mode: "ios" });
// import "../styles/globals.css";
import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";

import Routes from "./Routes";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import { setupIonicReact, IonApp, IonContent } from "@ionic/react";


export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { t } = useTranslation();

  return (
    <IonApp>
      <IonContent className="ion-padding">
        <PolarisProvider>
          <BrowserRouter>
            <AppBridgeProvider>
              <QueryProvider>
                <NavigationMenu
                  navigationLinks={[
                    {
                      label: t("NavigationMenu.pageName"),
                      destination: "/pagename",
                    },
                    {
                      label: t("NavigationMenu.pageName"),
                      destination: "/pagename",
                    },
                  ]}
                />
                <Routes pages={pages} />
              </QueryProvider>
            </AppBridgeProvider>
          </BrowserRouter>
        </PolarisProvider>
      </IonContent>
    </IonApp>
  );
}
