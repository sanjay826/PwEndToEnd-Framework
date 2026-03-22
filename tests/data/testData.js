/**
 * Test Data Constants
 * Centralized test data for all test cases
 */

const testData = {
  baseUrl: 'https://parabank.parasoft.com',
  openAccountPage: '/parabank/openaccount.htm',

  /**
   * Valid test scenarios for account opening
   */
  validScenarios: [
    {
      name: 'Create Checking Account',
      accountType: 'CHECKING',
      fundingAccount: '11111', // Typical ParaBank demo account ID
      expectedOutcome: 'success',
    },
    {
      name: 'Create Savings Account',
      accountType: 'SAVINGS',
      fundingAccount: '11111',
      expectedOutcome: 'success',
    },
    {
      name: 'Create Money Market Account',
      accountType: 'MONEY_MARKET',
      fundingAccount: '11111',
      expectedOutcome: 'success',
    },
  ],

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
  ],

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
   * Common account types
   */
  accountTypes: {
    CHECKING: 'CHECKING',
    SAVINGS: 'SAVINGS',
    MONEY_MARKET: 'MONEY_MARKET',
  },

  /**
   * Timeout values (in ms)
   */
  timeouts: {
    short: 3000,
    medium: 5000,
    long: 10000,
    pageLoadWait: 5000,
  },
};

module.exports = testData;
