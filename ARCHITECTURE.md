/**
 * ARCHITECTURE & DESIGN PATTERNS GUIDE
 * 
 * This document explains the design patterns and architecture used in this framework.
 */

# Framework Architecture & Design Patterns

## 1. Page Object Model (POM)

The framework uses the **Page Object Model** pattern, which is a best practice for test automation.

### What is POM?
POM is a design pattern that:
- Encapsulates all page interactions in a separate class
- Separates test logic from UI interactions
- Makes tests more maintainable and readable
- Reduces duplication across tests

### How It Works in This Framework

```
┌─────────────────────────────────────────────┐
│         Test Files (TC-001, TC-002, etc.)   │
│              (Test Logic Only)              │
└────────────────┬────────────────────────────┘
                 │
                 │ Uses
                 ↓
┌─────────────────────────────────────────────┐
│      OpenAccountPage (Page Object)          │
│   (All locators + user interactions)        │
└────────────────┬────────────────────────────┘
                 │
                 │ Interacts with
                 ↓
┌─────────────────────────────────────────────┐
│      Playwright Page API                    │
│   (Browser automation)                      │
└─────────────────────────────────────────────┘
```

### Example: Without POM vs With POM

**Without POM (Bad):**
```javascript
test('Create account', async ({ page }) => {
  await page.locator('select[name="type"]').selectOption('CHECKING');
  await page.locator('button:text("Submit")').click();
  // Hard to read, selectors scattered everywhere
});
```

**With POM (Good):**
```javascript
test('Create account', async () => {
  await openAccountPage.selectAccountType('CHECKING');
  await openAccountPage.clickOpenNewAccountButton();
  // Clear intent, reusable across tests
});
```

## 2. Separation of Concerns

The framework separates different concerns into different files:

```
tests/
├── e2e/                      # Test Logic
│   ├── openAccount.spec.js   # What to test
│   └── openAccount.advanced.spec.js
│
├── pages/                    # Page Interactions
│   └── openAccountPage.js    # How to interact with UI
│
├── utils/                    # Reusable Functions
│   ├── testHelpers.js        # Common helper functions
│   └── envConfig.js          # Configuration
│
├── data/                     # Test Data
│   └── testData.js           # Test scenarios & constants
│
└── fixtures/                 # Test Setup
    └── baseFixture.js        # Common test initialization
```

### Benefits:
- **Single Responsibility**: Each file has one purpose
- **Maintainability**: Changes in one area don't affect others
- **Reusability**: Code is used across multiple tests
- **Scalability**: Easy to add new tests and pages

## 3. Test Data Management

All test data is centralized in `testData.js`:

```javascript
// ❌ Bad: Data scattered in tests
test('Create account', async () => {
  await page.selectOption('CHECKING');  // Magic string
  expect(message).toContain('Account Opened Successfully');  // Magic string
});

// ✅ Good: Data centralized
test('Create account', async () => {
  await openAccountPage.selectAccountType(testData.accountTypes.CHECKING);
  const msg = testData.successMessages.accountOpened;
  const text = await openAccountPage.getSuccessMessageText();
  expect(text).toContain(msg);
});
```

### Advantages:
- **Consistency**: Same data used across all tests
- **Easy Updates**: Change data in one place
- **Clear Intent**: Test data names explain what they represent
- **Maintainability**: No need to search tests for selectors

## 4. Utility Functions

Common functionality is extracted into reusable utilities:

```javascript
// testHelpers.js provides:
- logStep()              // Structured logging
- retryWithBackoff()     // Automatic retry logic
- takeScreenshot()       // Screenshot management
- assertEqual()          // Custom assertions
- extractNumber()        // Data extraction
- waitForElementStability() // Element state management
```

### Example Usage:
```javascript
test('Create account with retry', async () => {
  const createAccount = async () => {
    await openAccountPage.fillAndSubmitForm('CHECKING', '11111');
    expect(await openAccountPage.verifySuccessMessage()).toBeTruthy();
  };
  
  // Automatically retry up to 3 times with exponential backoff
  await retryWithBackoff(createAccount, 3, 1000);
});
```

## 5. Composition Pattern

Methods in the page object compose smaller actions into larger workflows:

```javascript
// Small atomic actions
async selectAccountType(accountType) { ... }
async selectFundingAccount(account) { ... }
async clickOpenNewAccountButton() { ... }

// Composed higher-level action
async fillAndSubmitForm(accountType, fundingAccount) {
  await this.selectAccountType(accountType);
  await this.selectFundingAccount(fundingAccount);
  await this.clickOpenNewAccountButton();
}
```

Benefits:
- **Readability**: Tests read like specifications
- **Reusability**: Composed methods used across multiple tests
- **Flexibility**: Can use atomic actions or composed actions

## 6. Assertion Strategy

The framework uses different assertion approaches:

