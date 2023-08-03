import React from "react";
import { IonText, IonThumbnail, IonGrid, IonCol, IonRow } from "@ionic/react";
const L = ({ r, c }) => {
  if ((r && typeof r !== "string") || (c && typeof c !== "string")) {
    throw Error("Invalid argument types");
  }
  const style = {
    backgroundColor: c || "transparent",
    width: "25px",
    height: "25px",
    display: "inline",
    borderRadius: "50px",
    display: "inline-block",
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
    <p>
      {r} <span style={style}></span>{" "}
    </p>
  );
};

export { L };
