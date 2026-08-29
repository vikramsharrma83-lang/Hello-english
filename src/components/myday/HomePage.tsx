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
} from 'lucide-react';
import { EnglishProgressScreen } from './EnglishProgressScreen';
import { calculateEnglishConfidence } from '../../utils/confidenceMetrics';
import { ConversationTurn, PracticeHistoryItem, DayMap, UserProgress } from '../../types';

interface HomePageProps {
  onStart: () => void;
  onOpenPatternLibrary: () => void;
  onOpenInspector: () => void;
  onOpenChallenge?: () => void;
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

  // Pie chart parameters for Watch Progress Card (Enlarged)
  const radius = 48;
  const strokeWidth = 9;
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
        {/* Left: Sheeko / My Day badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/20 to-sky-500/20 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-black text-white tracking-tight">My Day</div>
            <div className="text-[10px] text-zinc-400 font-medium">Daily Story Studio</div>
          </div>
        </div>

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

      {/* Top Section: Smart Watch / English Confidence Progress Card */}
      <div className="w-full flex items-center justify-center relative my-auto py-2">
        {/* Ghost Card Left (09) */}
        <div className="absolute -left-10 sm:-left-6 top-1/2 -translate-y-1/2 w-48 h-64 rounded-[36px] border border-zinc-800/40 bg-zinc-950/40 rotate-[-12deg] opacity-25 flex items-center justify-center pointer-events-none">
          <span className="text-5xl font-mono font-bold text-zinc-600">09</span>
        </div>

        {/* Center Main Watch / Progress Card - Entirely Clickable */}
        <motion.button
          type="button"
          onClick={() => setIsProgressOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative z-10 w-64 sm:w-72 h-[340px] rounded-[44px] p-2 bg-[#1b1c22] border-[3px] border-[#2c2d36] hover:border-sky-500/50 shadow-2xl shadow-black flex flex-col cursor-pointer text-left transition-colors group focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          title="Click to view detailed English Confidence Progress across 7 metrics"
        >
          {/* Inner Screen Area */}
          <div className="w-full h-full rounded-[36px] bg-[#0c0d12] border border-zinc-800/80 p-4 sm:p-5 flex flex-col justify-between items-center relative overflow-hidden">
            {/* Top Status Header (ECHO removed) */}
            <div className="flex items-center justify-end w-full pt-0.5">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-950/40 border border-sky-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                <span className="text-[9px] font-extrabold tracking-wider text-sky-400 uppercase">
                  PROGRESS
                </span>
              </div>
            </div>

            {/* Center: Large English Confidence Pie Chart & Main Score */}
            <div className="flex flex-col items-center justify-center my-auto text-center w-full">
              {/* Large Pie Chart Ring */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center my-1.5">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 106 106">
                  {/* Track */}
                  <circle
                    cx="53"
                    cy="53"
                    r={normalizedRadius}
                    fill="transparent"
                    stroke="#1a1b24"
                    strokeWidth={strokeWidth}
                  />

                  {/* 7 Weighted Slices for English Confidence */}
                  {watchSlices.map((slice) => (
                    <circle
                      key={slice.id}
                      cx="53"
                      cy="53"
                      r={normalizedRadius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      strokeLinecap="round"
                    />
                  ))}
                </svg>

                {/* Center Score % in ring */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                    {confidenceData.overallScore}%
                  </span>
                </div>
              </div>

              {/* Clean Minimal Main Label: English Confidence: 73% */}
              <div className="text-sm sm:text-base font-extrabold text-white tracking-tight mt-1.5">
                English Confidence: {confidenceData.overallScore}%
              </div>

              {/* 3 Small Indicators: Grammar 60% | Communication 82% | Vocabulary 68% (Exact text-[10px] retained) */}
              <div className="mt-2.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800/90 flex items-center justify-center gap-1.5 text-[10px] font-semibold tracking-tight shadow-inner">
                <span className="text-amber-400">Grammar {confidenceData.cardIndicators.grammar}%</span>
                <span className="text-zinc-600 font-bold">|</span>
                <span className="text-sky-400">Communication {confidenceData.cardIndicators.communication}%</span>
                <span className="text-zinc-600 font-bold">|</span>
                <span className="text-purple-400">Vocabulary {confidenceData.cardIndicators.vocabulary}%</span>
              </div>
            </div>

            {/* Bottom Subtle Padding without TAP FOR 7 METRICS text */}
            <div className="w-full pb-0.5" />
          </div>
        </motion.button>

        {/* Ghost Card Right (10) */}
        <div className="absolute -right-10 sm:-right-6 top-1/2 -translate-y-1/2 w-48 h-64 rounded-[36px] border border-zinc-800/40 bg-zinc-950/40 rotate-[12deg] opacity-25 flex items-center justify-center pointer-events-none">
          <span className="text-5xl font-mono font-bold text-zinc-600">10</span>
        </div>
      </div>



      {/* Middle Greeting & CTA */}
      <div className="w-full flex flex-col items-center text-center mt-2 mb-6">
        {/* Buddy Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-500/40 text-sky-400 text-xs font-extrabold tracking-wide mb-3">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>BUDDY</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          {greeting}
        </h1>

        {/* Info Link */}
        <button
          onClick={onOpenPatternLibrary}
          className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors mb-6 cursor-pointer"
        >
          <Info className="w-4 h-4 text-sky-400" />
          <span>Buddy आपकी इंग्लिश कैसे समझता है, जानें</span>
        </button>

        {/* Start Today's Story CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full max-w-sm py-4 px-6 rounded-full bg-[#232429] hover:bg-[#2e3037] active:bg-[#1a1b1f] border border-zinc-700/60 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-black/80 transition-all cursor-pointer"
        >
          <span>आज की स्टोरी शुरू करें</span>
          <ArrowRight className="w-4 h-4 text-sky-400 stroke-[2.5]" />
        </motion.button>

        {/* 5-Day Fluency Challenge Card (Under Hindi Story CTA) */}
        {onOpenChallenge && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenChallenge}
            className="w-full max-w-sm mt-3 p-3.5 rounded-2xl bg-[#14151b] hover:bg-[#1a1c24] border border-zinc-800 hover:border-zinc-700 text-left transition-all cursor-pointer shadow-lg flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-white tracking-tight">Fluency Challenge</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    {progress?.challenge?.totalDays || 5} Days • Day {progress?.challenge?.currentDay || 3}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 block mt-0.5">
                  3, 5, 7 or 10 Days • Daily Speaking & Story Habits
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </motion.button>
        )}
      </div>

      {/* Bottom Minimal Navigation Dock */}
      <div className="w-full flex items-center justify-center mt-auto pt-2">
        <div className="bg-[#15161b] border border-zinc-800 rounded-full px-6 py-2.5 flex items-center gap-8 shadow-2xl">
          {/* Buddy Tab (Active) */}
          <button
            onClick={onStart}
            className="flex flex-col items-center gap-1 text-sky-400 font-bold text-xs cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-full border-2 border-sky-400 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
            </div>
            <span className="text-[11px] text-sky-400">Buddy</span>
          </button>

          {/* Patterns Tab */}
          <button
            onClick={onOpenPatternLibrary}
            className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer transition-colors"
          >
            <BookOpen className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[11px]">Patterns</span>
          </button>

          {/* Performance Tab */}
          <button
            onClick={() => setIsProgressOpen(true)}
            className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer transition-colors"
          >
            <ActivityIcon className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[11px]">Performance</span>
          </button>
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
