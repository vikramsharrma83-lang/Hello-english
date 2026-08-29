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
} from 'lucide-react';

interface HomePageProps {
  onStart: () => void;
  onOpenPatternLibrary: () => void;
  onOpenInspector: () => void;
  onSelectSample?: (sampleText: string) => void;
  onClose?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStart,
  onOpenPatternLibrary,
  onOpenInspector,
  onClose,
}) => {
  const [timeString, setTimeString] = useState('3:23');
  const [greeting, setGreeting] = useState('Good Afternoon');

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

      {/* Top Section: Smart Watch / Futuristic Echo Widget */}
      <div className="w-full flex items-center justify-center relative my-auto py-2">
        {/* Ghost Card Left (09) */}
        <div className="absolute -left-10 sm:-left-6 top-1/2 -translate-y-1/2 w-48 h-64 rounded-[36px] border border-zinc-800/40 bg-zinc-950/40 rotate-[-12deg] opacity-25 flex items-center justify-center pointer-events-none">
          <span className="text-5xl font-mono font-bold text-zinc-600">09</span>
        </div>

        {/* Center Main Futuristic Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-60 sm:w-64 h-80 rounded-[44px] p-2 bg-[#1b1c22] border-[3px] border-[#2c2d36] shadow-2xl shadow-black flex flex-col"
        >
          {/* Inner Screen Area */}
          <div className="w-full h-full rounded-[36px] bg-[#0c0d12] border border-zinc-800/80 p-5 flex flex-col justify-between relative overflow-hidden">
            {/* Top Status Header */}
            <div className="flex items-center justify-between w-full pt-1">
              <span className="text-[11px] font-extrabold tracking-wider text-[#ff5083]">
                ECHO
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                <span className="text-[11px] font-extrabold tracking-wider text-sky-400">
                  BUDDY
                </span>
              </div>
            </div>

            {/* Center Time & Activity Pulse */}
            <div className="flex flex-col items-center justify-center my-auto text-center">
              <div className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight font-sans">
                {timeString}
              </div>
              <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800">
                <ActivityIcon className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />
                <span className="text-xs font-extrabold tracking-wider text-sky-400">
                  3 ACTIVITIES
                </span>
              </div>
            </div>

            {/* Bottom Status Sync Bar */}
            <div className="w-full pt-2 border-t border-zinc-800/70 flex items-center justify-center">
              <span className="text-[9px] font-mono tracking-widest text-teal-400 font-semibold">
                LISTEN • REPHRASE • SYNC
              </span>
            </div>
          </div>
        </motion.div>

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
      </div>

      {/* Bottom Minimal Navigation Dock */}
      <div className="w-full flex items-center justify-center mt-auto pt-2">
        <div className="bg-[#15161b] border border-zinc-800 rounded-full px-5 py-2.5 flex items-center gap-7 shadow-2xl">
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
            onClick={onOpenInspector}
            className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer transition-colors"
          >
            <ActivityIcon className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[11px]">Performance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
