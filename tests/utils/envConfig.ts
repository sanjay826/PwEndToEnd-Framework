import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface EnvironmentConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export class EnvConfig {
  public static readonly baseUrl: string = process.env.BASE_URL || 'https://parabank.parasoft.com';
  public static readonly environment: string = process.env.ENVIRONMENT || 'production';
  public static readonly headless: boolean = process.env.HEADLESS !== 'false';
  public static readonly slowMo: number = parseInt(process.env.SLOW_MO || '0', 10);
  public static readonly timeout: number = parseInt(process.env.TIMEOUT || '30000', 10);
  public static readonly retries: number = parseInt(process.env.RETRIES || '0', 10);
  public static readonly workers: number = parseInt(process.env.WORKERS || '1', 10);

  /**
   * Get environment-specific configuration
   */
  public static getEnv(): EnvironmentConfig {
    switch (this.environment.toLowerCase()) {
      case 'staging':
        return {
          baseUrl: 'https://staging-parabank.parasoft.com',
          timeout: 40000,
          retries: 2,
        };
      case 'local':
        return {
          baseUrl: 'http://localhost:8080',
          timeout: 10000,
          retries: 0,
        };
      default:
        return {
          baseUrl: this.baseUrl,
          timeout: this.timeout,
          retries: this.retries,
        };
    }
  }
}

export default EnvConfig;
