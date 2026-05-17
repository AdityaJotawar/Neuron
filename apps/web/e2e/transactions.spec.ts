import { test, expect } from '@playwright/test'

test.describe('Transactions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/transactions')
    })

    test('loads the transactions page', async ({ page }) => {
        await page.waitForLoadState('networkidle')
        await expect(page.locator('h1, h2').first()).toBeVisible()
    })
})
