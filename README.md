# ParaBank Playwright End-to-End Test Framework

A production-grade, TypeScript-based End-to-End Test Automation Framework for [ParaBank](https://parabank.parasoft.com) using [Playwright](https://playwright.dev), built in alignment with current industry best practices and market standards.

---

## 🏗️ Framework Architecture

```
Pwtest/
├── tests/
│   ├── e2e/                      # End-to-End test specifications
│   │   ├── login.spec.ts         # Login UI, validation & credential flow tests
│   │   └── openAccount.spec.ts   # Open Account workflows & negative tests
│   ├── pages/                    # Page Object Model (POM) layer
│   │   ├── loginPage.ts          # Strongly-typed Login POM
│   │   └── openAccountPage.ts    # Strongly-typed Open Account POM
│   ├── fixtures/                 # Custom Playwright fixtures
│   │   └── baseFixture.ts        # Extended test fixtures injecting POM & data
│   ├── data/                     # Test data management
│   │   └── testData.ts           # Centralized test data, types & credentials
│   └── utils/                    # Shared utilities
│       ├── envConfig.ts          # Type-safe environment loader via dotenv
│       └── testHelpers.ts        # Step loggers, retry mechanisms & helpers
├── .env.example                  # Environment configuration template
├── playwright.config.ts          # Central Playwright configuration
├── tsconfig.json                 # Modern TypeScript 6.0+ configuration
├── package.json                  # Scripts & dependencies
└── README.md                     # Documentation
```

---

## ✨ Key Features & Best Practices

- **Strict TypeScript**: Fully typed with strict checks, interfaces, and zero compilation errors.
- **Path Aliasing**: Clean module resolution using `@pages/*`, `@fixtures/*`, `@utils/*`, and `@data/*`.
- **Page Object Model (POM)**: Complete separation of concerns between test logic and element locators.
- **Custom Test Fixtures**: Dependency injection of page objects directly into test arguments (`{ loginPage, openAccountPage }`), eliminating manual page instantiation boilerplate.
- **Web-First Assertions & Auto-Waiting**: Eliminates brittle arbitrary `waitForTimeout` calls by relying on Playwright's automatic actionability and polling assertions (`expect(locator).toBeVisible()`).
- **Resilient Configuration**: Configured in `playwright.config.ts` with parallel execution, automatic retries on CI, HTML and list reporters, and trace/screenshot/video capture on failure.
- **Environment Driven**: Seamless multi-environment switching (`production`, `staging`, `local`) via `.env` and `dotenv`.
- **Automatic Authentication**: Global setup registers a randomized ParaBank user, logs in, and caches Playwright `storageState` in `playwright/.auth/user.json`. Later runs reuse the state; if it expires, the saved credentials are tried once before a fresh user is registered.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

Install the Playwright browser binaries:
```bash
npx playwright install --with-deps
```

### 2. Environment Configuration
Copy the `.env.example` file to `.env` to customize settings:
```bash
cp .env.example .env
```
Default configurations:
- `BASE_URL=https://parabank.parasoft.com`
- `HEADLESS=true`
- `TIMEOUT=30000`

Authentication credentials are generated automatically during global setup. The generated username and password are stored in the ignored `playwright/.auth/user-credentials.json` file for cache recovery.

---

## 🧪 Test Execution

The framework provides convenient npm scripts defined in `package.json`:

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode
```bash
npm run test:headed
```

### Run Tests with Interactive UI Mode
```bash
npm run test:ui
```

### Run Specific Test Suites
```bash
# Run Login Suite
npm run test:login

# Run Open Account Suite
npm run test:account
```

### Run on Specific Browsers
```bash
# Chromium (Google Chrome)
npm run test:chromium

# Firefox (Mozilla Firefox)
npm run test:firefox

# WebKit (Apple Safari)
npm run test:webkit
```

### Type Checking
Validate TypeScript types across the entire project:
```bash
npm run typecheck
```

---

## 📊 Test Reporting & Artifacts

After test execution, launch the interactive HTML report to view detailed step traces, screenshots, and videos:
```bash
npm run report
```

Execution artifacts are stored in:
- `playwright-report/`: Interactive HTML report with step-by-step breakdown.
- `test-results/`: Traces, failure screenshots, and recorded videos.

---

## 📝 Writing New Tests

Create new `.spec.ts` files inside `tests/e2e/` utilizing the `baseFixture`:

```typescript
import { test, expect } from '../fixtures/baseFixture';
import { logStep } from '../utils/testHelpers';

test.describe('Feature Suite', () => {
  test('Sample Test', async ({ loginPage, testData }) => {
    logStep('Navigate to login');
    await loginPage.navigate();
    await expect(loginPage.loginHeading).toBeVisible();
  });
});
```

---

## 🛡️ License
ISC
