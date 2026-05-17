import { useState } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card.tsx'

interface CashFlowEvent {
  date: Date
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
}

interface CashFlowCalendarProps {
  events: CashFlowEvent[]
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

export default function CashFlowCalendar({ events }: CashFlowCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDate(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDate(null)
  }

  const getEventsForDay = (day: number) => {
    const date = new Date(year, month, day)
    return events.filter(event => isSameDay(event.date, date))
  }

  const getDayNetCashFlow = (day: number) => {
    const dayEvents = getEventsForDay(day)
    return dayEvents.reduce((total, event) => {
      return total + (event.type === 'income' ? event.amount : -event.amount)
    }, 0)
  }

  const selectedDayEvents = selectedDate ? events.filter(event => isSameDay(event.date, selectedDate)) : []

  const calendarDays = []
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cash Flow Calendar</CardTitle>
            <CardDescription>Income and expenses by day</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <span className="text-sm font-semibold text-slate-900 min-w-[120px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Calendar Grid */}
          <div>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-slate-600 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }

                const dayEvents = getEventsForDay(day)
                const netCashFlow = getDayNetCashFlow(day)
                const hasEvents = dayEvents.length > 0
                const isToday = isSameDay(new Date(year, month, day), new Date())
                const isSelected = selectedDate && isSameDay(new Date(year, month, day), selectedDate)

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`
                      aspect-square p-1 rounded-lg text-xs transition-all
                      ${isSelected ? 'bg-primary-600 text-white ring-2 ring-primary-600 ring-offset-1' : ''}
                      ${!isSelected && isToday ? 'bg-primary-50 text-primary-700 font-semibold ring-1 ring-primary-200' : ''}
                      ${!isSelected && !isToday && hasEvents ? 'bg-slate-50 hover:bg-slate-100' : ''}
                      ${!isSelected && !isToday && !hasEvents ? 'hover:bg-slate-50' : ''}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <span className={`text-xs ${isSelected || isToday ? 'font-semibold' : 'text-slate-700'}`}>
                        {day}
                      </span>
                      {hasEvents && (
                        <div className="flex-1 flex flex-col justify-center items-center mt-0.5">
                          <div className={`text-[9px] font-mono font-semibold ${isSelected ? 'text-white' :
                            netCashFlow > 0 ? 'text-emerald-600' :
                              netCashFlow < 0 ? 'text-red-600' :
                                'text-slate-600'
                            }`}>
                            {netCashFlow > 0 ? '+' : ''}{(netCashFlow / 1000).toFixed(1)}k
                          </div>
                          <div className={`flex gap-0.5 mt-0.5`}>
                            {dayEvents.slice(0, 3).map((event, i) => (
                              <div
                                key={i}
                                className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' :
                                  event.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected Day Details */}
          {selectedDate && selectedDayEvents.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h4>
              <div className="space-y-2">
                {selectedDayEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {event.type === 'income' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {event.description}
                        </div>
                        <div className="text-xs text-slate-500">{event.category}</div>
                      </div>
                    </div>
                    <span className={`text-sm font-mono font-semibold ${event.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                      {event.type === 'income' ? '+' : '-'}${event.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Expense</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-primary-50 border border-primary-200" />
              <span>Today</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
