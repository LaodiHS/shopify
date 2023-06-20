import React from "react";

import  {useNavigate}  from "react-router-dom";
import {
  IonItem,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
} from "@ionic/react";


 
function parseHTML(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.innerText;
}

export function ListComponent({ data }) {
 const { pageTitle, sections } = data;
 const navigate = useNavigate();

  const handleButtonClick = (item) => {
    console.log('---->', item)
    navigate("/productdetail"
      , { state: JSON.stringify(item) }
    );
  };

  return (
    <IonList>
      <IonItem>
        <h1>{pageTitle}</h1>
      </IonItem>
      {sections.map((item, index) => (
        <IonItem key={index}>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                  {item.image && item.image.src && (
                    <img
                      src={item.image.src}
                      alt="Product"
                      style={{ marginRight: "10px" }}
                    />
                  )}
                  <IonInput
                    label={item.title}
                    labelPlacement="stacked"
                    value={ item.body_html ? parseHTML(item.body_html):"no description"}
                    disabled={true}
                    className="beige-label"
                  ></IonInput>
               
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="6" offset="6">
                <IonButton
                  expand="full"
                  onClick={()=> handleButtonClick(item)}
               
                >
                  detail
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      ))}
    </IonList>
  );
}
