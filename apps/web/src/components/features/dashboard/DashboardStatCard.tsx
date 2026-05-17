import React from 'react'
import { Card } from '../../ui/Card.tsx'
import { cn } from '../../../utils/index.ts'
import { formatCurrency, formatPercent } from '../../../utils/index.ts'

interface StatCardProps {
  label: string
  value: number | string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  format?: 'currency' | 'percent' | 'number'
  actions?: React.ReactNode
  sparklineData?: number[]
  trend?: 'up' | 'down' | 'neutral'
}

export default function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  format = 'currency',
  actions,
  sparklineData,
  trend,
}: StatCardProps) {
  const formattedValue =
    format === 'currency'
      ? typeof value === 'number'
        ? formatCurrency(value)
        : value
      : format === 'percent'
        ? typeof value === 'number'
          ? formatPercent(value)
          : value
        : value

  // Generate SVG path for sparkline
  const generateSparklinePath = (data: number[]) => {
    if (!data || data.length === 0) return ''

    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const width = 60
    const height = 20
    const stepX = width / (data.length - 1)

    const points = data.map((value, index) => {
      const x = index * stepX
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })

    return `M ${points.join(' L ')}`
  }

  const sparklineColor = trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#64748B'

  return (
    <Card className="bg-slate-50 p-5 stat-card">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <div className="flex-1">
          <p className="text-3xl font-semibold text-slate-900 font-mono mb-1">{formattedValue}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              <span
                className={cn('font-medium', {
                  'text-emerald-600': change > 0,
                  'text-red-600': change < 0,
                  'text-slate-600': change === 0,
                })}
              >
                {formatPercent(change)}
              </span>
              {changeLabel && <span className="text-slate-500">{changeLabel}</span>}
            </div>
          )}
          {sparklineData && sparklineData.length > 0 && (
            <div className="mt-2">
              <svg width="60" height="20" className="opacity-60">
                <path
                  d={generateSparklinePath(sparklineData)}
                  fill="none"
                  stroke={sparklineColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
        {actions && <div className="mb-1">{actions}</div>}
      </div>
    </Card>
  )
}
