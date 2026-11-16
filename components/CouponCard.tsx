import React from 'react';
import { Coupon } from '../types';
import { availableQuantity, resolveCouponTexts, resolveCouponVisuals } from '../utils/couponDisplay';
import CouponArt, { artKeyFor } from './CouponArt';
import RarityTag from './RarityTag';

interface CouponCardProps {
  coupon: Coupon;
  /** Unavailable coupons are drawn dimmed (G17-05). */
  dimmed?: boolean;
}

/** Ticket notch on the card edge, at the header/body boundary. */
const Notch: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
  <span
    aria-hidden="true"
    className={`absolute top-[84px] -mt-[9px] w-[18px] h-[18px] rounded-full bg-canvas border border-line z-10 ${
      side === 'left' ? '-left-[9px]' : '-right-[9px]'
    }`}
  />
);

const CouponCard: React.FC<CouponCardProps> = ({ coupon, dimmed = false }) => {
  const visuals = resolveCouponVisuals(coupon);
  const texts = resolveCouponTexts(coupon);
  const available = availableQuantity(coupon.quantity);

  return (
    <div
      className={`relative w-full bg-white border border-line rounded-[24px] shadow-card ${dimmed ? 'opacity-60' : ''}`}
      data-testid="coupon-card"
    >
      <Notch side="left" />
      <Notch side="right" />

      {/* Header */}
      <div
        className="h-[84px] flex items-center justify-between gap-3 bg-lilac rounded-t-[24px] px-[18px]"
        data-testid="coupon-card-header"
      >
        <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center flex-none">
          <CouponArt artKey={artKeyFor(coupon.name, coupon.category)} size={28} />
        </div>

        <div className="flex flex-col items-end gap-1.5 min-w-0">
          <span className="text-[11px] font-extrabold tracking-[.6px] uppercase text-primary bg-white/70 px-2.5 py-1 rounded-full text-right">
            {visuals.categoryLabel}
          </span>
          <RarityTag rarity={visuals.rarity} />
        </div>
      </div>

      {/* Body */}
      <div className="px-[18px] pt-4 pb-[18px] flex flex-col gap-3 text-center">
        <h2 className="text-[22px] leading-7 font-extrabold text-ink">{texts.name}</h2>

        {texts.description && (
          <p className="text-sm text-ink-soft" data-testid="coupon-premium-description">
            {texts.description}
          </p>
        )}

        <div className="border-t border-dashed border-line-dashed" aria-hidden="true" />

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-muted rounded-[14px] p-2 flex flex-col">
            <span className="text-xs font-bold text-ink-soft">Disponíveis</span>
            <span className="text-xl font-extrabold text-primary">{available}</span>
          </div>
          <div className="bg-muted rounded-[14px] p-2 flex flex-col">
            <span className="text-xs font-bold text-ink-soft">Validade</span>
            <span className="text-[17px] leading-7 font-extrabold text-ink">{visuals.expirationLabel}</span>
          </div>
        </div>

        {coupon.message && <p className="italic text-sm text-ink-soft">"{coupon.message}"</p>}

        {visuals.observations && <ObservationsBox text={visuals.observations} />}
      </div>
    </div>
  );
};

/** "Observações" box shared by the card and the success state. */
export const ObservationsBox: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-left bg-muted border border-primary-soft rounded-[14px] px-3 py-2.5">
    <p className="text-[11px] font-extrabold tracking-[.6px] uppercase text-primary">Observações:</p>
    <p className="text-sm text-ink-soft mt-0.5">{text}</p>
  </div>
);

export default CouponCard;
