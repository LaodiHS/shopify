import React from "react";
import {
  IonLabel,
  IonChip,
  IonList,
  IonItem,
  IonRadioGroup,
  IonGrid,
  IonRow,
  IonCol,
  IonRadio,
  IonText,
  IonThumbnail,
} from "@ionic/react";
import { L, useDataProvidersContext } from "../../components";
const shortenText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};
function camelToNormalCase(input) {
  return input.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}
export function SelectedOptions({ productDescOptions, title, legend }) {
  if (legend) {
    legend = legend.reduce((acc, [key, value]) => {
      if (key.includes("variant:")) {
        key = "title:" + key.split(":")[1];
      }
      acc[key] = value;
      return acc;
    }, {});
  } else {
    legend = {};
  }

  const { selectedImageMap } = useDataProvidersContext();
  console.log("legend after", JSON.stringify(legend));
  const renderOption = (key, option, itemIndex) => {
    let optionValue, optionKey;

    if (Array.isArray(option)) {
    } else if (typeof option === "object") {
      for (const [key, value] of Object.entries(option)) {
        if (key === "id" || !value) continue;
        if (key === "title" && value) {
          optionKey = key;
          optionValue = value;
          break;
        } else {
          optionKey = key;
          optionValue = value;
        }
      }
    } else {
      optionKey = key;
      optionValue = option;
    }

    // console.log('color', legend[optionValue])
    return (
      <IonCol size="12" key={itemIndex + key}>
        <IonRow>
          <IonCol size="9">
            <IonList key={itemIndex + key}>
              <IonRadioGroup
                key={itemIndex + key}
                style={{
                  display: "flex",

                  justifyContent: "start",
                }}
              >
                <IonRadio
                  color="success"
                  checked
                  value={
                    { optionKey } +
                    shortenText(camelToNormalCase(optionValue), 30)
                  }
                  key={itemIndex}
                  justify="space-between"
                >
                  <IonText
                    color="success"
                    stye={{ fontSize: "12px" }}
                    disabled={true}
                  >
                    {selectedImageMap && key === "images" && (
                      <IonThumbnail>
                        {" "}
                        <img
                          src={
                            selectedImageMap[optionValue] &&
                            selectedImageMap[optionValue].url
                          }
                        />
                      </IonThumbnail>
                    )}
                    {key !== "images" &&
                      shortenText(camelToNormalCase(optionValue), 30)}
                  </IonText>
                </IonRadio>
              </IonRadioGroup>
            </IonList>
          </IonCol>{" "}
          <IonCol size="3">
            <L r="" c={legend[optionValue] || ""} />{" "}
          </IonCol>
        </IonRow>
      </IonCol>
    );
  };

  return (
    <IonGrid fixed={true}>
      {productDescOptions.length > 0 && (
        <IonItem>
          <IonLabel>{title}: </IonLabel>
        </IonItem>
      )}
      <IonRow className="ion-padding">
        {productDescOptions.map(([key, item], optionIndex) => {
          key = key.replace(/variant_/g, "");
          key = key.replace(/option_/g, "");
          return (
            <React.Fragment key={optionIndex}>
              <IonCol>
                <IonText color="secondary">{key}</IonText>
                <IonRow>
                  {item.map((option, itemIndex) =>
                    renderOption(key, option, itemIndex)
                  )}
                </IonRow>
              </IonCol>
            </React.Fragment>
          );
        })}
      </IonRow>
    </IonGrid>
  );
}
