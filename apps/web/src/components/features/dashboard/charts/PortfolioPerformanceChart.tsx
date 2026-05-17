
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
} from 'recharts'

interface PortfolioData {
    month: string
    value: number
}

interface PortfolioPerformanceChartProps {
    visibleWidgets: { portfolio: boolean }
    filteredPortfolioData: PortfolioData[]
    portfolioTimeRange: string
    portfolioChartType: 'line' | 'bar'
    setPortfolioTimeRange: (range: string) => void
    setPortfolioChartType: (type: 'line' | 'bar') => void
}

export default function PortfolioPerformanceChart({
    visibleWidgets,
    filteredPortfolioData,
    portfolioTimeRange,
    portfolioChartType,
    setPortfolioTimeRange,
    setPortfolioChartType
}: PortfolioPerformanceChartProps) {
    if (!visibleWidgets.portfolio) return null

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Portfolio Performance</CardTitle>
                        <CardDescription>Last {portfolioTimeRange === '12M' ? '12' : portfolioTimeRange === '6M' ? '6' : '3'} months</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={portfolioTimeRange}
                            onChange={(e) => setPortfolioTimeRange(e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="12M">12 Months</option>
                            <option value="6M">6 Months</option>
                            <option value="3M">3 Months</option>
                        </select>
                        <span className="text-2xl font-semibold text-emerald-600 font-mono">+18.3%</span>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => setPortfolioChartType('line')}
                                className={`p-1 rounded ${portfolioChartType === 'line' ? 'bg-white shadow text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                                title="Line Chart"
                            >
                                <LineChartIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPortfolioChartType('bar')}
                                className={`p-1 rounded ${portfolioChartType === 'bar' ? 'bg-white shadow text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                                title="Bar Chart"
                            >
                                <BarChart3 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={256}>
                    {portfolioChartType === 'line' ? (
                        <LineChart data={filteredPortfolioData} onClick={(data: any) => {
                            if (data && data.activePayload) {
                                console.log('View portfolio details for:', data.activePayload[0].payload.month)
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
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#8B5CF6"
                                strokeWidth={2}
                                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    ) : (
                        <BarChart data={filteredPortfolioData} onClick={(data: any) => {
                            if (data && data.activePayload) {
                                console.log('View portfolio details for:', data.activePayload[0].payload.month)
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
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                            />
                            <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
