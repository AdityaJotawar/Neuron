import { test, expect } from '@playwright/test'

test.describe('Imports', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/imports')
    })

    test('loads the imports page', async ({ page }) => {
        await page.waitForLoadState('networkidle')
        await expect(page.locator('h1, h2').first()).toBeVisible()
    })
})
