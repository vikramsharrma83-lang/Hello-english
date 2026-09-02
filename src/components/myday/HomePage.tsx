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
          src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85"
          alt="Inspirational Learning Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-70 filter brightness-95 contrast-105 saturate-110"
        />
        {/* Balanced gradient overlay to maintain high visibility while keeping UI razor-sharp */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/30 to-slate-950/85" />
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
          <div className="bg-slate-950/75 border border-slate-700/70 hover:border-slate-600 rounded-2xl p-3 flex flex-col justify-between shadow-lg transition-colors backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                <span className="text-xs font-semibold text-slate-100 tracking-tight">
                  {language === 'hi' ? 'Beginner' : 'Beginner'}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-950/90 px-1.5 py-0.5 rounded border border-sky-700/60 shadow-xs">
                {language === 'hi' ? '0 अंक' : '0 Pts'}
              </span>
            </div>

            <div className="my-2">
              <div className="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden">
                <div className="w-[15%] h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-300 font-medium">
              <span className="text-slate-200 font-bold">{language === 'hi' ? 'स्तर 1' : 'Lvl 1'}</span>
              <span className="text-slate-400">{language === 'hi' ? 'स्तर 2 के लिए 100 अंक' : '100 pts to Lvl 2'}</span>
            </div>
          </div>

          {/* Slim Weekly Streak Card */}
          <div className="bg-slate-950/75 border border-slate-700/70 hover:border-slate-600 rounded-2xl p-3 flex flex-col justify-between shadow-lg transition-colors backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-bold text-slate-300 uppercase tracking-wider">
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
                          ? 'bg-sky-500 text-slate-950 ring-2 ring-sky-400/50 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                          : isCompleted
                          ? 'bg-slate-700 text-slate-200'
                          : 'bg-slate-800/80 text-slate-500'
                      }`}
                    >
                      {isToday ? '•' : ''}
                    </div>
                    <span className={`text-[8px] font-medium ${isToday ? 'text-sky-300 font-bold' : 'text-slate-400'}`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Featured "Let's Learn" Card - Apple Glass Glowing Aesthetic */}
        <div className="w-full relative group">
          {/* Ambient Apple Glass Background Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/30 via-indigo-500/25 to-teal-500/30 rounded-[30px] blur-xl opacity-80 group-hover:opacity-100 transition-all duration-700" />
          
          <div 
            onClick={onOpenChallenge || onStart}
            className="w-full relative bg-slate-950/65 backdrop-blur-2xl border border-white/20 hover:border-white/30 rounded-[28px] p-6 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.4)] cursor-pointer transition-all duration-300 active:scale-[0.99] overflow-hidden"
          >
            {/* Subtle frosted glass specular highlight bar across the top */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            {/* Micro Points Pill */}
            <div className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md text-slate-100 text-xs px-3 py-1 rounded-full mb-3 border border-white/20 shadow-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>{language === 'hi' ? '+25 अंक' : '+25 Points'}</span>
            </div>

            {/* Title */}
            <h3 className="text-3xl font-extrabold mb-2 text-white tracking-tight drop-shadow-md">
              {getTranslation(language, 'lets_learn')}
            </h3>

            {/* Subtitle */}
            <p className="text-slate-200 text-xs mb-6 max-w-[240px] leading-relaxed font-normal drop-shadow-xs">
              {getTranslation(language, 'pitch_defend')}
            </p>
            
            {/* Apple-styled Glass Button CTA with glowing purple aura */}
            <div 
              className="w-full py-3.5 bg-gradient-to-r from-purple-600/35 via-purple-500/25 to-indigo-600/35 hover:from-purple-600/45 hover:to-indigo-600/45 active:scale-[0.98] text-white font-extrabold text-sm tracking-wider uppercase rounded-2xl transition-all duration-300 flex items-center justify-center border border-purple-400/50 shadow-[0_0_24px_rgba(168,85,247,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md hover:border-purple-300 hover:shadow-[0_0_32px_rgba(168,85,247,0.65)]"
            >
              {getTranslation(language, 'start')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
