import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment variables from .env file if present.
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = process.env.BASE_URL || 'https://parabank.parasoft.com';
const TIMEOUT = Number(process.env.TIMEOUT) || 45000;

/**
 * Modern, robust Playwright configuration as per market trends.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/globalSetup.ts',

  /* Maximum time one test can run for */
  timeout: TIMEOUT,

  /* Assertion timeout */
  expect: {
    timeout: 10000,
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI or according to environment settings */
  retries: process.env.CI ? 2 : (Number(process.env.RETRIES) || 0),

  /* Parallel workers count */
  workers: process.env.CI ? 1 : (Number(process.env.WORKERS) || undefined),

  /* Reporters: HTML report for deep inspection + clean CLI list */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],

  /* Shared settings across all projects */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,

    /* Headless mode */
    headless: process.env.HEADLESS !== 'false',

    /* Action timeout */
    actionTimeout: 15000,

    /* Navigation timeout */
    navigationTimeout: 30000,

    /* Collect trace when retrying or on failure */
    trace: 'on-first-retry',

    /* Capture screenshot only when tests fail */
    screenshot: 'only-on-failure',

    /* Record video only on retry/failure to save disk space and performance */
    video: 'retain-on-failure',

    /* Slow motion if configured */
    launchOptions: {
      slowMo: Number(process.env.SLOW_MO) || 0,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }, */
  ],

  /* Folder for test artifacts such as screenshots, videos, traces */
  outputDir: 'test-results',
});
