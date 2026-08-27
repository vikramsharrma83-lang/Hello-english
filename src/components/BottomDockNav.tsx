import React from 'react';
import { Home, Mic, TrendingUp, User } from 'lucide-react';

export type NavTab = 'home' | 'practice' | 'progress' | 'profile';

interface BottomDockNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomDockNav: React.FC<BottomDockNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5 stroke-[2.2]" />,
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: <Mic className="w-5 h-5 stroke-[2.2]" />,
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <TrendingUp className="w-5 h-5 stroke-[2.2]" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5 stroke-[2.2]" />,
    },
  ];

  return (
    <div className="fixed bottom-5 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full px-3 py-2 dock-shadow border border-[#E9D5FF]/80 flex items-center gap-2 max-w-xs sm:max-w-sm w-full justify-around transition-all duration-300"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-slate-500 hover:text-[#7C3AED] hover:bg-[#FAF5FF]'
              }`}
            >
              {/* Active Pill Background */}
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#DB2777] to-[#EA580C] shadow-md shadow-[#DB2777]/25 -z-0 transition-transform duration-300 animate-in fade-in zoom-in-90" />
              )}

              <span className="relative z-10">{item.icon}</span>
              <span className={`relative z-10 text-[10px] font-bold tracking-tight mt-0.5 ${isActive ? 'text-white' : 'text-slate-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
