import { Plus } from 'lucide-react'
import Button from '../components/ui/Button.tsx'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.tsx'
import StatCard from '../components/features/dashboard/StatCard.tsx'
import { mockBudgets } from '../api/mock/data/mockBudgets.ts'
import { mockTransactions } from '../api/mock/data/mockTransactions.ts'
import { formatCurrency } from '../utils/index.ts'
import type { Budget } from '../types/index.ts'

export default function Budget() {
  // Calculate spending by category
  const spendingByCategory: Record<string, number> = {}
  mockTransactions.forEach(t => {
    if (t.amount < 0) {
      const category = t.category
      spendingByCategory[category] = (spendingByCategory[category] || 0) + Math.abs(t.amount)
    }
  })

  // Calculate totals
  const totalBudget = mockBudgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0)
  const totalRemaining = totalBudget - totalSpent

  // Monthly income (mock)
  const totalIncome = 5000

  return (
    <div className="pt-16">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Budget</h1>
            <p className="text-slate-600 mt-1">Plan and track your spending</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700">
              <option>November 2025</option>
              <option>December 2025</option>
              <option>January 2026</option>
            </select>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Budget
            </Button>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Total Income"
            value={totalIncome}
          />
          <StatCard
            label="Total Budget"
            value={totalBudget}
          />
          <StatCard
            label="Remaining"
            value={totalRemaining}
          />
        </div>

        {/* Budget Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockBudgets.map(budget => {
                const spent = spendingByCategory[budget.category] || 0
                const percentage = (spent / budget.amount) * 100
                const isOverBudget = percentage > 100
                const isNearLimit = percentage >= 80 && percentage <= 100

                return (
                  <div key={budget.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 capitalize">
                          {budget.category.replace('-', ' ')}
                        </h3>
                        <p className="text-xs text-slate-600">
                          {formatCurrency(spent)} of {formatCurrency(budget.amount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-slate-900">
                          {formatCurrency(budget.amount - spent)} left
                        </p>
                        <p className={`text-xs font-medium ${isOverBudget ? 'text-red-600' :
                          isNearLimit ? 'text-amber-600' :
                            'text-emerald-600'
                          }`}>
                          {percentage.toFixed(1)}% used
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${isOverBudget ? 'bg-red-500' :
                          isNearLimit ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
