import { Locator, Page } from '@playwright/test';
import { EnvConfig } from '../utils/envConfig';

export interface RegistrationDetails {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
}

export class RegistrationPage {
  readonly page: Page;
  readonly baseUrl: string;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly ssnInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = EnvConfig.baseUrl;
    this.firstNameInput = page.locator('input[name="customer.firstName"]');
    this.lastNameInput = page.locator('input[name="customer.lastName"]');
    this.addressInput = page.locator('input[name="customer.address.street"]');
    this.cityInput = page.locator('input[name="customer.address.city"]');
    this.stateInput = page.locator('input[name="customer.address.state"]');
    this.zipCodeInput = page.locator('input[name="customer.address.zipCode"]');
    this.phoneInput = page.locator('input[name="customer.phoneNumber"]');
    this.ssnInput = page.locator('input[name="customer.ssn"]');
    this.usernameInput = page.locator('input[name="customer.username"]');
    this.passwordInput = page.locator('input[name="customer.password"]');
    this.confirmPasswordInput = page.locator('input[name="repeatedPassword"]');
    this.registerButton = page.locator('input[type="submit"][value="Register"]');
    this.successHeading = page.locator('#rightPanel h1, h1').filter({ hasText: /welcome/i });
  }

  async navigate(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/parabank/register.htm`, { waitUntil: 'domcontentloaded' });
  }

  async register(details: RegistrationDetails): Promise<void> {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.addressInput.fill(details.address);
    await this.cityInput.fill(details.city);
    await this.stateInput.fill(details.state);
    await this.zipCodeInput.fill(details.zipCode);
    await this.phoneInput.fill(details.phoneNumber);
    await this.ssnInput.fill(details.ssn);
    await this.usernameInput.fill(details.username);
    await this.passwordInput.fill(details.password);
    await this.confirmPasswordInput.fill(details.password);
    await this.registerButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isRegistrationSuccessful(): Promise<boolean> {
    return this.successHeading.isVisible({ timeout: 10000 }).catch(() => false);
  }
}

export default RegistrationPage;