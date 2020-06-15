import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';

export const Onboarding: FC<OnboardingProps> = ({ history }) => {
  return (
    <PageContainer noHeader>
      <Center></Center>
    </PageContainer>
  );
};

interface OnboardingProps extends RouteComponentProps {}
