// Mock React Query hooks for Budget operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockBudgets } from '@/api/mock/data/mockBudgets'
import { mockTransactions } from '@/api/mock/data/mockTransactions'
import type { Budget } from '@/types'

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

const calculateSpending = (category: string, startDate: Date, endDate: Date) =>
    mockTransactions
        .filter((t: any) => {
            const tDate = new Date(t.date)
            return t.category === category && tDate >= startDate && tDate <= endDate && t.amount < 0
        })
        .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0)

const createBudgetComparison = () => {
    const today = new Date()
    return mockBudgets
        .filter(budget => new Date(budget.endDate) >= today)
        .map(budget => {
            const spent = calculateSpending(budget.category, new Date(budget.startDate), new Date(budget.endDate))
            const percentUsed = (spent / budget.amount) * 100
            return { ...budget, spent, remaining: budget.amount - spent, percent_used: percentUsed }
        })
}

export function useBudgets() {
    return useQuery({
        queryKey: ['budgets'],
        queryFn: async () => {
            await delay()
            return mockBudgets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        },
    })
}

export function useActiveBudgets() {
    return useQuery({
        queryKey: ['budgets', 'active'],
        queryFn: async () => {
            await delay()
            const today = new Date()
            return mockBudgets
                .filter(budget => new Date(budget.endDate) >= today)
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        },
    })
}

export function useBudgetComparison() {
    return useQuery({
        queryKey: ['budget-comparison'],
        queryFn: async () => {
            await delay()
            return createBudgetComparison().sort((a, b) => b.percent_used - a.percent_used)
        },
    })
}

export function useBudgetsByCategory(category: string) {
    return useQuery({
        queryKey: ['budgets', 'category', category],
        queryFn: async () => {
            await delay()
            return mockBudgets
                .filter(budget => budget.category === category)
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        },
    })
}

export function useCreateBudget() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
            await delay()
            const newBudget: Budget = { ...budget, id: `mock-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() }
            mockBudgets.push(newBudget)
            return newBudget
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] })
            queryClient.invalidateQueries({ queryKey: ['budget-comparison'] })
        },
    })
}

export function useUpdateBudget() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Budget> }) => {
            await delay()
            const idx = mockBudgets.findIndex(b => b.id === id)
            if (idx === -1) throw new Error('Budget not found')
            const updated = { ...mockBudgets[idx], ...updates, updatedAt: new Date() }
            mockBudgets[idx] = updated
            return updated
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] })
            queryClient.invalidateQueries({ queryKey: ['budgets', data.id] })
            queryClient.invalidateQueries({ queryKey: ['budget-comparison'] })
        },
    })
}

export function useDeleteBudget() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (budgetId: string) => {
            await delay()
            const idx = mockBudgets.findIndex(b => b.id === budgetId)
            if (idx === -1) throw new Error('Budget not found')
            mockBudgets.splice(idx, 1)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] })
            queryClient.invalidateQueries({ queryKey: ['budget-comparison'] })
        },
    })
}
