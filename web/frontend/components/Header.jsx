import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';

export function Header ({ tokenUsage }) {
  const [usage, setUsage] = useState(tokenUsage);

  useEffect(() => {
    // Update the usage whenever tokenUsage changes
    setUsage(tokenUsage);
  }, [tokenUsage]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Token Usage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="ion-padding">
          <IonRow>
            <IonCol size="6" offset="3">
              <h2>Current Token Usage</h2>
              <p>Total Tokens Used: {usage.totalTokens}</p>
              <p>Remaining Tokens: {usage.remainingTokens}</p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};