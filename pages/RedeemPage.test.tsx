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

function couponSnapshot() {
  return {
    exists: () => true,
    id: 'coupon-1',
    data: () => premiumCouponData,
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
    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.queryByText(/observações/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resgatar agora/i })).toBeInTheDocument();
    expect(screen.getByTestId('coupon-card-header')).toHaveStyle({ backgroundColor: '#D72638' });
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
});
