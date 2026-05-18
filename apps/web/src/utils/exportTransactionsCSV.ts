import type { Transaction } from '@/types';

export function exportTransactionsCSV(
  transactions: Transaction[],
  getAccountName: (id: string) => string
): void {
  const headers = ['Date', 'Account', 'Description', 'Type', 'Amount'];
  const rows = transactions.map((tx) => [
    new Date(tx.date).toLocaleDateString(),
    getAccountName(tx.accountId),
    tx.description,
    tx.type,
    tx.amount.toString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_export_${dateStr}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
