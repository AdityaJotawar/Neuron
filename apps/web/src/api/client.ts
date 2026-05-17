import type { Account, Transaction, Budget, StockHolding, PortfolioStats, DashboardStats } from '../types'

// API response types
export interface ApiResponse<T> {
    data: T
    success: boolean
    message?: string
    error?: string
}

// API client interface
export interface ApiClient {
    // Dashboard
    getDashboardStats(): Promise<ApiResponse<DashboardStats>>

    // Accounts
    getAccounts(): Promise<ApiResponse<Account[]>>
    getAccount(id: string): Promise<ApiResponse<Account>>
    createAccount(account: Omit<Account, 'id'>): Promise<ApiResponse<Account>>
    updateAccount(id: string, updates: Partial<Account>): Promise<ApiResponse<Account>>

    // Transactions
    getTransactions(params?: {
        accountId?: string
        startDate?: Date
        endDate?: Date
        category?: string
    }): Promise<ApiResponse<Transaction[]>>
    getTransaction(id: string): Promise<ApiResponse<Transaction>>
    createTransaction(transaction: Omit<Transaction, 'id'>): Promise<ApiResponse<Transaction>>
    updateTransaction(id: string, updates: Partial<Transaction>): Promise<ApiResponse<Transaction>>

    // Budgets
    getBudgets(): Promise<ApiResponse<Budget[]>>
    getBudget(id: string): Promise<ApiResponse<Budget>>
    createBudget(budget: Omit<Budget, 'id'>): Promise<ApiResponse<Budget>>
    updateBudget(id: string, updates: Partial<Budget>): Promise<ApiResponse<Budget>>

    // Investments
    getStockHoldings(): Promise<ApiResponse<StockHolding[]>>
    getPortfolioStats(): Promise<ApiResponse<PortfolioStats>>

    // AI Chat (future implementation)
    sendChatMessage(message: string, sessionId?: string): Promise<ApiResponse<any>>
}

// Factory function to create API client
export async function createApiClient(mode: 'mock' | 'real' = 'mock'): Promise<ApiClient> {
    if (mode === 'real') {
        // Future: return real API client
        throw new Error('Real API client not implemented yet')
    }

    // Import mock client dynamically to avoid bundling issues
    const { createMockApiClient } = await import('./mock/client')
    return createMockApiClient()
}

// Default export for easy importing
export default createApiClient
