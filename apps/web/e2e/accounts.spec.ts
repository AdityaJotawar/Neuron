import { test, expect } from '@playwright/test'

test.describe('Accounts', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/accounts')
    })

    test('loads the accounts page', async ({ page }) => {
        await page.waitForLoadState('networkidle')
        await expect(page.locator('h1, h2').first()).toBeVisible()
    })
})
