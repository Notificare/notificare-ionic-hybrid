import React, { FC, Fragment } from 'react';
import { AppVersion } from '@ionic-native/app-version';
import { EmailComposer } from '@ionic-native/email-composer';
import { Notificare, NotificareUser, NotificareUserPreference } from '@ionic-native/notificare';
import { IonImg, IonItem, IonLabel, IonList, IonListHeader, IonSpinner, IonToggle } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { useNetworkRequest } from '../../lib/network-request';
import { createGravatarUrl, showAlertDialog } from '../../lib/ui';
import { getPlatformName } from '../../lib/utils';

export const Profile: FC<ProfileProps> = ({ history }) => {
  const [request, requestActions] = useNetworkRequest(() => fetchProfile(), {
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

  const reloadProfile = () => {
    requestActions.start().catch((e) => console.log(`Failed to reload the user profile: ${e}`));
  };

  return (
    <PageContainer title="Profile">
      {request.status === 'pending' && (
        <Center>
          <IonSpinner />
        </Center>
      )}

      {request.status === 'successful' && (
        <ProfileSuccess
          history={history}
          user={request.result.user}
          preferences={request.result.userPreferences}
          onRefreshSignal={reloadProfile}
        />
      )}
    </PageContainer>
  );
};

interface ProfileProps extends RouteComponentProps {}

// region Internal profile

const ProfileSuccess: FC<ProfileSuccessProps> = ({ history, user, preferences, onRefreshSignal }) => {
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

  // region Actions

  const onSendEmail = async () => {
    try {
      const available = await EmailComposer.isAvailable();
      if (!available) {
        await showAlertDialog('There is no email client available.');
        return;
      }

      const platform = getPlatformName();
      const appName = await AppVersion.getAppName();

      await EmailComposer.open({
        to: `${user.accessToken}@pushmail.notifica.re`,
        subject: `${platform} ${appName}`,
      });
    } catch (e) {
      await showAlertDialog('Could not open the email client.');
    }
  };

  const onNewPushEmail = async () => {
    try {
      await Notificare.generateAccessToken();
      await showAlertDialog('Push email generated successfully.', {
        onDismiss: () => onRefreshSignal(),
      });
    } catch (e) {
      await showAlertDialog('Could not generate a new push email.', {
        onDismiss: () => onRefreshSignal(),
      });
    }
  };

  const onSignOut = async () => {
    try {
      await Notificare.logout();
      history.goBack();
    } catch (e) {
      await showAlertDialog('Could not sign you out.', {
        onDismiss: () => onRefreshSignal(),
      });
    }
  };

  // endregion

  return (
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

      <IonItem button detail onClick={onSendEmail}>
        <IonLabel>Push email</IonLabel>
        <IonLabel slot="end" className="ion-text-end">
          <p>{user.accessToken}@pushmail.notifica.re</p>
        </IonLabel>
      </IonItem>

      <IonItem detail button>
        <IonLabel>Open member card</IonLabel>
      </IonItem>

      <IonItem detail button>
        <IonLabel>Change password</IonLabel>
      </IonItem>

      <IonItem detail button onClick={onNewPushEmail}>
        <IonLabel>New push email</IonLabel>
      </IonItem>

      <IonItem detail button onClick={onSignOut}>
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
};

interface ProfileSuccessProps extends Pick<ProfileProps, 'history'> {
  user: NotificareUser;
  preferences: NotificareUserPreference[];
  onRefreshSignal: () => void;
}

// endregion
