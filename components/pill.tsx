import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PillProps {
  children: ReactNode;
  className?: string;
}

export function Pill({ children, className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 rounded-full text-xs font-medium',
        'bg-gray-100 text-gray-800',
        className
      )}
    >
      {children}
    </span>
  );
}
