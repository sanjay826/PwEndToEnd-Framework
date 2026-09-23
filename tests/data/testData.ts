import { EnvConfig } from '../utils/envConfig';

export interface LoginCredentials {
  username: string;
  password: string;
  invalidUsername: string;
  invalidPassword: string;
}

export interface AccountScenario {
  name: string;
  accountType: 'CHECKING' | 'SAVINGS';
  fundingAccount: string;
  expectedOutcome: 'success' | 'error';
}

export interface InvalidScenario {
  name: string;
  accountType: 'CHECKING' | 'SAVINGS' | null;
  fundingAccount: string | null;
  expectedOutcome: 'error';
  expectedError: string;
}

export const testData = {
  baseUrl: EnvConfig.baseUrl,
  openAccountPage: '/parabank/openaccount.htm',
  loginPage: '/parabank/index.htm',

  /**
   * Login credentials configured via environment variables or default fallbacks
   */
  loginCredentials: {
    username: process.env.TEST_USER || 'sky',
    password: process.env.TEST_PASSWORD || 'sky01',
    invalidUsername: 'invaliduser',
    invalidPassword: 'wrongpass',
  } as LoginCredentials,

  /**
   * Valid test scenarios for account opening
   */
  validScenarios: [
    {
      name: 'Create Checking Account',
      accountType: 'CHECKING',
      fundingAccount: '11111',
      expectedOutcome: 'success',
    },
    {
      name: 'Create Savings Account',
      accountType: 'SAVINGS',
      fundingAccount: '11111',
      expectedOutcome: 'success',
    },
  ] as AccountScenario[],

  /**
   * Invalid test scenarios for negative testing
   */
  invalidScenarios: [
    {
      name: 'No Account Type Selected',
      accountType: null,
      fundingAccount: '11111',
      expectedOutcome: 'error',
      expectedError: 'Please select an account type',
    },
    {
      name: 'No Funding Account Selected',
      accountType: 'CHECKING',
      fundingAccount: null,
      expectedOutcome: 'error',
      expectedError: 'Please select a funding account',
    },
  ] as InvalidScenario[],

  /**
   * Expected success message patterns
   */
  successMessages: {
    accountOpened: 'Account Opened Successfully',
    accountIdPattern: /account id \d+/i,
  },

  /**
   * Page element labels
   */
  labels: {
    accountType: 'Account Type',
    fundingAccount: 'Funding Account',
    openButton: 'Open New Account',
  },

  /**
   * Account types available in ParaBank
   */
  accountTypes: {
    CHECKING: 'CHECKING',
    SAVINGS: 'SAVINGS',
  },

  /**
   * Standard timeouts
   */
  timeouts: {
    short: 3000,
    medium: 5000,
    long: 10000,
  },
};

export default testData;
