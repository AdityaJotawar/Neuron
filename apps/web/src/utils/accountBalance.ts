import type { Account, Transaction } from '../types/index.ts'

/**
 * Calculate the current balance of an account based on its initial balance
 * and all transactions associated with that account.
 *
 * @param account - The account with initial balance
 * @param transactions - All transactions for this account
 * @returns The calculated current balance
 */
export function calculateAccountBalance(account: Account, transactions: Transaction[]): number {
  // Start with the initial balance stored in the account
  const initialBalance = account.balance

  // Get all transactions for this account
  const accountTransactions = transactions.filter(t => t.accountId === account.id)

  // Calculate the sum of all transaction amounts
  // Positive amounts = deposits/income
  // Negative amounts = withdrawals/expenses
  const transactionSum = accountTransactions.reduce((sum, transaction) => {
    return sum + transaction.amount
  }, 0)

  // Current balance = initial balance + sum of all transactions
  return initialBalance + transactionSum
}

/**
 * Calculate balances for multiple accounts at once
 *
 * @param accounts - Array of accounts
 * @param transactions - All transactions
 * @returns Map of account ID to calculated balance
 */
export function calculateAccountBalances(
  accounts: Account[],
  transactions: Transaction[]
): Map<string, number> {
  const balanceMap = new Map<string, number>()

  accounts.forEach(account => {
    const balance = calculateAccountBalance(account, transactions)
    balanceMap.set(account.id, balance)
  })

  return balanceMap
}

/**
 * Get an account with its calculated current balance
 *
 * @param account - The account
 * @param transactions - All transactions
 * @returns Account object with updated balance
 */
export function getAccountWithCalculatedBalance(
  account: Account,
  transactions: Transaction[]
): Account {
  const calculatedBalance = calculateAccountBalance(account, transactions)

  return {
    ...account,
    balance: calculatedBalance,
  }
}

/**
 * Get all accounts with their calculated current balances
 *
 * @param accounts - Array of accounts
 * @param transactions - All transactions
 * @returns Array of accounts with updated balances
 */
export function getAccountsWithCalculatedBalances(
  accounts: Account[],
  transactions: Transaction[]
): Account[] {
  return accounts.map(account =>
    getAccountWithCalculatedBalance(account, transactions)
  )
}
