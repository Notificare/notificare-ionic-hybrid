import React, { FC, useEffect, useState } from 'react';
import { Notificare } from '@ionic-native/notificare';
import { IonButton, IonImg, IonInput, IonItem, IonLabel, IonSpinner } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import HeaderImage from '../../assets/images/padlock.png';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { createMemberCard } from '../../lib/loyalty';
import { useNetworkRequest } from '../../lib/network-request';
import { showAlertDialog } from '../../lib/ui';

export const SignIn: FC<SignInProps> = ({ history, match }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [request, requestActions] = useNetworkRequest(() => loginWithMemberCard());

  // Redirecting on a ProtectedRoute causes the component to update if it has been previously mounted thus preserving
  // its state. We need to wipe it out when navigating back to the component otherwise the request status remains
  // completed.
  useEffect(() => {
    requestActions.reset();
  }, [match, requestActions]);

  const loginWithMemberCard = async () => {
    await Notificare.login(email, password);
    const user = await Notificare.fetchAccountDetails();

    // Create and update the current member card
    await createMemberCard(user.userName, user.userID);
  };

  const onLogin = async () => {
    if (!email.length || !password.length) {
      return await showAlertDialog('Invalid credentials.');
    }

    if (!email.includes('@')) {
      return await showAlertDialog('Invalid email address.');
    }

    try {
      await requestActions.start();
      setEmail('');
      setPassword('');
      history.replace('/profile');
    } catch (e) {
      await showAlertDialog('Invalid credentials.');
      setPassword('');
    }
  };

  return (
    <PageContainer title="Sign in">
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

          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
          </IonItem>

          <IonItem lines="full">
            <IonButton fill="clear" slot="end" onClick={() => history.push('/forgot-password')}>
              Forgotten password
            </IonButton>
          </IonItem>

          <IonButton expand="block" className="ion-margin" onClick={onLogin}>
            Sign in
          </IonButton>

          <IonButton fill="outline" expand="block" className="ion-margin" onClick={() => history.push('/sign-up')}>
            Create an account
          </IonButton>
        </>
      )}
    </PageContainer>
  );
};

interface SignInProps extends RouteComponentProps {}
