import React, { FC, Fragment, useState } from 'react';
import { AppVersion } from '@ionic-native/app-version';
import { EmailComposer } from '@ionic-native/email-composer';
import {
  Notificare,
  NotificareUser,
  NotificareUserPreference,
  NotificareUserPreferenceOption,
  NotificareUserSegment,
} from '@ionic-native/notificare';
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSpinner,
  IonToggle,
} from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { Center } from '../../components/center';
import { Modal } from '../../components/modal';
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

      {request.status === 'failed' && (
        <Center>
          <p>
            Failed to load your profile...
            <br />
            <small>{request.reason}</small>
          </p>
        </Center>
      )}
    </PageContainer>
  );
};

interface ProfileProps extends RouteComponentProps {}

// region Internal profile

const ProfileSuccess: FC<ProfileSuccessProps> = ({ history, user, preferences, onRefreshSignal }) => {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(
      preferences
        .filter((preference) => preference.preferenceType === 'single')
        .map((preference) => [preference.preferenceId, preference.preferenceOptions[0].selected]),
    ),
  );

  const [currentPreference, setCurrentPreference] = useState<NotificareUserPreference>();

  const renderPreference = (preference: NotificareUserPreference) => (
    <>
      {preference.preferenceType === 'choice' && (
        <IonItem detail button onClick={() => setCurrentPreference(preference)}>
          <IonLabel>{preference.preferenceLabel}</IonLabel>
          <IonLabel slot="end" className="ion-text-end">
            <p>{preference.preferenceOptions.find((option) => option.selected)?.segmentLabel}</p>
          </IonLabel>
        </IonItem>
      )}

      {preference.preferenceType === 'single' && (
        <IonItem>
          <IonLabel>{preference.preferenceLabel}</IonLabel>
          <IonToggle
            slot="end"
            checked={toggles[preference.preferenceId]}
            onIonChange={async (e) => {
              setToggles((prevState) => ({ ...prevState, [preference.preferenceId]: e.detail.checked }));
              await onUpdateSinglePreference(preference, e.detail.checked);
            }}
          />
        </IonItem>
      )}

      {preference.preferenceType === 'select' && (
        <IonItem detail button onClick={() => setCurrentPreference(preference)}>
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

  const onUpdateSinglePreference = async (preference: NotificareUserPreference, selected: boolean) => {
    try {
      const option = preference.preferenceOptions[0];

      const segment: NotificareUserSegment = {
        segmentId: option.segmentId,
        segmentLabel: option.segmentLabel,
      };

      if (selected) {
        await Notificare.addSegmentToUserPreference(segment, preference);
      } else {
        await Notificare.removeSegmentFromUserPreference(segment, preference);
      }

      onRefreshSignal();
    } catch (e) {
      await showAlertDialog(`Failed to update user preference: ${e}`, {
        onDismiss: () => onRefreshSignal(),
      });
    }
  };

  const onUpdateChoicePreference = async (
    preference: NotificareUserPreference,
    option: NotificareUserPreferenceOption,
  ) => {
    try {
      const segment: NotificareUserSegment = {
        segmentId: option.segmentId,
        segmentLabel: option.segmentLabel,
      };

      await Notificare.addSegmentToUserPreference(segment, preference);

      onRefreshSignal();
    } catch (e) {
      await showAlertDialog(`Failed to update user preference: ${e}`, {
        onDismiss: () => onRefreshSignal(),
      });
    }
  };

  const onUpdateSelectPreference = async (
    preference: NotificareUserPreference,
    options: NotificareUserPreferenceOption[],
  ) => {
    try {
      for (let option of preference.preferenceOptions) {
        const segment: NotificareUserSegment = {
          segmentId: option.segmentId,
          segmentLabel: option.segmentLabel,
        };

        const isSelected = options.find((opt) => opt.segmentId === option.segmentId) != null;
        console.log(`${option.segmentLabel} isSelected: ${isSelected}`);

        if (isSelected) {
          await Notificare.addSegmentToUserPreference(segment, preference);
        } else {
          await Notificare.removeSegmentFromUserPreference(segment, preference);
        }
      }

      onRefreshSignal();
    } catch (e) {
      await showAlertDialog(`Failed to update user preference: ${e}`, {
        onDismiss: () => onRefreshSignal(),
      });
    }
  };

  // endregion

  return (
    <>
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
            <p>{user.accessToken}</p>
          </IonLabel>
        </IonItem>

        <IonItem detail button onClick={() => history.push('/member-card')}>
          <IonLabel>Open member card</IonLabel>
        </IonItem>

        <IonItem detail button onClick={() => history.push('/change-password')}>
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

      <Modal
        open={currentPreference != null}
        onClose={() => setCurrentPreference(undefined)}
        title={currentPreference?.preferenceLabel ?? ''}
      >
        {currentPreference?.preferenceType === 'choice' && (
          <ChoicePreferencePicker preference={currentPreference} onChange={onUpdateChoicePreference} />
        )}

        {currentPreference?.preferenceType === 'select' && (
          <SelectPreferencePicker preference={currentPreference} onChange={onUpdateSelectPreference} />
        )}
      </Modal>
    </>
  );
};

interface ProfileSuccessProps extends Pick<ProfileProps, 'history'> {
  user: NotificareUser;
  preferences: NotificareUserPreference[];
  onRefreshSignal: () => void;
}

// endregion

// region Preference pickers

const ChoicePreferencePicker: FC<ChoicePreferencePickerProps> = ({ preference, onChange }) => {
  const [selectedChoice, setSelectedChoice] = useState(preference.preferenceOptions.find((option) => option.selected));

  return (
    <IonList lines="full">
      {preference.preferenceOptions.map((option, index) => (
        <IonItem
          key={index}
          button
          onClick={() => {
            setSelectedChoice(option);
            onChange(preference, option);
          }}
        >
          <IonLabel>{option.segmentLabel}</IonLabel>
          {option.segmentId === selectedChoice?.segmentId && (
            <IonIcon icon={checkmarkCircle} color="success" slot="end" />
          )}
        </IonItem>
      ))}
    </IonList>
  );
};

interface ChoicePreferencePickerProps {
  preference: NotificareUserPreference;
  onChange: (preference: NotificareUserPreference, option: NotificareUserPreferenceOption) => void;
}

const SelectPreferencePicker: FC<SelectPreferencePickerProps> = ({ preference, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState(
    preference.preferenceOptions.filter((option) => option.selected),
  );

  return (
    <IonList lines="full">
      {preference.preferenceOptions.map((option, index) => (
        <IonItem key={index}>
          <IonLabel>{option.segmentLabel}</IonLabel>
          <IonCheckbox
            slot="end"
            checked={selectedOptions.find((opt) => opt.segmentId === option.segmentId)?.selected ?? false}
            onIonChange={(e) => {
              setSelectedOptions((prevState) => {
                if (e.detail.checked) {
                  prevState.push(option);

                  return prevState;
                } else {
                  const index = prevState.indexOf(option);
                  prevState.splice(index, 1);

                  return prevState;
                }
              });
            }}
          />
        </IonItem>
      ))}

      <IonButton expand="block" className="ion-margin" onClick={() => onChange(preference, selectedOptions)}>
        Save
      </IonButton>
    </IonList>
  );
};

interface SelectPreferencePickerProps {
  preference: NotificareUserPreference;
  onChange: (preference: NotificareUserPreference, selectedOptions: NotificareUserPreferenceOption[]) => void;
}

// endregion
