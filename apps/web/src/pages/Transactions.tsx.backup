import { useState, useRef } from 'react'
import { Plus, Search, MoreVertical, ArrowUpCircle, ArrowDownCircle, ShoppingBag, Home as HomeIcon, Car, Edit2, Trash2, Filter, Download, Upload, CheckSquare, Square, PieChart, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button.tsx'
import Badge from '../components/ui/Badge.tsx'
import TransactionDetailsModal from '../components/features/transactions/TransactionDetailsModal.tsx'
import TransactionFormModal from '../components/features/transactions/TransactionFormModal.tsx'
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction, useBulkDeleteTransactions, useBulkCreateTransactions } from '../hooks/index.ts'
import { useAccounts } from '../hooks/index.ts'
import { formatCurrency, formatDate } from '../utils/index.ts'
import type { TransactionCategory, Transaction, TransactionType } from '../types/index.ts'
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'

const categoryColors: Record<TransactionCategory, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  'salary': 'success',
  'bonus': 'success',
  'investment-income': 'success',
  'rental-income': 'success',
  'housing': 'info',
  'utilities': 'default',
  'transportation': 'default',
  'food': 'default',
  'shopping': 'default',
  'entertainment': 'default',
  'healthcare': 'default',
  'financial': 'warning',
  'education': 'default',
  'other': 'default',
}

