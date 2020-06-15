import { isPlatform } from '@ionic/react';

export function getPlatformName(): string | undefined {
  if (isPlatform('android')) return 'Android';
  if (isPlatform('ios')) return 'iOS';
}

export function trimSlashes(str: string): string {
  let result = str;

  if (result.startsWith('/')) {
    result = result.slice(1);
  }

  if (result.endsWith('/')) {
    result = result.slice(0, result.length - 1);
  }

  return result;
}
