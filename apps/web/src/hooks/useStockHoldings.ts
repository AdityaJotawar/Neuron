// Real hook: useStockHoldings
import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { QUERY_KEYS } from '@/utils/constants'

export function useStockHoldings() {
    return useQuery({
        queryKey: QUERY_KEYS.stockHoldings,
        queryFn: async () => {
            const client = await createApiClient()
            const res = await client.getStockHoldings()
            return res.data
        },
    })
}
