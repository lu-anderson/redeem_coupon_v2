/**
 * Public Firebase web config env var names.
 * Values stay in gitignored env files; this module only lists names.
 */
export const REQUIRED_FIREBASE_ENV_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

export const OPTIONAL_FIREBASE_ENV_VARS = [
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
] as const;

export const FIREBASE_ENV_VARS = [
  ...REQUIRED_FIREBASE_ENV_VARS,
  ...OPTIONAL_FIREBASE_ENV_VARS,
] as const;

export type RequiredFirebaseEnvVar = (typeof REQUIRED_FIREBASE_ENV_VARS)[number];

export const FIREBASE_ENV_TO_CONFIG_KEY = {
  VITE_FIREBASE_API_KEY: 'apiKey',
  VITE_FIREBASE_AUTH_DOMAIN: 'authDomain',
  VITE_FIREBASE_PROJECT_ID: 'projectId',
  VITE_FIREBASE_APP_ID: 'appId',
} as const;

export type FirebaseWebConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
};

function nonEmpty(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export type FirebaseEnvSource = {
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  VITE_FIREBASE_STORAGE_BUCKET?: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  VITE_FIREBASE_APP_ID?: string;
};

export function readFirebaseWebConfig(env: FirebaseEnvSource): FirebaseWebConfig {
  return {
    apiKey: nonEmpty(env.VITE_FIREBASE_API_KEY),
    authDomain: nonEmpty(env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: nonEmpty(env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: nonEmpty(env.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: nonEmpty(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    appId: nonEmpty(env.VITE_FIREBASE_APP_ID),
  };
}

/** Names of required variables that are absent. Never returns values. */
export function missingFirebaseEnvVars(config: FirebaseWebConfig): RequiredFirebaseEnvVar[] {
  return (Object.entries(FIREBASE_ENV_TO_CONFIG_KEY) as [RequiredFirebaseEnvVar, keyof FirebaseWebConfig][])
    .filter(([, field]) => !nonEmpty(config[field]))
    .map(([envName]) => envName);
}
