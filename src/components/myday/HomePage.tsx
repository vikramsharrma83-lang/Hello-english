import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Music,
  Building2,
  ShoppingBag,
  Truck,
  Users,
  X,
  Globe,
  Bot,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { ConversationTurn, PracticeHistoryItem, DayMap, UserProgress } from '../../types';
import { getTranslation } from '../../lib/translations';
import { isPlaygroundActiveAndIncomplete } from '../../utils/playgroundManager';

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
  onOpenHelpRoadmap,
  progress,
  language = 'en',
  onToggleLanguage,
}) => {
  const [greeting, setGreeting] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showStatsDrawer, setShowStatsDrawer] = useState(false);
  const [hasIncompletePlayground, setHasIncompletePlayground] = useState<boolean>(() => isPlaygroundActiveAndIncomplete());

  useEffect(() => {
    setHasIncompletePlayground(isPlaygroundActiveAndIncomplete());
  }, []);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting(getTranslation(language, 'good_morning'));
    else if (hours < 17) setTranslationGreeting(getTranslation(language, 'good_afternoon'));
    else setTranslationGreeting(getTranslation(language, 'good_evening'));
  }, [language]);

  const setTranslationGreeting = (val: string) => setGreeting(val);

  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="w-full flex-1 flex flex-col justify-between text-slate-100 min-h-screen relative overflow-hidden bg-[#0a0c10] select-none">
      {/* 1. Full-Bleed Dark Atmospheric Background with Headphones & Ambient Glow Pins */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Cinematic dark desk & headphones photography */}
        <img
          src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85"
          alt="English from Everywhere"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-right-bottom filter brightness-[0.72] contrast-125 saturate-[1.15]"
        />

        {/* World Map Silhouette & Glowing Location Pins Layer */}
        <div className="absolute inset-0 opacity-45 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px] mix-blend-screen" />

        {/* Ambient Golden Location Pins scattered across the dark background */}
        <div className="absolute top-[18%] right-[18%] text-amber-400/90 animate-pulse">
          <MapPin className="w-5 h-5 fill-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
        </div>
        <div className="absolute top-[26%] right-[32%] text-amber-400/80 animate-pulse delay-300">
          <MapPin className="w-4 h-4 fill-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
        </div>
        <div className="absolute top-[32%] right-[10%] text-amber-400/85 animate-pulse delay-700">
          <MapPin className="w-4.5 h-4.5 fill-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
        </div>
        <div className="absolute top-[38%] right-[22%] text-amber-400/75 animate-pulse delay-500">
          <MapPin className="w-3.5 h-3.5 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
        </div>
        <div className="absolute top-[44%] right-[14%] text-amber-400/85 animate-pulse delay-200">
          <MapPin className="w-4 h-4 fill-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
        </div>
        <div className="absolute top-[48%] right-[28%] text-amber-400/70 animate-pulse delay-1000">
          <MapPin className="w-3 h-3 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
        </div>

        {/* Vignette & Contrast Gradients for exact optical balance */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-black/75" />
      </div>

      {/* 2. Top Header Utility Bar */}
      <div className="w-full px-6 pt-6 pb-2 relative z-20 flex items-center justify-between max-w-lg mx-auto">
        {/* User Greeting Tag */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            {progress?.userName || 'VIKRAM'}
          </span>
        </div>

        {/* Controls: Language, Guide, Rock & Roll */}
        <div className="flex items-center gap-1.5">
          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1 rounded-full bg-black/50 border border-slate-700/70 hover:border-slate-500 flex items-center gap-1 text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95 backdrop-blur-md"
              title={`Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}`}
            >
              <Globe className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-[10px] font-bold uppercase">{language}</span>
            </button>
          )}

          {onOpenHelpRoadmap && (
            <button
              onClick={onOpenHelpRoadmap}
              className="px-2.5 py-1 rounded-full bg-sky-950/70 border border-sky-500/50 hover:border-sky-400 flex items-center gap-1 text-sky-300 hover:text-sky-100 transition-all cursor-pointer shadow-xs active:scale-95 backdrop-blur-md"
              title="Roadmap & Guide"
            >
              <Bot className="w-3.5 h-3.5 text-sky-300 stroke-[2.2]" />
              <span className="text-[10px] font-bold">Guide</span>
            </button>
          )}

          {/* Rock & Roll Sector Trigger */}
          <div className="relative">
            <motion.button 
              onClick={() => setShowActionMenu(!showActionMenu)} 
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="p-1.5 rounded-full bg-gradient-to-r from-amber-500/30 to-purple-600/30 border border-amber-400/80 hover:border-amber-300 flex items-center justify-center cursor-pointer shadow-md backdrop-blur-md"
              title="Rock & Roll Sectors"
            >
              <Music className="w-3.5 h-3.5 text-amber-300 stroke-[2.4]" />
            </motion.button>

            <AnimatePresence>
              {showActionMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-9 z-50 w-48 bg-slate-950/95 border border-amber-500/40 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Rock & Roll Sectors</span>
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
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/80 hover:bg-amber-950 hover:border-amber-600/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group"
                    >
                      <Building2 className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-105 transition-transform" />
                      <span className="text-[9px] font-medium tracking-tight">Hospitality</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        if (onOpenRockRoll) onOpenRockRoll('retail');
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/80 hover:bg-amber-950 hover:border-amber-600/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-105 transition-transform" />
                      <span className="text-[9px] font-medium tracking-tight">Retail</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        if (onOpenRockRoll) onOpenRockRoll('supply-chain');
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/80 hover:bg-amber-950 hover:border-amber-600/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group"
                    >
                      <Truck className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-105 transition-transform" />
                      <span className="text-[9px] font-medium tracking-tight">Supply Chain</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                        if (onOpenRockRoll) onOpenRockRoll('services');
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/80 hover:bg-amber-950 hover:border-amber-600/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group"
                    >
                      <Users className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-105 transition-transform" />
                      <span className="text-[9px] font-medium tracking-tight">Services</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. Pull-Out Toggle Button on Right Edge of Screen */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30">
        <motion.button
          onClick={() => setShowStatsDrawer(true)}
          whileHover={{ x: -3, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-slate-950/85 hover:bg-slate-900 text-slate-200 border-l-2 border-y border-sky-400/80 hover:border-sky-300 pl-2.5 pr-1.5 py-3 rounded-l-2xl shadow-[0_0_20px_rgba(56,189,248,0.35)] flex flex-col items-center gap-1.5 cursor-pointer backdrop-blur-xl transition-colors group"
          title="Open Progress & Stats"
          aria-label="Open Progress & Stats"
        >
          <TrendingUp className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          <div className="flex items-center text-[10px] font-bold text-sky-300 uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">
            Stats
          </div>
        </motion.button>
      </div>

      {/* 4. Exact Hero Typography & Call-To-Action (Replicated directly from attachment) */}
      <div className="w-full flex-1 flex flex-col justify-center px-8 sm:px-10 relative z-10 max-w-lg mx-auto pb-24">
        {/* Large Bold Display Typography */}
        <div className="flex flex-col mb-2">
          <h1 className="text-[44px] sm:text-[54px] font-black tracking-tight leading-[1.05] text-white">
            English
          </h1>
          <h1 className="text-[44px] sm:text-[54px] font-black tracking-tight leading-[1.05] text-white">
            from
          </h1>
          <h1 className="text-[44px] sm:text-[54px] font-black tracking-tight leading-[1.05] text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.45)]">
            everywhere
          </h1>
        </div>

        {/* Small Yellow Accent Line under text */}
        <div className="w-12 h-1 bg-amber-400 rounded-full my-4 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />

        {/* Exact Subtitle Description */}
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-[280px] sm:max-w-xs mb-8 drop-shadow-sm">
          Real English for real life.
          <br />
          Learn, practice and speak with
          <br />
          confidence—anytime, anywhere.
        </p>

        {/* Exact Start My Day Pill Button */}
        <div>
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#181a20]/90 hover:bg-[#20232b] border border-slate-700/80 hover:border-slate-500 text-white font-semibold text-sm sm:text-base shadow-2xl transition-all cursor-pointer backdrop-blur-xl group shadow-black/80 relative"
          >
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              {hasIncompletePlayground && (
                <span 
                  className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-[#181a20] shadow-[0_0_8px_rgba(244,63,94,0.95)] animate-pulse" 
                  title="Daily Playground incomplete"
                />
              )}
            </div>
            <span className="tracking-wide">Start My Day</span>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>

      {/* 5. Slide-Out Drawer for Beginner & This Week Cards */}
      <AnimatePresence>
        {showStatsDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowStatsDrawer(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[310px] sm:w-[350px] bg-slate-950/95 border-l border-slate-800 p-5 flex flex-col justify-start gap-4 shadow-2xl backdrop-blur-2xl overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sky-400" />
                  <span className="font-bold text-white text-base tracking-tight">Your Progress</span>
                </div>
                <button
                  onClick={() => setShowStatsDrawer(false)}
                  className="p-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Beginner Level Card */}
              <div className="w-full bg-slate-900/85 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
                    <span className="text-sm font-bold text-white tracking-tight">
                      Beginner
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded-md border border-sky-700/60 shadow-xs">
                    0 Pts
                  </span>
                </div>

                <div className="my-3">
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[15%] h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span className="text-slate-200 font-bold">Lvl 1</span>
                  <span className="text-slate-400">100 pts to Lvl 2</span>
                </div>
              </div>

              {/* Weekly Activity / Streak Card (Below Beginner Card) */}
              <div className="w-full bg-slate-900/85 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {language === 'hi' ? 'इस सप्ताह' : 'This Week'}
                  </span>
                  <div className="flex items-center gap-1.5 text-sky-300 font-bold text-xs">
                    <Flame className="w-4 h-4 text-sky-400 fill-sky-400/40" />
                    <span>{progress?.streakDays || 1}d Streak</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 mt-4">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                    const isToday = index === todayIndex;
                    const isCompleted = index < todayIndex;

                    return (
                      <div key={`${day}-${index}`} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            isToday
                              ? 'bg-sky-500 text-slate-950 ring-2 ring-sky-400/50 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                              : isCompleted
                              ? 'bg-slate-700 text-slate-200'
                              : 'bg-slate-800/80 text-slate-500'
                          }`}
                        >
                          {isToday ? '•' : ''}
                        </div>
                        <span className={`text-[10px] font-medium ${isToday ? 'text-sky-300 font-bold' : 'text-slate-400'}`}>
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

