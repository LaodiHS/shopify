import React from "react";
import { IonText, IonThumbnail, IonGrid, IonCol, IonRow } from "@ionic/react";
const Marker = ({ r, c }) => {
  if ((r && typeof r !== "string") || (c && typeof c !== "string")) {
    throw Error("Invalid argument types");
  }

  const style = {
    backgroundColor: c || "transparent",
    width: "10px",
    height: "10px",
    display: "inline",
    borderRadius: "10px",
   // display: "inline-block",
  };
  const styleText = {
  backgroundColor:c,
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
   <sub style={{
    verticalAlign: "super",
    fontSize: "75%"
}}>
    {/* <IonGrid>
    <IonRow 
    // style={{ textAlign: "center" } }
    >
      <IonCol size="auto"> */}


       <IonText style={{ ...styleText, verticalAlign: "super",
        // textAlign: "right" 
      }
        } color="medium">
          {r.trim()}
          {/* <span style={style}></span>  */}
         </IonText> 
      
{/*       
      </IonCol>
    </IonRow>
  </IonGrid> */}
 
 
  </sub> 
  );
};

export { Marker };
