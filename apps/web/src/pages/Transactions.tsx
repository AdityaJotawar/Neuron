import { useState, useRef } from 'react'
import { Plus, Search, MoreVertical, ArrowDownCircle, ShoppingBag, Home as HomeIcon, Car, Edit2, Trash2, Filter, Download, Upload, CheckSquare, Square, PieChart, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button, Badge, Select } from '@/components/ui'
import TransactionDetailsModal from '@/components/features/transactions/TransactionDetailsModal'
import TransactionFormModal from '@/components/features/transactions/TransactionFormModal'
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction, useBulkDeleteTransactions, useBulkCreateTransactions, useAccounts } from '@/hooks'
import { useTransactionFilters, useTransactionPagination, useTransactionSelection, useTransactionAnalytics } from '@/hooks'
import { formatCurrency, formatDate, exportTransactionsCSV, parseTransactionsCSV } from '@/utils'
import type { Transaction } from '@/types'
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS_MAP: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  salary: 'success', bonus: 'success', 'investment-income': 'success', 'rental-income': 'success', housing: 'info', utilities: 'default', transportation: 'default', food: 'default', shopping: 'default', entertainment: 'default', healthcare: 'default', financial: 'warning', education: 'default', other: 'default',
}
const ICONS: Record<string, React.ElementType> = { salary: ArrowDownCircle, food: ShoppingBag, housing: HomeIcon, transportation: Car, financial: ArrowDownCircle }
const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1']

