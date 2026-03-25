export const queryKeys = {
  conversation: {
    all: ['conversation'] as const,
    detail: (id: string) => ['conversation', id] as const,
  },
  utilities: {
    health: ['utilities', 'health'] as const,
  },
} as const
