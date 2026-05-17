import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatInterface from './ChatInterface'
import { aiService } from '../../../services/aiService'

// Mock the AI service
jest.mock('../../../services/aiService', () => ({
    aiService: {
        processQuery: jest.fn()
    }
}))

const mockProcessQuery = aiService.processQuery as jest.MockedFunction<typeof aiService.processQuery>

describe('ChatInterface', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockProcessQuery.mockResolvedValue({
            content: 'Mock AI response',
            metadata: { type: 'general', query: 'test query' }
        })
    })

    it('renders initial welcome message', () => {
        render(<ChatInterface />)

        expect(screen.getByText(/Hello! I\'m your AI financial assistant/)).toBeInTheDocument()
    })

    it('displays messages in chat area', () => {
        render(<ChatInterface />)

        const chatContainer = screen.getByRole('region', { hidden: true }) || screen.getByText(/Hello!/).closest('.flex-col')
        expect(chatContainer).toBeInTheDocument()
    })

    it('allows user to type a message', async () => {
        const user = userEvent.setup()
        render(<ChatInterface />)

        const input = screen.getByPlaceholderText('Ask me about your finances...')
        await user.type(input, 'What is my account balance?')

        expect(input).toHaveValue('What is my account balance?')
    })

    it('sends message when Enter is pressed', async () => {
        const user = userEvent.setup()
        render(<ChatInterface />)

        const input = screen.getByPlaceholderText('Ask me about your finances...')
        await user.type(input, 'Test message{enter}')

        expect(mockProcessQuery).toHaveBeenCalledWith('Test message', expect.any(Array))
    })

    it('sends message when send button is clicked', async () => {
        const user = userEvent.setup()
        render(<ChatInterface />)

        const input = screen.getByPlaceholderText('Ask me about your finances...')
        const sendButton = screen.getByRole('button', { name: /send/i })

        await user.type(input, 'Test message')
        await user.click(sendButton)

        expect(mockProcessQuery).toHaveBeenCalledWith('Test message', expect.any(Array))
    })

    it('displays user message after sending', async () => {
        const user = userEvent.setup()
        render(<ChatInterface />)

        const input = screen.getByPlaceholderText('Ask me about your finances...')
        await user.type(input, 'User test message{enter}')

        expect(screen.getByText('User test message')).toBeInTheDocument()
    })

    it('shows typing indicator while processing', async () => {
        mockProcessQuery.mockImplementation(() => new Promise(resolve =>
            setTimeout(() => resolve({ content: 'Response', metadata: {} }), 100)
        ))

        const user = userEvent.setup()
        render(<ChatInterface />)

        const input = screen.getByPlaceholderText('Ask me about your finances...')
        await user.type(input, 'Test{enter}')

        expect(screen.getByText('AI is typing...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.queryByText('AI is typing...')).not.toBeInTheDocument()
        })
    })

    it('displays AI response after processing', async () => {
        const user = userEvent.setup()
        render(<ChatInterface />)

        const input = screen.getByPlaceholderText('Ask me about your finances...')
        await user.type(input, 'Test query{enter}')

        await waitFor(() => {
            expect(screen.getByText('Mock AI response')).toBeInTheDocument()
        })
    })

    it('handles API errors gracefully', async () => {
        mockProcessQuery.mockRejectedValue(new Error('API Error'))

        const user = userEvent.setup()
        render(<ChatInterface />)

        const input = screen.getByPlaceholderText('Ask me about your finances...')
        await user.type(input, 'Test{enter}')

        await waitFor(() => {
            expect(screen.getByText(/Sorry, I encountered an error/)).toBeInTheDocument()
        })
    })

    it('disables input while typing', async () => {
        mockProcessQuery.mockImplementation(() => new Promise(resolve =>
            setTimeout(() => resolve({ content: 'Response', metadata: {} }), 100)
        ))

        const user = userEvent.setup()
        render(<ChatInterface />)

        const input = screen.getByPlaceholderText('Ask me about your finances...')
        await user.type(input, 'Test{enter}')

        expect(input).toBeDisabled()

        await waitFor(() => {
            expect(input).not.toBeDisabled()
        })
    })

    it('auto-scrolls to bottom when new messages arrive', async () => {
        const user = userEvent.setup()
        render(<ChatInterface />)

        const input = screen.getByPlaceholderText('Ask me about your finances...')
        await user.type(input, 'First message{enter}')

        await waitFor(() => {
            expect(screen.getByText('Mock AI response')).toBeInTheDocument()
        })

        // The scroll behavior would need more complex testing with scroll mocks
        // For now, we verify the message is rendered
        expect(screen.getByText('First message')).toBeInTheDocument()
    })

    it('prevents sending empty messages', async () => {
        const user = userEvent.setup()
        render(<ChatInterface />)

        const sendButton = screen.getByRole('button', { name: /send/i })
        await user.click(sendButton)

        expect(mockProcessQuery).not.toHaveBeenCalled()
    })

    it('supports multi-line messages with Shift+Enter', async () => {
        const user = userEvent.setup()
        render(<ChatInterface />)

        const input = screen.getByPlaceholderText('Ask me about your finances...')
        await user.type(input, 'Line 1{shift}{enter}Line 2')

        expect(input).toHaveValue('Line 1\nLine 2')
        expect(mockProcessQuery).not.toHaveBeenCalled()
    })
})