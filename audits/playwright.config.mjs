// Playwright suite for Invest Ready. Runs against a production build on port 3201, started automatically from the
// repo root unless AUDIT_URL points somewhere else (the live site, a preview deployment, another port).
import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.AUDIT_PORT || 3201);
const baseURL = process.env.AUDIT_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  // The laptop this runs on is shared; four workers keep the suite quick without crowding it.
  workers: process.env.CI ? undefined : 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['json', { outputFile: 'results/latest/playwright.json' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: process.env.AUDIT_URL
    ? undefined
    : {
        command: `npm --prefix .. run start -- -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
