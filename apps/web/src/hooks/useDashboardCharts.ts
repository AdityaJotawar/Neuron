import { useState, useMemo } from 'react';
import { assetAllocationData, monthlyExpensesData, portfolioPerformanceData } from '@/api/mock/data/mockDashboard';
import type { useDashboardData } from './useDashboardData';

export function useDashboardCharts(data: ReturnType<typeof useDashboardData>) {
  const [netWorthTimeRange, setNetWorthTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'all'>('1Y');
  const [portfolioTimeRange, setPortfolioTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'all'>('1Y');
  const [netWorthChartType, setNetWorthChartType] = useState<'area' | 'bar'>('area');
  const [portfolioChartType, setPortfolioChartType] = useState<'line' | 'bar'>('line');
  const [showForecast, setShowForecast] = useState(true);

  // Helper to filter data by time range
  const filterByTimeRange = (fullData: any[], range: string) => {
    if (range === 'all') return fullData;
    // Implement time range filtering logic based on your mock data structure
    return fullData;
  };

  const filteredNetWorthData = useMemo(
    () => filterByTimeRange(data.statSparklineData?.netWorth || [], netWorthTimeRange),
    [data.statSparklineData?.netWorth, netWorthTimeRange, showForecast]
  );

  const filteredPortfolioData = useMemo(
    () => filterByTimeRange(portfolioPerformanceData, portfolioTimeRange),
    [portfolioTimeRange]
  );

  return {
    filteredNetWorthData,
    netWorthTimeRange,
    onNetWorthTimeRangeChange: (range: string) => setNetWorthTimeRange(range as any),
    netWorthChartType,
    onNetWorthChartTypeChange: (type: string) => setNetWorthChartType(type as 'area' | 'bar'),
    showForecast,
    onForecastToggle: () => setShowForecast(prev => !prev),
    assetAllocationData,
    monthlyExpensesData,
    filteredPortfolioData,
    portfolioTimeRange,
    onPortfolioTimeRangeChange: (range: string) => setPortfolioTimeRange(range as any),
    portfolioChartType,
    onPortfolioChartTypeChange: (type: string) => setPortfolioChartType(type as 'line' | 'bar'),
    // Keep old names for backward compatibility
    setNetWorthTimeRange,
    setNetWorthChartType,
    setShowForecast,
    setPortfolioTimeRange,
    setPortfolioChartType,
  };
}
