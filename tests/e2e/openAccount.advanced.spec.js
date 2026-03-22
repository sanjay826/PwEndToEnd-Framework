/**
 * Advanced Open Account Test Suite
 * Additional comprehensive test scenarios with complex workflows
 */

const { test, expect } = require('@playwright/test');
const { OpenAccountPage } = require('../pages/openAccountPage');
const testData = require('../data/testData');
const { logStep, retryWithBackoff, extractNumber } = require('../utils/testHelpers');

test.describe('Advanced Open Account Scenarios', () => {
  let openAccountPage;

  test.beforeEach(async ({ page }) => {
    openAccountPage = new OpenAccountPage(page);
    await openAccountPage.navigate();
    const isLoaded = await openAccountPage.isPageLoaded();
    expect(isLoaded).toBeTruthy();
  });

  test('TC-007: Create account with retry on transient failure', async () => {
    logStep('Testing account creation with retry logic');

    const createAccount = async () => {
      await openAccountPage.selectAccountType('CHECKING');
      await openAccountPage.waitForFundingAccountsToLoad();
      await openAccountPage.selectFundingAccount('11111');
      await openAccountPage.clickOpenNewAccountButton();
      const success = await openAccountPage.verifySuccessMessage();
      expect(success).toBeTruthy();
    };

    // Use retry with exponential backoff
    await retryWithBackoff(createAccount, 3, 1000);
    
    const accountId = await openAccountPage.getNewAccountId();
    console.log(`✅ Account created successfully with ID: ${accountId}`);
  });

  test('TC-008: Validate dropdown cascading behavior', async () => {
    logStep('Testing cascading dropdown behavior');

    // Get initial account types
    const accountTypes = await openAccountPage.getAccountTypeOptions();
    logStep(`Available account types: ${accountTypes.join(', ')}`);

    for (const accountType of accountTypes) {
      logStep(`\nTesting account type: ${accountType}`);
      await openAccountPage.selectAccountType(accountType);
      
      // Account type selection should trigger funding account population
      await openAccountPage.waitForFundingAccountsToLoad();
      
      const fundingAccounts = await openAccountPage.getFundingAccountOptions();
      logStep(`Funding accounts available: ${fundingAccounts.length}`);
      
      expect(fundingAccounts.length).toBeGreaterThan(0);
    }

    console.log('✅ Cascading dropdown behavior verified for all account types');
  });

  test('TC-009: Test rapid successive account creations', async () => {
    logStep('Testing rapid successive account creations');

    const accountsCreated = [];

    for (let i = 0; i < 3; i++) {
      logStep(`Creating account ${i + 1} of 3`);
      
      await openAccountPage.selectAccountType('CHECKING');
      await openAccountPage.waitForFundingAccountsToLoad();
      await openAccountPage.selectFundingAccount('11111');
      await openAccountPage.clickOpenNewAccountButton();
      
      const success = await openAccountPage.verifySuccessMessage();
      expect(success).toBeTruthy();
      
      const accountId = await openAccountPage.getNewAccountId();
      accountsCreated.push(accountId);
      
      logStep(`Account created: ${accountId}`);

      // Navigate back to open account page for next creation
      await openAccountPage.navigate();
      const isLoaded = await openAccountPage.isPageLoaded();
      expect(isLoaded).toBeTruthy();
    }

    console.log(`✅ Created ${accountsCreated.length} accounts: ${accountsCreated.join(', ')}`);
    
    // Verify all account IDs are unique
    const uniqueIds = new Set(accountsCreated);
    expect(uniqueIds.size).toBe(accountsCreated.length);
  });

  test('TC-010: Verify form state after failed submission', async () => {
    logStep('Verifying form state after failed submission attempt');

    logStep('Step 1: Select account type');
    await openAccountPage.selectAccountType('CHECKING');
    await openAccountPage.waitForFundingAccountsToLoad();

    logStep('Step 2: Attempt submission without funding account');
    await openAccountPage.clickOpenNewAccountButton();

    logStep('Step 3: Verify form still shows selected account type');
    // Get the currently selected value in account type dropdown
    const selectedValue = await openAccountPage.accountTypeDropdown.inputValue();
    expect(selectedValue).toBeTruthy();

    logStep('Step 4: Now complete the form');
    await openAccountPage.selectFundingAccount('11111');
    await openAccountPage.clickOpenNewAccountButton();

    logStep('Step 5: Verify successful submission');
    const success = await openAccountPage.verifySuccessMessage();
    expect(success).toBeTruthy();

    console.log('✅ Form state correctly preserved after failed attempt');
  });

  test('TC-011: Test different account types create unique accounts', async () => {
    logStep('Testing that different account types result in proper account creation');

    const accountTypes = ['CHECKING', 'SAVINGS'];
    const createdAccounts = {};

    for (const accountType of accountTypes) {
      logStep(`Creating ${accountType} account`);
      
      await openAccountPage.selectAccountType(accountType);
      await openAccountPage.waitForFundingAccountsToLoad();
      await openAccountPage.selectFundingAccount('11111');
      await openAccountPage.clickOpenNewAccountButton();

      const success = await openAccountPage.verifySuccessMessage();
      expect(success).toBeTruthy();

      const accountId = await openAccountPage.getNewAccountId();
      createdAccounts[accountType] = accountId;

      logStep(`${accountType} account created with ID: ${accountId}`);

      // Navigate back for next iteration
      await openAccountPage.navigate();
      const isLoaded = await openAccountPage.isPageLoaded();
      expect(isLoaded).toBeTruthy();
    }

    // Verify different account types have different IDs
    const ids = Object.values(createdAccounts);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    console.log('✅ Different account types created unique accounts');
  });

  test('TC-012: Measure page load performance', async ({ page }) => {
    logStep('Measuring page load performance metrics');

    const navigationTiming = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        loadComplete: timing.loadEventEnd - timing.loadEventStart,
        domInteractive: timing.domInteractive - timing.fetchStart,
      };
    });

    logStep(`DOM Content Loaded: ${navigationTiming.domContentLoaded}ms`);
    logStep(`Load Complete: ${navigationTiming.loadComplete}ms`);
    logStep(`DOM Interactive: ${navigationTiming.domInteractive}ms`);

    // Assert reasonable performance
    expect(navigationTiming.domInteractive).toBeLessThan(5000);
    
    console.log('✅ Page loaded within performance expectations');
  });
});
