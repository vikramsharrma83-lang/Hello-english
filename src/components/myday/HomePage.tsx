import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  ChevronRight,
  HelpCircle,
  Target,
  Music,
  Briefcase,
  Building2,
  ShoppingBag,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { ConversationTurn, PracticeHistoryItem, DayMap, UserProgress } from '../../types';

interface HomePageProps {
  onStart: () => void;
  onOpenPatternLibrary: () => void;
  onOpenInspector: () => void;
  onOpenChallenge?: () => void;
  onOpenRockRoll?: (sector?: string) => void;
  onOpenRolePicker?: () => void;
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
  onOpenRockRoll,
  onOpenRolePicker,
  progress,
  language = 'en',
}) => {
  const [greeting, setGreeting] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const currentRole = progress?.targetRole || 'Hotels';

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start px-6 pt-10 pb-28 text-zinc-100 max-w-[440px] mx-auto min-h-screen bg-black">
      {/* Header */}
      <div className="w-full flex items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="text-xl font-light text-zinc-400 uppercase tracking-widest">
            {greeting} {progress?.userName?.toUpperCase() || 'VIKRAM'}!
          </h1>
          {onOpenRolePicker && (
            <button
              onClick={onOpenRolePicker}
              className="flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <Briefcase className="w-3 h-3 text-cyan-400" />
              <span>{currentRole}</span>
              <span className="text-[9px] text-zinc-500 font-bold">CHANGE</span>
            </button>
          )}
        </div>

        <div className="relative">
          <motion.button 
            onClick={() => setShowActionMenu(!showActionMenu)} 
            className="relative group p-0.5 flex items-center justify-center cursor-pointer"
            initial={{ filter: "drop-shadow(0 0 6px rgba(245, 158, 11, 0.5))" }}
            animate={{
              scale: [1, 1.06, 1],
              filter: [
                "drop-shadow(0 0 6px rgba(245, 158, 11, 0.5)) drop-shadow(0 0 12px rgba(234, 179, 8, 0.35))", 
                "drop-shadow(0 0 12px rgba(245, 158, 11, 0.8)) drop-shadow(0 0 20px rgba(250, 204, 21, 0.6))", 
                "drop-shadow(0 0 6px rgba(245, 158, 11, 0.5)) drop-shadow(0 0 12px rgba(234, 179, 8, 0.35))"
              ],
            }}
            transition={{
              duration: 2.2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            title="Open Rock & Roll"
          >
            {/* Gold Circle Badge */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-[1.5px] shadow-[0_0_12px_rgba(245,158,11,0.5)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-black">
                <Music className="w-3.5 h-3.5 text-zinc-950 stroke-[2.5]" />
              </div>
            </div>
          </motion.button>

          {/* 2x2 Action Icons Localized Overlay Container */}
          <AnimatePresence>
            {showActionMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-10 z-50 w-44 bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-800/80">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Sectors</span>
                  <button 
                    onClick={() => setShowActionMenu(false)}
                    className="text-zinc-400 hover:text-white p-0.5 rounded-full hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      setShowActionMenu(false);
                      if (onOpenRockRoll) onOpenRockRoll('hospitality');
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-900 hover:bg-amber-500/20 hover:border-amber-500/50 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer group"
                    title="Hospitality"
                  >
                    <Building2 className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-medium tracking-tight">Hospitality</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowActionMenu(false);
                      if (onOpenRockRoll) onOpenRockRoll('retail');
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-900 hover:bg-amber-500/20 hover:border-amber-500/50 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer group"
                    title="Retail"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-medium tracking-tight">Retail</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowActionMenu(false);
                      if (onOpenRockRoll) onOpenRockRoll('supply-chain');
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-900 hover:bg-amber-500/20 hover:border-amber-500/50 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer group"
                    title="Supply Chain"
                  >
                    <Truck className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-medium tracking-tight">Supply Chain</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowActionMenu(false);
                      if (onOpenRockRoll) onOpenRockRoll('services');
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-900 hover:bg-amber-500/20 hover:border-amber-500/50 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer group"
                    title="Services"
                  >
                    <Users className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-medium tracking-tight">Services</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="w-full mb-6">
        {/* Weekly Tracker Card */}
        <div className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800">
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
          <h3 className="text-4xl font-semibold mb-2 relative z-20 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400">Talk to Me</h3>
          <p className="text-zinc-400 mb-8 max-w-[200px] relative z-20">Pitch it. Defend it. Win them over.</p>
          
          <button 
            onClick={onOpenChallenge || onStart}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:bg-white transition-colors relative z-20"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};
