import type { ApiClient, ApiResponse } from '../client'
import type { Account, Transaction, Budget, StockHolding, PortfolioStats, DashboardStats } from '../../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

function camelToSnake(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (obj instanceof Date) return obj.toISOString();
    if (Array.isArray(obj)) return obj.map(camelToSnake);
    if (typeof obj === 'object') {
        const result: any = {};
        for (const key of Object.keys(obj)) {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            result[snakeKey] = camelToSnake(obj[key]);
        }
        return result;
    }
    return obj;
}

const NUMERIC_KEYS = new Set([
    'balance', 'interestRate', 'amount', 'apy', 'quantity', 'purchasePrice',
    'currentPrice', 'originalAmount', 'remainingBalance', 'monthlyPayment',
    'interestEarnedYTD', 'monthlyFees', 'availableBalance', 'interestPaidThisMonth',
    'principalPaidThisMonth', 'totalGainLoss', 'returnRate', 'equity',
    'appreciationRate', 'monthlyMortgage', 'rentalIncome', 'propertyTax',
    'insurance', 'currentValue', 'totalValue', 'totalCostBasis', 'returnPercentage',
    'todayChange', 'spent', 'netWorth', 'totalAssets', 'totalLiabilities',
    'monthlyCashFlow', 'netWorthChange', 'assetsChange', 'liabilitiesChange'
]);

function snakeToCamel(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(snakeToCamel);
    if (typeof obj === 'object') {
        const result: any = {};
        for (const key of Object.keys(obj)) {
            const camelKey = key.replace(/([-_][a-z])/g, group =>
                group.toUpperCase().replace('-', '').replace('_', '')
            );
            let val = obj[key];
            
            if (typeof val === 'string') {
                if (NUMERIC_KEYS.has(camelKey)) {
                    val = Number(val);
                } else if (
                    (camelKey.endsWith('At') || camelKey.endsWith('Date') || camelKey.endsWith('Update') || camelKey === 'date') &&
                    !isNaN(Date.parse(val))
                ) {
                    val = new Date(val);
                }
            } else {
                val = snakeToCamel(val);
            }
            result[camelKey] = val;
        }
        return result;
    }
    return obj;
}

async function request<T>(
    path: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (response.status === 204) {
            return { success: true, data: undefined as unknown as T };
        }

        const json = await response.json();
        const camelData = snakeToCamel(json);

        if (!response.ok) {
            return {
                success: false,
                data: null as unknown as T,
                error: camelData.error || response.statusText,
            };
        }

        return camelData;
    } catch (e: any) {
        return {
            success: false,
            data: null as unknown as T,
            error: e.message || 'Network error',
        };
    }
}

