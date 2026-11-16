/** Store listings for the Affetto app. */
export const ANDROID_PACKAGE = 'com.luanderson_eng_software.affetto';
export const IOS_APP_STORE_ID = '6756904115';

export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
export const APP_STORE_URL = `https://apps.apple.com/app/id${IOS_APP_STORE_ID}`;

/** iPhone, iPad and iPadOS (which reports a Mac user agent with touch). */
export function isAppleMobile(userAgent: string, maxTouchPoints = 0): boolean {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return true;
  return /Macintosh/i.test(userAgent) && maxTouchPoints > 1;
}

/** App Store on iOS devices; Google Play everywhere else. */
export function appStoreUrlFor(userAgent: string, maxTouchPoints = 0): string {
  return isAppleMobile(userAgent, maxTouchPoints) ? APP_STORE_URL : PLAY_STORE_URL;
}
