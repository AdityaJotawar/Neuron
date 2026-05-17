import { test, expect } from '@playwright/test'

test.describe('Portfolio', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/portfolio')
    })

    test('loads the portfolio page', async ({ page }) => {
        await page.waitForLoadState('networkidle')
        await expect(page.locator('h1, h2').first()).toBeVisible()
    })
})
