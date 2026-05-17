import type { ImportHistory, ColumnMapping } from '../../../types/index.ts'

export const mockImportHistory: ImportHistory[] = [
  {
    id: 'import-1',
    userId: 'user-123',
    fileName: 'chase_transactions_oct_2024.csv',
    fileType: 'transactions',
    status: 'completed',
    totalRows: 156,
    successfulRows: 156,
    failedRows: 0,
    uploadedAt: new Date('2024-10-15T10:30:00'),
    completedAt: new Date('2024-10-15T10:30:15'),
    accountId: 'account-1',
    accountName: 'Chase Checking',
  },
  {
    id: 'import-2',
    userId: 'user-123',
    fileName: 'wells_fargo_sept_2024.csv',
    fileType: 'transactions',
    status: 'completed',
    totalRows: 89,
    successfulRows: 87,
    failedRows: 2,
    uploadedAt: new Date('2024-09-20T14:45:00'),
    completedAt: new Date('2024-09-20T14:45:12'),
    accountId: 'account-2',
    accountName: 'Wells Fargo Savings',
  },
  {
    id: 'import-3',
    userId: 'user-123',
    fileName: 'robinhood_portfolio.csv',
    fileType: 'stock_holdings',
    status: 'completed',
    totalRows: 12,
    successfulRows: 12,
    failedRows: 0,
    uploadedAt: new Date('2024-09-10T09:15:00'),
    completedAt: new Date('2024-09-10T09:15:05'),
    accountId: 'account-5',
    accountName: 'Robinhood Trading',
  },
  {
    id: 'import-4',
    userId: 'user-123',
    fileName: 'bank_statement_aug_2024.csv',
    fileType: 'transactions',
    status: 'failed',
    totalRows: 200,
    successfulRows: 0,
    failedRows: 200,
    errorMessage: 'Invalid date format in row 5. Expected YYYY-MM-DD.',
    uploadedAt: new Date('2024-08-25T16:20:00'),
    completedAt: new Date('2024-08-25T16:20:08'),
    accountId: 'account-1',
    accountName: 'Chase Checking',
  },
  {
    id: 'import-5',
    userId: 'user-123',
    fileName: 'credit_card_july_2024.csv',
    fileType: 'transactions',
    status: 'completed',
    totalRows: 45,
    successfulRows: 43,
    failedRows: 2,
    uploadedAt: new Date('2024-07-30T11:00:00'),
    completedAt: new Date('2024-07-30T11:00:07'),
    accountId: 'account-3',
    accountName: 'Capital One Credit',
  },
]

// Transaction field mappings
export const transactionFieldMappings: ColumnMapping[] = [
  { csvColumn: 'Date', appField: 'date', required: true },
  { csvColumn: 'Description', appField: 'description', required: true },
  { csvColumn: 'Amount', appField: 'amount', required: true },
  { csvColumn: 'Type', appField: 'type', required: true },
  { csvColumn: 'Category', appField: 'category', required: false },
  { csvColumn: 'Merchant', appField: 'merchant', required: false },
]

// Stock holdings field mappings
export const stockHoldingsFieldMappings: ColumnMapping[] = [
  { csvColumn: 'Symbol', appField: 'symbol', required: true },
  { csvColumn: 'Company Name', appField: 'companyName', required: true },
  { csvColumn: 'Quantity', appField: 'quantity', required: true },
  { csvColumn: 'Purchase Price', appField: 'purchasePrice', required: true },
  { csvColumn: 'Purchase Date', appField: 'purchaseDate', required: true },
]

// Account field mappings
export const accountFieldMappings: ColumnMapping[] = [
  { csvColumn: 'Account Name', appField: 'name', required: true },
  { csvColumn: 'Institution', appField: 'institution', required: true },
  { csvColumn: 'Account Type', appField: 'accountType', required: true },
  { csvColumn: 'Balance', appField: 'balance', required: true },
  { csvColumn: 'Account Number', appField: 'accountNumber', required: false },
  { csvColumn: 'Interest Rate', appField: 'interestRate', required: false },
]

// Helper function to get field mappings by file type
export function getFieldMappingsByType(fileType: string): ColumnMapping[] {
  switch (fileType) {
    case 'transactions':
      return transactionFieldMappings
    case 'stock_holdings':
      return stockHoldingsFieldMappings
    case 'accounts':
      return accountFieldMappings
    default:
      return []
  }
}

// Helper function to get import history sorted by date
export function getSortedImportHistory(): ImportHistory[] {
  return [...mockImportHistory].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
}
