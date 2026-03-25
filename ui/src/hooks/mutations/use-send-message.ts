import { useMutation } from '@tanstack/react-query'
import { sendMessage } from '@/api/conversation'
import type { ConversationQueryRequest, ConversationQueryResponse } from '@/types/api'
import type { ApiError } from '@/api/client'

export function useSendMessage() {
  return useMutation<ConversationQueryResponse, ApiError, ConversationQueryRequest>({
    mutationFn: sendMessage,
  })
}
