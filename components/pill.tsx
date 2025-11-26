import React from 'react';
import { cn } from '@/lib/utils';

interface PillProps {
  text: string;
  variant: 'success' | 'warning' | 'error' | 'info';
}

export function Pill({ text, variant }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        variant === 'success' && "bg-green-100 text-green-800",
        variant === 'warning' && "bg-yellow-100 text-yellow-800",
        variant === 'error' && "bg-red-100 text-red-800",
        variant === 'info' && "bg-blue-100 text-blue-800"
      )}
    >
      {text}
    </span>
  );
}
