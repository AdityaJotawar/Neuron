import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Account, Transaction, Budget, StockHolding, PortfolioStats } from '../types'

interface FinancialState {
    // Data
    accounts: Account[]
    transactions: Transaction[]
    budgets: Budget[]
    stockHoldings: StockHolding[]
    portfolioStats: PortfolioStats | null

    // UI State
    isLoading: boolean
    error: string | null
    selectedAccountId: string | null

    // Actions
    setAccounts: (accounts: Account[]) => void
    addAccount: (account: Account) => void
    updateAccount: (id: string, updates: Partial<Account>) => void
    removeAccount: (id: string) => void

    setTransactions: (transactions: Transaction[]) => void
    addTransaction: (transaction: Transaction) => void
    updateTransaction: (id: string, updates: Partial<Transaction>) => void
    removeTransaction: (id: string) => void

    setBudgets: (budgets: Budget[]) => void
    addBudget: (budget: Budget) => void
    updateBudget: (id: string, updates: Partial<Budget>) => void
    removeBudget: (id: string) => void

    setStockHoldings: (holdings: StockHolding[]) => void
    addStockHolding: (holding: StockHolding) => void
    updateStockHolding: (id: string, updates: Partial<StockHolding>) => void
    removeStockHolding: (id: string) => void

    setPortfolioStats: (stats: PortfolioStats) => void

    // UI Actions
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setSelectedAccount: (accountId: string | null) => void
    clearAll: () => void
}

export const useFinancialStore = create<FinancialState>()(
    devtools(
        (set) => ({
            // Initial state
            accounts: [],
            transactions: [],
            budgets: [],
            stockHoldings: [],
            portfolioStats: null,
            isLoading: false,
            error: null,
            selectedAccountId: null,

            // Account actions
            setAccounts: (accounts) => set({ accounts }),
            addAccount: (account) => set((state) => ({
                accounts: [...state.accounts, account]
            })),
            updateAccount: (id, updates) => set((state) => ({
                accounts: state.accounts.map(account =>
                    account.id === id ? { ...account, ...updates } : account
                )
            })),
            removeAccount: (id) => set((state) => ({
                accounts: state.accounts.filter(account => account.id !== id),
                selectedAccountId: state.selectedAccountId === id ? null : state.selectedAccountId
            })),

            // Transaction actions
            setTransactions: (transactions) => set({ transactions }),
            addTransaction: (transaction) => set((state) => ({
                transactions: [transaction, ...state.transactions]
            })),
            updateTransaction: (id, updates) => set((state) => ({
                transactions: state.transactions.map(transaction =>
                    transaction.id === id ? { ...transaction, ...updates } : transaction
                )
            })),
            removeTransaction: (id) => set((state) => ({
                transactions: state.transactions.filter(transaction => transaction.id !== id)
            })),

            // Budget actions
            setBudgets: (budgets) => set({ budgets }),
            addBudget: (budget) => set((state) => ({
                budgets: [...state.budgets, budget]
            })),
            updateBudget: (id, updates) => set((state) => ({
                budgets: state.budgets.map(budget =>
                    budget.id === id ? { ...budget, ...updates } : budget
                )
            })),
            removeBudget: (id) => set((state) => ({
                budgets: state.budgets.filter(budget => budget.id !== id)
            })),

            // Stock holding actions
            setStockHoldings: (holdings) => set({ stockHoldings: holdings }),
            addStockHolding: (holding) => set((state) => ({
                stockHoldings: [...state.stockHoldings, holding]
            })),
            updateStockHolding: (id, updates) => set((state) => ({
                stockHoldings: state.stockHoldings.map(holding =>
                    holding.id === id ? { ...holding, ...updates } : holding
                )
            })),
            removeStockHolding: (id) => set((state) => ({
                stockHoldings: state.stockHoldings.filter(holding => holding.id !== id)
            })),

            // Portfolio stats
            setPortfolioStats: (stats) => set({ portfolioStats: stats }),

            // UI actions
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            setSelectedAccount: (accountId) => set({ selectedAccountId: accountId }),

            clearAll: () => set({
                accounts: [],
                transactions: [],
                budgets: [],
                stockHoldings: [],
                portfolioStats: null,
                isLoading: false,
                error: null,
                selectedAccountId: null
            })
        }),
        {
            name: 'financial-store'
        }
    )
)
