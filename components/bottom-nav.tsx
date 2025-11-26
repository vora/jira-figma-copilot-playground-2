import React from 'react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, active }: NavItemProps) {
  return (
    <button
      className={cn(
        "flex flex-col items-center gap-1 py-2 px-4 transition-colors",
        active ? "text-white" : "text-blue-300"
      )}
      aria-label={label}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon === 'home' && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        )}
        {icon === 'clients' && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        )}
        {icon === 'commissions' && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        )}
        {icon === 'news' && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        )}
      </svg>
      <span className="text-xs">{label}</span>
      {active && (
        <div className="w-8 h-1 bg-white rounded-full mt-1" />
      )}
    </button>
  );
}

export function BottomNav() {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-blue-800/90 backdrop-blur-sm border-t border-blue-700"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center px-4 py-2">
        <NavItem icon="home" label="Home" active />
        <NavItem icon="clients" label="Clients" />
        <NavItem icon="commissions" label="Commissions" />
        <NavItem icon="news" label="News" />
      </div>
    </nav>
  );
}
