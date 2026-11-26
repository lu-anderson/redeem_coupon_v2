import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics';
import { readFirebaseWebConfig } from '../config/firebaseEnv';
import { getFirebaseApp } from './firebase';

export type AnalyticsParams = Record<string, string | boolean>;

export type StoreCtaPlacement = 'home' | 'redeem_success';
export type StoreCtaPlatform = 'ios' | 'android' | 'desktop';

let analyticsPromise: Promise<Analytics | null> | null = null;

/**
 * Lazily creates Analytics only when a measurement ID is configured and the
 * SDK reports support. Reuses the Firebase app from `services/firebase.ts`.
 * Failures resolve to null so callers can no-op.
 */
function loadAnalytics(): Promise<Analytics | null> {
  if (!analyticsPromise) {
    analyticsPromise = createAnalytics().catch(() => null);
  }
  return analyticsPromise;
}

async function createAnalytics(): Promise<Analytics | null> {
  const { measurementId } = readFirebaseWebConfig(import.meta.env);
  if (!measurementId) return null;

  const supported = await isSupported();
  if (!supported) return null;

  const app = getFirebaseApp();
  if (!app) return null;

  return getAnalytics(app as Parameters<typeof getAnalytics>[0]);
}

/** Never throws and never rejects. Missing config, blocked SDKs, and log failures are ignored. */
export function logAnalyticsEvent(eventName: string, params?: AnalyticsParams): Promise<void> {
  return loadAnalytics()
    .then((analytics) => {
      if (!analytics) return;
      logEvent(analytics, eventName, params);
    })
    .catch(() => {
      // Analytics must not break redemption or navigation.
    });
}

export function trackPageView(pagePath: string): Promise<void> {
  return logAnalyticsEvent('page_view', { page_path: pagePath });
}

/** Category and premium flag only. Do not pass names, emails, or other PII. */
export function trackCouponRedeemed(params: { category: string; is_premium: boolean }): Promise<void> {
  return logAnalyticsEvent('coupon_redeemed', {
    category: params.category,
    is_premium: params.is_premium,
  });
}

export function trackStoreCtaClick(params: {
  placement: StoreCtaPlacement;
  platform: StoreCtaPlatform;
}): Promise<void> {
  return logAnalyticsEvent('store_cta_click', {
    placement: params.placement,
    platform: params.platform,
  });
}
