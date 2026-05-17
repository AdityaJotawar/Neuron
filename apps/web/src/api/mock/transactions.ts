// Mock API client for transactions
import type { ApiResponse, TransactionResponse, TransactionQueryParams } from '../types'
import { mockTransactions } from './data/mockTransactions'

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Convert Transaction to TransactionResponse (Date -> string)
function transactionToResponse(transaction: any): TransactionResponse {
    return {
        ...transaction,
        date: transaction.date.toISOString(),
        createdAt: transaction.createdAt.toISOString()
    }
}

export async function getTransactions(params?: TransactionQueryParams): Promise<ApiResponse<TransactionResponse[]>> {
    await delay()

    let transactions = [...mockTransactions]

    // Apply filters
    if (params?.accountId) {
        transactions = transactions.filter(t => t.accountId === params.accountId)
    }
    if (params?.category) {
        transactions = transactions.filter(t => t.category === params.category)
    }
    if (params?.startDate) {
        const startDate = new Date(params.startDate)
        transactions = transactions.filter(t => new Date(t.date) >= startDate)
    }
    if (params?.endDate) {
        const endDate = new Date(params.endDate)
        transactions = transactions.filter(t => new Date(t.date) <= endDate)
    }

    return {
        data: transactions.map(transactionToResponse),
        success: true
    }
}

export async function getTransaction(id: string): Promise<ApiResponse<TransactionResponse>> {
    await delay()

    const transaction = mockTransactions.find(t => t.id === id)

    if (!transaction) {
        return {
            data: null as any,
            success: false,
            error: 'Transaction not found'
        }
    }

    return {
        data: transactionToResponse(transaction),
        success: true
    }
}

export async function createTransaction(transactionData: Omit<TransactionResponse, 'id' | 'createdAt'>): Promise<ApiResponse<TransactionResponse>> {
    await delay()

    const newTransaction = {
        ...transactionData,
        id: `mock-${Date.now()}`,
        createdAt: new Date()
    }

    mockTransactions.push(newTransaction as any)

    return {
        data: transactionToResponse(newTransaction),
        success: true
    }
}

export async function updateTransaction(id: string, updates: Partial<TransactionResponse>): Promise<ApiResponse<TransactionResponse>> {
    await delay()

    const transactionIndex = mockTransactions.findIndex(t => t.id === id)
    if (transactionIndex === -1) {
        return {
            data: null as any,
            success: false,
            error: 'Transaction not found'
        }
    }

    const updatedTransaction = {
        ...mockTransactions[transactionIndex],
        ...updates
    }

    mockTransactions[transactionIndex] = updatedTransaction as any

    return {
        data: transactionToResponse(updatedTransaction),
        success: true
    }
}