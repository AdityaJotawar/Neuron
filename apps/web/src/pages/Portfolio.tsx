import { useState, useMemo } from 'react'
import {
  Plus,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import Button from '../components/ui/Button.tsx'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.tsx'
import StatCard from '../components/features/dashboard/StatCard.tsx'
import Modal from '../components/ui/Modal.tsx'
import Input from '../components/ui/Input.tsx'
import Label from '../components/ui/Label.tsx'
import Skeleton from '../components/ui/Skeleton.tsx'
import EmptyState from '../components/ui/EmptyState.tsx'
import { mockStockHoldings, calculateHoldingValue } from '../api/mock/data/mockStockHoldings.ts'
import { formatCurrency, formatPercent } from '../utils/index.ts'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { StockHolding } from '../types'

type SortKey = 'symbol' | 'quantity' | 'marketValue' | 'gainLoss' | 'return'
type SortDirection = 'asc' | 'desc'

export default function Portfolio() {
  // State
  const [holdings, setHoldings] = useState<StockHolding[]>(mockStockHoldings)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [timeRange, setTimeRange] = useState<'6M' | '1Y' | 'ALL'>('6M')

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedHolding, setSelectedHolding] = useState<StockHolding | null>(null)
  const [holdingForm, setHoldingForm] = useState<Partial<StockHolding>>({})

  // Derived State
  const stats = useMemo(() => {
    let totalValue = 0
    let totalCost = 0

    holdings.forEach(holding => {
      const { marketValue, costBasis } = calculateHoldingValue(holding)
      totalValue += marketValue
      totalCost += costBasis
    })

    const totalGainLoss = totalValue - totalCost
    const returnPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0
    // Mock today's change logic
    const todayChange = 2.35 + (Math.random() * 0.5 - 0.25)

    return { totalValue, totalGainLoss, returnPercentage, todayChange }
  }, [holdings])

  const filteredHoldings = useMemo(() => {
    return holdings.filter(h =>
      h.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [holdings, searchQuery])

  const sortedHoldings = useMemo(() => {
    if (!sortConfig) return filteredHoldings

    return [...filteredHoldings].sort((a, b) => {
      const { marketValue: mvA, gainLoss: glA, gainLossPercent: gpA } = calculateHoldingValue(a)
      const { marketValue: mvB, gainLoss: glB, gainLossPercent: gpB } = calculateHoldingValue(b)

      let valA: any = a[sortConfig.key as keyof StockHolding]
      let valB: any = b[sortConfig.key as keyof StockHolding]

      if (sortConfig.key === 'marketValue') { valA = mvA; valB = mvB }
      if (sortConfig.key === 'gainLoss') { valA = glA; valB = glB }
      if (sortConfig.key === 'return') { valA = gpA; valB = gpB }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredHoldings, sortConfig])

  // Mock Chart Data
  const performanceData = useMemo(() => {
    const baseValue = stats.totalValue * 0.8
    const months = timeRange === '6M' ? 6 : timeRange === '1Y' ? 12 : 24
    return Array.from({ length: months }, (_, i) => ({
      month: new Date(new Date().setMonth(new Date().getMonth() - (months - 1 - i))).toLocaleString('default', { month: 'short' }),
      value: baseValue + (Math.random() * (stats.totalValue - baseValue) * (i / months)) + (Math.random() * 5000)
    }))
  }, [stats.totalValue, timeRange])

  const allocationData = useMemo(() => {
    return holdings.map(holding => {
      const { marketValue } = calculateHoldingValue(holding)
      return { name: holding.symbol, value: marketValue }
    }).sort((a, b) => b.value - a.value).slice(0, 6)
  }, [holdings])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#A855F7', '#EC4899']

  // Handlers
  const handleSort = (key: SortKey) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'desc' }
    })
  }

  const handleRefreshPrices = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setHoldings(prev => prev.map(h => ({
        ...h,
        currentPrice: h.currentPrice * (1 + (Math.random() * 0.04 - 0.02)), // +/- 2%
        lastPriceUpdate: new Date()
      })))
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1500)
  }

  const handleExport = () => {
    const headers = ['Symbol', 'Company', 'Quantity', 'Purchase Price', 'Current Price', 'Market Value', 'Gain/Loss']
    const csvContent = [
      headers.join(','),
      ...holdings.map(h => {
        const { marketValue, gainLoss } = calculateHoldingValue(h)
        return [
          h.symbol,
          `"${h.companyName}"`,
          h.quantity,
          h.purchasePrice,
          h.currentPrice,
          marketValue.toFixed(2),
          gainLoss.toFixed(2)
        ].join(',')
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `portfolio_export_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this holding?')) {
      setHoldings(prev => prev.filter(h => h.id !== id))
    }
  }

  const openAddModal = () => {
    setHoldingForm({
      symbol: '',
      companyName: '',
      quantity: 0,
      purchasePrice: 0,
      currentPrice: 0,
      purchaseDate: new Date()
    })
    setIsAddModalOpen(true)
  }

  const openEditModal = (holding: StockHolding) => {
    setSelectedHolding(holding)
    setHoldingForm({ ...holding })
    setIsEditModalOpen(true)
  }

  const saveHolding = () => {
    if (!holdingForm.symbol || !holdingForm.quantity || !holdingForm.purchasePrice) return

    if (selectedHolding) {
      // Edit
      setHoldings(prev => prev.map(h => h.id === selectedHolding.id ? { ...h, ...holdingForm } as StockHolding : h))
      setIsEditModalOpen(false)
    } else {
      // Add
      const newId = Math.random().toString(36).substr(2, 9)
      const newHolding: StockHolding = {
        ...holdingForm as StockHolding,
        id: newId,
        userId: 'user1',
        accountId: '5',
        currentPrice: holdingForm.currentPrice || holdingForm.purchasePrice || 100, // Mock current price
        lastPriceUpdate: new Date(),
        createdAt: new Date()
      }
      setHoldings(prev => [...prev, newHolding])
      setIsAddModalOpen(false)
    }
  }

  return (
    <div className="pt-16">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">Portfolio</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-emerald-700">Market Open</span>
              </div>
            </div>
            <p className="text-slate-600 mt-1">
              Track your investments • Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleRefreshPrices} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Prices'}
            </Button>
            <Button onClick={openAddModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Holding
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Portfolio Value"
            value={stats.totalValue}
            icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
          />
          <StatCard
            label="Total Gain/Loss"
            value={stats.totalGainLoss}
            icon={stats.totalGainLoss >= 0 ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
          />
          <StatCard
            label="Return on Investment"
            value={`${stats.returnPercentage >= 0 ? '+' : ''}${stats.returnPercentage.toFixed(2)}%`}
            format="number"
            icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
          />
          <StatCard
            label="Today's Change"
            value={`${stats.todayChange >= 0 ? '+' : ''}${stats.todayChange.toFixed(2)}%`}
            format="number"
            icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>Historical value over time</CardDescription>
                </div>
                <select
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                >
                  <option value="6M">6 Months</option>
                  <option value="1Y">1 Year</option>
                  <option value="ALL">All Time</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => `$${value / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [formatCurrency(value), 'Value']}
                    />
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#10B981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Holdings Allocation</CardTitle>
              <CardDescription>Distribution by market value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {allocationData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search holdings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Holdings Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {[
                      { key: 'symbol', label: 'Symbol', align: 'left' },
                      { key: 'quantity', label: 'Shares', align: 'right' },
                      { key: 'marketValue', label: 'Market Value', align: 'right' },
                      { key: 'gainLoss', label: 'Gain/Loss', align: 'right' },
                      { key: 'return', label: 'Return', align: 'right' },
                    ].map((col) => (
                      <th key={col.key} className={`py-3 px-4 text-sm font-medium text-slate-700 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                        <button
                          className="flex items-center gap-1 hover:text-slate-900 transition-colors ml-auto"
                          onClick={() => handleSort(col.key as SortKey)}
                        >
                          {col.label}
                          {sortConfig?.key === col.key ? (
                            sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-50" />
                          )}
                        </button>
                      </th>
                    ))}
                    <th className="py-3 px-4 text-right text-sm font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isRefreshing ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="p-4"><Skeleton className="h-6 w-16" /></td>
                        <td className="p-4"><Skeleton className="h-6 w-12 ml-auto" /></td>
                        <td className="p-4"><Skeleton className="h-6 w-24 ml-auto" /></td>
                        <td className="p-4"><Skeleton className="h-6 w-20 ml-auto" /></td>
                        <td className="p-4"><Skeleton className="h-6 w-16 ml-auto" /></td>
                        <td className="p-4"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></td>
                      </tr>
                    ))
                  ) : sortedHoldings.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <EmptyState
                          icon={<Search className="w-16 h-16" />}
                          title="No holdings found"
                          description={searchQuery ? "Try adjusting your search terms" : "Add your first stock holding to get started"}
                        />
                      </td>
                    </tr>
                  ) : (
                    sortedHoldings.map((holding) => {
                      const { marketValue, gainLoss, gainLossPercent } = calculateHoldingValue(holding)
                      const isPositive = gainLoss >= 0

                      return (
                        <tr key={holding.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                          <td className="py-4 px-4">
                            <div>
                              <span className="font-semibold text-slate-900 block">{holding.symbol}</span>
                              <span className="text-xs text-slate-500">{holding.companyName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-mono text-sm text-slate-900">{holding.quantity}</td>
                          <td className="py-4 px-4 text-right font-mono font-semibold text-slate-900">
                            {formatCurrency(marketValue)}
                          </td>
                          <td className={`py-4 px-4 text-right font-mono font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{formatCurrency(gainLoss)}
                          </td>
                          <td className={`py-4 px-4 text-right font-mono font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatPercent(gainLossPercent)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEditModal(holding)} className="p-2 hover:bg-slate-200 rounded-full text-slate-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(holding.id)} className="p-2 hover:bg-red-100 rounded-full text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false) }}
        title={isEditModalOpen ? 'Edit Holding' : 'Add New Holding'}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Input
              id="symbol"
              placeholder="e.g. AAPL"
              value={holdingForm.symbol || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoldingForm({ ...holdingForm, symbol: e.target.value.toUpperCase() })}
            />
          </div>
          <div>
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              placeholder="e.g. Apple Inc."
              value={holdingForm.companyName || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoldingForm({ ...holdingForm, companyName: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={holdingForm.quantity || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoldingForm({ ...holdingForm, quantity: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="price">Purchase Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={holdingForm.purchasePrice || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoldingForm({ ...holdingForm, purchasePrice: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false) }}>
              Cancel
            </Button>
            <Button onClick={saveHolding}>
              {isEditModalOpen ? 'Save Changes' : 'Add Holding'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
