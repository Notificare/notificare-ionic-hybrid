import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';

export const Regions: FC<RegionsProps> = () => {
  return (
    <PageContainer title="Regions">
      <Center>
        There is no Capacitor support for Google Maps at the time of development.
        <br />
        <small>
          <a href="https://github.com/mapsplugin/cordova-plugin-googlemaps/issues/2781" target="_blank">
            Keep track of the issue
          </a>
        </small>
      </Center>
    </PageContainer>
  );
};

interface RegionsProps extends RouteComponentProps {}
