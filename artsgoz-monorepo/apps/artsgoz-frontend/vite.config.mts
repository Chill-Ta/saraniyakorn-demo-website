/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/artsgoz-frontend',
  server: {
    port: 4300,
    host: 'localhost',
  },
  optimizeDeps: {
    exclude: ['@artsgoz/design-system', '@artsgoz/yellow-card-shared', '@org/design-system', '@org/yellow-card-shared'],
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@base-components': resolve(
        import.meta.dirname,
        '../../libs/base-components/src/index.ts',
      ),
      '@artsgoz/yellow-card-shared': resolve(
        import.meta.dirname,
        '../../libs/yellow-card-shared/src/index.ts',
      ),
      '@artsgoz/design-system': resolve(
        import.meta.dirname,
        '../../libs/design-system/src/index.tsx',
      ),
      '@org/yellow-card-shared': resolve(
        import.meta.dirname,
        '../../libs/yellow-card-shared/src/index.ts',
      ),
      '@org/design-system': resolve(
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
