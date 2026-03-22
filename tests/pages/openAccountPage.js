/**
 * Open Account Page Object Model
 * Encapsulates all locators and actions for the Open Account page
 */

class OpenAccountPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Page locators - CSS selectors for all interactive elements
    this.pageTitle = page.locator('h1, h2, .title'); // Page heading
    this.accountTypeDropdown = page.locator('select[name="type"], #accountType, select:has-text("Account Type")');
    this.fundingAccountDropdown = page.locator('select[name="fromAccountId"], #fromAccountId, select:has-text("Funding Account")');
    this.submitButton = page.locator('button:has-text("Open New Account"), input[type="submit"][value*="Open"]');
    this.successMessage = page.locator('text=Account Opened Successfully, account id, text=new account');
    this.errorMessage = page.locator('.error, .alert-danger, .alert-error');

    // Form labels
    this.accountTypeLabel = page.locator('label:has-text("Account Type")');
    this.fundingAccountLabel = page.locator('label:has-text("Funding Account")');
  }

  /**
   * Navigate to the Open Account page
   */
  async navigate() {
    await this.page.goto('https://parabank.parasoft.com/parabank/openaccount.htm');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify page is loaded by checking for key elements
   */
  async isPageLoaded() {
    return (
      await this.accountTypeDropdown.isVisible() &&
      await this.fundingAccountDropdown.isVisible() &&
      await this.submitButton.isVisible()
    );
  }

  /**
   * Get the current account type dropdown options
   
   */
  async getAccountTypeOptions() {
    const options = await this.accountTypeDropdown.locator('option').allTextContents();
    return options.filter(opt => opt.trim() !== ''); // Remove empty options
  }

  /**
   * Get the current funding account dropdown options
   */
  async getFundingAccountOptions() {
    const options = await this.fundingAccountDropdown.locator('option').allTextContents();
    return options.filter(opt => opt.trim() !== '');
  }

  /**
   * Select account type from dropdown
   * @param {string} accountType - The account type to select (e.g., "CHECKING", "SAVINGS")
   */
  async selectAccountType(accountType) {
    await this.accountTypeDropdown.selectOption(accountType);
    await this.page.waitForTimeout(300); // Wait for any cascading changes
  }

  /**
   * Select funding account from dropdown
   * @param {string} fundingAccount - The funding account to select
   */
  async selectFundingAccount(fundingAccount) {
    await this.fundingAccountDropdown.selectOption(fundingAccount);
    await this.page.waitForTimeout(300);
  }

  /**
   * Click the Open New Account submit button
   */
  async clickOpenNewAccountButton() {
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Complete the open account form with provided selections
   * @param {string} accountType - Account type to select
   * @param {string} fundingAccount - Funding account to select
   */
  async fillAndSubmitForm(accountType, fundingAccount) {
    await this.selectAccountType(accountType);
    await this.selectFundingAccount(fundingAccount);
    await this.clickOpenNewAccountButton();
  }

  /**
   * Verify success message is displayed
   */
  async verifySuccessMessage() {
    return await this.successMessage.isVisible({ timeout: 5000 });
  }

  /**
   * Get the success message text
   */
  async getSuccessMessageText() {
    await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.successMessage.textContent();
  }

  /**
   * Extract account ID from success message
   */
  async getNewAccountId() {
    const messageText = await this.getSuccessMessageText();
    const match = messageText.match(/\d+/);
    return match ? match[0] : null;
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage() {
    return await this.errorMessage.isVisible({ timeout: 3000 });
  }

  /**
   * Get error message text
   */
  async getErrorMessageText() {
    return await this.errorMessage.textContent();
  }

  /**
   * Verify page title matches expected text
   * @param {string} expectedTitle - Expected page title text
   */
  async verifyPageTitle(expectedTitle) {
    await this.pageTitle.waitFor({ state: 'visible' });
    const title = await this.pageTitle.textContent();
    return title.includes(expectedTitle);
  }

  /**
   * Check if submit button is enabled
   */
  async isSubmitButtonEnabled() {
    return !(await this.submitButton.isDisabled());
  }

  /**
   * Wait for funding account dropdown to be populated
   */
  async waitForFundingAccountsToLoad() {
    await this.fundingAccountDropdown.locator('option').nth(1).waitFor({ state: 'visible', timeout: 5000 });
  }
}

module.exports = { OpenAccountPage };
