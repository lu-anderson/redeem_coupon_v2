import { beforeEach, describe, expect, it, vi } from 'vitest';

const firestoreMocks = vi.hoisted(() => ({
  getDocs: vi.fn(() => new Promise(() => {})),
  collection: vi.fn(),
  addDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock('./firebase', () => ({
  requireDb: () => {
    const error = new Error(
      'Firebase config is incomplete. Missing environment variables: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID',
    );
    error.name = 'FirebaseConfigError';
    throw error;
  },
}));

vi.mock('firebase/firestore', () => firestoreMocks);

import { createDeletionRequest } from './deletionRequestService';

describe('createDeletionRequest', () => {
  beforeEach(() => {
    firestoreMocks.getDocs.mockClear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('fails fast when Firebase config is invalid instead of waiting on Firestore', async () => {
    await expect(createDeletionRequest('person@example.com')).rejects.toThrow(
      /VITE_FIREBASE_API_KEY/,
    );
    expect(firestoreMocks.getDocs).not.toHaveBeenCalled();
    expect(firestoreMocks.addDoc).not.toHaveBeenCalled();
  });
});
