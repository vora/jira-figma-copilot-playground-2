import React from 'react';
import { cn } from '@/lib/utils';

interface KpiBadgeProps {
  number: string;
  label: string;
  variant: 'primary' | 'secondary';
}

export function KpiBadge({ number, label, variant }: KpiBadgeProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg",
          variant === 'primary' && "bg-blue-500 text-white",
          variant === 'secondary' && "bg-blue-700 text-white"
        )}
      >
        {number}
      </div>
      <div>
        <p className="text-sm text-blue-100 leading-tight">{label}</p>
      </div>
    </div>
  );
}
