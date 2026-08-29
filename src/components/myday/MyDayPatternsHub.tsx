import React, { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Coffee,
  Users,
  ChevronRight,
  Sparkles,
  Zap,
  Mic,
  Compass,
  Play,
  RotateCw,
} from 'lucide-react';
import { Question } from '../../types';
import { PRACTICE_QUESTIONS } from '../../data/questions';

interface MyDayPatternsHubProps {
  onStartPracticeQuestion: (question: Question) => void;
  onUsePatternForStory?: (patternText: string) => void;
  onBackToBuddy?: () => void;
}

export type CategoryKey = 'workplace' | 'daily_routine' | 'friends';
export type LevelKey = 'Level 1' | 'Level 2' | 'Level 3';

interface CategoryConfig {
  id: CategoryKey;
  title: string;
  subtitle: string;
  description: string;
  hindiLabel: string;
  questionCount: number;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'workplace',
    title: 'Workplace',
    subtitle: 'Professional English & Shift Operations',
    description: 'Master warehouse operations, manager communications, client requests & team coordination.',
    hindiLabel: 'ऑफिस और काम की बातचीत',
    questionCount: PRACTICE_QUESTIONS.filter((q) => q.category === 'workplace').length || 40,
  },
  {
    id: 'daily_routine',
    title: 'Daily routine',
    subtitle: 'Everyday Habits, Commute & Errands',
    description: 'Describe your morning routine, daily transit, food, shopping, and everyday activities.',
    hindiLabel: 'दिनचर्या और रोजमर्रा की बातें',
    questionCount: PRACTICE_QUESTIONS.filter((q) => q.category === 'daily_routine').length || 35,
  },
  {
    id: 'friends',
    title: 'Friend',
    subtitle: 'Casual Social English & Weekend Hangouts',
    description: 'Chat casually with friends, talk about plans, movies, chai breaks, and weekend trips.',
    hindiLabel: 'दोस्तों और सामाजिक बातचीत',
    questionCount: PRACTICE_QUESTIONS.filter((q) => q.category === 'friends').length || 25,
  },
];

const LEVELS: {
  id: LevelKey;
  levelNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
}[] = [
  {
    id: 'Level 1',
    levelNumber: 1,
    title: 'Level 1',
    subtitle: 'Words & Phrases',
    badge: 'Foundation',
    description: 'Vocabulary, key keywords, and short structured 2-4 word sentence answers.',
  },
  {
    id: 'Level 2',
    levelNumber: 2,
    title: 'Level 2',
    subtitle: 'Sentences & Flow',
    badge: 'Fluency',
    description: 'Complete sentences with past/present tense, reasons, and smooth connectors.',
  },
  {
    id: 'Level 3',
    levelNumber: 3,
    title: 'Level 3',
    subtitle: 'Real Conversations',
    badge: 'Mastery',
    description: 'Spontaneous multi-sentence dialogues, handling surprises, and confident speech.',
  },
];

