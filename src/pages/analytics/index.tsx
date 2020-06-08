import React, { FC, useState } from 'react';
import { IonImg, IonInput, IonItem, IonLabel, IonSpinner, IonButton } from '@ionic/react';
import HeaderImage from '../../assets/images/profits.png';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';

export const Analytics: FC = () => {
  const [loading, setLoading] = useState(false);

  const [event, setEvent] = useState('');

  const onTrackEvent = async () => {
    try {
    } catch (e) {}
  };

  return (
    <PageContainer title="Analytics">
      {loading && (
        <Center>
          <IonSpinner />
        </Center>
      )}

      <IonItem lines="none">
        <IonImg src={HeaderImage} className="header-image ion-padding" />
      </IonItem>

      <IonItem>
        <IonLabel position="floating">Event name</IonLabel>
        <IonInput value={event} onIonChange={(e) => setEvent(e.detail.value!)} />
      </IonItem>

      <IonButton expand="block" className="ion-padding" onClick={onTrackEvent}>
        Track event
      </IonButton>
    </PageContainer>
  );
};
