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

  const arrowRef = useRef();

  useEffect(() => {
    setCloudAnimationHeight(window.innerHeight + "px");
    console.log("windowHeight:", window.innerHeight);
    const height = (8 / 100) * window.innerHeight;

    setIconSize(Math.floor(height));
    console.log("height: ", height);
  }, []);

  return (
    <IonPage
    // ref={(el) => {
    //   animationRef.current = el; // Attach the IonPage element to animationRef
    //   // Forward the ref to the parent component
    // }}
    >
      <IonicHeaderComponent type={"indeterminate"} progress={progress} />

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

            <IonRow className="ion-align-items-center">
            

             
                  <IonCol size="5" className="ion-text-end ion-margin-top">
                    <IonText
                
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
                  <IonCol size="2"  style={{
                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.01)), url(${honeyDrop})`,
                  backgroundPosition: "center center",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                   height: iconSize + "px",
                
           
                }}>

                  </IonCol>
                  <IonCol size="5" className="ion-text-start ion-margin-top">
                    <IonText
                     
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
             
        
              <IonCol style={{ padding: "0px", margin: "0px" }}>
                <div className="full-wh">
                  <div className="bg-animation">
                    {" "}
                    <div id="leaves">
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
              <IonCol
                style={{
                  display: "grid",

                  gridGap: "10px",

                  gridTemplateColumns: "5fr 2fr",
                }}
                size="12"
                // className="ion-hide-sm-down"
              >
                <h3
                  style={{
                    justifySelf: "end",
                    alignSelf: "center",
                    fontSize: "2.5vw",
                    fontFamily: "Baloo, san serif",
                  }}
                >
                  Reading Your Catalog And Product Data
                
                </h3>
                <div
                  className="ion-hide-sm-down"
                  style={{ justifySelf: "start", placeItems:"center", display:"grid" }}
                >
                  <div className="loader"></div>
                </div>
              </IonCol>
            </IonRow>

            <IonRow></IonRow>
          </IonGrid>
        </IonContent>
      </div>
    </IonPage>
  );
}

