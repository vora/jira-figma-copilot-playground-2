import { cn } from '@/lib/utils';

interface KpiBadgeProps {
  number: string;
  label: string;
  className?: string;
}

export function KpiBadge({ number, label, className }: KpiBadgeProps) {
  return (
    <div className={cn(
      'bg-blue-700/50 rounded-xl p-4 border border-blue-600 flex-1',
      className
    )}>
      <div className="text-2xl font-bold mb-1">{number}</div>
      <div className="text-blue-200 text-sm">{label}</div>
    </div>
  );
}
