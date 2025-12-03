import React from 'react';
import { Home, FileText, Folder, CreditCard, Newspaper, RotateCcw } from 'lucide-react';

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab = 'Home', onTabChange }) => {
  const navItems = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Applications', label: 'Applications', icon: FileText },
    { id: 'Clients', label: 'Clients', icon: Folder },
    { id: 'Commissions', label: 'Commissions', icon: CreditCard },
    { id: 'News', label: 'News', icon: Newspaper },
    { id: 'Renewals', label: 'Renewals', icon: RotateCcw },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange?.(tabId);
  };

  return (
    <nav 
      className="bg-blue-600 px-4 py-2"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-blue-200 hover:text-white'
              }`}
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon 
                size={20} 
                className={`mb-1 ${isActive ? 'text-white' : 'text-blue-200'}`}
              />
              <span className={`text-xs font-medium leading-tight text-center ${
                isActive ? 'text-white' : 'text-blue-200'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
