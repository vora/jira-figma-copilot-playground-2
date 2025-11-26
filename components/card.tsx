import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  role?: string;
}

export function Card({ children, className, role }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 border',
        'bg-white border-gray-200',
        className
      )}
      role={role}
    >
      {children}
    </div>
  );
}
