// Real hook: useTransactions
// Calls the real API when backend is available
import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { QUERY_KEYS } from '@/utils/constants'

export function useTransactions() {
    return useQuery({
        queryKey: QUERY_KEYS.transactions,
        queryFn: async () => {
            const client = await createApiClient()
            const res = await client.getTransactions()
            return res.data
        },
    })
}
