import React from 'react'

interface StatCardProps {
    title: string
    value: string | number
    change?: {
        value: number
        label: string
    }
    icon?: React.ReactNode
    className?: string
}

export default function StatCard({ title, value, change, icon, className = '' }: StatCardProps) {
    return (
        <div className={`bg-white border border-slate-200 rounded-lg p-6 ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                    {change && (
                        <p className={`text-sm mt-2 ${change.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change.value >= 0 ? '+' : ''}{change.value}% {change.label}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="text-slate-400">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}
