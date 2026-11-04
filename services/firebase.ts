import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import {
  missingFirebaseEnvVars,
  readFirebaseWebConfig,
  type FirebaseWebConfig,
  type RequiredFirebaseEnvVar,
} from '../config/firebaseEnv';

/**
 * Thrown when the web app was built or started without Firebase config.
 * Initializing Firestore with an undefined projectId opens Listen channels to
 * `projects/undefined` that never settle, so callers must fail before that.
 */
export class FirebaseConfigError extends Error {
  readonly missing: readonly RequiredFirebaseEnvVar[];

  constructor(missing: readonly RequiredFirebaseEnvVar[]) {
    super(
      `Firebase config is incomplete. Missing environment variables: ${missing.join(', ')}`,
    );
    this.name = 'FirebaseConfigError';
    this.missing = missing;
  }
}

export type FirebaseServices = {
  db: Firestore | null;
  missing: RequiredFirebaseEnvVar[];
  app: FirebaseApp | null;
};

function toFirebaseOptions(config: FirebaseWebConfig): FirebaseOptions {
  const options: FirebaseOptions = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    appId: config.appId,
  };
  if (config.storageBucket) options.storageBucket = config.storageBucket;
  if (config.messagingSenderId) options.messagingSenderId = config.messagingSenderId;
  return options;
}

/**
 * Creates the Firestore client only when apiKey, authDomain, projectId, and
 * appId are all non-empty. Otherwise returns a null db so nothing can hang
 * on an undefined project.
 */
export function createFirebaseServices(config: FirebaseWebConfig): FirebaseServices {
  const missing = missingFirebaseEnvVars(config);
  if (missing.length > 0) {
    return { db: null, missing, app: null };
  }

  const app = initializeApp(toFirebaseOptions(config));
  return { db: getFirestore(app), missing, app };
}

const services = createFirebaseServices(readFirebaseWebConfig(import.meta.env));

export const db: Firestore | null = services.db;

export function isFirebaseConfigured(): boolean {
  return services.missing.length === 0 && services.db != null;
}

export function assertFirebaseConfigured(): void {
  if (!services.db || services.missing.length > 0) {
    throw new FirebaseConfigError(services.missing);
  }
}

export function requireDb(): Firestore {
  assertFirebaseConfigured();
  return services.db as Firestore;
}
