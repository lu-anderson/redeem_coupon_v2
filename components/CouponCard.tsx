import React from 'react';
import { Coupon, CouponCategory } from '../types';
import { Heart, Star, Zap, Smile, Moon, Gift } from 'lucide-react';
import { availableQuantity, resolveCouponVisuals } from '../utils/couponDisplay';

interface CouponCardProps {
  coupon: Coupon;
}

const getLegacyCategoryIcon = (category: CouponCategory) => {
  switch (category) {
    case 'carinho': return <Heart className="text-pink-500" fill="currentColor" />;
    case 'romance': return <Heart className="text-yellow-500" fill="currentColor" />;
    case 'aventura': return <Zap className="text-orange-400" fill="currentColor" />;
    case 'diversao': return <Smile className="text-green-500" />;
    case 'surpresa': return <Gift className="text-blue-400" />;
    case 'noite-livre': return <Moon className="text-slate-500" />;
    default: return <Star />;
  }
};

const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  const visuals = resolveCouponVisuals(coupon);
  const displayIcon = visuals.icon || getLegacyCategoryIcon(coupon.category);
  const available = availableQuantity(coupon.quantity);

  return (
    <div className="relative w-full max-w-sm mx-auto transform transition-all hover:scale-105 duration-300">
      {/* Ticket perforation circles */}
      <div className="absolute -left-3 top-1/2 w-6 h-6 bg-[#FAFAFA] rounded-full z-10"></div>
      <div className="absolute -right-3 top-1/2 w-6 h-6 bg-[#FAFAFA] rounded-full z-10"></div>

      <div className={`rounded-3xl shadow-xl overflow-hidden bg-white border-2 border-opacity-50 border-gray-100`}>
        {/* Header */}
        <div
          className="p-6 flex items-center justify-between relative overflow-hidden"
          style={{ backgroundColor: visuals.color }}
          data-testid="coupon-card-header"
        >
          {/* Rarity Stars Background Pattern (Optional) */}
          {visuals.rarity && (
            <div className="absolute top-0 right-0 p-2 opacity-20 text-4xl select-none pointer-events-none">
              {visuals.rarity}
            </div>
          )}

          <div className="bg-white/50 p-3 rounded-full backdrop-blur-sm shadow-sm text-2xl w-12 h-12 flex items-center justify-center">
            {displayIcon}
          </div>

          <div className="flex flex-col items-end">
            <span className="text-gray-800 font-bold uppercase tracking-wider text-xs bg-white/40 px-3 py-1 rounded-full mb-1">
              {visuals.categoryLabel}
            </span>
            {visuals.rarity && (
              <span className="text-yellow-500 font-bold text-sm drop-shadow-sm filter">
                {visuals.rarity}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 leading-tight">
            {coupon.name}
          </h2>

          <div className="w-full h-px bg-gray-100 my-4 dashed-line"></div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
              <span className="text-gray-400 text-xs mb-1">Disponíveis</span>
              <span className="font-bold text-xl text-love">{available}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
              <span className="text-gray-400 text-xs mb-1">Validade</span>
              <span className="font-bold text-gray-700">{visuals.expirationLabel}</span>
            </div>
          </div>

          {coupon.message && (
            <p className="text-gray-500 italic text-sm mt-4">
              "{coupon.message}"
            </p>
          )}

          {visuals.observations && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-left">
              <p className="text-xs text-yellow-700 font-bold mb-1 uppercase">Observações:</p>
              <p className="text-gray-600 text-sm">
                {visuals.observations}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
