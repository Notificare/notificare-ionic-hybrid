import React, { FC } from 'react';
import { IonItem, IonLabel, IonList } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { PageContainer } from '../../components/page-container';

export const Home: FC<HomeProps> = ({ history }) => {
  const routes = [
    { label: 'Inbox', route: '/inbox' },
    { label: 'Settings', route: '/settings' },
    { label: 'Analytics', route: '/analytics' },
    { label: 'Storage', route: '/storage' },
    { label: 'Sign in', route: '/sign-in' },
    { label: 'Sign up', route: '/sign-up' },
    { label: 'Forgot password', route: '/forgot-password' },
    { label: 'Profile', route: '/profile' },
    { label: 'Reset password', route: '/reset-password/aaaaaa' },
  ];

  return (
    <PageContainer title="Home">
      <IonList lines="full">
        {routes.map(({ label, route }, index) => (
          <IonItem key={index} button onClick={() => history.push(route)}>
            <IonLabel className="ion-text-capitalize">{label}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </PageContainer>
  );
};

interface HomeProps extends RouteComponentProps {}
