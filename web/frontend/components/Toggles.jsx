import {
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonToggle,
} from "@ionic/react";
import React, { useState } from "react";

export const Toggles = ({onToggleChange , toggles}) => {
    console.log('toggles', toggles);

   const toggleTags =  toggles.reduce((acc, [name,value]) => {
        acc[name] = value;
        return acc;
    }, {})
    
//   const [toggleState, setToggleState] = useState({
//     toggle1: false,
//     toggle2: false,
//     toggle3: false,
//     toggle4: false,
//     // Add more toggles as needed
//   });

     const [toggleState, setToggleState] = useState(toggleTags);
    
    
    
  const handleToggleChange = (toggleName) => (event) => {
    setToggleState((prevState) => ({
      ...prevState,
      [toggleName]: event.target.checked,
    }));

   
        onToggleChange(toggleName);
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12">
          <IonItem>
            <IonLabel>Title</IonLabel>
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow >
        {Object.entries(toggleState).map(([toggleName, toggleValue]) => (
          <IonCol key={toggleName} size="12" size-md="6" size-lg="3">
            <IonItem>
              <IonLabel>{toggleName}</IonLabel>
              <IonToggle
                slot="end"
                checked={toggleValue}
                onIonChange={handleToggleChange(toggleName)}
              />
            </IonItem>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  );
};
