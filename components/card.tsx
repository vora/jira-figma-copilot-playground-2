import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  role?: string
}

export function Card({ children, className, role }: CardProps) {
  return (
    <div 
      className={cn(
        'rounded-xl p-4 border',
        className
      )}
      role={role}
    >
      {children}
    </div>
  )
}
