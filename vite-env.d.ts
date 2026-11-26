/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  /** Optional GA4 measurement ID. Analytics stays off when this is empty. */
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string
  /** Optional App Store Connect provider / campaign token (pt). */
  readonly VITE_APPLE_PROVIDER_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
