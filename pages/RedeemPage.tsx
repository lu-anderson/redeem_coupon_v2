import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCoupon, redeemCoupon } from '../services/couponService';
import { assertFirebaseConfigured } from '../services/firebase';
import { Coupon } from '../types';
import CouponCard from '../components/CouponCard';
import confetti from 'canvas-confetti';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { COUPON_FETCH_TIMEOUT_MS, withTimeout } from '../utils/withTimeout';
import { resolveCouponVisuals } from '../utils/couponDisplay';

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
      setSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B9D', '#FFB3BA', '#ffffff']
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
        className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"
        role="status"
        aria-label="Carregando cupom"
      >
        <Loader2 className="w-10 h-10 text-love animate-spin" />
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 text-center" role="alert">
        <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Ops! Algo deu errado</h1>
        <p className="text-gray-500 max-w-md">{error || 'Não conseguimos encontrar esse cupom.'}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-6 px-5 py-3 bg-love text-white rounded-xl font-bold hover:bg-love-light transition-all"
        >
          Tentar novamente
        </button>
        <Link to="/" className="mt-4 text-love font-bold hover:underline">Voltar ao início</Link>
      </div>
    );
  }

  if (success) {
    const visuals = resolveCouponVisuals(coupon);

    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full animate-fade-in-up border-t-8" style={{ borderColor: visuals.color }}>

          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative"
            style={{ backgroundColor: visuals.color }}
          >
            <span className="text-4xl">{visuals.icon || '❤️'}</span>
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Resgatado!</h1>

          {visuals.rarity && (
            <div className="text-yellow-500 text-xl mb-4 font-bold tracking-widest">
              {visuals.rarity}
            </div>
          )}

          <p className="text-gray-600 mb-8">
            Oba! O cupom <strong>{coupon.name}</strong> foi validado com sucesso. Aproveite seu momento! ❤️
          </p>

          {visuals.observations && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-left mb-6">
              <p className="text-xs text-yellow-700 font-bold mb-1 uppercase">Observações:</p>
              <p className="text-gray-600 text-sm">
                {visuals.observations}
              </p>
            </div>
          )}

          <div className="bg-pink-50 rounded-2xl p-6 mb-6 border border-pink-100">
            <p className="text-gray-700 font-medium mb-4 text-sm">
              Gostou da surpresa? 😍<br />
              Crie também momentos inesquecíveis para quem você ama!
            </p>
            <button
              onClick={() => window.open('https://play.google.com/store/apps/details?id=com.cuponsdoamor', '_blank')}
              className="block w-full py-3 bg-love text-white rounded-xl font-bold hover:bg-love-light hover:shadow-love/40 transition-all shadow-lg transform active:scale-95"
            >
              Baixar o App
            </button>
          </div>

          <button
            onClick={() => window.close()}
            className="text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors underline"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    );
  }

  const canRedeem = coupon.isActive === true && typeof coupon.quantity === 'number' && coupon.quantity > 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-800">Resgatar Cupom</h1>
          <p className="text-gray-500">Você recebeu um gesto de carinho!</p>
        </div>

        <CouponCard coupon={coupon} />

        {canRedeem ? (
          <form onSubmit={handleRedeem} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-600 mb-2">
                Quem vai aproveitar?
              </label>
              <input
                id="name"
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Seu nome ou apelido carinhoso..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-love focus:ring-2 focus:ring-love/20 outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={redeeming}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                ${redeeming ? 'bg-love/70 cursor-wait' : 'bg-love hover:bg-love-light hover:shadow-love/40'}
              `}
            >
              {redeeming ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processando...
                </>
              ) : (
                'Resgatar Agora ❤️'
              )}
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">
              Uma notificação será enviada para quem emitiu.
            </p>
          </form>
        ) : (
          <div className="bg-gray-100 p-6 rounded-3xl text-center text-gray-500">
            <p className="font-semibold">Este cupom não está mais disponível.</p>
            <p className="text-sm">Ele já foi usado ou expirou.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedeemPage;
