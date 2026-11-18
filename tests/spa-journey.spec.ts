import { test, expect } from '@playwright/test'
import { shouldFail } from '../src/__checks__/fail-mode'

const TARGET_URL = process.env.TARGET_URL || 'https://danube-web.shop'

/**
 * Stand-in SPA journey. Six named steps so each is its own time series in
 * Checkly's per-step view, with two explicit soft-nav assertions.
 */
test('SPA journey with per-step timings', async ({ page }) => {
  if (shouldFail()) {
    // Intercept the SPA's main JS so bootstrap never completes. Network at the
    // document level still looks healthy; the visible failure lands at the
    // sign-in affordance.
    await page.route(/\/(assets|static)\/.*\.js(\?.*)?$/, (route) =>
      route.abort('failed'),
    )
  }

  await test.step('SPA shell loads', async () => {
    const response = await page.goto(`${TARGET_URL}/`, { waitUntil: 'domcontentloaded' })
    expect(response?.status(), 'shell HTTP status').toBeLessThan(400)
    await page.waitForLoadState('networkidle')
    await expect(
      page.getByRole('button', { name: /^log ?in$/i }).first(),
      'home rendered with sign-in affordance',
    ).toBeVisible({ timeout: 15_000 })
  })

  await test.step('soft-nav into category', async () => {
    await page.locator('[name="scifi"]').first().click()
    await expect(page, 'URL soft-navigated to /category').toHaveURL(/\/category/, {
      timeout: 15_000,
    })
    await expect(page.locator('.preview').first()).toBeVisible()
  })

  await test.step('soft-nav into product detail', async () => {
    await page.locator('.preview').first().click()
    await expect(page, 'URL soft-navigated to /books/:id').toHaveURL(/\/books\//, {
      timeout: 15_000,
    })
    await expect(page.getByRole('button', { name: /buy|add to cart/i }).first()).toBeVisible()
  })

  await test.step('open sign-in modal', async () => {
    await page.getByRole('button', { name: /^log ?in$/i }).first().click()
    await expect(page.getByPlaceholder(/email/i).first()).toBeVisible()
  })

  await test.step('fill credentials', async () => {
    await page.getByPlaceholder(/email/i).first().fill('demo@example.com')
    await page.getByPlaceholder(/password/i).first().fill('demo-password')
  })

  await test.step('submit, wait on response', async () => {
    const respPromise = page
      .waitForResponse((r) => r.request().method() === 'POST', { timeout: 15_000 })
      .catch(() => undefined)
    await page.getByRole('button', { name: /sign ?in|log ?in/i }).last().click()
    await respPromise
  })
})
