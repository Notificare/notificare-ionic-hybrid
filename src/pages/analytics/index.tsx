import React, { FC, useState } from 'react';
import { IonInput, IonItem, IonLabel, IonSpinner } from '@ionic/react';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';

export const Analytics: FC = () => {
  const [loading, setLoading] = useState(false);

  const [event, setEvent] = useState('');

  return (
    <PageContainer title="Analytics">
      {loading && (
        <Center>
          <IonSpinner />
        </Center>
      )}

      <IonItem>
        <IonLabel position="floating">Event name</IonLabel>
        <IonInput value={event} onIonChange={(e) => setEvent(e.detail.value!)} />
      </IonItem>
    </PageContainer>
  );
};
