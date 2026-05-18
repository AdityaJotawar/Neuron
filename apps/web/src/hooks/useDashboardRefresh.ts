import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/constants';

export function useDashboardRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0);
  const queryClient = useQueryClient();

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate dashboard-related queries
      await queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.accounts 
      });
      await queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.transactions 
      });
      await queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.stockHoldings 
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const onAutoRefreshIntervalChange = (interval: number) => {
    setAutoRefreshInterval(interval);
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;

    const timer = setInterval(() => {
      onRefresh();
    }, autoRefreshInterval * 1000);

    return () => clearInterval(timer);
  }, [autoRefreshInterval]);

  return {
    isRefreshing,
    autoRefreshInterval,
    onAutoRefreshIntervalChange,
    onRefresh,
  };
}
