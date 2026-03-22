/**
 * Environment Configuration
 * Optional configuration for different environments
 */

const fs = require('fs');
const path = require('path');

/**
 * Load environment variables
 */
function loadEnv() {
  const envFile = path.join(__dirname, '../.env');
  
  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
}

/**
 * Environment configuration object
 */
const envConfig = {
  baseUrl: process.env.BASE_URL || 'https://parabank.parasoft.com',
  environment: process.env.ENVIRONMENT || 'production',
  headless: process.env.HEADLESS !== 'false',
  slowMo: parseInt(process.env.SLOW_MO) || 0,
  timeout: parseInt(process.env.TIMEOUT) || 30000,
  retries: parseInt(process.env.RETRIES) || 0,
  workers: parseInt(process.env.WORKERS) || 1,

  /**
   * Get configuration for specific environment
   */
  getEnv() {
    switch (this.environment) {
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
  },

  /**
   * Get browser launch options
   */
  getBrowserOptions() {
    return {
      headless: this.headless,
      slowMo: this.slowMo,
      args: ['--disable-blink-features=AutomationControlled'],
    };
  },
};

// Load environment variables on module import
loadEnv();

module.exports = envConfig;
