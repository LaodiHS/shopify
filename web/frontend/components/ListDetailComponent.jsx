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
} from "@ionic/react";
import {
  chatbubbleOutline,
  chevronBack,
  documentTextOutline,
  newspaperOutline,
  informationCircleOutline,
  exitOutline,
} from "ionicons/icons";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import {
  Context,
  SharedData,
} from "../utilities/data-context.js";
import {
  useProductDataContext,
  PaidFeature,
  CamelToKebabCase,
  useDataProvidersContext,
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
  socialMedia: false,
  engagingFormats: true,
  valuePropositionFormats: false,
};
const modalStyle = {
  "--ion-modal-min-width": 900 >= 768 ? "100vw" : "auto", // Set the modal width to 100vw on desktop layouts
  "--ion-modal-min-height": "100vh", // Set the modal height to 100vh
  "--ion-modal-max-width": "100vw",
  "--ion-modal-max-height": "100vh",
};

export function ListDetailComponent({}) {  
  const {subscriptions,currentSession, contextualOptions, setContextualOptions } = useDataProvidersContext();

  const { productData } = useProductDataContext();
  
  
  
  
  if (!subscriptions) {
  
  return <div> no subscription found</div>
  
    throw new Error(
      "no subscriptions prop on ListDetailComponent: ",
      subscriptions
    );
  }
  if (!currentSession) {
    throw new Error("no session prop on ListDetailComponent: ", currentSession);
  }

  const fetch = useAuthenticatedFetch();
  const location = useLocation();
  const navigate = useNavigate();
  // const [productData, setData] = useState(null);
  const [composeTextModalLoading, setComposeTextModalLoading] = useState(false);
  const [composeTextModalLoadingText, setComposeTextModalLoadingText] =
    useState();

  

  useEffect(async () => {
    console.log("History", location);
    return () => {
      console.log("clearing the sharedData");
      SharedData.clearSharedData();
    };
  }, [location.state, navigate, subscriptions]);

  const { sections } = audienceModel;

  const [hiddenElements, setHiddenElements] = useState(toggles);


  console.log("setContextualOptions", setContextualOptions);
  const [isOpen, setIsOpen] = useState(false);

  function onToggleChange(selectElementId) {
    setHiddenElements((prevHiddenElements) => ({
      ...prevHiddenElements,
      [selectElementId]: toggles[selectElementId],
    }));
  }

  const handleSelectChange = async (event, category) => {
    console.log("SharedData.serverOptions: 1", SharedData.serverOptions);
    const newSelectedOptions = {
      ...contextualOptions,
      [category]: event.detail.value,
    };
    setContextualOptions(newSelectedOptions);

    SharedData.optionRequirements[category] =
      SharedData.optionRequirements[category] || {};

    if (!event?.detail?.value || event?.detail?.value === "none") {
      delete SharedData.optionRequirements[category];
      SharedData.optionRequirements = updateObject(
        SharedData.optionRequirements
      );
      setContextualOptions(SharedData.optionRequirements);
    } else {
      SharedData.optionRequirements[category] = event.detail.value;
      SharedData.optionRequirements = updateObject(
        SharedData.optionRequirements
      );
      setContextualOptions(SharedData.optionRequirements);
    }

    if (!Object.entries(SharedData.optionRequirements).length) {
      delete SharedData.serverOptions["option-requirements"];
    } else {
      SharedData.serverOptions["option-requirements"] =
        SharedData.optionRequirements;
    }
    const serverOptions = SharedData.serverOptions;
    Context.sendData(
      "AudienceOptions",
      {
        serverOptions,
      },
      "handleSelectChange"
    );
  };

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
    navigate("/");
  };

  // console.log("ListDetailComponentData", ListDetailComponent);

  const router = useIonRouter();

  const menuRef = useRef(null);
  const contentRef = useRef(null);

  function scrollToBottom() {
    // setTimeout(() => {

    contentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });

    // },500)
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
      <IonPage key={"9"} id="main-content">
        <IonHeader key={"10"} translucent={true}>
          <IonToolbar key={"11"}>
            <IonButtons key={"12"} onClick={navigateBack} slot="start">
              <IonButton key={"13"}>
                <IonIcon key={"14"} icon={chevronBack} />
              </IonButton>
            </IonButtons>
            <IonTitle key={"15"}>Product Detail</IonTitle>
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
                  <IonButton
                    onClick={() => openMenu()}
                    slot="end"
                    fill="clear"
                    expand="block"
                    area-label="Advanced Language and Formatting Options"
                  >
                    Advanced Options
                  </IonButton>

                  <IonIcon
                    size="small"
                    color="secondary"
                    slot="end"
                    aria-label="Include existing description in composition"
                    id="advanced-options-select-options-hover-trigger"
                    icon={informationCircleOutline}
                  ></IonIcon>
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
                  selectedOptions={contextualOptions}
             
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
              <Accordion
                setAccordionModalPopUp={setAccordionModalPopUp}
                productData={productData}
                setAccordionLoadingState={setAccordionLoadingState}
              />
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  );
}

function Section({
  handleSelectChange,
  section,
  hiddenElements,
  selectedOptions,

}) {
  const {checkFeatureAccess } = useDataProvidersContext();
  const [subscriptionMessage, setSubscriptionMessage] = useState({});
  const [popoverState, setPopoverState] = useState({
    isOpen: false,
    title: "",
  });

  const handlePopoverOpen = (event, definition) => {
    console.log("hit popover");
    event.persist();
    setPopoverState({ isOpen: true, definition });
  };

  const handlePopoverClose = () => {
    setPopoverState({ isOpen: false, definition: "" });
  };

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

            const { tag, options } = values;

            const PopoverContent = () => (
              <IonContent className="ion-padding">Hello World!</IonContent>
            );

            const [presentPopover, dismissPopover] = useIonPopover(
              PopoverContent, // Your popover content component
              {
                showBackdrop: false,
                backdropDismiss: false,
                cssClass: "my-popover-class",
                animated: true,
                mode: "ios",
                event: "none", // Disable default event handling
              }
            );

            const handleTriggerClick = (e) => {
              const triggerElement = e.target;
              if (triggerElement) {
                presentPopover({
                  event: {
                    target: triggerElement,
                    clientX: 0,
                    clientY: 0,
                  },
                });
              }
            };
            const handleTriggerMouseLeave = () => {
              dismissPopover();
            };

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
                      value: selectedOptions[category] || item.default,
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
                        console.log("title",title)
                        console.log('object',option)
                        console.log('minsubscription',minSub)
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
