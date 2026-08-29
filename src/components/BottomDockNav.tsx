import React from 'react';
import { Home, BookOpen, Mic, TrendingUp, User, Sparkles } from 'lucide-react';

export type NavTab = 'home' | 'myday' | 'practice' | 'progress' | 'profile' | 'challenge';

interface BottomDockNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomDockNav: React.FC<BottomDockNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    isFeatured?: boolean;
    badge?: string;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-4 h-4 stroke-[2.2]" />,
    },
    {
      id: 'myday',
      label: 'My Day',
      icon: <BookOpen className="w-4 h-4 stroke-[2.2]" />,
      isFeatured: true,
      badge: 'STORY & PATTERNS',
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
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-3 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto bg-[#18191E]/95 backdrop-blur-2xl rounded-full px-2 py-1.5 border border-zinc-800/90 flex items-center justify-between gap-1 max-w-[400px] w-full transition-all duration-300 shadow-2xl shadow-black/90 relative"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isMyDay = item.id === 'myday';

          if (isMyDay) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all duration-300 cursor-pointer group select-none ${
                  isActive
                    ? 'text-amber-400'
                    : 'text-amber-300/90 hover:text-amber-200'
                }`}
              >
                {/* Continuous Breathing Glow Aura (Zero screen layout shift) */}
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-500/30 via-rose-500/20 to-purple-500/30 blur-xs opacity-75 group-hover:opacity-100 animate-pulse pointer-events-none -z-10" />

                {/* Shimmering Container Border & Background */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 -z-0 ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-500/25 to-zinc-900 border border-amber-400/60 shadow-lg shadow-amber-500/20'
                      : 'bg-gradient-to-b from-amber-950/40 to-zinc-900/90 border border-amber-500/40 hover:border-amber-400/80 shadow-md shadow-amber-500/10'
                  }`}
                />

                {/* Floating Micro Sparkle Badge */}
                <div className="absolute -top-2.5 right-1/2 translate-x-1/2 flex items-center gap-0.5 px-1.5 py-0.2 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-[8px] font-black text-black tracking-wider rounded-full shadow-md shadow-amber-500/40 border border-white/20 whitespace-nowrap animate-bounce duration-1000">
                  <Sparkles className="w-2 h-2 text-black fill-black" />
                  <span>STORY</span>
                </div>

                {/* Icon with subtle pulsing glow */}
                <span className="relative z-10 text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">
                  {item.icon}
                </span>

                {/* Label */}
                <span className="relative z-10 text-[9.5px] font-black tracking-tight mt-0.5 whitespace-nowrap text-amber-300 group-hover:text-amber-200 drop-shadow-sm">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 sm:px-2 rounded-full transition-all duration-300 cursor-pointer ${
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
                className={`relative z-10 text-[9.5px] font-extrabold tracking-tight mt-0.5 whitespace-nowrap ${
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
