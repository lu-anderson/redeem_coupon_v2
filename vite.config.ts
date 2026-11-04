/// <reference types="vitest/config" />
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { FIREBASE_ENV_VARS, missingFirebaseEnvVars, readFirebaseWebConfig } from './config/firebaseEnv';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    // Shell exports must count even if loadEnv only read files. Vite also
    // inlines these VITE_* values into import.meta.env for the client bundle.
    for (const name of FIREBASE_ENV_VARS) {
      const fromProcess = process.env[name];
      if (typeof fromProcess === 'string' && fromProcess.trim() !== '') {
        env[name] = fromProcess;
      }
    }

    if (command === 'build') {
      const missing = missingFirebaseEnvVars(readFirebaseWebConfig(env));
      if (missing.length > 0) {
        throw new Error(
          `Cannot build without Firebase config. Missing environment variable(s): ${missing.join(', ')}. ` +
          `Add them to .env.${mode} (gitignored) or export them before building. ` +
          `Use yarn build:dev, yarn build:staging, or yarn build:prod so the matching env file is loaded.`,
        );
      }
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      test: {
        environment: 'jsdom',
        setupFiles: './test/setup.ts',
      },
    };
});
