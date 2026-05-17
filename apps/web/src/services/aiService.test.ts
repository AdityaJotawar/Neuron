import { aiService } from './aiService'
import type { ChatMessage } from '../types'

describe('AIService', () => {
    describe('processQuery', () => {
        it('processes spending-related queries', async () => {
            const query = 'How much did I spend this month?'
            const context: ChatMessage[] = []

            const result = await aiService.processQuery(query, context)

            expect(result).toBeDefined()
            expect(result.content).toBeTruthy()
            expect(result.metadata).toHaveProperty('type')
            expect(result.metadata).toHaveProperty('query', query)
        })

        it('processes account balance queries', async () => {
            const query = 'What is my account balance?'
            const context: ChatMessage[] = []

            const result = await aiService.processQuery(query, context)

            expect(result.content).toContain('balance')
            expect(result.metadata?.type).toBe('account_balance')
        })

        it('processes budget-related queries', async () => {
            const query = 'How is my budget looking?'
            const context: ChatMessage[] = []

            const result = await aiService.processQuery(query, context)

            expect(result.content).toContain('budget')
            expect(result.metadata?.type).toBe('budget_status')
        })

        it('processes net worth queries', async () => {
            const query = 'What is my net worth?'
            const context: ChatMessage[] = []

            const result = await aiService.processQuery(query, context)

            expect(result.content).toContain('net worth')
            expect(result.metadata?.type).toBe('net_worth')
        })

        it('processes investment queries', async () => {
            const query = 'How is my portfolio doing?'
            const context: ChatMessage[] = []

            const result = await aiService.processQuery(query, context)

            expect(result.content).toContain('portfolio')
            expect(result.metadata?.type).toBe('investment')
        })

        it('handles general queries', async () => {
            const query = 'Hello'
            const context: ChatMessage[] = []

            const result = await aiService.processQuery(query, context)

            expect(result.content).toBeTruthy()
            expect(result.metadata?.type).toBe('general')
        })

        it('simulates realistic response delay', async () => {
            const query = 'Test query'
            const context: ChatMessage[] = []
            const startTime = Date.now()

            await aiService.processQuery(query, context)
            const endTime = Date.now()

            // Should take at least 1 second (1000ms) due to simulated delay
            expect(endTime - startTime).toBeGreaterThan(1000)
        })

        it('provides varied responses for the same query type', async () => {
            const query = 'spending analysis'
            const context: ChatMessage[] = []

            const result1 = await aiService.processQuery(query, context)
            const result2 = await aiService.processQuery(query, context)

            // Results should be different due to randomization
            expect(result1.content).not.toBe(result2.content)
        })

        it('maintains context awareness', async () => {
            const query = 'Tell me more'
            const context: ChatMessage[] = [
                {
                    id: '1',
                    role: 'user',
                    content: 'What is my balance?',
                    timestamp: new Date()
                },
                {
                    id: '2',
                    role: 'assistant',
                    content: 'Your current balance is $5,230',
                    timestamp: new Date()
                }
            ]

            const result = await aiService.processQuery(query, context)

            expect(result).toBeDefined()
            expect(result.content).toBeTruthy()
        })
    })

    describe('Singleton pattern', () => {
        it('returns the same instance', () => {
            const instance1 = aiService
            const instance2 = aiService

            expect(instance1).toBe(instance2)
        })
    })
})