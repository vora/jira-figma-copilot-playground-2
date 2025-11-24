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
      onClick={onClick}
      className={cn(
        'p-2 rounded-lg hover:bg-white/10 transition-colors',
        className
      )}
      aria-label="More options"
    >
      {children}
    </button>
  );
}
