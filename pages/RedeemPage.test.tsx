import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { act, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { COUPON_FETCH_TIMEOUT_MS } from '../utils/withTimeout';
import RedeemPage from './RedeemPage';

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

describe('RedeemPage', () => {
  beforeEach(() => {
    firebaseState.configured = true;
    firestoreMocks.getDoc.mockReset();
    firestoreMocks.doc.mockClear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
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

  it('shows the success state and opens the Affetto store listing', async () => {
    firestoreMocks.getDoc.mockResolvedValue(
      couponSnapshot({ ...premiumCouponData, name: 'Pedido ******** Específico', observations: 'Só hoje' }),
    );
    firestoreMocks.runTransaction.mockResolvedValue(undefined);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    renderRedeem('/redeem/coupon-1');

    fireEvent.change(await screen.findByLabelText('Quem vai aproveitar?'), { target: { value: 'Ana' } });
    fireEvent.click(screen.getByRole('button', { name: 'Resgatar Agora' }));

    expect(await screen.findByRole('heading', { name: 'Resgatado!' })).toBeInTheDocument();
    expect(screen.getByText('Fantasia à sua escolha')).toBeInTheDocument();
    expect(screen.getByText('Só hoje')).toBeInTheDocument();
    expect(screen.getByText(/Gostou da surpresa\?/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Baixar o App' }));
    expect(openSpy).toHaveBeenCalledTimes(1);
    const url = String(openSpy.mock.calls[0][0]);
    expect(url).not.toContain('cuponsdoamor');
    expect(url).toMatch(
      /^(https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.luanderson_eng_software\.affetto|https:\/\/apps\.apple\.com\/app\/id6756904115)$/,
    );
  });
});
