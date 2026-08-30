import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Activity as ActivityIcon,
  BookOpen,
  Sliders,
  Info,
  ArrowRight,
  Target,
  X,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Zap,
  Mic,
} from 'lucide-react';
import { EnglishProgressScreen } from './EnglishProgressScreen';
import { calculateEnglishConfidence } from '../../utils/confidenceMetrics';
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
}

export const HomePage: React.FC<HomePageProps> = ({
  onStart,
  onOpenPatternLibrary,
  onOpenInspector,
  onOpenChallenge,
  onOpenProfile,
  onClose,
  turns = [],
  practiceHistory = [],
  dayMap,
  progress,
}) => {
  const [timeString, setTimeString] = useState('3:23');
  const [greeting, setGreeting] = useState('Good Afternoon');
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  const confidenceData = calculateEnglishConfidence(turns, practiceHistory, dayMap);

  useEffect(() => {
    const updateClockAndGreeting = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
      
      // 12-hour format display
      const displayHours = hours % 12 || 12;
      setTimeString(`${displayHours}:${formattedMin}`);

      if (hours < 12) {
        setGreeting('Good Morning');
      } else if (hours < 17) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };

    updateClockAndGreeting();
    const interval = setInterval(updateClockAndGreeting, 30000);
    return () => clearInterval(interval);
  }, []);

  // Pie chart parameters for Watch Progress Card (Thicker and Bigger)
  const radius = 54;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  let cumulativeWeight = 0;
  const watchSlices = confidenceData.metrics.map((metric) => {
    const startAngle = (cumulativeWeight / 100) * 360;
    cumulativeWeight += metric.weight;

    const strokeDasharray = `${(metric.weight / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((startAngle / 360) * circumference);

    return {
      ...metric,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between px-4 pt-4 pb-6 text-zinc-100 max-w-[440px] mx-auto min-h-screen select-none relative">
      {/* Top Header with Close (X) button & Quick Utilities */}
      <div className="w-full flex items-center justify-between z-20 py-2">
        {/* Left: Profile / My studio badge */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
          title="Open Profile"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/20 to-sky-500/20 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-black text-white tracking-tight group-hover:text-amber-400 transition-colors">My studio</div>
          </div>
        </button>

        {/* Right: Close (X) icon button to exit My Day back to main app */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            title="Exit My Day"
            aria-label="Exit My Day"
          >
            <X className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
        )}
      </div>

      {/* Main Content Area: Highlighted Course at top/center, and 3-grid compact cards at bottom */}
      <div className="w-full flex-1 flex flex-col justify-between max-w-sm mx-auto py-2">
        {/* Top / Center: Highlighted Course Card */}
        <div className="w-full my-auto">
          {onOpenChallenge && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenChallenge}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-[#14151b] to-[#14151b] hover:from-emerald-900/60 border-2 border-emerald-500/50 hover:border-emerald-400 text-left transition-all cursor-pointer shadow-[0_0_24px_rgba(16,185,129,0.2)] flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/30 via-teal-500/25 to-sky-500/30 border border-emerald-400/50 relative flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(16,185,129,0.4)] overflow-hidden">
                  <Target className="w-6 h-6 text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.9)] relative z-10" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white tracking-wider uppercase">Course</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[9px] font-bold text-emerald-300 uppercase">Featured</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium mt-0.5">
                    {progress?.challenge?.totalDays || 5}-Day Fluency Roadmap
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                <ChevronRight className="w-4 h-4 font-bold" />
              </div>
            </motion.button>
          )}
        </div>

        {/* Bottom: 3-Grid Compact Cards (Voice Studio, Performance, Patterns) */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4">
          {/* Voice Studio Card */}
          <motion.button
            type="button"
            onClick={onStart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="p-3 rounded-2xl bg-[#14151b] hover:bg-zinc-900 border border-zinc-800 hover:border-sky-500/50 text-center transition-all cursor-pointer shadow-lg flex flex-col items-center justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.2)] group-hover:scale-105 transition-transform mb-2">
              <Mic className="w-4 h-4 animate-pulse text-sky-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white tracking-tight block group-hover:text-sky-400 transition-colors">Voice Studio</span>
              <span className="text-[9px] text-zinc-400 block mt-0.5">Talk & practice</span>
            </div>
          </motion.button>

          {/* Performance Card */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsProgressOpen(true)}
            className="p-3 rounded-2xl bg-[#14151b] hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-center transition-all cursor-pointer shadow-lg flex flex-col items-center justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] group-hover:scale-105 transition-transform mb-2">
              <ActivityIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white tracking-tight block group-hover:text-amber-400 transition-colors">Performance</span>
              <span className="text-[9px] text-zinc-400 block mt-0.5">Confidence stats</span>
            </div>
          </motion.button>

          {/* Patterns Card */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenPatternLibrary}
            className="p-3 rounded-2xl bg-[#14151b] hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 text-center transition-all cursor-pointer shadow-lg flex flex-col items-center justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)] group-hover:scale-105 transition-transform mb-2">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white tracking-tight block group-hover:text-purple-400 transition-colors">Patterns</span>
              <span className="text-[9px] text-zinc-400 block mt-0.5">Grammar guide</span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Detailed English Progress Screen Modal */}
      <EnglishProgressScreen
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        turns={turns}
        practiceHistory={practiceHistory}
        dayMap={dayMap}
        progress={progress}
        onStartPractice={() => {
          setIsProgressOpen(false);
          onStart();
        }}
      />
    </div>
  );
};
