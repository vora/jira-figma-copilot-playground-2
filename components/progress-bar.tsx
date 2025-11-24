import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max: number
  color: 'red' | 'blue' | 'yellow' | 'green'
}

export function ProgressBar({ value, max, color }: ProgressBarProps) {
  const percentage = (value / max) * 100
  
  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500'
  }

  return (
    <div className="w-full bg-blue-800/50 rounded-full h-1.5">
      <div 
        className={cn(
          'h-1.5 rounded-full transition-all duration-300',
          colorClasses[color]
        )}
        style={{ width: `${Math.min(percentage, 100)}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={max}
        aria-label={`Progress: ${value} of ${max}`}
      />
    </div>
  )
}
