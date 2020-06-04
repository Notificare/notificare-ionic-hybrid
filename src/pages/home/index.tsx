import React, { FC } from 'react';
import { IonButton } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { PageContainer } from '../../components/page-container';

export const Home: FC<HomeProps> = ({ history }) => {
  return (
    <PageContainer title="Home">
      <IonButton
        expand="block"
        onClick={(e) => {
          e.preventDefault();
          history.push('/inbox');
        }}
      >
        Open Inbox
      </IonButton>

      <IonButton
        expand="block"
        onClick={(e) => {
          e.preventDefault();
          history.push('/settings');
        }}
      >
        Open settings
      </IonButton>
    </PageContainer>
  );
};

interface HomeProps extends RouteComponentProps {}
