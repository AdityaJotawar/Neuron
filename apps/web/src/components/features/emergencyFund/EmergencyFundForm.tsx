// EmergencyFund feature — placeholder implementation
// TODO: Complete this feature when the backend/types are ready
import React from 'react'

export interface EmergencyFund {
    id: string
    userId: string
    targetAmount: number
    currentAmount: number
    monthlyContribution: number
    startDate: Date
    targetDate: Date
    status: 'on-track' | 'behind' | 'achieved'
    priority: 'low' | 'medium' | 'high'
    createdAt: Date
    updatedAt: Date
}

interface EmergencyFundFormProps {
    fund?: EmergencyFund
    onSubmit: (fund: EmergencyFund) => void
}

export function EmergencyFundForm({ fund, onSubmit }: EmergencyFundFormProps) {
    const [targetAmount, setTargetAmount] = React.useState(fund?.targetAmount ?? 15000)
    const [currentAmount, setCurrentAmount] = React.useState(fund?.currentAmount ?? 0)
    const [monthlyContribution, setMonthlyContribution] = React.useState(fund?.monthlyContribution ?? 500)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            id: fund?.id ?? `ef-${Date.now()}`,
            userId: fund?.userId ?? 'user1',
            targetAmount,
            currentAmount,
            monthlyContribution,
            startDate: fund?.startDate ?? new Date(),
            targetDate: fund?.targetDate ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            status: 'on-track',
            priority: 'high',
            createdAt: fund?.createdAt ?? new Date(),
            updatedAt: new Date(),
        })
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {fund ? 'Edit Emergency Fund' : 'Set Up Emergency Fund'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="targetAmount" className="block text-sm font-medium text-slate-700 mb-1">
                        Target Amount
                    </label>
                    <input
                        id="targetAmount"
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="15000"
                    />
                </div>
                <div>
                    <label htmlFor="currentAmount" className="block text-sm font-medium text-slate-700 mb-1">
                        Current Savings
                    </label>
                    <input
                        id="currentAmount"
                        type="number"
                        value={currentAmount}
                        onChange={(e) => setCurrentAmount(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="0"
                    />
                </div>
                <div>
                    <label htmlFor="monthlyContribution" className="block text-sm font-medium text-slate-700 mb-1">
                        Monthly Contribution
                    </label>
                    <input
                        id="monthlyContribution"
                        type="number"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary-500 text-white rounded-lg py-2 px-4 font-medium hover:bg-primary-600 transition-colors"
                >
                    {fund ? 'Update Emergency Fund' : 'Create Emergency Fund'}
                </button>
            </form>
        </div>
    )
}

export default EmergencyFundForm
