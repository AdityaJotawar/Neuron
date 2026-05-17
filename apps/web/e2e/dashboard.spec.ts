import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('loads the dashboard page', async ({ page }) => {
        await expect(page).toHaveTitle(/Neuron/i)
        await expect(page.getByRole('navigation')).toBeVisible()
    })

    test('shows dashboard stats after loading', async ({ page }) => {
        await page.waitForLoadState('networkidle')
        // Dashboard should not show an error state
        await expect(page.getByText('No accounts found')).not.toBeVisible()
    })

    test('navigation links are visible', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
        await expect(page.getByRole('link', { name: 'Accounts' })).toBeVisible()
        await expect(page.getByRole('link', { name: 'Transactions' })).toBeVisible()
    })
})
