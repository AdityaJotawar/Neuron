// Mock React Query hooks for Budget operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockBudgets } from '../../api/mock/data/mockBudgets.ts'
import { mockTransactions } from '../../api/mock/data/mockTransactions.ts'
import type { Budget } from '../../types/index.ts'

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Calculate spending for a budget period
const calculateSpending = (category: string, startDate: Date, endDate: Date) => {
  return mockTransactions
    .filter((t: any) => {
      const tDate = new Date(t.date)
      return (
        t.category === category &&
        tDate >= startDate &&
        tDate <= endDate &&
        t.amount < 0 // Only count expenses
      )
    })
    .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0)
}

// Create budget comparison data
const createBudgetComparison = () => {
  const today = new Date()
  return mockBudgets
    .filter(budget => new Date(budget.endDate) >= today)
    .map(budget => {
      const spent = calculateSpending(
        budget.category,
        new Date(budget.startDate),
        new Date(budget.endDate)
      )
      const percentUsed = (spent / budget.amount) * 100
      return {
        ...budget,
        spent,
        remaining: budget.amount - spent,
        percent_used: percentUsed,
      }
    })
}

// Fetch all budgets
export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      await delay()
      return mockBudgets.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },
  })
}

// Fetch active budgets (end date >= today)
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

// Fetch budget comparison (view with spending data)
export function useBudgetComparison() {
  return useQuery({
    queryKey: ['budget-comparison'],
    queryFn: async () => {
      await delay()
      const comparison = createBudgetComparison()
      return comparison.sort((a, b) => b.percent_used - a.percent_used)
    },
  })
}

// Fetch budgets by category
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

// Create new budget
export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
      await delay()
      const newBudget: Budget = {
        ...budget,
        id: `mock-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockBudgets.push(newBudget)
      return newBudget
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget-comparison'] })
    },
  })
}

// Update budget
export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Budget> }) => {
      await delay()
      const budgetIndex = mockBudgets.findIndex(b => b.id === id)
      if (budgetIndex === -1) {
        throw new Error('Budget not found')
      }
      const updatedBudget = {
        ...mockBudgets[budgetIndex],
        ...updates,
        updatedAt: new Date(),
      }
      mockBudgets[budgetIndex] = updatedBudget
      return updatedBudget
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budgets', data.id] })
      queryClient.invalidateQueries({ queryKey: ['budget-comparison'] })
    },
  })
}

// Delete budget
export function useDeleteBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (budgetId: string) => {
      await delay()
      const budgetIndex = mockBudgets.findIndex(b => b.id === budgetId)
      if (budgetIndex === -1) {
        throw new Error('Budget not found')
      }
      mockBudgets.splice(budgetIndex, 1)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget-comparison'] })
    },
  })
}
