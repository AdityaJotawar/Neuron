
import { TrendingUp, BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
} from 'recharts'

interface NetWorthData {
    month: string
    value: number | null
    forecastValue?: number | null
}

interface NetWorthChartProps {
    visibleWidgets: { netWorth: boolean }
    filteredNetWorthData: NetWorthData[]
    netWorthTimeRange: string
    netWorthChartType: 'area' | 'bar'
    showForecast: boolean
    setNetWorthTimeRange: (range: string) => void
    setNetWorthChartType: (type: 'area' | 'bar') => void
    setShowForecast: (show: boolean) => void
}

export default function NetWorthChart({
    visibleWidgets,
    filteredNetWorthData,
    netWorthTimeRange,
    netWorthChartType,
    showForecast,
    setNetWorthTimeRange,
    setNetWorthChartType,
    setShowForecast
}: NetWorthChartProps) {
    if (!visibleWidgets.netWorth) return null

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Net Worth Trend</CardTitle>
                        <CardDescription>Last {netWorthTimeRange === '12M' ? '12' : netWorthTimeRange === '6M' ? '6' : '3'} months</CardDescription>
                    </div>
                    <Select
                        value={netWorthTimeRange}
                        onChange={setNetWorthTimeRange}
                        options={[
                            { value: '3M', label: '3 Months' },
                            { value: '6M', label: '6 Months' },
                            { value: '12M', label: '12 Months' },
                        ]}
                    />
                    <div className="flex bg-slate-100 rounded-lg p-1 ml-2">
                        <button
                            onClick={() => setShowForecast(!showForecast)}
                            className={`p-1 rounded ${showForecast ? 'bg-white shadow text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Toggle Forecast"
                        >
                            <TrendingUp className={`w-4 h-4 ${showForecast ? 'text-primary-600' : ''}`} />
                        </button>
                        <div className="w-px bg-slate-200 mx-1" />
                        <button
                            onClick={() => setNetWorthChartType('area')}
                            className={`p-1 rounded ${netWorthChartType === 'area' ? 'bg-white shadow text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Area Chart"
                        >
                            <TrendingUp className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setNetWorthChartType('bar')}
                            className={`p-1 rounded ${netWorthChartType === 'bar' ? 'bg-white shadow text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Bar Chart"
                        >
                            <BarChart3 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={256}>
                    {netWorthChartType === 'area' ? (
                        <AreaChart data={filteredNetWorthData} onClick={(data: any) => {
                            if (data && data.activePayload) {
                                console.log('Drill down to Net Worth details:', data.activePayload[0].payload)
                            }
                        }}>
                            <defs>
                                <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net Worth']}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#10B981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorNetWorth)"
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            {showForecast && (
                                <Area
                                    type="monotone"
                                    dataKey="forecastValue"
                                    stroke="#8B5CF6"
                                    strokeDasharray="5 5"
                                    strokeWidth={2}
                                    fillOpacity={0.1}
                                    fill="#8B5CF6"
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            )}
                        </AreaChart>
                    ) : (
                        <BarChart data={filteredNetWorthData} onClick={(data: any) => {
                            if (data && data.activePayload) {
                                console.log('Drill down to Net Worth details:', data.activePayload[0].payload)
                            }
                        }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                }}
                                formatter={(value: number, name: string) => [
                                    `$${value.toLocaleString()}`,
                                    name === 'forecastValue' ? 'Forecast' : 'Net Worth'
                                ]}
                            />
                            <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} />
                            {showForecast && <Bar dataKey="forecastValue" fill="#8B5CF6" radius={[8, 8, 0, 0]} />}
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
