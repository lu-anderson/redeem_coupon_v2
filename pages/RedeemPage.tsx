import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCoupon, redeemCoupon } from '../services/couponService';
import { assertFirebaseConfigured } from '../services/firebase';
import { Coupon } from '../types';
import CouponCard from '../components/CouponCard';
import confetti from 'canvas-confetti';
import { CircleAlert, Check, Download, Gift, LoaderCircle, RotateCw, TicketX, User } from 'lucide-react';
import BrandHeader from '../components/BrandHeader';
import CouponArt, { artKeyFor } from '../components/CouponArt';
import RarityTag from '../components/RarityTag';
import { ObservationsBox } from '../components/CouponCard';
import { appStoreCampaignUrl, detectStorePlatform, type StorePlatform } from '../utils/storeLinks';
import { isPremiumCoupon } from '../utils/couponPremium';
import { COUPON_FETCH_TIMEOUT_MS, withTimeout } from '../utils/withTimeout';
import { resolveCouponTexts, resolveCouponVisuals } from '../utils/couponDisplay';
import { trackCouponRedeemed, trackStoreCtaClick } from '../services/analytics';

function isFirebaseConfigError(error: unknown): boolean {
  return error instanceof Error && error.name === 'FirebaseConfigError';
}

const RedeemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [success, setSuccess] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let cancelTimeout = () => {};

    const loadCoupon = async () => {
      if (!id) {
        if (!active) return;
        setCoupon(null);
        setError('Link inválido. Nenhum cupom foi informado.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Missing config must not reach Firestore: an undefined projectId makes
        // Listen retry forever and getDoc never settles.
        assertFirebaseConfigured();

        const timed = withTimeout(getCoupon(id), COUPON_FETCH_TIMEOUT_MS);
        cancelTimeout = timed.cancel;
        const data = await timed.promise;
        if (!active) return;

        if (data) {
          setCoupon(data);
        } else {
          setCoupon(null);
          setError('Cupom não encontrado ou inválido.');
        }
      } catch (err) {
        if (!active) return;
        setCoupon(null);
        if (isFirebaseConfigError(err)) {
          setError('Não foi possível conectar ao serviço. Tente novamente mais tarde.');
        } else {
          setError('Erro ao carregar o cupom. Tente novamente.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadCoupon();

    return () => {
      active = false;
      cancelTimeout();
    };
  }, [id, attempt]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setAttempt((current) => current + 1);
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !userName.trim()) return;

    setRedeeming(true);
    try {
      await redeemCoupon(id, userName);
      if (coupon) {
        // Category and premium flag only. Never send the redeemer name or other PII.
        void trackCouponRedeemed({
          category: coupon.category,
          is_premium: isPremiumCoupon(coupon),
        });
      }
      setSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4B2E5C', '#E4DAEC', '#EEE8F3', '#ffffff']
      });
    } catch (err: unknown) {
      const message = isFirebaseConfigError(err)
        ? 'Não foi possível conectar ao serviço. Tente novamente mais tarde.'
        : err instanceof Error && err.message
          ? err.message
          : 'Erro ao resgatar.';
      alert(message);
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-canvas flex items-center justify-center"
        role="status"
        aria-label="Carregando cupom"
      >
        <LoaderCircle className="w-9 h-9 text-primary animate-spin" strokeWidth={2} aria-hidden="true" />
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <PageShell>
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16 text-center" role="alert">
          <div className="w-20 h-20 rounded-[24px] bg-lilac flex items-center justify-center mb-6">
            <CircleAlert className="w-9 h-9 text-primary" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h1 className="text-[22px] font-extrabold text-ink mb-2">Ops! Algo deu errado</h1>
          <p className="text-[15px] text-ink-soft max-w-md">{error || 'Não conseguimos encontrar esse cupom.'}</p>
          <button
            type="button"
            onClick={handleRetry}
            className={`${PRIMARY_BUTTON} mt-6 max-w-[300px]`}
          >
            <RotateCw className="w-5 h-5" aria-hidden="true" />
            Tentar novamente
          </button>
          <Link to="/" className="mt-4 text-[15px] font-extrabold text-primary hover:underline">
            Voltar ao início
          </Link>
        </div>
      </PageShell>
    );
  }

  if (success) {
    const visuals = resolveCouponVisuals(coupon);
    const texts = resolveCouponTexts(coupon);
    const touchPoints = typeof navigator.maxTouchPoints === 'number' ? navigator.maxTouchPoints : 0;
    const storePlatform = detectStorePlatform(navigator.userAgent, touchPoints);

    return (
      <PageShell>
        <div className="flex-1 flex justify-center px-5 pt-6 pb-10 lg:pt-10">
          <div className="w-full max-w-[440px] flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white shadow-tile flex items-center justify-center">
                <CouponArt artKey={artKeyFor(coupon.name, coupon.category)} size={44} />
              </div>
              <span className="absolute -right-0.5 -bottom-0.5 w-[34px] h-[34px] rounded-full bg-success border-[3px] border-white flex items-center justify-center">
                <Check className="w-4 h-4 text-white" strokeWidth={3} aria-hidden="true" />
              </span>
            </div>

            <h1 className="text-[28px] font-extrabold tracking-[-.3px] text-ink">Resgatado!</h1>

            <RarityTag rarity={visuals.rarity} />

            <p className="text-[15px] text-ink-soft">
              Oba! O cupom <strong className="text-ink">{texts.name}</strong> foi validado com sucesso. Aproveite seu momento!
            </p>

            {visuals.observations && (
              <div className="w-full">
                <ObservationsBox text={visuals.observations} />
              </div>
            )}

            <SuccessStoreCta platform={storePlatform} />

            <button
              type="button"
              onClick={() => window.close()}
              className="text-sm font-bold text-ink-soft underline hover:text-ink transition-colors"
            >
              Fechar Janela
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  const canRedeem = coupon.isActive === true && typeof coupon.quantity === 'number' && coupon.quantity > 0;

  return (
    <PageShell>
      <div className="flex-1 flex justify-center px-5 pt-4 pb-10 lg:items-center lg:py-12">
        <div className="w-full max-w-md self-start content-start grid grid-cols-1 gap-4 lg:self-center lg:max-w-none lg:w-auto lg:grid-cols-[480px_440px] lg:gap-x-20 lg:gap-y-6">
          <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
            <h1 className="text-[28px] leading-9 font-extrabold tracking-[-.3px] text-ink lg:text-[44px] lg:leading-[52px]">
              Resgatar Cupom
            </h1>
            <p className="text-[15px] text-ink-soft lg:text-lg">Você recebeu um gesto de carinho!</p>
          </div>

          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
            <CouponCard coupon={coupon} dimmed={!canRedeem} />
          </div>

          <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
            {canRedeem ? (
              <form
                onSubmit={handleRedeem}
                className="bg-white border border-line rounded-[24px] p-[18px] flex flex-col gap-2.5"
              >
                <label htmlFor="name" className="text-sm font-bold leading-5 text-ink">
                  Quem vai aproveitar?
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-soft pointer-events-none"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <input
                    id="name"
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Seu nome ou apelido carinhoso..."
                    disabled={redeeming}
                    className="w-full h-[54px] rounded-[14px] bg-white border-[1.5px] border-line pl-12 pr-4 text-[15px] text-ink outline-none transition-all placeholder:text-ink-placeholder focus:border-primary focus:ring-4 focus:ring-primary/30 disabled:bg-disabled-surface disabled:text-disabled-text"
                  />
                </div>

                <button
                  type="submit"
                  disabled={redeeming}
                  className={`${PRIMARY_BUTTON} ${redeeming ? 'opacity-90 cursor-wait' : ''}`}
                >
                  {redeeming ? (
                    <>
                      <LoaderCircle className="w-5 h-5 animate-spin" aria-hidden="true" /> Processando...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5" aria-hidden="true" /> Resgatar Agora
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-ink-soft">Uma notificação será enviada para quem emitiu.</p>
              </form>
            ) : (
              <div className="flex items-center gap-3 bg-waiting-surface rounded-[18px] px-4 py-3.5">
                <TicketX className="w-6 h-6 text-ink flex-none" strokeWidth={1.75} aria-hidden="true" />
                <div className="flex flex-col text-left">
                  <p className="text-[15px] font-bold text-ink">Este cupom não está mais disponível.</p>
                  <p className="text-[13px] text-ink-soft">Ele já foi usado ou expirou.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

const PRIMARY_BUTTON =
  'w-full h-[54px] rounded-2xl bg-primary text-primary-on font-bold text-base shadow-button flex items-center justify-center gap-2.5 transition-all hover:bg-primary-pressed active:scale-[.98] active:bg-primary-pressed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30';

function openRedeemStore(platform: 'ios' | 'desktop') {
  window.open(appStoreCampaignUrl('web_redeem'), '_blank', 'noopener');
  void trackStoreCtaClick({ placement: 'redeem_success', platform });
}

/** Post-redeem store CTA. Android has no store link until the Play listing exists. */
const SuccessStoreCta: React.FC<{ platform: StorePlatform }> = ({ platform }) => (
  <div className="w-full bg-white border border-line rounded-[20px] p-4 flex flex-col gap-3">
    <p className="text-sm font-semibold text-ink">
      Gostou da surpresa?<br />
      Crie também momentos inesquecíveis para quem você ama!
    </p>
    {platform === 'android' ? (
      <div className="rounded-2xl bg-lilac px-4 py-3">
        <p className="text-sm font-extrabold text-primary">Android em breve</p>
        <p className="mt-1 text-xs leading-5 text-ink-soft">Em breve também para Android</p>
      </div>
    ) : (
      <>
        <button
          type="button"
          onClick={() => {
            if (platform === 'ios' || platform === 'desktop') openRedeemStore(platform);
          }}
          className={PRIMARY_BUTTON}
        >
          <Download className="w-5 h-5" aria-hidden="true" />
          {platform === 'ios' ? 'Baixar o App' : 'Baixar na App Store'}
        </button>
        {platform === 'desktop' && <p className="text-xs text-ink-soft">Android em breve</p>}
      </>
    )}
  </div>
);

/** Brand header plus the page background (gradient on desktop, as in G17D). */
const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-canvas text-ink">
    <BrandHeader />
    <main className="flex-1 flex flex-col lg:bg-gradient-to-br lg:from-[#F3EDF7] lg:to-[#FAF8FB]">{children}</main>
  </div>
);

export default RedeemPage;
