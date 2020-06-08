import { AppVersion } from '@ionic-native/app-version';
import { Dialogs } from '@ionic-native/dialogs';

export async function showAlertDialog(message: string) {
  try {
    const appName = await AppVersion.getAppName();

    Dialogs.alert(message, appName).catch(() => {});
  } catch (e) {
    console.log(`Failed to show the alert dialog: ${e.message}`);
  }
}
