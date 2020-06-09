import React, { FC, Fragment } from 'react';
import { Notificare, NotificareUser, NotificareUserPreference } from '@ionic-native/notificare';
import { IonImg, IonItem, IonLabel, IonList, IonListHeader, IonSpinner, IonToggle } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { useNetworkRequest } from '../../lib/network-request';
import { createGravatarUrl } from '../../lib/ui';

export const Profile: FC<ProfileProps> = () => {
  const [request] = useNetworkRequest(() => fetchProfile(), {
    autoStart: true,
  });

  const fetchProfile = async () => {
    const [user, userPreferences] = await Promise.all([
      Notificare.fetchAccountDetails(),
      Notificare.fetchUserPreferences(),
    ]);

    return {
      user,
      userPreferences,
    };
  };

  const renderProfile = (user: NotificareUser, preferences: NotificareUserPreference[]) => (
    <IonList lines="full">
      <IonItem lines="none" className="full-width">
        <IonImg src={createGravatarUrl(user.userID)} className="header-image profile" />
      </IonItem>

      <IonItem>
        <IonLabel>Name</IonLabel>
        <IonLabel slot="end" className="ion-text-end">
          <p>{user.userName}</p>
        </IonLabel>
      </IonItem>

      <IonItem>
        <IonLabel>Email</IonLabel>
        <IonLabel slot="end" className="ion-text-end">
          <p>{user.userID}</p>
        </IonLabel>
      </IonItem>

      <IonItem button detail>
        <IonLabel>Push email</IonLabel>
        <IonLabel slot="end" className="ion-text-end">
          <p>{user.accessToken}@notifica.re</p>
        </IonLabel>
      </IonItem>

      <IonItem detail button>
        <IonLabel>Open member card</IonLabel>
      </IonItem>

      <IonItem detail button>
        <IonLabel>Change password</IonLabel>
      </IonItem>

      <IonItem detail button>
        <IonLabel>New push email</IonLabel>
      </IonItem>

      <IonItem detail button>
        <IonLabel color="danger">Sign out</IonLabel>
      </IonItem>

      <IonListHeader lines="full">User preferences</IonListHeader>

      {!preferences.length && (
        <IonItem>
          <IonLabel>You have no preferences yet.</IonLabel>
        </IonItem>
      )}

      {preferences.length > 0 &&
        preferences.map((preference, index) => <Fragment key={index}>{renderPreference(preference)}</Fragment>)}
    </IonList>
  );

  const renderPreference = (preference: NotificareUserPreference) => (
    <>
      {preference.preferenceType === 'choice' && (
        <IonItem detail button>
          <IonLabel>{preference.preferenceLabel}</IonLabel>
          <IonLabel slot="end" className="ion-text-end">
            <p>{preference.preferenceOptions.find((option) => option.selected)?.segmentLabel}</p>
          </IonLabel>
        </IonItem>
      )}

      {preference.preferenceType === 'single' && (
        <IonItem>
          <IonLabel>{preference.preferenceLabel}</IonLabel>
          <IonToggle slot="end" checked={preference.preferenceOptions[0].selected} />
        </IonItem>
      )}

      {preference.preferenceType === 'select' && (
        <IonItem detail button>
          <IonLabel>{preference.preferenceLabel}</IonLabel>
          <IonLabel slot="end" className="ion-text-end">
            <p>{preference.preferenceOptions.filter((option) => option.selected).length}</p>
          </IonLabel>
        </IonItem>
      )}
    </>
  );

  return (
    <PageContainer title="Profile">
      {request.status === 'pending' && (
        <Center>
          <IonSpinner />
        </Center>
      )}

      {request.status === 'successful' && renderProfile(request.result.user, request.result.userPreferences)}
    </PageContainer>
  );
};

interface ProfileProps extends RouteComponentProps {}
