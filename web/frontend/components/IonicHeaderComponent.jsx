import React, { useState, useEffect, useRef } from "react";
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
import { useDataProvidersContext } from ".";
export function IonicHeaderComponent({ centerText, left, right, progress = 100 , buffer=100, type="determinate"}) {
 const titleSize = useRef(null)

const {allAssets} = useDataProvidersContext()
useEffect(() => {

setTimeout(() => {
  titleSize.offsetWidth
}, 0);

},[]);



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
        <IonTitle ref = {ref => { titleSize.current = ref} }   style={{
          backgroundImage: `url(${allAssets.honeyCombGridDrop})`,
          fontSize: "9px",
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
