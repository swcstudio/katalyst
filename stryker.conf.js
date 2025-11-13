/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
module.exports = {
  packageManager: 'bun',
  reporters: ['html', 'clear-text', 'progress', 'dashboard'],
  testRunner: 'jest',
  coverageAnalysis: 'perTest',
  
  // Files to mutate
  mutate: [
    'core/src/**/*.{ts,tsx}',
    'remix/app/**/*.{ts,tsx}',
    'next/src/**/*.{ts,tsx}',
    'shared/src/**/*.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    '!**/*.spec.{ts,tsx}',
    '!**/*.stories.{ts,tsx}',
    '!**/test-utils/**',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**',
    '!**/coverage/**'
  ],

  // TypeScript mutation settings
  mutator: {
    name: 'typescript',
    excludedMutations: [
      'StringLiteral', // Don't mutate string literals
      'ObjectLiteral'  // Don't mutate object literals
    ]
  },

  // Thresholds for mutation score
  thresholds: {
    high: 80,
    low: 60,
    break: 50 // Fail the build if mutation score < 50%
  },

  // Jest specific configuration
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.js',
    enableFindRelatedTests: true
  },

  // Dashboard reporter configuration
  dashboard: {
    project: 'github.com/swcstudio/katalyst-react',
    version: 'main',
    module: 'core',
    baseUrl: 'https://dashboard.stryker-mutator.io/api/reports',
    reportType: 'mutation-score'
  },

  // Advanced options
  tempDirName: '.stryker-tmp',
  cleanTempDir: true,
  logLevel: 'info',
  fileLogLevel: 'trace',
  timeoutMS: 60000,
  timeoutFactor: 1.5,
  maxConcurrentTestRunners: 4,
  symlinkNodeModules: false,
  
  // Incremental mode for faster runs
  incremental: true,
  incrementalFile: '.stryker-incremental.json',

  // HTML reporter options
  htmlReporter: {
    fileName: 'reports/mutation/index.html'
  },

  // Clear text reporter options
  clearTextReporter: {
    maxTestsToLog: 3,
    coverageAnalysis: 'perTest',
    logTests: true,
    allowColor: true
  },

  // Sandbox options
  sandbox: {
    fileHeaders: {
      '**/*.tsx': `// @ts-nocheck\n/* eslint-disable */\n`,
      '**/*.ts': `// @ts-nocheck\n/* eslint-disable */\n`
    }
  },

  // Mutation testing plugins
  plugins: [
    '@stryker-mutator/jest-runner',
    '@stryker-mutator/typescript-checker',
    '@stryker-mutator/html-reporter',
    '@stryker-mutator/clear-text-reporter',
    '@stryker-mutator/progress-reporter',
    '@stryker-mutator/dashboard-reporter'
  ],

  // TypeScript checker options
  typescriptChecker: {
    prioritizePerformanceOverAccuracy: true
  },

  // Build command before mutation testing
  buildCommand: 'bun run build',

  // Disable type checking for specific mutations
  disableTypeChecks: '{shared,core,remix,next}/**/*.{ts,tsx}'
};