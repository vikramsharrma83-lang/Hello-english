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
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start px-6 pt-12 pb-28 text-zinc-100 max-w-[440px] mx-auto min-h-screen bg-black">
      {/* Header */}
      <h1 className="text-xl font-light text-zinc-400 uppercase tracking-widest mb-8">
        WELCOME BACK VIKRAM!
      </h1>

      {/* Dashboard Section */}
      <div className="w-full flex gap-4 mb-6">
        {/* Streak Card */}
        <div className="flex-1 bg-zinc-900/60 rounded-2xl p-5 border border-zinc-800 flex flex-col items-center justify-center gap-1">
          <Flame className="w-8 h-8 text-orange-500" />
          <span className="text-2xl font-bold">0 day</span>
          <span className="text-xs text-zinc-500 uppercase">Streak</span>
        </div>
        
        {/* Weekly Tracker Card */}
        <div className="flex-[2] bg-zinc-900/60 rounded-2xl p-5 border border-zinc-800">
          <span className="text-xs text-zinc-500 uppercase mb-4 block">This Week</span>
          <div className="flex justify-between gap-2">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
                <span className="text-[10px] text-zinc-600">{day}</span>
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

      {/* Today's Challenge */}
      <h2 className="text-2xl font-semibold mb-4 text-center">Today's Challenge</h2>
      
      {/* Featured Challenge Card */}
      <div className="w-full relative group">
        <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-3xl opacity-50"></div>
        <div className="w-full bg-zinc-900/80 rounded-3xl p-8 border border-green-500/50 flex flex-col items-center text-center relative z-10">
          <span className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-full mb-4">+25 Points</span>
          <h3 className="text-4xl font-semibold mb-2">Convince Me</h3>
          <p className="text-zinc-400 mb-8 max-w-[200px]">Pitch it. Defend it. Win them over.</p>
          
          <button 
            onClick={onOpenChallenge || onStart}
            className="w-full py-4 bg-zinc-100 text-black font-semibold rounded-2xl hover:bg-white transition-colors"
          >
            Start Challenge
          </button>
        </div>
      </div>
    </div>
  );
};
