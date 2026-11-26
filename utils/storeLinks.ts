/** Store listings for the Affetto app. */
export const ANDROID_PACKAGE = 'com.luanderson_eng_software.affetto';
export const IOS_APP_STORE_ID = '6756904115';

export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
/** Brazilian App Store listing. Campaign CTAs start from this URL. */
export const APP_STORE_URL = `https://apps.apple.com/br/app/affetto-cupons-e-vales/id${IOS_APP_STORE_ID}`;

export type StorePlatform = 'ios' | 'android' | 'desktop';

/** iPhone, iPad and iPadOS (which reports a Mac user agent with touch). */
export function isAppleMobile(userAgent: string, maxTouchPoints = 0): boolean {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return true;
  return /Macintosh/i.test(userAgent) && maxTouchPoints > 1;
}

/**
 * Legacy helper: App Store on iOS, Google Play everywhere else.
 * Redeem and home CTAs must use `appStoreCampaignUrl` instead. The Play
 * listing is not available yet.
 */
export function appStoreUrlFor(userAgent: string, maxTouchPoints = 0): string {
  return isAppleMobile(userAgent, maxTouchPoints) ? APP_STORE_URL : PLAY_STORE_URL;
}

/** iOS (including iPadOS), Android, or everything else. */
export function detectStorePlatform(userAgent: string, maxTouchPoints = 0): StorePlatform {
  if (isAppleMobile(userAgent, maxTouchPoints)) return 'ios';
  if (/Android/i.test(userAgent)) return 'android';
  return 'desktop';
}

function trimmed(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const text = value.trim();
  return text.length > 0 ? text : undefined;
}

/**
 * App Store campaign link.
 * Query order: `pt` (only when a provider token exists), then `ct`, then `mt=8`.
 * An explicit non-empty `providerToken` wins. Otherwise the value is
 * `VITE_APPLE_PROVIDER_TOKEN`. An empty token omits `pt`.
 */
export function appStoreCampaignUrl(campaignToken: string, providerToken?: string): string {
  const url = new URL(APP_STORE_URL);
  const pt = trimmed(providerToken) ?? trimmed(import.meta.env.VITE_APPLE_PROVIDER_TOKEN);
  if (pt) url.searchParams.append('pt', pt);
  url.searchParams.append('ct', campaignToken);
  url.searchParams.append('mt', '8');
  return url.toString();
}
