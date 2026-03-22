/**
 * GETTING STARTED GUIDE
 * 
 * This document provides a quick start guide for using the Playwright test framework
 */

## Quick Start

### 1. Prerequisites
Make sure you have:
- Node.js v14+ installed
- npm or yarn

### 2. Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### 3. Run Your First Test
```bash
# Run all tests
npm test

# Or run with browser visible
npm run test:headed
```

## 📁 Project Structure Explained

### Pages (`tests/pages/`)
- **openAccountPage.js** - Contains all interactions with the Open Account page
  - Locators (CSS selectors) for all elements
  - Methods for user interactions (click, select, type)
  - Helper methods for assertions

### Tests (`tests/e2e/`)
- **openAccount.spec.js** - Main test suite (6 basic tests)
- **openAccount.advanced.spec.js** - Advanced tests (retry logic, performance, etc.)
  
Each test follows this pattern:
1. Setup (beforeEach) - Navigate to page, verify it's loaded
2. Test steps - Interact with the page using page object methods
3. Assertions - Validate expected outcomes

### Utils (`tests/utils/`)
- **testHelpers.js** - Reusable utility functions
  - logStep() - Log test steps with timestamps
  - retryWithBackoff() - Retry with exponential backoff
  - takeScreenshot() - Capture screenshots for debugging
  - assertEqual(), assertIncludes() - Custom assertions
  - extractNumber() - Extract numbers from text

### Data (`tests/data/`)
- **testData.js** - Centralized test data
  - URLs and page paths
  - Valid and invalid test scenarios
  - Expected messages and timeouts
  - Account types and constants

## 🧪 Running Tests

### Basic Commands
```bash
npm test                          # Run all tests
npm run test:headed              # Run with browser visible
npm run test:debug               # Debug tests step-by-step
npm run test:ui                  # Interactive test runner
npm run test:chromium            # Run only in Chrome
npm run test:firefox             # Run only in Firefox
npm run test:webkit              # Run only in Safari
npm run test:specific            # Run specific test file
npm run report                   # View HTML report
```

### View Results
After running tests, an HTML report is generated:
```bash
npm run report
```

This opens a detailed report showing:
- Pass/fail status for each test
- Test duration
- Screenshots on failure
- Trace files for debugging

## 🔍 Understanding the Tests

### Basic Tests (openAccount.spec.js)
- **TC-001** - Page loads with all elements visible
- **TC-002** - Create checking account successfully
- **TC-003** - Create savings account with full workflow
- **TC-004** - Validation error when account type missing
- **TC-005** - Validation error when funding account missing
- **TC-006** - All account types can be selected

### Advanced Tests (openAccount.advanced.spec.js)
- **TC-007** - Create account with automatic retry on failure
- **TC-008** - Test cascading dropdown behavior for all account types
- **TC-009** - Rapid successive account creations
- **TC-010** - Form state preserved after failed submission
- **TC-011** - Different account types create unique accounts
- **TC-012** - Measure page load performance

## ✏️ Modifying Tests

### Adding a New Test
1. Open `tests/e2e/openAccount.spec.js`
2. Add a new test case in the existing `test.describe()` block:
```javascript
test('TC-013: Your test description', async () => {
  logStep('Describe what you\'re testing');
  
  // Use the openAccountPage object to interact with the page
  await openAccountPage.selectAccountType('CHECKING');
  
  // Use expect() for assertions
  expect(true).toBeTruthy();
  
  console.log('✅ Test passed!');
});
```

### Updating Locators
If the ParaBank website changes:
1. Open `tests/pages/openAccountPage.js`
2. Update the CSS selector in the relevant locator
3. Example:
```javascript
// Old
this.submitButton = page.locator('button:has-text("Open New Account")');

// New (if button text changes)
this.submitButton = page.locator('button:has-text("Create Account")');
```

### Adding Test Data
1. Open `tests/data/testData.js`
2. Add scenario to `validScenarios` or `invalidScenarios`
3. Use in tests: `testData.validScenarios[0].accountType`

## 🐛 Debugging

### Debug a Specific Test
```bash
npx playwright test tests/e2e/openAccount.spec.js:13 --debug
```
This opens the Playwright Inspector where you can:
- Step through code
- Pause execution
- Inspect elements in the browser
- Evaluate expressions in the console

### View Execution Trace
Traces are automatically saved on test failure:
```bash
npx playwright show-trace test-results/openAccount-tc-002/trace.zip
```
Shows:
- Network requests
- Console messages
- Screenshots at each step
- DOM snapshots

### Enable Verbose Logging
```bash
DEBUG=pw:api npx playwright test
```

## 📊 Test Structure Example

```javascript
// Every test follows this structure:

test('TC-001: Description', async () => {
  // 1. Log what you're doing
  logStep('Doing something');
  
  // 2. Interact with the page using page object
  await openAccountPage.selectAccountType('CHECKING');
  
  // 3. Use expect() to assert outcomes
  expect(result).toBeTruthy();
  
  // 4. Log success
  console.log('✅ Test passed');
});
```

## 🔗 Important Resources

- **Playwright Docs**: https://playwright.dev
- **Test Assertion API**: https://playwright.dev/docs/test-assertions
- **Locators Guide**: https://playwright.dev/docs/locators
- **ParaBank App**: https://parabank.parasoft.com

## ⚠️ Common Issues

### Tests fail with "Element not found"
- The ParaBank website structure may have changed
- Update locators in `openAccountPage.js`
- Use `npm run codegen` to generate new selectors

### Tests timeout
- Check your internet connection
- ParaBank server may be slow
- Increase timeout in `testData.js`

### Browser not installed
```bash
npx playwright install
```

## 📝 Best Practices

1. **Use page objects** - Always use openAccountPage methods, not direct page.locator()
2. **Log steps** - Use logStep() to make test execution clear
3. **Separate data** - Keep test data in testData.js, not in test files
4. **Reuse utils** - Use helper functions from testHelpers.js
5. **One assertion** - Each test should focus on one behavior
6. **Descriptive names** - Test names should describe what they test
7. **Clean up** - Tests should be independent and run in any order

## 🚀 Next Steps

1. Run the tests: `npm test`
2. View the report: `npm run report`
3. Modify a test to get familiar with the framework
4. Add a new test case for additional functionality
5. Share the test framework with your team!

---

For more help, check the README.md file.
