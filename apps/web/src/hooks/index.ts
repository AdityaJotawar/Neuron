// hooks/index.ts — Single barrel re-exporting mock hooks
// When ready to connect to real backend:
//   1. Set VITE_USE_MOCK=false in .env
//   2. Swap all `from '@/mocks/hooks/...'` → `from './use...'`

// ==================== ACCOUNT HOOKS ====================
export {
  useAccounts,
  useAccountsByType,
  useAccount,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from '@/mocks/hooks/useAccountsMock'

// ==================== TRANSACTION HOOKS ====================
export {
  useTransactions,
  useTransaction,
  useRecentTransactions,
  useTransactionsByCategory,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useDeleteImport,
  useBulkDeleteTransactions,
  useBulkCreateTransactions,
} from '@/mocks/hooks/useTransactionsMock'

// ==================== STOCK HOLDINGS HOOKS ====================
export {
  useStockHoldings,
  useStockHoldingsByAccount,
  usePortfolioPerformance,
  useStockPrice,
  useCreateStockHolding,
  useUpdateStockHolding,
  useDeleteStockHolding,
  useUpdateStockPrices,
} from '@/mocks/hooks/useStockHoldingsMock'

// ==================== BUDGET HOOKS ====================
export {
  useBudgets,
  useActiveBudgets,
  useBudgetComparison,
  useBudgetsByCategory,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from '@/mocks/hooks/useBudgetsMock'

// ==================== DASHBOARD HOOK ====================
export { useDashboard } from './useDashboard'
