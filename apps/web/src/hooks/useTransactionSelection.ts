import { useState, useMemo } from 'react';
import type { Transaction } from '@/types';

export function useTransactionSelection(pageItems: Transaction[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectOne = (id: string) => {
    setSelectedIds(prev => new Set(prev).add(id));
  };

  const deselectOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(pageItems.map(item => item.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const isAllSelected = useMemo(
    () => selectedIds.size === pageItems.length && pageItems.length > 0,
    [selectedIds.size, pageItems.length]
  );

  return {
    selectedIds,
    selectOne,
    deselectOne,
    selectAll,
    clearSelection,
    isAllSelected,
  };
}
