import React from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps {
  icon: string;
  variant: 'ghost' | 'solid';
  onClick?: () => void;
  'aria-label'?: string;
}

export function IconButton({ icon, variant, onClick, 'aria-label': ariaLabel }: IconButtonProps) {
  return (
    <button
      className={cn(
        "p-2 rounded-full transition-colors",
        variant === 'ghost' && "hover:bg-white/10",
        variant === 'solid' && "bg-white/20 hover:bg-white/30"
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon === 'bell' && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        )}
        {icon === 'menu' && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        )}
      </svg>
    </button>
  );
}
