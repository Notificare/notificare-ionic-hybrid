import { AppVersion } from '@ionic-native/app-version';
import { Dialogs } from '@ionic-native/dialogs';
import md5 from 'md5';

export async function showAlertDialog(message: string, options?: DialogOptions) {
  try {
    const appName = await AppVersion.getAppName();

    Dialogs.alert(message, appName)
      .then(() => options?.onDismiss?.())
      .catch(() => {});
  } catch (e) {
    console.log(`Failed to show the alert dialog: ${e}`);
  }
}

interface DialogOptions {
  onDismiss?: () => void;
  onPositiveButtonClick?: () => void;
}

export function createGravatarUrl(email: string): string {
  email = email.toLowerCase().trim();
  const hash = md5(email);
  return `https://gravatar.com/avatar/${hash}?s=512`;
}
