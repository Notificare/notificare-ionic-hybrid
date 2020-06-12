import React, { FC, useEffect, useRef } from 'react';
import { NotificareInboxItem } from '@ionic-native/notificare';
import { createGesture, IonImg, IonItem, IonLabel, IonThumbnail } from '@ionic/react';
import TimeAgo from 'react-timeago';
import NoAttachmentImage from '../../assets/images/no_attachment.png';
import './index.scss';

export const InboxItem: FC<InboxItemProps> = ({ item, selected, onClick, onLongPress }) => {
  const ref = useRef(null);

  const cssClass = [selected ? 'selected' : undefined, item.opened ? 'read' : undefined].join(' ');

  // Long press gesture recognition
  useEffect(() => {
    let timeout: number | undefined = undefined;

    const gesture = createGesture({
      el: ref.current!,
      gestureName: 'long-press',
      threshold: 0,
      onStart: () => {
        // @ts-ignore
        timeout = setTimeout(onLongPress, 500);
      },
      onEnd: () => {
        if (timeout) clearTimeout(timeout);
      },
    });

    gesture.enable();

    return () => gesture.destroy();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <IonItem ref={ref} button className={cssClass} onClick={onClick}>
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
  onLongPress: () => void;
}
