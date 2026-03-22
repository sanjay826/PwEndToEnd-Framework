/**
 * Base Test Fixture
 * Provides common setup and teardown for all tests
 */

const { test: baseTest } = require('@playwright/test');
const { OpenAccountPage } = require('../pages/openAccountPage');
const testData = require('../data/testData');

/**
 * Custom fixture that includes OpenAccountPage
 */
const test = baseTest.extend({
  /**
   * Initialize OpenAccountPage for use in tests
   */
  openAccountPage: async ({ page }, use) => {
    const openAccountPage = new OpenAccountPage(page);
    
    // Setup: Navigate to the page
    await openAccountPage.navigate();
    
    // Provide the page to the test
    await use(openAccountPage);
    
    // Teardown: Optional cleanup after test
    // (Browser will be automatically closed by Playwright)
  },

  /**
   * Test data fixture
   */
  testData: testData,
});

module.exports = { test };
