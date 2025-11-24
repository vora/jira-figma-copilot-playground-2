import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps {
  placeholder?: string
  icon?: ReactNode
  className?: string
}

export function Input({ placeholder, icon, className }: InputProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {icon}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-white rounded-full py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label={placeholder}
      />
    </div>
  )
}
