import { describe, expect, it } from 'vitest';
import { APP_STORE_URL, PLAY_STORE_URL, appStoreUrlFor } from './storeLinks';

describe('appStoreUrlFor', () => {
  it('points Android and desktop browsers to the Affetto Play listing', () => {
    expect(PLAY_STORE_URL).toBe(
      'https://play.google.com/store/apps/details?id=com.luanderson_eng_software.affetto',
    );
    expect(appStoreUrlFor('Mozilla/5.0 (Linux; Android 14; Pixel 8)')).toBe(PLAY_STORE_URL);
    expect(appStoreUrlFor('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe(PLAY_STORE_URL);
    expect(appStoreUrlFor('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 0)).toBe(PLAY_STORE_URL);
  });

  it('points iPhone and iPad to the App Store listing', () => {
    expect(APP_STORE_URL).toBe('https://apps.apple.com/app/id6756904115');
    expect(appStoreUrlFor('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe(APP_STORE_URL);
    expect(appStoreUrlFor('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 5)).toBe(APP_STORE_URL);
  });

  it('never points to the old com.cuponsdoamor listing', () => {
    expect(appStoreUrlFor('Android')).not.toContain('cuponsdoamor');
  });
});
