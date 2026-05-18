import type { ApiClient, ApiResponse } from '../client'
import type { Account, Transaction, Budget, StockHolding, PortfolioStats, DashboardStats } from '../../types'
import { mockAccounts } from './data/mockAccounts'
import { mockTransactions } from './data/mockTransactions'
import { mockBudgets } from './data/mockBudgets'
import { mockStockHoldings } from './data/mockStockHoldings'
import { calculateDashboardStats } from './data/mockDashboard'

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
        data,
        success: true,
        message
    }
}

function createErrorResponse<T>(error: string): ApiResponse<T> {
    return {
        data: null as T,
        success: false,
        error
    }
}

export function createMockApiClient(): ApiClient {
    // In-memory storage for mock data
    let accounts = [...mockAccounts]
    let transactions = [...mockTransactions]
    let budgets = [...mockBudgets]
    let stockHoldings = [...mockStockHoldings]

    return {
        // Dashboard
        async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
            await delay()
            return createSuccessResponse(calculateDashboardStats())
        },

        // Accounts
        async getAccounts(): Promise<ApiResponse<Account[]>> {
            await delay()
            return createSuccessResponse(accounts)
        },

        async getAccount(id: string): Promise<ApiResponse<Account>> {
            await delay()
            const account = accounts.find(a => a.id === id)
            if (!account) {
                return createErrorResponse('Account not found')
            }
            return createSuccessResponse(account)
        },

        async createAccount(accountData: Omit<Account, 'id'>): Promise<ApiResponse<Account>> {
            await delay()
            const newAccount: Account = {
                ...accountData,
                id: `acc_${Date.now()}`
            }
            accounts.push(newAccount)
            return createSuccessResponse(newAccount, 'Account created successfully')
        },

        async updateAccount(id: string, updates: Partial<Account>): Promise<ApiResponse<Account>> {
            await delay()
            const index = accounts.findIndex(a => a.id === id)
            if (index === -1) {
                return createErrorResponse('Account not found')
            }
            accounts[index] = { ...accounts[index], ...updates }
            return createSuccessResponse(accounts[index], 'Account updated successfully')
        },

        // Transactions
        async getTransactions(params?: {
            accountId?: string
            startDate?: Date
            endDate?: Date
            category?: string
        }): Promise<ApiResponse<Transaction[]>> {
            await delay()
            let filtered = [...transactions]

            if (params?.accountId) {
                filtered = filtered.filter(t => t.accountId === params.accountId)
            }

            if (params?.startDate) {
                filtered = filtered.filter(t => t.date >= params.startDate!)
            }

            if (params?.endDate) {
                filtered = filtered.filter(t => t.date <= params.endDate!)
            }

            if (params?.category) {
                filtered = filtered.filter(t => t.category === params.category)
            }

            return createSuccessResponse(filtered)
        },

        async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
            await delay()
            const transaction = transactions.find(t => t.id === id)
            if (!transaction) {
                return createErrorResponse('Transaction not found')
            }
            return createSuccessResponse(transaction)
        },

        async createTransaction(transactionData: Omit<Transaction, 'id'>): Promise<ApiResponse<Transaction>> {
            await delay()
            const newTransaction: Transaction = {
                ...transactionData,
                id: `txn_${Date.now()}`
            }
            transactions.push(newTransaction)
            return createSuccessResponse(newTransaction, 'Transaction created successfully')
        },

        async updateTransaction(id: string, updates: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
            await delay()
            const index = transactions.findIndex(t => t.id === id)
            if (index === -1) {
                return createErrorResponse('Transaction not found')
            }
            transactions[index] = { ...transactions[index], ...updates }
            return createSuccessResponse(transactions[index], 'Transaction updated successfully')
        },

        async deleteTransaction(id: string): Promise<ApiResponse<void>> {
            await delay()
            const index = transactions.findIndex(t => t.id === id)
            if (index === -1) {
                return createErrorResponse('Transaction not found')
            }
            transactions.splice(index, 1)
            return createSuccessResponse(undefined, 'Transaction deleted successfully')
        },

        async bulkCreateTransactions(transactionsData: Array<Omit<Transaction, 'id'>>): Promise<ApiResponse<Transaction[]>> {
            await delay()
            const newTransactions = transactionsData.map(txn => ({
                ...txn,
                id: `txn_${Date.now()}_${Math.random()}`
            }))
            transactions.push(...newTransactions)
            return createSuccessResponse(newTransactions, 'Transactions created successfully')
        },

        async bulkDeleteTransactions(ids: string[]): Promise<ApiResponse<void>> {
            await delay()
            transactions = transactions.filter(t => !ids.includes(t.id))
            return createSuccessResponse(undefined, 'Transactions deleted successfully')
        },

        // Budgets
        async getBudgets(): Promise<ApiResponse<Budget[]>> {
            await delay()
            return createSuccessResponse(budgets)
        },

        async getBudget(id: string): Promise<ApiResponse<Budget>> {
            await delay()
            const budget = budgets.find(b => b.id === id)
            if (!budget) {
                return createErrorResponse('Budget not found')
            }
            return createSuccessResponse(budget)
        },

        async createBudget(budgetData: Omit<Budget, 'id'>): Promise<ApiResponse<Budget>> {
            await delay()
            const newBudget: Budget = {
                ...budgetData,
                id: `budget_${Date.now()}`
            }
            budgets.push(newBudget)
            return createSuccessResponse(newBudget, 'Budget created successfully')
        },

        async updateBudget(id: string, updates: Partial<Budget>): Promise<ApiResponse<Budget>> {
            await delay()
            const index = budgets.findIndex(b => b.id === id)
            if (index === -1) {
                return createErrorResponse('Budget not found')
            }
            budgets[index] = { ...budgets[index], ...updates }
            return createSuccessResponse(budgets[index], 'Budget updated successfully')
        },

        // Investments
        async getStockHoldings(): Promise<ApiResponse<StockHolding[]>> {
            await delay()
            return createSuccessResponse(stockHoldings)
        },

        async getPortfolioStats(): Promise<ApiResponse<PortfolioStats>> {
            await delay()
            // Calculate mock portfolio stats
            const totalValue = stockHoldings.reduce((sum, holding) =>
                sum + (holding.quantity * holding.currentPrice), 0
            )
            const totalGainLoss = stockHoldings.reduce((sum, holding) =>
                sum + ((holding.currentPrice - holding.purchasePrice) * holding.quantity), 0
            )
            const returnPercentage = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0

            const stats: PortfolioStats = {
                totalValue,
                totalGainLoss,
                returnPercentage,
                todayChange: Math.random() * 2000 - 1000 // Random change between -1000 and +1000
            }

            return createSuccessResponse(stats)
        },

        // Data Import/Export
        async uploadCSV(_file: File): Promise<ApiResponse<{ importId: string; previewData: Transaction[] }>> {
            await delay()
            // Mock CSV upload - return preview of first 5 transactions
            const previewData = transactions.slice(0, 5)
            const importId = `import_${Date.now()}`
            return createSuccessResponse(
                { importId, previewData },
                'CSV uploaded successfully'
            )
        },

        async deleteImport(_importId: string): Promise<ApiResponse<void>> {
            await delay()
            return createSuccessResponse(undefined, 'Import deleted successfully')
        },

        // AI Chat (mock implementation)
        async sendChatMessage(message: string, sessionId?: string): Promise<ApiResponse<any>> {
            await delay(1000) // Simulate AI processing time

            // Simple mock responses based on message content
            let response = "I'm processing your request..."

            if (message.toLowerCase().includes('spending')) {
                response = "Based on your transaction data, you've spent $2,450 this month on dining and entertainment. This is 15% above your budget."
            } else if (message.toLowerCase().includes('balance')) {
                response = "Your total account balance across all connected accounts is $45,230. Your primary checking account has $12,450 available."
            } else if (message.toLowerCase().includes('budget')) {
                response = "You're currently on track with 3 out of 5 budgets. Your entertainment budget is 25% over the monthly limit."
            }

            return createSuccessResponse({
                response,
                sessionId: sessionId || `session_${Date.now()}`,
                suggestions: [
                    "Show me my spending by category",
                    "What's my net worth trend?",
                    "Help me create a budget"
                ]
            })
        }
    }
}
