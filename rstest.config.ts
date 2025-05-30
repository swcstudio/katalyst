export default {
  testMatch: ['**/tests/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx)$': 'rstest/transformer',
  },
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/libs/shared/$1',
  },
};

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
