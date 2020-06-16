import React, { FC, useState } from 'react';
import { Notificare } from '@ionic-native/notificare';
import { IonButton, IonImg, IonInput, IonItem, IonLabel, IonSpinner } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import HeaderImage from '../../assets/images/account.png';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { createMemberCard } from '../../lib/loyalty';
import { useNetworkRequest } from '../../lib/network-request';
import { showAlertDialog } from '../../lib/ui';

export const SignUp: FC<SignUpProps> = ({ history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [request, requestActions] = useNetworkRequest(() => registerWithMemberCard());

  const registerWithMemberCard = async () => {
    await Notificare.createAccount(email, name, password);

    // Create and update the current member card
    await createMemberCard(name, email);

    history.replace('/profile');
  };

  const onRegister = async () => {
    if (!name.length || !email.length || !password.length || !passwordConfirmation.length) {
      return await showAlertDialog('Please fill in all fields.');
    }

    if (!email.includes('@')) {
      return await showAlertDialog('Invalid email address.');
    }

    if (password.length < 6) {
      return await showAlertDialog('The password is too short.');
    }

    if (password !== passwordConfirmation) {
      return await showAlertDialog('The passwords do not match. Please confirm the same password twice.');
    }

    try {
      await requestActions.start();

      await showAlertDialog('Account created successfully. You can now sign in.', {
        onDismiss: () => history.goBack(),
      });
    } catch (e) {
      await showAlertDialog(e);
    }
  };

  return (
    <PageContainer title="Sign up">
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
            <IonLabel position="floating">Name</IonLabel>
            <IonInput type="text" value={name} onIonChange={(e) => setName(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} />
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

          <IonButton expand="block" className="ion-margin" onClick={onRegister}>
            Create an account
          </IonButton>
        </>
      )}
    </PageContainer>
  );
};

interface SignUpProps extends RouteComponentProps {}
