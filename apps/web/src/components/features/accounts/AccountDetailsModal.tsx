import { useEffect, useRef } from 'react'
import {
    X,
    PiggyBank,
    TrendingUp,
    Home,
    Wallet,
    Calendar,
    DollarSign,
    TrendingUp as TrendingUpIcon,
    MapPin,
    CreditCard,
    BarChart3
} from 'lucide-react'
import { cn } from '../../../utils/index.ts'
import { formatCurrency, formatDate, formatPercent } from '../../../utils/index.ts'
import type {
    Account,
    Transaction,
    StockHolding
} from '../../../types/index.ts'

interface AccountDetailsModalProps {
    account: Account
    transactions: Transaction[]
    holdings?: StockHolding[]
    isOpen: boolean
    onClose: () => void
}

const accountColors = {
    savings: 'bg-teal-500',
    checking: 'bg-blue-500',
    loan: 'bg-red-500',
    trading: 'bg-purple-500',
    property: 'bg-amber-500',
    credit_card: 'bg-red-500',
    investment: 'bg-indigo-500',
} as Record<string, string>

const accountIcons = {
    savings: PiggyBank,
    checking: CreditCard,
    loan: DollarSign,
    trading: TrendingUp,
    property: Home,
    credit_card: CreditCard,
    investment: TrendingUp,
} as Record<string, any>

