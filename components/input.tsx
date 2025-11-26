import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
}

export function Input({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon === 'search' && (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            )}
          </svg>
        </div>
      )}
      <input
        className={cn(
          "w-full px-4 py-3 rounded-full border bg-white/10 backdrop-blur-sm",
          "placeholder:text-white/70 text-white",
          "focus:outline-none focus:ring-2 focus:ring-white/30",
          icon && "pl-12",
          className
        )}
        {...props}
      />
    </div>
  );
}
