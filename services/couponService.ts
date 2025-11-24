import { db } from './firebase';
import { doc, getDoc, runTransaction, collection, serverTimestamp } from 'firebase/firestore';
import { Coupon, Notification } from '../types';

const COUPONS_COLLECTION = 'coupons';
const NOTIFICATIONS_COLLECTION = 'notifications';

export const getCoupon = async (id: string): Promise<Coupon | null> => {
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
  } catch (error) {
    console.error("Error fetching coupon:", error);
    throw error;
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
 */
// TODO: Improve security with Firestore Rules
export const redeemCoupon = async (couponId: string, userName: string): Promise<boolean> => {
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
        message: `${userName} acabou de resgatar o cupom "${couponData.name}"!`,
        couponId: couponId,
        couponName: couponData.name,
        usedBy: userName,
        createdAt: serverTimestamp(),
        isRead: false
      };
      
      transaction.set(notificationRef, notificationData);
    });

    return true;
  } catch (error) {
    console.error("Transaction failed: ", error);
    throw error;
  }
};