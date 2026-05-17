import type { DashboardStats } from '../../../types/index.ts'
import { mockAccounts } from './mockAccounts.ts'
import { mockTransactions } from './mockTransactions.ts'
import { getAccountsWithCalculatedBalances } from '../../../utils/accountBalance.ts'

export const calculateDashboardStats = (): DashboardStats => {
  let totalAssets = 0
  let totalLiabilities = 0

  // Get accounts with calculated balances (initial balance + transactions)
  const accountsWithBalances = getAccountsWithCalculatedBalances(mockAccounts, mockTransactions)

  accountsWithBalances.forEach(account => {
    if (account.balance >= 0) {
      totalAssets += account.balance
    } else {
      totalLiabilities += Math.abs(account.balance)
    }
  })

  const netWorth = totalAssets - totalLiabilities

  return {
    netWorth,
    totalAssets,
    totalLiabilities,
    monthlyCashFlow: 4567.89,
    netWorthChange: 12.5,
    assetsChange: 8.2,
    liabilitiesChange: -5.3,
  }
}

// Mock chart data for dashboard
export const netWorthChartData = [
  { month: 'Dec', value: 620000 },
  { month: 'Jan', value: 635000 },
  { month: 'Feb', value: 628000 },
  { month: 'Mar', value: 650000 },
  { month: 'Apr', value: 662000 },
  { month: 'May', value: 675000 },
  { month: 'Jun', value: 685000 },
  { month: 'Jul', value: 698000 },
  { month: 'Aug', value: 712000 },
  { month: 'Sep', value: 720000 },
  { month: 'Oct', value: 730000 },
  { month: 'Nov', value: 726684 },
]

export const assetAllocationData = [
  { name: 'Property', value: 450000, color: '#F59E0B' },
  { name: 'Investments', value: 156789, color: '#A855F7' },
  { name: 'Savings', value: 87543, color: '#10B981' },
  { name: 'Checking', value: 45678, color: '#3B82F6' },
  { name: 'Cash', value: 11234, color: '#14B8A6' },
]

export const monthlyExpensesData = [
  { category: 'Housing', amount: 2450, budget: 2500 },
  { category: 'Transportation', amount: 1230, budget: 1500 },
  { category: 'Food & Dining', amount: 890, budget: 800 },
  { category: 'Shopping', amount: 560, budget: 600 },
  { category: 'Entertainment', amount: 340, budget: 400 },
]

export const portfolioPerformanceData = [
  { month: 'Dec', value: 115000 },
  { month: 'Jan', value: 118000 },
  { month: 'Feb', value: 122000 },
  { month: 'Mar', value: 125000 },
  { month: 'Apr', value: 128000 },
  { month: 'May', value: 132000 },
  { month: 'Jun', value: 135000 },
  { month: 'Jul', value: 142000 },
  { month: 'Aug', value: 138000 },
  { month: 'Sep', value: 148000 },
  { month: 'Oct', value: 152000 },
  { month: 'Nov', value: 156789 },
]

// Financial Health Score data
export const financialHealthScore = {
  overall: 78,
  subScores: {
    savingsRate: 85,
    debtToIncome: 72,
    emergencyFund: 90,
    investmentDiversification: 65,
  },
  recommendations: [
    'Consider increasing investment diversification across more sectors',
    'Your emergency fund is strong - great job!',
    'Try to reduce debt-to-income ratio by 5% this quarter',
  ],
  benchmark: {
    yourScore: 78,
    avgForAgeGroup: 72,
    ageGroup: '30-40',
  },
  history: [
    { month: 'Aug', score: 72 },
    { month: 'Sep', score: 74 },
    { month: 'Oct', score: 76 },
    { month: 'Nov', score: 78 },
  ],
}

// Alerts and Notifications
export const dashboardAlerts = [
  {
    id: '1',
    type: 'bill' as const,
    severity: 'warning' as const,
    title: 'Upcoming Bill Due',
    message: 'Mortgage payment due in 3 days',
    amount: 2450,
    dueDate: new Date(2024, 11, 15),
  },
  {
    id: '2',
    type: 'balance' as const,
    severity: 'info' as const,
    title: 'Low Balance Warning',
    message: 'Checking account balance below $1,000',
    amount: 867,
    accountName: 'Chase Checking',
  },
  {
    id: '3',
    type: 'budget' as const,
    severity: 'warning' as const,
    title: 'Budget Alert',
    message: 'Food & Dining category at 95% of budget',
    category: 'Food & Dining',
    percentage: 95,
  },
  {
    id: '4',
    type: 'investment' as const,
    severity: 'success' as const,
    title: 'Portfolio Performance',
    message: 'Your portfolio gained 3.2% this month',
    percentage: 3.2,
  },
]

// Cash Flow Calendar data
export const cashFlowCalendarData = [
  { date: new Date(2024, 11, 1), type: 'income' as const, amount: 8500, description: 'Salary Deposit', category: 'Income' },
  { date: new Date(2024, 11, 5), type: 'expense' as const, amount: 1200, description: 'Rent Payment', category: 'Housing' },
  { date: new Date(2024, 11, 10), type: 'expense' as const, amount: 450, description: 'Utilities', category: 'Housing' },
  { date: new Date(2024, 11, 15), type: 'income' as const, amount: 500, description: 'Freelance Income', category: 'Income' },
  { date: new Date(2024, 11, 15), type: 'expense' as const, amount: 2450, description: 'Mortgage Payment', category: 'Housing' },
  { date: new Date(2024, 11, 20), type: 'expense' as const, amount: 350, description: 'Car Insurance', category: 'Transportation' },
  { date: new Date(2024, 11, 25), type: 'income' as const, amount: 150, description: 'Dividend Income', category: 'Investment' },
]

// Savings Goals data
export const savingsGoals = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 50000,
    currentAmount: 45000,
    targetDate: new Date(2025, 2, 1),
    icon: 'shield',
    color: '#10B981',
    monthlyContribution: 2500,
    onTrack: true,
  },
  {
    id: '2',
    name: 'Vacation to Europe',
    targetAmount: 8000,
    currentAmount: 3200,
    targetDate: new Date(2025, 5, 1),
    icon: 'plane',
    color: '#3B82F6',
    monthlyContribution: 800,
    onTrack: false,
  },
  {
    id: '3',
    name: 'New Car Down Payment',
    targetAmount: 15000,
    currentAmount: 8500,
    targetDate: new Date(2025, 8, 1),
    icon: 'car',
    color: '#F59E0B',
    monthlyContribution: 1000,
    onTrack: true,
  },
  {
    id: '4',
    name: 'Home Renovation',
    targetAmount: 25000,
    currentAmount: 12000,
    targetDate: new Date(2026, 0, 1),
    icon: 'home',
    color: '#8B5CF6',
    monthlyContribution: 1200,
    onTrack: true,
  },
]

// Sparkline data for stat cards (last 7 days trend)
export const statSparklineData = {
  netWorth: [720000, 722000, 724000, 723000, 725000, 726000, 726684],
  totalAssets: [780000, 782000, 784000, 783000, 785000, 786000, 786684],
  totalLiabilities: [60000, 60000, 60000, 60000, 60000, 60000, 60000],
  monthlyCashFlow: [4200, 4350, 4400, 4500, 4550, 4600, 4567.89],
}
