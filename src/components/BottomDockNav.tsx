import React from 'react';
import { Home, BookOpen, Mic, TrendingUp, User, Sparkles, Activity, Compass } from 'lucide-react';

export type NavTab = 'home' | 'myday' | 'practice' | 'profile' | 'fitness' | 'course';

interface BottomDockNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomDockNav: React.FC<BottomDockNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-3 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto bg-[#18191E]/95 backdrop-blur-2xl rounded-full px-5 py-2.5 border border-zinc-800/90 flex items-center justify-center gap-5 shadow-2xl shadow-black/95 relative"
      >
        <button
          onClick={() => onSelectTab('fitness')}
          className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
            activeTab === 'fitness' ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Fitness Dashboard"
        >
          <Activity className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-tight">Summary</span>
        </button>

        <button
          onClick={() => onSelectTab('course')}
          className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
            activeTab === 'course' ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Courses"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-tight">Courses</span>
        </button>

        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-tight">Explore</span>
        </button>

        <button
          onClick={() => onSelectTab('myday')}
          className="relative w-14 h-14 rounded-full bg-gradient-to-b from-amber-500/35 via-zinc-900 to-zinc-950 border-2 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group select-none -mt-4"
          title="My Day"
          aria-label="My Day"
        >
          <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
          <Sparkles className="w-5 h-5 text-amber-300 group-hover:text-amber-200 transition-colors drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
          <span className="text-[8px] font-black tracking-tight text-amber-300 mt-0.5">
            MY DAY
          </span>
        </button>

        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Profile"
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-tight">Profile</span>
        </button>
      </nav>
    </div>
  );
};
