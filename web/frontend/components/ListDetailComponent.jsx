import React, { useEffect, useRef, useState } from "react";

import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonModal,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonRouter,
  IonTabButton,
  IonTabs,
  IonTabBar,
  IonRouterOutlet,
  IonText,
  IonPopover,
  useIonPopover,
  IonProgressBar,
  IonLoading,
  IonNav,
} from "@ionic/react";
import {
  chatbubbleOutline,
  chevronBack,
  documentTextOutline,
  newspaperOutline,
  informationCircleOutline,
  exitOutline,
} from "ionicons/icons";
import { pencilCase,  microphone} from "../assets";
import { useLocation, useNavigate } from "react_router_dom";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import { Context, SharedData } from "../utilities/data-context.js";
import {
  useProductDataContext,
  PaidFeature,
  CamelToKebabCase,
  useDataProvidersContext,
  TokenUsageComponent,
} from "../components";
import { audienceModel } from "../utilities/language-model";
import { updateObject } from "../utilities/utility-methods";
import { Accordion } from "./ListDetail/Accordion";
import { ProductDetails } from "./ListDetail/ProductDetails";
import { Toggles } from "./ListDetail/Toggles";

// import { useUniqueKeys, UniqueKeysProvider } from "../utilities/utility-methods";

const toggles = {
  // language:false,
  tone: true,
  introduction: true,
  feature: false,
  evocative: false,
  narrative: false,
  rhetorical: false,
  // socialMedia: false,
  engagingFormats: true,
  valuePropositionFormats: false,
};

export function ListDetailComponent({ animationRef }) {
  const {
    subscriptions,
    currentSession,
    user,

    handleSelectChange,
  
    DataProviderNavigate,
  } = useDataProvidersContext();

  const { productData } = useProductDataContext();

  if (!subscriptions) {
    return <div> no subscription found</div>;

    throw new Error(
      "no subscriptions prop on ListDetailComponent: ",
      subscriptions
    );
  }
  if (!currentSession) {
    throw new Error("no session prop on ListDetailComponent: ", currentSession);
  }

  const fetch = useAuthenticatedFetch();

  const navigate = useNavigate();
  // const [productData, setData] = useState(null);
  const [composeTextModalLoading, setComposeTextModalLoading] = useState(false);

  const { sections } = audienceModel;

  const [hiddenElements, setHiddenElements] = useState(toggles);

  const [isOpen, setIsOpen] = useState(false);

  function onToggleChange(selectElementId) {
    setHiddenElements((prevHiddenElements) => ({
      ...prevHiddenElements,
      [selectElementId]: toggles[selectElementId],
    }));
  }

  function setAccordionLoadingState(state) {
    setComposeTextModalLoading(state);
  }

  function setAccordionModalPopUp(boolValue) {
    setIsOpen(boolValue);
  }

  function handleModalClose(accordionSelection = "description") {
    setIsOpen(false);
  }

  const navigateBack = () => {
    DataProviderNavigate("/", { target: "host" });
  };

  // console.log("ListDetailComponentData", ListDetailComponent);



  const menuRef = useRef(null);
  const contentRef = useRef(null);

  function scrollToBottom() {
    contentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }
  const openMenu = () => {
    if (menuRef.current) {
      menuRef.current.open();
    }
  };

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.close();
    }
  };

  if (!productData) {
    return <ion-spinner color="success"></ion-spinner>; // or show an error message
  }

  return (
    <>
      <IonMenu
        key={"1"}
        ref={menuRef}
        onIonDidClose={scrollToBottom}
        type="reveal"
        side="end"
        contentId="main-content"
      >
        <IonHeader key={"2"} translucent={true}>
          <IonToolbar key={"3"}>
            <IonTitle key={"4"}>Advanced</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent key={"5"} fullscreen={true} className="ion-padding">
          <IonMenuToggle key={"6"}>
            <IonButton key={"7"} fill="clear" expand="block" size="small">
              Click to close the menu
            </IonButton>
          </IonMenuToggle>
          <Toggles
            key={"8"}
            onToggleChange={onToggleChange}
            toggles={toggles}
          />
        </IonContent>
      </IonMenu>
      <IonPage ref={animationRef} key={"9"} id="main-content">
        <IonHeader key={"10"} translucent={true}>
          <IonToolbar key={"11"}>
            <IonButtons key={"12"} onClick={navigateBack} slot="start">
              <IonButton key={"13"}>
                <IonIcon key={"14"} icon={chevronBack} />
              </IonButton>
            </IonButtons>
            <IonTitle key={"15"}>Description Selection</IonTitle>
            <IonButton
               disabled={true}
              fill="clear"
              size="small"
              color="secondary"
              slot="end"
            >
              <IonIcon  slot="icon-only" icon={pencilCase} />
            </IonButton>
            {/* <IonButtons slot="end"></IonButtons>
            <IonButtons slot="end"></IonButtons> */}
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div key={"16"} className="ion-padding">
            {/* <PaidFeature /> */}
          </div>

          <IonGrid key={"19"} fixed={true}>
            <IonRow key={"20"}>
              <IonCol key={"21"} size="12">
                <ProductDetails
                  key={"22"}
                  serverOptions={SharedData.serverOptions}
                  includeProductDetails={SharedData.includeProductDetails}
                  optionRequirements={SharedData.optionRequirements}
                  data={productData}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol key={"23"} size="12">
                <IonItem>
                  <IonButtons slot="end" className="">
                    <IonButton
                      className="ion-padding-top"
                      onClick={() => openMenu()}
                      slot="end"
                      fill="clear"
                      expand="block"
                      area-label="Advanced Tone Options"
                    >
                      Advanced Tone Options
                    </IonButton>
                    <IonButton
                      onClick={() => openMenu()}
                      fill="clear"
                      color="dark"
                      size="large"
                    >
                      <IonIcon
                        slot="icon-only"
                        icon={microphone}
                      ></IonIcon>
                    </IonButton>

                    <IonIcon
                      size="small"
                      color="secondary"
                      slot="end"
                      aria-label="Include existing description in composition"
                      id="advanced-options-select-options-hover-trigger"
                      icon={informationCircleOutline}
                    ></IonIcon>
                  </IonButtons>
                </IonItem>
                <IonPopover
                  key="Include existing description in composition"
                  translucent={true}
                  animated="true"
                  trigger="advanced-options-select-options-hover-trigger"
                  triggerAction="hover"
                  area-label="Advanced Language and Formatting Options"
                >
                  <IonContent className="ion-padding">
                    <IonText>
                      <p>
                        Explore Advanced Language and Formatting Choices. Choose
                        your preferred categories from the advanced menu
                        options, and they will be displayed below.
                      </p>
                    </IonText>
                    <IonText color="secondary">
                      {" "}
                      <sub>
                        {" "}
                        <IonIcon icon={exitOutline}></IonIcon> click outside box
                        to close
                      </sub>
                    </IonText>
                  </IonContent>
                </IonPopover>
                {/* <Toggles
              onToggleChange={onToggleChange}
              toggles={toggles}
            
            /> */}
              </IonCol>

              {sections.map((section, sectionIndex) => (
                <Section
                  key={"25_" + sectionIndex}
                  handleSelectChange={handleSelectChange}
                  section={section}
                  hiddenElements={hiddenElements}
            
                />
              ))}

              <IonCol ref={contentRef} key={"26"}>
                {/* <Accordion productData={data} key={"accordionOptions"} /> */}
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonModal
            key={"27"}
            cssClass={"fullscreen"}
            keepContentsMounted={true}
            canDismiss={(data, role) => {
              return role === "backdrop"
                ? false
                : role === "gesture"
                ? false
                : true;
            }}
            isOpen={isOpen}
          >
            <IonHeader key={"28"}>
              <IonToolbar>
                <IonTitle>Compose Your Document</IonTitle>
                <IonProgressBar
                  type={
                    composeTextModalLoading ? "indeterminate" : "determinate"
                  }
                ></IonProgressBar>
                <IonButtons slot="end">
                  <IonButton
                    onClick={() => {
                      handleModalClose();
                    }}
                  >
                    Close
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              {/* <IonLoading message={composeTextModalLoadingText} isOpen={composeTextModalLoading }  duration={0} /> */}
              <TokenUsageComponent tokenUsage={user} />
              {/* <Accordion
                setAccordionModalPopUp={setAccordionModalPopUp}
          
                setAccordionLoadingState={setAccordionLoadingState}
              /> */}
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  );
}

