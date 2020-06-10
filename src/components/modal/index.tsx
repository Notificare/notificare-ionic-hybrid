import React, { FC } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/react';

export const Modal: FC<ModalProps> = ({ open, onClose, title, children }) => {
  return (
    <IonModal isOpen={open}>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon name="close" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>{children}</IonContent>
    </IonModal>
  );
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
}
