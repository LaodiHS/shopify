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
import React, { useState } from "react";
import { Context } from "../../utilities/data-context";
const checkBoxes = new Set();
export const Toggles = ({
  onToggleChange,
  toggles,
  handleAccordionSelections,
}) => {
  const [toggleState, setToggleState] = useState(toggles);

  const [checkBoxSelected, setCheckBoxSelected] = useState([]);

  const handleCheckBoxSelection = (checkBoxName) => (event) => {
    if (event.target.checked) {
      checkBoxes.add(checkBoxName);
    } else {
      checkBoxes.delete(checkBoxName);
    }
    Context.setData("AccordionOptions", {checkBoxes: [...checkBoxes], options:[] });
    
    setCheckBoxSelected([...checkBoxes]);

  };

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
          <IonItem>
            <IonGrid>
              <IonRow>
                <IonCol size="12" size-md="3">
                  {/* <IonLabel> */}
                  Apply Selections To:{" "}

                </IonCol>
                <IonCol size="12" size-md="3">
                  <IonCheckbox
                    onIonChange={handleCheckBoxSelection("description")}
                    justify="start"
                    labelPlacement="end"
                  >
                    Description
                  </IonCheckbox>
                </IonCol>
               <IonCol size="12" size-md="3">
                   <IonCheckbox
                    onIonChange={handleCheckBoxSelection("article")}
                    justify="start"
                    labelPlacement="end"
                  >
                    Article
                  </IonCheckbox>
                </IonCol>
                     
               <IonCol size="12" size-md="3">
                   <IonCheckbox
                    onIonChange={handleCheckBoxSelection("post")}
                    justify="start"
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
                  <IonChip style={{fontSize:"12px"}}>{toggleName
                    .replace(/([A-Z])/g, " $1")
                    .toLowerCase()
                    .trim()}</IonChip>
                </IonToggle>
              </IonItem>
            </IonCol>
          );
        })}
      </IonRow>
    </IonGrid>
  );
};
