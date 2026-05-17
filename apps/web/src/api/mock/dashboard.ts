// Mock API client for dashboard
import type { ApiResponse, DashboardStatsResponse } from '../types'
import { calculateDashboardStats } from './data/mockDashboard'

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

export async function getDashboardStats(): Promise<ApiResponse<DashboardStatsResponse>> {
    await delay()

    const stats = calculateDashboardStats()

    return {
        data: stats,
        success: true
    }
}