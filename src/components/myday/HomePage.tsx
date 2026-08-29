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

      {/* Top Section: Smart Watch / English Confidence Progress Card */}
      <div className="w-full flex items-center justify-center relative my-auto py-1">
        {/* Ghost Card Left (09) */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-40 h-52 rounded-[32px] border border-zinc-900 bg-zinc-950/30 rotate-[-12deg] opacity-20 flex items-center justify-center pointer-events-none">
          <span className="text-4xl font-mono font-bold text-zinc-700">09</span>
        </div>

        {/* Center Main Watch / Progress Card - Entirely Clickable */}
        <motion.button
          type="button"
          onClick={() => setIsProgressOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative z-10 w-72 sm:w-[300px] h-[340px] rounded-[42px] p-2.5 bg-[#14151a] border-[2px] border-zinc-800 hover:border-zinc-700 shadow-2xl shadow-black flex flex-col cursor-pointer text-left transition-colors group focus:outline-none"
          title="Click to view detailed English Confidence Progress"
        >
          {/* Inner Screen Area */}
          <div className="w-full h-full rounded-[34px] bg-black border border-zinc-900 p-4 sm:p-5 flex flex-col justify-between items-center relative overflow-hidden">
            {/* Top Status Header */}
            <div className="flex items-center justify-between w-full pt-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-800/40 text-amber-300 text-[10px] font-bold">
                <span>🔥 {progress?.streakDays || 5}d Streak</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
                <span className="text-[9px] font-extrabold tracking-wider text-zinc-400 uppercase">
                  PROGRESS
                </span>
              </div>
            </div>

            {/* Center: Large English Confidence Pie Chart & Main Score */}
            <div className="flex flex-col items-center justify-center my-auto text-center w-full">
              {/* Large Pie Chart Ring */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center my-1">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 126 126">
                  {/* Track */}
                  <circle
                    cx="63"
                    cy="63"
                    r={50}
                    fill="transparent"
                    stroke="#18181b"
                    strokeWidth={10}
                  />

                  {/* 7 Weighted Slices in Black & Grey shades */}
                  {watchSlices.map((slice, i) => {
                    const greyShades = ['#3f3f46', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8', '#71717a', '#52525b'];
                    const r = 50;
                    const circ = r * 2 * Math.PI;
                    const dashArray = `${(slice.weight / 100) * circ} ${circ}`;
                    const startAng = (watchSlices.slice(0, i).reduce((acc, cur) => acc + cur.weight, 0) / 100) * 360;
                    const dashOffset = -((startAng / 360) * circ);

                    return (
                      <circle
                        key={slice.id}
                        cx="63"
                        cy="63"
                        r={r}
                        fill="transparent"
                        stroke={greyShades[i % greyShades.length]}
                        strokeWidth={10}
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>

                {/* Center Score % in ring */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                    {confidenceData.overallScore}%
                  </span>
                </div>
              </div>

              {/* Clean Minimal Main Label */}
              <div className="text-sm sm:text-base font-extrabold text-zinc-200 tracking-tight mt-1.5">
                English Confidence: {confidenceData.overallScore}%
              </div>

              {/* 3 Small Indicators in Grey/Zinc shade */}
              <div className="mt-2.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center gap-2 text-[10px] font-semibold tracking-tight text-zinc-400">
                <span>Grammar {confidenceData.cardIndicators.grammar}%</span>
                <span className="text-zinc-600 font-bold">|</span>
                <span>Comm {confidenceData.cardIndicators.communication}%</span>
                <span className="text-zinc-600 font-bold">|</span>
                <span>Vocab {confidenceData.cardIndicators.vocabulary}%</span>
              </div>
            </div>

            <div className="w-full text-center pb-1">
              <span className="text-[10px] text-zinc-500 font-medium tracking-tight">Tap for breakdown →</span>
            </div>
          </div>
        </motion.button>

        {/* Ghost Card Right (10) */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-40 h-52 rounded-[32px] border border-zinc-900 bg-zinc-950/30 rotate-[12deg] opacity-20 flex items-center justify-center pointer-events-none">
          <span className="text-4xl font-mono font-bold text-zinc-700">10</span>
        </div>
      </div>



      {/* Middle Greeting & CTA */}
      <div className="w-full flex flex-col items-center text-center mt-2 mb-6">
        {/* Buddy Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-extrabold tracking-wide mb-3">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span>BUDDY</span>
        </div>


        {/* Course / Fluency Challenge Card */}
        {onOpenChallenge && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenChallenge}
            className="w-full max-w-[260px] mx-auto mt-3 py-2.5 px-4 rounded-full bg-[#14151b] hover:bg-[#1a1c24] border border-zinc-800 hover:border-zinc-700 text-left transition-all cursor-pointer shadow-lg flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400/30 via-teal-500/25 to-sky-500/30 border border-emerald-400/40 relative flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(16,185,129,0.3)] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
                <div className="absolute inset-1 rounded-xl bg-radial from-emerald-300/20 via-transparent to-transparent pointer-events-none" />
                <Target className="w-4.5 h-4.5 text-emerald-300 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)] relative z-10" />
              </div>
              <span className="text-xs font-bold text-white tracking-wider">COURSE</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
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
