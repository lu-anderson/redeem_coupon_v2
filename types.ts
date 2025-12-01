export type CouponCategory = 'carinho' | 'diversao' | 'surpresa' | 'romance' | 'aventura' | 'noite-livre' | string;

export interface CouponTemplate {
  nome: string;
  descricao: string;
  raridade: string;
  icone: string;
  imagem_sugerida?: string;
  premium: boolean;
  enabled: boolean;
}

export interface CategoryData {
  nome: string;
  cor: string;
  icone: string;
  cupons: CouponTemplate[];
}

export interface Coupon {
  id: string;
  userId: string;
  name: string;
  category: CouponCategory;
  quantity: number;
  originalQuantity: number;
  expirationDate?: any; // Firestore Timestamp or Date
  createdAt: any;
  isActive: boolean;
  message?: string; // Optional description
  // New fields
  rarity?: string;
  icon?: string;
  color?: string;
  observations?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'coupon_used' | 'coupon_expired' | 'coupon_shared';
  title: string;
  message: string;
  couponId?: string;
  couponName?: string;
  usedBy?: string;
  createdAt: Date;
  isRead: boolean;
  sent?: boolean;
}