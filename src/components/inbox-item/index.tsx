import React, { FC } from 'react';
import { NotificareInboxItem } from '@ionic-native/notificare';
import { IonImg, IonItem, IonLabel, IonThumbnail } from '@ionic/react';
import TimeAgo from 'react-timeago';
import NoAttachmentImage from '../../assets/images/no_attachment.png';
import './index.scss';

export const InboxItem: FC<InboxItemProps> = ({ item, selected, onClick }) => {
  return (
    <IonItem button className={selected ? 'selected' : undefined} onClick={onClick}>
      <IonThumbnail slot="start">
        <IonImg src={item.attachment?.uri ? item.attachment.uri : NoAttachmentImage} />
      </IonThumbnail>
      <IonLabel>
        {item.title}
        <p>{item.message}</p>
        <p className="ion-text-end">
          <small>
            <TimeAgo date={item.time} />
          </small>
        </p>
      </IonLabel>
    </IonItem>
  );
};

interface InboxItemProps {
  item: NotificareInboxItem;
  selected: boolean;
  onClick: () => void;
}
