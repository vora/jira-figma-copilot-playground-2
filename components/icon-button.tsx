import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function IconButton({ children, className, onClick }: IconButtonProps) {
  return (
    <button
      className={cn(
        'p-2 rounded-full hover:bg-white/10 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-white/20',
        className
      )}
      onClick={onClick}
      aria-label="Menu"
    >
      {children}
    </button>
  );
}
