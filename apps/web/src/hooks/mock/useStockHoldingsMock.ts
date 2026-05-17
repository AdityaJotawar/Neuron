// Mock React Query hooks for Stock Holdings operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockStockHoldings } from '../../api/mock/data/mockStockHoldings.ts'
import type { StockHolding } from '../../types/index.ts'

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Mock portfolio performance data (calculated from holdings)
const calculatePortfolioPerformance = () => {
  return mockStockHoldings.map((holding: any) => ({
    ...holding,
    market_value: holding.quantity * holding.currentPrice,
    total_gain_loss: (holding.currentPrice - holding.purchasePrice) * holding.quantity,
    gain_loss_percent: ((holding.currentPrice - holding.purchasePrice) / holding.purchasePrice) * 100,
  }))
}

// Fetch all stock holdings
export function useStockHoldings() {
  return useQuery({
    queryKey: ['stock-holdings'],
    queryFn: async () => {
      await delay()
      return mockStockHoldings
    },
  })
}

// Fetch stock holdings by account
export function useStockHoldingsByAccount(accountId: string | undefined) {
  return useQuery({
    queryKey: ['stock-holdings', 'account', accountId],
    queryFn: async () => {
      if (!accountId) return []
      await delay()
      return mockStockHoldings
        .filter(holding => holding.accountId === accountId)
        .sort((a, b) => a.symbol.localeCompare(b.symbol))
    },
    enabled: !!accountId,
  })
}

// Fetch portfolio performance (view with calculated gains/losses)
export function usePortfolioPerformance() {
  return useQuery({
    queryKey: ['portfolio-performance'],
    queryFn: async () => {
      await delay()
      const performance = calculatePortfolioPerformance()
      return performance.sort((a, b) => b.market_value - a.market_value)
    },
  })
}

// Fetch stock price from cache (mock data)
export function useStockPrice(symbol: string | undefined) {
  return useQuery({
    queryKey: ['stock-price', symbol],
    queryFn: async () => {
      if (!symbol) return null
      await delay()
      const holding = mockStockHoldings.find(
        h => h.symbol.toUpperCase() === symbol.toUpperCase()
      )
      if (!holding) {
        console.warn(`No mock price data for ${symbol}`)
        return null
      }
      return {
        symbol: holding.symbol,
        price: holding.currentPrice,
        cached_at: new Date().toISOString(),
      }
    },
    enabled: !!symbol,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Create new stock holding
export function useCreateStockHolding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (holding: Omit<StockHolding, 'id' | 'createdAt'>) => {
      await delay()
      const newHolding: StockHolding = {
        ...holding,
        id: `mock-${Date.now()}`,
        createdAt: new Date(),
      }
      mockStockHoldings.push(newHolding)
      return newHolding
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-holdings'] })
      queryClient.invalidateQueries({ queryKey: ['portfolio-performance'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

// Update stock holding
export function useUpdateStockHolding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StockHolding> }) => {
      await delay()
      const holdingIndex = mockStockHoldings.findIndex(h => h.id === id)
      if (holdingIndex === -1) {
        throw new Error('Stock holding not found')
      }
      const updatedHolding: StockHolding = {
        ...mockStockHoldings[holdingIndex],
        ...updates,
      }
      mockStockHoldings[holdingIndex] = updatedHolding
      return updatedHolding
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stock-holdings'] })
      queryClient.invalidateQueries({ queryKey: ['stock-holdings', 'account', data.accountId] })
      queryClient.invalidateQueries({ queryKey: ['portfolio-performance'] })
    },
  })
}

// Delete stock holding
export function useDeleteStockHolding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (holdingId: string) => {
      await delay()
      const holdingIndex = mockStockHoldings.findIndex(h => h.id === holdingId)
      if (holdingIndex === -1) {
        throw new Error('Stock holding not found')
      }
      mockStockHoldings.splice(holdingIndex, 1)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-holdings'] })
      queryClient.invalidateQueries({ queryKey: ['portfolio-performance'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

// Manually trigger stock price update (mock - just invalidates cache)
export function useUpdateStockPrices() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await delay(1000) // Simulate longer process
      console.log('Mock: Stock prices updated')
      return { success: true, message: 'Mock stock prices updated' }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-holdings'] })
      queryClient.invalidateQueries({ queryKey: ['stock-price'] })
      queryClient.invalidateQueries({ queryKey: ['portfolio-performance'] })
    },
  })
}
