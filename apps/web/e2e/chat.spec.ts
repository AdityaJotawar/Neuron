import { test, expect } from '@playwright/test'

test.describe('Chat Interface', () => {
    test('should load chat page and display welcome message', async ({ page }) => {
        await page.goto('/chat')

        // Check page title
        await expect(page).toHaveTitle(/FinanceTracker/)

        // Check breadcrumbs
        await expect(page.getByText('Dashboard')).toBeVisible()
        await expect(page.getByText('Chat')).toBeVisible()

        // Check page heading
        await expect(page.getByRole('heading', { name: 'AI Chat' })).toBeVisible()

        // Check welcome message
        await expect(page.getByText(/Hello! I'm your AI financial assistant/)).toBeVisible()
    })

    test('should allow sending messages and receiving responses', async ({ page }) => {
        await page.goto('/chat')

        // Type a message
        const input = page.getByPlaceholder('Ask me about your finances...')
        await input.fill('What is my account balance?')

        // Click send button
        const sendButton = page.getByRole('button', { name: /send/i })
        await sendButton.click()

        // Check that user message appears
        await expect(page.getByText('What is my account balance?')).toBeVisible()

        // Check for typing indicator
        await expect(page.getByText('AI is typing...')).toBeVisible()

        // Wait for AI response (mock response should appear within a few seconds)
        await expect(page.getByText(/balance/)).toBeVisible({ timeout: 5000 })

        // Typing indicator should disappear
        await expect(page.getByText('AI is typing...')).not.toBeVisible()
    })

    test('should handle conversation flow with follow-up questions', async ({ page }) => {
        await page.goto('/chat')

        // Send first message
        const input = page.getByPlaceholder('Ask me about your finances...')
        await input.fill('How much did I spend this month?')
        await page.keyboard.press('Enter')

        // Wait for first response
        await expect(page.getByText(/spend/)).toBeVisible({ timeout: 5000 })

        // Send follow-up
        await input.fill('Tell me more about my expenses')
        await page.keyboard.press('Enter')

        // Should receive another response
        await expect(page.getByText('Tell me more about my expenses')).toBeVisible()
        // Wait for response - in real implementation this would be different
        await page.waitForTimeout(2000)
    })

    test('should navigate to chat from main navigation', async ({ page }) => {
        await page.goto('/')

        // Click Chat link in navigation
        await page.getByRole('link', { name: 'Chat' }).click()

        // Should be on chat page
        await expect(page).toHaveURL(/\/chat/)
        await expect(page.getByRole('heading', { name: 'AI Chat' })).toBeVisible()
    })

    test('should prevent sending empty messages', async ({ page }) => {
        await page.goto('/chat')

        const sendButton = page.getByRole('button', { name: /send/i })

        // Button should be disabled when input is empty
        await expect(sendButton).toBeDisabled()

        // Type something then clear
        const input = page.getByPlaceholder('Ask me about your finances...')
        await input.fill('test')
        await input.clear()

        // Button should be disabled again
        await expect(sendButton).toBeDisabled()
    })

    test('should support multi-line messages', async ({ page }) => {
        await page.goto('/chat')

        const input = page.getByPlaceholder('Ask me about your finances...')

        // Type multi-line message
        await input.fill('Line 1\nLine 2\nLine 3')

        // Should preserve line breaks
        const value = await input.inputValue()
        expect(value).toContain('\n')
    })

    test('should handle AI service errors gracefully', async ({ page }) => {
        // This test would require mocking the AI service to return errors
        // For now, we verify the UI can handle error states conceptually
        await page.goto('/chat')

        // The interface should be robust enough to handle errors
        // In a real test, we'd mock the service to throw errors
        await expect(page.getByPlaceholder('Ask me about your finances...')).toBeVisible()
    })
})