### Direct Playwright Assertions (Recommended)
```javascript
// Built-in, with auto-waiting and retries
expect(await openAccountPage.verifySuccessMessage()).toBeTruthy();
```

### Custom Assertions
```javascript
// From testHelpers.js
assertEqual(actual, expected, 'Account ID mismatch');
assertIncludes(text, substring, 'Message not found');
```

### Page Object Assertions
```javascript
// Methods that return verification results
const isLoaded = await openAccountPage.isPageLoaded();
const messageVisible = await openAccountPage.verifySuccessMessage();
```

## 7. Error Handling Strategy

### 1. **Implicit Waits** (Built-in)
```javascript
await openAccountPage.submitButton.click(); // Auto-waits for element
```

### 2. **Explicit Waits** (In Page Object)
```javascript
async waitForFundingAccountsToLoad() {
  await this.fundingAccountDropdown.locator('option').nth(1).waitFor({ 
    state: 'visible', 
    timeout: 5000 
  });
}
```

### 3. **Retry Logic** (For Flaky Tests)
```javascript
await retryWithBackoff(async () => {
  // Code that might fail occasionally
}, 3, 1000);
```

## 8. Logging & Debugging

### Multi-Level Logging
```javascript
logStep('Starting account creation'); // What is happening
console.log(`Account ID: ${id}`);     // Debug information
```

### Automatic Diagnostics
```javascript
// On test failure, automatically:
- Capture screenshot
- Record trace file
- Log browser console messages
- Save network logs (in config)
```

## 9. Configuration Management

### Environment-Based Configuration
```javascript
// .env file for local overrides
BASE_URL=http://localhost:8080
ENVIRONMENT=staging
HEADLESS=false
TIMEOUT=45000
```

### Centralized in envConfig.js
```javascript
const config = envConfig.getEnv();
// Returns appropriate config based on ENVIRONMENT
```

## 10. Test Lifecycle

Each test follows a consistent lifecycle:

```
┌─────────────────────────────────────────┐
│  Setup (test.beforeEach)                │
│  - Navigate to page                     │
│  - Verify page is loaded                │
│  - Initialize page objects              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────↓───────────────────────┐
│  Test Execution                         │
│  1. logStep('What we\'re testing')      │
│  2. await page.action()                 │
│  3. expect(...).assertion()             │
│  4. console.log('✅ Step passed')       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────↓───────────────────────┐
│  Teardown (implicit)                    │
│  - Browser closed automatically         │
│  - Screenshots saved if failed          │
│  - Trace recorded                       │
│  - Report updated                       │
└─────────────────────────────────────────┘
```

## 11. Code Organization Best Practices

### ✅ DO:
```javascript
// 1. Use page objects for all interactions
await openAccountPage.selectAccountType('CHECKING');

// 2. Extract repeated code into utilities
await logStep('Creating account');
await retryWithBackoff(createFn, 3, 1000);

// 3. Centralize test data
accountType: testData.accountTypes.CHECKING

// 4. Make tests independent
// Don't rely on test execution order

// 5. Use meaningful assertions
expect(accountId).toBeTruthy();
expect(accountId).toMatch(/^\d+$/);
```

### ❌ DON'T:
```javascript
// 1. Use page.locator() directly in tests
await page.locator('button').click(); // BAD

// 2. Scatter test data in tests
await selectOption('CHECKING'); // Magic string

// 3. Create test dependencies
test1 creates account, test2 uses account ID from test1

// 4. Use non-descriptive names
test('test1', async () => {});

// 5. Comment obvious code
const id = 123; // Set id to 123
```

## 12. Scalability Pattern

Add new tests without modifying existing code:

```
New Test
  ↓
Uses existing Page Object (OpenAccountPage)
  ↓
Uses existing Test Data
  ↓
Uses existing Utilities
  ↓
Follows same structure as existing tests
  ↓
Zero impact on existing tests
```

## 13. Maintenance Strategy

### When ParaBank UI Changes:
1. **Locator Change**: Update `openAccountPage.js` only
2. **Flow Change**: Update page object methods
3. **Data Change**: Update `testData.js`
4. **Tests**: Usually require **zero** changes

### When Adding New Feature Tests:
1. Add page object methods to `OpenAccountPage`
2. Add test data to `testData.js`
3. Create new test in `openAccount.spec.js`
4. Reuse existing utilities and helpers

---

## Summary

This framework demonstrates professional testing practices:
- ✅ **Page Object Model**: Maintainable, scalable test code
- ✅ **Separation of Concerns**: Each file has one responsibility
- ✅ **Reusable Components**: Utilities, page objects, test data
- ✅ **Best Practices**: Proper assertions, error handling, logging
- ✅ **Professional Code**: Well-structured, documented, readable

By following these patterns, the test framework remains maintainable as it grows and scales to hundreds or thousands of tests.
