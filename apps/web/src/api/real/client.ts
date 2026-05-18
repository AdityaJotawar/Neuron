import type { ApiClient, ApiResponse } from '../client'
import type { Account, Transaction, Budget, StockHolding, PortfolioStats, DashboardStats } from '../../types'

class NotImplementedError extends Error {
    constructor(methodName: string) {
        super(`RealApiClient.${methodName} is not implemented yet. Set VITE_API_MODE=mock to use mock data.`)
        this.name = 'NotImplementedError'
    }
}

export function createRealApiClient(): ApiClient {
    return {
        // Dashboard
        async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
            throw new NotImplementedError('getDashboardStats')
        },

        // Accounts
        async getAccounts(): Promise<ApiResponse<Account[]>> {
            throw new NotImplementedError('getAccounts')
        },

        async getAccount(_id: string): Promise<ApiResponse<Account>> {
            throw new NotImplementedError('getAccount')
        },

        async createAccount(_account: Omit<Account, 'id'>): Promise<ApiResponse<Account>> {
            throw new NotImplementedError('createAccount')
        },

        async updateAccount(_id: string, _updates: Partial<Account>): Promise<ApiResponse<Account>> {
            throw new NotImplementedError('updateAccount')
        },

        // Transactions
        async getTransactions(_params?: {
            accountId?: string
            startDate?: Date
            endDate?: Date
            category?: string
        }): Promise<ApiResponse<Transaction[]>> {
            throw new NotImplementedError('getTransactions')
        },

        async getTransaction(_id: string): Promise<ApiResponse<Transaction>> {
            throw new NotImplementedError('getTransaction')
        },

        async createTransaction(_transaction: Omit<Transaction, 'id'>): Promise<ApiResponse<Transaction>> {
            throw new NotImplementedError('createTransaction')
        },

        async updateTransaction(_id: string, _updates: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
            throw new NotImplementedError('updateTransaction')
        },

        async deleteTransaction(_id: string): Promise<ApiResponse<void>> {
            throw new NotImplementedError('deleteTransaction')
        },

        async bulkCreateTransactions(_transactions: Array<Omit<Transaction, 'id'>>): Promise<ApiResponse<Transaction[]>> {
            throw new NotImplementedError('bulkCreateTransactions')
        },

        async bulkDeleteTransactions(_ids: string[]): Promise<ApiResponse<void>> {
            throw new NotImplementedError('bulkDeleteTransactions')
        },

        // Budgets
        async getBudgets(): Promise<ApiResponse<Budget[]>> {
            throw new NotImplementedError('getBudgets')
        },

        async getBudget(_id: string): Promise<ApiResponse<Budget>> {
            throw new NotImplementedError('getBudget')
        },

        async createBudget(_budget: Omit<Budget, 'id'>): Promise<ApiResponse<Budget>> {
            throw new NotImplementedError('createBudget')
        },

        async updateBudget(_id: string, _updates: Partial<Budget>): Promise<ApiResponse<Budget>> {
            throw new NotImplementedError('updateBudget')
        },

        // Investments
        async getStockHoldings(): Promise<ApiResponse<StockHolding[]>> {
            throw new NotImplementedError('getStockHoldings')
        },

        async getPortfolioStats(): Promise<ApiResponse<PortfolioStats>> {
            throw new NotImplementedError('getPortfolioStats')
        },

        // Data Import/Export
        async uploadCSV(_file: File): Promise<ApiResponse<{ importId: string; previewData: Transaction[] }>> {
            throw new NotImplementedError('uploadCSV')
        },

        async deleteImport(_importId: string): Promise<ApiResponse<void>> {
            throw new NotImplementedError('deleteImport')
        },

        // AI Chat (future implementation)
        async sendChatMessage(_message: string, _sessionId?: string): Promise<ApiResponse<any>> {
            throw new NotImplementedError('sendChatMessage')
        }
    }
}
