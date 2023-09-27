import React, { useEffect, useState, useRef } from "react";
import { Context } from "../utilities/data-context.js";
import { useNavigate } from "react_router_dom";
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
  IonList,
  IonItem,
  IonLabel,
  IonPopover,
} from "@ionic/react";
import { useAuthenticatedFetch } from "../hooks";
import { Toast } from "@shopify/app-bridge-react";
import { chevronBack, fileTray } from "ionicons/icons";
import {
  sunset,
  yellowDeskWithLight,
  brownDeskWithLight,
  appleBooks,
  simpleColorDesk,
  readingTree,
  autumnSvg,
  colorBookShelves,
  halfMoon,
  deskLamp,
  milkyway,
  milkywayWashOut,
  starWindow,
  autumnWindLeaves,
  closedWindow,
  autumnTrees,
  kidReadingBench,
  benchWarmer,
  honeyCombGridDrop,
  chestnutHoney,
  acaciaHoney,
  sourwoodHoney,
  honeyPot,
  honeyStick,
} from "../assets";

import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import {
  useDataProvidersContext,
  IonicHeaderComponent,
  CurrentScreenWidth,
} from "../components";

export const SubscriptionComponent = ({
  animationRef,
  //  subscriptions
}) => {
  const { subscriptions, plans, setSubscriptions } = useDataProvidersContext();

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

  console.log("location", Redirect);

  const url = window.location.href.slice();
  //.href.slice().split("/")

  const returnUrl = "";
  console.log("returnUrl", returnUrl);

  async function handleProductSelection(selection) {
    try {
      const response = await fetch("/api/subscription/selection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selection.toLowerCase(),
          returnUrl,
        }),
      });

      const data = await response.json();

      setSubscriptions(data.subscriptions);

      if (response.ok && data.redirectUrl) {
        setAlertBody(
          "Thank Your For Your Subscription",
          "You will be taken to the Shopify subscription page to approve your purchase..."
        );

        handleRedirect(data.redirectUrl);
      } else if (response.ok && data.message) {
        setAlertMessage(data.message.header, data.message.body);
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
  const subscriptionsOptions = Object.entries(plans).map(([title, body]) => {
    return {
      title,
      price: `${body.amount}/${body.interval.toLowerCase().replace(/_/g, " ")}`,
      features: body.usageTerms,
    };
  });
  const [cardWidth, setCardWidth] = useState();
  const screenWidth = CurrentScreenWidth();
  const cardWidthRef = useRef(null);
  useEffect(() => {
    const handleResize = () => {
      if (cardWidthRef.current) {
        setCardWidth(cardWidthRef.current.offsetWidth);

        console.log("cardWidth: " + cardWidthRef.current.offsetWidth);
      }
    };
    setTimeout(() => {
      handleResize();
    }, 100);
    // Add event listener for window resize
   // window.addEventListener("resize", handleResize);

    // Cleanup: remove event listener when component is unmounted
    return () => {
     // window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <IonPage ref={animationRef}>
      <IonicHeaderComponent centerText={"neural nectar"} />
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol
              size="12"
              style={{
                backgroundImage: `url(${honeyCombGridDrop})`,
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                height: "100px",
              }}
              className="ion-text-center ion-padding-bottom"
            >
              <IonRow size="12">
                <IonCol size="6">
                  <h1
                    style={{
                      color: "#ef8561",
                      letterSpacing: "9px",
                      fontFamily: "'Baloo', sans-serif",
                      wordSpacing: "40px",
                      fontSize: "5vw",
                      float: "right",
                      paddingRight: "51px",
                      whiteSpace: "nowrap" /* Prevents wrapping */,
                      // overflow: "hidden", /* Clips content that overflows */
                      // textOverflow: "ellipsis"
                      // textShadow: `4px 4px 2px rgba(150, 150, 150, 1)`,
                    }}
                  >
                    neural
                  </h1>
                </IonCol>
                <IonCol size="6">
                  <h1
                    style={{
                      color: "#ef8561",
                      letterSpacing: "9px",

                      float: "left",
                      fontFamily: "'Baloo', sans-serif",
                      wordSpacing: "40px",
                      fontSize: "5vw",
                      paddingLeft: "53px",
                      whiteSpace: "nowrap" /* Prevents wrapping */,
                      // overflow: "hidden", /* Clips content that overflows */
                      // textOverflow: "ellipsis"
                      // textShadow: `4px 4px 2px rgba(150, 150, 150, 1)`,
                    }}
                  >
                    nectar
                  </h1>
                </IonCol>
              </IonRow>
            </IonCol>
            <IonCol className="ion-text-center ion-padding-top" size="12">
              <h2 style={{ fontFamily: "Baloo, sans-serif" }}>Membership</h2>
              <p>The Sweetest Membership This Side Of Shopify</p>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow
          // style={{
          //         backgroundPosition: "center",
          //         backgroundSize: "cover",
          //         backgroundRepeat: "no-repeat",
          //         height: "950px",
          //          backgroundImage: `url(${autumnWindLeaves})`,
          //       }}
          >
            {subscriptionsOptions.map((subscription, index) => {
              const current = subscriptions.includes(subscription.title);

              const honeyIcons = {
                acacia: acaciaHoney,
                chestnut: chestnutHoney,
                sourwood: sourwoodHoney,
              };

              return (
                <IonCol size="12" size-md="4" key={index}>
                  <IonCard ref={cardWidthRef} color={current ? "dark" : ""}>
                    <IonCardHeader>
                      <IonCardTitle
                        style={{ fontFamily: "Baloo, sans-serif" }}
                        className="ion-text-capitalize"
                      >
                        {subscription.title} Honey
                        <div
                          style={{
                            zIndex: "200",
                            position: cardWidth > 503 ? "absolute" : "relative",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              backgroundPosition: "right",
                              backgroundSize: "contain",
                              backgroundRepeat: "no-repeat",
                              height: "130px",

                              backgroundImage: `url( ${
                                honeyIcons[subscription.title]
                              } )`,
                            }}
                          >
                            {(subscription.title === "acacia" ||
                              subscription.title === "sourwood") && (
                              <div
                                style={{
                                  backgroundPosition: `right`,
                                  backgroundSize: `contain`,
                                  backgroundRepeat: `no-repeat`,
                                  height: "130px",
                                  width: `${cardWidth - 110}px`,
                                  backgroundImage: `url(${honeyStick})`,
                                }}
                              ></div>
                            )}
                          </div>
                        </div>
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent

                    //className="ion-text-capitalize"
                    >
                      {subscription.title &&
                        subscription?.features?.length &&
                        subscription.features.map((feature, index) => (
                          <IonPopover
                            key={index}
                            trigger={
                              "hover-trigger-detail-popover-" +
                              subscription.title +
                              index
                            }
                            side="start"
                            alignment="center"
                            triggerAction="click"
                          >
                            <IonContent class="ion-padding">
                              {feature.description}
                            </IonContent>
                          </IonPopover>
                        ))}
                      {subscription.price && (
                        <p>
                          <strong>Price:</strong> {subscription.price}
                        </p>
                      )}
                      <p>
                        <strong>Features:</strong>
                      </p>
                      <IonList key={index} color={current ? "dark" : ""}>
                        {subscription.title &&
                          subscription.features.map((feature, index) => (
                            <div
                              key={index}
                              id={
                                "hover-trigger-detail-popover-" +
                                subscription.title +
                                index
                              }
                            >
                              <IonItem
                                key={index + "first"}
                                style={{ fontSize: "14px" }}
                                color={current ? "dark" : ""}
                                lines="none"
                              >
                                <IonRadioGroup
                                  color={current ? "dark" : ""}
                                  disabled={true}
                                  className={
                                    subscription.features ? "" : "ion-hide"
                                  }
                                >
                                  <IonRadio
                                    className="ion-text-capitalize"
                                    value={feature.name}
                                    color="success"
                                    checked
                                    slot="start"
                                    labelPlacement="end"
                                  >
                                    {feature.name}
                                  </IonRadio>
                                </IonRadioGroup>
                              </IonItem>

                              {feature.details && (
                                <>
                                  <IonItem
                                    key={index + "12"}
                                    style={{ fontSize: "14px" }}
                                    color={current ? "dark" : ""}
                                    lines="none"
                                  >
                                    <IonRadioGroup
                                      disabled={true}
                                      color={current ? "dark" : ""}
                                      className={
                                        subscription.features ? "" : "ion-hide"
                                      }
                                    >
                                      <IonRadio
                                        value={feature.details.wordCount}
                                        color="success"
                                        checked
                                        slot="start"
                                        labelPlacement="end"
                                      >
                                        {feature.details.wordCount}
                                      </IonRadio>
                                    </IonRadioGroup>
                                  </IonItem>
                                  <IonItem
                                    key={index + "third"}
                                    style={{ fontSize: "14px" }}
                                    color={current ? "dark" : ""}
                                    lines="none"
                                  >
                                    <IonRadioGroup
                                      disabled={true}
                                      color={current ? "dark" : ""}
                                      className={
                                        subscription.features ? "" : "ion-hide"
                                      }
                                    >
                                      <IonRadio
                                        value={feature.details.novel}
                                        color="success"
                                        checked
                                        slot="start"
                                        labelPlacement="end"
                                      >
                                        {feature.details.novel}
                                      </IonRadio>
                                    </IonRadioGroup>
                                  </IonItem>
                                </>
                              )}
                            </div>
                          ))}
                      </IonList>

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
                          color={current ? "success" : "neural"}
                          size="small"
                        >
                          {current
                            ? "Selected"
                            : subscription.title === "free"
                            ? "Unsubscribe"
                            : "Select"}
                        </IonButton>
                      </div>
                      <div></div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              );
            })}
            <IonCol size="12">
              <IonRow size="12">
                <IonCol
                  size="4"
                  style={{
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    height: "100px",
                    backgroundImage: `url(${autumnTrees})`,
                  }}
                ></IonCol>
                <IonCol
                  size="4"
                  style={{
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    height: "390px",
                    transform: "scaleX(-1)",
                    backgroundImage: `url(${benchWarmer})`,
                  }}
                ></IonCol>
                <IonCol
                  size="4"
                  style={{
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    height: "350px",
                    backgroundImage: `url(${autumnTrees})`,
                  }}
                ></IonCol>
              </IonRow>
            </IonCol>
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
