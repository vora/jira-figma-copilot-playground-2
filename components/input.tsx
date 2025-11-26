import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps {
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
}

export function Input({ placeholder, icon, className }: InputProps) {
  return (
    <div className={cn('relative', className)}>
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        type="text"
        placeholder={placeholder}
        className={cn(
          'w-full bg-white rounded-full px-4 py-3 text-gray-900 placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-300',
          icon && 'pl-12'
        )}
        aria-label={placeholder}
      />
    </div>
  );
}
