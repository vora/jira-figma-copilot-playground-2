import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface IconButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  'aria-label'?: string
}

export function IconButton({ children, className, onClick, 'aria-label': ariaLabel }: IconButtonProps) {
  return (
    <button
      className={cn(
        'p-2 rounded-full hover:bg-white/10 transition-colors',
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
