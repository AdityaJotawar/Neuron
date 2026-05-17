import type { Transaction } from '../../../types/index.ts'

export const mockTransactions: Transaction[] = [
  // Recent transactions (Today)
  {
    id: 't1',
    userId: 'user1',
    accountId: '2',
    type: 'purchase',
    amount: -45.50,
    category: 'food',
    description: 'Starbucks Coffee',
    merchant: 'Starbucks',
    date: new Date('2025-11-22T08:30:00'),
    createdAt: new Date('2025-11-22T08:30:00'),
  },
  {
    id: 't2',
    userId: 'user1',
    accountId: '2',
    type: 'purchase',
    amount: -125.00,
    category: 'shopping',
    description: 'Amazon Purchase',
    merchant: 'Amazon',
    date: new Date('2025-11-22T14:20:00'),
    createdAt: new Date('2025-11-22T14:20:00'),
  },
  // Yesterday
  {
    id: 't3',
    userId: 'user1',
    accountId: '2',
    type: 'deposit',
    amount: 5000.00,
    category: 'salary',
    description: 'Monthly Salary',
    merchant: 'Tech Corp Inc',
    date: new Date('2025-11-21T09:00:00'),
    createdAt: new Date('2025-11-21T09:00:00'),
  },
  {
    id: 't4',
    userId: 'user1',
    accountId: '2',
    type: 'purchase',
    amount: -89.99,
    category: 'food',
    description: 'Whole Foods Groceries',
    merchant: 'Whole Foods',
    date: new Date('2025-11-21T18:45:00'),
    createdAt: new Date('2025-11-21T18:45:00'),
  },
  {
    id: 't5',
    userId: 'user1',
    accountId: '4',
    type: 'withdrawal',
    amount: -650.00,
    category: 'financial',
    description: 'Car Loan Payment',
    merchant: 'Toyota Financial',
    date: new Date('2025-11-21T10:00:00'),
    createdAt: new Date('2025-11-21T10:00:00'),
  },
  // Nov 20
  {
    id: 't6',
    userId: 'user1',
    accountId: '2',
    type: 'purchase',
    amount: -2450.00,
    category: 'housing',
    description: 'Rent Payment',
    merchant: 'Property Management Co',
    date: new Date('2025-11-20T08:00:00'),
    createdAt: new Date('2025-11-20T08:00:00'),
  },
  {
    id: 't7',
    userId: 'user1',
    accountId: '2',
    type: 'purchase',
    amount: -65.00,
    category: 'entertainment',
    description: 'Movie Tickets',
    merchant: 'AMC Theaters',
    date: new Date('2025-11-20T19:30:00'),
    createdAt: new Date('2025-11-20T19:30:00'),
  },
  // Nov 19
  {
    id: 't8',
    userId: 'user1',
    accountId: '2',
    type: 'purchase',
    amount: -150.00,
    category: 'utilities',
    description: 'Electric Bill',
    merchant: 'PG&E',
    date: new Date('2025-11-19T12:00:00'),
    createdAt: new Date('2025-11-19T12:00:00'),
  },
  {
    id: 't9',
    userId: 'user1',
    accountId: '2',
    type: 'purchase',
    amount: -55.00,
    category: 'transportation',
    description: 'Gas Station',
    merchant: 'Shell',
    date: new Date('2025-11-19T17:15:00'),
    createdAt: new Date('2025-11-19T17:15:00'),
  },
  // Nov 18
  {
    id: 't10',
    userId: 'user1',
    accountId: '2',
    type: 'purchase',
    amount: -230.00,
    category: 'healthcare',
    description: 'Dentist Appointment',
    merchant: 'Family Dental',
    date: new Date('2025-11-18T14:00:00'),
    createdAt: new Date('2025-11-18T14:00:00'),
  },
  {
    id: 't11',
    userId: 'user1',
    accountId: '2',
    type: 'purchase',
    amount: -42.50,
    category: 'food',
    description: 'Restaurant Dinner',
    merchant: 'Italian Kitchen',
    date: new Date('2025-11-18T19:45:00'),
    createdAt: new Date('2025-11-18T19:45:00'),
  },
  // Investment transactions
  {
    id: 't12',
    userId: 'user1',
    accountId: '5',
    type: 'deposit',
    amount: 1000.00,
    category: 'financial',
    description: 'Investment Contribution',
    date: new Date('2025-11-15T10:00:00'),
    createdAt: new Date('2025-11-15T10:00:00'),
  },
  {
    id: 't13',
    userId: 'user1',
    accountId: '3',
    type: 'deposit',
    amount: 500.00,
    category: 'investment-income',
    description: 'Interest Payment',
    merchant: 'Marcus by Goldman Sachs',
    date: new Date('2025-11-01T00:00:00'),
    createdAt: new Date('2025-11-01T00:00:00'),
  },
]

export const getTransactionsByDateRange = (startDate: Date, endDate: Date) => {
  return mockTransactions.filter(t => t.date >= startDate && t.date <= endDate)
}

export const getTransactionsByAccount = (accountId: string) => {
  return mockTransactions.filter(t => t.accountId === accountId)
}

export const getTransactionsByCategory = (category: string) => {
  return mockTransactions.filter(t => t.category === category)
}
