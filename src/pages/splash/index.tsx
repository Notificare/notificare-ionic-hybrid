import React, { FC, useEffect, useState } from 'react';
import { Plugins } from '@capacitor/core';
import { HTTP } from '@ionic-native/http';
import { Notificare } from '@ionic-native/notificare';
import { IonImg, IonSpinner } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import LogoImage from '../../assets/images/logo.png';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import {
  getDemoSourceConfig,
  getOnboardingStatus,
  setCustomScript,
  setDemoSourceConfig,
  setMemberCardTemplate,
} from '../../lib/utils/storage';
import './index.scss';

export const Splash: FC<SplashProps> = ({ history }) => {
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  // Spinner
  useEffect(() => {
    const timeout = setTimeout(() => setSpinnerVisible(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  // Notificare, onReady
  useEffect(() => {
    Notificare.on('ready', async () => {
      try {
        await Notificare.addTag('ionic');

        await fetchConfig();
        await fetchCustomScript();
        await fetchPassbookTemplate();

        const introShown = await getOnboardingStatus();
        console.log(`introShown: ${introShown}`);
        history.replace(introShown ? '/home' : '/onboarding');
      } catch (e) {
        console.log(`Something went wrong: ${e}`);
        Plugins.App.exitApp();
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchConfig = async () => {
    console.log('Fetching configuration assets.');

    const asset = (await Notificare.fetchAssets('CONFIG')).pop();
    if (asset == null) {
      console.warn(
        'The Notificare app is not correctly configured. Missing the CONFIG asset group and/or demoSourceConfig.json',
      );
      return;
    }

    const { data } = await HTTP.get(asset.assetUrl!, {}, {});
    await setDemoSourceConfig(JSON.parse(data));
  };

  const fetchCustomScript = async () => {
    console.log('Fetching custom script assets.');

    const asset = (await Notificare.fetchAssets('CUSTOMJS')).pop();
    if (asset == null) {
      console.warn(
        'The Notificare app is not correctly configured. Missing the CUSTOMJS asset group and/or customScriptsDemo.js',
      );
      return;
    }

    const { data } = await HTTP.get(asset.assetUrl!, {}, {});
    await setCustomScript(data);
  };

  const fetchPassbookTemplate = async () => {
    console.log('Fetching passbook template.');

    const demoSourceConfig = await getDemoSourceConfig();
    const result = await Notificare.doCloudHostOperation('GET', '/passbook', null, null, null);

    const templates = result.passbooks as any[];
    for (let template of templates) {
      if (template._id === demoSourceConfig!.memberCard.templateId) {
        await setMemberCardTemplate(template);
      }
    }
  };

  return (
    <PageContainer noHeader>
      <Center>
        <IonImg src={LogoImage} className="logo" />
      </Center>

      {spinnerVisible && <IonSpinner className="spinner" />}
    </PageContainer>
  );
};

interface SplashProps extends RouteComponentProps {}
