import React from 'react';
import { Coupon, CouponCategory } from '../types';
import { Heart, Star, Zap, Smile, Moon, Gift } from 'lucide-react';

interface CouponCardProps {
  coupon: Coupon;
}

const getCategoryConfig = (category: CouponCategory) => {
  switch (category) {
    case 'carinho': return { color: 'bg-[#FFB3BA]', icon: <Heart className="text-pink-500" fill="currentColor" /> };
    case 'romance': return { color: 'bg-[#FFFFBA]', icon: <Heart className="text-yellow-500" fill="currentColor" /> };
    case 'aventura': return { color: 'bg-[#FFDFBA]', icon: <Zap className="text-orange-400" fill="currentColor" /> };
    case 'diversao': return { color: 'bg-[#BAFFC9]', icon: <Smile className="text-green-500" /> };
    case 'surpresa': return { color: 'bg-[#BAE1FF]', icon: <Gift className="text-blue-400" /> };
    case 'noite-livre': return { color: 'bg-slate-200', icon: <Moon className="text-slate-500" /> };
    default: return { color: 'bg-gray-100', icon: <Star /> };
  }
};

const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  const config = getCategoryConfig(coupon.category);
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
        <div className={`${config.color} p-6 flex items-center justify-between`}>
          <div className="bg-white/50 p-2 rounded-full backdrop-blur-sm">
            {config.icon}
          </div>
          <span className="text-gray-700 font-bold uppercase tracking-wider text-xs bg-white/40 px-3 py-1 rounded-full">
            {coupon.category}
          </span>
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
              <span className="font-bold text-xl text-love">{coupon.quantity}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
              <span className="text-gray-400 text-xs mb-1">Validade</span>
              <span className="font-bold text-gray-700">{formattedDate}</span>
            </div>
          </div>
          
          {coupon.message && (
            <p className="text-gray-500 italic text-sm mt-4">
              "{coupon.message}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
