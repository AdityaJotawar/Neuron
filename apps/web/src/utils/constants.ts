// App-wide constants: colors, query keys, routes
// (Consolidates content previously in src/styles/themes.ts)

export const THEME_COLORS = {
    primary: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        500: '#10B981',
        600: '#059669',
        700: '#047857',
    },
    slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        600: '#475569',
        700: '#334155',
        900: '#0f172a',
    },
    emerald: { 500: '#10b981' },
    red: { 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
    blue: { 500: '#3b82f6' },
    purple: { 500: '#8b5cf6' },
} as const

export const QUERY_KEYS = {
    accounts: ['accounts'] as const,
    transactions: ['transactions'] as const,
    budgets: ['budgets'] as const,
    stockHoldings: ['stockHoldings'] as const,
    dashboard: ['dashboard'] as const,
} as const

export const ROUTES = {
    dashboard: '/',
    accounts: '/accounts',
    transactions: '/transactions',
    portfolio: '/portfolio',
    budget: '/budget',
    reports: '/reports',
    imports: '/imports',
    chat: '/chat',
    settings: '/settings',
} as const
