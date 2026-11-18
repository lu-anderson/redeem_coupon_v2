import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import HomePage, { HOME_TITLE } from './HomePage';

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('describes Affetto and links to the legal pages', () => {
    renderHome();

    expect(screen.getByRole('heading', { level: 1, name: 'Affetto' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'O Affetto é um aplicativo para iOS e Android que ajuda casais a criar, compartilhar e resgatar cupons de carinho e afeto. Surpreenda quem você ama com pequenos gestos que viram momentos especiais.',
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
});
