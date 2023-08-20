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
  const [usage, setUsage] = useState(tokenUsage);
  const [totalArticles, setTotalArticles] = useState();
  useEffect(() => {
    // Update the usage whenever tokenUsage changes
    const use =
      (((usage.capped_usage - usage.current_usage) / 1000) * 750) / 1500;
    setTotalArticles(use);
    setUsage(tokenUsage);
  }, [tokenUsage]);

if(!usage){

return (<IonListHeader><IonSkeletonText 
animated={true} 
style={{ width: '80px'}}>
</IonSkeletonText>
</IonListHeader>)
}

  return (
    <>

      <p>
        Remaining Usage:
        {/* {usage.capped_usage - usage.current_usage} */}
        <IonProgressBar
          value={((usage.capped_usage / 1000) * 750) / 1500}
        ></IonProgressBar>
      </p>
    </>
  );
}
