// API request/response types and contracts

export interface ApiResponse<T> {
    data: T
    success: boolean
    message?: string
    error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface ApiError {
    code: string
    message: string
    details?: Record<string, any>
}

// Request/Response types for specific endpoints
export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    user: {
        id: string
        email: string
        firstName: string
        lastName: string
    }
    accessToken: string
    refreshToken: string
}

export interface AccountResponse {
    id: string
    userId: string
    accountType: string
    name: string
    institution: string
    balance: number
    interestRate: number
    createdAt: string
    updatedAt: string
}

export interface TransactionResponse {
    id: string
    userId: string
    accountId: string
    type: string
    amount: number
    category: string
    description: string
    merchant?: string
    date: string
    createdAt: string
}

export interface BudgetResponse {
    id: string
    userId: string
    category: string
    amount: number
    period: string
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
}

export interface StockHoldingResponse {
    id: string
    userId: string
    accountId: string
    symbol: string
    companyName: string
    quantity: number
    purchasePrice: number
    purchaseDate: string
    currentPrice: number
    lastPriceUpdate: string
    createdAt: string
}

export interface DashboardStatsResponse {
    netWorth: number
    totalAssets: number
    totalLiabilities: number
    monthlyCashFlow: number
    netWorthChange: number
    assetsChange: number
    liabilitiesChange: number
}

export interface PortfolioStatsResponse {
    totalValue: number
    totalGainLoss: number
    returnPercentage: number
    todayChange: number
}

// Query parameters
export interface TransactionQueryParams {
    accountId?: string
    startDate?: string
    endDate?: string
    category?: string
    page?: number
    limit?: number
}

export interface AccountQueryParams {
    type?: string
    page?: number
    limit?: number
}