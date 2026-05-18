// Real hook: useBudgets
import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { QUERY_KEYS } from '@/utils/constants'

export function useBudgets() {
    return useQuery({
        queryKey: QUERY_KEYS.budgets,
        queryFn: async () => {
            const client = await createApiClient()
            const res = await client.getBudgets()
            return res.data
        },
    })
}
