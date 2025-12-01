import React from 'react';
import { Coupon, CouponCategory } from '../types';
import { Heart, Star, Zap, Smile, Moon, Gift } from 'lucide-react';
import { couponCategories } from '../constants/coupons';
import { escapeHtml } from '../utils/sanitize';

interface CouponCardProps {
  coupon: Coupon;
}

const getCategoryConfig = (category: CouponCategory) => {
  switch (category) {
    case 'carinho': return { color: '#FFB3BA', icon: <Heart className="text-pink-500" fill="currentColor" /> };
    case 'romance': return { color: '#FFFFBA', icon: <Heart className="text-yellow-500" fill="currentColor" /> };
    case 'aventura': return { color: '#FFDFBA', icon: <Zap className="text-orange-400" fill="currentColor" /> };
    case 'diversao': return { color: '#BAFFC9', icon: <Smile className="text-green-500" /> };
    case 'surpresa': return { color: '#BAE1FF', icon: <Gift className="text-blue-400" /> };
    case 'noite-livre': return { color: '#E2E8F0', icon: <Moon className="text-slate-500" /> };
    default: return { color: '#F3F4F6', icon: <Star /> };
  }
};

const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  // Try to find the template data for this coupon
  const templateData = couponCategories
    .flatMap(c => c.cupons.map(t => ({ ...t, categoryColor: c.cor, categoryIcon: c.icone })))
    .find(t => t.nome === coupon.name);

  // Resolve display values
  // 1. Direct coupon property
  // 2. Template property
  // 3. Fallback to old category config
  const oldConfig = getCategoryConfig(coupon.category);

  const displayColor = coupon.color || templateData?.categoryColor || oldConfig.color;
  const displayIcon = coupon.icon || templateData?.icone || templateData?.categoryIcon || oldConfig.icon;
  const displayRarity = coupon.rarity || templateData?.raridade;
  const displayObservations = coupon.observations; // No template observation, only on coupon instance

  const formattedDate = coupon.expirationDate
    ? new Date(coupon.expirationDate).toLocaleDateString('pt-BR')
    : 'Sem validade';

  return (
    <div className="relative w-full max-w-sm mx-auto transform transition-all hover:scale-105 duration-300">
      {/* Ticket perforation circles */}
      <div className="absolute -left-3 top-1/2 w-6 h-6 bg-[#FAFAFA] rounded-full z-10"></div>
      <div className="absolute -right-3 top-1/2 w-6 h-6 bg-[#FAFAFA] rounded-full z-10"></div>

      <div className={`rounded-3xl shadow-xl overflow-hidden bg-white border-2 border-opacity-50 border-gray-100`}>
        {/* Header */}
        <div
          className="p-6 flex items-center justify-between relative overflow-hidden"
          style={{ backgroundColor: displayColor }}
        >
          {/* Rarity Stars Background Pattern (Optional) */}
          {displayRarity && (
            <div className="absolute top-0 right-0 p-2 opacity-20 text-4xl select-none pointer-events-none">
              {displayRarity}
            </div>
          )}

          <div className="bg-white/50 p-3 rounded-full backdrop-blur-sm shadow-sm text-2xl w-12 h-12 flex items-center justify-center">
            {typeof displayIcon === 'string' ? displayIcon : displayIcon}
          </div>

          <div className="flex flex-col items-end">
            <span className="text-gray-800 font-bold uppercase tracking-wider text-xs bg-white/40 px-3 py-1 rounded-full mb-1">
              {coupon.category}
            </span>
            {displayRarity && (
              <span className="text-yellow-500 font-bold text-sm drop-shadow-sm filter">
                {displayRarity}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 leading-tight">
            {escapeHtml(coupon.name)}
          </h2>

          <div className="w-full h-px bg-gray-100 my-4 dashed-line"></div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
              <span className="text-gray-400 text-xs mb-1">Disponíveis</span>
              <span className="font-bold text-xl text-love">{coupon.quantity}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
              <span className="text-gray-400 text-xs mb-1">Validade</span>
              <span className="font-bold text-gray-700">{formattedDate}</span>
            </div>
          </div>

          {coupon.message && (
            <p className="text-gray-500 italic text-sm mt-4">
              "{escapeHtml(coupon.message)}"
            </p>
          )}

          {displayObservations && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-left">
              <p className="text-xs text-yellow-700 font-bold mb-1 uppercase">Observações:</p>
              <p className="text-gray-600 text-sm">
                {escapeHtml(displayObservations)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
