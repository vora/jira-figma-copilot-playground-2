import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  color: 'red' | 'blue' | 'yellow' | 'green';
}

export function ProgressBar({ value, max, color }: ProgressBarProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="w-full bg-blue-800/50 rounded-full h-2">
      <div
        className={cn(
          "h-2 rounded-full transition-all duration-300",
          color === 'red' && "bg-red-500",
          color === 'blue' && "bg-blue-400",
          color === 'yellow' && "bg-yellow-400",
          color === 'green' && "bg-green-400"
        )}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}
