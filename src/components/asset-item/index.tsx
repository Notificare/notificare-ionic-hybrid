import React, { FC } from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonImg } from '@ionic/react';
import AssetCss from '../../assets/images/asset_css.png';
import AssetHtml from '../../assets/images/asset_html.png';
import AssetJavascript from '../../assets/images/asset_js.png';
import AssetJson from '../../assets/images/asset_json.png';
import AssetPdf from '../../assets/images/asset_pdf.png';
import AssetSound from '../../assets/images/asset_sound.png';
import AssetText from '../../assets/images/asset_text.png';
import AssetVideo from '../../assets/images/asset_video.png';
import './index.scss';

export const AssetItem: FC<AssetItemProps> = ({ asset, onClick }) => {
  const assetImage = computeAssetImage(asset);

  return (
    <IonCard onClick={onClick}>
      {assetImage && <IonImg src={assetImage} className="asset-image" />}
      <IonCardHeader>
        <IonCardSubtitle>{asset.assetTitle}</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );
};

interface AssetItemProps {
  asset: any;
  onClick: () => void;
}

function computeAssetImage(asset: any): string | undefined {
  const contentType = asset.assetMetaData?.contentType;

  switch (contentType) {
    case 'image/jpeg':
    case 'image/gif':
    case 'image/png':
      return asset.assetUrl;
    case 'video/mp4':
      return AssetVideo;
    case 'application/pdf':
      return AssetPdf;
    case 'application/json':
      return AssetJson;
    case 'text/javascript':
      return AssetJavascript;
    case 'text/css':
      return AssetCss;
    case 'text/html':
      return AssetHtml;
    case 'audio/mp3':
      return AssetSound;
    default:
      return AssetText;
  }
}
