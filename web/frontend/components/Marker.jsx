import React from "react";
import { IonText, IonThumbnail, IonGrid, IonCol, IonRow } from "@ionic/react";
const Marker = ({ r, c }) => {
  if ((r && typeof r !== "string") || (c && typeof c !== "string")) {
    throw Error("Invalid argument types");
  }

  const style = {
    backgroundColor: c || "transparent",
    width: "15px",
    height: "15px",
    display: "inline",
    borderRadius: "50px",
    display: "inline-block",
  };
  const styleText = {
    padding: "25px",
  };
  if (
    r.includes("jpg") ||
    r.includes("png") ||
    r.includes("gif") ||
    r.includes("jpe")
  ) {
    r = (
      <IonThumbnail>
        <img src={r} />
      </IonThumbnail>
    );
  }

  return (
    <IonGrid>
    <IonRow style={{ textAlign: "center" }}>
 
      <IonCol>
       <IonText style={{ ...styleText, textAlign: "right" }} color="success">
          *{r}
        </IonText> <span style={style}></span>
      </IonCol>
    </IonRow>
  </IonGrid>
  );
};

export { Marker };
