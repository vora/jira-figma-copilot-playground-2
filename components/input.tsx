import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps {
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
}

export function Input({ placeholder, icon, className }: InputProps) {
  return (
    <div className={cn(
      'relative w-full',
      className
    )}>
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        type="text"
        placeholder={placeholder}
        className={cn(
          'w-full bg-white rounded-full px-4 py-3 text-gray-900 placeholder-gray-500',
          icon && 'pl-10'
        )}
      />
    </div>
  );
}
