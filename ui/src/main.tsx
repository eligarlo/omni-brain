import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import ChatbotDemo from './components/ai/chatbot.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<TooltipProvider>
			<ChatbotDemo />
			{/* <App /> */}
		</TooltipProvider>
	</StrictMode>,
)
