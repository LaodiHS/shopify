import React from "react";
import { IonText, IonThumbnail, IonGrid, IonCol, IonRow } from "@ionic/react";
const Marker = ({ requirementText, color }) => {
  if (
    (requirementText && typeof requirementText !== "string") ||
    (color && typeof color !== "string")
  ) {
    throw Error("Invalid argument types");
  }
  const key =  color;
  const style = {
    backgroundColor: color || "transparent",
    width: "10px",
    height: "10px",
    display: "inline",
    borderRadius: "10px",
    // display: "inline-block",
  };
  const styleText = {
    backgroundColor: color,
    fontFamily: "'Baloo', sans-serif",
    borderRadius: "5px",
    paddingRight: "3px",
    paddingLeft: "3px",
  };

  let verifiedReq = requirementText;
  if (
    requirementText.includes("jpg") ||
    requirementText.includes("png") ||
    requirementText.includes("gif") ||
    requirementText.includes("jpe")
  ) {
    verifiedReq = (
      <IonThumbnail key={"thumb" + key}>
        <img key={"img" + key} src={requirementText} />
      </IonThumbnail>
    );
  }

  return (
    <>
      <sub
        key={key}
        className="ion-text-capitalize"
        style={{
          verticalAlign: "super",
          fontSize: "20px",
          fontFamily: "'Baloo', sans-serif",
          paddingRight: "10px",
        }}
      >
        {/* <IonGrid>
    <IonRow 
    // style={{ textAlign: "center" } }
    >
      <IonCol size="auto"> */}

        <IonText
          key={"m" + key}
          style={{
            ...styleText,
            verticalAlign: "super",
            // textAlign: "right"
          }}
          color="medium"
        >
          {verifiedReq}
        </IonText>

        {/*       
      </IonCol>
    </IonRow>
  </IonGrid> */}
      </sub>
      <br key={"br" + key} />
    </>
  );
};

export { Marker };
