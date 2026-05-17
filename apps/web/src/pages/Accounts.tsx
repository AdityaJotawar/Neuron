import { useState, useMemo } from 'react'
import { Search, Plus, MoreVertical, Building2, PiggyBank, TrendingDown, TrendingUp, Home } from 'lucide-react'
import Button from '../components/ui/Button'
import { mockAccounts } from '../api/mock/data/mockAccounts.ts'
import { mockTransactions } from '../api/mock/data/mockTransactions.ts'
import { mockStockHoldings } from '../api/mock/data/mockStockHoldings.ts'
import { formatCurrency } from '../utils'
import { getAccountsWithCalculatedBalances } from '../utils/accountBalance'
import type { AccountType, Account } from '../types'
import AccountDetailsModal from '../components/features/accounts/AccountDetailsModal'

const accountIcons: Record<AccountType, React.ElementType> = {
  savings: PiggyBank,
  checking: Building2,
  loan: TrendingDown,
  trading: TrendingUp,
  property: Home,
  credit_card: Building2, // Using Building2 as placeholder
  investment: TrendingUp, // Using TrendingUp as placeholder
}

const accountColors: Record<AccountType, string> = {
  savings: 'bg-teal-500',
  checking: 'bg-blue-500',
  loan: 'bg-red-500',
  trading: 'bg-purple-500',
  property: 'bg-amber-500',
  credit_card: 'bg-gray-500',
  investment: 'bg-green-500',
}

export default function Accounts() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate accounts with current balances based on transactions
  const accountsWithBalances = useMemo(() =>
    getAccountsWithCalculatedBalances(mockAccounts, mockTransactions),
    []
  )

  const filteredAccounts = accountsWithBalances.filter((account) => {
    const matchesFilter = activeFilter === 'all' || account.accountType === activeFilter
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.institution.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const groupedAccounts = {
    'Cash & Savings': filteredAccounts.filter(a => a.accountType === 'savings' || a.accountType === 'checking'),
    'Loans': filteredAccounts.filter(a => a.accountType === 'loan'),
    'Trading & Investments': filteredAccounts.filter(a => a.accountType === 'trading'),
    'Property': filteredAccounts.filter(a => a.accountType === 'property'),
  }

  const calculateGroupTotal = (accounts: typeof mockAccounts) => {
    return accounts.reduce((sum: number, account: any) => sum + account.balance, 0)
  }

  return (
    <div className="pt-16">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Accounts</h1>
          <p className="text-slate-600 mt-1">Manage all your financial accounts in one place</p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeFilter === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('savings')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeFilter === 'savings'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              Cash & Savings
            </button>
            <button
              onClick={() => setActiveFilter('loan')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeFilter === 'loan'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              Loans
            </button>
            <button
              onClick={() => setActiveFilter('trading')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeFilter === 'trading'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              Trading
            </button>
            <button
              onClick={() => setActiveFilter('property')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeFilter === 'property'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              Property
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700">
              <option>Sort by Name</option>
              <option>Sort by Balance</option>
              <option>Sort by Type</option>
            </select>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>
        </div>

        {/* Accounts List */}
        <div className="space-y-8">
          {Object.entries(groupedAccounts).map(([groupName, accounts]) => {
            if (accounts.length === 0) return null
            const total = calculateGroupTotal(accounts)

            return (
              <div key={groupName}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">{groupName}</h2>
                  <div className="text-sm text-slate-600">
                    {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'} • {formatCurrency(total)}
                  </div>
                </div>
                <div className="space-y-3">
                  {accounts.map((account) => {
                    const Icon = accountIcons[account.accountType]
                    const bgColor = accountColors[account.accountType]

                    return (
                      <div
                        key={account.id}
                        className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer"
                        onClick={() => { setSelectedAccount(account); setIsModalOpen(true); }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base font-medium text-slate-900">{account.name}</h3>
                            <p className="text-sm text-slate-600">{account.institution}</p>
                            {account.interestRate > 0 && (
                              <p className="text-xs text-slate-500 mt-1">
                                {account.accountType === 'loan' ? 'APR' : 'APY'}: {account.interestRate}%
                              </p>
                            )}
                            {account.loanDetails && (
                              <p className="text-xs text-slate-500 mt-1">
                                {formatCurrency(account.loanDetails.monthlyPayment)}/month • Payoff: {new Date(account.loanDetails.payoffDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-slate-900 font-mono">
                              {formatCurrency(account.balance)}
                            </p>
                          </div>
                          <button className="p-2 hover:bg-slate-100 rounded-lg" onClick={(e) => { e.stopPropagation(); /* TODO: open menu */ }}>
                            <MoreVertical className="w-5 h-5 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {selectedAccount && (
        <AccountDetailsModal
          account={selectedAccount}
          transactions={mockTransactions.filter(t => t.accountId === selectedAccount.id)}
          holdings={selectedAccount.accountType === 'trading' ? mockStockHoldings : []}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
