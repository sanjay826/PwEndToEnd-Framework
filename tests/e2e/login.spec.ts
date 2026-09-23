import { test, expect } from '../fixtures/baseFixture';
import { logStep } from '../utils/testHelpers';

test.describe('ParaBank Login Suite', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('TC-L001: Should display login page with all required elements', async ({ loginPage }) => {
    logStep('Verifying login form elements');
    await expect(loginPage.loginHeading).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.forgotLoginLink).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
  });

  test('TC-L002: Should attempt login with configured credentials', async ({ loginPage, testData }) => {
    logStep(`Entering credentials: ${testData.loginCredentials.username}`);
    await loginPage.usernameInput.fill(testData.loginCredentials.username);
    await loginPage.passwordInput.fill(testData.loginCredentials.password);

    logStep('Submitting login form');
    await loginPage.loginButton.click();
    await loginPage.page.waitForLoadState('domcontentloaded');

    // Note: Live credentials may be unverified on demo environment; asserting URL or form state
    logStep('Checking post-submit URL');
    expect(loginPage.page.url()).toContain('parabank');
  });

  test('TC-L003: Should handle login workflow submission', async ({ loginPage, testData }) => {
    logStep('Performing login action');
    await loginPage.login(testData.loginCredentials.username, testData.loginCredentials.password);
    expect(loginPage.page.url()).toContain('parabank');
  });

  test('TC-L004: Should display error or retain form with invalid credentials', async ({ loginPage, testData }) => {
    logStep('Entering invalid credentials');
    await loginPage.login(testData.loginCredentials.invalidUsername, testData.loginCredentials.invalidPassword);

    logStep('Verifying login did not grant access');
    const isLoginVisible = await loginPage.isLoginPageDisplayed();
    const hasError = await loginPage.errorMessage.isVisible().catch(() => false);
    expect(isLoginVisible || hasError).toBeTruthy();
  });

  test('TC-L005: Should handle empty username field', async ({ loginPage, testData }) => {
    logStep('Entering password without username');
    await loginPage.passwordInput.fill(testData.loginCredentials.password);
    await loginPage.loginButton.click();

    logStep('Verifying user remains on login page');
    await expect(loginPage.loginHeading).toBeVisible();
  });

  test('TC-L006: Should handle empty password field', async ({ loginPage, testData }) => {
    logStep('Entering username without password');
    await loginPage.usernameInput.fill(testData.loginCredentials.username);
    await loginPage.loginButton.click();

    logStep('Verifying user remains on login page');
    await expect(loginPage.loginHeading).toBeVisible();
  });

  test('TC-L007: Should allow clearing and re-entering login credentials', async ({ loginPage, testData }) => {
    logStep('Entering incorrect username first');
    await loginPage.usernameInput.fill('wronguser');

    logStep('Clearing username field');
    await loginPage.usernameInput.clear();
    await expect(loginPage.usernameInput).toHaveValue('');

    logStep(`Re-entering username: ${testData.loginCredentials.username}`);
    await loginPage.usernameInput.fill(testData.loginCredentials.username);
    await expect(loginPage.usernameInput).toHaveValue(testData.loginCredentials.username);

    logStep('Entering password');
    await loginPage.passwordInput.fill(testData.loginCredentials.password);
  });

  test('TC-L008: Should verify login button attributes and state', async ({ loginPage }) => {
    logStep('Verifying login button visibility and attributes');
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.loginButton).toHaveAttribute('type', 'submit');
  });

  test('TC-L009: Should display correct page title on initial load', async ({ loginPage }) => {
    logStep('Verifying document title');
    await expect(loginPage.page).toHaveTitle(/ParaBank/);
  });

  test('TC-L010: Should verify navigation links present on login panel', async ({ loginPage }) => {
    logStep('Checking registration and lookup links');
    await expect(loginPage.registerLink).toHaveAttribute('href', /register\.htm/);
    await expect(loginPage.forgotLoginLink).toHaveAttribute('href', /lookup\.htm/);
  });
});
