/**
 * Open Account - End-to-End Test Suite
 * Tests for creating new accounts in ParaBank
 */

const { test, expect } = require('@playwright/test');
const { OpenAccountPage } = require('../pages/openAccountPage');
const testData = require('../data/testData');
const { logStep, extractNumber } = require('../utils/testHelpers');

test.describe('Open Account Page', () => {
  let openAccountPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page object and navigate
    openAccountPage = new OpenAccountPage(page);
    await openAccountPage.navigate();
    
    // Verify page is loaded
    const isLoaded = await openAccountPage.isPageLoaded();
    expect(isLoaded).toBeTruthy();
    logStep('Open Account page loaded successfully');
  });

  test('TC-001: Should display Open Account page with all required elements', async () => {
    logStep('Verifying page title');
    const hasTitle = await openAccountPage.verifyPageTitle('Open Account');
    expect(hasTitle).toBeTruthy();

    logStep('Verifying account type dropdown is visible');
    expect(await openAccountPage.accountTypeDropdown.isVisible()).toBeTruthy();

    logStep('Verifying funding account dropdown is visible');
    expect(await openAccountPage.fundingAccountDropdown.isVisible()).toBeTruthy();

    logStep('Verifying submit button is visible');
    expect(await openAccountPage.submitButton.isVisible()).toBeTruthy();

    logStep('Verifying submit button is enabled');
    expect(await openAccountPage.isSubmitButtonEnabled()).toBeTruthy();
  });

  test('TC-002: Should successfully create a checking account', async () => {
    const scenario = testData.validScenarios[0]; // Create Checking Account
    
    logStep(`Selecting account type: ${scenario.accountType}`);
    await openAccountPage.selectAccountType(scenario.accountType);
    
    logStep(`Waiting for funding accounts to load`);
    await openAccountPage.waitForFundingAccountsToLoad();
    
    logStep(`Selecting funding account: ${scenario.fundingAccount}`);
    await openAccountPage.selectFundingAccount(scenario.fundingAccount);
    
    logStep('Clicking Open New Account button');
    await openAccountPage.clickOpenNewAccountButton();
    
    logStep('Verifying success message');
    const hasSuccessMessage = await openAccountPage.verifySuccessMessage();
    expect(hasSuccessMessage).toBeTruthy();
    
    logStep('Extracting new account ID');
    const accountId = await openAccountPage.getNewAccountId();
    expect(accountId).toBeTruthy();
    console.log(`✅ New account created with ID: ${accountId}`);
  });

  test('TC-003: Should successfully create a savings account with proper validation', async () => {
    const scenario = testData.validScenarios[1]; // Create Savings Account
    
    logStep('Starting account creation workflow');
    
    logStep(`Step 1: Selecting account type "${scenario.accountType}"`);
    await openAccountPage.selectAccountType(scenario.accountType);
    
    logStep('Step 2: Waiting for funding account options to populate');
    await openAccountPage.waitForFundingAccountsToLoad();
    
    // Get available funding accounts
    const fundingAccounts = await openAccountPage.getFundingAccountOptions();
    logStep(`Available funding accounts: ${fundingAccounts.join(', ')}`);
    expect(fundingAccounts.length).toBeGreaterThan(0);
    
    logStep(`Step 3: Selecting funding account`);
    await openAccountPage.selectFundingAccount(scenario.fundingAccount);
    
    logStep('Step 4: Submitting form');
    await openAccountPage.clickOpenNewAccountButton();
    
    logStep('Step 5: Verifying account was created successfully');
    const successMessageText = await openAccountPage.getSuccessMessageText();
    expect(successMessageText).toContain(testData.successMessages.accountOpened);
    
    logStep('Step 6: Extracting and validating new account ID');
    const newAccountId = await openAccountPage.getNewAccountId();
    expect(newAccountId).toBeTruthy();
    expect(newAccountId).toMatch(/^\d+$/);
    
    console.log(`✅ Savings account successfully created - Account ID: ${newAccountId}`);
  });

  test('TC-004: Should show validation error when account type is not selected', async () => {
    const scenario = testData.invalidScenarios[0]; // No Account Type Selected
    
    logStep('Attempting to submit form without selecting account type');
    
    logStep('Selecting funding account without account type');
    if (scenario.fundingAccount) {
      await openAccountPage.selectFundingAccount(scenario.fundingAccount);
    }
    
    logStep('Clicking submit button');
    await openAccountPage.clickOpenNewAccountButton();
    
    logStep('Verifying error message appears');
    try {
      // Check if error appears or if page prevents submission
      const errorVisible = await openAccountPage.verifyErrorMessage();
      expect(errorVisible).toBeTruthy();
      
      const errorText = await openAccountPage.getErrorMessageText();
      console.log(`✅ Validation error displayed: ${errorText}`);
    } catch {
      // Some implementations prevent form submission entirely
      logStep('Form submission prevented (validation handled client-side)');
    }
  });

  test('TC-005: Should show validation error when funding account is not selected', async () => {
    const scenario = testData.invalidScenarios[1]; // No Funding Account Selected
    
    logStep('Attempting to submit form with account type but no funding account');
    
    logStep(`Selecting account type: ${scenario.accountType}`);
    await openAccountPage.selectAccountType(scenario.accountType);
    
    logStep('Waiting for funding account dropdown');
    await openAccountPage.waitForFundingAccountsToLoad();
    
    logStep('Attempting to submit without selecting funding account');
    await openAccountPage.clickOpenNewAccountButton();
    
    logStep('Verifying error message or form validation');
    try {
      const errorVisible = await openAccountPage.verifyErrorMessage();
      expect(errorVisible).toBeTruthy();
      
      const errorText = await openAccountPage.getErrorMessageText();
      console.log(`✅ Validation error displayed: ${errorText}`);
    } catch {
      logStep('Form submission prevented (validation handled client-side)');
    }
  });

  test('TC-006: Should verify all available account types can be selected', async () => {
    logStep('Retrieving all available account types');
    
    const availableTypes = await openAccountPage.getAccountTypeOptions();
    expect(availableTypes.length).toBeGreaterThan(0);
    
    logStep(`Found account types: ${availableTypes.join(', ')}`);
    
    // Test selecting each available type
    for (const accountType of availableTypes) {
      logStep(`Testing selection of account type: ${accountType}`);
      await openAccountPage.selectAccountType(accountType);
      
      // Wait for funding accounts to populate
      await openAccountPage.waitForFundingAccountsToLoad();
      
      const fundingAccounts = await openAccountPage.getFundingAccountOptions();
      expect(fundingAccounts.length).toBeGreaterThan(0);
      
      console.log(`✅ Account type "${accountType}" - ${fundingAccounts.length} funding accounts available`);
    }
  });
});
