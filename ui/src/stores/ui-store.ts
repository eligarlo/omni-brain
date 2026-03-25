import { create } from 'zustand'

interface UIState {
  promptText: string
  useWebSearch: boolean
  useMicrophone: boolean

  setPromptText: (text: string) => void
  toggleWebSearch: () => void
  toggleMicrophone: () => void
  resetPromptInput: () => void
}

export const useUIStore = create<UIState>(set => ({
  promptText: '',
  useWebSearch: false,
  useMicrophone: false,

  setPromptText: text => set({ promptText: text }),
  toggleWebSearch: () => set(s => ({ useWebSearch: !s.useWebSearch })),
  toggleMicrophone: () => set(s => ({ useMicrophone: !s.useMicrophone })),
  resetPromptInput: () => set({ promptText: '' }),
}))
