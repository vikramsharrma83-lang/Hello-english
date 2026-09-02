import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  Footprints, 
  Activity, 
  ArrowDown, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface AppPurposeScreenProps {
  onContinue: () => void;
}

export const AppPurposeScreen: React.FC<AppPurposeScreenProps> = ({ onContinue }) => {
  const steps = [
    {
      stepNumber: '01',
      title: 'LEARN',
      subtitle: 'Understand English',
      description: 'Master core English patterns, essential vocabulary, and real meanings with quick bite-sized daily lessons.',
      tabName: 'Bytes',
      icon: (
        <div className="relative">
          <Compass className="w-6 h-6 text-zinc-100 stroke-[2]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md ring-2 ring-[#18191E]" />
        </div>
      ),
      accentColor: 'border-zinc-700/80 hover:border-zinc-500 text-zinc-200',
      badgeBg: 'bg-zinc-800 text-zinc-200 border-zinc-700',
      glowColor: 'group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]',
      gradient: 'from-zinc-900/90 to-zinc-950/90',
    },
    {
      stepNumber: '02',
      title: 'PRACTICE',
      subtitle: 'Make your own sentences',
      description: 'Create your own sentences with interactive AI prompt drills, smart instant feedback, and structure coaching.',
      tabName: 'Sheeko',
      icon: (
        <Sparkles className="w-6 h-6 text-amber-400 stroke-[2] drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
      ),
      accentColor: 'border-amber-500/40 hover:border-amber-500 text-amber-400',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      glowColor: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      gradient: 'from-amber-950/25 via-zinc-900/90 to-zinc-950/90',
    },
    {
      stepNumber: '03',
      title: 'SPEAK',
      subtitle: 'Use English in real situations',
      description: 'Speak in 1-on-1 workplace simulations, customer conversations, and real scenario dialogues with Buddy.',
      tabName: 'Buddy',
      icon: (
        <Footprints className="w-6 h-6 text-cyan-400 stroke-[2] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
      ),
      accentColor: 'border-cyan-500/40 hover:border-cyan-500 text-cyan-400',
      badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      glowColor: 'group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]',
      gradient: 'from-cyan-950/25 via-zinc-900/90 to-zinc-950/90',
    },
    {
      stepNumber: '04',
      title: 'IMPROVE',
      subtitle: 'Speak more naturally and confidently',
      description: 'Track your Confidence Score, grammar accuracy, speaking minutes, and unlock daily fluency milestones.',
      tabName: 'Summary',
      icon: (
        <Activity className="w-6 h-6 text-rose-500 stroke-[2.2] drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
      ),
      accentColor: 'border-rose-500/40 hover:border-rose-500 text-rose-400',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      glowColor: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]',
      gradient: 'from-rose-950/25 via-zinc-900/90 to-zinc-950/90',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col items-center justify-between px-4 py-6 overflow-y-auto select-none font-sans"
    >
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[420px] mx-auto flex-1 flex flex-col justify-between relative z-10 my-auto">
        {/* Header section */}
        <div className="text-center pt-2 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-700/80 text-[11px] font-bold uppercase tracking-widest text-zinc-300 mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Learning Roadmap</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase"
            style={{ fontFamily: "'Syncopate', sans-serif" }}
          >
            HELLO ENGLISH
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed"
          >
            A 4-step daily cycle engineered to build real spoken English fluency
          </motion.p>
        </div>

        {/* 4 Cards with Connecting Arrows */}
        <div className="space-y-2.5 my-2">
          {steps.map((item, index) => (
            <React.Fragment key={item.title}>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * (index + 1), duration: 0.35 }}
                className={`group relative bg-gradient-to-br ${item.gradient} rounded-2xl p-3.5 border ${item.accentColor} transition-all duration-300 shadow-xl ${item.glowColor}`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Icon Card matching bottom dock nav */}
                  <div className="w-12 h-12 rounded-xl bg-[#18191E] border border-zinc-800 flex items-center justify-center shrink-0 shadow-md">
                    {item.icon}
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black tracking-wider uppercase">
                          {item.title}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${item.badgeBg}`}>
                          Tab: {item.tabName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-zinc-500">
                        {item.stepNumber}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-white mt-0.5 leading-snug">
                      {item.subtitle}
                    </p>

                    <p className="text-[11px] text-zinc-400 mt-1 leading-normal line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Connecting arrow between cards */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 * (index + 1) + 0.1 }}
                  className="flex items-center justify-center py-0.5"
                >
                  <div className="flex items-center gap-1 text-zinc-600">
                    <div className="w-3 h-px bg-zinc-800" />
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                      <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div className="w-3 h-px bg-zinc-800" />
                  </div>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pt-4 pb-2"
        >
          <button
            onClick={onContinue}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] cursor-pointer"
          >
            <span>Start Learning Now</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
          <p className="text-center text-[10px] text-zinc-500 mt-2 font-medium">
            Explore all 4 tabs anytime from the bottom navigation bar
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
