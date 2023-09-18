import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
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
} from "../assets";
export function IonicHeaderComponent({ centerText, left, right }) {
  useEffect(() => {
    // Update the usage whenever tokenUsage changes
  }, []);
  centerText = centerText || "neural nectar";
  return (
    <IonHeader 
    // translucent={true}
    >
      <IonToolbar
     
      >
        {left}
        <IonTitle    style={{
          backgroundImage: `url(${honeyCombGridDrop})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          minHeight: "40px",
        }}className="ion-text-center">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{paddingRight:"20px"}} className="ion-text-end ion-padding-end">
              {centerText.split(" ")[0]}
            </div>{" "}
            <div style={{paddingLeft:"19px"}} className="ion-text-start ion-padding-start">
              {centerText.split(" ")[1]}
            </div>
          </div>
        </IonTitle>

        {right}
      </IonToolbar>
    </IonHeader>
  );
}
