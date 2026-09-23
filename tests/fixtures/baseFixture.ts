import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { OpenAccountPage } from '../pages/openAccountPage';
import { testData } from '../data/testData';

/**
 * Fixture types defining available test context
 */
export type CustomFixtures = {
  loginPage: LoginPage;
  openAccountPage: OpenAccountPage;
  testData: typeof testData;
};

/**
 * Custom test fixture extending base Playwright test
 * Provides pre-instantiated page objects and test data
 */
export const test = baseTest.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  openAccountPage: async ({ page }, use) => {
    const openAccountPage = new OpenAccountPage(page);
    await use(openAccountPage);
  },

  testData: async ({}, use) => {
    await use(testData);
  },
});

export { expect };
export default test;
