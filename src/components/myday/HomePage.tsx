import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { ConversationTurn, PracticeHistoryItem, DayMap, UserProgress } from '../../types';

interface HomePageProps {
  onStart: () => void;
  onOpenPatternLibrary: () => void;
  onOpenInspector: () => void;
  onOpenChallenge?: () => void;
  onOpenProfile?: () => void;
  onSelectSample?: (sampleText: string) => void;
  onClose?: () => void;
  turns?: ConversationTurn[];
  practiceHistory?: PracticeHistoryItem[];
  dayMap?: DayMap;
  progress?: UserProgress;
  language?: 'en' | 'hi';
  onToggleLanguage?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStart,
  onOpenChallenge,
  language = 'en',
}) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start px-6 pt-12 pb-28 text-zinc-100 max-w-[440px] mx-auto min-h-screen bg-black">
      {/* Header */}
      <h1 className="text-xl font-light text-zinc-400 uppercase tracking-widest mb-8">
        {greeting} VIKRAM!
      </h1>

      {/* Dashboard Section */}
      <div className="w-full flex gap-4 mb-6">
        {/* Streak Card */}
        <div className="flex-[0.8] bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800 flex items-center justify-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">0 day</span>
            <span className="text-[9px] text-zinc-500 uppercase">Streak</span>
          </div>
        </div>
        
        {/* Weekly Tracker Card */}
        <div className="flex-[1.2] bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800">
          <span className="text-[9px] text-zinc-500 uppercase mb-2 block">This Week</span>
          <div className="flex justify-between gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <div key={`${day}-${index}`} className="flex flex-col items-center gap-0.5">
                <div className="w-5 h-5 rounded-full bg-zinc-800"></div>
                <span className="text-[8px] text-zinc-600">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Level Card */}
      <div className="w-full bg-zinc-900/60 rounded-2xl p-5 border border-zinc-800 mb-8">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Beginner</span>
            <HelpCircle className="w-4 h-4 text-zinc-500" />
          </div>
          <span className="text-zinc-400">0 Points</span>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="w-[10%] h-full bg-zinc-600"></div>
        </div>
        <div className="flex justify-between text-xs text-zinc-500 mt-2">
          <span>Level 1</span>
          <span>100 POINTS TO LEVEL 2</span>
        </div>
      </div>

      {/* Featured Challenge Card */}
      <div className="w-screen -mx-6 px-6 relative group mt-2">
        <div className="w-full bg-gradient-to-b from-[#14151b] via-[#0d0e12] to-[#07080a] border-2 border-purple-900/50 rounded-[32px] p-6 flex flex-col items-center text-center relative z-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent rounded-[32px]"></div>
          <span className="bg-zinc-900/80 text-zinc-300 text-xs px-3 py-1 rounded-full mb-4 relative z-20 border border-zinc-700">+25 Points</span>
          <h3 className="text-4xl font-semibold mb-2 relative z-20 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400">Talk to me</h3>
          <p className="text-zinc-400 mb-8 max-w-[200px] relative z-20">Pitch it. Defend it. Win them over.</p>
          
          <button 
            onClick={onOpenChallenge || onStart}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:bg-white transition-colors relative z-20"
          >
            Start Challenge
          </button>
        </div>
      </div>
    </div>
  );
};
