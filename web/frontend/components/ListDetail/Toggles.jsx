import {
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonToggle,
  IonCheckbox,
  IonChip,
} from "@ionic/react";
import "./styles/SelectionToggles.module.css";
import React, { useState, useEffect } from "react";
import { Context } from "../../utilities/data-context";

export const Toggles = ({ onToggleChange, toggles }) => {
  const checkBoxes = new Set();
  const [toggleState, setToggleState] = useState(toggles);

  const [checkBoxSelected, setCheckBoxSelected] = useState({
    description: false,
    post: false,
    article: false,
  });

  const handleCheckBoxSelection = (checkBoxName) => (event) => {
    if (event.target.checked) {
      checkBoxes.add(checkBoxName);
    } else {
      checkBoxes.delete(checkBoxName);
    }

    setCheckBoxSelected(
      (previous) => ({
        ...previous,
        [checkBoxName]: event.target.checked,
      })
    );
  };
  
  useEffect(() => {
  
    Context.sendData("AccordionOptions", {
      checkBoxes: checkBoxSelected,
      options: [],
    }, 'useeffects toggles');


  }, [checkBoxSelected]);

  const handleToggleChange = (toggleName) => (event) => {
    const { checked } = event.target;
    setToggleState((prevCheckedElement) => ({
      ...prevCheckedElement,
      [toggleName]: checked,
    }));
    toggles[toggleName] = checked;

  
    onToggleChange(toggleName);
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12">
          <IonItem >
              <div> Apply To:{" "}</div>
            <IonGrid>
              <IonRow class="ion-justify-content-end">
                <IonCol size="12" size-md="3">
               
               
                </IonCol>
                <IonCol size="12" size-md="3">
                  <IonCheckbox
                    onIonChange={handleCheckBoxSelection("description")}
                    justify="start"
                    checked={checkBoxSelected["description"]}
                    labelPlacement="end"
                  >
                    Description
                  </IonCheckbox>
                </IonCol>
                <IonCol size="12" size-md="3">
                  <IonCheckbox
                    onIonChange={handleCheckBoxSelection("article")}
                    justify="start"
                    checked={checkBoxSelected["article"]}
                    labelPlacement="end"
                  >
                    Article
                  </IonCheckbox>
                </IonCol>

                <IonCol size="12" size-md="3">
                  <IonCheckbox
                    onIonChange={handleCheckBoxSelection("post")}
                    justify="start"
                    checked={checkBoxSelected["post"]}
                    labelPlacement="end"
                  >
                    Post
                  </IonCheckbox>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-end">
        {Object.entries(toggleState).map(([toggleName, toggleValue]) => {
          return (
            <IonCol key={toggleName} size="12" size-md="6" size-lg="3">
              <IonItem lines="none">
                <IonToggle
                  aria-label="Primary toggle"
                  color="primary"
                  slot="end"
                  checked={toggleValue}
                  label={toggleName}
                  onIonChange={handleToggleChange(toggleName)}
                >
                  <IonChip style={{ fontSize: "12px" }}>
                    {toggleName
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()
                      .trim()}
                  </IonChip>
                </IonToggle>
              </IonItem>
            </IonCol>
          );
        })}
      </IonRow>
    </IonGrid>
  );
};
