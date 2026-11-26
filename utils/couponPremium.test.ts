import { describe, expect, it } from 'vitest';
import { isPremiumCoupon } from './couponPremium';

describe('isPremiumCoupon', () => {
  it('is true when the category name contains Premium', () => {
    expect(
      isPremiumCoupon({
        name: 'Dia Inteiro Planejado por Mim',
        category: 'Experiências Premium',
      }),
    ).toBe(true);
  });

  it('is true when the matching template is premium or the name is a premium text', () => {
    expect(
      isPremiumCoupon({
        name: 'Pedido ******** Específico',
        category: 'Outra',
      }),
    ).toBe(true);
  });

  it('is true when the coupon carries a premium name', () => {
    expect(
      isPremiumCoupon({
        name: 'Jantar Feito à Mão',
        category: 'Românticos & Afetivos',
        premiumName: 'Nome especial',
      }),
    ).toBe(true);
  });

  it('is false for a regular coupon, including a blank premium name', () => {
    expect(
      isPremiumCoupon({
        name: 'Jantar Feito à Mão',
        category: 'Românticos & Afetivos',
      }),
    ).toBe(false);
    expect(
      isPremiumCoupon({
        name: 'Jantar Feito à Mão',
        category: 'Românticos & Afetivos',
        premiumName: '   ',
      }),
    ).toBe(false);
  });
});
