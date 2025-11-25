import { Home, Users, DollarSign, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

function NavItem({ icon, label, isActive }: NavItemProps) {
  return (
    <button 
      className={cn(
        'flex flex-col items-center gap-1 py-2 px-4 text-xs',
        isActive ? 'text-white' : 'text-blue-300'
      )}
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-blue-800 border-t border-blue-700" role="navigation" aria-label="Main navigation">
      <div className="flex justify-around items-center py-2">
        <NavItem 
          icon={<Home className="w-5 h-5" />} 
          label="Home" 
          isActive 
        />
        <NavItem 
          icon={<Users className="w-5 h-5" />} 
          label="Clients" 
        />
        <NavItem 
          icon={<DollarSign className="w-5 h-5" />} 
          label="Commissions" 
        />
        <NavItem 
          icon={<FileText className="w-5 h-5" />} 
          label="News" 
        />
      </div>
    </nav>
  )
}
