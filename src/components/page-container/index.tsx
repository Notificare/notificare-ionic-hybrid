import React, { FC } from 'react';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router';

export const PageContainer: FC<PageContainerProps> = ({ title, children }) => {
  const history = useHistory();
  const canGoBack = history.length > 1;
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{title}</IonTitle>

          <IonButtons slot="start">{canGoBack && <IonBackButton />}</IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>{children}</IonContent>
    </IonPage>
  );
};

interface PageContainerProps {
  title: string;
}
