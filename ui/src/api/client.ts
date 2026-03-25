/** Typed error class for API errors */
export class ApiError extends Error {
  status: number
  statusText: string
  data: unknown

  constructor(status: number, statusText: string, data: unknown) {
    super(`API Error ${status}: ${statusText}`)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}

/**
 * Base path for API requests.
 *
 * In development: Vite proxy intercepts "/api/*" and forwards to the backend
 * after stripping the "/api" prefix.
 * In production: uses VITE_API_BASE_URL or falls back to "/api" (expecting
 * a production reverse proxy).
 */
function getApiBase(): string {
  if (import.meta.env.DEV) {
    return '/api'
  }
  return import.meta.env.VITE_API_BASE_URL || '/api'
}

const API_BASE = getApiBase()

/** Fetch wrapper that parses JSON responses and throws ApiError on failure */
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
    },
  })

  if (!response.ok) {
    let data: unknown
    try {
      data = await response.json()
    } catch {
      data = await response.text()
    }
    throw new ApiError(response.status, response.statusText, data)
  }

  return response.json() as Promise<T>
}

/** Fetch wrapper that returns the raw Response — for future streaming support */
export async function apiClientRaw(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = `${API_BASE}${endpoint}`
  const response = await fetch(url, { ...options })

  if (!response.ok) {
    let data: unknown
    try {
      data = await response.json()
    } catch {
      data = await response.text()
    }
    throw new ApiError(response.status, response.statusText, data)
  }

  return response
}
