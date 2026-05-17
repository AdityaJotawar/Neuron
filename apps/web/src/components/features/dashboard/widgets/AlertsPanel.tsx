import { AlertCircle, AlertTriangle, Info, TrendingUp, Calendar, Wallet, PieChart, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

interface Alert {
  id: string
  type: 'bill' | 'balance' | 'budget' | 'investment' | 'sync'
  severity: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  amount?: number
  dueDate?: Date
  accountName?: string
  category?: string
  percentage?: number
}

interface AlertsPanelProps {
  alerts: Alert[]
  maxDisplay?: number
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'success':
      return CheckCircle
    default:
      return Info
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'error':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'warning':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'success':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    default:
      return 'text-blue-600 bg-blue-50 border-blue-200'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'bill':
      return Calendar
    case 'balance':
      return Wallet
    case 'budget':
      return PieChart
    case 'investment':
      return TrendingUp
    default:
      return Info
  }
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays > 1 && diffDays < 7) return `in ${diffDays} days`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function AlertsPanel({ alerts, maxDisplay = 5 }: AlertsPanelProps) {
  const displayedAlerts = alerts.slice(0, maxDisplay)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>
              {alerts.length} active {alerts.length === 1 ? 'alert' : 'alerts'}
            </CardDescription>
          </div>
          {alerts.length > maxDisplay && (
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View All
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-slate-600 text-sm">No alerts at this time</p>
            <p className="text-slate-500 text-xs mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedAlerts.map((alert) => {
              const SeverityIcon = getSeverityIcon(alert.severity)
              const TypeIcon = getTypeIcon(alert.type)

              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} transition-colors hover:shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <SeverityIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="w-4 h-4 opacity-60" />
                          <h4 className="text-sm font-semibold">{alert.title}</h4>
                        </div>
                        {alert.amount !== undefined && (
                          <span className="text-sm font-mono font-semibold whitespace-nowrap">
                            ${alert.amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm opacity-90">{alert.message}</p>

                      {/* Additional details */}
                      <div className="mt-2 flex items-center gap-4 text-xs opacity-75">
                        {alert.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due {formatDate(alert.dueDate)}
                          </span>
                        )}
                        {alert.accountName && (
                          <span className="flex items-center gap-1">
                            <Wallet className="w-3 h-3" />
                            {alert.accountName}
                          </span>
                        )}
                        {alert.category && (
                          <span className="flex items-center gap-1">
                            <PieChart className="w-3 h-3" />
                            {alert.category}
                          </span>
                        )}
                        {alert.percentage !== undefined && (
                          <span className="font-semibold">
                            {alert.percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
