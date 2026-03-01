export type AccountType = 'savings' | 'checking' | 'loan' | 'trading' | 'property' | 'credit_card' | 'investment'

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'purchase'

export type TransactionCategory =
  | 'salary'
  | 'bonus'
  | 'investment-income'
  | 'rental-income'
  | 'housing'
  | 'utilities'
  | 'transportation'
  | 'food'
  | 'shopping'
  | 'entertainment'
  | 'healthcare'
  | 'financial'
  | 'education'
  | 'other'

export interface Account {
  id: string
  userId: string
  accountType: AccountType
  name: string
  institution: string
  balance: number
  interestRate: number
  accountNumber?: string
  createdAt: Date
  updatedAt: Date
  loanDetails?: LoanDetails
  propertyDetails?: PropertyDetails
  savingsMetrics?: SavingsMetrics
  checkingMetrics?: CheckingMetrics
  loanMetrics?: LoanMetrics
  tradingMetrics?: TradingMetrics
  propertyMetrics?: PropertyMetrics
}

export interface SavingsMetrics {
  interestEarnedYTD: number
  apy: number
}

export interface CheckingMetrics {
  monthlyFees: number
  availableBalance: number
}

export interface LoanMetrics {
  interestPaidThisMonth: number
  principalPaidThisMonth: number
}

export interface TradingMetrics {
  totalGainLoss: number
  returnRate: number
}

export interface PropertyMetrics {
  equity: number
  appreciationRate: number
}

export interface LoanDetails {
  originalAmount: number
  remainingBalance: number
  monthlyPayment: number
  interestRate: number
  payoffDate: Date
  loanType: string
}

export interface PropertyDetails {
  address: string
  propertyType: string
  purchasePrice: number
  purchaseDate: Date
  currentValue: number
  mortgageBalance: number
  monthlyMortgage: number
  rentalIncome: number
  propertyTax: number
  insurance: number
}

export interface Transaction {
  id: string
  userId: string
  accountId: string
  type: TransactionType
  amount: number
  category: TransactionCategory
  description: string
  merchant?: string
  date: Date
  createdAt: Date
}

export interface StockHolding {
  id: string
  userId: string
  accountId: string
  symbol: string
  companyName: string
  quantity: number
  purchasePrice: number
  purchaseDate: Date
  currentPrice: number
  lastPriceUpdate: Date
  createdAt: Date
}

export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly'

export interface Budget {
  id: string
  userId: string
  category: TransactionCategory
  amount: number
  period: BudgetPeriod
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface DashboardStats {
  netWorth: number
  totalAssets: number
  totalLiabilities: number
  monthlyCashFlow: number
  netWorthChange: number
  assetsChange: number
  liabilitiesChange: number
}

export interface PortfolioStats {
  totalValue: number
  totalGainLoss: number
  returnPercentage: number
  todayChange: number
}

export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type ImportFileType = 'transactions' | 'accounts' | 'stock_holdings'

export interface ColumnMapping {
  csvColumn: string
  appField: string
  required: boolean
}

export interface ImportHistory {
  id: string
  userId: string
  fileName: string
  fileType: ImportFileType
  status: ImportStatus
  totalRows: number
  successfulRows: number
  failedRows: number
  errorMessage?: string
  uploadedAt: Date
  completedAt?: Date
  accountId?: string
  accountName?: string
}

export interface ParsedCSVRow {
  [key: string]: string
}

// AI/Chat Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface ChatSession {
  id: string
  userId: string
  startedAt: Date
  lastActivity: Date
  messages: ChatMessage[]
  title?: string
  isActive: boolean
}
