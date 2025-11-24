import { cn } from '@/lib/utils'

interface KpiBadgeProps {
  number: string
  label: string
  variant: 'primary' | 'secondary'
}

export function KpiBadge({ number, label, variant }: KpiBadgeProps) {
  return (
    <div className="flex items-center gap-3">
      <div 
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg',
          variant === 'primary' ? 'bg-blue-500' : 'bg-blue-700'
        )}
        role="img"
        aria-label={`${number} ${label}`}
      >
        {number}
      </div>
      <div>
        <p className="text-white text-sm font-medium leading-tight">
          {label}
        </p>
      </div>
    </div>
  )
}
