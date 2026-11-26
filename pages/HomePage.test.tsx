import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage, { HOME_TITLE } from './HomePage';

const analyticsMocks = vi.hoisted(() => ({
  trackStoreCtaClick: vi.fn(() => Promise.resolve()),
  trackPageView: vi.fn(() => Promise.resolve()),
  trackCouponRedeemed: vi.fn(() => Promise.resolve()),
}));

vi.mock('../services/analytics', () => analyticsMocks);

const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8)';

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    analyticsMocks.trackStoreCtaClick.mockClear();
    vi.stubEnv('VITE_APPLE_PROVIDER_TOKEN', '');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('describes Affetto and links to the legal pages', () => {
    renderHome();

    expect(screen.getByRole('heading', { level: 1, name: 'Affetto' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'O Affetto é um aplicativo para iPhone que ajuda casais a criar, compartilhar e resgatar cupons de carinho e afeto. Surpreenda quem você ama com pequenos gestos que viram momentos especiais.',
      ),
    ).toBeInTheDocument();

    const privacyLinks = screen.getAllByRole('link', { name: 'Política de Privacidade' });
    expect(privacyLinks.length).toBeGreaterThanOrEqual(2);
    for (const link of privacyLinks) {
      expect(link).toHaveAttribute('href', '/privacy');
    }

    expect(screen.getByRole('link', { name: 'Termos de Uso' })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: 'Excluir conta' })).toHaveAttribute('href', '/delete-account');
    expect(document.title).toBe(HOME_TITLE);
  });

  it('opens the home App Store campaign and logs the click', () => {
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(ANDROID_UA);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    renderHome();

    expect(screen.getByText('Disponível para iPhone • Android em breve')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Baixar na App Store' }));

    expect(openSpy).toHaveBeenCalledTimes(1);
    const url = String(openSpy.mock.calls[0][0]);
    expect(openSpy).toHaveBeenCalledWith(url, '_blank', 'noopener');
    expect(url).toContain('https://apps.apple.com/br/app/affetto-cupons-e-vales/id6756904115');
    expect(new URL(url).search).toBe('?ct=web_home&mt=8');
    expect(url).not.toContain('play.google.com');
    expect(analyticsMocks.trackStoreCtaClick).toHaveBeenCalledWith({
      placement: 'home',
      platform: 'android',
    });
  });
});
