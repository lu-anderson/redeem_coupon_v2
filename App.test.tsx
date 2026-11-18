import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

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
});
