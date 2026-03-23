import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { ChatbotDemo } from './components/ai/chatbot.tsx'
import { ThemeProvider } from './components/ui/theme-provider.tsx'
import { Navbar } from './components/ui/navbar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <TooltipProvider>
        <main className='flex h-screen flex-col'>
          <Navbar />
          <div className='min-h-0 flex-1'>
            <ChatbotDemo />
          </div>
        </main>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
)
