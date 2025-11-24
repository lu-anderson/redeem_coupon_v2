export type CouponCategory = 'carinho' | 'diversao' | 'surpresa' | 'romance' | 'aventura' | 'noite-livre';

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