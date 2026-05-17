// Mock API client for accounts
import type { ApiResponse, AccountResponse, AccountQueryParams } from '../types'
import { mockAccounts } from './data/mockAccounts'
import { mockTransactions } from './data/mockTransactions'
import { getAccountsWithCalculatedBalances } from '../../utils/accountBalance'

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Convert Account to AccountResponse (Date -> string)
function accountToResponse(account: any): AccountResponse {
    return {
        ...account,
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
        loanDetails: account.loanDetails ? {
            ...account.loanDetails,
            payoffDate: account.loanDetails.payoffDate.toISOString()
        } : undefined,
        propertyDetails: account.propertyDetails ? {
            ...account.propertyDetails,
            purchaseDate: account.propertyDetails.purchaseDate.toISOString()
        } : undefined
    }
}

export async function getAccounts(params?: AccountQueryParams): Promise<ApiResponse<AccountResponse[]>> {
    await delay()

    let accounts = getAccountsWithCalculatedBalances(mockAccounts, mockTransactions)

    // Apply filters
    if (params?.type) {
        accounts = accounts.filter(account => account.accountType === params.type)
    }

    return {
        data: accounts.map(accountToResponse),
        success: true
    }
}

export async function getAccount(id: string): Promise<ApiResponse<AccountResponse>> {
    await delay()

    const accounts = getAccountsWithCalculatedBalances(mockAccounts, mockTransactions)
    const account = accounts.find(acc => acc.id === id)

    if (!account) {
        return {
            data: null as any,
            success: false,
            error: 'Account not found'
        }
    }

    return {
        data: accountToResponse(account),
        success: true
    }
}

export async function createAccount(accountData: Omit<AccountResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AccountResponse>> {
    await delay()

    const newAccount = {
        ...accountData,
        id: `mock-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    mockAccounts.push(newAccount as any)

    return {
        data: accountToResponse(newAccount),
        success: true
    }
}

export async function updateAccount(id: string, updates: Partial<AccountResponse>): Promise<ApiResponse<AccountResponse>> {
    await delay()

    const accountIndex = mockAccounts.findIndex(acc => acc.id === id)
    if (accountIndex === -1) {
        return {
            data: null as any,
            success: false,
            error: 'Account not found'
        }
    }

    const updatedAccount = {
        ...mockAccounts[accountIndex],
        ...updates,
        updatedAt: new Date()
    }

    mockAccounts[accountIndex] = updatedAccount as any

    return {
        data: accountToResponse(updatedAccount),
        success: true
    }
}