export function createRealApiClient(): ApiClient {
    return {
        // Dashboard
        async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
            return request<DashboardStats>('/api/v1/dashboard/stats')
        },

        // Accounts
        async getAccounts(): Promise<ApiResponse<Account[]>> {
            return request<Account[]>('/api/v1/accounts')
        },

        async getAccount(id: string): Promise<ApiResponse<Account>> {
            return request<Account>(`/api/v1/accounts/${id}`)
        },

        async createAccount(account: Omit<Account, 'id'>): Promise<ApiResponse<Account>> {
            return request<Account>('/api/v1/accounts', {
                method: 'POST',
                body: JSON.stringify(camelToSnake(account)),
            })
        },

        async updateAccount(id: string, updates: Partial<Account>): Promise<ApiResponse<Account>> {
            return request<Account>(`/api/v1/accounts/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(camelToSnake(updates)),
            })
        },

        // Transactions
        async getTransactions(params?: {
            accountId?: string
            startDate?: Date
            endDate?: Date
            category?: string
        }): Promise<ApiResponse<Transaction[]>> {
            const queryParams = new URLSearchParams()
            if (params) {
                if (params.accountId) queryParams.append('account_id', params.accountId)
                if (params.startDate) queryParams.append('start_date', params.startDate.toISOString())
                if (params.endDate) queryParams.append('end_date', params.endDate.toISOString())
                if (params.category) queryParams.append('category', params.category)
            }
            const path = `/api/v1/transactions?${queryParams.toString()}`
            return request<Transaction[]>(path)
        },

        async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
            return request<Transaction>(`/api/v1/transactions/${id}`)
        },

        async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<ApiResponse<Transaction>> {
            return request<Transaction>('/api/v1/transactions', {
                method: 'POST',
                body: JSON.stringify(camelToSnake(transaction)),
            })
        },

        async updateTransaction(id: string, updates: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
            return request<Transaction>(`/api/v1/transactions/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(camelToSnake(updates)),
            })
        },

        async deleteTransaction(id: string): Promise<ApiResponse<void>> {
            return request<void>(`/api/v1/transactions/${id}`, {
                method: 'DELETE',
            })
        },

        async bulkCreateTransactions(transactions: Array<Omit<Transaction, 'id'>>): Promise<ApiResponse<Transaction[]>> {
            return request<Transaction[]>('/api/v1/transactions/bulk', {
                method: 'POST',
                body: JSON.stringify(camelToSnake({ transactions })),
            })
        },

        async bulkDeleteTransactions(ids: string[]): Promise<ApiResponse<void>> {
            return request<void>('/api/v1/transactions/bulk-delete', {
                method: 'POST',
                body: JSON.stringify(camelToSnake({ ids })),
            })
        },

        // Budgets
        async getBudgets(): Promise<ApiResponse<Budget[]>> {
            return request<Budget[]>('/api/v1/budgets')
        },

        async getBudget(id: string): Promise<ApiResponse<Budget>> {
            return request<Budget>(`/api/v1/budgets/${id}`)
        },

        async createBudget(budget: Omit<Budget, 'id'>): Promise<ApiResponse<Budget>> {
            return request<Budget>('/api/v1/budgets', {
                method: 'POST',
                body: JSON.stringify(camelToSnake(budget)),
            })
        },

        async updateBudget(id: string, updates: Partial<Budget>): Promise<ApiResponse<Budget>> {
            return request<Budget>(`/api/v1/budgets/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(camelToSnake(updates)),
            })
        },

        // Investments
        async getStockHoldings(): Promise<ApiResponse<StockHolding[]>> {
            return request<StockHolding[]>('/api/v1/portfolio/holdings')
        },

        async getPortfolioStats(): Promise<ApiResponse<PortfolioStats>> {
            return request<PortfolioStats>('/api/v1/portfolio/stats')
        },

        // Data Import/Export
        async uploadCSV(file: File): Promise<ApiResponse<{ importId: string; previewData: Transaction[] }>> {
            const formData = new FormData();
            formData.append('file', file);
            
            let fileType = 'transactions';
            if (file.name.toLowerCase().includes('holding')) {
                fileType = 'stock_holdings';
            } else if (file.name.toLowerCase().includes('account')) {
                fileType = 'accounts';
            }
            formData.append('fileType', fileType);
            
            try {
                const response = await fetch(`${BASE_URL}/api/v1/imports/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const json = await response.json();
                const camelData = snakeToCamel(json);

                if (!response.ok) {
                    return {
                        success: false,
                        data: null as any,
                        error: camelData.error || response.statusText,
                    };
                }

                return {
                    success: true,
                    data: {
                        importId: camelData.data.id,
                        previewData: [],
                    }
                };
            } catch (e: any) {
                return {
                    success: false,
                    data: null as any,
                    error: e.message || 'Network error',
                };
            }
        },

        async deleteImport(importId: string): Promise<ApiResponse<void>> {
            return request<void>(`/api/v1/imports/${importId}`, {
                method: 'DELETE',
            })
        },

        // AI Chat
        async sendChatMessage(message: string, sessionId?: string): Promise<ApiResponse<any>> {
            return request<any>('/api/v1/chat/message', {
                method: 'POST',
                body: JSON.stringify(camelToSnake({ message, sessionId })),
            })
        }
    }
}
