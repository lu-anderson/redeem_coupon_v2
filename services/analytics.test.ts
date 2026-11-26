import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const analyticsSdk = vi.hoisted(() => ({
  getAnalytics: vi.fn(() => ({ name: 'analytics' })),
  isSupported: vi.fn(async () => true),
  logEvent: vi.fn(),
}));

const firebaseApp = vi.hoisted(() => ({
  current: { name: 'app' } as { name: string } | null,
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: analyticsSdk.getAnalytics,
  isSupported: analyticsSdk.isSupported,
  logEvent: analyticsSdk.logEvent,
}));

vi.mock('./firebase', () => ({
  getFirebaseApp: () => firebaseApp.current,
}));

async function loadAnalytics() {
  vi.resetModules();
  return import('./analytics');
}

describe('analytics', () => {
  beforeEach(() => {
    analyticsSdk.getAnalytics.mockReset();
    analyticsSdk.getAnalytics.mockReturnValue({ name: 'analytics' });
    analyticsSdk.isSupported.mockReset();
    analyticsSdk.isSupported.mockResolvedValue(true);
    analyticsSdk.logEvent.mockReset();
    firebaseApp.current = { name: 'app' };
    vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('does not initialize when the measurement id is missing', async () => {
    const { trackPageView } = await loadAnalytics();

    await expect(trackPageView('/')).resolves.toBeUndefined();
    expect(analyticsSdk.isSupported).not.toHaveBeenCalled();
    expect(analyticsSdk.getAnalytics).not.toHaveBeenCalled();
    expect(analyticsSdk.logEvent).not.toHaveBeenCalled();
  });

  it('does not initialize when analytics is not supported', async () => {
    vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'G-TEST');
    analyticsSdk.isSupported.mockResolvedValue(false);
    const { trackStoreCtaClick } = await loadAnalytics();

    await expect(
      trackStoreCtaClick({ placement: 'home', platform: 'android' }),
    ).resolves.toBeUndefined();
    expect(analyticsSdk.getAnalytics).not.toHaveBeenCalled();
    expect(analyticsSdk.logEvent).not.toHaveBeenCalled();
  });

  it('does not throw when support detection or initialization fails', async () => {
    vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'G-TEST');
    analyticsSdk.isSupported.mockRejectedValue(new Error('unavailable'));
    const rejected = await loadAnalytics();
    await expect(rejected.trackPageView('/')).resolves.toBeUndefined();

    analyticsSdk.isSupported.mockResolvedValue(true);
    analyticsSdk.getAnalytics.mockImplementation(() => {
      throw new Error('init failed');
    });
    const initFailed = await loadAnalytics();
    await expect(initFailed.trackPageView('/')).resolves.toBeUndefined();
    expect(analyticsSdk.logEvent).not.toHaveBeenCalled();

    firebaseApp.current = null;
    analyticsSdk.getAnalytics.mockReturnValue({ name: 'analytics' });
    const missingApp = await loadAnalytics();
    await expect(missingApp.trackPageView('/')).resolves.toBeUndefined();
    expect(analyticsSdk.logEvent).not.toHaveBeenCalled();
  });

  it('logs page views, redemptions, and store clicks when analytics is supported', async () => {
    vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'G-TEST');
    const { trackPageView, trackCouponRedeemed, trackStoreCtaClick } = await loadAnalytics();

    await trackPageView('/redeem/coupon-1?src=share');
    await trackCouponRedeemed({ category: 'Picante +18 (Premium)', is_premium: true });
    await trackStoreCtaClick({ placement: 'redeem_success', platform: 'ios' });

    expect(analyticsSdk.getAnalytics).toHaveBeenCalledTimes(1);
    expect(analyticsSdk.getAnalytics).toHaveBeenCalledWith({ name: 'app' });
    expect(analyticsSdk.logEvent).toHaveBeenNthCalledWith(1, { name: 'analytics' }, 'page_view', {
      page_path: '/redeem/coupon-1?src=share',
    });
    expect(analyticsSdk.logEvent).toHaveBeenNthCalledWith(2, { name: 'analytics' }, 'coupon_redeemed', {
      category: 'Picante +18 (Premium)',
      is_premium: true,
    });
    expect(analyticsSdk.logEvent).toHaveBeenNthCalledWith(3, { name: 'analytics' }, 'store_cta_click', {
      placement: 'redeem_success',
      platform: 'ios',
    });
    expect(analyticsSdk.logEvent.mock.calls[1][2]).not.toHaveProperty('userName');
  });

  it('does not throw when logEvent fails', async () => {
    vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'G-TEST');
    analyticsSdk.logEvent.mockImplementation(() => {
      throw new Error('blocked');
    });
    const { trackCouponRedeemed } = await loadAnalytics();

    await expect(
      trackCouponRedeemed({ category: 'Românticos & Afetivos', is_premium: false }),
    ).resolves.toBeUndefined();
  });
});
