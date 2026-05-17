// Mock React Query hooks for Account operations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockAccounts } from '@/api/mock/data/mockAccounts'
import { mockTransactions } from '@/api/mock/data/mockTransactions'
import { getAccountsWithCalculatedBalances } from '@/utils/accountBalance'
import type { Account } from '@/types'

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Fetch all accounts for the current user
// NOTE: Accounts are returned with balances calculated from transactions
export function useAccounts() {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            await delay()
            return getAccountsWithCalculatedBalances(mockAccounts, mockTransactions)
        },
    })
}

// Fetch accounts by type
export function useAccountsByType(accountType: string) {
    return useQuery({
        queryKey: ['accounts', 'type', accountType],
        queryFn: async () => {
            await delay()
            const accountsWithBalances = getAccountsWithCalculatedBalances(mockAccounts, mockTransactions)
            return accountsWithBalances.filter(account => account.accountType === accountType)
        },
    })
}

// Fetch single account by ID
export function useAccount(accountId: string | undefined) {
    return useQuery({
        queryKey: ['accounts', accountId],
        queryFn: async () => {
            if (!accountId) return null
            await delay()
            const accountsWithBalances = getAccountsWithCalculatedBalances(mockAccounts, mockTransactions)
            return accountsWithBalances.find(account => account.id === accountId) || null
        },
        enabled: !!accountId,
    })
}

// Create new account
export function useCreateAccount() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
            await delay()
            const newAccount: Account = {
                ...account,
                id: `mock-${Date.now()}`,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            mockAccounts.push(newAccount)
            return newAccount
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
    })
}

// Update account
export function useUpdateAccount() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Account> }) => {
            await delay()
            const accountIndex = mockAccounts.findIndex((account: Account) => account.id === id)
            if (accountIndex === -1) {
                throw new Error('Account not found')
            }
            const updatedAccount = {
                ...mockAccounts[accountIndex],
                ...updates,
                updatedAt: new Date(),
            }
            mockAccounts[accountIndex] = updatedAccount
            return updatedAccount
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
            queryClient.invalidateQueries({ queryKey: ['accounts', data.id] })
        },
    })
}

// Delete account
export function useDeleteAccount() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (accountId: string) => {
            await delay()
            const accountIndex = mockAccounts.findIndex((account: Account) => account.id === accountId)
            if (accountIndex === -1) {
                throw new Error('Account not found')
            }
            mockAccounts.splice(accountIndex, 1)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
    })
}
