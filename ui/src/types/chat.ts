import type { ToolUIPart } from 'ai'
import type { ConversationRole } from './api'

/** A single version of a message (supports branching) */
export interface MessageVersion {
  id: string
  content: string
}

/** A source citation attached to a message */
export interface MessageSource {
  href: string
  title: string
}

/** Reasoning/thinking metadata attached to an assistant message */
export interface MessageReasoning {
  content: string
  duration: number
}

/** Tool invocation metadata attached to an assistant message */
export interface MessageTool {
  name: string
  description: string
  status: ToolUIPart['state']
  parameters: Record<string, unknown>
  result: string | undefined
  error: string | undefined
}

/**
 * A chat message as represented in the frontend UI.
 * Replaces the inline MessageType from chatbot.tsx.
 */
export interface ChatMessage {
  key: string
  from: ConversationRole
  sources?: MessageSource[]
  versions: MessageVersion[]
  reasoning?: MessageReasoning
  tools?: MessageTool[]
}

/** Represents a full conversation */
export interface Conversation {
  id: string
  messages: ChatMessage[]
  createdAt: string
  title?: string
}

/** Chat status for the prompt input and streaming state machine */
export type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error'
