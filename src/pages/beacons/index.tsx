import React, { FC, useEffect, useState } from 'react';
import { Notificare, NotificareBeacon } from '@ionic-native/notificare';
import { IonItem, IonLabel, IonList } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';

export const Beacons: FC<BeaconsProps> = () => {
  const [beacons, setBeacons] = useState<NotificareBeacon[]>([]);

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
            <IonItem>
              <IonLabel>{beacon.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}
    </PageContainer>
  );
};

interface BeaconsProps extends RouteComponentProps {}
