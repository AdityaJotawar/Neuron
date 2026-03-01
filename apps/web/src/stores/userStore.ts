import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    createdAt: Date
    updatedAt: Date
}

export interface UserPreferences {
    currency: string
    timezone: string
    notifications: {
        email: boolean
        push: boolean
        budgetAlerts: boolean
    }
    aiSettings: {
        conversationHistory: boolean
        personalizedInsights: boolean
    }
}

interface UserState {
    user: User | null
    isAuthenticated: boolean
    preferences: UserPreferences
    accessToken: string | null
    refreshToken: string | null

    // Actions
    setUser: (user: User, accessToken?: string, refreshToken?: string) => void
    updatePreferences: (prefs: Partial<UserPreferences>) => void
    logout: () => void
    setTokens: (accessToken: string, refreshToken: string) => void
    refreshAccessToken: (accessToken: string) => void
}

const defaultPreferences: UserPreferences = {
    currency: 'USD',
    timezone: 'UTC',
    notifications: {
        email: true,
        push: true,
        budgetAlerts: true
    },
    aiSettings: {
        conversationHistory: true,
        personalizedInsights: true
    }
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            preferences: defaultPreferences,
            accessToken: null,
            refreshToken: null,

            setUser: (user, accessToken, refreshToken) => set({
                user,
                isAuthenticated: true,
                accessToken: accessToken || get().accessToken,
                refreshToken: refreshToken || get().refreshToken
            }),

            updatePreferences: (prefs) => set((state) => ({
                preferences: { ...state.preferences, ...prefs }
            })),

            logout: () => set({
                user: null,
                isAuthenticated: false,
                accessToken: null,
                refreshToken: null
            }),

            setTokens: (accessToken, refreshToken) => set({
                accessToken,
                refreshToken
            }),

            refreshAccessToken: (accessToken) => set({
                accessToken
            })
        }),
        {
            name: 'neuron-user-storage',
            partialize: (state) => ({
                user: state.user,
                preferences: state.preferences,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)
