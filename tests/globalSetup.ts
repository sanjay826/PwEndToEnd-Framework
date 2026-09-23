import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';
import { LoginPage } from './pages/loginPage';
import { RegistrationDetails, RegistrationPage } from './pages/registrationPage';
import { EnvConfig } from './utils/envConfig';

export const authStatePath = path.resolve(__dirname, '../playwright/.auth/user.json');
const credentialsPath = path.resolve(__dirname, '../playwright/.auth/user-credentials.json');

function randomDigits(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

function createRegistrationDetails(): RegistrationDetails {
  const uniquePart = `${Date.now()}${randomDigits(4)}`;
  return {
    firstName: 'Sky',
    lastName: 'Best',
    address: 'New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    zipCode: '110006',
    phoneNumber: randomDigits(10),
    ssn: randomDigits(9),
    username: `sky${uniquePart}`,
    password: 'sky01',
  };
}

async function hasValidCachedLogin(): Promise<boolean> {
  try {
    await fs.access(authStatePath);
    const browser = await chromium.launch();
    const context = await browser.newContext({ storageState: authStatePath });
    const page = await context.newPage();
    await page.goto(`${EnvConfig.baseUrl}/parabank/openaccount.htm`, { waitUntil: 'domcontentloaded' });
    const loginVisible = await page.locator('h2', { hasText: 'Customer Login' }).isVisible().catch(() => false);
    await browser.close();
    return !loginVisible;
  } catch {
    return false;
  }
}

async function refreshStateWithCachedCredentials(): Promise<boolean> {
  try {
    const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8')) as Pick<RegistrationDetails, 'username' | 'password'>;
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(credentials.username, credentials.password);
    const loggedIn = await loginPage.isLoggedIn();
    if (loggedIn) {
      await context.storageState({ path: authStatePath });
    }
    await browser.close();
    return loggedIn;
  } catch {
    return false;
  }
}

async function createFreshAuthenticatedState(): Promise<void> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const registrationPage = new RegistrationPage(page);
  const loginPage = new LoginPage(page);
  const details = createRegistrationDetails();

  await registrationPage.navigate();
  await registrationPage.register(details);
  if (!(await registrationPage.isRegistrationSuccessful())) {
    throw new Error(`Registration failed for generated username ${details.username}`);
  }

  // ParaBank commonly authenticates the user immediately after registration.
  // If the environment does not, complete the normal login flow instead.
  if (!(await loginPage.isLoggedIn())) {
    await loginPage.navigate();
    await loginPage.login(details.username, details.password);
  }
  if (!(await loginPage.isLoggedIn())) {
    throw new Error(`Login failed for newly registered username ${details.username}`);
  }

  await fs.mkdir(path.dirname(authStatePath), { recursive: true });
  await context.storageState({ path: authStatePath });
  await fs.writeFile(credentialsPath, JSON.stringify({ username: details.username, password: details.password }, null, 2));
  await browser.close();
}

async function globalSetup(_config: FullConfig): Promise<void> {
  if (!(await hasValidCachedLogin()) && !(await refreshStateWithCachedCredentials())) {
    await createFreshAuthenticatedState();
  }
}

export default globalSetup;