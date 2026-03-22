/**
 * Test Helper Utilities
 * Reusable functions for common test operations
 */

const fs = require('fs');
const path = require('path');

/**
 * Wait for an element to be stable (no layout shifts)
 * @param {import('@playwright/test').Locator} locator
 * @param {number} stabilityTimeout - Time in ms to wait without changes
 */
async function waitForElementStability(locator, stabilityTimeout = 500) {
  await locator.waitFor({ state: 'visible' });
  await locator.page().waitForTimeout(stabilityTimeout);
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in ms
 */
async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const waitTime = delay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

/**
 * Take a screenshot with a descriptive name
 * @param {import('@playwright/test').Page} page
 * @param {string} testName - Name of the test
 * @param {string} step - Description of the current step
 */
async function takeScreenshot(page, testName, step) {
  const screenshotDir = path.join(__dirname, '../screenshots');
  
  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${testName}-${step}-${timestamp}.png`;
  const filepath = path.join(screenshotDir, filename);

  await page.screenshot({ path: filepath });
  console.log(`Screenshot saved: ${filepath}`);
}

/**
 * Assert that actual value matches expected value
 * @param {*} actual - Actual value
 * @param {*} expected - Expected value
 * @param {string} message - Error message
 */
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

/**
 * Assert that string contains substring
 * @param {string} text - Text to search in
 * @param {string} substring - Substring to find
 * @param {string} message - Error message
 */
function assertIncludes(text, substring, message) {
  if (!text.includes(substring)) {
    throw new Error(`${message}\nExpected "${text}" to include "${substring}"`);
  }
}

/**
 * Get current timestamp in readable format
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Pause execution for debugging
 * @param {number} ms - Milliseconds to pause
 */
async function pause(ms = 5000) {
  console.log(`⏸️  Paused for ${ms}ms - inspect browser to debug`);
  await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract numeric value from text
 * @param {string} text - Text containing a number
 * @returns {number|null}
 */
function extractNumber(text) {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate random account number for testing
 * @returns {string}
 */
function generateRandomAccountNumber() {
  return Math.random().toString().substring(2, 12);
}

/**
 * Log test step with timestamp
 * @param {string} message
 */
function logStep(message) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] 📝 ${message}`);
}

module.exports = {
  waitForElementStability,
  retryWithBackoff,
  takeScreenshot,
  assertEqual,
  assertIncludes,
  getTimestamp,
  pause,
  extractNumber,
  isValidEmail,
  generateRandomAccountNumber,
  logStep,
};
