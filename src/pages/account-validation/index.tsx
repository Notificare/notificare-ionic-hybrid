import React, { FC } from 'react';
import { Notificare } from '@ionic-native/notificare';
import { IonButton, IonIcon, IonSpinner, IonText } from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { useNetworkRequest } from '../../lib/network-request';
import './index.scss';

export const AccountValidation: FC<AccountValidationProps> = ({ history, match }) => {
  const [request, requestActions] = useNetworkRequest(() => Notificare.validateAccount(match.params.token), {
    autoStart: true,
  });

  return (
    <PageContainer title="Account">
      {request.status === 'pending' && (
        <Center>
          <IonSpinner />
        </Center>
      )}

      {request.status === 'successful' && (
        <>
          <IonIcon icon={checkmarkCircle} className="header-image" color="successful" />

          <div className="ion-margin">
            <IonText className="title">Your account has been validated!</IonText>
            <IonText className="subtitle">You can login now.</IonText>
          </div>

          <IonButton expand="block" className="ion-margin" onClick={() => history.goBack()}>
            Take me home
          </IonButton>
        </>
      )}

      {request.status === 'failed' && (
        <>
          <IonIcon icon={closeCircle} className="header-image" color="danger" />

          <div className="ion-margin">
            <IonText className="title">Something went wrong.</IonText>
            <IonText className="subtitle">We couldn't validate your account.</IonText>
          </div>

          <IonButton
            expand="block"
            className="ion-margin"
            onClick={() => requestActions.start().catch((e) => console.log(`Retry failed: ${e}`))}
          >
            Try again
          </IonButton>
        </>
      )}
    </PageContainer>
  );
};

interface AccountValidationProps extends RouteComponentProps<{ token: string }> {}
