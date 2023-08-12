import React, { useEffect, useState } from "react";
import { Context } from "../utilities/data-context.js";
import { useNavigate } from "react-router-dom";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonRadioGroup,
  IonRadio,
  IonContent,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonAlert,
  IonPage,
  IonMenuToggle,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonBackButton,
  IonRouterOutlet,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { useAuthenticatedFetch } from "../hooks";
import { Toast } from "@shopify/app-bridge-react";
import { chevronBack, fileTray } from "ionicons/icons";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";

export const SubscriptionComponent = ({ subscriptions }) => {
  const fetch = useAuthenticatedFetch();
  const [showModal, setShowModal] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertBody, setAlertBody] = useState("");

      const app = useAppBridge();
  function handleRedirect(redirectUrl) {

    // Replace 'https://example.com' with the URL you want to redirect to
  
    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.REMOTE, { url: redirectUrl });
  }
  function setAlertMessage(alertHeader, alertBody) {
    setAlertHeader(alertHeader);
    setAlertBody(alertBody);
    setShowModal(true);
  }

  async function handleProductSelection(selection) {
    try {
      const response = await fetch("/api/subscription/selection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selection.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.redirectUrl) {
        setAlertBody(
          "Thank Your For Your Subscription",
          "You will be taken to the Shopify subscription page to approve your purchase..."
        );

        // setTimeout(() => {

          // console.log('redirect url-->', data.redirectUrl)
          handleRedirect(data.redirectUrl);
          // window.top.location.href = data.redirectUrl;
        // }, 1000); // Delay for 3 seconds
      } else if (response.ok && data.message) {
        setAlertMessage(response.message.header, response.message.body);
        Context.sendData(
          "SubscriptionUpdate",
          { subscriptions: data.subscriptions },
          "Subscriptions_Component"
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  const closeModal = () => {
    setShowModal(false);
  };

  const subscriptionsOptions = [
    {
      title: "free",
      price: "Free",
      features: ["Generate descriptions from templates"],
    },
    {
      title: "basic",
      price: "$5/month",
      features: [
        "Generate descriptions from templates",
        "Select key points from your product",
        "Include variant selections",
        "Image analysis",
      ],
    },
    {
      title: "crafted",
      price: "$10/month",
      features: [
        "Generate descriptions from templates",
        "Select key points from your product",
        "Include variant selections",
        "Image analysis",
        "Generate articles and social posts",
        "Advanced language options",
      ],
    },
    {
      title: "advanced",
      price: "$20/month",
      features: [
        "Generate descriptions from template",
        "Select key points from your product",
        "Include variant selections",
        "Image analysis",
        "Generate articles and social posts",
        "Advanced language options",
        "Advanced document formats",
        "Regional audience selection",
      ],
    },
  ];

  return (
    <IonPage>
      <IonContent>
        <IonGrid>
          <IonRow>
            {subscriptionsOptions.map((subscription, index) => {
              const current = subscriptions.includes(subscription.title);

              return (
                <IonCol size="12" size-md="3" key={index}>
                  <IonCard color={current ? "dark" : ""}>
                    <IonCardHeader>
                      <IonCardTitle className="ion-text-capitalize">
                        {subscription.title}
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {subscription.price && (
                        <p>
                          <strong>Price:</strong> {subscription.price}
                        </p>
                      )}
                      <p>
                        <strong>Features:</strong>
                      </p>
                      <IonRadioGroup
                        className={subscription.features ? "" : "ion-hide"}
                      >
                        {subscription.features.map((feature, index) => (
                          <div key={index}>
                            <IonRadio
                              value={feature}
                              color="success"
                              checked
                              slot="start"
                              labelPlacement="end"
                            >
                              {feature}
                            </IonRadio>
                          </div>
                        ))}
                      </IonRadioGroup>{" "}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <IonButton
                          disabled={subscriptions.includes(
                            subscription.title.toLowerCase()
                          )}
                          //className={subscription.title == "Free" ? "ion-hide" : ""}
                          key={index}
                          onClick={() =>
                            handleProductSelection(subscription.title)
                          }
                          size="small"
                        >
                          {current
                            ? "Selected"
                            : subscription.title === "free"
                            ? "Unsubscribe"
                            : "Select"}
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>
        <IonAlert
          isOpen={showModal}
          onDidDismiss={closeModal}
          header={alertHeader}
          message={alertBody}
          buttons={[]}
        />
      </IonContent>
    </IonPage>
  );
};