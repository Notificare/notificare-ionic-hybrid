import { isPlatform } from '@ionic/react';

export function getPlatformName(): string | undefined {
  if (isPlatform('android')) return 'Android';
  if (isPlatform('ios')) return 'iOS';
}
