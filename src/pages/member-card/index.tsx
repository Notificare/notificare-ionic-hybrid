import React, { FC } from 'react';
import { IonSpinner } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { useNetworkRequest } from '../../lib/network-request';
import { getMemberCardSerial } from '../../lib/utils/storage';
import './index.scss';

export const MemberCard: FC<MemberCardProps> = () => {
  const [request] = useNetworkRequest(() => getMemberCardSerial(), {
    autoStart: true,
  });

  return (
    <PageContainer title="Member card">
      {request.status === 'pending' && (
        <Center>
          <IonSpinner />
        </Center>
      )}

      {request.status === 'successful' && (
        <iframe
          title="Member card"
          src={`https://push.notifica.re/pass/web/${request.result}?showWebVersion=1`}
          className="full-iframe"
        />
      )}
    </PageContainer>
  );
};

interface MemberCardProps extends RouteComponentProps {}
