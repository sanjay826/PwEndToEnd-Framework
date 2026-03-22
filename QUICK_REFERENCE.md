# Playwright Framework - Quick Reference Card

## 📋 Test Execution Commands

```bash
# Install everything
npm install && npx playwright install

# Run tests
npm test                  # All tests, all browsers
npm run test:headed      # See browser while running
npm run test:debug       # Debug mode (step through)
npm run test:ui          # Interactive UI mode
npm run test:chromium    # Chrome only
npm run test:firefox     # Firefox only
npm run test:webkit      # Safari only

# View results
npm run report           # Open HTML report
npx playwright show-trace test-results/.../trace.zip
```

## 📁 File Quick Reference

| Path | Type | Purpose |
|------|------|---------|
| `tests/e2e/openAccount.spec.js` | Tests | 6 core test cases |
| `tests/e2e/openAccount.advanced.spec.js` | Tests | 6 advanced test cases |
| `tests/pages/openAccountPage.js` | Page Object | UI interactions |
| `tests/utils/testHelpers.js` | Utilities | Helper functions |
| `tests/data/testData.js` | Data | Test constants |
| `tests/utils/envConfig.js` | Config | Environment settings |
| `playwright.config.js` | Config | Browser/reporter config |

## 🧪 Test Cases at a Glance

### openAccount.spec.js (Basic Tests)
- **TC-001**: Page loads with all elements visible
- **TC-002**: Create checking account
- **TC-003**: Create savings account with validation
- **TC-004**: Validation error - missing account type
- **TC-005**: Validation error - missing funding account
- **TC-006**: Test all account type options

### openAccount.advanced.spec.js (Advanced Tests)
- **TC-007**: Account creation with retry logic
- **TC-008**: Cascading dropdown behavior
- **TC-009**: Rapid successive account creations
- **TC-010**: Form state after failed submission
- **TC-011**: Different account types = unique accounts
- **TC-012**: Page load performance metrics

## 🎯 Common Tasks

### Run Specific Test
```bash
npx playwright test openAccount.spec.js:13
npx playwright test -g "TC-001"
```

### Add New Test
1. Update `tests/pages/openAccountPage.js` if needed
2. Add data to `tests/data/testData.js` if needed
3. Add test to `tests/e2e/openAccount.spec.js`
```javascript
test('TC-NNN: Description', async () => {
  logStep('What we\'re testing');
  await openAccountPage.selectAccountType('CHECKING');
  expect(true).toBeTruthy();
});
```

### Update Page Selectors
Edit `tests/pages/openAccountPage.js` constructor:
```javascript
// Find element first
await page.goto('...');
await page.pause(); // Inspect element, get selector
// Update in constructor
this.myElement = page.locator('new-selector');
```

### Generate New Selectors
```bash
npm run codegen
# Use browser to find and generate selectors
```

## 🔍 Debugging

### Debug Mode
```bash
npx playwright test --debug
```
Shows Playwright Inspector where you can:
- Step through code line by line
- Evaluate expressions
- Inspect elements with browser DevTools

### Verbose Output
```bash
DEBUG=pw:api npx playwright test
```

### Screenshots & Traces
Automatically saved in `test-results/` on failure

## 💻 Page Object Methods

```javascript
// Navigation
await openAccountPage.navigate()

// Interactions
await openAccountPage.selectAccountType('CHECKING')
await openAccountPage.selectFundingAccount('11111')
await openAccountPage.clickOpenNewAccountButton()
await openAccountPage.fillAndSubmitForm('CHECKING', '11111')

// Verifications
await openAccountPage.verifySuccessMessage()
await openAccountPage.getNewAccountId()
await openAccountPage.verifyErrorMessage()
await openAccountPage.getAccountTypeOptions()

// Waiting
await openAccountPage.waitForFundingAccountsToLoad()
```

## 🛠️ Helper Functions

```javascript
// From testHelpers.js
logStep('What we\'re doing')                    // Log with timestamp
await retryWithBackoff(fn, 3, 1000)            // Retry with backoff
await takeScreenshot(page, 'test', 'step')     // Save screenshot
assertEqual(actual, expected, 'msg')           // Assert equality
assertIncludes(text, substring, 'msg')         // Assert inclusion
extractNumber('account 12345')                 // Returns 12345
```

## ⚙️ Configuration

### Via .env file
```
BASE_URL=https://parabank.parasoft.com
ENVIRONMENT=production
HEADLESS=true
TIMEOUT=30000
RETRIES=0
WORKERS=1
```

### Via playwright.config.js
- Browser types and devices
- Base URL and timeouts
- Reporter settings
- Screenshot/trace options
- Retry and parallel settings

## 📊 Test Report Structure

After running `npm run report`:
1. Test overview (pass/fail counts)
2. Each test with:
   - Duration
   - Status (passed/failed)
   - Screenshots (if failed)
   - Traces (if failed)
3. Browser compatibility info

## ✅ Quality Checklist

Before committing tests:
- [ ] Tests run successfully: `npm test`
- [ ] No hardcoded selectors in test files (use page object)
- [ ] All tests use `logStep()` for clarity
- [ ] Test names describe what they test
- [ ] Test data is in `testData.js`
- [ ] No test depends on another test
- [ ] Tests pass in all 3 browsers

## 🚀 Performance Tips

```bash
# Run tests in parallel (faster)
npx playwright test --workers=4

# Run specific browser (faster)
npm run test:chromium

# Run headed mode (slower, debugging)
npm run test:headed
```

## 📚 Documentation Map

1. **Start Here**: README.md - Overview and quick start
2. **Setup**: GETTING_STARTED.md - Step-by-step guide
3. **Design**: ARCHITECTURE.md - Design patterns explained
4. **Summary**: FRAMEWORK_SUMMARY.md - This framework overview
5. **Reference**: This file - Quick reference

## 🎓 Learning Path

1. Read README.md (5 min)
2. Run `npm install && npm test` (10 min)
3. View report with `npm run report` (5 min)
4. Read GETTING_STARTED.md (10 min)
5. Explore test files (10 min)
6. Read ARCHITECTURE.md for deep dive (20 min)
7. Modify a test to practice (10 min)
8. Add a new test case (15 min)

**Total Time**: ~1.5 hours to become productive

---

## Quick Copy-Paste Commands

```bash
# Full setup from scratch
npm install
npx playwright install

# Run all tests and see report
npm test && npm run report

# Run tests visible
npm run test:headed

# Debug specific test
npx playwright test --debug openAccount.spec.js

# Run tests in different browser
npm run test:firefox
npm run test:webkit

# Interactive testing
npm run test:ui
```

---

**Happy Testing! 🚀**
