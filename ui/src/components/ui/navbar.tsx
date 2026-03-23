import { ModeToggle } from '@/components/ui/mode-toggle.tsx'

export const Navbar = () => {
  return (
    <header className='shrink-0 border-b'>
      <div className='mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4'>
        <span className='font-semibold tracking-tight'>Omni Brain</span>
        <ModeToggle />
      </div>
    </header>
  )
}
