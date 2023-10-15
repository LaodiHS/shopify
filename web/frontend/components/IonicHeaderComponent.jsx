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
  IonProgressBar,
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
export function IonicHeaderComponent({ centerText, left, right, progress = 100 , buffer=100, type="determinate"}) {
 

  centerText = centerText || "neural nectar";
  return (
    <IonHeader 
    //  translucent={true}
    style={{"--background":"none"}}
    >
      <IonToolbar
       style={{"--background":"none"}}
      >
        {left}
        <IonTitle    style={{
          backgroundImage: `url(${honeyCombGridDrop})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          padding:"20px",
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
        <IonProgressBar 
        //color="neural" 
        type={type} buffer={buffer} color="dark" value={progress} />
      </IonToolbar>
    </IonHeader>
  );
}
