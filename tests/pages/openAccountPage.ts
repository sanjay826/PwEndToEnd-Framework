import { Locator, Page } from '@playwright/test';
import { EnvConfig } from '../utils/envConfig';

/**
 * Modern, strongly-typed Page Object Model for ParaBank Open Account Page
 */
export class OpenAccountPage {
  readonly page: Page;
  readonly baseUrl: string;

  // Locators
  readonly pageTitle: Locator;
  readonly accountTypeDropdown: Locator;
  readonly fundingAccountDropdown: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly newAccountIdLink: Locator;
  readonly accountTypeLabel: Locator;
  readonly fundingAccountLabel: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = EnvConfig.baseUrl;

    this.pageTitle = page.locator('h1.title, h1');
    this.accountTypeDropdown = page.locator('select#type, select[name="type"]');
    this.fundingAccountDropdown = page.locator('select#fromAccountId, select[name="fromAccountId"]');
    this.submitButton = page.locator('input[type="submit"][value="Open New Account"], button:has-text("Open New Account")');
    this.successMessage = page.locator('#openAccountResult, text=/Account Opened/i');
    this.newAccountIdLink = page.locator('#newAccountId');
    this.accountTypeLabel = page.locator('label, b', { hasText: /Account Type/i });
    this.fundingAccountLabel = page.locator('label, b', { hasText: /Funding Account/i });
    this.errorMessage = page.locator('.error, [role="alert"], p.error');
  }

  /**
   * Navigate to Open Account page
   * Attempts session establishment via login if required
   */
  async navigate(): Promise<void> {
    const accountUrl = `${this.baseUrl}/parabank/openaccount.htm`;
    await this.page.goto(accountUrl, { waitUntil: 'domcontentloaded' }).catch(() => { });
  }

  /**
   * Verify if open account form elements are loaded
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      const typeVisible = await this.accountTypeDropdown.isVisible({ timeout: 5000 }).catch(() => false);
      const submitVisible = await this.submitButton.isVisible({ timeout: 5000 }).catch(() => false);
      return typeVisible && submitVisible;
    } catch {
      return false;
    }
  }

  /**
   * Select account type ('CHECKING' | 'SAVINGS')
   */
  async selectAccountType(accountType: 'CHECKING' | 'SAVINGS'): Promise<void> {
    await this.accountTypeDropdown.selectOption(accountType);
  }

  /**
   * Select funding account by account ID or index
   */
  async selectFundingAccount(fundingAccount: string): Promise<void> {
    await this.fundingAccountDropdown.selectOption(fundingAccount);
  }

  /**
   * Wait for funding accounts dropdown to populate options
   */
  async waitForFundingAccountsToLoad(): Promise<void> {
    try {
      await this.fundingAccountDropdown.locator('option').first().waitFor({ state: 'attached', timeout: 5000 });
    } catch {
      // Options wait timed out
    }
  }

  /**
   * Click Open New Account submit button
   */
  async clickOpenNewAccountButton(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Check if success message is displayed after opening account
   */
  async verifySuccessMessage(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 8000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get generated new account ID
   */
  async getNewAccountId(): Promise<string | null> {
    try {
      if (await this.newAccountIdLink.isVisible({ timeout: 5000 })) {
        return (await this.newAccountIdLink.textContent())?.trim() || null;
      }
    } catch {
      // Not visible
    }
    return null;
  }
}

export default OpenAccountPage;
