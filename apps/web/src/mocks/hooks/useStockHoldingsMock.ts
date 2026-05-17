// Mock React Query hooks for Stock Holdings operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockStockHoldings } from '@/api/mock/data/mockStockHoldings'
import type { StockHolding } from '@/types'

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

const calculatePortfolioPerformance = () =>
    mockStockHoldings.map((holding: any) => ({
        ...holding,
        market_value: holding.quantity * holding.currentPrice,
        total_gain_loss: (holding.currentPrice - holding.purchasePrice) * holding.quantity,
        gain_loss_percent: ((holding.currentPrice - holding.purchasePrice) / holding.purchasePrice) * 100,
    }))

export function useStockHoldings() {
    return useQuery({
        queryKey: ['stock-holdings'],
        queryFn: async () => { await delay(); return mockStockHoldings },
    })
}

export function useStockHoldingsByAccount(accountId: string | undefined) {
    return useQuery({
        queryKey: ['stock-holdings', 'account', accountId],
        queryFn: async () => {
            if (!accountId) return []
            await delay()
            return mockStockHoldings
                .filter(h => h.accountId === accountId)
                .sort((a, b) => a.symbol.localeCompare(b.symbol))
        },
        enabled: !!accountId,
    })
}

export function usePortfolioPerformance() {
    return useQuery({
        queryKey: ['portfolio-performance'],
        queryFn: async () => {
            await delay()
            return calculatePortfolioPerformance().sort((a, b) => b.market_value - a.market_value)
        },
    })
}

export function useStockPrice(symbol: string | undefined) {
    return useQuery({
        queryKey: ['stock-price', symbol],
        queryFn: async () => {
            if (!symbol) return null
            await delay()
            const holding = mockStockHoldings.find(h => h.symbol.toUpperCase() === symbol.toUpperCase())
            if (!holding) return null
            return { symbol: holding.symbol, price: holding.currentPrice, cached_at: new Date().toISOString() }
        },
        enabled: !!symbol,
        staleTime: 15 * 60 * 1000,
    })
}

export function useCreateStockHolding() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (holding: Omit<StockHolding, 'id' | 'createdAt'>) => {
            await delay()
            const newHolding: StockHolding = { ...holding, id: `mock-${Date.now()}`, createdAt: new Date() }
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

export function useUpdateStockHolding() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<StockHolding> }) => {
            await delay()
            const idx = mockStockHoldings.findIndex(h => h.id === id)
            if (idx === -1) throw new Error('Stock holding not found')
            const updated: StockHolding = { ...mockStockHoldings[idx], ...updates }
            mockStockHoldings[idx] = updated
            return updated
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['stock-holdings'] })
            queryClient.invalidateQueries({ queryKey: ['stock-holdings', 'account', data.accountId] })
            queryClient.invalidateQueries({ queryKey: ['portfolio-performance'] })
        },
    })
}

export function useDeleteStockHolding() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (holdingId: string) => {
            await delay()
            const idx = mockStockHoldings.findIndex(h => h.id === holdingId)
            if (idx === -1) throw new Error('Stock holding not found')
            mockStockHoldings.splice(idx, 1)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stock-holdings'] })
            queryClient.invalidateQueries({ queryKey: ['portfolio-performance'] })
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
    })
}

export function useUpdateStockPrices() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            await delay(1000)
            return { success: true, message: 'Mock stock prices updated' }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stock-holdings'] })
            queryClient.invalidateQueries({ queryKey: ['stock-price'] })
            queryClient.invalidateQueries({ queryKey: ['portfolio-performance'] })
        },
    })
}
