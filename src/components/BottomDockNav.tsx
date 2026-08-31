import React from 'react';
import { Activity, Compass, Sparkles, Footprints } from 'lucide-react';
import { getTranslation } from '../lib/translations';

export type NavTab = 'sheeko' | 'dashboard' | 'buddy' | 'snippets' | 'myday' | 'fitness' | 'course' | 'profile' | 'challenge' | 'drill';

interface BottomDockNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language?: 'en' | 'hi';
}

export const BottomDockNav: React.FC<BottomDockNavProps> = ({
  activeTab,
  onSelectTab,
  language = 'en',
}) => {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-3 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto bg-[#18191E]/95 backdrop-blur-2xl rounded-full px-7 py-3 border border-zinc-800/90 flex items-center justify-between gap-8 shadow-2xl shadow-black/95 relative w-full max-w-sm"
      >
        {/* 1. Summary */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'dashboard' || activeTab === 'fitness' ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title={getTranslation(language, 'summary')}
        >
          <Activity className="w-6 h-6 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight">{getTranslation(language, 'summary')}</span>
        </button>

        {/* 2. Bytes (Compass with red notification dot) */}
        <button
          onClick={() => onSelectTab('snippets')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer relative ${
            activeTab === 'snippets' || activeTab === 'profile' || activeTab === 'course' ? 'text-zinc-200' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title={getTranslation(language, 'bytes')}
        >
          <div className="relative">
            <Compass className="w-6 h-6 stroke-[2]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md ring-2 ring-[#18191E]" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">{getTranslation(language, 'bytes')}</span>
        </button>

        {/* 3. Sheeko (Glowing Yellow Sparkle) */}
        <button
          onClick={() => onSelectTab('sheeko')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'sheeko' || activeTab === 'myday' ? 'text-amber-400 font-extrabold' : 'text-amber-400 hover:text-amber-300'
          }`}
          title="Sheeko"
          aria-label="Sheeko"
        >
          <Sparkles className="w-6 h-6 stroke-[2] drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <span className="text-[10px] font-bold tracking-tight">sheeko</span>
        </button>

        {/* 4. Buddy (Cyan Footprints / Steps) */}
        <button
          onClick={() => onSelectTab('buddy')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'buddy' || activeTab === 'course' ? 'text-cyan-400' : 'text-cyan-400 hover:text-cyan-300'
          }`}
          title="Buddy"
        >
          <Footprints className="w-6 h-6 stroke-[2]" />
          <span className="text-[10px] font-bold tracking-tight">buddy</span>
        </button>
      </nav>
    </div>
  );
};

