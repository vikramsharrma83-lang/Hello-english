import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Music,
  Briefcase,
  Building2,
  ShoppingBag,
  Truck,
  Users,
  X,
  Globe,
  Bot,
  Sparkles,
} from 'lucide-react';
import { ConversationTurn, PracticeHistoryItem, DayMap, UserProgress } from '../../types';
import { getTranslation } from '../../lib/translations';

interface HomePageProps {
  onStart: () => void;
  onOpenPatternLibrary: () => void;
  onOpenInspector: () => void;
  onOpenChallenge?: () => void;
  onOpenRockRoll?: (sector?: string) => void;
  onOpenRolePicker?: () => void;
  onOpenProfile?: () => void;
  onOpenHelpRoadmap?: () => void;
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
  onOpenRockRoll,
  onOpenRolePicker,
  onOpenHelpRoadmap,
  progress,
  language = 'en',
  onToggleLanguage,
}) => {
  const [greeting, setGreeting] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting(getTranslation(language, 'good_morning'));
    else if (hours < 17) setGreeting(getTranslation(language, 'good_afternoon'));
    else setGreeting(getTranslation(language, 'good_evening'));
  }, [language]);

  const currentRole = progress?.targetRole || 'Hotels';
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start px-6 pt-8 pb-24 text-slate-100 max-w-[440px] mx-auto min-h-screen relative overflow-hidden bg-slate-950">
      {/* Full-bleed high-quality inspirational study/learning background image */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <img
          src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80"
          alt="Inspirational Learning Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 filter brightness-[0.80] contrast-[1.10] saturate-[1.05]"
        />
        {/* Deep, smooth ambient vignette and gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/55 to-slate-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_transparent_30%,_rgba(2,6,23,0.85)_100%)]" />
      </div>

      {/* Header with Greeting on Left and Rock & Roll on Right Top, with other character underneath */}
      <div className="w-full mb-6 relative z-10 flex items-start justify-between gap-3">
        {/* Left: Greeting in two distinct lines with VIKRAM bold and larger */}
        <div className="flex flex-col pt-0.5">
          <span className="text-xs sm:text-sm font-medium text-slate-300 uppercase tracking-widest leading-tight drop-shadow-xs">
            {greeting}
          </span>
          <span className="text-2xl font-black text-white tracking-wider uppercase drop-shadow-md leading-tight mt-0.5">
            {progress?.userName?.toUpperCase() || 'VIKRAM'}!
          </span>
        </div>

        {/* Right: Stacked Column - Rock & Roll on Top, Character Bot & Utility Underneath */}
        <div className="flex flex-col items-end gap-2">
          {/* Top Right: Prominent Sheeko Amber Rock & Roll Button */}
          <div className="relative">
            <motion.button 
              onClick={() => setShowActionMenu(!showActionMenu)} 
              className="relative group px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/30 via-yellow-500/25 to-amber-600/30 border border-amber-400/80 hover:border-amber-300 flex items-center gap-1.5 cursor-pointer active:scale-95 backdrop-blur-md shadow-md"
              animate={{
                boxShadow: [
                  '0 0 10px rgba(245, 158, 11, 0.45), inset 0 0 6px rgba(251, 191, 36, 0.3)',
                  '0 0 22px rgba(245, 158, 11, 0.8), inset 0 0 12px rgba(251, 191, 36, 0.55)',
                  '0 0 10px rgba(245, 158, 11, 0.45), inset 0 0 6px rgba(251, 191, 36, 0.3)'
                ],
                scale: [1, 1.025, 1],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              title="Rock & Roll / Sectors"
            >
              {/* Outer pulsing ping indicator in Sheeko amber */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>

              <Music className="w-4 h-4 text-amber-300 stroke-[2.5]" />
              <span className="text-xs font-bold tracking-wider uppercase text-amber-100">
                Rock & Roll
              </span>
            </motion.button>

            {/* 2x2 Sector Overlay Container */}
            <AnimatePresence>
              {showActionMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-11 z-50 w-48 bg-slate-900/95 border border-amber-500/40 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Choose Sector</span>
                    <button 
                      onClick={() => setShowActionMenu(false)}
                      className="text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        if (onOpenRockRoll) onOpenRockRoll('hospitality');
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/80 hover:bg-amber-950 hover:border-amber-600/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group"
                      title="Hospitality"
                    >
                      <Building2 className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-105 transition-transform" />
                      <span className="text-[9px] font-medium tracking-tight">Hospitality</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        if (onOpenRockRoll) onOpenRockRoll('retail');
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/80 hover:bg-amber-950 hover:border-amber-600/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group"
                      title="Retail"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-105 transition-transform" />
                      <span className="text-[9px] font-medium tracking-tight">Retail</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        if (onOpenRockRoll) onOpenRockRoll('supply-chain');
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/80 hover:bg-amber-950 hover:border-amber-600/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group"
                      title="Supply Chain"
                    >
                      <Truck className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-105 transition-transform" />
                      <span className="text-[9px] font-medium tracking-tight">Supply Chain</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        if (onOpenRockRoll) onOpenRockRoll('services');
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/80 hover:bg-amber-950 hover:border-amber-600/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group"
                      title="Services"
                    >
                      <Users className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-105 transition-transform" />
                      <span className="text-[9px] font-medium tracking-tight">Services</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Under Rock & Roll: Character Bot guide and Language toggle */}
          <div className="flex items-center gap-2">
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className="px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-slate-500 flex items-center gap-1 text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95 backdrop-blur-md"
                title={`Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}. Click to switch.`}
              >
                <Globe className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-[10px] font-semibold uppercase">{language}</span>
              </button>
            )}

            {onOpenHelpRoadmap && (
              <button
                onClick={onOpenHelpRoadmap}
                className="px-2 py-1 rounded-lg bg-sky-950/80 border border-sky-500/60 hover:border-sky-400 flex items-center gap-1 text-sky-300 hover:text-sky-100 transition-all cursor-pointer shadow-xs active:scale-95 group backdrop-blur-md"
                title="Learning Roadmap & Purpose Guide"
              >
                <Bot className="w-3.5 h-3.5 text-sky-300 stroke-[2.2] group-hover:scale-105 transition-transform" />
                <span className="text-[10px] font-semibold tracking-tight">Guide</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area: Centered vertically on screen */}
      <div className="w-full flex-1 flex flex-col justify-center items-center my-auto py-2 relative z-10">
        {/* Slim Metrics Dashboard (Beginner Level & This Week Activity) */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-4">
          {/* Slim Level Card */}
          <div className="bg-white/[0.07] hover:bg-white/[0.1] border border-white/20 hover:border-white/30 rounded-2xl p-3 flex flex-col justify-between shadow-lg transition-colors backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                <span className="text-xs font-semibold text-slate-100 tracking-tight">
                  {language === 'hi' ? 'Beginner' : 'Beginner'}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-600/50 shadow-xs">
                {language === 'hi' ? '0 अंक' : '0 Pts'}
              </span>
            </div>

            <div className="my-2">
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="w-[15%] h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-300 font-medium">
              <span className="text-slate-200 font-bold">{language === 'hi' ? 'स्तर 1' : 'Lvl 1'}</span>
              <span className="text-slate-300">{language === 'hi' ? 'स्तर 2 के लिए 100 अंक' : '100 pts to Lvl 2'}</span>
            </div>
          </div>

          {/* Slim Weekly Streak Card */}
          <div className="bg-white/[0.07] hover:bg-white/[0.1] border border-white/20 hover:border-white/30 rounded-2xl p-3 flex flex-col justify-between shadow-lg transition-colors backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-bold text-slate-200 uppercase tracking-wider">
                {language === 'hi' ? 'इस सप्ताह' : 'This Week'}
              </span>
              <div className="flex items-center gap-1 text-sky-300 font-semibold text-[10.5px]">
                <Flame className="w-3.5 h-3.5 text-sky-400 fill-sky-400/40" />
                <span>{progress?.streakDays || 1}d</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-0.5 mt-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                const isToday = index === todayIndex;
                const isCompleted = index < todayIndex;

                return (
                  <div key={`${day}-${index}`} className="flex flex-col items-center gap-0.5">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${
                        isToday
                          ? 'bg-sky-400 text-slate-950 ring-2 ring-sky-300/60 shadow-[0_0_8px_rgba(56,189,248,0.7)]'
                          : isCompleted
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {isToday ? '•' : ''}
                    </div>
                    <span className={`text-[8px] font-medium ${isToday ? 'text-sky-300 font-bold' : 'text-slate-300'}`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Featured "Let's Learn" Card - Apple Glass Translucent Aesthetic */}
        <div className="w-full relative group">
          {/* Ambient Apple Glass Background Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400/25 via-indigo-400/20 to-purple-400/25 rounded-[30px] blur-xl opacity-75 group-hover:opacity-100 transition-all duration-700" />
          
          <div 
            onClick={onOpenChallenge || onStart}
            className="w-full relative bg-white/[0.08] hover:bg-white/[0.12] backdrop-blur-2xl border border-white/30 hover:border-white/45 rounded-[28px] p-6 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.45),inset_0_-1px_2px_rgba(0,0,0,0.3)] cursor-pointer transition-all duration-300 active:scale-[0.99] overflow-hidden"
          >
            {/* Specular frosted glass top highlight bar */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

            {/* Micro Translucent Points Pill */}
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xl text-white text-xs px-3.5 py-1 rounded-full mb-3 border border-white/35 shadow-[0_2px_10px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.4)] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-sky-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
              <span className="tracking-wide">{language === 'hi' ? '+25 अंक' : '+25 Points'}</span>
            </div>

            {/* Title */}
            <h3 className="text-3xl font-extrabold mb-2 text-white tracking-tight drop-shadow-md">
              {getTranslation(language, 'lets_learn')}
            </h3>

            {/* Subtitle */}
            <p className="text-slate-100/90 text-xs mb-6 max-w-[240px] leading-relaxed font-normal drop-shadow-sm">
              {getTranslation(language, 'pitch_defend')}
            </p>
            
            {/* Apple-styled Translucent Glass Button CTA with purple glow */}
            <div 
              className="w-full py-3.5 bg-gradient-to-r from-purple-500/30 via-purple-600/25 to-indigo-500/30 hover:from-purple-500/40 hover:to-indigo-500/40 active:scale-[0.98] text-white font-extrabold text-sm tracking-wider uppercase rounded-2xl transition-all duration-300 flex items-center justify-center border border-purple-300/60 shadow-[0_0_24px_rgba(168,85,247,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.5)] backdrop-blur-xl hover:border-purple-200 hover:shadow-[0_0_32px_rgba(168,85,247,0.65)]"
            >
              {getTranslation(language, 'start')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
