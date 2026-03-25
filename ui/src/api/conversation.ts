import type { ConversationQueryRequest, ConversationQueryResponse } from '@/types/api'
import { apiClient } from '@/api/client'

export async function sendMessage(
  request: ConversationQueryRequest,
): Promise<ConversationQueryResponse> {
  const formData = new FormData()
  formData.append('query', request.query)
  formData.append('role', request.role ?? 'user')

  if (request.messageId) {
    formData.append('message_id', request.messageId)
  }

  if (request.image) {
    formData.append('images', request.image)
  }

  const params = new URLSearchParams({
    conversation_id: request.conversationId,
  })

  return apiClient<ConversationQueryResponse>(`/conversation/query?${params.toString()}`, {
    method: 'POST',
    body: formData,
  })
}
