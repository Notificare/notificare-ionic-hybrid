import React, { FC } from 'react';
import { EmailComposer } from '@ionic-native/email-composer';
import { IonItem, IonLabel, IonList, IonListHeader, IonToggle } from '@ionic/react';
import { PageContainer } from '../../components/page-container';
import { showAlertDialog } from '../../lib/ui';
import { getDemoSourceConfig } from '../../lib/utils/storage';

export const Settings: FC = () => {
  // region Actions

  const onSendFeedback = async () => {
    try {
      const available = await EmailComposer.isAvailable();
      if (!available) {
        await showAlertDialog('There is no email client available.');
        return;
      }

      const demoSourceConfig = await getDemoSourceConfig();
      if (demoSourceConfig == null) return;

      await EmailComposer.open({
        to: demoSourceConfig.email.split(','),
        subject: 'your_subject',
        body: 'your_message',
        isHtml: false,
      });
    } catch (e) {
      await showAlertDialog('Could not open the email client.');
    }
  };

  // endregion

  return (
    <PageContainer title="Settings">
      <IonList lines="full">
        <IonListHeader lines="full">Notification settings</IonListHeader>

        <IonItem>
          <IonLabel>
            <h2>Notifications</h2>
            <p className="ion-text-wrap">
              Receive messages with our news, events or any other campaign we might find relevant for you
            </p>
          </IonLabel>
          <IonToggle slot="end" />
        </IonItem>

        <IonItem>
          <IonLabel>
            <h2>Location Services</h2>
            <p className="ion-text-wrap">
              Allow us to collect your location data in order to send notifications whenever you are around
            </p>
          </IonLabel>
          <IonToggle slot="end" />
        </IonItem>

        <IonItem>
          <IonLabel>
            <h2>Do Not Disturb</h2>
            <p className="ion-text-wrap">
              Configure a period of time where notifications will not generate alerts in the notification center
            </p>
          </IonLabel>
          <IonToggle slot="end" />
        </IonItem>

        <IonItem>
          <IonLabel>
            <h2>From</h2>
          </IonLabel>
          <IonLabel className="ion-text-end" slot="end">
            <p>00:00</p>
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel>
            <h2>To</h2>
          </IonLabel>
          <IonLabel className="ion-text-end" slot="end">
            <p>08:00</p>
          </IonLabel>
        </IonItem>

        <IonListHeader lines="full">Tags</IonListHeader>

        <IonItem>
          <IonLabel>
            <h2>Press</h2>
            <p className="ion-text-wrap">
              Subscribe me to the group of devices that would like to receive all the news via push notifications
            </p>
          </IonLabel>
          <IonToggle slot="end" />
        </IonItem>

        <IonItem>
          <IonLabel>
            <h2>Newsletter</h2>
            <p className="ion-text-wrap">
              Subscribe me to the group of devices that would like to receive your newsletter
            </p>
          </IonLabel>
          <IonToggle slot="end" />
        </IonItem>

        <IonItem>
          <IonLabel>
            <h2>Events</h2>
            <p className="ion-text-wrap">
              Subscribe me to the group of devices that would like to receive all the events via push notifications
            </p>
          </IonLabel>
          <IonToggle slot="end" />
        </IonItem>

        <IonListHeader lines="full">About this app</IonListHeader>

        <IonItem button detail onClick={onSendFeedback}>
          <IonLabel>
            <h2>Leave your feedback</h2>
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel>
            <h2>App version</h2>
          </IonLabel>
          <IonLabel className="ion-text-end" slot="end">
            <p>1.0.0</p>
          </IonLabel>
        </IonItem>
      </IonList>
    </PageContainer>
  );
};
