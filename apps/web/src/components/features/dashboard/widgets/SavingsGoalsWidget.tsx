import { Shield, Plane, Car, Home, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: Date
  icon: string
  color: string
  monthlyContribution: number
  onTrack: boolean
}

interface SavingsGoalsWidgetProps {
  goals: SavingsGoal[]
  maxDisplay?: number
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'shield':
      return Shield
    case 'plane':
      return Plane
    case 'car':
      return Car
    case 'home':
      return Home
    default:
      return TrendingUp
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const getMonthsRemaining = (targetDate: Date) => {
  const now = new Date()
  const diffTime = targetDate.getTime() - now.getTime()
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
  return Math.max(0, diffMonths)
}

export default function SavingsGoalsWidget({ goals, maxDisplay = 4 }: SavingsGoalsWidgetProps) {
  const displayedGoals = goals.slice(0, maxDisplay)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Savings Goals</CardTitle>
            <CardDescription>Track your financial targets</CardDescription>
          </div>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
            + New Goal
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 text-sm mb-1">No savings goals yet</p>
            <p className="text-slate-500 text-xs mb-4">Create your first goal to get started</p>
            <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Create Goal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedGoals.map((goal) => {
              const Icon = getIcon(goal.icon)
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const monthsRemaining = getMonthsRemaining(goal.targetDate)
              const requiredMonthly = monthsRemaining > 0
                ? (goal.targetAmount - goal.currentAmount) / monthsRemaining
                : 0

              return (
                <div key={goal.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: goal.color + '20' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: goal.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {goal.name}
                        </h4>
                        {!goal.onTrack && (
                          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-baseline gap-2 text-xs text-slate-600">
                        <span className="font-mono font-semibold text-slate-900">
                          ${goal.currentAmount.toLocaleString()}
                        </span>
                        <span>of ${goal.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: goal.color,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-slate-600">{progress.toFixed(0)}% complete</span>
                      <span className="text-slate-500">Target: {formatDate(goal.targetDate)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                    <div>
                      <div className="text-slate-500">Monthly Contribution</div>
                      <div className="font-semibold text-slate-900 mt-0.5">
                        ${goal.monthlyContribution.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-500">Required Monthly</div>
                      <div className={`font-semibold mt-0.5 ${requiredMonthly <= goal.monthlyContribution
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                        }`}>
                        ${requiredMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-500">Time Left</div>
                      <div className="font-semibold text-slate-900 mt-0.5">
                        {monthsRemaining} {monthsRemaining === 1 ? 'month' : 'months'}
                      </div>
                    </div>
                  </div>

                  {/* On Track Indicator */}
                  {goal.onTrack ? (
                    <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      On track to meet goal
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-amber-600 font-medium flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      Increase contributions to stay on track
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
