import React, { FC, useEffect, useState } from 'react';
import { Notificare, NotificareInboxItem } from '@ionic-native/notificare';
import { IonList, IonSpinner, IonButton, IonIcon } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import Delete from '../../assets/icons/delete-24px.svg';
import DeleteSweep from '../../assets/icons/delete_sweep-24px.svg';
import MarkRead from '../../assets/icons/mark_email_read-24px.svg';
import { Center } from '../../components/center';
import { InboxItem } from '../../components/inbox-item';
import { PageContainer } from '../../components/page-container';

export const Inbox: FC<InboxProps> = () => {
  const [state, setState] = useState<InboxState>({ loading: false, data: [] });
  const [selectedItems, setSelectedItems] = useState<NotificareInboxItem[]>([]);

  const reloadData = () => {
    setState({ loading: true, data: [] });

    Notificare.fetchInbox()
      .then((data) => setState({ loading: false, data }))
      .catch(() => setState({ loading: false, data: [] }));
  };

  const markSelectedInboxItems = async () => {
    setState({ loading: true, data: [] });

    for (let item of selectedItems) {
      try {
        await Notificare.markAsRead(item);
      } catch (e) {
        console.log(`Failed to mark item as read: ${e}`);
      }
    }

    reloadData();
    setSelectedItems([]);
  };

  const deleteSelectedInboxItems = async () => {
    setState({ loading: true, data: [] });

    for (let item of selectedItems) {
      try {
        await Notificare.removeFromInbox(item);
      } catch (e) {
        console.log(`Failed to remove item from inbox: ${e}`);
      }
    }

    setTimeout(() => {
      reloadData();
      setSelectedItems([]);
    }, 250);
  };

  const clearInboxItems = async () => {
    setState({ loading: true, data: [] });

    try {
      await Notificare.clearInbox();
    } catch (e) {
      console.log(`Failed to clear the inbox: ${e}`);
    }

    setTimeout(() => {
      reloadData();
      setSelectedItems([]);
    }, 250);
  };

  const onItemClick = (item: NotificareInboxItem) => {
    if (selectedItems.length > 0) {
      onItemLongPress(item);
      return;
    }

    Notificare.presentInboxItem(item);
  };

  const onItemLongPress = (item: NotificareInboxItem) => {
    const isSelected = selectedItems.includes(item);

    if (!isSelected) {
      setSelectedItems((prevState) => [...prevState, item]);
    } else {
      setSelectedItems((prevState) => {
        const index = prevState.indexOf(item);
        if (index > -1) {
          prevState.splice(index, 1);
        }

        return [...prevState];
      });
    }
  };

  useEffect(() => reloadData(), []);

  return (
    <PageContainer
      title="Inbox"
      rightButtons={
        selectedItems.length === 0 ? (
          <IonButton onClick={clearInboxItems}>
            <IonIcon slot="icon-only" icon={DeleteSweep} />
          </IonButton>
        ) : (
          <>
            <IonButton onClick={markSelectedInboxItems}>
              <IonIcon slot="icon-only" icon={MarkRead} />
            </IonButton>
            <IonButton onClick={deleteSelectedInboxItems}>
              <IonIcon slot="icon-only" icon={Delete} />
            </IonButton>
          </>
        )
      }
    >
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
                  onLongPress={() => onItemLongPress(value)}
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
