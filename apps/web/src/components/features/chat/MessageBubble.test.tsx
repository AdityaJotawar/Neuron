import { render, screen } from '@testing-library/react'
import MessageBubble from './MessageBubble'
import type { ChatMessage } from '../../../types'

describe('MessageBubble', () => {
    const mockUserMessage: ChatMessage = {
        id: '1',
        role: 'user',
        content: 'Hello AI',
        timestamp: new Date('2023-01-01T10:00:00Z')
    }

    const mockAssistantMessage: ChatMessage = {
        id: '2',
        role: 'assistant',
        content: 'Hello! How can I help you?',
        timestamp: new Date('2023-01-01T10:00:05Z')
    }

    it('renders user message correctly', () => {
        render(<MessageBubble message={mockUserMessage} />)

        expect(screen.getByText('Hello AI')).toBeInTheDocument()
        expect(screen.getByText('10:00')).toBeInTheDocument()

        // Check styling - user messages should be right-aligned with primary background
        const messageDiv = screen.getByText('Hello AI').closest('div')
        expect(messageDiv).toHaveClass('justify-end')
        expect(messageDiv?.querySelector('.bg-primary-500')).toBeInTheDocument()
    })

    it('renders assistant message correctly', () => {
        render(<MessageBubble message={mockAssistantMessage} />)

        expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument()
        expect(screen.getByText('10:00')).toBeInTheDocument()

        // Check styling - assistant messages should be left-aligned with slate background
        const messageDiv = screen.getByText('Hello! How can I help you?').closest('div')
        expect(messageDiv).toHaveClass('justify-start')
        expect(messageDiv?.querySelector('.bg-slate-100')).toBeInTheDocument()
    })

    it('displays timestamp in correct format', () => {
        render(<MessageBubble message={mockUserMessage} />)

        // Should display time in HH:MM format
        expect(screen.getByText('10:00')).toBeInTheDocument()
    })

    it('applies correct text color for user messages', () => {
        render(<MessageBubble message={mockUserMessage} />)

        const messageContent = screen.getByText('Hello AI')
        expect(messageContent).toHaveClass('text-white')
    })

    it('applies correct text color for assistant messages', () => {
        render(<MessageBubble message={mockAssistantMessage} />)

        const messageContent = screen.getByText('Hello! How can I help you?')
        expect(messageContent).toHaveClass('text-slate-900')
    })
})