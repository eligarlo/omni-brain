import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { Chatbot } from './components/ai/chatbot.tsx'
import { ThemeProvider } from './components/ui/theme-provider.tsx'
import { Navbar } from './components/ui/navbar.tsx'
import { AppProviders } from './providers/app-providers.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <TooltipProvider>
          <main className='flex h-screen flex-col'>
            <Navbar />
            <div className='min-h-0 flex-1'>
              <Chatbot />
            </div>
          </main>
        </TooltipProvider>
      </ThemeProvider>
    </AppProviders>
  </StrictMode>,
)
