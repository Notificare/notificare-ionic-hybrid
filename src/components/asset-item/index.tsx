import React, { FC } from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonImg } from '@ionic/react';
import { NotificareAsset } from '../../lib/notificare/models';
import './index.scss';

export const AssetItem: FC<AssetItemProps> = ({ asset }) => {
  return (
    <IonCard>
      {asset.assetUrl && <IonImg src={asset.assetUrl} className="asset-image" />}
      <IonCardHeader>
        <IonCardSubtitle>{asset.assetTitle}</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );
};

interface AssetItemProps {
  asset: NotificareAsset;
}
