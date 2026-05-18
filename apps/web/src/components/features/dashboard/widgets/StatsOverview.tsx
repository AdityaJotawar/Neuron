import { TrendingUp, BarChart3, TrendingDown, ArrowUpDown, Plus, Eye } from 'lucide-react'
import StatCard from '../DashboardStatCard'

interface StatsData {
    netWorth: number
    netWorthChange: number
    totalAssets: number
    assetsChange: number
    totalLiabilities: number
    liabilitiesChange: number
    monthlyCashFlow: number
}

interface SparklineData {
    netWorth: number[]
    totalAssets: number[]
    totalLiabilities: number[]
    monthlyCashFlow: number[]
}

interface StatsOverviewProps {
    visibleWidgets: { stats: boolean }
    stats: StatsData
    statSparklineData: SparklineData
    onAddTransaction: () => void
}

export default function StatsOverview({
    visibleWidgets,
    stats,
    statSparklineData,
    onAddTransaction
}: StatsOverviewProps) {
    if (!visibleWidgets.stats) return null

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                label="Net Worth"
                value={stats.netWorth}
                change={stats.netWorthChange}
                changeLabel="vs last month"
                icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
                sparklineData={statSparklineData.netWorth}
                trend="up"
                actions={
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700">
                        View Details
                    </button>
                }
            />
            <StatCard
                label="Total Assets"
                value={stats.totalAssets}
                change={stats.assetsChange}
                changeLabel="vs last month"
                icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
                sparklineData={statSparklineData.totalAssets}
                trend="up"
                actions={
                    <button className="p-1 text-slate-400 hover:text-primary-600 rounded-full hover:bg-slate-100">
                        <Eye className="w-4 h-4" />
                    </button>
                }
            />
            <StatCard
                label="Total Liabilities"
                value={stats.totalLiabilities}
                change={stats.liabilitiesChange}
                changeLabel="vs last month"
                icon={<TrendingDown className="w-5 h-5 text-red-500" />}
                sparklineData={statSparklineData.totalLiabilities}
                trend="neutral"
                actions={
                    <button className="p-1 text-slate-400 hover:text-primary-600 rounded-full hover:bg-slate-100">
                        <Eye className="w-4 h-4" />
                    </button>
                }
            />
            <StatCard
                label="Monthly Cash Flow"
                value={`+$${stats.monthlyCashFlow.toFixed(2)}`}
                icon={<ArrowUpDown className="w-5 h-5 text-purple-500" />}
                format="number"
                sparklineData={statSparklineData.monthlyCashFlow}
                trend="up"
                actions={
                    <button
                        onClick={onAddTransaction}
                        className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded-full"
                    >
                        <Plus className="w-3 h-3" /> Add
                    </button>
                }
            />
        </div>
    )
}
