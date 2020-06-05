import React, { FC, FormEvent, useState } from 'react';
import { IonCol, IonGrid, IonRow, IonSearchbar, IonSpinner } from '@ionic/react';
import { AssetItem } from '../../components/asset-item';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { useNetworkRequest } from '../../lib/network-request';
import { NotificareAsset } from '../../lib/notificare/models';

export const Storage: FC = () => {
  const [search, setSearch] = useState('');
  const [request, requestActions] = useNetworkRequest(
    () =>
      new Promise<NotificareAsset[]>((resolve, reject) =>
        resolve([
          {
            assetTitle: 'asdasd',
            assetUrl: 'https://placekitten.com/g/200/300',
          },
          {
            assetTitle: 'asdasd',
            assetUrl: 'https://placekitten.com/g/200/300',
          },
          {
            assetTitle: 'asdasd',
            assetUrl: 'https://placekitten.com/g/200/300',
          },
          {
            assetTitle: 'asdasd',
            assetUrl: 'https://placekitten.com/g/200/300',
          },
          {
            assetTitle: 'asdasd',
            assetUrl: 'https://placekitten.com/g/200/300',
          },
          {
            assetTitle: 'asdasd',
            assetUrl: 'https://placekitten.com/g/200/300',
          },
          {
            assetTitle: 'asdasd',
            assetUrl: 'https://placekitten.com/g/200/300',
          },
        ]),
      ),
  );

  const onSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    requestActions.start().catch(() => {});
  };

  return (
    <PageContainer title="Storage">
      <form onSubmit={onSearchSubmit}>
        <IonSearchbar
          placeholder="Search for an asset group"
          value={search}
          onIonChange={(e) => setSearch(e.detail.value!)}
        />
      </form>

      {request.status === 'idle' && (
        <Center>Use the search option above to search for asset groups created in the dashboard.</Center>
      )}

      {request.status === 'pending' && (
        <Center>
          <IonSpinner />
        </Center>
      )}

      {request.status === 'successful' && request.result.length === 0 && <Center>No assets found.</Center>}

      {request.status === 'successful' && request.result.length > 0 && (
        <IonGrid>
          <IonRow>
            {request.result.map((asset, index) => (
              <IonCol key={index} size="6">
                <AssetItem asset={asset} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      )}
    </PageContainer>
  );
};
