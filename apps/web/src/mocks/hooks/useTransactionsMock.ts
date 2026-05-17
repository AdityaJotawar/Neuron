// Mock React Query hooks for Transaction operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockTransactions } from '@/api/mock/data/mockTransactions'
import type { Transaction } from '@/types'

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

interface TransactionFilters {
    accountId?: string
    category?: string
    type?: string
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
}

// Fetch all transactions with optional filters
export function useTransactions(filters?: TransactionFilters) {
    return useQuery({
        queryKey: ['transactions', filters],
        queryFn: async () => {
            await delay()
            let result = [...mockTransactions]

            if (filters?.accountId) result = result.filter(t => t.accountId === filters.accountId)
            if (filters?.category) result = result.filter(t => t.category === filters.category)
            if (filters?.type) result = result.filter(t => t.type === filters.type)
            if (filters?.startDate) {
                const startDate = new Date(filters.startDate)
                result = result.filter(t => new Date(t.date) >= startDate)
            }
            if (filters?.endDate) {
                const endDate = new Date(filters.endDate)
                result = result.filter(t => new Date(t.date) <= endDate)
            }

            result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

            if (filters?.offset) result = result.slice(filters.offset)
            if (filters?.limit) result = result.slice(0, filters.limit)

            return result
        },
    })
}

// Fetch single transaction by ID
export function useTransaction(transactionId: string | undefined) {
    return useQuery({
        queryKey: ['transactions', transactionId],
        queryFn: async () => {
            if (!transactionId) return null
            await delay()
            return mockTransactions.find(t => t.id === transactionId) || null
        },
        enabled: !!transactionId,
    })
}

// Fetch recent transactions
export function useRecentTransactions(limit = 100) {
    return useQuery({
        queryKey: ['transactions', 'recent', limit],
        queryFn: async () => {
            await delay()
            return [...mockTransactions]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, limit)
        },
    })
}

// Fetch transactions by category
export function useTransactionsByCategory(category: string, startDate?: string, endDate?: string) {
    return useQuery({
        queryKey: ['transactions', 'category', category, startDate, endDate],
        queryFn: async () => {
            await delay()
            let result = mockTransactions.filter(t => t.category === category)
            if (startDate) result = result.filter(t => new Date(t.date) >= new Date(startDate))
            if (endDate) result = result.filter(t => new Date(t.date) <= new Date(endDate))
            return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        },
    })
}

// Create new transaction
export function useCreateTransaction() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
            await delay()
            const newTransaction: Transaction = { ...transaction, id: `mock-${Date.now()}`, createdAt: new Date() }
            mockTransactions.push(newTransaction)
            return newTransaction
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
    })
}

// Update transaction
export function useUpdateTransaction() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Transaction> }) => {
            await delay()
            const idx = mockTransactions.findIndex(t => t.id === id)
            if (idx === -1) throw new Error('Transaction not found')
            const updated = { ...mockTransactions[idx], ...updates }
            mockTransactions[idx] = updated
            return updated
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            queryClient.invalidateQueries({ queryKey: ['transactions', data.id] })
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
    })
}

// Delete transaction
export function useDeleteTransaction() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (transactionId: string) => {
            await delay()
            const idx = mockTransactions.findIndex(t => t.id === transactionId)
            if (idx === -1) throw new Error('Transaction not found')
            mockTransactions.splice(idx, 1)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
    })
}

// Delete transactions by import ID
export function useDeleteImport() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (importId: string) => {
            await delay()
            for (let i = mockTransactions.length - 1; i >= 0; i--) {
                // @ts-ignore - importId may not be in base Transaction type
                if (mockTransactions[i].importId === importId) mockTransactions.splice(i, 1)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
    })
}

// Bulk delete transactions
export function useBulkDeleteTransactions() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (transactionIds: string[]) => {
            await delay()
            for (const id of transactionIds) {
                const idx = mockTransactions.findIndex(t => t.id === id)
                if (idx !== -1) mockTransactions.splice(idx, 1)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
    })
}

// Bulk create transactions
export function useBulkCreateTransactions() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (transactions: Omit<Transaction, 'id' | 'createdAt'>[]) => {
            await delay()
            const newTransactions: Transaction[] = transactions.map(t => ({
                ...t,
                id: `mock-${Date.now()}-${Math.random()}`,
                createdAt: new Date(),
            }))
            mockTransactions.push(...newTransactions)
            return newTransactions
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
    })
}
