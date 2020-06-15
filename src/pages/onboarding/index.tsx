import React, { FC, useCallback, useRef } from 'react';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Notificare } from '@ionic-native/notificare';
import { IonButton, IonImg, IonSlide, IonSlides, IonSpinner } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { useNetworkRequest } from '../../lib/network-request';
import { setOnboardingStatus } from '../../lib/utils/storage';
import './index.scss';

export const Onboarding: FC<OnboardingProps> = ({ history }) => {
  const [request] = useNetworkRequest(() => Notificare.fetchAssets('ONBOARDING'), {
    autoStart: true,
  });

  const slidesRef = useRef<HTMLIonSlidesElement | null>(null);
  const slidesCallback = useCallback<(node: HTMLIonSlidesElement) => void>((node) => {
    slidesRef.current = node;
    node?.lockSwipes(true).catch(() => {});
  }, []);

  const handleButtonAction = async (action?: string) => {
    switch (action) {
      case 'goToLocationServices':
        Notificare.registerForNotifications();
        break;
      case 'goToApp':
        await startLocationUpdates();
        return;
    }

    await slidesRef.current?.lockSwipes(false);
    await slidesRef.current?.slideNext();
    await slidesRef.current?.lockSwipes(true);
  };

  const startLocationUpdates = async () => {
    const result = await Diagnostic.getLocationAuthorizationStatus();
    if (result != Diagnostic.permissionStatus.GRANTED) {
      const granted = await Diagnostic.requestLocationAuthorization(Diagnostic.locationAuthorizationMode.ALWAYS);
      if (!granted) {
        console.log('The user did not grant the location permission.');
        return;
      }
    }

    console.log('Enabling location updates.');
    Notificare.startLocationUpdates();
    Notificare.enableBeacons();

    await setOnboardingStatus(true);
    history.replace('/home');
  };

  return (
    <PageContainer noHeader>
      {request.status === 'pending' && (
        <Center>
          <IonSpinner />
        </Center>
      )}

      {request.status === 'successful' && (
        <IonSlides ref={slidesCallback}>
          {request.result.map((asset, index) => (
            <IonSlide key={index} className="slide">
              <IonImg src={asset.assetUrl!} />
              <footer>
                <section className="content">
                  <h1>{asset.assetTitle}</h1>
                  <small dangerouslySetInnerHTML={{ __html: asset.assetDescription! }} />
                </section>

                <IonButton expand="block" onClick={() => handleButtonAction(asset.assetButton?.action)}>
                  {asset.assetButton?.label}
                </IonButton>
              </footer>
            </IonSlide>
          ))}
        </IonSlides>
      )}
    </PageContainer>
  );
};

interface OnboardingProps extends RouteComponentProps {}
