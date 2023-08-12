import {
  IonLabel,
  IonIcon,
  IonPopover,
  IonContent,
  IonText,
  IonItem,
} from "@ionic/react";
import {
  informationCircleOutline,
  exitOutline,
  informationCircle,
} from "ionicons/icons";

export function AccordionInformationHeader({ accordionName, boxName, note }) {
  return (
    <IonItem slot="header" color="light">
      <IonLabel size="small" slot="">{accordionName}</IonLabel>
      <IonIcon
        slot="start"
        size="small"
        color="secondary"
        aria-label="Include existing description in composition"
        id={boxName + accordionName}
        icon={informationCircleOutline}
      ></IonIcon>
      <IonPopover
        key={"Include existing description in composition"}
        translucent={true}
        animated="true"
        trigger={boxName + accordionName}
        triggerAction="hover"
        
      >
        <IonContent className="ion-padding">
          <IonText>
            <p>{note}</p>
          </IonText>
          <IonText color="secondary">
            <sub>
              <IonIcon icon={exitOutline}></IonIcon> click outside box to close
            </sub>
          </IonText>
        </IonContent>
      </IonPopover>
    </IonItem>
  );
}
