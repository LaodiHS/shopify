import React from "react";
import {
  IonText,
  IonThumbnail,
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  IonImg,
  IonChip,
} from "@ionic/react";
import { useDataProvidersContext, NoImagePlaceHolder } from "../components";
import { darkenHexColor } from "../utilities/darkenHexColor";


const Marker = ({ requirementText, color, size, selectedImageMap}) => {
  // const { selectedImageMap } = useDataProvidersContext();
  if (
    (requirementText && typeof requirementText !== "string") ||
    (color && typeof color !== "string")
  ) {
    throw Error("Invalid argument types");
  }

  let verifiedReq = requirementText;
  if (requirementText.includes("_jpg")) {
    return (
      <IonRow>
        <IonCol size="12" className="ion-align-self-center">
          <IonItem lines="none">
          <IonThumbnail
            aria-hidden="true"
            slot="start"
            key={"thumb" + color}
            style={{
              "--size": (size - 20) + "px",
              "--borderRadius": "14px",
            }}
          >
            <img
              key={"img" + color}
              alt="Image Requirement"
              src={
                selectedImageMap[requirementText]?.url ||
                <NoImagePlaceHolder />
              }
            />
          </IonThumbnail>
          </IonItem>
        </IonCol>
      </IonRow>
    );
  }

  return (
    <IonChip
      key={"sub" + color}
      className="ion-text-capitalize"
      style={{
        // verticalAlign: "super",
        fontSize: "20px",
        fontFamily: "'Baloo', sans-serif",
        background: color,
        borderRadius: "2px",
      }}
    >
      {verifiedReq}
    </IonChip>
  );
};

export { Marker };
