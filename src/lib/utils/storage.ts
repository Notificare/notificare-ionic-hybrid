import { Storage } from '@capacitor/core';

const KEY_ONBOARDING_STATUS = 'onboarding_status';
const KEY_DEMO_SOURCE_CONFIG = 'demo_source_config';
const KEY_CUSTOM_SCRIPT = 'custom_script';
const KEY_MEMBER_CARD_TEMPLATE = 'member_card_template';
const KEY_MEMBER_CARD_SERIAL = 'member_card_serial';

export async function getOnboardingStatus(): Promise<boolean> {
  const status = await Storage.get({ key: KEY_ONBOARDING_STATUS });
  return Boolean(status);
}

export async function setOnboardingStatus(status: boolean): Promise<void> {
  await Storage.set({
    key: KEY_ONBOARDING_STATUS,
    value: status.toString(),
  });
}

export async function getDemoSourceConfig(): Promise<DemoSourceConfig | undefined> {
  const { value } = await Storage.get({ key: KEY_DEMO_SOURCE_CONFIG });
  if (value == null) return undefined;

  try {
    return JSON.parse(value);
  } catch (e) {
    console.log("Failed to parse the demo source config. Cleaning up what's stored.", e);
    return undefined;
  }
}

export async function setDemoSourceConfig(config: DemoSourceConfig): Promise<void> {
  await Storage.set({
    key: KEY_DEMO_SOURCE_CONFIG,
    value: JSON.stringify(config),
  });
}

export async function getCustomScript(): Promise<string | undefined> {
  const { value } = await Storage.get({ key: KEY_CUSTOM_SCRIPT });
  return value;
}

export async function setCustomScript(customScript: string): Promise<void> {
  await Storage.set({
    key: KEY_CUSTOM_SCRIPT,
    value: customScript,
  });
}

export async function getMemberCardTemplate(): Promise<Record<string, any> | undefined> {
  const { value } = await Storage.get({ key: KEY_MEMBER_CARD_TEMPLATE });
  if (value == null) return undefined;

  return JSON.parse(value);
}

export async function setMemberCardTemplate(template: Record<string, any>): Promise<void> {
  await Storage.set({
    key: KEY_MEMBER_CARD_TEMPLATE,
    value: JSON.stringify(template),
  });
}

export async function getMemberCardSerial(): Promise<string | undefined> {
  const { value } = await Storage.get({ key: KEY_MEMBER_CARD_SERIAL });
  return value;
}

export async function setMemberCardSerial(serial: string): Promise<void> {
  await Storage.set({
    key: KEY_MEMBER_CARD_SERIAL,
    value: serial,
  });
}

// region Types

export interface DemoSourceConfig {
  config: {
    useLocationServices: boolean;
    useNavigationDrawer: boolean;
  };
  url: string;
  urlScheme: string;
  host: string;
  email: string;
  memberCard: {
    templateId: string;
    primaryFields: [MemberCardField];
    secondaryFields: [MemberCardField];
  };
}

export interface MemberCardField {
  name?: string;
  email?: string;
}

// endregion
