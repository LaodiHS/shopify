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
  IonButton,
} from "@ionic/react";
import "./styles/SelectionToggles.module.css";
import React, { useState, useEffect } from "react";
import { PaidFeature, useDataProvidersContext } from "../../components";
import { Context } from "../../utilities/data-context";

export function PopUpCheckBoxes({ modal, toggleOptionsDrawer }) {
  const checkBoxes = new Set();
  const { openMenu, closeMenu } = toggleOptionsDrawer;

  const [checkBoxSelected, setCheckBoxSelected] = useState({
    description: false,
    post: false,
    article: false,
    advanced: false,
  });

  const handleCheckBoxSelection = (checkBoxName) => (event) => {
    if (event.target.checked) {
      checkBoxes.add(checkBoxName);
    } else {
      checkBoxes.delete(checkBoxName);
    }

    setCheckBoxSelected((previous) => ({
      ...previous,
      [checkBoxName]: event.target.checked,
    }));

    if (checkBoxName !== "advanced" && event.target.checked) {
      modal(true);
    }

    if (checkBoxName === "advanced") {
      if (event.target.checked) {
        openMenu();
      } else if (!event.target.checked) {
        closeMenu();
      }
    }
  };

  Context.listen("CheckBoxSelection", ({ accordionSelection }, route) => {
    console.log("accordionSelection", accordionSelection);
    checkBoxes.clear();

    setCheckBoxSelected({});
  });

  useEffect(() => {
    Context.sendData(
      "AccordionOptions",
      {
        checkBoxes: checkBoxSelected,
        options: [],
      },
      "useeffects toggles"
    );
  }, [checkBoxSelected]);

  return (
    <>
      <IonRow className="ion-align-items-end ion-justify-content-end">
        <IonCol size="12">
          <IonList inset={true}>
            <IonItem>
              <IonCheckbox
                onIonChange={handleCheckBoxSelection("description")}
                justify="end"
                checked={checkBoxSelected["description"]}
                labelPlacement="start"
              >
                Description
              </IonCheckbox>
            </IonItem>

            <IonItem>
              <IonCheckbox
                onIonChange={handleCheckBoxSelection("article")}
                justify="end"
                checked={checkBoxSelected["article"]}
                labelPlacement="start"
              >
                Article
              </IonCheckbox>
            </IonItem>

            <IonItem>
              <IonCheckbox
                onIonChange={handleCheckBoxSelection("post")}
                justify="end"
                checked={checkBoxSelected["post"]}
                labelPlacement="start"
              >
                Post
              </IonCheckbox>
            </IonItem>
          </IonList>
        </IonCol>
      </IonRow>
    </>
  );
}
