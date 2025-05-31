
export const testConfig = {
  testMatch: ['**/tests/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^~/(.*)$': './src/$1',
    '^@shared/(.*)$': './libs/shared/$1',
  },
  setupFiles: ['./tests/setup.ts'],
  coverage: {
    include: ['src/**/*.{ts,tsx}', 'apps/**/*.{ts,tsx}', 'libs/**/*.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/tests/**', '**/*.config.{js,ts}'],
  },
  testTimeout: 10000,
};

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
