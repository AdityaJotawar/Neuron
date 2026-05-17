// useDashboard — extracts all dashboard state from Dashboard.tsx
// This makes Dashboard.tsx a thin orchestrator

import { useState, useMemo, useEffect } from 'react'
import {
    netWorthChartData,
    assetAllocationData,
    monthlyExpensesData,
    portfolioPerformanceData,
    financialHealthScore,
    dashboardAlerts,
    cashFlowCalendarData,
    savingsGoals,
    statSparklineData,
    calculateDashboardStats,
} from '@/api/mock/data/mockDashboard'
import { useAccounts } from './index'
import { useTransactions } from './index'
import { useStockHoldings } from './index'
import type { Account } from '@/types'

export function useDashboard() {
    // Widget visibility
    const [visibleWidgets, setVisibleWidgets] = useState({
        stats: true,
        quickActions: true,
        healthScore: true,
        alerts: true,
        accounts: true,
        netWorth: true,
        allocation: true,
        expenses: true,
        portfolio: true,
        savingsGoals: true,
        cashFlow: true,
    })

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
    const [showTransactionModal, setShowTransactionModal] = useState(false)
    const [showCustomizeMenu, setShowCustomizeMenu] = useState(false)

    // Chart controls
    const [netWorthTimeRange, setNetWorthTimeRange] = useState('12M')
    const [portfolioTimeRange, setPortfolioTimeRange] = useState('6M')
    const [netWorthChartType, setNetWorthChartType] = useState<'area' | 'bar'>('area')
    const [portfolioChartType, setPortfolioChartType] = useState<'line' | 'bar'>('line')
    const [showForecast, setShowForecast] = useState(false)

    // Auto-refresh
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(0)

    useEffect(() => {
        if (autoRefreshInterval === 0) return
        const interval = setInterval(() => handleRefresh(), autoRefreshInterval * 60 * 1000)
        return () => clearInterval(interval)
    }, [autoRefreshInterval])

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
    }

    const toggleWidget = (key: keyof typeof visibleWidgets) => {
        setVisibleWidgets(prev => ({ ...prev, [key]: !prev[key] }))
    }

    // Data hooks
    const { data: accounts, isLoading: accountsLoading } = useAccounts()
    const { data: transactions, isLoading: transactionsLoading } = useTransactions()
    const { data: stockHoldings, isLoading: stockHoldingsLoading } = useStockHoldings()

    const isLoading = accountsLoading || transactionsLoading || stockHoldingsLoading

    // Memoized derived state
    const stats = useMemo(() => calculateDashboardStats(), [accounts])

    const selectedAccountTransactions = useMemo(() => {
        if (!selectedAccount || !transactions) return []
        return transactions.filter((t: { accountId: string }) => t.accountId === selectedAccount.id)
    }, [selectedAccount, transactions])

    const selectedAccountHoldings = useMemo(() => {
        if (!selectedAccount || !stockHoldings) return []
        return stockHoldings.filter((h: { accountId: string }) => h.accountId === selectedAccount.id)
    }, [selectedAccount, stockHoldings])

    const filteredNetWorthData = useMemo(() => {
        const months = netWorthTimeRange === '12M' ? 12 : netWorthTimeRange === '6M' ? 6 : 3
        const data = netWorthChartData.slice(-months)

        if (showForecast) {
            const lastValue = data[data.length - 1].value
            const prevValue = data[data.length - 6]?.value || data[0].value
            const monthsDiff = data.length - (data.length - 6 > 0 ? 6 : 0)
            const avgGrowth = (lastValue - prevValue) / monthsDiff
            const forecastData = Array.from({ length: 3 }, (_, i) => ({
                month: `Next ${i + 1}`,
                value: null,
                forecastValue: Math.round(lastValue + avgGrowth * (i + 1)),
            }))
            const withConnection = data.map(d => ({ ...d, forecastValue: null as number | null }))
            withConnection[withConnection.length - 1].forecastValue = withConnection[withConnection.length - 1].value
            return [...withConnection, ...forecastData]
        }

        return data.map(d => ({ ...d, forecastValue: null as number | null }))
    }, [netWorthTimeRange, showForecast])

    const filteredPortfolioData = useMemo(() => {
        const months = portfolioTimeRange === '12M' ? 12 : portfolioTimeRange === '6M' ? 6 : 3
        return portfolioPerformanceData.slice(-months)
    }, [portfolioTimeRange])

    return {
        // Loading
        isLoading,
        accounts,

        // Stats
        stats,
        statSparklineData,

        // Widget visibility
        visibleWidgets,
        toggleWidget,

        // Customize
        showCustomizeMenu,
        setShowCustomizeMenu,

        // Refresh
        isRefreshing,
        autoRefreshInterval,
        setAutoRefreshInterval,
        handleRefresh,

        // Chart data
        filteredNetWorthData,
        netWorthTimeRange,
        setNetWorthTimeRange,
        netWorthChartType,
        setNetWorthChartType,
        showForecast,
        setShowForecast,
        assetAllocationData,
        monthlyExpensesData,
        filteredPortfolioData,
        portfolioTimeRange,
        setPortfolioTimeRange,
        portfolioChartType,
        setPortfolioChartType,

        // Widgets data
        financialHealthScore,
        dashboardAlerts,
        savingsGoals,
        cashFlowCalendarData,

        // Account modal
        selectedAccount,
        setSelectedAccount,
        isModalOpen,
        setIsModalOpen,
        selectedAccountTransactions,
        selectedAccountHoldings,

        // Transaction modal
        showTransactionModal,
        setShowTransactionModal,
    }
}
