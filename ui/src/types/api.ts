/** Role of a message sender — aligned with backend ConversationRole */
export type ConversationRole = 'user' | 'assistant'

/** Request payload for POST /conversation/query (before FormData encoding) */
export interface ConversationQueryRequest {
  /** UUID for the conversation (sent as a query parameter) */
  conversationId: string
  /** The user's query text */
  query: string
  /** UUID for this message (optional — backend generates one if omitted) */
  messageId?: string
  /** Role of the sender */
  role?: ConversationRole
  /** Optional image file to attach */
  image?: File | null
  /** Whether this query originated from a suggestion chip */
  isFromSuggestion?: boolean
}

/** Response from POST /conversation/query */
export interface ConversationQueryResponse {
  response: string
}

/** Response from GET /utilities/ */
export interface HealthCheckResponse {
  status: string
  service: string
}

/** Generic API error shape from FastAPI */
export interface ApiErrorResponse {
  detail: string | { msg: string; type: string; loc: string[] }[]
}
