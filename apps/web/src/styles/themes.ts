// Theme configuration and design tokens
export const themes = {
    light: {
        colors: {
            primary: {
                50: '#eff6ff',
                100: '#dbeafe',
                500: '#3b82f6',
                600: '#2563eb',
                700: '#1d4ed8',
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
            emerald: {
                500: '#10b981',
            },
            red: {
                500: '#ef4444',
                600: '#dc2626',
                700: '#b91c1c',
            },
            blue: {
                500: '#3b82f6',
            },
            purple: {
                500: '#8b5cf6',
            },
        },
        borderRadius: {
            sm: '0.25rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
        },
    },
}

export type Theme = typeof themes.light