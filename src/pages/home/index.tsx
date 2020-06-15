import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router';
import { PageContainer } from '../../components/page-container';

export const Home: FC<HomeProps> = ({ history }) => {
  return (
    <PageContainer noHeader>
      <iframe title="Home" src={`https://demo.notificare.com/hybrid-app`} className="full-iframe" />
    </PageContainer>
  );
};

interface HomeProps extends RouteComponentProps {}
