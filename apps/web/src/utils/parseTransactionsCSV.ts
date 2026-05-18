import type { Transaction, Account } from '@/types';

export function parseTransactionsCSV(
  csvText: string,
  accounts: Account[]
): Omit<Transaction, 'id' | 'createdAt' | 'userId'>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const result: Omit<Transaction, 'id' | 'createdAt' | 'userId'>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj: Record<string, any> = {};

    headers.forEach((header, idx) => {
      obj[header] = values[idx];
    });

    const accountName = obj.account || accounts[0]?.name || '';
    const account = accounts.find(a => a.name === accountName) || accounts[0];

    result.push({
      accountId: account?.id || '',
      description: obj.description || '',
      type: (obj.type || 'purchase') as any,
      amount: parseFloat(obj.amount) || 0,
      date: new Date(obj.date),
      category: 'other' as const,
      merchant: obj.merchant,
      importId: `import_${Date.now()}`,
    });
  }

  return result;
}
