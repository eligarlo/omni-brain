import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { createQueryClient } from '@/lib/query-client'
import { useConversationStore } from '@/stores/conversation-store'

function ConversationInitializer({ children }: { children: ReactNode }) {
  const activeConversationId = useConversationStore(s => s.activeConversationId)
  const createConversation = useConversationStore(s => s.createConversation)

  useEffect(() => {
    if (!activeConversationId) {
      createConversation()
    }
  }, [activeConversationId, createConversation])

  return children
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ConversationInitializer>{children}</ConversationInitializer>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
