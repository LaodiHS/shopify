import React from "react";
import { checkmarkCircle, checkmarkDoneCircle,checkmarkCircleOutline } from "ionicons/icons";
import { IonText, IonThumbnail, IonGrid, IonCol, IonRow, IonIcon } from "@ionic/react";
const L = ({ r, c }) => {
  if ((r && typeof r !== "string") || (c && typeof c !== "string")) {
    throw Error("Invalid argument types");
  }
  const style = {
    backgroundColor: c || "transparent",
    // width: "25px",
    // height: "25px",
    // borderRadius: "25px",
    // display: "inline-block",
  };
  const styleColor ={
     backgroundColor:c,
    width: "25px",
   height:"25px",
    
    color:c,
    borderRadius: "25px"
  }

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
    <p>
      {r} <IonIcon style={styleColor}  size="large" ></IonIcon>
    </p>
  );
};

export { L };
