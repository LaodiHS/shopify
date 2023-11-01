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
  chevronBack,
  informationCircleOutline,
  exitOutline,
} from "ionicons/icons";

import { SharedData } from "../utilities/data-context.js";
import {
  useProductDataContext,
  CamelToKebabCase,
  useDataProvidersContext,
  TokenUsageComponent,
  IonicHeaderComponent,
} from "../components";
import { audienceModel } from "../utilities/language-model";

import { ProductDetails } from "./ListDetail/ProductDetails";
import { Toggles } from "./ListDetail/Toggles";

// import { useUniqueKeys, UniqueKeysProvider } from "../utilities/utility-methods";

const toggles = {
  // language:false,
  tone: true,
  introduction: true,
  focus: false,
  evocative: false,
  narrative: false,
  rhetorical: false,
  // socialMedia: false,
  engagingFormats: true,
  valuePropositionFormats: false,
};

export function ListDetailComponent({ animationRef }) {
  const menuRef = useRef(null);
  const contentRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hiddenElements, setHiddenElements] = useState(toggles);
  const [composeTextModalLoading, setComposeTextModalLoading] = useState(false);
  const { sections } = audienceModel;
  const {
    productData,
    subscriptions,
    currentSession,
    user,
    lockAllTasks,
    handleSelectChange,
    DataProviderNavigate,
    allAssets,
  } = useProductDataContext();

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
        <IonicHeaderComponent centerText={"Advanced"} />

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
        <IonicHeaderComponent
          centerText="Tailor Selections"
          left={
            <IonButtons key={"12"} onClick={navigateBack} slot="start">
              <IonButton key={"13"} disabled={lockAllTasks} color="neural">
                <IonIcon key={"14"} icon={chevronBack} />
              </IonButton>
            </IonButtons>
          }
          right={
            <IonButton
              disabled={true}
              fill="clear"
              size="small"
              color="neural"
              slot="end"
            >
              <IonIcon slot="icon-only" icon={allAssets.pencilCase} />
            </IonButton>
          }
        />

        <IonContent>
    
  
          <IonGrid key={"19"} fixed={true}>
            <IonRow key={"20"}>
                <IonCol size="12" className="ion-text-center ion-padding">
                  <IonText style={{fontFamily:"Baloo, sans-serif"}} color="shoe">
                  Excited to get started with the AI-powered Neural Nectar! Let's prioritize the specific features of your product before diving into the workstation!</IonText>
          </IonCol>
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
                      color="primary"
                      area-label="Advanced Tone Options"
                    >
                      Advanced Tone Options
                    </IonButton>
                    <IonButton
                      onClick={() => openMenu()}
                      fill="clear"
                      color="neural"
                      size="large"
                    >
                      <IonIcon slot="icon-only" icon={allAssets.microphone}></IonIcon>
                    </IonButton>

                    <IonIcon
                      size="small"
                      color="secondary"
                      slot="end"
                      aria-label="Include existing description in composition"
                      id="acacia-options-select-options-hover-trigger"
                      icon={informationCircleOutline}
                    ></IonIcon>
                  </IonButtons>
                </IonItem>
                <IonPopover
                  key="Include existing description in composition"
                  translucent={true}
                  animated="true"
                  trigger="acacia-options-select-options-hover-trigger"
                  triggerAction="hover"
                  area-label="Advanced Language and Formatting Options"
                >
                  <IonContent className="ion-padding">
                    <IonText>
                      <p>
                        Explore Advanced Language and Formatting Choices. Choose
                        your preferred categories from the acacia menu options,
                        and they will be displayed below.
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
            <IonicHeaderComponent
              centerText={"Compose Your Document"}
              right={
                <>
                  <IonProgressBar
                    type={
                      composeTextModalLoading ? "indeterminate" : "determinate"
                    }
                  ></IonProgressBar>
                  <IonButtons slot="end">
                    <IonButton
                      color="neural"
                      onClick={() => {
                        handleModalClose();
                      }}
                    >
                      Close
                    </IonButton>
                  </IonButtons>
                </>
              }
            />

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

function Section({ section, hiddenElements }) {
  const { checkFeatureAccess, handleSelectChange, languageOptions } =
    useDataProvidersContext();
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

            const selection = languageOptions.find(
              (options) => options[0] === category
            );

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
                      value: (selection && selection[1]) || item.default,

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
