import React, { FC, useState } from 'react';
import { Notificare } from '@ionic-native/notificare';
import { IonButton, IonImg, IonInput, IonItem, IonLabel, IonSpinner } from '@ionic/react';
import HeaderImage from '../../assets/images/profits.png';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { showAlertDialog } from '../../lib/ui';

export const Analytics: FC = () => {
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState('');

  const onTrackEvent = async () => {
    try {
      setLoading(true);

      await Notificare.logCustomEvent(event, {});

      await showAlertDialog(
        'Custom event registered successfully. Please check your dashboard to see the results for this event name.',
      );

      setEvent('');
    } catch (e) {
      await showAlertDialog(e);
    } finally {
      setLoading(false);
    }
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
