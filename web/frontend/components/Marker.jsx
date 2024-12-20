import React from "react";
import {
  IonThumbnail,
  IonCol,
  IonRow,
  IonItem,
  IonChip,
  IonCard,
  IonCardTitle,
  IonCardHeader,
} from "@ionic/react";
import { useProductDataContext } from "../components";
// import { useDataProvidersContext, NoImagePlaceHolder } from "../components";
// import { darkenHexColor } from "../utilities/darkenHexColor";

const Marker = ({ markerType, label, color, size, imageSrc }) => {
  if (
    (label && typeof label !== "string") ||
    (color && typeof color !== "string")
  ) {
    throw Error("Invalid argument types");
  }
  return markerType ==="img" ? <PlaceImage color={color} imageSrc={imageSrc} size={size} /> : <PlaceIonChip key={color} label={label} color={color} /> ;
};

function PlaceImage({ color, imageSrc, size }) {
const {loadingStream} = useProductDataContext();
console.log('loading',loadingStream);
  return (
    <IonRow key={`${color}Row`}>
      <IonCol key={`${color}col`} size="12" className="ion-align-self-center">
        <IonItem key={`${color}IonItem`} lines="none">
         
         {loadingStream ? (<IonCard animated={true} style={{
          // width:"140px", height:"140px",
          "background": color }} ><IonCardHeader><IonCardTitle 
          style={{fontFamily:"Baloo, sans-serif"}}
          >Loading Image...</IonCardTitle></IonCardHeader></IonCard>) : (
          <IonThumbnail
            key={`thumb${color}`}
            aria-hidden="true"
            slot="start"
            style={{
              "--size": `${size - 20}px`,
              "--borderRadius": "14px",
              "border": '6px solid' +  color
            }}
          >
            <img
              key={`${color}IonImg`}
              alt="Image Requirement"
              src={imageSrc}
              loading="eager"
              width="140" 
              height="140"
            />
          </IonThumbnail>
          )}
        </IonItem>
      </IonCol>
    </IonRow>
  );
}

function PlaceIonChip({ label, color }) {
  return (
    <IonChip
      key={`sub${color}`}
      className="ion-text-capitalize"
      style={{
        // verticalAlign: "super",
        fontSize: "20px",
        fontFamily: "'Baloo', sans-serif",
        color:"black",
        background: color,
        borderRadius: "2px",
      }}
    >
      {label}
    </IonChip>
  );
}

export { Marker };
