import React, { FC, useState } from 'react';
import { Notificare } from '@ionic-native/notificare';
import { IonButton, IonImg, IonInput, IonItem, IonLabel, IonSpinner } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import HeaderImage from '../../assets/images/key.png';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { useNetworkRequest } from '../../lib/network-request';
import { showAlertDialog } from '../../lib/ui';

export const ForgotPassword: FC<ForgotPasswordProps> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [request, requestActions] = useNetworkRequest(() => Notificare.sendPassword(email));

  const onForgotPassword = async () => {
    if (!email.length || !email.includes('@')) {
      return await showAlertDialog('Please fill in a valid email.');
    }

    try {
      await requestActions.start();

      await showAlertDialog('Account found. Please check your mailbox for more information.', {
        onDismiss: () => history.goBack(),
      });
    } catch (e) {
      await showAlertDialog(e);
    }
  };

  return (
    <PageContainer title="Forgot password">
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
            <IonLabel position="floating">Email</IonLabel>
            <IonInput type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} />
          </IonItem>

          <IonButton expand="block" className="ion-margin" onClick={onForgotPassword}>
            Recover password
          </IonButton>
        </>
      )}
    </PageContainer>
  );
};

interface ForgotPasswordProps extends RouteComponentProps {}
