import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Heart, Share2, Ticket } from 'lucide-react';
import BrandHeader from '../components/BrandHeader';

export const HOME_TITLE = 'Affetto - Cupons do Amor para casais';

const STEPS = [
  {
    icon: Ticket,
    title: 'Crie cupons personalizados',
    body: 'Escolha um modelo, defina a quantidade de usos e, se quiser, uma data de validade e uma observação.',
  },
  {
    icon: Share2,
    title: 'Compartilhe por link',
    body: 'Envie o cupom para quem você ama por qualquer aplicativo de mensagens. Basta abrir o link.',
  },
  {
    icon: Gift,
    title: 'Resgate com carinho',
    body: 'Quem recebe abre o link, vê o cupom e confirma o resgate. Quem criou o cupom é avisado.',
  },
] as const;

const HomePage: React.FC = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = HOME_TITLE;
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <BrandHeader />
      <main className="flex-1 w-full max-w-3xl mx-auto px-5 pt-8 pb-12 flex flex-col gap-10">
        <section className="flex flex-col items-center text-center gap-3">
          <h1 className="text-[40px] leading-none font-extrabold tracking-[-.4px] text-ink">Affetto</h1>
          <p className="text-lg font-extrabold text-primary">Cupons do Amor para casais</p>
          <p className="max-w-xl text-[15px] leading-6 text-ink-soft">
            O Affetto é um aplicativo para iOS e Android que ajuda casais a criar, compartilhar e resgatar cupons de carinho e afeto. Surpreenda quem você ama com pequenos gestos que viram momentos especiais.
          </p>
          <p lang="en" className="max-w-xl text-sm leading-5 text-ink-soft">
            Affetto is a mobile app for couples to create, share and redeem love coupons.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[22px] font-extrabold tracking-[-.2px]">Como funciona</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="bg-white border border-line rounded-[20px] shadow-card p-4 flex flex-col gap-3"
              >
                <span className="w-11 h-11 rounded-2xl bg-lilac flex items-center justify-center text-primary">
                  <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="text-[15px] font-extrabold leading-5">{title}</h3>
                <p className="text-sm leading-5 text-ink-soft">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="bg-lilac rounded-[20px] p-4 flex gap-3 items-start">
          <Heart className="w-5 h-5 text-primary flex-none mt-0.5" strokeWidth={1.75} aria-hidden="true" />
          <p className="text-sm leading-5 text-ink">
            Recebeu um link de cupom? Abra o link para ver o cupom e resgatá-lo. O uso dos dados de login está descrito na{' '}
            <Link to="/privacy" className="font-extrabold text-primary underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </aside>
      </main>
      <footer className="border-t border-line px-5 py-6">
        <nav
          aria-label="Links legais"
          className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
        >
          <Link to="/privacy" className="font-extrabold text-primary hover:underline">
            Política de Privacidade
          </Link>
          <Link to="/terms" className="font-extrabold text-primary hover:underline">
            Termos de Uso
          </Link>
          <Link to="/delete-account" className="font-extrabold text-primary hover:underline">
            Excluir conta
          </Link>
        </nav>
        <p className="mt-3 text-center text-sm text-ink-soft">© Affetto</p>
      </footer>
    </div>
  );
};

export default HomePage;
