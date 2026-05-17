import {
  Wallet,
  PiggyBank,
  CreditCard,
  DollarSign,
  TrendingUp,
  Home
} from 'lucide-react'
import { cn } from '../../../utils/index.ts'
import { formatCurrency } from '../../../utils/index.ts'
import type {
  AccountType,
  SavingsMetrics,
  CheckingMetrics,
  LoanDetails,
  TradingMetrics,
  PropertyMetrics
} from '../../../types/index.ts'

interface AccountCardProps {
  accountType: AccountType
  name: string
  balance: number
  savingsMetrics?: SavingsMetrics
  checkingMetrics?: CheckingMetrics
  loanDetails?: LoanDetails
  tradingMetrics?: TradingMetrics
  propertyMetrics?: PropertyMetrics
  className?: string
  onClick?: () => void
}

const accountColors = {
  savings: 'bg-teal-500',
  checking: 'bg-blue-500',
  loan: 'bg-red-500',
  trading: 'bg-purple-500',
  property: 'bg-amber-500',
  credit_card: 'bg-orange-500',
  investment: 'bg-green-500',
}

const accountIcons = {
  savings: PiggyBank,
  checking: CreditCard,
  loan: DollarSign,
  trading: TrendingUp,
  property: Home,
  credit_card: CreditCard,
  investment: TrendingUp,
}

export default function AccountCard({
  accountType,
  name,
  balance,
  savingsMetrics,
  checkingMetrics,
  loanDetails,
  tradingMetrics,
  propertyMetrics,
  className,
  onClick
}: AccountCardProps) {
  const Icon = accountIcons[accountType] || Wallet
  const bgColor = accountColors[accountType]

  const renderMetrics = () => {
    switch (accountType) {
      case 'savings':
        if (!savingsMetrics) return null
        return (
          <div className="flex gap-4 mt-3 pt-3 border-t border-white border-opacity-20">
            <div>
              <p className="text-xs opacity-70">Interest Earned (YTD)</p>
              <p className="text-sm font-semibold font-mono">{formatCurrency(savingsMetrics.interestEarnedYTD)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">APY</p>
              <p className="text-sm font-semibold">{savingsMetrics.apy.toFixed(2)}%</p>
            </div>
          </div>
        )

      case 'checking':
        if (!checkingMetrics) return null
        return (
          <div className="flex gap-4 mt-3 pt-3 border-t border-white border-opacity-20">
            <div>
              <p className="text-xs opacity-70">Monthly Fees</p>
              <p className="text-sm font-semibold font-mono">
                {checkingMetrics.monthlyFees === 0 ? 'Fee-free' : formatCurrency(checkingMetrics.monthlyFees)}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Available Balance</p>
              <p className="text-sm font-semibold font-mono">{formatCurrency(checkingMetrics.availableBalance)}</p>
            </div>
          </div>
        )

      case 'loan':
        if (!loanDetails) return null
        return (
          <div className="flex gap-4 mt-3 pt-3 border-t border-white border-opacity-20">
            <div>
              <p className="text-xs opacity-70">Pending Principal</p>
              <p className="text-sm font-semibold font-mono">{formatCurrency(loanDetails.remainingBalance)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Monthly Payment</p>
              <p className="text-sm font-semibold font-mono">{formatCurrency(loanDetails.monthlyPayment)}</p>
            </div>
          </div>
        )

      case 'trading':
        if (!tradingMetrics) return null
        const isPositive = tradingMetrics.totalGainLoss >= 0
        return (
          <div className="flex gap-4 mt-3 pt-3 border-t border-white border-opacity-20">
            <div>
              <p className="text-xs opacity-70">Total Gain/Loss</p>
              <p className={cn("text-sm font-semibold font-mono", isPositive ? 'text-green-100' : 'text-red-100')}>
                {isPositive ? '+' : ''}{formatCurrency(tradingMetrics.totalGainLoss)}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Return Rate</p>
              <p className={cn("text-sm font-semibold", isPositive ? 'text-green-100' : 'text-red-100')}>
                {isPositive ? '+' : ''}{tradingMetrics.returnRate.toFixed(2)}%
              </p>
            </div>
          </div>
        )

      case 'property':
        if (!propertyMetrics) return null
        return (
          <div className="flex gap-4 mt-3 pt-3 border-t border-white border-opacity-20">
            <div>
              <p className="text-xs opacity-70">Equity</p>
              <p className="text-sm font-semibold font-mono">{formatCurrency(propertyMetrics.equity)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Appreciation</p>
              <p className="text-sm font-semibold text-green-100">+{propertyMetrics.appreciationRate.toFixed(1)}%</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={cn('account-card rounded-xl p-5 relative overflow-hidden', bgColor, className, onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      <div className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
        <Icon className="w-5 h-5 text-black" />
      </div>
      <div className="text-white">
        <p className="text-sm font-medium opacity-90 mb-1">{name}</p>
        <p className="text-2xl font-semibold font-mono">{formatCurrency(balance)}</p>
        {renderMetrics()}
      </div>
    </div>
  )
}
