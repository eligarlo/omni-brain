import type { HealthCheckResponse } from '@/types/api'
import { apiClient } from '@/api/client'

/** Health check against the utilities endpoint */
export async function getHealthCheck(): Promise<HealthCheckResponse> {
  return apiClient<HealthCheckResponse>('/utilities/')
}
