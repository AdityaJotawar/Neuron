// Real hook: useAccounts
// Calls the real API when backend is available
import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { QUERY_KEYS } from '@/utils/constants'

export function useAccounts() {
    return useQuery({
        queryKey: QUERY_KEYS.accounts,
        queryFn: async () => {
            const client = await createApiClient('real')
            const res = await client.getAccounts()
            return res.data
        },
    })
}
