import React, { FC, useState } from 'react';
import { AppVersion } from '@ionic-native/app-version';
import { EmailComposer } from '@ionic-native/email-composer';
import { Notificare, NotificareDeviceDnD } from '@ionic-native/notificare';
import { IonDatetime, IonItem, IonLabel, IonList, IonListHeader, IonSpinner, IonToggle } from '@ionic/react';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { useNetworkRequest } from '../../lib/network-request';
import { showAlertDialog } from '../../lib/ui';
import { getDemoSourceConfig } from '../../lib/utils/storage';

export const Settings: FC = () => {
  const [request, requestActions] = useNetworkRequest(() => loadData(), {
    autoStart: true,
    onStarted: () => setLoading(true),
    onFinished: async (state) => {
      if (state.status === 'successful') {
        const { result } = state;

        setToggles({
          notifications: result.isRemoteNotificationsEnabled,
          location: result.isLocationServicesEnabled,
          dnd: result.dnd?.start != null && result.dnd?.end != null,
          tagPress: result.tags.includes('tag_press'),
          tagNewsletter: result.tags.includes('tag_newsletter'),
          tagEvents: result.tags.includes('tag_events'),
        });
      }

      setLoading(false);
    },
  });

  const [loading, setLoading] = useState(false);
  const [toggles, setToggles] = useState<Toggles>({
    notifications: false,
    location: false,
    dnd: false,
    tagPress: false,
    tagNewsletter: false,
    tagEvents: false,
  });

  const loadData = async () => {
    const demoSourceConfig = await getDemoSourceConfig();

    const isRemoteNotificationsEnabled = Boolean(await Notificare.isRemoteNotificationsEnabled());
    const useDoNotDisturb = isRemoteNotificationsEnabled && Boolean(await Notificare.isAllowedUIEnabled());

    const result: SettingsData = {
      useLocationServices: demoSourceConfig?.config?.useLocationServices ?? false,
      useDoNotDisturb,
      isRemoteNotificationsEnabled,
      isLocationServicesEnabled: Boolean(await Notificare.isLocationServicesEnabled()),
      dnd: useDoNotDisturb ? await Notificare.fetchDoNotDisturb() : undefined,
      tags: await Notificare.fetchTags(),
      appVersion: await AppVersion.getVersionNumber(),
    };

    return result;
  };

  const reloadData = () => {
    requestActions.start().catch((e) => console.log(`Failed to reload the data: ${e}`));
  };

  // region Actions

  const updateNotifications = (enabled: boolean) => {
    setToggles((prevState) => ({ ...prevState, notifications: enabled }));

    if (enabled) {
      Notificare.registerForNotifications();
    } else {
      Notificare.unregisterForNotifications();
    }
  };

  const updateLocation = (enabled: boolean) => {
    setToggles((prevState) => ({ ...prevState, location: enabled }));

    if (enabled) {
      Notificare.startLocationUpdates();
      Notificare.enableBeacons();
    } else {
      Notificare.stopLocationUpdates();
      Notificare.disableBeacons();
    }
  };

  const updateDnD = async (enabled: boolean, start?: string, end?: string) => {
    if (start == null && end == null) {
      setToggles((prevState) => ({ ...prevState, dnd: enabled }));
    }

    setLoading(true);

    try {
      if (enabled) {
        await Notificare.updateDoNotDisturb({ start: start ?? '00:00', end: end ?? '08:00' });
      } else {
        await Notificare.clearDoNotDisturb();
      }
    } catch (e) {
      console.log(`Failed to update dnd: ${e}`);
    } finally {
      reloadData();
    }
  };

  const updateTag = async (prop: 'tagPress' | 'tagNewsletter' | 'tagEvents', tag: string, enabled: boolean) => {
    setToggles((prevState) => ({ ...prevState, [prop]: enabled }));
    setLoading(true);

    try {
      if (enabled) {
        await Notificare.addTag(tag);
      } else {
        await Notificare.removeTag(tag);
      }
    } catch (e) {
      console.log(`Failed to update tag: ${e}`);
      setToggles((prevState) => ({ ...prevState, [prop]: !enabled }));
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async () => {
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
      {loading && (
        <Center>
          <IonSpinner />
        </Center>
      )}

      {request.status === 'successful' && (
        <IonList lines="full">
          <IonListHeader lines="full">Notification settings</IonListHeader>

          <IonItem>
            <IonLabel>
              <h2>Notifications</h2>
              <p className="ion-text-wrap">
                Receive messages with our news, events or any other campaign we might find relevant for you
              </p>
            </IonLabel>
            <IonToggle
              slot="end"
              checked={toggles.notifications}
              onIonChange={(e) => updateNotifications(e.detail.checked)}
            />
          </IonItem>

          {request.result.useLocationServices && (
            <IonItem>
              <IonLabel>
                <h2>Location Services</h2>
                <p className="ion-text-wrap">
                  Allow us to collect your location data in order to send notifications whenever you are around
                </p>
              </IonLabel>
              <IonToggle slot="end" checked={toggles.location} onIonChange={(e) => updateLocation(e.detail.checked)} />
            </IonItem>
          )}

          {request.result.useDoNotDisturb && (
            <>
              <IonItem>
                <IonLabel>
                  <h2>Do Not Disturb</h2>
                  <p className="ion-text-wrap">
                    Configure a period of time where notifications will not generate alerts in the notification center
                  </p>
                </IonLabel>
                <IonToggle slot="end" checked={toggles.dnd} onIonChange={(e) => updateDnD(e.detail.checked)} />
              </IonItem>

              {request.result.dnd?.start != null && request.result.dnd?.end != null && (
                <>
                  <IonItem>
                    <IonLabel>From</IonLabel>
                    <IonDatetime
                      style={{ fontSize: 14, color: '#808289' }}
                      displayFormat="HH:mm"
                      pickerFormat="HH:mm"
                      value={request.result.dnd.start}
                      onIonChange={(e) => {
                        const start = e.detail.value!;
                        const end = request.result.dnd?.end;

                        updateDnD(true, start, end).catch((e) => `Failed to update DND: ${e}`);
                      }}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel>To</IonLabel>
                    <IonDatetime
                      style={{ fontSize: 14, color: '#808289' }}
                      displayFormat="HH:mm"
                      pickerFormat="HH:mm"
                      value={request.result.dnd.end}
                      onIonChange={(e) => {
                        const start = request.result.dnd?.start;
                        const end = e.detail.value!;

                        updateDnD(true, start, end).catch((e) => `Failed to update DND: ${e}`);
                      }}
                    />
                  </IonItem>
                </>
              )}
            </>
          )}

          <IonListHeader lines="full">Tags</IonListHeader>

          <IonItem>
            <IonLabel>
              <h2>Press</h2>
              <p className="ion-text-wrap">
                Subscribe me to the group of devices that would like to receive all the news via push notifications
              </p>
            </IonLabel>
            <IonToggle
              slot="end"
              checked={toggles.tagPress}
              onIonChange={(e) => updateTag('tagPress', 'tag_press', e.detail.checked)}
            />
          </IonItem>

          <IonItem>
            <IonLabel>
              <h2>Newsletter</h2>
              <p className="ion-text-wrap">
                Subscribe me to the group of devices that would like to receive your newsletter
              </p>
            </IonLabel>
            <IonToggle
              slot="end"
              checked={toggles.tagNewsletter}
              onIonChange={(e) => updateTag('tagNewsletter', 'tag_newsletter', e.detail.checked)}
            />
          </IonItem>

          <IonItem>
            <IonLabel>
              <h2>Events</h2>
              <p className="ion-text-wrap">
                Subscribe me to the group of devices that would like to receive all the events via push notifications
              </p>
            </IonLabel>
            <IonToggle
              slot="end"
              checked={toggles.tagEvents}
              onIonChange={(e) => updateTag('tagEvents', 'tag_events', e.detail.checked)}
            />
          </IonItem>

          <IonListHeader lines="full">About this app</IonListHeader>

          <IonItem button detail onClick={sendFeedback}>
            <IonLabel>
              <h2>Leave your feedback</h2>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <h2>App version</h2>
            </IonLabel>
            <IonLabel className="ion-text-end" slot="end">
              <p>{request.result.appVersion}</p>
            </IonLabel>
          </IonItem>
        </IonList>
      )}

      {request.status === 'failed' && (
        <Center>
          <p>
            Oh snap! Something went wrong...
            <br />
            <small>{request.reason}</small>
          </p>
        </Center>
      )}
    </PageContainer>
  );
};

interface SettingsData {
  useLocationServices: boolean;
  useDoNotDisturb: boolean;
  isRemoteNotificationsEnabled: boolean;
  isLocationServicesEnabled: boolean;
  dnd?: NotificareDeviceDnD;
  tags: string[];
  appVersion: string;
}

interface Toggles {
  notifications: boolean;
  location: boolean;
  dnd: boolean;
  tagPress: boolean;
  tagNewsletter: boolean;
  tagEvents: boolean;
}
