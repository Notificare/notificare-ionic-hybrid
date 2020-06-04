import React, { FC, useState } from 'react';
import { IonList, IonSpinner } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { Center } from '../../components/center';
import { InboxItem } from '../../components/inbox-item';
import { PageContainer } from '../../components/page-container';

export const Inbox: FC<InboxProps> = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([{ title: 'asdasd', message: 'asdasdasd', time: '...', open: false }]);

  return (
    <PageContainer title="Inbox">
      {loading && (
        <Center>
          <IonSpinner />
        </Center>
      )}

      {!loading && (
        <>
          {data.length === 0 && (
            <Center>
              <p>No messages found</p>
            </Center>
          )}

          {data.length > 0 && (
            <IonList lines="full">
              {data.map((value, index) => (
                <InboxItem key={index} item={value} />
              ))}
            </IonList>
          )}
        </>
      )}
    </PageContainer>
  );
};

interface InboxProps extends RouteComponentProps {}
