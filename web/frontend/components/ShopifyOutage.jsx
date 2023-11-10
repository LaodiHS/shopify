import React, { useState } from "react";
import { IonContent, IonPage, IonButton, IonLoading } from "@ionic/react";
import { downHoneyShop } from "../assets";
import { useDataProvidersContext } from "../components";
export const ShopifyOutage = (
  {
    // retrySession
  }
) => {
  const { defineShopifyDown: retrySession } = useDataProvidersContext();
  const [loading, setLoading] = useState(true);
  const handleRetry = () => {
    retrySession((prev) => !prev);
    // Add any retry logic here, e.g., redirect to another page, refresh the page, etc.
  };

  setTimeout(() => {
    setLoading(false);
  }, 10_000);

  if (loading) return null;

  return (
    <IonPage>
      <IonContent
        className="ion-padding"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="ion-text-center">
          <img
            src={downHoneyShop}
            alt="Shopify"
            style={{ width: "150px", marginBottom: "20px" }}
          />
          <h1>We're Sorry!</h1>
          <p>We are experiencing some technical difficulties at the moment. </p>
          <h1 style={{ fontFamily: "Baloo, san-serif", letterSpacing: "3px" }}>
            neural nectar
            <sub
              style={{
                fontFamily: "'Baloo', sans-serif",
                letterSpacing: "none",
                position: "relative",
                fontSize: "small",
                top: "-0.3em",
                linSpacing: "1.5px",
                color: "tangerine",
              }}
            >
              AI
            </sub>
          </h1>
          <p>will be back up and running soon.</p>

          <IonButton color="primary" onClick={handleRetry}>
            Retry
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
