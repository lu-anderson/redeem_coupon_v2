import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
} from 'firebase/firestore';
import { db } from './firebase';

export interface DeletionRequest {
  email: string;
  requestedAt: any; // Timestamp do Firebase
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  confirmationToken?: string;
  confirmedAt?: any;
  processedAt?: any;
}

const DELETION_REQUESTS_COLLECTION = 'deletion_requests';

/**
 * Cria uma nova solicitação de exclusão de conta
 * @param email Email do usuário solicitando exclusão
 * @returns ID da solicitação criada e token de confirmação
 */
export const createDeletionRequest = async (email: string): Promise<null> => {
  try {
    // Verificar se já existe uma solicitação pendente para este email
    const existingRequestsQuery = query(
      collection(db, DELETION_REQUESTS_COLLECTION),
      where('email', '==', email.toLowerCase()),
      where('status', '==', 'pending')
    );
    
    const existingRequests = await getDocs(existingRequestsQuery);
    
    if (!existingRequests.empty) {
      throw new Error('Já existe uma solicitação de exclusão pendente para este e-mail.');
    }

    // Gerar token de confirmação único
  

    // Criar a solicitação no Firestore
    await addDoc(collection(db, DELETION_REQUESTS_COLLECTION), {
      email: email.toLowerCase(),
      requestedAt: serverTimestamp(),
      status: 'pending',
      confirmedAt: null,
      processedAt: null,
    } as DeletionRequest);

    return null;
  } catch (error) {
    console.log(error)
    console.error('Erro ao criar solicitação de exclusão:', error);
    throw error;
  }
};