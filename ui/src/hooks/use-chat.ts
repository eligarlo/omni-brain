import { useCallback } from 'react'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { useSendMessage } from '@/hooks/mutations/use-send-message'
import { useConversationStore } from '@/stores/conversation-store'
import { useUIStore } from '@/stores/ui-store'
import type { ChatMessage } from '@/types/chat'
import type { PromptInputMessage } from '@/components/ai/prompt-input'

export function useChat() {
  const sendMessageMutation = useSendMessage()

  const activeConversationId = useConversationStore(s => s.activeConversationId)
  const messages = useConversationStore(s => s.getMessages())
  const status = useConversationStore(s => s.status)
  const addMessage = useConversationStore(s => s.addMessage)
  const updateMessageVersion = useConversationStore(s => s.updateMessageVersion)
  const setStatus = useConversationStore(s => s.setStatus)
  const createConversation = useConversationStore(s => s.createConversation)

  const resetPromptInput = useUIStore(s => s.resetPromptInput)

  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      const hasText = Boolean(message.text)
      const hasAttachments = Boolean(message.files?.length)
      if (!(hasText || hasAttachments)) return

      // Ensure we have a conversation
      let convId = activeConversationId
      if (!convId) {
        convId = createConversation()
      }

      // 1. Add optimistic user message
      const userMessage: ChatMessage = {
        key: nanoid(),
        from: 'user',
        versions: [{ id: nanoid(), content: message.text || 'Sent with attachments' }],
      }
      addMessage(userMessage)
      setStatus('submitted')
      resetPromptInput()

      if (message.files?.length) {
        toast.success('Files attached', {
          description: `${message.files.length} file(s) attached to message`,
        })
      }

      // 2. Add optimistic empty assistant message (placeholder)
      const assistantMessageKey = nanoid()
      const assistantVersionId = nanoid()
      const assistantMessage: ChatMessage = {
        key: assistantMessageKey,
        from: 'assistant',
        versions: [{ id: assistantVersionId, content: '' }],
      }
      addMessage(assistantMessage)

      // 3. Extract the first image file if present
      let image: File | undefined
      const imageFile = message.files?.find(f => f.mediaType?.startsWith('image/') && f.url)
      if (imageFile?.url) {
        try {
          const res = await fetch(imageFile.url)
          const blob = await res.blob()
          image = new File([blob], imageFile.filename ?? 'image', {
            type: imageFile.mediaType,
          })
        } catch {
          // If conversion fails, send without image
        }
      }

      // 4. Call the API
      try {
        setStatus('streaming')

        const result = await sendMessageMutation.mutateAsync({
          conversationId: convId,
          query: message.text,
          ...(image ? { image } : {}),
        })

        // 5. Update assistant message with actual response
        updateMessageVersion(assistantMessageKey, assistantVersionId, result.response)
        setStatus('ready')
      } catch (error) {
        setStatus('error')
        updateMessageVersion(
          assistantMessageKey,
          assistantVersionId,
          'Sorry, an error occurred. Please try again.',
        )
        toast.error('Failed to send message', {
          description: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    },
    [
      activeConversationId,
      addMessage,
      createConversation,
      resetPromptInput,
      sendMessageMutation,
      setStatus,
      updateMessageVersion,
    ],
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      handleSubmit({ text: suggestion, files: [] })
    },
    [handleSubmit],
  )

  return {
    messages,
    status,
    handleSubmit,
    handleSuggestionClick,
    isLoading: sendMessageMutation.isPending,
  }
}
