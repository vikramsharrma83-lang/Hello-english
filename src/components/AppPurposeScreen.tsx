import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  Footprints, 
  Music,
  ArrowDown, 
  ArrowRight,
  X,
  Bot,
  Play,
  Pause,
  RotateCcw,
  Volume2
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
      subtitle: 'Understand English',
      description: 'Daily mini lessons for words and sentence rules.',
      tabName: 'Bytes',
      icon: (
        <div className="relative w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
          <Compass className="w-4.5 h-4.5 text-sky-300 stroke-[2]" />
        </div>
      ),
      accentBorder: 'border-slate-200 hover:border-slate-300',
      activeBorder: 'border-sky-500 ring-2 ring-sky-500/20 shadow-sm',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      activeBadgeBg: 'bg-sky-100 text-sky-800 border-sky-300 font-semibold',
      cardBg: 'bg-white',
      titleColor: 'text-slate-800',
      numberColor: 'text-slate-400',
    },
    {
      stepNumber: '02',
      title: 'PRACTICE',
      subtitle: 'Make your own sentences',
      description: 'Build sentences with instant AI hints and corrections.',
      tabName: 'Sheeko',
      icon: (
        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
          <Sparkles className="w-4.5 h-4.5 text-indigo-300 stroke-[2]" />
        </div>
      ),
      accentBorder: 'border-slate-200 hover:border-slate-300',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      activeBadgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300 font-semibold',
      cardBg: 'bg-white',
      titleColor: 'text-slate-800',
      numberColor: 'text-slate-400',
    },
    {
      stepNumber: '03',
      title: 'SPEAK',
      subtitle: 'Use English in real situations',
      description: 'Talk in everyday workplace and customer situations.',
      tabName: 'Buddy',
      icon: (
        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
          <Footprints className="w-4.5 h-4.5 text-teal-300 stroke-[2]" />
        </div>
      ),
      accentBorder: 'border-slate-200 hover:border-slate-300',
      activeBorder: 'border-teal-600 ring-2 ring-teal-600/20 shadow-sm',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      activeBadgeBg: 'bg-teal-100 text-teal-800 border-teal-300 font-semibold',
      cardBg: 'bg-white',
      titleColor: 'text-slate-800',
      numberColor: 'text-slate-400',
    },
    {
      stepNumber: '04',
      title: 'IMPROVE',
      subtitle: 'Speak more naturally and confidently',
      description: 'Play fast roleplay challenges to speak naturally.',
      tabName: 'Rock & Roll',
      icon: (
        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
          <Music className="w-4.5 h-4.5 text-sky-300 stroke-[2]" />
        </div>
      ),
      accentBorder: 'border-slate-200 hover:border-slate-300',
      activeBorder: 'border-sky-600 ring-2 ring-sky-600/20 shadow-sm',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      activeBadgeBg: 'bg-sky-100 text-sky-800 border-sky-300 font-semibold',
      cardBg: 'bg-white',
      titleColor: 'text-slate-800',
      numberColor: 'text-slate-400',
    },
  ];

  const progressPercent = Math.min(100, Math.max(0, (currentTime / TOTAL_DURATION) * 100));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col items-center justify-between px-4 py-3 sm:py-5 overflow-y-auto select-none font-sans"
    >
      <div className="w-full max-w-[400px] mx-auto flex-1 flex flex-col justify-between relative z-10 my-auto">
        {/* Top Header section */}
        <div className="relative pt-0.5 pb-1 text-center">
          {/* Close / Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute right-0 top-0 w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-xs active:scale-95 z-20"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-1"
          >
            <Bot className="w-3 h-3 text-slate-500" />
            <span>Learning Roadmap</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight uppercase"
            style={{ fontFamily: "'Syncopate', sans-serif" }}
          >
            HELLO ENGLISH
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[11px] text-slate-500 mt-0.5 max-w-xs mx-auto font-medium"
          >
            4 daily steps to build fluent spoken English
          </motion.p>
        </div>

        {/* Minimal Audio Guide Controller (Cool slate palette) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="my-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 relative overflow-hidden"
        >
          {/* Top progress line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-100">
            <motion.div 
              className="h-full bg-slate-600 transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Left: Audio icon controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              title={isPlaying ? 'Pause' : 'Play Audio'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current stroke-[2]" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current stroke-[2] ml-0.5" />
              )}
            </button>

            <button
              onClick={replayAudio}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              title="Replay"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2]" />
            </button>

            <div className="flex items-center gap-1.5 text-slate-700 pl-1">
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-sky-600 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-[11px] font-semibold tracking-tight">Audio Guide</span>
            </div>
          </div>

          {/* Right: Waveform animation or timer indicator */}
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <div className="flex items-center gap-0.5 h-3.5">
                {[35, 75, 45, 85, 40, 70, 35].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{ height: ['25%', `${h}%`, '30%'] }}
                    transition={{ repeat: Infinity, duration: 0.55, delay: i * 0.08 }}
                    className="w-1 bg-slate-500 rounded-full"
                  />
                ))}
              </div>
            ) : null}
            <span className="text-[10px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {Math.floor(currentTime)}s / 15s
            </span>
          </div>
        </motion.div>

        {/* 4 Cards with Synchronized Popup Highlights */}
        <div className="space-y-1.5 my-1">
          {steps.map((item, index) => {
            const isHighlighted = activeStepIndex === index;

            return (
              <React.Fragment key={item.title}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ 
                    opacity: 1, 
                    y: isHighlighted ? -2 : 0,
                    scale: isHighlighted ? 1.02 : 1,
                  }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                    mass: 0.7
                  }}
                  className={`group relative ${item.cardBg} rounded-2xl p-2.5 sm:p-3 border transition-all duration-200 ${
                    isHighlighted
                      ? `${item.activeBorder} z-20`
                      : `${item.accentBorder} shadow-2xs hover:shadow-xs z-10`
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* App Icon Container */}
                    <div className="shrink-0 mt-0.5">
                      {item.icon}
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors ${
                            isHighlighted ? 'text-slate-950 font-extrabold' : item.titleColor
                          }`}>
                            {item.title}
                          </span>
                          <span className={`text-[9px] font-medium px-1.5 py-0.2 rounded border uppercase tracking-wider transition-colors ${
                            isHighlighted ? item.activeBadgeBg : item.badgeBg
                          }`}>
                            {item.tabName}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono font-semibold ${
                          isHighlighted ? 'text-slate-700' : item.numberColor
                        }`}>
                          {item.stepNumber}
                        </span>
                      </div>

                      <p className="text-[11px] sm:text-xs font-semibold text-slate-800 mt-0.5 leading-tight">
                        {item.subtitle}
                      </p>

                      <p className="text-[10.5px] text-slate-500 mt-0.5 leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Connecting arrow */}
                {index < steps.length - 1 && (
                  <div className="flex items-center justify-center py-0">
                    <div className="flex items-center gap-1 text-slate-400">
                      <div className="w-2.5 h-px bg-slate-200" />
                      <div className={`w-3.5 h-3.5 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs transition-colors ${
                        activeStepIndex === index ? 'text-slate-700 border-slate-400' : 'text-slate-400'
                      }`}>
                        <ArrowDown className="w-2 h-2 stroke-[2]" />
                      </div>
                      <div className="w-2.5 h-px bg-slate-200" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom Action CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="pt-1.5 pb-0.5"
        >
          <button
            onClick={handleDismiss}
            className="w-full py-2.5 sm:py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <span>Start Learning Now</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
          <p className="text-center text-[9.5px] text-slate-400 mt-1 font-medium">
            Open this guide anytime via the character icon on Home
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
