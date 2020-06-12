import React, { FC, ReactElement, useEffect, useState } from 'react';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

export const PageContainer: FC<PageContainerProps> = ({ title, noHeader, rightButtons, children }) => {
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

            {rightButtons && <IonButtons slot="end">{rightButtons}</IonButtons>}
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
  rightButtons?: ReactElement;
}
