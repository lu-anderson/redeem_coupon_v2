import { couponCategories } from '../constants/coupons';
import { PREMIUM_TEXTS } from '../constants/premiumTexts';
import { Coupon } from '../types';

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * True when the coupon is premium, without reading the redeemer name or any other PII.
 * A coupon is premium when its category name contains "Premium", the matching
 * template has `premium: true`, it carries a `premiumName`, or its stored name
 * is an entry in `PREMIUM_TEXTS`.
 */
export function isPremiumCoupon(
  coupon: Pick<Coupon, 'name' | 'category'> & Partial<Pick<Coupon, 'premiumName'>>,
): boolean {
  const category = text(coupon.category);
  if (category.includes('Premium')) return true;

  const name = text(coupon.name);
  if (name) {
    const template = couponCategories
      .flatMap((entry) => entry.cupons)
      .find((item) => item.nome === name);
    if (template?.premium === true) return true;
    if (Object.hasOwn(PREMIUM_TEXTS, name)) return true;
  }

  return text(coupon.premiumName).length > 0;
}
