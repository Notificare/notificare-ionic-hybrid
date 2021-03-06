import URL from 'url';
import React, { FC, useEffect } from 'react';
import { AppUrlOpen, Plugins } from '@capacitor/core';
import { Notificare } from '@ionic-native/notificare';
import { RouteComponentProps } from 'react-router';
import { PageContainer } from '../../components/page-container';
import { useNetworkRequest } from '../../lib/network-request';
import { showAlertDialog } from '../../lib/ui';
import { getDemoSourceConfig } from '../../lib/utils/storage';

export const Home: FC<HomeProps> = ({ history }) => {
  const [request] = useNetworkRequest(() => getDemoSourceConfig(), {
    autoStart: true,
  });

  useEffect(() => {
    // Deep links
    Plugins.App.addListener('appUrlOpen', (data: AppUrlOpen) => handleDeepLink(data.url));

    Notificare.on('scannableDetected', async (scannable) => {
      if (scannable.notification) {
        Notificare.presentScannable(scannable);
      } else {
        await showAlertDialog('Custom scannable found. The app is responsible for handling it.');
      }
    });

    Notificare.on('scannableSessionInvalidatedWithError', async ({ error }) => showAlertDialog(error));

    Notificare.on('urlOpened', (data) => handleDeepLink(data.url));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeepLink = (urlStr: string) => {
    console.log(`Received a deep link: ${urlStr}`);
    const url = URL.parse(urlStr);

    switch (url.path) {
      case '/inbox':
      case '/settings':
      case '/regions':
      case '/beacons':
      case '/profile':
      case '/analytics':
      case '/storage':
        history.push(url.path);
        break;
      case '/membercard':
        history.push('/member-card');
        break;
      case '/signin':
        history.push('/sign-in');
        break;
      case '/signup':
        history.push('/sign-up');
        break;
      case '/scan':
        Notificare.startScannableSession();
        break;
    }
  };

  return (
    <PageContainer noHeader>
      {request.status === 'successful' && request.result && (
        <iframe title="Home" src={request.result.url} className="full-iframe" />
      )}
    </PageContainer>
  );
};

interface HomeProps extends RouteComponentProps {}