export default function Transactions() {
  const { data: transactions = [], isLoading } = useTransactions()
  const { data: accounts = [] } = useAccounts()
  const { filteredTransactions, filters, setters } = useTransactionFilters(transactions)
  const { paginatedItems, currentPage, totalPages, prevPage, nextPage } = useTransactionPagination(filteredTransactions)
  const { selectedIds, selectOne, deselectOne, selectAll, clearSelection, isAllSelected } = useTransactionSelection(paginatedItems)
  const { pieChartData } = useTransactionAnalytics(filteredTransactions)
  const createTransaction = useCreateTransaction()
  const updateTransaction = useUpdateTransaction()
  const deleteTransaction = useDeleteTransaction()
  const bulkDeleteTransactions = useBulkDeleteTransactions()
  const bulkCreateTransactions = useBulkCreateTransactions()

  const [sel, setSel] = useState<Transaction | null>(null), [isOpen, setIsOpen] = useState(false), [isForm, setIsForm] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null), [menu, setMenu] = useState<string | null>(null), [analytics, setAnalytics] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const getName = (id: string) => accounts.find(a => a.id === id)?.name || 'Unknown'
  const grouped: Record<string, Transaction[]> = {}
  paginatedItems.forEach(t => { const k = formatDate(t.date); grouped[k] = [...(grouped[k] || []), t] })

  const handleCreate = (d: Omit<Transaction, 'id' | 'createdAt' | 'userId'>) => createTransaction.mutateAsync({ ...d, userId: 'mock-user' } as any)
  const handleUpdate = (d: Omit<Transaction, 'id' | 'createdAt' | 'userId'>) => { if (editing) { updateTransaction.mutateAsync({ id: editing.id, updates: d as any }); setEditing(null) } }
  const handleDelete = async (id: string) => { if (window.confirm('Delete?')) { await deleteTransaction.mutateAsync(id); setMenu(null) } }
  const handleBulk = async () => { if (window.confirm(`Delete ${selectedIds.size}?`)) { await bulkDeleteTransactions.mutateAsync(Array.from(selectedIds)); clearSelection() } }
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = async (ev) => { const txt = ev.target?.result as string; const txs = parseTransactionsCSV(txt, accounts).map(t => ({ ...t, userId: 'mock-user' })); if (txs.length && window.confirm(`Import ${txs.length}?`)) await bulkCreateTransactions.mutateAsync(txs as any) }; r.readAsText(f) }; e.target.value = '' }

  return (
    <div className="pt-16" onClick={() => setMenu(null)}>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8 flex justify-between"><div><h1 className="text-3xl font-bold">Transactions</h1><p className="text-slate-600 mt-1">Track and manage financial transactions</p></div>
          <div className="flex gap-3"><input type="file" ref={fileRef} onChange={handleImport} accept=".csv" className="hidden" />
            <Button variant="secondary" onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4 mr-2" />Import</Button>
            <Button variant="secondary" onClick={() => exportTransactionsCSV(filteredTransactions, getName)}><Download className="w-4 h-4 mr-2" />Export</Button>
            <Button onClick={() => { setEditing(null); setIsForm(true) }}><Plus className="w-4 h-4 mr-2" />Add</Button></div></div>

        <button onClick={() => setAnalytics(!analytics)} className="flex items-center gap-2 text-sm font-medium text-primary-600 mb-6"><PieChart className="w-4 h-4" /> {analytics ? 'Hide' : 'Show'} Analytics</button>

        {analytics && (<div className="bg-white p-6 rounded-xl border border-slate-200 h-80 mb-6"><ResponsiveContainer width="100%" height="100%"><RechartsPieChart><Pie data={pieChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>{pieChartData.map((_, i) => <Cell key={`c${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><RechartsTooltip formatter={(v: number) => formatCurrency(v)} /><Legend /></RechartsPieChart></ResponsiveContainer></div>)}

        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0 sticky top-24"><div className="bg-white border border-slate-200 rounded-xl p-6"><div className="flex gap-2 mb-4"><Filter className="w-4 h-4" /><h3 className="text-sm font-semibold">Filters</h3></div>
            <div className="space-y-4"><div><label className="block text-sm font-medium mb-2">Date</label><Select value={filters.dateRange} onChange={setters.setDateRange} options={[{ value: '30', label: 'Last 30 days' }, { value: '90', label: 'Last 90 days' }, { value: '365', label: 'This year' }]} /></div>
              <div><label className="block text-sm font-medium mb-2">Account</label><Select value={filters.selectedAccountId} onChange={setters.setSelectedAccountId} options={[{ value: '', label: 'All' }, ...accounts.map(a => ({ value: a.id, label: a.name }))]} /></div>
              <div><label className="block text-sm font-medium mb-2">Type</label><Select value={filters.selectedType} onChange={setters.setSelectedType} options={[{ value: '', label: 'All' }, { value: 'deposit', label: 'Deposit' }, { value: 'withdrawal', label: 'Withdrawal' }, { value: 'transfer', label: 'Transfer' }]} /></div>
              <Button variant="secondary" className="w-full text-sm" onClick={setters.resetFilters}>Reset</Button></div></div></div>

          <div className="flex-1"><div className="mb-6 flex gap-3"><div className="relative flex-1"><input type="text" placeholder="Search..." value={filters.searchQuery} onChange={(e) => setters.setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" /><Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" /></div>
              {selectedIds.size > 0 && <Button variant="secondary" onClick={handleBulk} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Delete</Button>}
              <div className="text-sm text-slate-600 whitespace-nowrap">{filteredTransactions.length} total</div></div>

            {isLoading ? <div className="py-12 text-center text-slate-500">Loading...</div> : filteredTransactions.length === 0 ? <div className="py-12 bg-white rounded-xl border text-center"><Search className="w-6 h-6 text-slate-400 mx-auto mb-4" /><h3 className="font-medium">No transactions</h3></div> : (
              <div className="space-y-6"><div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border"><button onClick={() => isAllSelected ? clearSelection() : selectAll()} className="text-slate-500">{isAllSelected ? <CheckSquare className="w-5 h-5 text-primary-600" /> : <Square className="w-5 h-5" />}</button><span className="text-sm font-medium">Select All</span></div>
                {Object.entries(grouped).map(([d, txs]) => (<div key={d}><h3 className="text-sm font-semibold mb-3">{d}</h3><div className="bg-white border rounded-xl overflow-hidden">{txs.map((tx, i) => { const Icon = ICONS[tx.category] || ShoppingBag; const inc = tx.amount > 0; const chk = selectedIds.has(tx.id); return (
                  <div key={tx.id} onClick={() => { setSel(tx); setIsOpen(true) }} className={`flex items-center gap-4 p-4 hover:bg-slate-50 cursor-pointer group ${i < txs.length - 1 ? 'border-b' : ''} ${chk ? 'bg-primary-50' : ''}`}>
                    <button onClick={(e) => { e.stopPropagation(); chk ? deselectOne(tx.id) : selectOne(tx.id) }} className="text-slate-400">{chk ? <CheckSquare className="w-5 h-5 text-primary-600" /> : <Square className="w-5 h-5" />}</button>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${inc ? 'bg-emerald-100' : 'bg-slate-100'}`}><Icon className={`w-5 h-5 ${inc ? 'text-emerald-600' : 'text-slate-600'}`} /></div>
                    <div className="flex-1"><p className="font-medium">{tx.description}</p><div className="flex gap-2 mt-1"><Badge variant={COLORS_MAP[tx.category] || 'default'}>{tx.category}</Badge><span className="text-sm text-slate-600">{getName(tx.accountId)}</span></div></div>
                    <div className="text-right mr-4"><p className={`text-lg font-semibold font-mono ${inc ? 'text-emerald-600' : ''}`}>{inc ? '+' : ''}{formatCurrency(tx.amount)}</p><p className="text-sm text-slate-600">{new Date(tx.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p></div>
                    <div className="relative"><button onClick={(e) => { e.stopPropagation(); setMenu(menu === tx.id ? null : tx.id) }} className="p-2 hover:bg-slate-100 rounded opacity-0 group-hover:opacity-100"><MoreVertical className="w-5 h-5 text-slate-400" /></button>
                      {menu === tx.id && (<div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border z-10"><button onClick={(e) => { e.stopPropagation(); setEditing(tx); setIsForm(true); setMenu(null) }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"><Edit2 className="w-4 h-4 inline mr-2" />Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(tx.id) }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4 inline mr-2" />Delete</button></div>)}</div>
                  </div>
                )})}
                </div></div>))}
                {totalPages > 1 && <div className="flex justify-center items-center gap-4 mt-8"><Button variant="secondary" disabled={currentPage === 1} onClick={prevPage}><ChevronLeft className="w-4 h-4 mr-2" />Prev</Button><span className="text-sm">Page {currentPage} of {totalPages}</span><Button variant="secondary" disabled={currentPage === totalPages} onClick={nextPage}>Next<ChevronRight className="w-4 h-4 ml-2" /></Button></div>}
              </div>
            )}</div>
        </div>
      </div>

      {sel && <TransactionDetailsModal transaction={sel} isOpen={isOpen} onClose={() => setIsOpen(false)} />}
      <TransactionFormModal isOpen={isForm} onClose={() => { setIsForm(false); setEditing(null) }} onSave={editing ? handleUpdate : handleCreate} transaction={editing || undefined} />
    </div>
  )
}
