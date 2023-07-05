import React, { useState } from "react";
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
  IonTitle,
  IonBadge,
} from "@ionic/react";
import { Context } from "../../utilities/data-context";

const shortenText = (text) =>
  text && text.length > 20 ? text.substring(0, 30) + "..." : text;
export const SelectedOptions = ({descDisplayOptions}) => {
 

  


  return (
    <>
      {descDisplayOptions.map(([key, value], optionIndex) => {
        return (
          <div className="option" key={optionIndex}>
            <IonLabel className="option-label"></IonLabel>
            <div className="option-values">
              {value.map((item, itemIndex) => {
                if (typeof item === "object") {
                  return (
                    <IonBadge
                      color="tertiary"
                      key={itemIndex}
                      className="option-value"
                    >
                      {item.key}: {shortenText(item.value)}
                    </IonBadge>
                  );
                } else {
                  return (
                    <IonBadge
                      color="tertiary"
                      key={itemIndex}
                      className="option-value"
                    >
                      {key}: {shortenText(item)}
                    </IonBadge>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};
