import { test, expect } from '@playwright/test'

test.describe('Budget', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/budget')
    })

    test('loads the budget page', async ({ page }) => {
        await page.waitForLoadState('networkidle')
        await expect(page.locator('h1, h2').first()).toBeVisible()
    })
})
