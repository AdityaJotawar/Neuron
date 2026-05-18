import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * UI-only store for financial app state.
 * All server data (accounts, transactions, budgets, stock holdings, portfolio stats)
 * is owned and managed by React Query. This store only manages UI state.
 */

interface FinancialUIState {
  selectedAccountId: string | null
  setSelectedAccount: (id: string | null) => void
}

export const useFinancialStore = create<FinancialUIState>()(
  devtools(
    (set) => ({
      selectedAccountId: null,
      setSelectedAccount: (id) => set({ selectedAccountId: id }),
    }),
    {
      name: 'financial-ui-store',
    }
  )
)
