export interface NotificareAsset {
  assetTitle?: string;
  assetDescription?: string;
  assetUrl?: string;

  assetMetaData?: {
    originalFileName?: string;
    key?: string;
    contentType?: string;
    contentLength?: string;
  };
}
