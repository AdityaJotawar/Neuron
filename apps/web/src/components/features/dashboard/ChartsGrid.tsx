
import NetWorthChart from './NetWorthChart.tsx'
import AssetAllocationChart from './AssetAllocationChart.tsx'
import MonthlyExpensesChart from './MonthlyExpensesChart.tsx'
import PortfolioPerformanceChart from './PortfolioPerformanceChart.tsx'

interface NetWorthData {
    month: string
    value: number | null
    forecastValue?: number | null
}

interface PortfolioData {
    month: string
    value: number
}

interface ChartsGridProps {
    visibleWidgets: {
        netWorth: boolean
        allocation: boolean
        expenses: boolean
        portfolio: boolean
    }
    filteredNetWorthData: NetWorthData[]
    netWorthTimeRange: string
    netWorthChartType: 'area' | 'bar'
    showForecast: boolean
    onNetWorthTimeRangeChange: (range: string) => void
    onNetWorthChartTypeChange: (type: 'area' | 'bar') => void
    onForecastToggle: () => void
    assetAllocationData: any[]
    monthlyExpensesData: any[]
    filteredPortfolioData: PortfolioData[]
    portfolioTimeRange: string
    portfolioChartType: 'line' | 'bar'
    onPortfolioTimeRangeChange: (range: string) => void
    onPortfolioChartTypeChange: (type: 'line' | 'bar') => void
}

export default function ChartsGrid({
    visibleWidgets,
    filteredNetWorthData,
    netWorthTimeRange,
    netWorthChartType,
    showForecast,
    onNetWorthTimeRangeChange,
    onNetWorthChartTypeChange,
    onForecastToggle,
    assetAllocationData,
    monthlyExpensesData,
    filteredPortfolioData,
    portfolioTimeRange,
    portfolioChartType,
    onPortfolioTimeRangeChange,
    onPortfolioChartTypeChange
}: ChartsGridProps) {
    // Check if any charts are visible
    const hasVisibleCharts = visibleWidgets.netWorth || visibleWidgets.allocation || visibleWidgets.expenses || visibleWidgets.portfolio

    if (!hasVisibleCharts) return null

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NetWorthChart
                visibleWidgets={{ netWorth: visibleWidgets.netWorth }}
                filteredNetWorthData={filteredNetWorthData}
                netWorthTimeRange={netWorthTimeRange}
                netWorthChartType={netWorthChartType}
                showForecast={showForecast}
                onNetWorthTimeRangeChange={onNetWorthTimeRangeChange}
                onNetWorthChartTypeChange={onNetWorthChartTypeChange}
                onForecastToggle={onForecastToggle}
            />

            <AssetAllocationChart
                visibleWidgets={{ allocation: visibleWidgets.allocation }}
                assetAllocationData={assetAllocationData}
            />

            <MonthlyExpensesChart
                visibleWidgets={{ expenses: visibleWidgets.expenses }}
                monthlyExpensesData={monthlyExpensesData}
            />

            <PortfolioPerformanceChart
                visibleWidgets={{ portfolio: visibleWidgets.portfolio }}
                filteredPortfolioData={filteredPortfolioData}
                portfolioTimeRange={portfolioTimeRange}
                portfolioChartType={portfolioChartType}
                onPortfolioTimeRangeChange={onPortfolioTimeRangeChange}
                onPortfolioChartTypeChange={onPortfolioChartTypeChange}
            />
        </div>
    )
}
