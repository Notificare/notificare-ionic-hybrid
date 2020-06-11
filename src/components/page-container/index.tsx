import React, { FC, useEffect, useState } from 'react';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

export const PageContainer: FC<PageContainerProps> = ({ title, noHeader, children }) => {
  const [className, setClassName] = useState<string>();
  useEffect(() => setClassName('ion-page-upon-mounting'), []);

  return (
    <IonPage className={className}>
      {!Boolean(noHeader) && (
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>{title}</IonTitle>

            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      )}
      <IonContent>{children}</IonContent>
    </IonPage>
  );
};

interface PageContainerProps {
  title?: string;
  noHeader?: boolean;
}
