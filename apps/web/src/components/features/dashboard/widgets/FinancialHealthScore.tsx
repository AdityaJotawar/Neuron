import { TrendingUp, DollarSign, Shield, PieChart } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

interface FinancialHealthScoreProps {
  overall: number
  subScores: {
    savingsRate: number
    debtToIncome: number
    emergencyFund: number
    investmentDiversification: number
  }
  recommendations: string[]
  benchmark?: {
    yourScore: number
    avgForAgeGroup: number
    ageGroup: string
  }
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-blue-600'
  if (score >= 40) return 'text-amber-600'
  return 'text-red-600'
}

const getScoreBgColor = (score: number) => {
  if (score >= 80) return 'bg-emerald-600'
  if (score >= 60) return 'bg-blue-600'
  if (score >= 40) return 'bg-amber-600'
  return 'bg-red-600'
}

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Improvement'
}

export default function FinancialHealthScore({
  overall,
  subScores,
  recommendations,
  benchmark
}: FinancialHealthScoreProps) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (overall / 100) * circumference

  const subScoreItems = [
    { name: 'Savings Rate', value: subScores.savingsRate, icon: DollarSign },
    { name: 'Debt-to-Income', value: subScores.debtToIncome, icon: TrendingUp },
    { name: 'Emergency Fund', value: subScores.emergencyFund, icon: Shield },
    { name: 'Investment Diversification', value: subScores.investmentDiversification, icon: PieChart },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Health Score</CardTitle>
        <CardDescription>Overall financial wellness assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Score Gauge */}
          <div className="flex items-center justify-between">
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={getScoreColor(overall)}
                  style={{
                    transition: 'stroke-dashoffset 1s ease-in-out',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(overall)}`}>
                  {overall}
                </span>
                <span className="text-xs text-slate-500">out of 100</span>
              </div>
            </div>

            <div className="flex-1 ml-8 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">Status</span>
                  <span className={`text-sm font-semibold ${getScoreColor(overall)}`}>
                    {getScoreLabel(overall)}
                  </span>
                </div>
              </div>

              {benchmark && (
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Your Score</span>
                    <span className="font-semibold text-slate-900">{benchmark.yourScore}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-slate-600">Avg ({benchmark.ageGroup})</span>
                    <span className="font-medium text-slate-700">{benchmark.avgForAgeGroup}</span>
                  </div>
                  <div className="mt-2 text-xs text-emerald-600 font-medium">
                    +{benchmark.yourScore - benchmark.avgForAgeGroup} points above average
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sub-Scores */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900">Score Breakdown</h4>
            {subScoreItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{item.name}</span>
                    </div>
                    <span className={`font-semibold ${getScoreColor(item.value)}`}>
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getScoreBgColor(item.value)}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">
                Recommendations
              </h4>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-primary-600 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
