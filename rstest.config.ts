export const testConfig = {
  testMatch: [
    '**/tests/**/*.test.{ts,tsx}',
    '**/*.test.{ts,tsx}',
    'apps/**/tests/**/*.test.{ts,tsx}',
    'libs/**/tests/**/*.test.{ts,tsx}',
  ],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^~/(.*)$': './src/$1',
    '^@shared/(.*)$': './libs/shared/$1',
    '^@marketing/(.*)$': './apps/marketing/src/$1',
    '^@blog/(.*)$': './apps/blog/src/$1',
    '^@storefront/(.*)$': './apps/storefront/src/$1',
    '^@docs/(.*)$': './apps/astro-docs/src/$1',
    '^@remix/(.*)$': './apps/remix-app/app/$1',
    '^@sveltekit/(.*)$': './apps/sveltekit-spa/src/$1',
  },
  setupFiles: ['./tests/setup.ts'],
  coverage: {
    include: [
      'src/**/*.{ts,tsx}',
      'apps/**/*.{ts,tsx}',
      'libs/**/*.{ts,tsx}',
      'apps/**/src/**/*.{ts,tsx}',
      'apps/**/app/**/*.{ts,tsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/tests/**',
      '**/*.config.{js,ts}',
      '**/dist/**',
      '**/.svelte-kit/**',
      '**/build/**',
      '**/styled-system/**',
    ],
  },
  testTimeout: 15000,
  frameworks: {
    solidjs: {
      transform: 'rstest/transformer',
      testEnvironment: 'jsdom',
    },
    remix: {
      transform: 'rstest/transformer',
      testEnvironment: 'node',
    },
    svelte: {
      transform: 'rstest/transformer',
      testEnvironment: 'jsdom',
    },
    astro: {
      transform: 'rstest/transformer',
      testEnvironment: 'jsdom',
    },
  },
};

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
