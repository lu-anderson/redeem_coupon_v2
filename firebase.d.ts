declare module 'firebase/app' {
  export interface FirebaseApp {}
  export interface FirebaseOptions {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
  }
  export function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
}

declare module 'firebase/firestore' {
  export interface Firestore {}
  
  export interface DocumentReference<T = any> {
    id: string;
    path: string;
  }
  
  export interface CollectionReference<T = any> extends DocumentReference<T> {}
  
  export interface DocumentSnapshot<T = any> {
    exists(): boolean;
    data(): T | undefined;
    id: string;
    ref: DocumentReference<T>;
  }
  
  export interface Transaction {
    get<T>(documentRef: DocumentReference<T>): Promise<DocumentSnapshot<T>>;
    set<T>(documentRef: DocumentReference<T>, data: T): Transaction;
    update(documentRef: DocumentReference<any>, data: any): Transaction;
    delete(documentRef: DocumentReference<any>): Transaction;
  }
  
  export function getFirestore(app?: any): Firestore;
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference;
  // Overload for creating a new document reference with an auto-generated ID within a collection
  export function doc(collectionRef: CollectionReference): DocumentReference;
  export function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference;
  export function getDoc<T = any>(reference: DocumentReference<T>): Promise<DocumentSnapshot<T>>;
  export function runTransaction<T>(firestore: Firestore, updateFunction: (transaction: Transaction) => Promise<T>): Promise<T>;
  export function serverTimestamp(): any;
  // addDoc is not included here as we removed it from usage, but we can add it if needed
  export function addDoc(collectionRef: CollectionReference, data: any): Promise<DocumentReference>;
}