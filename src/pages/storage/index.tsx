import React, { FC, FormEvent, useState } from 'react';
import { Notificare, NotificareAsset } from '@ionic-native/notificare';
import { IonCol, IonGrid, IonRow, IonSearchbar, IonSpinner } from '@ionic/react';
import { AssetItem } from '../../components/asset-item';
import { Center } from '../../components/center';
import { PageContainer } from '../../components/page-container';
import { useNetworkRequest } from '../../lib/network-request';

export const Storage: FC = () => {
  const [search, setSearch] = useState('LANDSCAPES');
  const [request, requestActions] = useNetworkRequest(() => Notificare.fetchAssets(search));

  const onSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    requestActions.start().catch(() => {});
  };

  const onShowAsset = async (asset: NotificareAsset) => {
    const contentType = asset.assetMetaData?.contentType;
    switch (contentType) {
      case 'image/jpeg':
      case 'image/gif':
      case 'image/png':
      case 'video/mp4':
      case 'application/pdf':
      case 'text/html':
      case 'audio/mp3':
        if (asset.assetUrl != null) {
          window.open(asset.assetUrl);
        }
        break;
    }
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
                <AssetItem asset={asset} onClick={() => onShowAsset(asset)} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      )}

      {request.status === 'failed' && <Center>Asset group not found.</Center>}
    </PageContainer>
  );
};
