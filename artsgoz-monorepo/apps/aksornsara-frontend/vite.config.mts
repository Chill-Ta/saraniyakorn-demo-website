/// <reference types='vitest' />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/aksornsara-frontend',
  server: {
    port: 4201,
    host: 'localhost',
  },
  preview: {
    port: 4201,
    host: 'localhost',
  },
  optimizeDeps: {
    exclude: ['@artsgoz/design-system'],
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@base-components': resolve(
        import.meta.dirname,
        '../../libs/base-components/src/index.ts',
      ),
      '@artsgoz/design-system': resolve(
        import.meta.dirname,
        '../../libs/design-system/src/index.tsx',
      ),
    },
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