const categoryIcons: Record<string, React.ElementType> = {
  'salary': ArrowDownCircle,
  'food': ShoppingBag,
  'housing': HomeIcon,
  'transportation': Car,
  'financial': ArrowUpCircle,
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1']

export default function Transactions() {
  // State for filters
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('30') // days
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [selectedType, setSelectedType] = useState<TransactionType | ''>('')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date')

  // State for modals and selection
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  // New Features State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [showAnalytics, setShowAnalytics] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hooks
  const { data: transactions = [], isLoading: isTransactionsLoading } = useTransactions()
  const { data: accounts = [] } = useAccounts()
  const createTransaction = useCreateTransaction()
  const updateTransaction = useUpdateTransaction()
  const deleteTransaction = useDeleteTransaction()
  const bulkDeleteTransactions = useBulkDeleteTransactions()
  const bulkCreateTransactions = useBulkCreateTransactions()

  // Filter logic
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.merchant?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAccount = selectedAccountId ? transaction.accountId === selectedAccountId : true
    const matchesType = selectedType ? transaction.type === selectedType : true

    let matchesDate = true
    if (dateRange !== 'all') {
      const date = new Date(transaction.date)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (dateRange === '30') matchesDate = diffDays <= 30
      if (dateRange === '90') matchesDate = diffDays <= 90
      if (dateRange === '365') matchesDate = diffDays <= 365
    }

    return matchesSearch && matchesAccount && matchesType && matchesDate
  }).sort((a: Transaction, b: Transaction) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === 'amount') {
      return b.amount - a.amount
    } else if (sortBy === 'category') {
      return a.category.localeCompare(b.category)
    }
    return 0
  })

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Group transactions by date (paginated)
  const groupedByDate: Record<string, typeof transactions> = {}
  paginatedTransactions.forEach((transaction) => {
    const dateKey = formatDate(transaction.date)
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = []
    }
    groupedByDate[dateKey].push(transaction)
  })

  // Analytics Data
  const analyticsData = filteredTransactions.reduce((acc, t) => {
    if (t.type === 'purchase' || t.type === 'withdrawal') {
      acc[t.category] = (acc[t.category] || 0) + t.amount
    }
    return acc
  }, {} as Record<string, number>)

  const pieChartData = Object.entries(analyticsData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId)
    return account?.name || 'Unknown Account'
  }

  const handleCreate = async (data: Omit<Transaction, 'id' | 'createdAt' | 'userId'>) => {
    // @ts-ignore - userId is handled by backend or mock
    await createTransaction.mutateAsync({ ...data, userId: 'user-1' } as any)
  }

  const handleUpdate = async (data: Omit<Transaction, 'id' | 'createdAt' | 'userId'>) => {
    if (editingTransaction) {
      await updateTransaction.mutateAsync({
        id: editingTransaction.id,
        updates: data as any
      })
      setEditingTransaction(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction.mutateAsync(id)
      setActiveMenuId(null)
    }
  }

  // Bulk Operations
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedTransactions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedTransactions.map(t => t.id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} transactions?`)) {
      await bulkDeleteTransactions.mutateAsync(Array.from(selectedIds))
      setSelectedIds(new Set())
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Description', 'Amount', 'Category', 'Type', 'Account', 'Merchant'].join(','),
      ...filteredTransactions.map(t => [
        new Date(t.date).toISOString().split('T')[0],
        `"${t.description.replace(/"/g, '""')}"`,
        t.amount,
        t.category,
        t.type,
        getAccountName(t.accountId),
        t.merchant || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `transactions_export_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').slice(1) // Skip header
      const newTransactions: any[] = []

      lines.forEach(line => {
        if (!line.trim()) return
        const [date, description, amount, category, type, accountName, merchant] = line.split(',')
        // Simple parsing, assumes CSV matches export format
        // In a real app, you'd need robust CSV parsing and account matching
        const account = accounts.find(a => a.name === accountName) || accounts[0]

        if (account) {
          newTransactions.push({
            date: new Date(date),
            description: description.replace(/^"|"$/g, '').replace(/""/g, '"'),
            amount: parseFloat(amount),
            category: category as TransactionCategory,
            type: type as TransactionType,
            accountId: account.id,
            merchant: merchant || undefined
          })
        }
      })

      if (newTransactions.length > 0) {
        if (window.confirm(`Import ${newTransactions.length} transactions?`)) {
          await bulkCreateTransactions.mutateAsync(newTransactions)
          alert('Import successful!')
        }
      }
    }
    reader.readAsText(file)
    // Reset input
    event.target.value = ''
  }

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsFormModalOpen(true)
    setActiveMenuId(null)
  }

  return (
    <div className="pt-16" onClick={() => setActiveMenuId(null)}>
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
            <p className="text-slate-600 mt-1">Track and manage all your financial transactions</p>
          </div>
          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".csv"
              className="hidden"
            />
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="secondary" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => {
              setEditingTransaction(null)
              setIsFormModalOpen(true)
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Analytics Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <PieChart className="w-4 h-4" />
            {showAnalytics ? 'Hide Analytics' : 'Show Spending Insights'}
          </button>

          {showAnalytics && (
            <div className="mt-4 bg-white p-6 rounded-xl border border-slate-200 h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">This year</option>
                    <option value="all">All time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Account</label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Accounts</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Transaction Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as TransactionType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Types</option>
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="transfer">Transfer</option>
                    <option value="purchase">Purchase</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="category">Category</option>
                  </select>
                </div>

                <Button
                  variant="secondary"
                  className="w-full text-sm"
                  onClick={() => {
                    setDateRange('30')
                    setSelectedAccountId('')
                    setSelectedType('')
                    setSearchQuery('')
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar & Bulk Actions */}
            <div className="mb-6 flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              </div>

              {selectedIds.size > 0 && (
                <Button variant="secondary" onClick={handleBulkDelete} className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedIds.size})
                </Button>
              )}

              <div className="text-sm text-slate-600 whitespace-nowrap">
                {filteredTransactions.length} total
              </div>
            </div>

            {/* Transactions List */}
            {isTransactionsLoading ? (
              <div className="text-center py-12 text-slate-500">Loading transactions...</div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No transactions found</h3>
                <p className="text-slate-500 mt-1">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Select All Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <button onClick={handleSelectAll} className="text-slate-500 hover:text-slate-700">
                      {selectedIds.size > 0 && selectedIds.size === paginatedTransactions.length ? (
                        <CheckSquare className="w-5 h-5 text-primary-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                    <span className="text-sm font-medium text-slate-700">Select All on Page</span>
                  </div>
                </div>

                {Object.entries(groupedByDate).map(([date, transactions]) => (
                  <div key={date}>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">{date}</h3>
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      {transactions.map((transaction, index) => {
                        const Icon = categoryIcons[transaction.category] || ShoppingBag
                        const isIncome = transaction.amount > 0
                        const isSelected = selectedIds.has(transaction.id)

                        return (
                          <div
                            key={transaction.id}
                            onClick={() => {
                              setSelectedTransaction(transaction)
                              setIsDetailsModalOpen(true)
                            }}
                            className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group ${index !== transactions.length - 1 ? 'border-b border-slate-100' : ''
                              } ${isSelected ? 'bg-primary-50' : ''}`}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSelectOne(transaction.id)
                                }}
                                className="text-slate-400 hover:text-primary-600"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-5 h-5 text-primary-600" />
                                ) : (
                                  <Square className="w-5 h-5" />
                                )}
                              </button>

                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-emerald-100' : 'bg-slate-100'
                                }`}>
                                <Icon className={`w-5 h-5 ${isIncome ? 'text-emerald-600' : 'text-slate-600'}`} />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">{transaction.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={categoryColors[transaction.category]}>
                                    {transaction.category.replace('-', ' ')}
                                  </Badge>
                                  <span className="text-sm text-slate-600">
                                    {getAccountName(transaction.accountId)}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right mr-4">
                                <p className={`text-lg font-semibold font-mono ${isIncome ? 'text-emerald-600' : 'text-slate-900'
                                  }`}>
                                  {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {new Date(transaction.date).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>

                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveMenuId(activeMenuId === transaction.id ? null : transaction.id)
                                  }}
                                  className="p-2 hover:bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreVertical className="w-5 h-5 text-slate-400" />
                                </button>

                                {activeMenuId === transaction.id && (
                                  <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openEditModal(transaction)
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <Edit2 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(transaction.id)
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                      <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                      variant="secondary"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <span className="text-sm text-slate-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="secondary"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditingTransaction(null)
        }}
        onSave={editingTransaction ? handleUpdate : handleCreate}
        transaction={editingTransaction || undefined}
      />
    </div>
  )
}

