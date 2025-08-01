import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!(typeof process !== 'undefined' && process.env.CI),
  retries: typeof process !== 'undefined' && process.env.CI ? 2 : 0,
  workers: typeof process !== 'undefined' && process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev:core',
      port: 3000,
      reuseExistingServer: !(typeof process !== 'undefined' && process.env.CI),
    },
    {
      command: 'npm run dev:remix',
      port: 3001,
      reuseExistingServer: !(typeof process !== 'undefined' && process.env.CI),
    },
    {
      command: 'npm run dev:nextjs',
      port: 3002,
      reuseExistingServer: !(typeof process !== 'undefined' && process.env.CI),
    },
  ],
  outputDir: 'test-results/',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
});
