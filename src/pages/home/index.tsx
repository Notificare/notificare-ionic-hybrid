import React, { FC } from 'react';
import { IonItem, IonLabel, IonList } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { PageContainer } from '../../components/page-container';

export const Home: FC<HomeProps> = ({ history }) => {
  const routes = ['inbox', 'settings', 'analytics', 'storage'];

  return (
    <PageContainer title="Home">
      <IonList lines="full">
        {routes.map((value) => (
          <IonItem key={value} button onClick={() => history.push(`/${value}`)}>
            <IonLabel className="ion-text-capitalize">{value}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </PageContainer>
  );
};

interface HomeProps extends RouteComponentProps {}
