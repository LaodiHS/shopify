import "./ListDetail/styles/loadingPage.css";
import React, { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonPage,
  IonItem,
  IonList,
  IonLoading,
} from "@ionic/react";

import { IonicHeaderComponent } from "./IonicHeaderComponent";
import {
  honeyPot,
  readingTree,
  honeyCombGridDrop,
  girlReading,
  readingBag,
  honeyDrop,
} from "../assets";
import { useDataProvidersContext } from "../components";
const svgAssets = import.meta.glob("./assets/reading-bag.svg");
export function LoadingPageComponent({ progress, type }) {
  const [iconSize, setIconSize] = useState("25px");
  const [cloudAnimationHeight, setCloudAnimationHeight] = useState("100px");
  const [readingBagSVG, setReadingBagSVG] = useState("");
  const arrowRef = useRef();

  const { assetsLoaded, allAssets} = useDataProvidersContext();

  useEffect(() => {
    setCloudAnimationHeight(window.innerHeight + "px");
    console.log("windowHeight:", window.innerHeight);
    const height = (8 / 100) * window.innerHeight;

    setIconSize(Math.floor(height));
    console.log("height: ", height);
  }, []);

  if (!assetsLoaded) {
    console.log("quick assetsLoaded from view: ", allAssets)
    // console.log('all assets React: ',allAssets )
    return <div></div>;
  }

  return (
    <IonPage
      key="IonPage"
      // ref={(el) => {
      //   animationRef.current = el; // Attach the IonPage element to animationRef
      //   // Forward the ref to the parent component
      // }}
    >
      {/* <IonicHeaderComponent type={"indeterminate"} progress={progress} /> */}

      <div
        key="mainBackgroundImageContainer"
        id="nc-main"
        style={{
          backgroundImage: `url(${allAssets["reading-bag.svg"]})`,
          backgroundPosition: "top",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "100%",
          width: "100%",
        }}
        className="afterglow nc-main bg-cover bg-cc"
      >
        <IonContent key="nectarContainers" style={{ "--background": "none" }}>
          <IonGrid key="nectarContainerGrid">
            <IonRow key="nectarContainerRow" className="ion-align-items-center">
              <IonCol
                key="nectarContainerRowCol"
                size="5"
                className="ion-text-end ion-margin-top"
              >
                <IonText
                  key="nectarContainerRowColText"
                  style={{
                    color: "#ef8561",
                    letterSpacing: "1.9vw",
                    fontFamily: "'Baloo', sans-serif",
                    fontSize: "5vw",
                    whiteSpace: "nowrap" /* Prevents wrapping */,
                    overflow: "hidden" /* Clips content that overflows */,
                    textOverflow: "ellipsis",
                  }}
                >
                  neural
                </IonText>
              </IonCol>
              <IonCol
                key="nectarContainerRowColEmblem"
                size="2"
                style={{
                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.01)), url(${honeyDrop})`,
                  backgroundPosition: "center center",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  height: iconSize + "px",
                }}
              ></IonCol>
              <IonCol key="nectarContainerRowColRightCol"  size="5" className="ion-text-start ion-margin-top">
                <IonText key="nectarContainerRowColRightText" 
                  style={{
                    color: "#ef8561",
                    letterSpacing: "1.7vw",
                    marginTop: iconSize + 50 + "px",
                    fontFamily: "'Baloo', sans-serif",
                    fontSize: "5vw",
                    whiteSpace: "nowrap" /* Prevents wrapping */,
                    overflow: "hidden" /* Clips content that overflows */,
                    textOverflow: "ellipsis",
                  }}
                >
                  nectar
                </IonText>
              </IonCol>

              <IonCol key="nectarContainerLeaves"  style={{ padding: "0px", margin: "0px" }}>
                <div className="full-wh"  key="nectarContainerLeavesContainerWidth" >
                  <div key="nectarContainerLeavesContainerWidthAnimationContainer" className="bg-animation">
                    <div key="nectarContainerLeavesContainerWidthAnimationContainerLeavesId" id="leaves">
                      <i key="l11"></i>
                      <i key="l12"></i>
                      <i key="l13"></i>
                      <i key="l14"></i>
                      <i key="l15"></i>
                      <i key="l16"></i>
                      <i key="l17"></i>
                      <i key="l18"></i>
                      <i key="l19"></i>
                      <i key="l110"></i>
                      <i key="l111"></i>
                      <i key="l112"></i>
                      <i key="l113"></i>
                      <i key="l114"></i>
                      <i key="l115"></i>
                      <i key="l116"></i>
                      <i key="l117"></i>
                      <i key="l118"></i>
                      <i key="l119"></i>
                      <i key="l120"></i>
                      <i key="l121"></i>
                    </div>
                    <div key="stars" id="stars"></div>
                    <div key="stars2" id="stars2"></div>
                    <div key="stars3" id="stars3"></div>
                    <div key="stars4" id="stars4"></div>
                  </div>
                </div>
              </IonCol>
              <IonCol key="Colgrid1"
                style={{
                  display: "grid",

                  gridGap: "10px",

                  gridTemplateColumns: "5fr 2fr",
                }}
                size="12"
                // className="ion-hide-sm-down"
              >
                <h3 key="LoadingText"
                  style={{
                    justifySelf: "end",
                    alignSelf: "center",
                    fontSize: "2.5vw",
                    fontFamily: "Baloo, san serif",
                  }}
                >
                  Reading Your Catalog And Product Data
                </h3>
                <div key="LoaderIconContainer"
                  className="ion-hide-sm-down"
                  style={{
                    justifySelf: "start",
                    placeItems: "center",
                    display: "grid",
                  }}
                >
                  <div  key="LoaderIconContainerIcon" className="loader"></div>
                </div>
              </IonCol>
            </IonRow>

            <IonRow key="spacer"></IonRow>
          </IonGrid>
        </IonContent>
      </div>
    </IonPage>
  );
}
