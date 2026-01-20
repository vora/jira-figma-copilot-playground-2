import React from 'react';
import { Bell, Gift, ChevronDown, User } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header
      className={`bg-white border-b border-gray-200 ${className}`}
      role="banner"
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left section: Logo and Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-sm font-semibold text-gray-900">
              track-a-broker
            </span>
          </div>

          {/* Main Navigation */}
          <nav className="flex items-center gap-6" role="navigation" aria-label="Main navigation">
            <button
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Track A Business menu"
            >
              Track A Business
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            <button
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Tools & Resources menu"
            >
              Tools &amp; Resources
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            <button
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Support menu"
            >
              Support
              <ChevronDown size={16} className="text-gray-500" />
            </button>
          </nav>
        </div>

        {/* Right section: Notifications and User */}
        <div className="flex items-center gap-4">
          {/* Gift/Promo notification */}
          <button
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Promotions - 3 new"
          >
            <Gift size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-semibold text-white">
              3
            </span>
          </button>

          {/* Bell notification */}
          <button
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notifications - 2 new"
          >
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-semibold text-white">
              2
            </span>
          </button>

          {/* User Profile */}
          <button
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 pr-3 transition-colors"
            aria-label="User menu - Miss Broker"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-blue-600" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-900">Miss Broker</span>
              <span className="text-xs text-gray-500">missbroker@mail.com</span>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
