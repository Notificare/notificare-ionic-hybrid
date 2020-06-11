import React, { ComponentType, FC } from 'react';
import { Notificare } from '@ionic-native/notificare';
import { IonSpinner } from '@ionic/react';
import { Redirect, Route, RouteProps } from 'react-router';
import { useNetworkRequest } from '../../lib/network-request';
import { Center } from '../center';
import { PageContainer } from '../page-container';

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const [request] = useNetworkRequest(() => Notificare.isLoggedIn(), {
    autoStart: true,
  });

  if (request.status === 'idle' || request.status === 'pending') {
    return (
      <PageContainer noHeader>
        <Center>
          <IonSpinner />
        </Center>
      </PageContainer>
    );
  }

  if (request.status === 'successful') {
    if (!request.result) return <Redirect to="sign-in" />;
    return <Route {...rest} component={Component} />;
  }

  return (
    <PageContainer noHeader>
      <Center>
        <p>
          Oh snap! Something went wrong...
          <br />
          <small>{request.reason}</small>
        </p>
      </Center>
    </PageContainer>
  );
};

interface ProtectedRouteProps extends RouteProps {
  component: ComponentType<any>;
}
