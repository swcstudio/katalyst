import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'core/src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'remix/app/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'nextjs/src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'shared/src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      '.remix/**',
      'tests/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/coverage/**',
        '**/dist/**',
        '**/.next/**',
        '**/.remix/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './shared/src'),
      '@katalyst/shared': resolve(__dirname, './shared/src/index.ts'),
      '@katalyst/core': resolve(__dirname, './core/src/main.tsx'),
      '@katalyst/remix': resolve(__dirname, './remix/app/root.tsx'),
      '@katalyst/nextjs': resolve(__dirname, './nextjs/src/app/page.tsx'),
      '@/components': resolve(__dirname, './shared/src/components'),
      '@/hooks': resolve(__dirname, './shared/src/hooks'),
      '@/utils': resolve(__dirname, './shared/src/utils'),
      '@/stores': resolve(__dirname, './shared/src/stores'),
      '@/integrations': resolve(__dirname, './shared/src/integrations'),
      '@/config': resolve(__dirname, './shared/src/config'),
      '@/plugins': resolve(__dirname, './shared/src/plugins'),
      '@/factory': resolve(__dirname, './shared/src/factory'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify((typeof process !== 'undefined' && process.env.NODE_ENV) || 'test'),
  },
});
