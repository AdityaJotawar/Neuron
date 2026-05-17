import { useState } from 'react'
import { Plus, ArrowLeftRight, TrendingUp, CreditCard, Target, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

interface QuickActionsPanelProps {
  onAddTransaction?: () => void
  onTransfer?: () => void
  onAddInvestment?: () => void
  onPayBill?: () => void
  onSetGoal?: () => void
}

const quickActions = [
  {
    id: 'transaction',
    label: 'Record Transaction',
    description: 'Add income or expense',
    icon: Plus,
    color: 'bg-emerald-500',
    hoverColor: 'hover:bg-emerald-600',
  },
  {
    id: 'transfer',
    label: 'Transfer Funds',
    description: 'Between accounts',
    icon: ArrowLeftRight,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
  },
  {
    id: 'investment',
    label: 'Add Investment',
    description: 'Buy stocks or funds',
    icon: TrendingUp,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
  },
  {
    id: 'bill',
    label: 'Pay Bill',
    description: 'Record payment',
    icon: CreditCard,
    color: 'bg-amber-500',
    hoverColor: 'hover:bg-amber-600',
  },
  {
    id: 'goal',
    label: 'Set Financial Goal',
    description: 'Create savings target',
    icon: Target,
    color: 'bg-teal-500',
    hoverColor: 'hover:bg-teal-600',
  },
]

const recentActions = [
  { id: 'recent-1', label: 'Grocery Shopping', icon: Plus, time: '2 hours ago' },
  { id: 'recent-2', label: 'Transfer to Savings', icon: ArrowLeftRight, time: 'Yesterday' },
  { id: 'recent-3', label: 'Buy AAPL Stock', icon: TrendingUp, time: '2 days ago' },
]

export default function QuickActionsPanel({
  onAddTransaction,
  onTransfer,
  onAddInvestment,
  onPayBill,
  onSetGoal,
}: QuickActionsPanelProps) {
  const [showRecent, setShowRecent] = useState(false)

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'transaction':
        onAddTransaction?.()
        break
      case 'transfer':
        onTransfer?.()
        break
      case 'investment':
        onAddInvestment?.()
        break
      case 'bill':
        onPayBill?.()
        break
      case 'goal':
        onSetGoal?.()
        break
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </div>
          <button
            onClick={() => setShowRecent(!showRecent)}
            className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <Clock className="w-4 h-4" />
            {showRecent ? 'Show Actions' : 'Recent'}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {!showRecent ? (
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action.id)}
                  className="flex flex-col items-start p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left group"
                >
                  <div className={`p-2 rounded-lg ${action.color} ${action.hoverColor} transition-colors mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-slate-900 text-sm mb-1">
                    {action.label}
                  </span>
                  <span className="text-xs text-slate-500">
                    {action.description}
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              Recent Actions
            </h4>
            {recentActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.id}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
                >
                  <div className="p-2 bg-slate-200 rounded-lg">
                    <Icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-slate-900">
                      {action.label}
                    </div>
                    <div className="text-xs text-slate-500">{action.time}</div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400" />
                </button>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
