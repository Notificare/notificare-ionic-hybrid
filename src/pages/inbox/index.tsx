import React, { FC, useEffect, useState } from 'react';
import { Notificare, NotificareInboxItem } from '@ionic-native/notificare';
import { IonList, IonSpinner } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { Center } from '../../components/center';
import { InboxItem } from '../../components/inbox-item';
import { PageContainer } from '../../components/page-container';

export const Inbox: FC<InboxProps> = () => {
  const [state, setState] = useState<InboxState>({ loading: false, data: [] });
  const [selectedItems, setSelectedItems] = useState<NotificareInboxItem[]>([]);

  const reloadData = () => {
    setState({ loading: true, data: [] });

    Notificare.fetchInbox()
      .then((data) => {
        console.log(`-----> Inbox data: ${JSON.stringify(data, null, 2)}`);
        setState({ loading: false, data });
      })
      .catch(() => setState({ loading: false, data: [] }));
  };

  const onItemClick = (item: NotificareInboxItem) => {
    if (selectedItems.length > 0) {
      onItemLongPress(item);
      return;
    }

    Notificare.presentInboxItem(item);
  };

  const onItemLongPress = (item: NotificareInboxItem) => {};

  useEffect(() => reloadData(), []);

  return (
    <PageContainer title="Inbox">
      {state.loading && (
        <Center>
          <IonSpinner />
        </Center>
      )}

      {!state.loading && (
        <>
          {state.data.length === 0 && (
            <Center>
              <p>No messages found</p>
            </Center>
          )}

          {state.data.length > 0 && (
            <IonList lines="full">
              {state.data.map((value, index) => (
                <InboxItem
                  key={index}
                  item={value}
                  selected={selectedItems.indexOf(value) > -1}
                  onClick={() => onItemClick(value)}
                />
              ))}
            </IonList>
          )}
        </>
      )}
    </PageContainer>
  );
};

interface InboxProps extends RouteComponentProps {}

interface InboxState {
  loading: boolean;
  data: NotificareInboxItem[];
}
