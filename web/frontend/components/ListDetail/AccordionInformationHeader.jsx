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
} from "ionicons/icons";


export function AccordionInformationHeader({ lock, accordionName, boxName, note, beehive }) {
  
  return (
    <IonItem slot="header" color="light">
      <IonLabel size="small" slot="">{accordionName}</IonLabel>
      <IonIcon slot="start"
      size="small"
      color="secondary"
      aria-label="Include existing description in composition"
      id={boxName + accordionName}
      icon={informationCircleOutline} />
   
      { lock === false  && (
        <IonIcon
        slot="end"
        size=""
        id={`${boxName + accordionName}lock`}
        icon={beehive}
        >   {lock}

        </IonIcon>
      )

      }
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
              <IonIcon icon={exitOutline} /> click outside box to close
            </sub>
          </IonText>
        </IonContent>
      </IonPopover>
    </IonItem>
  );
}
