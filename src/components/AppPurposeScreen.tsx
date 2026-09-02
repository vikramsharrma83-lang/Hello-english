import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  Footprints, 
  Music,
  ArrowRight,
  X,
  Bot,
  Play,
  Pause
} from 'lucide-react';

interface AppPurposeScreenProps {
  onContinue: () => void;
  onClose?: () => void;
}

const AUDIO_SCRIPT = "Hello! English सीखने के लिए इस ऐप को चार आसान steps में use करें। पहले Learn में English समझें, फिर Practice में खुद sentences बनाएं, Speak में real situations में बोलने की practice करें, और Improve में अपनी Rock and Roll journey देखें और अपनी English को और बेहतर बनाएं। बस रोज़ थोड़ा practice करें और English बेहतर बनाएं!";
const TOTAL_DURATION = 15.5; // seconds

export const AppPurposeScreen: React.FC<AppPurposeScreenProps> = ({ onContinue, onClose }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  const handleDismiss = () => {
    stopAudio();
    if (onClose) onClose();
    else onContinue();
  };

  // Step timing windows based on Hindi audio narration (in seconds)
  useEffect(() => {
    if (currentTime >= 3.8 && currentTime < 6.6) {
      setActiveStepIndex(0);
    } else if (currentTime >= 6.6 && currentTime < 9.3) {
      setActiveStepIndex(1);
    } else if (currentTime >= 9.3 && currentTime < 12.0) {
      setActiveStepIndex(2);
    } else if (currentTime >= 12.0 && currentTime < 14.8) {
      setActiveStepIndex(3);
    } else {
      setActiveStepIndex(-1);
    }
  }, [currentTime]);

  const speakText = (startOffset = 0) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(AUDIO_SCRIPT);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const startAudio = () => {
    setIsPlaying(true);
    const now = Date.now();
    startTimeRef.current = now - pausedAtRef.current * 1000;

    speakText(pausedAtRef.current);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed >= TOTAL_DURATION) {
        stopAudio(true);
      } else {
        setCurrentTime(elapsed);
        pausedAtRef.current = elapsed;
      }
    }, 50);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const stopAudio = (finished = false) => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (finished) {
      setCurrentTime(TOTAL_DURATION);
      pausedAtRef.current = 0;
      setActiveStepIndex(-1);
    } else {
      setCurrentTime(0);
      pausedAtRef.current = 0;
      setActiveStepIndex(-1);
    }
  };

  const replayAudio = () => {
    stopAudio();
    setTimeout(() => {
      setCurrentTime(0);
      pausedAtRef.current = 0;
      startAudio();
    }, 50);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      if (currentTime >= TOTAL_DURATION) {
        replayAudio();
      } else {
        startAudio();
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const steps = [
    {
      stepNumber: '01',
      title: 'LEARN',
      subtitle: 'Understand daily words & rules',
      tabName: 'Bytes',
      Icon: Compass,
      color: 'sky',
      iconColor: 'text-sky-400',
      activeIconColor: 'text-slate-950',
      activeRing: 'ring-4 ring-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.85)]',
      iconBoxBg: 'bg-gradient-to-br from-sky-950/90 via-slate-900 to-slate-950 border border-sky-600/40 text-sky-400',
      activeIconBoxBg: 'bg-gradient-to-br from-sky-400 via-sky-500 to-indigo-500 border-2 border-white text-slate-950 shadow-xl',
      titleColor: 'text-sky-400',
      tabBadge: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
      activeTabBadge: 'bg-sky-400 text-slate-950 font-bold border-sky-300',
      glowBg: 'rgba(56,189,248,0.35)',
    },
    {
      stepNumber: '02',
      title: 'PRACTICE',
      subtitle: 'Build sentences with AI hints',
      tabName: 'Sheeko',
      Icon: Sparkles,
      color: 'amber',
      iconColor: 'text-amber-400',
      activeIconColor: 'text-slate-950',
      activeRing: 'ring-4 ring-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.85)]',
      iconBoxBg: 'bg-gradient-to-br from-amber-950/90 via-slate-900 to-slate-950 border border-amber-600/40 text-amber-400',
      activeIconBoxBg: 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 border-2 border-white text-slate-950 shadow-xl',
      titleColor: 'text-amber-400',
      tabBadge: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      activeTabBadge: 'bg-amber-400 text-slate-950 font-bold border-amber-300',
      glowBg: 'rgba(245,158,11,0.35)',
    },
    {
      stepNumber: '03',
      title: 'SPEAK',
      subtitle: 'Real workplace & daily talks',
      tabName: 'Buddy',
      Icon: Footprints,
      color: 'teal',
      iconColor: 'text-teal-400',
      activeIconColor: 'text-slate-950',
      activeRing: 'ring-4 ring-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.85)]',
      iconBoxBg: 'bg-gradient-to-br from-teal-950/90 via-slate-900 to-slate-950 border border-teal-600/40 text-teal-400',
      activeIconBoxBg: 'bg-gradient-to-br from-teal-400 via-emerald-400 to-teal-500 border-2 border-white text-slate-950 shadow-xl',
      titleColor: 'text-teal-400',
      tabBadge: 'bg-teal-950/80 text-teal-300 border-teal-800/60',
      activeTabBadge: 'bg-teal-400 text-slate-950 font-bold border-teal-300',
      glowBg: 'rgba(20,184,166,0.35)',
    },
    {
      stepNumber: '04',
      title: 'IMPROVE',
      subtitle: 'Fast roleplay & track growth',
      tabName: 'Rock & Roll',
      Icon: Music,
      color: 'purple',
      iconColor: 'text-purple-400',
      activeIconColor: 'text-slate-950',
      activeRing: 'ring-4 ring-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.85)]',
      iconBoxBg: 'bg-gradient-to-br from-purple-950/90 via-slate-900 to-slate-950 border border-purple-600/40 text-purple-400',
      activeIconBoxBg: 'bg-gradient-to-br from-purple-400 via-fuchsia-400 to-indigo-500 border-2 border-white text-slate-950 shadow-xl',
      titleColor: 'text-purple-400',
      tabBadge: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
      activeTabBadge: 'bg-purple-400 text-slate-950 font-bold border-purple-300',
      glowBg: 'rgba(168,85,247,0.35)',
    },
  ];

  const progressPercent = Math.min(100, Math.max(0, (currentTime / TOTAL_DURATION) * 100));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col items-center justify-between px-4 py-3 sm:py-5 overflow-y-auto select-none font-sans"
    >
      <div className="w-full max-w-[420px] mx-auto flex-1 flex flex-col justify-between relative z-10 my-auto">
        {/* Top Header section */}
        <div className="relative pt-0.5 pb-2 text-center">
          {/* Close / Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute right-0 top-0 w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95 z-20"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1"
          >
            <Bot className="w-3 h-3 text-sky-400" />
            <span>Learning Roadmap</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase"
            style={{ fontFamily: "'Syncopate', sans-serif" }}
          >
            HELLO ENGLISH
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[11px] text-slate-400 mt-0.5 max-w-xs mx-auto font-medium"
          >
            4 daily steps to build fluent spoken English
          </motion.p>
        </div>

        {/* 4 Steps Flow with Big Distributed Pop-out Icons */}
        <div className="relative flex-1 flex flex-col justify-around py-4 sm:py-6 px-1 my-1 min-h-[340px]">
          {/* Continuous Dropping Line / Connector Track */}
          <div className="absolute left-[31px] sm:left-[35px] top-8 bottom-8 w-0.5 bg-slate-800/80 -z-0">
            {/* Animated glowing drop beam */}
            <motion.div 
              className="w-full bg-gradient-to-b from-sky-400 via-amber-400 to-purple-500"
              animate={{ 
                height: isPlaying ? ['0%', '100%'] : '100%',
                opacity: isPlaying ? [0.6, 1, 0.6] : 0.7
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: 'easeInOut' 
              }}
              style={{ height: '100%' }}
            />
          </div>

          <div className="flex flex-col justify-around flex-1 gap-5 sm:gap-6 relative z-10">
            {steps.map((item, index) => {
              const isHighlighted = activeStepIndex === index;
              const StepIcon = item.Icon;

              return (
                <div key={item.title} className="relative flex items-center gap-4 group">
                  {/* Big Icon Container with Pop-out Effect */}
                  <div className="relative shrink-0 flex items-center justify-center">
                    {/* Active Pulsing Aura Ring */}
                    {isHighlighted && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: [1, 1.4, 1.15], opacity: [0.85, 0, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut' }}
                        className="absolute -inset-3 rounded-2xl pointer-events-none"
                        style={{ backgroundColor: item.glowBg }}
                      />
                    )}

                    {/* The Big Pop-Out Icon */}
                    <motion.div
                      animate={{
                        scale: isHighlighted ? 1.28 : 1,
                        y: isHighlighted ? -2 : 0,
                        rotate: isHighlighted ? [0, -3, 3, 0] : 0,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 20,
                        mass: 0.6,
                      }}
                      className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center transition-colors duration-200 cursor-default ${
                        isHighlighted ? `${item.activeIconBoxBg} ${item.activeRing}` : item.iconBoxBg
                      }`}
                    >
                      <StepIcon 
                        className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 transition-transform duration-200 ${
                          isHighlighted ? item.activeIconColor : item.iconColor
                        }`} 
                        strokeWidth={isHighlighted ? 2.5 : 2}
                      />

                      {/* Small Step Pill Badge on Corner */}
                      <span className={`absolute -top-1 -right-1 text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-full border shadow-xs ${
                        isHighlighted 
                          ? 'bg-white text-slate-950 border-white font-extrabold' 
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}>
                        {item.stepNumber}
                      </span>
                    </motion.div>
                  </div>

                  {/* Text Alongside Big Icon (No Increase in Size) */}
                  <motion.div 
                    animate={{
                      x: isHighlighted ? 4 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <h2 className={`text-sm sm:text-base font-extrabold tracking-wide uppercase transition-colors ${
                        isHighlighted ? 'text-white' : item.titleColor
                      }`}>
                        {item.title}
                      </h2>

                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md border tracking-wider uppercase transition-colors ${
                        isHighlighted ? item.activeTabBadge : item.tabBadge
                      }`}>
                        {item.tabName}
                      </span>
                    </div>

                    <p className={`text-xs mt-0.5 font-medium leading-snug transition-colors ${
                      isHighlighted ? 'text-slate-100 font-semibold' : 'text-slate-400'
                    }`}>
                      {item.subtitle}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Action CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="pt-2 pb-0.5"
        >
          <button
            onClick={handleDismiss}
            className="w-full py-2.5 sm:py-3 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-[0.98]"
          >
            <span>Start Learning Now</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
          <p className="text-center text-[9.5px] text-slate-500 mt-1 font-medium">
            Open this guide anytime via the Guide icon on Home
          </p>
        </motion.div>
      </div>

      {/* Floating Small Play/Pause Icon at Right Bottom */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={togglePlayPause}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl border ${
          isPlaying 
            ? 'bg-sky-400 text-slate-950 border-sky-300 ring-4 ring-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.6)] animate-pulse' 
            : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-700/80 hover:border-slate-600 backdrop-blur-md'
        }`}
        title={isPlaying ? 'Pause Audio Guide' : 'Play Audio Guide'}
        aria-label={isPlaying ? 'Pause Audio Guide' : 'Play Audio Guide'}
      >
        {isPlaying ? (
          <Pause className="w-4.5 h-4.5 fill-current stroke-[2]" />
        ) : (
          <Play className="w-4.5 h-4.5 fill-current stroke-[2] ml-0.5" />
        )}
      </motion.button>
    </motion.div>
  );
};
