

import React from 'react';
import { IonContent, IonPage, IonButton } from '@ionic/react';

export const ShopifyOutage = ({retrySession}) => {

  const handleRetry = () => {
    retrySession((prev) => !prev);
    // Add any retry logic here, e.g., redirect to another page, refresh the page, etc.
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="ion-text-center">
          <img src="shopify_logo.png" alt="Shopify" style={{ width: '150px', marginBottom: '20px' }} />
          <h1>We're Sorry!</h1>
          <p>We are experiencing some technical difficulties at the moment. <h1 style={{fontFamily:"Baloo, san-serif", letterSpacing:"3px"}} >neural nectar<sub style={{fontFamily:  "'Baloo', sans-serif", letterSpacing:"none", position:"relative",
          fontSize: "small", top:"-0.3em" ,linSpacing:"1.5px", 
          color:"tangerine"}}>AI</sub></h1>will be back up and running soon.</p>
          <p></p>
          <IonButton color="primary" onClick={handleRetry}>Retry</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

