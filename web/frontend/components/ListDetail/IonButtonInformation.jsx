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
  IonToolbar,
  IonContent,
  IonTextarea,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
  IonItemDivider,
  IonBadge,
  IonModal,
  IonAlert,
  useIonToast,
  IonProgressBar,
  IonIcon,
  IonPopover,
  IonText,
  useIonPopover,
} from "@ionic/react";
import {
  informationCircleOutline,
  exitOutline,
  informationCircle,
} from "ionicons/icons";

export function IonButtonInformation({ ButtonName,  hoverId,  PopoverContent, disabledButton, clickHandler, clickArgs}) {
  return (
    <IonList>
      <IonButton
      size="small"
      
      
        fill="clear"
        disabled={disabledButton}
        onClick={() => clickHandler(...clickArgs)}
      >
        {ButtonName}
      </IonButton>
      <IonIcon
        id={hoverId}
        size="small"
        slot="end"
        color="secondary"
        aria-label="Include existing description in composition"
        icon={informationCircleOutline}
      ></IonIcon>

      <IonPopover
        key={hoverId}
        translucent={true}
        animated="true"
        // onReference={(e) => hoverPresentTrigger(e)}
        // ref={e => hoverTrigger(e)}
        // onWillPresent={e=> hoverTrigger(e)}
        // present={e=> hoverPresentTrigger(e)}
        trigger={hoverId}
        triggerAction="hover"
        //ionPopoverWillPresent={(e) => console.log("i will pop")}
      >
        <IonContent className="ion-padding">
          <IonText>
            <p>{PopoverContent}</p>
          </IonText>
          <IonText color="secondary">
            <sub>
              <IonIcon icon={exitOutline}></IonIcon> click outside box to close
            </sub>
          </IonText>
        </IonContent>
      </IonPopover>
    </IonList>
  );
}
