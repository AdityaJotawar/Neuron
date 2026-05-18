import { useState, useEffect, useMemo } from 'react';
import type { Transaction } from '@/types';

export function useTransactionPagination(items: Transaction[], itemsPerPage = 20) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((items?.length || 0) / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [items?.length]);

  const paginatedItems = useMemo(() => {
    if (!items) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage: setCurrentPage,
    nextPage: () => setCurrentPage(p => Math.min(p + 1, totalPages)),
    prevPage: () => setCurrentPage(p => Math.max(p - 1, 1)),
  };
}
