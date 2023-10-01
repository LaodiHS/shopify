import {
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonImg,
  IonContent,
  IonTextarea,
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
  IonList,
  IonBadge,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonButton,
  IonThumbnail,
  IonPopover,
  IonAvatar,
  IonText,
  IonIcon,
  IonButtons,
} from "@ionic/react";

import {
  informationCircleOutline,
  exitOutline,
  informationCircle,
} from "ionicons/icons";

export function InformationIcon({ label, id, content }) {
  return (
    <>
      <IonItem>
        <IonLabel color="shoe" style={{fontfamily:"Baloo", letterSpacing:"3px"}}>{label}</IonLabel>
        <IonIcon
          size="small"
          color="secondary"
          slot="end"
          aria-label="Tap on include add the existing description in the composition assist"
          id={id}
          icon={informationCircleOutline}
        ></IonIcon>
      </IonItem>
      <IonPopover
        key={id + "Popover"}
        translucent={true}
        animated="true"
        trigger={id}
        triggerAction="hover"
      >
        <IonContent className="ion-padding">
          <IonText>{content}</IonText>
          <br />
          <IonText color="secondary">
            <sub>
            
              <IonIcon icon={exitOutline}></IonIcon> click outside box to close
            </sub>
          </IonText>
        </IonContent>
      </IonPopover>
    </>
  );
}
