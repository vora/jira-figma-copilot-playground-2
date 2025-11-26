import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="w-full bg-blue-800/50 rounded-full h-2">
      <div
        className={cn('h-2 rounded-full transition-all duration-300', className)}
        style={{ width: `${Math.min(percentage, 100)}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
}
