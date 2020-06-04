import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router';
import { PageContainer } from '../../components/page-container';

export const Inbox: FC<InboxProps> = () => {
  return <PageContainer title="Inbox"></PageContainer>;
};

interface InboxProps extends RouteComponentProps {}
