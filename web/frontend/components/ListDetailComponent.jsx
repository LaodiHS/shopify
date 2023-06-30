import React, { useState, use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IonItem,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonButtons,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonToolbar,
  IonContent,
  IonTextarea,
  IonAccordion,
  IonAccordionGroup,
  IonItemDivider,
  IonIcon,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import { arrowBack } from "ionicons/icons";
import { Accordion } from "./ListDetail/Accordion";
import { ProductDetails } from "./ListDetail/ProductDetails";
import { Toggles } from "./ListDetail/Toggles";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import { audienceModel } from "../utilities/language-model";
import { Context } from "../utilities/data-context.js"
import { History } from '../utilities/store';
let options = {};
let includeProductDetails = {}
let optionRequirements = {};
export function ListDetailComponent() {
  const location = useLocation();

  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const { pageTitle, sections } = audienceModel;

  const toggles = {
    tone: true,
    introduction: true,
    features: true,
    evocative: true,
    narrative: false,
    rhetorical: false,
    audience: false,
  };
  const [hiddenElements, setHiddenElements] = useState(toggles);

  const handleToggleChange = (selectElementId) => {
    setHiddenElements((prevHiddenElements) => ({
      ...prevHiddenElements,
      [selectElementId]: toggles[selectElementId],
    }));
  };

  const [selectedOption, setSelectedOption] = useState("");
  const [generativeAiResults, setGenerativeAiResults] = useState();
  const [aiContent, setAiContent] = useState();

  async function sendOptions(options) {
    try {
      const response = await fetch("/api/ai/options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          options,
        }),
      });

      const data = await response.json();
      //console.log('data', data);
      return data;

      setAiContent(data);
    } catch (error) {
      console.error(error);
    }
  }

  // const variables = {
  //   product: "trendy leather jacket called Polo",
  //   features: "design elements",
  //   quality: "premium",
  //   rhetoricalDevice: "simile",
  //   appeal: "stylish and sophisticated aura",
  //   punType: "fashion-related pun",
  //   topic: "fashion",
  //   category: "jackets",
  // };

  const handleRequest = async ({ requestType }) => {
    // const response = await sendOptions(options);
    console.log("requestType", requestType);
    const requestObject = { requestType, options };

    console.log("requestWithOptions", requestObject);
    // setGenerativeAiResults();
    // setAiContent({
    //   description: { text: "some description", hashTags: "hash" },
    //   article: { text: "some article", hashTags: "hashtags" },
    //   post: { text: "some post" },
    // });
  };



  const handleIncludeChange = (event, category) => {
    if (Object.values(category).includes("delete")) {
      const deleteKey = Object.keys(category).find(
        (key) => category[key] === "delete"
      );
      delete includeProductDetails[deleteKey];
    } else {

      Object.entries(category).forEach(([key, value]) => {
        if (value) {
          includeProductDetails[key] = value;
        } else {
          delete includeProductDetails[key];
        }
      });
    }

    if (!Object.entries(includeProductDetails).length) {

      delete options['included-product-details']
   
    } else {

      options['included-product-details'] = includeProductDetails
    }
    console.log("options", options);
    Context.setData("AudienceOptions", { options })
  };

  const handleSelectChange = async (event, category) => {
    optionRequirements[category] = optionRequirements[category] || {};

    if (!event?.detail?.value || event?.detail?.value === "none") {
      delete optionRequirements[category]
    } else {
      optionRequirements[category] = event.detail.value;
    }

    if (!Object.entries(optionRequirements).length) {

      delete options["option-requirements"] 
    } else {

      options["option-requirements"] = optionRequirements
    }
  
    Context.setData("AudienceOptions", { options })

  };

  const navigateBack = () => {
    navigate("/");
  };



  const data = JSON.parse(location.state);
  useEffect(() => {

    console.log('data', data);
    if (!data) {

      navigate("/")
    }



  }, [data, navigate])






  return (
    <React.Fragment key="ListDetailComponent">
      <div
        className="ion-padding"
        style={{ display: "flex", justifyContent: "flex-start" }}
      >
        <IonButton
          fill="clear"
          className="ion-padding-end"
          onClick={navigateBack}
        // disabled={currentPage === 1}
        >
          <IonIcon slot="start" icon={arrowBack}></IonIcon>
          Back
        </IonButton>
      </div>
      <ProductDetails
        key="productDetails"
        handleIncludeChange={handleIncludeChange}
        data={data}
      />

      <Toggles
        onToggleChange={handleToggleChange}
        toggles={toggles}

      />
      {sections.map((section, sectionIndex) => (
        <IonList key={sectionIndex}>
          <IonItem>
            <h2>{section.sectionTitle}</h2>
          </IonItem>
          <IonGrid>
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

              return (
                <IonRow key={category}>
                  <IonCol size="12" size-md="12">
                    <IonItem
                      class={
                        !hiddenElements[item.category] ? "ion-hide" : "ion-show"
                      }
                    >

                      {React.createElement(
                        IonSelect,
                        {
                          key: itemIndex + item.category,
                          category: category,
                          multiple: multiple,
                          value: item.default,
                          label: label,
                          placeholder: placeholder,
                          onIonChange: (e) => handleSelectChange(e, category),
                          "label-placement": "stacked",
                        },

                        options.map((option, index) => {
                          const TagName = tag;
                          const { value, title } = option;

                          return (
                            <IonSelectOption key={index} value={value}>
                              {title}
                            </IonSelectOption>
                          );
                        })
                      )}
                    </IonItem>
                  </IonCol>
                </IonRow>
              );
            })}
            <Accordion
              handleRequest={handleRequest}
              aiContent={aiContent}
              productData={data}
              key={"accordion"}

            />
          </IonGrid>
        </IonList>
      ))}
    </React.Fragment>
  );
}
