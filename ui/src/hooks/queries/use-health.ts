import { useQuery } from '@tanstack/react-query'
import { getHealthCheck } from '@/api/utilities'
import { queryKeys } from '@/lib/query-keys'

export function useHealthCheck() {
  return useQuery({
    queryKey: queryKeys.utilities.health,
    queryFn: getHealthCheck,
    staleTime: 30 * 1000,
  })
}
