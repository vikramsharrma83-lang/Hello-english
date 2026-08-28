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
      icon: <Home className="w-4 h-4 stroke-[2.2]" />,
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: <Mic className="w-4 h-4 stroke-[2.2]" />,
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <TrendingUp className="w-4 h-4 stroke-[2.2]" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4 stroke-[2.2]" />,
    },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto bg-[#1C1C1E]/95 backdrop-blur-xl rounded-full px-2 py-1.5 border border-zinc-800 flex items-center justify-between gap-1 max-w-[340px] w-full transition-all duration-300 shadow-2xl shadow-black/80"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'text-[#F59E0B]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              {/* Active Pill Background */}
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-[#2C2C2E] border border-zinc-700/50 shadow-sm -z-0 transition-transform duration-300 animate-in fade-in zoom-in-95" />
              )}

              <span className="relative z-10">{item.icon}</span>
              <span
                className={`relative z-10 text-[10px] font-extrabold tracking-tight mt-0.5 ${
                  isActive ? 'text-[#F59E0B]' : 'text-zinc-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
