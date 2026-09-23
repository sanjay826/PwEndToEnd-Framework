import { Locator, Page } from '@playwright/test';
import { EnvConfig } from '../utils/envConfig';

/**
 * Modern, strongly-typed Page Object Model for ParaBank Login
 */
export class LoginPage {
  readonly page: Page;
  readonly baseUrl: string;

  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotLoginLink: Locator;
  readonly registerLink: Locator;
  readonly loginHeading: Locator;
  readonly errorMessage: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = EnvConfig.baseUrl;

    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[type="submit"][value="Log In"]');
    this.forgotLoginLink = page.getByRole('link', { name: /forgot login info/i });
    this.registerLink = page.getByRole('link', { name: /register/i });
    this.loginHeading = page.locator('h2', { hasText: 'Customer Login' });
    this.errorMessage = page.locator('.error, [role="alert"], p.error');
    this.welcomeMessage = page.locator('#leftPanel, .smallText', { hasText: /welcome/i });
  }

  /**
   * Navigate to ParaBank home page / login panel
   */
  async navigate(): Promise<void> {
    const homeUrl = `${this.baseUrl}/parabank/index.htm`;
    await this.page.goto(homeUrl, { waitUntil: 'domcontentloaded' });
    await this.loginHeading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  /**
   * Check if login page/panel is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.loginHeading.isVisible().catch(() => false);
  }

  /**
   * Check if username input is visible
   */
  async isUsernameFieldVisible(): Promise<boolean> {
    return await this.usernameInput.isVisible();
  }

  /**
   * Check if password input is visible
   */
  async isPasswordFieldVisible(): Promise<boolean> {
    return await this.passwordInput.isVisible();
  }

  /**
   * Check if login button is visible
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Perform login action
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get displayed error message if login failed
   */
  async getErrorMessage(): Promise<string> {
    try {
      if (await this.errorMessage.isVisible({ timeout: 5000 })) {
        return (await this.errorMessage.textContent()) || '';
      }
    } catch {
      // Element not found within timeout
    }
    return '';
  }

  /**
   * Check if user is currently authenticated
   */
  async isLoggedIn(): Promise<boolean> {
    return (await this.welcomeMessage.count()) > 0;
  }
}

export default LoginPage;
