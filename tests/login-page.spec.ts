import { test, expect } from '@playwright/test'

const TARGET_URL = process.env.TARGET_URL || 'https://danube-web.shop'

test('login page is reachable and renders', async ({ page }) => {
  const response = await page.goto(`${TARGET_URL}/`, { waitUntil: 'domcontentloaded' })
  expect(response?.status(), 'shell HTTP status').toBeLessThan(400)

  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /log ?in|sign ?in/i }).first().click()

  const emailField = page
    .getByPlaceholder(/email/i)
    .or(page.getByRole('textbox', { name: /email/i }))
    .or(page.locator('input[type="email"]'))
  await expect(emailField, 'email field present on sign-in form').toBeVisible({
    timeout: 15_000,
  })
})
