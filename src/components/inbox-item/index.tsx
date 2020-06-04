import React, { FC } from 'react';
import { IonImg, IonItem, IonLabel, IonThumbnail } from '@ionic/react';

export const InboxItem: FC<InboxItemProps> = ({ item }) => {
  return (
    <IonItem button>
      <IonThumbnail slot="start">
        <IonImg src="https://placekitten.com/g/200/300" />
      </IonThumbnail>
      <IonLabel>
        {item.title}
        <p>{item.message}</p>
        <p className="ion-text-end">{item.time}</p>
      </IonLabel>
    </IonItem>
  );
};

interface InboxItemProps {
  item: NotificareInboxItem;
}

interface NotificareInboxItem {
  title: string;
  message: string;
  time: string;
  attachment?: object;
  open: boolean;
}
