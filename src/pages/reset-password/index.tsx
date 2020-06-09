import React, { FC, useState } from 'react';
import { Notificare } from '@ionic-native/notificare';
import { IonButton, IonImg, IonInput, IonItem, IonLabel, IonSpinner } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import HeaderImage from '../../assets/images/key.png';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { useNetworkRequest } from '../../lib/network-request';
import { showAlertDialog } from '../../lib/ui';

export const ResetPassword: FC<ResetPasswordProps> = ({ history, match }) => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [request, requestActions] = useNetworkRequest(() => Notificare.resetPassword(password, match.params.token));

  const onResetPassword = async () => {
    if (!password.length || !passwordConfirmation.length) {
      return showAlertDialog('Please fill in all fields.');
    }

    if (password.length < 6) {
      return showAlertDialog('Password is too short.');
    }

    if (password !== passwordConfirmation) {
      return showAlertDialog('Passwords do not match. Please confirm the same password twice.');
    }

    try {
      await requestActions.start();

      await showAlertDialog('Password reset successfully.', {
        onDismiss: () => history.goBack(),
      });
    } catch (e) {
      await showAlertDialog(e);
    }
  };

  return (
    <PageContainer title="Reset password">
      {request.status === 'pending' && (
        <Center>
          <IonSpinner />
        </Center>
      )}

      {(request.status === 'idle' || request.status === 'failed') && (
        <>
          <IonItem lines="none">
            <IonImg src={HeaderImage} className="header-image ion-padding" />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Password confirmation</IonLabel>
            <IonInput
              type="password"
              value={passwordConfirmation}
              onIonChange={(e) => setPasswordConfirmation(e.detail.value!)}
            />
          </IonItem>

          <IonButton expand="block" className="ion-margin" onClick={onResetPassword}>
            Reset password
          </IonButton>
        </>
      )}
    </PageContainer>
  );
};

interface ResetPasswordProps extends RouteComponentProps<{ token: string }> {}