export default function AccountDetailsModal({
    account,
    transactions,
    holdings = [],
    isOpen,
    onClose
}: AccountDetailsModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.addEventListener('mousedown', handleClickOutside)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.removeEventListener('mousedown', handleClickOutside)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const Icon = accountIcons[account.accountType] || Wallet
    const bgColor = accountColors[account.accountType]

    // Get recent transactions (last 5, sorted by date desc)
    const recentTransactions = transactions
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5)

    // Calculate portfolio value for trading accounts
    const portfolioValue = holdings.reduce((sum, holding) =>
        sum + (holding.quantity * holding.currentPrice), 0
    )

    // Get top holdings (by market value, top 3)
    const topHoldings = holdings
        .sort((a, b) => (b.quantity * b.currentPrice) - (a.quantity * a.currentPrice))
        .slice(0, 3)

    // Calculate loan term in months
    const calculateLoanTerm = () => {
        if (!account.loanDetails) return null
        const start = account.createdAt
        const end = account.loanDetails.payoffDate
        const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
        return months
    }

    const renderAccountSpecificDetails = () => {
        switch (account.accountType) {
            case 'savings':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUpIcon className="w-4 h-4 text-teal-600" />
                                    <span className="text-sm font-medium text-gray-700">Interest Rate</span>
                                </div>
                                <p className="text-lg font-semibold font-mono">{account.interestRate.toFixed(2)}%</p>
                            </div>
                            {account.savingsMetrics && (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="w-4 h-4 text-teal-600" />
                                            <span className="text-sm font-medium text-gray-700">Interest Earned (YTD)</span>
                                        </div>
                                        <p className="text-lg font-semibold font-mono text-green-600">
                                            {formatCurrency(account.savingsMetrics.interestEarnedYTD)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BarChart3 className="w-4 h-4 text-teal-600" />
                                            <span className="text-sm font-medium text-gray-700">APY</span>
                                        </div>
                                        <p className="text-lg font-semibold">{account.savingsMetrics.apy.toFixed(2)}%</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {recentTransactions.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
                                <div className="space-y-2">
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                            <div>
                                                <p className="font-medium">{transaction.description}</p>
                                                <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                                            </div>
                                            <p className={cn("font-mono font-semibold", transaction.amount >= 0 ? 'text-green-600' : 'text-red-600')}>
                                                {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )

            case 'checking':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUpIcon className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">Interest Rate</span>
                                </div>
                                <p className="text-lg font-semibold font-mono">{account.interestRate.toFixed(2)}%</p>
                            </div>
                            {account.checkingMetrics && (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium text-gray-700">Monthly Fees</span>
                                        </div>
                                        <p className="text-lg font-semibold font-mono">
                                            {account.checkingMetrics.monthlyFees === 0 ? 'Fee-free' : formatCurrency(account.checkingMetrics.monthlyFees)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CreditCard className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium text-gray-700">Available Balance</span>
                                        </div>
                                        <p className="text-lg font-semibold font-mono">{formatCurrency(account.checkingMetrics.availableBalance)}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {recentTransactions.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
                                <div className="space-y-2">
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                            <div>
                                                <p className="font-medium">{transaction.description}</p>
                                                <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                                            </div>
                                            <p className={cn("font-mono font-semibold", transaction.amount >= 0 ? 'text-green-600' : 'text-red-600')}>
                                                {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )

            case 'loan': {
                const loanTerm = calculateLoanTerm()
                return (
                    <div className="space-y-6">
                        {account.loanDetails && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-red-600" />
                                        <span className="text-sm font-medium text-gray-700">Remaining Balance</span>
                                    </div>
                                    <p className="text-lg font-semibold font-mono">{formatCurrency(account.loanDetails.remainingBalance)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard className="w-4 h-4 text-red-600" />
                                        <span className="text-sm font-medium text-gray-700">Monthly Payment</span>
                                    </div>
                                    <p className="text-lg font-semibold font-mono">{formatCurrency(account.loanDetails.monthlyPayment)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUpIcon className="w-4 h-4 text-red-600" />
                                        <span className="text-sm font-medium text-gray-700">Interest Rate</span>
                                    </div>
                                    <p className="text-lg font-semibold">{account.loanDetails.interestRate.toFixed(2)}%</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-red-600" />
                                        <span className="text-sm font-medium text-gray-700">Loan Term</span>
                                    </div>
                                    <p className="text-lg font-semibold">{loanTerm} months</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-red-600" />
                                        <span className="text-sm font-medium text-gray-700">Origination Date</span>
                                    </div>
                                    <p className="text-lg font-semibold">{formatDate(account.createdAt)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BarChart3 className="w-4 h-4 text-red-600" />
                                        <span className="text-sm font-medium text-gray-700">Loan Type</span>
                                    </div>
                                    <p className="text-lg font-semibold">{account.loanDetails.loanType}</p>
                                </div>
                            </div>
                        )}

                        {account.loanMetrics && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-red-600" />
                                        <span className="text-sm font-medium text-gray-700">Interest Paid (This Month)</span>
                                    </div>
                                    <p className="text-lg font-semibold font-mono text-red-600">
                                        {formatCurrency(account.loanMetrics.interestPaidThisMonth)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-red-600" />
                                        <span className="text-sm font-medium text-gray-700">Principal Paid (This Month)</span>
                                    </div>
                                    <p className="text-lg font-semibold font-mono text-green-600">
                                        {formatCurrency(account.loanMetrics.principalPaidThisMonth)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }

            case 'trading':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium text-gray-700">Portfolio Value</span>
                                </div>
                                <p className="text-lg font-semibold font-mono">{formatCurrency(portfolioValue)}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <BarChart3 className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium text-gray-700">Number of Holdings</span>
                                </div>
                                <p className="text-lg font-semibold">{holdings.length}</p>
                            </div>
                            {account.tradingMetrics && (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUpIcon className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm font-medium text-gray-700">Total Gain/Loss</span>
                                        </div>
                                        <p className={cn("text-lg font-semibold font-mono", account.tradingMetrics.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600')}>
                                            {account.tradingMetrics.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(account.tradingMetrics.totalGainLoss)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BarChart3 className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm font-medium text-gray-700">Return Rate</span>
                                        </div>
                                        <p className={cn("text-lg font-semibold", account.tradingMetrics.returnRate >= 0 ? 'text-green-600' : 'text-red-600')}>
                                            {formatPercent(account.tradingMetrics.returnRate)}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {topHoldings.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">Top Holdings</h3>
                                <div className="space-y-3">
                                    {topHoldings.map((holding) => {
                                        const marketValue = holding.quantity * holding.currentPrice
                                        const gainLoss = marketValue - (holding.quantity * holding.purchasePrice)
                                        return (
                                            <div key={holding.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                                <div>
                                                    <p className="font-medium">{holding.symbol} - {holding.companyName}</p>
                                                    <p className="text-sm text-gray-600">{holding.quantity} shares @ {formatCurrency(holding.currentPrice)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-mono font-semibold">{formatCurrency(marketValue)}</p>
                                                    <p className={cn("text-sm font-medium", gainLoss >= 0 ? 'text-green-600' : 'text-red-600')}>
                                                        {formatPercent((gainLoss / (holding.quantity * holding.purchasePrice)) * 100)}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )

            case 'property':
                return (
                    <div className="space-y-6">
                        {account.propertyDetails && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Home className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm font-medium text-gray-700">Property Value</span>
                                    </div>
                                    <p className="text-lg font-semibold font-mono">{formatCurrency(account.propertyDetails.currentValue)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm font-medium text-gray-700">Mortgage Balance</span>
                                    </div>
                                    <p className="text-lg font-semibold font-mono">{formatCurrency(account.propertyDetails.mortgageBalance)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm font-medium text-gray-700">Monthly Mortgage</span>
                                    </div>
                                    <p className="text-lg font-semibold font-mono">{formatCurrency(account.propertyDetails.monthlyMortgage)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm font-medium text-gray-700">Monthly Rental Income</span>
                                    </div>
                                    <p className="text-lg font-semibold font-mono text-green-600">
                                        {formatCurrency(account.propertyDetails.rentalIncome)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm font-medium text-gray-700">Location Details</span>
                                    </div>
                                    <p className="text-lg font-semibold">{account.propertyDetails.address}</p>
                                    <p className="text-sm text-gray-600">{account.propertyDetails.propertyType}</p>
                                    <p className="text-sm text-gray-600">Purchase Date: {formatDate(account.propertyDetails.purchaseDate)}</p>
                                </div>
                            </div>
                        )}

                        {account.propertyMetrics && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm font-medium text-gray-700">Equity</span>
                                    </div>
                                    <p className="text-lg font-semibold font-mono">{formatCurrency(account.propertyMetrics.equity)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUpIcon className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm font-medium text-gray-700">Appreciation Rate</span>
                                    </div>
                                    <p className="text-lg font-semibold text-green-600">
                                        +{account.propertyMetrics.appreciationRate.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                ref={modalRef}
                className={cn('rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto', bgColor)}
            >
                {/* Header */}
                <div className="p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <Icon className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{account.name}</h2>
                            <p className="text-white text-opacity-90 capitalize">{account.accountType} Account</p>
                            <p className="text-sm text-white text-opacity-75">{account.institution}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white text-opacity-90">Current Balance</p>
                            <p className="text-3xl font-bold font-mono">{formatCurrency(account.balance)}</p>
                        </div>
                        {account.accountNumber && (
                            <div className="text-right">
                                <p className="text-sm text-white text-opacity-90">Account Number</p>
                                <p className="text-lg font-mono">****{account.accountNumber.slice(-4)}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                    {renderAccountSpecificDetails()}
                </div>
            </div>
        </div>
    )
}