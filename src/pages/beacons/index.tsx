import React, { FC, useEffect, useState } from 'react';
import { Notificare } from '@ionic-native/notificare';
import { IonItem, IonLabel, IonList } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';

export const Beacons: FC<BeaconsProps> = () => {
  const [beacons, setBeacons] = useState<any[]>([]);

  useEffect(() => {
    Notificare.on('beaconsInRangeForRegion', ({ beacons }) => setBeacons(beacons));
  }, []);

  return (
    <PageContainer title="Beacons">
      {beacons.length === 0 && (
        <Center>
          <p>No beacons found</p>
        </Center>
      )}

      {beacons.length > 0 && (
        <IonList lines="full">
          {beacons.map((beacon, index) => (
            <IonItem key={index}>
              <IonLabel>{beacon.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}
    </PageContainer>
  );
};

interface BeaconsProps extends RouteComponentProps {}
