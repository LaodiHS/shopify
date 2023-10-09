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

export function LoadingPageComponent({ progress, type }) {
  const [iconSize, setIconSize] = useState("25px");
  const [cloudAnimationHeight, setCloudAnimationHeight] = useState("100px");
  const animationRef = useRef();
  const arrowRef = useRef();

  useEffect(() => {
    setCloudAnimationHeight(window.innerHeight + "px");
    console.log("windowHeight:", window.innerHeight);
    const height = (8 / 100) * window.innerHeight;
    setIconSize(Math.floor(height) + "px");
    console.log("height: ", height);
  }, []);
  return (
    <IonPage
      ref={(el) => {
        animationRef.current = el; // Attach the IonPage element to animationRef
        // Forward the ref to the parent component
      }}
    >
      <IonicHeaderComponent type={type} progress={progress} />

      <div
        id="nc-main"
        style={{
          backgroundImage: `url(${readingBag})`,
          backgroundPosition: "top",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "100%",
          width: "100%",
        }}
        className="afterglow nc-main bg-cover bg-cc"
      >
        <IonContent style={{ "--background": "none" }} className="">
          <IonGrid>
            <IonRow>
              {" "}
          
              <IonCol
                style={{
                  backgroundImage: ` url(${honeyDrop})`,
                  backgroundPosition: "top center",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  height: iconSize,
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
            
            <IonRow>
              <IonCol className="ion-text-center">
                <h3 style={{ fontSize: "3vh", fontFamily: "Baloo, san serif" }}>
                  Reading your Catalog and Product Data
                </h3>
                <h2
                  style={{ fontFamily: "Baloo, sans-serif" }}
                  className="ion-text-center ion-text-capitalize"
                >
                  <IonText
                    style={{ fontFamily: "Baloo, sans-serif" }}
                    color="neural"
                  ></IonText>
                </h2>
                <p
                  style={{ fontFamily: "Baloo, sans-serif" }}
                  className="ion-text-center"
                ></p>

                <div className="ion-text-center"></div>
                <div className="ion-text-center animate__animated animate__fadeInUp">
                  <IonButton
                    style={{
                      letterSpacing: "3px",
                      fontFamily: "Baloo, sans-serif",
                    }}
                    fill="clear"
                    expand="block"
                    color="shoe"
                  ></IonButton>{" "}
                </div>
                <div className="full-wh">
                
       
              
                  <div className="bg-animation">       <div id="leaves">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
                    <div id="stars"></div>
                    <div id="stars2"></div>
                    <div id="stars3"></div>
                    <div id="stars4"></div>
                  </div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </div>
    </IonPage>
  );
}
