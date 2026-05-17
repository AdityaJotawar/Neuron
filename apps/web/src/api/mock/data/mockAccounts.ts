import type { Account } from '../../../types/index.ts'

// NOTE: The 'balance' field now represents the INITIAL balance of the account.
// The current balance should be calculated by adding all transactions to this initial balance.
// Use the accountBalance utility functions to get the current calculated balance.

export const mockAccounts: Account[] = [
  {
    id: '1',
    userId: 'user1',
    accountType: 'savings',
    name: 'USD Cash',
    institution: 'Cash',
    balance: 11234.50, // Initial balance (no transactions for this account)
    interestRate: 0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-11-22'),
    savingsMetrics: {
      interestEarnedYTD: 0,
      apy: 0,
    },
  },
  {
    id: '2',
    userId: 'user1',
    accountType: 'checking',
    name: 'Chase Checking',
    institution: 'Chase Bank',
    balance: 43598.40, // Initial balance (transactions will add/subtract from this)
    interestRate: 0.01,
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2025-11-22'),
    checkingMetrics: {
      monthlyFees: 0,
      availableBalance: 45578.90,
    },
  },
  {
    id: '3',
    userId: 'user1',
    accountType: 'savings',
    name: 'High Yield Savings',
    institution: 'Marcus by Goldman Sachs',
    balance: 87043.21, // Initial balance (interest payment will be added via transaction)
    interestRate: 4.5,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2025-11-22'),
    savingsMetrics: {
      interestEarnedYTD: 3621.45,
      apy: 4.5,
    },
  },
  {
    id: '4',
    userId: 'user1',
    accountType: 'loan',
    name: 'Car Loan',
    institution: 'Toyota Financial',
    balance: -23910.00, // Initial balance (loan payment will be subtracted via transaction)
    interestRate: 4.9,
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2025-11-22'),
    loanDetails: {
      originalAmount: 35000,
      remainingBalance: 24560,
      monthlyPayment: 650,
      interestRate: 4.9,
      payoffDate: new Date('2027-08-15'),
      loanType: 'Auto Loan',
    },
    loanMetrics: {
      interestPaidThisMonth: 100.27,
      principalPaidThisMonth: 549.73,
    },
  },
  {
    id: '5',
    userId: 'user1',
    accountType: 'trading',
    name: 'Fidelity Portfolio',
    institution: 'Fidelity Investments',
    balance: 155789.45, // Initial balance (investment contribution will be added via transaction)
    interestRate: 0,
    createdAt: new Date('2022-01-10'),
    updatedAt: new Date('2025-11-22'),
    tradingMetrics: {
      totalGainLoss: 23456.78,
      returnRate: 17.6,
    },
  },
  {
    id: '6',
    userId: 'user1',
    accountType: 'property',
    name: 'Main Residence',
    institution: 'Real Estate',
    balance: 450000.00, // Initial balance (no transactions for property accounts)
    interestRate: 0,
    createdAt: new Date('2020-05-01'),
    updatedAt: new Date('2025-11-22'),
    propertyDetails: {
      address: '123 Main St, San Francisco, CA 94102',
      propertyType: 'Primary Residence',
      purchasePrice: 400000,
      purchaseDate: new Date('2020-05-01'),
      currentValue: 450000,
      mortgageBalance: 0,
      monthlyMortgage: 0,
      rentalIncome: 0,
      propertyTax: 5400,
      insurance: 1200,
    },
    propertyMetrics: {
      equity: 450000,
      appreciationRate: 12.5,
    },
  },
]

export const getAccountsByType = (type: string) => {
  if (type === 'all') return mockAccounts
  return mockAccounts.filter(account => account.accountType === type)
}

export const getTotalsByType = () => {
  const totals = {
    savings: 0,
    checking: 0,
    loans: 0,
    trading: 0,
    property: 0,
  }

  mockAccounts.forEach(account => {
    switch (account.accountType) {
      case 'savings':
        totals.savings += account.balance
        break
      case 'checking':
        totals.checking += account.balance
        break
      case 'loan':
        totals.loans += account.balance
        break
      case 'trading':
        totals.trading += account.balance
        break
      case 'property':
        totals.property += account.balance
        break
    }
  })

  return totals
}
