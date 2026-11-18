import 'dotenv/config'
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: process.env.TARGET_URL || 'https://danube-web.shop',
    screenshot: 'only-on-failure',
    trace: 'on',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
