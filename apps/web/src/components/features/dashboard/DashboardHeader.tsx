import { Clock, Settings, RefreshCw } from 'lucide-react'

type WidgetKey = 'stats' | 'quickActions' | 'healthScore' | 'alerts' | 'accounts' | 'netWorth' | 'allocation' | 'expenses' | 'portfolio' | 'savingsGoals' | 'cashFlow'

interface DashboardHeaderProps {
    autoRefreshInterval: number
    onAutoRefreshIntervalChange: (interval: number) => void
    showCustomizeMenu: boolean
    onCustomizeMenuToggle: () => void
    visibleWidgets: Record<WidgetKey, boolean>
    toggleWidget: (key: WidgetKey) => void
    onRefresh: () => void
    isRefreshing: boolean
}

export default function DashboardHeader({
    autoRefreshInterval,
    onAutoRefreshIntervalChange,
    showCustomizeMenu,
    onCustomizeMenuToggle,
    visibleWidgets,
    toggleWidget,
    onRefresh,
    isRefreshing
}: DashboardHeaderProps) {
    return (
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600 mt-1">Welcome back! Here's your financial overview.</p>
            </div>
            <div className="flex items-center gap-2">
                {/* Auto-refresh Control */}
                <div className="relative group">
                    <button
                        className={`p-2 transition-colors rounded-full hover:bg-slate-100 ${autoRefreshInterval > 0 ? 'text-primary-600 bg-primary-50' : 'text-slate-600'}`}
                        title="Auto-refresh Settings"
                        onClick={() => onAutoRefreshIntervalChange(autoRefreshInterval === 0 ? 5 : autoRefreshInterval === 5 ? 15 : autoRefreshInterval === 15 ? 30 : 0)}
                    >
                        <Clock className="w-5 h-5" />
                        {autoRefreshInterval > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] text-white">
                                {autoRefreshInterval}
                            </span>
                        )}
                    </button>
                </div>

                {/* Customize Toggle */}
                <div className="relative">
                    <button
                        onClick={onCustomizeMenuToggle}
                        className={`p-2 text-slate-600 hover:text-primary-600 transition-colors rounded-full hover:bg-slate-100 ${showCustomizeMenu ? 'bg-slate-100 text-primary-600' : ''}`}
                        title="Customize Dashboard"
                    >
                        <Settings className="w-5 h-5" />
                    </button>

                    {showCustomizeMenu && (
                        <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-lg border border-slate-200 p-4 z-50">
                            <h3 className="font-semibold text-slate-900 mb-3">Visible Widgets</h3>
                            <div className="space-y-2">
                                {Object.entries(visibleWidgets).map(([key, isVisible]) => (
                                    <label key={key} className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <input
                                            type="checkbox"
                                            checked={isVisible}
                                            onChange={() => toggleWidget(key as WidgetKey)}
                                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={onRefresh}
                    className={`p-2 text-slate-600 hover:text-primary-600 transition-colors rounded-full hover:bg-slate-100 ${isRefreshing ? 'animate-spin' : ''}`}
                    title="Refresh Dashboard"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
