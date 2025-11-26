import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  role?: string;
}

export function Card({ children, className, role }: CardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border backdrop-blur-sm",
        className
      )}
      role={role}
    >
      {children}
    </div>
  );
}
