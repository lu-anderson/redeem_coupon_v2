import { db } from './firebase';
import { doc, getDoc, runTransaction, collection, serverTimestamp } from 'firebase/firestore';
import { Coupon, Notification } from '../types';

const COUPONS_COLLECTION = 'coupons';
const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Validates a coupon ID format
 * @param id - The ID to validate
 * @returns true if valid, false otherwise
 */
const isValidCouponId = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  // Firestore document IDs: alphanumeric, hyphens, underscores, max 128 chars
  const validPattern = /^[a-zA-Z0-9_-]{1,128}$/;
  return validPattern.test(id.trim());
};

/**
 * Sanitizes a user name for safe storage and display
 * @param name - The name to sanitize
 * @returns Sanitized name
 */
const sanitizeUserName = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  return name
    .trim()
    .slice(0, 50) // Limit length
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, ''); // Remove angle brackets
};

export const getCoupon = async (id: string): Promise<Coupon | null> => {
  // Validate ID format before querying
  if (!isValidCouponId(id)) {
    return null;
  }

  try {
    const docRef = doc(db, COUPONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        // Convert Firestore Timestamps to Date objects if needed here, 
        // or handle them in the UI. Returning raw for now implies dealing with Timestamp objects.
        expirationDate: data.expirationDate?.toDate ? data.expirationDate.toDate() : data.expirationDate,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      } as Coupon;
    } else {
      return null;
    }
  } catch {
    throw new Error('Erro ao buscar cupom.');
  }
};

/**
 * Redeems a coupon using a transaction to ensure quantity integrity.
 * 
 * SECURITY NOTE:
 * While this client-side code initiates the transaction, true security relies on Firestore Security Rules.
 * You should configure your Firestore Rules to:
 * 1. Allow updates only if 'quantity' > 0.
 * 2. Allow updates only to specific fields (like quantity).
 * 3. Prevent users from modifying 'originalQuantity' or 'name'.
 * 
 * RECOMMENDED FIRESTORE SECURITY RULES:
 * ```
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /coupons/{couponId} {
 *       allow read: if true;
 *       allow update: if 
 *         request.resource.data.quantity == resource.data.quantity - 1 &&
 *         resource.data.quantity > 0 &&
 *         resource.data.isActive == true &&
 *         request.resource.data.name == resource.data.name &&
 *         request.resource.data.originalQuantity == resource.data.originalQuantity &&
 *         request.resource.data.userId == resource.data.userId;
 *       allow create, delete: if false;
 *     }
 *     match /notifications/{notificationId} {
 *       allow create: if 
 *         request.resource.data.type == 'coupon_used' &&
 *         request.resource.data.isRead == false;
 *       allow read, update, delete: if false;
 *     }
 *   }
 * }
 * ```
 */
export const redeemCoupon = async (couponId: string, userName: string): Promise<boolean> => {
  // Validate inputs
  if (!isValidCouponId(couponId)) {
    throw new Error("Cupom não encontrado.");
  }
  
  const sanitizedUserName = sanitizeUserName(userName);
  if (!sanitizedUserName || sanitizedUserName.length < 2) {
    throw new Error("Nome inválido.");
  }
  
  try {
    await runTransaction(db, async (transaction) => {
      const couponRef = doc(db, COUPONS_COLLECTION, couponId);
      const couponDoc = await transaction.get(couponRef);

      if (!couponDoc.exists()) {
        throw new Error("Cupom não encontrado.");
      }

      const couponData = couponDoc.data() as Coupon;

      if (!couponData.isActive) {
        throw new Error("Este cupom foi desativado.");
      }

      if (couponData.quantity <= 0) {
        throw new Error("Este cupom já foi totalmente utilizado!");
      }

      if (couponData.expirationDate) {
        const exp = couponData.expirationDate.toDate ? couponData.expirationDate.toDate() : new Date(couponData.expirationDate);
        if (exp < new Date()) {
          throw new Error("Este cupom expirou.");
        }
      }

      // 1. Update Coupon Quantity
      const newQuantity = couponData.quantity - 1;
      transaction.update(couponRef, {
        quantity: newQuantity,
        // If quantity hits 0, you might want to auto-deactivate, but keeping it active but 0 is okay too
      });

      // 2. Create Notification
      // We create a new document in the notifications collection.
      // A backend function (Cloud Functions) should ideally listen to this to send the actual Push Notification via FCM.
      const notificationRef = doc(collection(db, NOTIFICATIONS_COLLECTION));
      const notificationData: Omit<Notification, 'id'> = {
        userId: couponData.userId, // The owner of the coupon receives the notification
        type: 'coupon_used',
        title: 'Cupom Resgatado! ❤️',
        message: `${sanitizedUserName} acabou de resgatar o cupom "${couponData.name}"!`,
        couponId: couponId,
        couponName: couponData.name,
        usedBy: sanitizedUserName,
        createdAt: serverTimestamp(),
        isRead: false
      };
      
      transaction.set(notificationRef, notificationData);
    });

    return true;
  } catch (error) {
    // Re-throw known safe errors, wrap unknown errors
    if (error instanceof Error) {
      const safeMessages = [
        'Cupom não encontrado.',
        'Este cupom foi desativado.',
        'Este cupom já foi totalmente utilizado!',
        'Este cupom expirou.',
        'Nome inválido.'
      ];
      if (safeMessages.includes(error.message)) {
        throw error;
      }
    }
    throw new Error('Erro ao processar resgate.');
  }
};