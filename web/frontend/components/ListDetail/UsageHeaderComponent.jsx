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
  IonListHeader,
  IonSkeletonText,
} from "@ionic/react";

export function TokenUsageComponent({ tokenUsage }) {
console.log('tokenUsag', tokenUsage)
  const [usage, setUsage] = useState(null);
  useEffect(() => {
    const use = (tokenUsage.current_usage / tokenUsage.capped_usage).toFixed(2);
    setUsage(use);
  }, [tokenUsage]);

  if (!usage) {
    return (
      <IonListHeader key="tokenUsageComponent">
        <IonSkeletonText key="tokenUsageComponentIonSkeletonText"
          animated={true}
          style={{ width: "80px" }}
        ></IonSkeletonText>
      </IonListHeader>
    );
  }

  return (
  
     
        <IonProgressBar style={{height:"7px"}} key="TokenUsageProgressBar" color={ (usage <= .70) ? "success" : "warning"  } value={usage}></IonProgressBar>
    
  
  );
}
