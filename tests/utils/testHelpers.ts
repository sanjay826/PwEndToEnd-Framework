import { Locator, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Log test step with formatted timestamp
 */
export function logStep(message: string): void {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] 📝 ${message}`);
}

/**
 * Wait for element stability (avoiding animation or layout shifts)
 */
export async function waitForElementStability(locator: Locator, stabilityTimeout = 500): Promise<void> {
  await locator.waitFor({ state: 'visible' });
  await locator.page().waitForTimeout(stabilityTimeout);
}

/**
 * Retry an asynchronous function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i === maxRetries - 1) break;
      const waitTime = delayMs * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
  throw lastError;
}

/**
 * Capture screenshot into tests/screenshots folder with descriptive filename
 */
export async function takeScreenshot(page: Page, testName: string, stepName: string): Promise<string> {
  const screenshotDir = path.resolve(__dirname, '../../tests/screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const sanitizedTestName = testName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const sanitizedStep = stepName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${sanitizedTestName}-${sanitizedStep}-${timestamp}.png`;
  const filepath = path.join(screenshotDir, filename);

  await page.screenshot({ path: filepath, fullPage: true });
  return filepath;
}

/**
 * Extract numeric value from text
 */
export function extractNumber(text: string): number | null {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate random account number for test assertions
 */
export function generateRandomAccountNumber(): string {
  return Math.random().toString().substring(2, 12);
}

/**
 * Get current ISO timestamp
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}
