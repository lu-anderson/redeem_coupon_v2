import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: 'app' })),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({ name: 'db' })),
}));

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { createFirebaseServices } from './firebase';

const validConfig = {
  apiKey: 'dummy-api-key',
  authDomain: 'dummy.firebaseapp.com',
  projectId: 'dummy-project',
  appId: 'dummy-app-id',
};

describe('createFirebaseServices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not initialize Firebase when a required field is missing', () => {
    const result = createFirebaseServices({ ...validConfig, projectId: '  ' });

    expect(result.db).toBeNull();
    expect(result.app).toBeNull();
    expect(result.missing).toEqual(['VITE_FIREBASE_PROJECT_ID']);
    expect(initializeApp).not.toHaveBeenCalled();
    expect(getFirestore).not.toHaveBeenCalled();
  });

  it('lists every missing variable name', () => {
    const result = createFirebaseServices({});

    expect(result.missing).toEqual([
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_APP_ID',
    ]);
    expect(initializeApp).not.toHaveBeenCalled();
  });

  it('initializes Firestore only when apiKey, authDomain, projectId, and appId are set', () => {
    const result = createFirebaseServices(validConfig);

    expect(result.db).toEqual({ name: 'db' });
    expect(initializeApp).toHaveBeenCalledTimes(1);
    expect(initializeApp).toHaveBeenCalledWith({
      apiKey: 'dummy-api-key',
      authDomain: 'dummy.firebaseapp.com',
      projectId: 'dummy-project',
      appId: 'dummy-app-id',
    });
    expect(getFirestore).toHaveBeenCalledTimes(1);
  });
});
