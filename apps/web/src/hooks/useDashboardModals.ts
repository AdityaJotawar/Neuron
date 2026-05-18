import { useState, useMemo } from 'react';
import type { Account } from '@/types';
import type { useDashboardData } from './useDashboardData';

export function useDashboardModals(data: ReturnType<typeof useDashboardData>) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const selectedAccountTransactions = useMemo(() => {
    if (!selectedAccount || !data.transactions) return [];
    return data.transactions.filter((tx) => tx.accountId === selectedAccount.id);
  }, [selectedAccount, data.transactions]);

  const selectedAccountHoldings = useMemo(() => {
    if (!selectedAccount || !data.stockHoldings) return [];
    return data.stockHoldings.filter((h) => h.accountId === selectedAccount.id);
  }, [selectedAccount, data.stockHoldings]);

  return {
    selectedAccount,
    setSelectedAccount,
    onAccountSelect: (account: Account) => {
      setSelectedAccount(account);
      setIsAccountModalOpen(true);
    },
    isAccountModalOpen,
    setIsModalOpen: setIsAccountModalOpen,
    onAccountModalOpen: () => setIsAccountModalOpen(true),
    onAccountModalClose: () => {
      setIsAccountModalOpen(false);
      setSelectedAccount(null);
    },
    isTransactionModalOpen,
    onTransactionModalOpen: () => setIsTransactionModalOpen(true),
    onTransactionModalClose: () => setIsTransactionModalOpen(false),
    selectedAccountTransactions,
    selectedAccountHoldings,
  };
}
