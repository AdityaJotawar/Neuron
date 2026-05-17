
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

interface AssetAllocationChartProps {
    visibleWidgets: { allocation: boolean }
    assetAllocationData: any[]
}

export default function AssetAllocationChart({
    visibleWidgets,
    assetAllocationData
}: AssetAllocationChartProps) {
    if (!visibleWidgets.allocation) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current distribution</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={256}>
                    <PieChart>
                        <Pie
                            data={assetAllocationData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                            onClick={(data: any) => {
                                console.log('Filter accounts by category:', data.name)
                            }}
                            className="cursor-pointer focus:outline-none"
                        >
                            {assetAllocationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => `$${value.toLocaleString()}`}
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
