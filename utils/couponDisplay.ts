import { couponCategories } from '../constants/coupons';
import { Coupon } from '../types';

const LEGACY_CATEGORY_COLORS: Record<string, string> = {
  carinho: '#FFB3BA',
  romance: '#FFFFBA',
  aventura: '#FFDFBA',
  diversao: '#BAFFC9',
  surpresa: '#BAE1FF',
  'noite-livre': '#E2E8F0',
};

const DEFAULT_COLOR = '#F3F4F6';

function nonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function coerceDate(value: unknown): Date | null {
  if (value == null || value === '') return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'object' && 'toDate' in value) {
    const toDate = (value as { toDate?: unknown }).toDate;
    if (typeof toDate === 'function') {
      const converted = toDate.call(value);
      if (converted instanceof Date && !Number.isNaN(converted.getTime())) {
        return converted;
      }
    }
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

/** Null, empty, and unparseable values render as "Sem validade" (never "Invalid Date"). */
export function formatExpirationDate(expirationDate: unknown): string {
  const date = coerceDate(expirationDate);
  if (!date) return 'Sem validade';
  return date.toLocaleDateString('pt-BR');
}

/** Blank observations are treated as absent so the card does not render an empty box. */
export function normalizeObservations(observations: unknown): string | undefined {
  return nonEmptyString(observations);
}

export interface CouponVisuals {
  color: string;
  /** String icon when the coupon, template, or category provides one. */
  icon?: string;
  rarity?: string;
  observations?: string;
  expirationLabel: string;
  categoryLabel: string;
}

/**
 * Resolves display fields for the current coupon schema, including
 * expirationDate: null, observations: "", a missing color, and category
 * labels such as "Picante +18 (Premium)" that are not legacy slugs.
 */
export function resolveCouponVisuals(
  coupon: Pick<
    Coupon,
    'name' | 'category' | 'color' | 'icon' | 'rarity' | 'observations' | 'expirationDate'
  >,
): CouponVisuals {
  const template = couponCategories
    .flatMap((category) =>
      category.cupons.map((item) => ({
        name: item.nome,
        rarity: item.raridade,
        icon: item.icone,
        categoryColor: category.cor,
        categoryIcon: category.icone,
      })),
    )
    .find((item) => item.name === coupon.name);

  const categoryMatch = couponCategories.find((category) => category.nome === coupon.category);
  const legacyColor = LEGACY_CATEGORY_COLORS[String(coupon.category)] ?? DEFAULT_COLOR;

  const color =
    nonEmptyString(coupon.color) ||
    nonEmptyString(template?.categoryColor) ||
    nonEmptyString(categoryMatch?.cor) ||
    legacyColor;

  const icon =
    nonEmptyString(coupon.icon) ||
    nonEmptyString(template?.icon) ||
    nonEmptyString(template?.categoryIcon) ||
    nonEmptyString(categoryMatch?.icone);

  const rarity = nonEmptyString(coupon.rarity) || nonEmptyString(template?.rarity);

  return {
    color,
    icon,
    rarity,
    observations: normalizeObservations(coupon.observations),
    expirationLabel: formatExpirationDate(coupon.expirationDate),
    categoryLabel: nonEmptyString(coupon.category) || 'Cupom',
  };
}

export function availableQuantity(quantity: unknown): number {
  return typeof quantity === 'number' && Number.isFinite(quantity) ? quantity : 0;
}
