# ParaBank Open Account - Playwright Test Framework

A professional end-to-end test framework for the ParaBank OpenAccount page using Playwright, following modern best practices.

## 📁 Project Structure

```
Pwtest/
├── tests/
│   ├── e2e/                    # End-to-end test files
│   │   └── openAccount.spec.js # Test suite for open account functionality
│   ├── pages/                  # Page Object Models
│   │   └── openAccountPage.js  # Open Account page object
│   ├── utils/                  # Utility functions
│   │   └── testHelpers.js      # Reusable helper functions
│   ├── data/                   # Test data
│   │   └── testData.js         # Test data constants
│   └── fixtures/               # Test fixtures
│       └── baseFixture.js      # Base fixture setup
├── playwright.config.js        # Playwright configuration
├── package.json                # Project dependencies
├── README.md                   # This file
└── .gitignore                  # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install Playwright browsers:**
```bash
npx playwright install
```

### Running Tests

**Run all tests:**
```bash
npx playwright test
```

**Run tests in specific browser:**
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**Run specific test file:**
```bash
npx playwright test tests/e2e/openAccount.spec.js
```

**Run tests in headed mode (see browser UI):**
```bash
npx playwright test --headed
```

**Run tests with debug mode:**
```bash
npx playwright test --debug
```

**Run tests in UI mode (interactive):**
```bash
npx playwright test --ui
```

**View test report after running:**
```bash
npx playwright show-report
```

## 📋 Test Coverage

### TC-001: Page Elements Validation
- Verifies all required elements are present on the Open Account page
- Checks that dropdowns and buttons are visible and enabled

### TC-002: Create Checking Account
- Selects CHECKING account type
- Selects a funding account
- Submits the form
- Validates success message and extracts new account ID

### TC-003: Create Savings Account with Validation
- Complete workflow for creating a SAVINGS account
- Validates all available funding account options populate correctly
- Verifies success message format and account ID generation

### TC-004: Validation Error - Missing Account Type
- Tests form validation when account type is not selected
- Verifies appropriate error message is displayed

### TC-005: Validation Error - Missing Funding Account
- Tests form validation when funding account is not selected
- Verifies validation prevents incomplete form submission

### TC-006: Account Type Options Verification
- Retrieves all available account types from dropdown
- Tests that each account type loads corresponding funding accounts
- Verifies dropdown functionality across all options

## 🏗️ Architecture & Best Practices

### Page Object Model (POM)
The framework uses the Page Object Model pattern for maintainability:
- **openAccountPage.js**: Encapsulates all locators and user interactions
- Locators are defined at the class level for easy updates
- Methods represent user actions (e.g., `selectAccountType()`, `clickOpenNewAccountButton()`)

### Utility Functions
Reusable helper functions in **testHelpers.js**:
- Element stability waits
- Retry logic with exponential backoff
- Screenshot management
- Assertion helpers
- Data extraction utilities

### Test Data Separation
**testData.js** contains:
- Base URLs and page paths
- Valid and invalid test scenarios
- Expected messages and patterns
- Timeout configurations
- Account type constants

### Logging & Reporting
- Descriptive test step logging using `logStep()`
- Automatic HTML report generation
- Screenshots on test failures
- Trace files for debugging

## 🔧 Configuration

### playwright.config.js
Configurable settings:
- **testDir**: Test files location
- **baseURL**: The base URL for all tests
- **fullyParallel**: Run tests in parallel
- **retries**: Automatic retry on failure
- **reporter**: HTML report generation
- **trace**: Trace collection for debugging
- **screenshot**: Capture screenshots on failure

### Supported Browsers
- Chromium
- Firefox
- WebKit (Safari)

### Device Emulation
Uncomment device settings in config to test on mobile viewports:
- Pixel 5 (Android)
- iPhone 12 (iOS)

## ✨ Key Features

✅ **Page Object Model** - Clean separation of locators and test logic
✅ **Reusable Utilities** - Common helper functions for all tests
✅ **Test Data Management** - Centralized constants and scenarios
✅ **Comprehensive Logging** - Every step is logged with timestamps
✅ **Screenshot on Failure** - Automatic visual debugging
✅ **Multi-Browser Support** - Run tests across Chromium, Firefox, WebKit
✅ **Failure Traces** - Detailed traces for debugging failed tests
✅ **Professional Code** - Clear comments and readable structure
✅ **Negative Scenarios** - Validation testing for error cases
✅ **HTML Reports** - Beautiful test result reports

## 📊 Understanding Test Results

After running tests, view the HTML report:
```bash
npx playwright show-report
```

Report includes:
- Test duration
- Pass/fail status
- Screenshots of failures
- Trace files for investigation
- Browser compatibility info

## 🐛 Debugging

### Using Playwright Inspector
```bash
npx playwright test --debug
```
Allows step-through debugging with browser inspection.

### UI Mode (Interactive Testing)
```bash
npx playwright test --ui
```
Watch mode with interactive browser to see tests run in real-time.

### Using Trace Viewer
Traces are automatically generated for failed tests:
```bash
npx playwright show-trace test-results/openAccount-tc-002/trace.zip
```

## 📝 Adding New Tests

1. Add test scenarios to `tests/data/testData.js`
2. Create test case in `tests/e2e/openAccount.spec.js` using the `test()` function
3. Use `openAccountPage` fixture to interact with the page
4. Follow existing test structure with `logStep()` calls

Example:
```javascript
test('TC-007: Your new test', async () => {
  logStep('Describe what you\'re testing');
  await openAccountPage.selectAccountType('CHECKING');
  expect(true).toBeTruthy();
});
```

## 🔗 Useful Resources

- **Playwright Docs**: https://playwright.dev/docs/intro
- **ParaBank Demo App**: https://parabank.parasoft.com
- **Assertions API**: https://playwright.dev/docs/test-assertions

## 📄 License

This test framework is provided as-is for testing the ParaBank application.

---

**Created**: March 2026
**Framework Version**: 1.0.0
**Playwright Version**: Latest (see package.json)
