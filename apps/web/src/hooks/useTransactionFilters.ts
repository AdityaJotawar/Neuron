import { useState, useMemo } from 'react';
import type { Transaction } from '@/types';

export function useTransactionFilters(transactions: Transaction[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filteredTransactions = useMemo(() => {
    let result = [...(transactions || [])];

    if (searchQuery) {
      result = result.filter(t =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedAccountId) {
      result = result.filter(t => t.accountId === selectedAccountId);
    }

    if (selectedType) {
      result = result.filter(t => t.type === selectedType);
    }

    // Apply date range filter
    const now = new Date();
    const daysBack = parseInt(dateRange);
    if (daysBack > 0) {
      const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
      result = result.filter(t => new Date(t.date) >= cutoffDate);
    }

    // Apply sorting
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'amount') {
      result.sort((a, b) => b.amount - a.amount);
    }

    return result;
  }, [transactions, searchQuery, dateRange, selectedAccountId, selectedType, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setDateRange('30');
    setSelectedAccountId('');
    setSelectedType('');
    setSortBy('date');
  };

  return {
    filters: { searchQuery, dateRange, selectedAccountId, selectedType, sortBy },
    setters: { setSearchQuery, setDateRange, setSelectedAccountId, setSelectedType, setSortBy, resetFilters },
    filteredTransactions,
  };
}
