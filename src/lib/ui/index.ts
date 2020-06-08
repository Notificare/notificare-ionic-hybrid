import { AppVersion } from '@ionic-native/app-version';
import { Dialogs } from '@ionic-native/dialogs';

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
