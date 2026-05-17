
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts'

interface MonthlyExpensesData {
    category: string
    amount: number
    budget: number
}

interface MonthlyExpensesChartProps {
    visibleWidgets: { expenses: boolean }
    monthlyExpensesData: MonthlyExpensesData[]
}

export default function MonthlyExpensesChart({
    visibleWidgets,
    monthlyExpensesData
}: MonthlyExpensesChartProps) {
    if (!visibleWidgets.expenses) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
                <CardDescription>By category</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[256px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={monthlyExpensesData}
                            layout="vertical"
                            margin={{ left: 40 }}
                            onClick={(data: any) => {
                                if (data && data.activePayload) {
                                    console.log('View transactions for category:', data.activePayload[0].payload.category)
                                }
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="category"
                                type="category"
                                stroke="#64748B"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: '#F1F5F9' }}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                }}
                                formatter={(value: number, _name: string, props: any) => {
                                    const budget = props.payload.budget
                                    const percentage = ((value / budget) * 100).toFixed(1)
                                    return [
                                        <div key="tooltip" className="space-y-1">
                                            <div className="font-medium text-slate-900">${value.toLocaleString()}</div>
                                            <div className="text-xs text-slate-500">
                                                of ${budget.toLocaleString()} budget ({percentage}%)
                                            </div>
                                        </div>,
                                        '',
                                    ]
                                }}
                            />
                            <Bar dataKey="amount" fill="#3B82F6" radius={4} barSize={20} background={{ fill: '#F1F5F9', radius: 4 }} className="cursor-pointer" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