export const MyDayPatternsHub: React.FC<MyDayPatternsHubProps> = ({
  onStartPracticeQuestion,
  onUsePatternForStory,
  onBackToBuddy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfig | null>(null);

  // Helper to pick a completely random question from the selected category + level
  const handleSelectRandomLevelQuestion = (level: LevelKey) => {
    if (!selectedCategory) return;
    const pool = PRACTICE_QUESTIONS.filter(
      (q) => q.category === selectedCategory.id && q.level === level
    );

    const questionsList = pool.length > 0
      ? pool
      : PRACTICE_QUESTIONS.filter((q) => q.category === selectedCategory.id);

    if (questionsList.length > 0) {
      const randomIndex = Math.floor(Math.random() * questionsList.length);
      const chosenQuestion = questionsList[randomIndex];
      onStartPracticeQuestion(chosenQuestion);
    }
  };

  // ==========================================
  // VIEW 1: DISCOVER PATTERNS (EXACT SCREENSHOT LAYOUT)
  // ==========================================
  if (!selectedCategory) {
    return (
      <div className="w-full min-h-screen bg-black text-white px-4 sm:px-6 pt-6 pb-32 select-none">
        {/* Large iOS-style Title */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
          Discover
        </h1>

        {/* Section 1: Get Started (Workplace, Daily Routine) */}
        <div className="mb-7">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 tracking-tight">
            Get Started
          </h2>

          <div className="space-y-3">
            {/* Category 1: Workplace */}
            <button
              type="button"
              onClick={() => setSelectedCategory(CATEGORIES[0])}
              className="w-full text-left flex items-center gap-4 group p-2 rounded-2xl transition-all hover:bg-white/5 active:scale-[0.99] cursor-pointer"
            >
              {/* Apple Watch style Squircle Icon Box */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-center shrink-0 shadow-md">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center text-zinc-200 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-6 h-6 stroke-[1.7]" />
                </div>
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                  1. Workplace
                </h3>
                <p className="text-xs sm:text-sm text-[#8E8E93] mt-0.5 leading-snug">
                  Professional English & Shift Operations
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#636366]">
                  <span>3 Levels</span>
                  <span>•</span>
                  <span>Random Practice Drills</span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-[#48484A] group-hover:text-white transition-colors shrink-0 mr-1" />
            </button>

            <div className="w-full h-px bg-white/5 my-1 ml-24" />

            {/* Category 2: Daily routine */}
            <button
              type="button"
              onClick={() => setSelectedCategory(CATEGORIES[1])}
              className="w-full text-left flex items-center gap-4 group p-2 rounded-2xl transition-all hover:bg-white/5 active:scale-[0.99] cursor-pointer"
            >
              {/* Apple Watch style Squircle Icon Box */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-center shrink-0 shadow-md">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center text-zinc-200 group-hover:scale-105 transition-transform">
                  <Coffee className="w-6 h-6 stroke-[1.7]" />
                </div>
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-rose-300 transition-colors">
                  2. Daily routine
                </h3>
                <p className="text-xs sm:text-sm text-[#8E8E93] mt-0.5 leading-snug">
                  Everyday Habits, Commute & Errands
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#636366]">
                  <span>3 Levels</span>
                  <span>•</span>
                  <span>Random Practice Drills</span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-[#48484A] group-hover:text-white transition-colors shrink-0 mr-1" />
            </button>
          </div>
        </div>

        {/* Section 2: Social & Conversations (Friend Category styled with Explore Watch Apps aesthetic) */}
        <div className="mt-7">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 tracking-tight">
            Conversations & Social
          </h2>

          {/* Category 3: Friend (with vibrant App Store blue circular emblem aesthetic) */}
          <button
            type="button"
            onClick={() => setSelectedCategory(CATEGORIES[2])}
            className="w-full text-left flex items-center gap-4 group p-2 rounded-2xl transition-all hover:bg-white/5 active:scale-[0.99] cursor-pointer"
          >
            {/* Apple Watch style Explore Apps Icon Box */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-center shrink-0 shadow-md">
              {/* Vibrant blue circle matching Explore Watch Apps */}
              <div className="w-13 h-13 rounded-full bg-gradient-to-b from-[#2997FF] via-[#0071E3] to-[#0058B6] flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>

            {/* Text info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  3. Friend
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#8E8E93] mt-0.5 leading-snug">
                Casual Social English & Weekend Hangouts
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-[#636366]">
                <span>3 Levels</span>
                <span>•</span>
                <span>Random Practice Drills</span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-[#48484A] group-hover:text-white transition-colors shrink-0 mr-1" />
          </button>
        </div>

        {/* Bottom Floating Navigation Dock (Apple Watch Style) */}
        <div className="fixed bottom-4 left-0 right-0 max-w-sm mx-auto px-4 z-30 pointer-events-auto">
          <div className="bg-[#1C1C1E]/95 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5 flex items-center justify-around shadow-2xl">
            {/* My Story / Buddy Tab */}
            {onBackToBuddy && (
              <button
                onClick={onBackToBuddy}
                className="flex flex-col items-center gap-0.5 px-3 py-1 text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full border border-[#8E8E93] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]" />
                </div>
                <span className="text-[10px] font-medium">My Story</span>
              </button>
            )}

            {/* Discover / Patterns Tab (Active Pill) */}
            <div className="bg-[#3A3A3C] text-amber-400 rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-sm">
              <Compass className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-white">Discover</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LEVEL SELECTION SCREEN (NO QUESTION LIST - DIRECT RANDOM QUESTION ON LEVEL TAP)
  // ==========================================
  return (
    <div className="w-full min-h-screen bg-black text-white px-4 sm:px-6 pt-3 pb-32 select-none">
      {/* Top Header with Back to All Categories (Clean, no category subtext) */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-xs font-semibold text-[#8E8E93] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Categories</span>
        </button>
      </div>

      {/* Screen Title: Only Main Category Title & Description */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {selectedCategory.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#8E8E93] mt-1 leading-relaxed">
          {selectedCategory.description}
        </p>
      </div>

      {/* 
        CHOOSE LEVEL CARDS
        Uses the exact vibrant App Store blue icon pattern from the screenshot.
        Tapping any Level card selects a random question and starts practice.
      */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">
            Choose Level to Practice
          </h2>
          <span className="text-[11px] text-blue-400 font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Random Question Drill</span>
          </span>
        </div>

        <div className="space-y-3">
          {LEVELS.map((lvl) => {
            const count = PRACTICE_QUESTIONS.filter(
              (q) => q.category === selectedCategory.id && q.level === lvl.id
            ).length;

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => handleSelectRandomLevelQuestion(lvl.id)}
                className="w-full text-left flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl bg-[#1C1C1E] border border-white/5 hover:border-blue-500/60 hover:bg-[#242428] transition-all cursor-pointer group active:scale-[0.98] shadow-md shadow-black/40"
              >
                {/* 
                  App Store Blue Circular Icon Container
                  Exact aesthetic of Explore Watch Apps from screenshot
                */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#2C2C2E] border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#2997FF] via-[#0071E3] to-[#0058B6] flex items-center justify-center text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                    <span>L{lvl.levelNumber}</span>
                  </div>
                </div>

                {/* Level Title, Subtitle & Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {lvl.title}: {lvl.subtitle}
                    </h3>
                  </div>

                  <p className="text-xs text-[#8E8E93] mt-1 leading-snug">
                    {lvl.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950/90 text-blue-300 border border-blue-800/80">
                      {count} Drills
                    </span>
                    <span className="text-[10px] text-[#636366]">
                      • Tap to Start Random Drill
                    </span>
                  </div>
                </div>

                {/* Action Icon */}
                <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                  <Mic className="w-4 h-4 stroke-[2.2]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Info banner explaining random drill generation */}
        <div className="mt-6 p-4 rounded-2xl bg-[#121214] border border-white/5 text-xs text-[#8E8E93] leading-relaxed flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-white font-semibold block mb-0.5">
              Automated Random Question Engine
            </span>
            Selecting a level instantly loads a randomized speaking scenario suited for your chosen difficulty. Coach Neha will listen to your spoken response and give live feedback.
          </div>
        </div>
      </div>

      {/* Bottom Floating Navigation Dock (Apple Watch Style) */}
      <div className="fixed bottom-4 left-0 right-0 max-w-sm mx-auto px-4 z-30 pointer-events-auto">
        <div className="bg-[#1C1C1E]/95 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5 flex items-center justify-around shadow-2xl">
          {/* My Story / Buddy Tab */}
          {onBackToBuddy && (
            <button
              onClick={onBackToBuddy}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full border border-[#8E8E93] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]" />
              </div>
              <span className="text-[10px] font-medium">My Story</span>
            </button>
          )}

          {/* Discover / Patterns Tab (Active Pill) */}
          <div className="bg-[#3A3A3C] text-amber-400 rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-sm">
            <Compass className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-white">Discover</span>
          </div>
        </div>
      </div>
    </div>
  );
};
