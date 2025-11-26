import { HomeIcon, UsersIcon, CreditCardIcon, FileTextIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

function NavItem({ icon, label, isActive }: NavItemProps) {
  return (
    <button
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-white/20',
        isActive ? 'text-white' : 'text-blue-200'
      )}
      aria-label={label}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
      {isActive && (
        <div className="w-8 h-1 bg-white rounded-full mt-1" />
      )}
    </button>
  );
}

export function BottomNav() {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-blue-800 border-t border-blue-700 px-6 py-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around">
        <NavItem
          icon={<HomeIcon className="w-6 h-6" />}
          label="Home"
          isActive
        />
        <NavItem
          icon={<UsersIcon className="w-6 h-6" />}
          label="Clients"
        />
        <NavItem
          icon={<CreditCardIcon className="w-6 h-6" />}
          label="Commissions"
        />
        <NavItem
          icon={<FileTextIcon className="w-6 h-6" />}
          label="News"
        />
      </div>
    </nav>
  );
}
