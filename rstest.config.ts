export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapping: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/libs/shared/$1',
    '^@marketing/(.*)$': '<rootDir>/apps/marketing/src/$1',
    '^@blog/(.*)$': '<rootDir>/apps/blog/src/$1',
    '^@storefront/(.*)$': '<rootDir>/apps/storefront/src/$1',
    '^@docs/(.*)$': '<rootDir>/apps/astro-docs/src/$1',
    '^@remix/(.*)$': '<rootDir>/apps/remix-app/app/$1',
    '^@sveltekit/(.*)$': '<rootDir>/apps/sveltekit-spa/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          jsx: 'react-jsx',
          jsxImportSource: 'solid-js',
        },
      },
    ],
    '^.+\\.svelte$': [
      'svelte-jester',
      {
        preprocess: true,
      },
    ],
    '^.+\\.astro$': [
      'astro-jest',
      {
        preprocess: true,
      },
    ],
  },
  testMatch: [
    '<rootDir>/apps/*/tests/**/*.test.{ts,tsx}',
    '<rootDir>/tests/**/*.test.{ts,tsx}',
    '<rootDir>/libs/*/tests/**/*.test.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'apps/*/src/**/*.{ts,tsx}',
    'libs/*/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
