import { useMemo } from 'react';
import type { Transaction } from '@/types';

export function useTransactionAnalytics(transactions: Transaction[]) {
  const pieChartData = useMemo(() => {
    if (!transactions) return [];

    const categoryTotals: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.type === 'purchase' || tx.type === 'withdrawal') {
        const category = tx.category || 'Other';
        categoryTotals[category] = (categoryTotals[category] || 0) + tx.amount;
      }
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return { pieChartData };
}
