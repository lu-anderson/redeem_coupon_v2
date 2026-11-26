import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  appStoreCampaignUrl,
  appStoreUrlFor,
  detectStorePlatform,
} from './storeLinks';

const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)';
const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)';
const MAC_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)';
const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8)';
const WINDOWS_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

describe('store links', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_APPLE_PROVIDER_TOKEN', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the official App Store product page', () => {
    expect(APP_STORE_URL).toBe('https://apps.apple.com/app/apple-store/id6756904115');
    expect(PLAY_STORE_URL).toBe(
      'https://play.google.com/store/apps/details?id=com.luanderson_eng_software.affetto',
    );
  });

  it('detects iPhone, iPad, and iPadOS as ios', () => {
    expect(detectStorePlatform(IPHONE_UA)).toBe('ios');
    expect(detectStorePlatform(IPAD_UA)).toBe('ios');
    expect(detectStorePlatform(MAC_UA, 5)).toBe('ios');
  });

  it('detects Android, Windows, and desktop Mac', () => {
    expect(detectStorePlatform(ANDROID_UA)).toBe('android');
    expect(detectStorePlatform(WINDOWS_UA)).toBe('desktop');
    expect(detectStorePlatform(MAC_UA, 0)).toBe('desktop');
  });

  it('keeps the legacy helper on the new App Store URL for iOS and Play elsewhere', () => {
    expect(appStoreUrlFor(IPHONE_UA)).toBe(APP_STORE_URL);
    expect(appStoreUrlFor(MAC_UA, 5)).toBe(APP_STORE_URL);
    expect(appStoreUrlFor(ANDROID_UA)).toBe(PLAY_STORE_URL);
    expect(appStoreUrlFor(WINDOWS_UA)).toBe(PLAY_STORE_URL);
    expect(appStoreUrlFor(MAC_UA, 0)).toBe(PLAY_STORE_URL);
    expect(appStoreUrlFor(ANDROID_UA)).not.toContain('cuponsdoamor');
  });

  it('builds a campaign URL with the default provider token, ct, and mt', () => {
    const url = new URL(appStoreCampaignUrl('web_redeem'));

    expect(url.origin + url.pathname).toBe(APP_STORE_URL);
    expect(url.search).toBe('?pt=128372888&ct=web_redeem&mt=8');
    expect(url.searchParams.get('pt')).toBe('128372888');
    expect(url.searchParams.get('ct')).toBe('web_redeem');
    expect(url.searchParams.get('mt')).toBe('8');
  });

  it('appends an explicit provider token before ct and mt', () => {
    const url = appStoreCampaignUrl('web_home', '  test-provider  ');

    expect(url.split('?')[1]).toBe('pt=test-provider&ct=web_home&mt=8');
  });

  it('reads the provider token from the environment when the argument is absent', () => {
    vi.stubEnv('VITE_APPLE_PROVIDER_TOKEN', 'env-provider');

    expect(appStoreCampaignUrl('web_home').split('?')[1]).toBe('pt=env-provider&ct=web_home&mt=8');
  });

  it('prefers an explicit provider token over the environment', () => {
    vi.stubEnv('VITE_APPLE_PROVIDER_TOKEN', 'env-provider');

    expect(appStoreCampaignUrl('web_redeem', 'explicit-provider').split('?')[1]).toBe(
      'pt=explicit-provider&ct=web_redeem&mt=8',
    );
  });

  it('falls back to the environment when the explicit token is blank', () => {
    vi.stubEnv('VITE_APPLE_PROVIDER_TOKEN', ' env-provider ');

    expect(appStoreCampaignUrl('web_home', '   ').split('?')[1]).toBe('pt=env-provider&ct=web_home&mt=8');
  });

  it('falls back to the default provider token when the environment token is blank', () => {
    vi.stubEnv('VITE_APPLE_PROVIDER_TOKEN', '   ');

    expect(appStoreCampaignUrl('web_home').split('?')[1]).toBe('pt=128372888&ct=web_home&mt=8');
  });
});
