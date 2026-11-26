import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const analyticsMocks = vi.hoisted(() => ({
  trackPageView: vi.fn(() => Promise.resolve()),
  trackCouponRedeemed: vi.fn(() => Promise.resolve()),
  trackStoreCtaClick: vi.fn(() => Promise.resolve()),
}));

vi.mock('./services/analytics', () => analyticsMocks);

vi.mock('./pages/RedeemPage', () => ({
  default: () => <h1>Resgatar Cupom</h1>,
}));

function renderAt(path: string) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

describe('App routes', () => {
  afterEach(() => {
    cleanup();
    analyticsMocks.trackPageView.mockClear();
    window.history.pushState({}, '', '/');
  });

  it('shows the home page at /', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Affetto' })).toBeInTheDocument();
  });

  it('renders the redeem page at /redeem/:id and /reedem/:id', () => {
    renderAt('/redeem/X');
    expect(screen.getByRole('heading', { name: 'Resgatar Cupom' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: 'Affetto' })).not.toBeInTheDocument();

    cleanup();

    renderAt('/reedem/X');
    expect(screen.getByRole('heading', { name: 'Resgatar Cupom' })).toBeInTheDocument();
  });

  it('redirects an unknown path to /', async () => {
    renderAt('/not-a-page');
    expect(await screen.findByRole('heading', { level: 1, name: 'Affetto' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
  });

  it('logs page_view with page_path when the route changes', async () => {
    renderAt('/?src=share');
    expect(analyticsMocks.trackPageView).toHaveBeenCalledWith('/?src=share');

    analyticsMocks.trackPageView.mockClear();
    fireEvent.click(screen.getAllByRole('link', { name: 'Política de Privacidade' })[0]);

    expect(await screen.findByRole('heading', { name: /Política de Privacidade/ })).toBeInTheDocument();
    await waitFor(() => {
      expect(analyticsMocks.trackPageView).toHaveBeenCalledWith('/privacy');
    });
  });
});