function Section({ section, hiddenElements}) {
  const { checkFeatureAccess, handleSelectChange, languageOptions } = useDataProvidersContext();
  const [subscriptionMessage, setSubscriptionMessage] = useState({});

  return (
    <>
      <IonCol size="12" key={"sectionCol section"} size-md="12">
        <IonList>
          {section.IonItems.map((item, itemIndex) => {
            const {
              IonElement,
              category,
              multiple,
              label,
              placeholder,
              values,
              events,
            } = item;
       
const selection = languageOptions.find(options=> options[0]=== category ) 


            const { tag, options } = values;

            return (
              <IonCol
                key={"sectionItem" + label + itemIndex}
                className={!hiddenElements[item.category] ? "ion-hide" : ""}
              >
                <IonItem button={false}>
                  {React.createElement(
                    IonSelect,
                    {
                      className: "ion-text-capitalize ion-text-wrap",
                      id: itemIndex + item.category + itemIndex + label,
                      key: itemIndex + item.category + itemIndex + label,
                      category: category,
                      multiple: multiple,
                      value: (selection && selection[1])|| item.default,

                      label: label,
                      placeholder: placeholder,
                      onIonChange: (e) => handleSelectChange(e, category),
                      "label-placement": "stacked",
                    },

                    options.map((option, index) => {
                      const TagName = tag;
                      const {
                        value,
                        title,
                        subscriptions: minSubscription,
                        definition,
                      } = option;

                      const minSub = minSubscription;
                      if (!minSub.length) {
                        console.log("title", title);
                        console.log("object", option);
                        console.log("minsubscription", minSub);
                        throw new Error("no min subscription:" + minSub);
                      }

                      const check = checkFeatureAccess(minSub);

                      const hasAccess = check.hasAccess;
                      if (!hasAccess && !subscriptionMessage[itemIndex]) {
                        setSubscriptionMessage((previous) => ({
                          ...previous,
                          [itemIndex]: check.some(),
                        }));
                      }

                      return (
                        <IonSelectOption
                          disabled={!hasAccess}
                          key={index + value + title}
                          value={value}
                        >
                          <IonText key={title}>
                            {CamelToKebabCase({ text: title })}
                          </IonText>
                        </IonSelectOption>
                      );
                    })
                  )}

                  <IonLabel
                    className="ion-text-wrap ion-text-capitalize"
                    color="secondary"
                    position="stacked"
                  >
                    {subscriptionMessage[itemIndex]}
                  </IonLabel>
                </IonItem>
              </IonCol>
            );
          })}
        </IonList>
      </IonCol>
    </>
  );
}
