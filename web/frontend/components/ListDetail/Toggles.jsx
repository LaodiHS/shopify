import {
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonToggle,
  IonCheckbox,
  IonChip,
  IonList,
} from "@ionic/react";
import "./styles/SelectionToggles.module.css";
import React, { useState } from "react";

import {useDataProvidersContext} from "../../components"
export function Toggles ({ onToggleChange, toggles, modal }){


  const [toggleState, setToggleState] = useState(toggles);

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
    <>
      <IonRow className="ion-justify-content-end">
        {Object.entries(toggleState).map(([toggleName, toggleValue], index) => {
          return (
            <IonCol key={toggleName} size="12">
              <IonItem lines="none">
                <IonToggle
                  aria-label="Primary toggle"
                  color="success"
                  slot="start"
                  checked={toggleValue}
                  labelPlacement="end"
                  label={toggleName}
                  onIonChange={handleToggleChange(toggleName)}
                >
                  <IonChip key={toggleName + index}
                    color={toggleState[toggleName] ? "success" : "medium"}
                    style={{ fontSize: "12px" }}
                  >
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
    </>
  );
};
