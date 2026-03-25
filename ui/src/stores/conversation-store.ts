import { create } from 'zustand'
import type { ChatMessage, ChatStatus, Conversation } from '@/types/chat'

function generateConversationId(): string {
  return crypto.randomUUID()
}

interface ConversationState {
  conversations: Record<string, Conversation>
  activeConversationId: string | null
  status: ChatStatus

  getActiveConversation: () => Conversation | null
  getMessages: () => ChatMessage[]

  createConversation: () => string
  setActiveConversation: (id: string) => void
  setStatus: (status: ChatStatus) => void

  addMessage: (message: ChatMessage) => void
  updateMessageVersion: (messageKey: string, versionId: string, content: string) => void
  addMessageVersion: (messageKey: string, version: { id: string; content: string }) => void
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: {},
  activeConversationId: null,
  status: 'ready',

  getActiveConversation: () => {
    const { conversations, activeConversationId } = get()
    return activeConversationId ? (conversations[activeConversationId] ?? null) : null
  },

  getMessages: () => {
    const conversation = get().getActiveConversation()
    return conversation?.messages ?? []
  },

  createConversation: () => {
    const id = generateConversationId()
    const conversation: Conversation = {
      id,
      messages: [],
      createdAt: new Date().toISOString(),
    }
    set(state => ({
      conversations: { ...state.conversations, [id]: conversation },
      activeConversationId: id,
    }))
    return id
  },

  setActiveConversation: id => set({ activeConversationId: id }),
  setStatus: status => set({ status }),

  addMessage: message =>
    set(state => {
      const convId = state.activeConversationId
      if (!convId || !state.conversations[convId]) return state

      return {
        conversations: {
          ...state.conversations,
          [convId]: {
            ...state.conversations[convId],
            messages: [...state.conversations[convId].messages, message],
          },
        },
      }
    }),

  updateMessageVersion: (messageKey, versionId, content) =>
    set(state => {
      const convId = state.activeConversationId
      if (!convId || !state.conversations[convId]) return state

      return {
        conversations: {
          ...state.conversations,
          [convId]: {
            ...state.conversations[convId],
            messages: state.conversations[convId].messages.map(msg =>
              msg.key === messageKey
                ? {
                    ...msg,
                    versions: msg.versions.map(v => (v.id === versionId ? { ...v, content } : v)),
                  }
                : msg,
            ),
          },
        },
      }
    }),

  addMessageVersion: (messageKey, version) =>
    set(state => {
      const convId = state.activeConversationId
      if (!convId || !state.conversations[convId]) return state

      return {
        conversations: {
          ...state.conversations,
          [convId]: {
            ...state.conversations[convId],
            messages: state.conversations[convId].messages.map(msg =>
              msg.key === messageKey ? { ...msg, versions: [...msg.versions, version] } : msg,
            ),
          },
        },
      }
    }),
}))
