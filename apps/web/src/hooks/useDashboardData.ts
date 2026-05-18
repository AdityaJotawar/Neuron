import { useMemo } from 'react';
import { useAccounts } from './useAccounts';
import { useTransactions } from './useTransactions';
import { useStockHoldings } from './useStockHoldings';
import { calculateDashboardStats, statSparklineData } from '@/api/mock/data/mockDashboard';

export function useDashboardData() {
  const { data: accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { data: transactions, isLoading: isLoadingTransactions } = useTransactions();
  const { data: stockHoldings, isLoading: isLoadingHoldings } = useStockHoldings();

  const stats = useMemo(() => {
    if (!accounts || !transactions) return undefined;
    return calculateDashboardStats();
  }, [accounts, transactions, stockHoldings]);

  const isLoading = isLoadingAccounts || isLoadingTransactions || isLoadingHoldings;

  return {
    accounts,
    transactions,
    stockHoldings,
    stats,
    statSparklineData,
    isLoading,
  };
}
