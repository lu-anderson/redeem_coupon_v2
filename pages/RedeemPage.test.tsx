import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { act, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { COUPON_FETCH_TIMEOUT_MS } from '../utils/withTimeout';
import RedeemPage from './RedeemPage';

const analyticsMocks = vi.hoisted(() => ({
  trackCouponRedeemed: vi.fn(() => Promise.resolve()),
  trackStoreCtaClick: vi.fn(() => Promise.resolve()),
  trackPageView: vi.fn(() => Promise.resolve()),
}));

vi.mock('../services/analytics', () => analyticsMocks);

const firebaseState = vi.hoisted(() => ({
  configured: true,
}));

const firestoreMocks = vi.hoisted(() => ({
  getDoc: vi.fn(),
  doc: vi.fn(() => ({ path: 'coupons/coupon-1' })),
  runTransaction: vi.fn(),
  collection: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

vi.mock('../services/firebase', () => {
  class FirebaseConfigError extends Error {
    constructor(missing: string[]) {
      super(
        `Firebase config is incomplete. Missing environment variables: ${missing.join(', ')}`,
      );
      this.name = 'FirebaseConfigError';
    }
  }

  const missing = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const assertFirebaseConfigured = () => {
    if (!firebaseState.configured) {
      throw new FirebaseConfigError(missing);
    }
  };

  return {
    FirebaseConfigError,
    db: null,
    isFirebaseConfigured: () => firebaseState.configured,
    assertFirebaseConfigured,
    requireDb: () => {
      assertFirebaseConfigured();
      return { name: 'mock-db' };
    },
  };
});

vi.mock('firebase/firestore', () => firestoreMocks);

const premiumCouponData = {
  userId: 'user-1',
  name: 'Noite surpresa',
  category: 'Picante +18 (Premium)',
  quantity: 2,
  originalQuantity: 2,
  isActive: true,
  observations: '',
  rarity: '⭐⭐⭐',
  expirationDate: null,
  createdAt: new Date('2026-08-01T00:00:00.000Z'),
};

function couponSnapshot(data: Record<string, unknown> = premiumCouponData) {
  return {
    exists: () => true,
    id: 'coupon-1',
    data: () => data,
  };
}

function renderRedeem(path: string) {
  const ui: ReactElement = (
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/redeem" element={<RedeemPage />} />
        <Route path="/redeem/:id" element={<RedeemPage />} />
      </Routes>
    </MemoryRouter>
  );
  return render(ui);
}

const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)';
const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8)';
const DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

function mockNavigator(userAgent: string, maxTouchPoints = 0) {
  vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(userAgent);
  Object.defineProperty(window.navigator, 'maxTouchPoints', {
    configurable: true,
    value: maxTouchPoints,
  });
}

describe('RedeemPage', () => {
  beforeEach(() => {
    firebaseState.configured = true;
    firestoreMocks.getDoc.mockReset();
    firestoreMocks.doc.mockClear();
    analyticsMocks.trackCouponRedeemed.mockClear();
    analyticsMocks.trackStoreCtaClick.mockClear();
    vi.stubEnv('VITE_APPLE_PROVIDER_TOKEN', '');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('renders the redeem UI for a premium coupon with a null expiration date', async () => {
    firestoreMocks.getDoc.mockResolvedValue(couponSnapshot());

    renderRedeem('/redeem/coupon-1');

    expect(await screen.findByRole('heading', { name: 'Resgatar Cupom' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Noite surpresa' })).toBeInTheDocument();
    expect(screen.getByText('Picante +18 (Premium)')).toBeInTheDocument();
    expect(screen.getByText('Sem validade')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Raridade: 3 estrelas' })).toBeInTheDocument();
    expect(screen.getByTestId('coupon-card-header').querySelector('[data-art="luc:flame"]')).not.toBeNull();
    expect(screen.queryByText(/observações/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resgatar Agora' })).toBeInTheDocument();
    expect(screen.getByText('Affetto')).toBeInTheDocument();
    expect(firestoreMocks.getDoc).toHaveBeenCalledTimes(1);
  });

  it('shows an error with retry when the coupon fetch is rejected', async () => {
    firestoreMocks.getDoc.mockRejectedValueOnce(new Error('network down'));

    renderRedeem('/redeem/coupon-1');

    expect(await screen.findByRole('alert')).toHaveTextContent('Erro ao carregar o cupom. Tente novamente.');
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();

    firestoreMocks.getDoc.mockResolvedValueOnce(couponSnapshot());
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByRole('heading', { name: 'Resgatar Cupom' })).toBeInTheDocument();
    expect(firestoreMocks.getDoc).toHaveBeenCalledTimes(2);
  });

  it('shows an error when the coupon fetch never resolves', async () => {
    firestoreMocks.getDoc.mockImplementation(() => new Promise(() => {}));
    vi.useFakeTimers();

    renderRedeem('/redeem/coupon-1');

    expect(screen.getByRole('status', { name: 'Carregando cupom' })).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(COUPON_FETCH_TIMEOUT_MS);
    });

    expect(screen.getByRole('heading', { name: 'Ops! Algo deu errado' })).toBeInTheDocument();
    expect(screen.getByText('Erro ao carregar o cupom. Tente novamente.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
  });

  it('shows an error when Firebase config is invalid and does not fetch', async () => {
    firebaseState.configured = false;

    renderRedeem('/redeem/coupon-1');

    expect(
      await screen.findByText('Não foi possível conectar ao serviço. Tente novamente mais tarde.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
    expect(firestoreMocks.getDoc).not.toHaveBeenCalled();
  });

  it('shows an error when the coupon id is missing', async () => {
    renderRedeem('/redeem');

    expect(await screen.findByText('Link inválido. Nenhum cupom foi informado.')).toBeInTheDocument();
    expect(firestoreMocks.getDoc).not.toHaveBeenCalled();
  });

  it('shows the premium name and description for a masked Picante coupon', async () => {
    firestoreMocks.getDoc.mockResolvedValue(
      couponSnapshot({ ...premiumCouponData, name: 'Pedido ******** Específico' }),
    );

    renderRedeem('/redeem/coupon-1');

    expect(await screen.findByRole('heading', { name: 'Fantasia à sua escolha' })).toBeInTheDocument();
    expect(screen.queryByText('Pedido ******** Específico')).not.toBeInTheDocument();
    expect(screen.getByTestId('coupon-premium-description')).toHaveTextContent(
      'Hoje você pode pedir uma fantasia ou atitude especial, dentro do que a gente combinou.',
    );
    expect(screen.getByTestId('coupon-card-header').querySelector('[data-art="mask"]')).not.toBeNull();
  });

  it('prefers premium texts stored on the coupon document', async () => {
    firestoreMocks.getDoc.mockResolvedValue(
      couponSnapshot({
        ...premiumCouponData,
        name: 'Pedido ******** Específico',
        premiumName: 'Nome do documento',
        premiumDescription: 'Descrição do documento',
      }),
    );

    renderRedeem('/redeem/coupon-1');

    expect(await screen.findByRole('heading', { name: 'Nome do documento' })).toBeInTheDocument();
    expect(screen.getByText('Descrição do documento')).toBeInTheDocument();
  });

  it('does not show a premium description for regular coupons', async () => {
    firestoreMocks.getDoc.mockResolvedValue(
      couponSnapshot({ ...premiumCouponData, name: 'Jantar Feito à Mão', category: 'Românticos & Afetivos' }),
    );

    renderRedeem('/redeem/coupon-1');

    expect(await screen.findByRole('heading', { name: 'Jantar Feito à Mão' })).toBeInTheDocument();
    expect(screen.queryByTestId('coupon-premium-description')).not.toBeInTheDocument();
  });

  it('shows the unavailable notice and a dimmed card when no uses are left', async () => {
    firestoreMocks.getDoc.mockResolvedValue(couponSnapshot({ ...premiumCouponData, quantity: 0 }));

    renderRedeem('/redeem/coupon-1');

    expect(await screen.findByText('Este cupom não está mais disponível.')).toBeInTheDocument();
    expect(screen.getByText('Ele já foi usado ou expirou.')).toBeInTheDocument();
    expect(screen.getByTestId('coupon-card')).toHaveClass('opacity-60');
    expect(screen.queryByRole('button', { name: 'Resgatar Agora' })).not.toBeInTheDocument();
  });

  async function redeemPremiumCoupon() {
    firestoreMocks.getDoc.mockResolvedValue(
      couponSnapshot({ ...premiumCouponData, name: 'Pedido ******** Específico', observations: 'Só hoje' }),
    );
    firestoreMocks.runTransaction.mockResolvedValue(undefined);

    renderRedeem('/redeem/coupon-1');

    fireEvent.change(await screen.findByLabelText('Quem vai aproveitar?'), { target: { value: 'Ana' } });
    fireEvent.click(screen.getByRole('button', { name: 'Resgatar Agora' }));

    expect(await screen.findByRole('heading', { name: 'Resgatado!' })).toBeInTheDocument();
  }

  it('logs a premium redemption and opens the iOS campaign listing', async () => {
    mockNavigator(IPHONE_UA);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    await redeemPremiumCoupon();

    expect(screen.getByText('Fantasia à sua escolha')).toBeInTheDocument();
    expect(screen.getByText('Só hoje')).toBeInTheDocument();
    expect(screen.getByText(/Gostou da surpresa\?/)).toBeInTheDocument();

    expect(analyticsMocks.trackCouponRedeemed).toHaveBeenCalledTimes(1);
    const payload = analyticsMocks.trackCouponRedeemed.mock.calls[0][0];
    expect(payload).toEqual({ category: 'Picante +18 (Premium)', is_premium: true });
    expect(payload).not.toHaveProperty('userName');
    expect(JSON.stringify(analyticsMocks.trackCouponRedeemed.mock.calls)).not.toContain('Ana');

    fireEvent.click(screen.getByRole('button', { name: 'Baixar o App' }));
    expect(openSpy).toHaveBeenCalledTimes(1);
    const url = String(openSpy.mock.calls[0][0]);
    expect(openSpy).toHaveBeenCalledWith(url, '_blank', 'noopener');
    expect(new URL(url).search).toBe('?ct=web_redeem&mt=8');
    expect(url).toContain('https://apps.apple.com/br/app/affetto-cupons-e-vales/id6756904115');
    expect(url).not.toContain('play.google.com');
    expect(analyticsMocks.trackStoreCtaClick).toHaveBeenCalledWith({
      placement: 'redeem_success',
      platform: 'ios',
    });
  });

  it('shows an Android coming-soon notice and does not open a store', async () => {
    mockNavigator(ANDROID_UA);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    await redeemPremiumCoupon();

    expect(screen.getByText('Android em breve')).toBeInTheDocument();
    expect(screen.getByText('Em breve também para Android')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /baixar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(document.body.innerHTML).not.toContain('play.google.com');
    expect(document.body.innerHTML).not.toContain('apps.apple.com');
    expect(openSpy).not.toHaveBeenCalled();
    expect(analyticsMocks.trackStoreCtaClick).not.toHaveBeenCalled();
  });

  it('opens the desktop App Store campaign and notes that Android is coming', async () => {
    mockNavigator(DESKTOP_UA);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    await redeemPremiumCoupon();

    expect(screen.getByText('Android em breve')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Baixar na App Store' }));

    expect(openSpy).toHaveBeenCalledTimes(1);
    const url = String(openSpy.mock.calls[0][0]);
    expect(openSpy).toHaveBeenCalledWith(url, '_blank', 'noopener');
    expect(new URL(url).search).toBe('?ct=web_redeem&mt=8');
    expect(url).not.toContain('play.google.com');
    expect(analyticsMocks.trackStoreCtaClick).toHaveBeenCalledWith({
      placement: 'redeem_success',
      platform: 'desktop',
    });
  });
});
