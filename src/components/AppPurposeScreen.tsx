import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  Footprints, 
  Music,
  ArrowRight,
  X,
  Bot,
  Play,
  Pause,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { DottedWaveBackground } from './DottedWaveBackground';
import { getBestFemaleVoice } from '../utils/audio';

interface AppPurposeScreenProps {
  onContinue: () => void;
  onClose?: () => void;
  onReplaySplash?: () => void;
}

export interface OnboardingAudioSegment {
  id: string;
  stepIndex: number; // -1 for intro/outro, 0: Learn, 1: Practice, 2: Speak, 3: Improve
  text: string;
  subTitleEn: string;
  subTitleHi: string;
}

export const ONBOARDING_AUDIO_SEGMENTS: OnboardingAudioSegment[] = [
  {
    id: 'intro',
    stepIndex: -1,
    text: "Hello! English सीखने के लिए इस ऐप को चार आसान steps में use करें।",
    subTitleEn: "Welcome! Follow these 4 easy steps to master English.",
    subTitleHi: "नमस्ते! English सीखने के लिए इन चार आसान steps को use करें।",
  },
  {
    id: 'learn',
    stepIndex: 0,
    text: "पहला step है Learn. यहाँ Bytes में रोज़मर्रा के words और basic rules समझें।",
    subTitleEn: "Step 1: LEARN - Understand daily words & rules in Bytes.",
    subTitleHi: "Step 1: Learn - Bytes में daily words और rules समझें।",
  },
  {
    id: 'practice',
    stepIndex: 1,
    text: "दूसरा step है Practice. यहाँ Sheeko में AI hints के साथ खुद sentences बनाएं।",
    subTitleEn: "Step 2: PRACTICE - Build sentences with AI hints in Sheeko.",
    subTitleHi: "Step 2: Practice - Sheeko में AI hints से sentences बनाएं।",
  },
  {
    id: 'speak',
    stepIndex: 2,
    text: "तीसरा step है Speak. यहाँ Buddy के साथ real workplace situations में खुलकर बोलें।",
    subTitleEn: "Step 3: SPEAK - Real workplace & daily talks with Buddy.",
    subTitleHi: "Step 3: Speak - Buddy के साथ workplace situations में बोलें।",
  },
  {
    id: 'improve',
    stepIndex: 3,
    text: "चौथा step है Improve. यहाँ Rock and Roll roleplay खेलें और अपनी English को और बेहतर बनाएं।",
    subTitleEn: "Step 4: IMPROVE - Fast roleplay in Rock & Roll and track growth.",
    subTitleHi: "Step 4: Improve - Rock & Roll roleplay से English बेहतर बनाएं।",
  },
  {
    id: 'outro',
    stepIndex: -1,
    text: "बस रोज़ थोड़ा practice करें और confident English बोलें!",
    subTitleEn: "Practice a little every day and speak with confidence!",
    subTitleHi: "बस रोज़ थोड़ा practice करें और confident English बोलें!",
  },
];

export const AppPurposeScreen: React.FC<AppPurposeScreenProps> = ({ onContinue, onClose, onReplaySplash }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(-1);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const stepTimeoutRef = useRef<number | null>(null);
  const heartbeatTimerRef = useRef<number | null>(null);

  const handleDismiss = () => {
    stopAudio();
    if (onClose) onClose();
    else onContinue();
  };

  const getBestVoice = useCallback(() => {
    return getBestFemaleVoice('hi-IN');
  }, []);

  const playSegment = useCallback((index: number) => {
    if (index >= ONBOARDING_AUDIO_SEGMENTS.length) {
      // Finished all segments completely!
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsFinished(true);
      setCurrentSegmentIndex(-1);
      setActiveStepIndex(-1);
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    // Cancel any ongoing utterance before queuing current
    window.speechSynthesis.cancel();

    const segment = ONBOARDING_AUDIO_SEGMENTS[index];
    setCurrentSegmentIndex(index);
    setActiveStepIndex(segment.stepIndex);
    setIsFinished(false);

    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.93; // Clear, comfortable instructional cadence
    utterance.pitch = 1.08; // Warm, natural feminine pitch (no male timbre)

    const voice = getBestVoice();
    if (voice) utterance.voice = voice;

    // Keep persistent ref to prevent Chrome garbage-collection bug
    utteranceRef.current = utterance;

    utterance.onend = () => {
      // Natural 250ms breath between steps
      stepTimeoutRef.current = window.setTimeout(() => {
        if (isPlayingRef.current) {
          playSegment(index + 1);
        }
      }, 250);
    };

    utterance.onerror = (e) => {
      // If manually canceled or paused, ignore
      if (e.error === 'interrupted' || e.error === 'canceled') {
        return;
      }
      // On genuine voice error, continue smoothly to next segment
      stepTimeoutRef.current = window.setTimeout(() => {
        if (isPlayingRef.current) {
          playSegment(index + 1);
        }
      }, 250);
    };

    window.speechSynthesis.speak(utterance);
  }, [getBestVoice]);

  const startAudio = useCallback((fromIndex = 0) => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsFinished(false);
    playSegment(fromIndex);
  }, [playSegment]);

  const pauseAudio = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const stopAudio = useCallback(() => {
    pauseAudio();
    setCurrentSegmentIndex(-1);
    setActiveStepIndex(-1);
    setIsFinished(false);
  }, [pauseAudio]);

  const replayAudio = useCallback(() => {
    stopAudio();
    setTimeout(() => {
      startAudio(0);
    }, 60);
  }, [stopAudio, startAudio]);

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      if (isFinished || currentSegmentIndex === -1) {
        replayAudio();
      } else {
        // Resume from current segment
        startAudio(currentSegmentIndex);
      }
    }
  };

  const handleStepClick = (stepIdx: number) => {
    // Find the segment for this step
    const segIdx = ONBOARDING_AUDIO_SEGMENTS.findIndex(s => s.stepIndex === stepIdx);
    if (segIdx !== -1) {
      startAudio(segIdx);
    }
  };

  // Preload speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      };
    }
  }, []);

  // Heartbeat to prevent Chrome's 15s SpeechSynthesis cutoff bug
  useEffect(() => {
    if (isPlaying) {
      heartbeatTimerRef.current = window.setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    } else {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
    }
    return () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
    };
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
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
      iconColor: 'text-sky-300',
      activeIconColor: 'text-slate-950',
      activeRing: 'ring-4 ring-sky-400 shadow-[0_0_35px_rgba(56,189,248,0.9)]',
      iconBoxBg: 'bg-sky-500/25 backdrop-blur-md border border-sky-400/40 text-sky-200 shadow-md shadow-sky-500/20',
      activeIconBoxBg: 'bg-gradient-to-br from-sky-300 via-sky-400 to-indigo-500 border-2 border-white text-slate-950 shadow-xl',
      titleColor: 'text-sky-300',
      tabBadge: 'bg-sky-500/20 text-sky-200 border-sky-400/50',
      activeTabBadge: 'bg-sky-300 text-slate-950 font-extrabold border-white',
      glowBg: 'rgba(56,189,248,0.45)',
    },
    {
      stepNumber: '02',
      title: 'PRACTICE',
      subtitle: 'Build sentences with AI hints',
      tabName: 'Sheeko',
      Icon: Sparkles,
      color: 'amber',
      iconColor: 'text-amber-300',
      activeIconColor: 'text-slate-950',
      activeRing: 'ring-4 ring-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.9)]',
      iconBoxBg: 'bg-amber-500/25 backdrop-blur-md border border-amber-400/40 text-amber-200 shadow-md shadow-amber-500/20',
      activeIconBoxBg: 'bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 border-2 border-white text-slate-950 shadow-xl',
      titleColor: 'text-amber-300',
      tabBadge: 'bg-amber-500/20 text-amber-200 border-amber-400/50',
      activeTabBadge: 'bg-amber-300 text-slate-950 font-extrabold border-white',
      glowBg: 'rgba(245,158,11,0.45)',
    },
    {
      stepNumber: '03',
      title: 'SPEAK',
      subtitle: 'Real workplace & daily talks',
      tabName: 'Buddy',
      Icon: Footprints,
      color: 'teal',
      iconColor: 'text-emerald-300',
      activeIconColor: 'text-slate-950',
      activeRing: 'ring-4 ring-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.9)]',
      iconBoxBg: 'bg-emerald-500/25 backdrop-blur-md border border-emerald-400/40 text-emerald-200 shadow-md shadow-emerald-500/20',
      activeIconBoxBg: 'bg-gradient-to-br from-emerald-300 via-teal-400 to-cyan-500 border-2 border-white text-slate-950 shadow-xl',
      titleColor: 'text-emerald-300',
      tabBadge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/50',
      activeTabBadge: 'bg-emerald-300 text-slate-950 font-extrabold border-white',
      glowBg: 'rgba(16,185,129,0.45)',
    },
    {
      stepNumber: '04',
      title: 'IMPROVE',
      subtitle: 'Fast roleplay & track growth',
      tabName: 'Rock & Roll',
      Icon: Music,
      color: 'purple',
      iconColor: 'text-purple-300',
      activeIconColor: 'text-slate-950',
      activeRing: 'ring-4 ring-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.9)]',
      iconBoxBg: 'bg-purple-500/25 backdrop-blur-md border border-purple-400/40 text-purple-200 shadow-md shadow-purple-500/20',
      activeIconBoxBg: 'bg-gradient-to-br from-purple-300 via-fuchsia-400 to-indigo-500 border-2 border-white text-slate-950 shadow-xl',
      titleColor: 'text-purple-300',
      tabBadge: 'bg-purple-500/20 text-purple-200 border-purple-400/50',
      activeTabBadge: 'bg-purple-300 text-slate-950 font-extrabold border-white',
      glowBg: 'rgba(168,85,247,0.45)',
    },
  ];

  const progressPercent = isFinished
    ? 100
    : currentSegmentIndex >= 0
    ? Math.round(((currentSegmentIndex + 1) / ONBOARDING_AUDIO_SEGMENTS.length) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-[#060a14] text-slate-100 flex flex-col items-center justify-between px-4 py-3 sm:py-5 overflow-y-auto select-none font-sans"
    >
      {/* High-Pixel Dotted Gradient Wave Background */}
      <DottedWaveBackground intensity={1.15} />

      <div className="w-full max-w-[430px] mx-auto flex-1 flex flex-col justify-between relative z-10 my-auto">
        {/* Top Header section */}
        <div className="relative pt-0.5 pb-2 text-center">
          {/* Close / Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute right-0 top-0 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/20 flex items-center justify-center text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 z-20 backdrop-blur-md"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-sky-400/40 text-[10px] font-semibold uppercase tracking-widest text-sky-300 mb-1.5 shadow-sm backdrop-blur-md"
          >
            <Bot className="w-3 h-3 text-sky-300" />
            <span>Learning Roadmap</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-xl sm:text-2xl font-bold text-white tracking-wider uppercase drop-shadow-md"
            style={{ fontFamily: "'Syncopate', sans-serif" }}
          >
            HELLO ENGLISH
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xs mx-auto font-medium drop-shadow-sm"
          >
            4 daily steps to build fluent spoken English
          </motion.p>
        </div>

        {/* 4 Steps Flow with Big Distributed Pop-out Icons in Frosted Glass Container */}
        <div className="relative flex-1 flex flex-col justify-around py-4 sm:py-5 px-3 sm:px-4 my-1.5 min-h-[340px] rounded-3xl bg-slate-900/45 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Continuous Dropping Line / Connector Track */}
          <div className="absolute left-[39px] sm:left-[43px] top-9 bottom-9 w-0.5 bg-white/20 -z-0">
            {/* Animated glowing drop beam */}
            <motion.div 
              className="w-full bg-gradient-to-b from-sky-400 via-amber-400 to-purple-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
              animate={{ 
                height: isPlaying ? ['0%', '100%'] : '100%',
                opacity: isPlaying ? [0.6, 1, 0.6] : 0.8
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
                <div 
                  key={item.title} 
                  onClick={() => handleStepClick(index)}
                  className="relative flex items-center gap-4 group cursor-pointer"
                  title={`Tap to listen to ${item.title} guide`}
                >
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
                      className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
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
                          : 'bg-slate-800 text-slate-200 border-white/20'
                      }`}>
                        {item.stepNumber}
                      </span>
                    </motion.div>
                  </div>

                  {/* Text Alongside Big Icon */}
                  <motion.div 
                    animate={{
                      x: isHighlighted ? 4 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <h2 className={`text-sm sm:text-base font-extrabold tracking-wide uppercase transition-colors ${
                        isHighlighted ? 'text-white drop-shadow-sm' : item.titleColor
                      }`}>
                        {item.title}
                      </h2>

                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md border tracking-wider uppercase transition-colors ${
                        isHighlighted ? item.activeTabBadge : item.tabBadge
                      }`}>
                        {item.tabName}
                      </span>

                      {isHighlighted && isPlaying && (
                        <span className="flex items-center gap-0.5 ml-auto">
                          <span className="w-1 h-2.5 bg-sky-400 rounded-full animate-pulse" />
                          <span className="w-1 h-3.5 bg-sky-300 rounded-full animate-pulse delay-75" />
                          <span className="w-1 h-2 bg-sky-400 rounded-full animate-pulse delay-150" />
                        </span>
                      )}
                    </div>

                    <p className={`text-xs mt-0.5 font-medium leading-snug transition-colors ${
                      isHighlighted ? 'text-white font-semibold drop-shadow-xs' : 'text-slate-200'
                    }`}>
                      {item.subtitle}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Audio Subtitle Pill */}
        <div className="min-h-[44px] flex items-center justify-center my-1">
          <AnimatePresence mode="wait">
            {isPlaying && currentSegmentIndex >= 0 && (
              <motion.div
                key={`subtitle-${currentSegmentIndex}`}
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-sky-400/40 backdrop-blur-md shadow-lg flex items-center gap-2.5"
              >
                <div className="shrink-0 w-6 h-6 rounded-full bg-sky-400/20 border border-sky-400/40 flex items-center justify-center">
                  <Volume2 className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white truncate">
                    {ONBOARDING_AUDIO_SEGMENTS[currentSegmentIndex]?.text}
                  </p>
                  <p className="text-[9.5px] text-sky-300/80 truncate">
                    {ONBOARDING_AUDIO_SEGMENTS[currentSegmentIndex]?.subTitleEn}
                  </p>
                </div>
              </motion.div>
            )}
            {!isPlaying && isFinished && (
              <motion.div
                key="finished-pill"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-emerald-300/90 font-medium flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-emerald-300" />
                <span>Voice roadmap completed! Tap Replay or Start Learning below.</span>
              </motion.div>
            )}
            {!isPlaying && !isFinished && currentSegmentIndex === -1 && (
              <motion.div
                key="ready-pill"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5"
              >
                <Volume2 className="w-3 h-3 text-sky-400" />
                <span>Tap any step or the Voice Guide button to listen.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Action CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="pt-1 pb-0.5"
        >
          <button
            onClick={handleDismiss}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 hover:from-sky-300 hover:to-purple-400 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 cursor-pointer active:scale-[0.98]"
          >
            <span>Start Learning Now</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div className="flex items-center justify-center gap-2 text-center text-[10px] text-slate-300 mt-1.5 font-medium">
            <span>Open anytime via Guide on Home</span>
            {onReplaySplash && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    stopAudio();
                    onReplaySplash();
                  }}
                  className="text-sky-300 hover:text-sky-200 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                >
                  View Splash Screen
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Floating Audio Guide Play/Pause/Replay Pill at Right Bottom */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlayPause}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 px-3.5 h-11 sm:h-12 rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-xl border ${
          isPlaying 
            ? 'bg-sky-400 text-slate-950 border-white ring-4 ring-sky-400/40 shadow-[0_0_25px_rgba(56,189,248,0.7)]' 
            : isFinished
            ? 'bg-indigo-600 text-white hover:bg-indigo-500 border-indigo-300 shadow-indigo-500/40'
            : 'bg-slate-800/90 text-slate-100 hover:text-white border-white/20 hover:border-white/40 backdrop-blur-md shadow-lg'
        }`}
        title={isPlaying ? 'Pause Voice Guide' : isFinished ? 'Replay Voice Guide' : 'Play Voice Guide'}
        aria-label={isPlaying ? 'Pause Voice Guide' : isFinished ? 'Replay Voice Guide' : 'Play Voice Guide'}
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4 fill-current stroke-[2]" />
            <span className="text-xs font-bold uppercase tracking-wider">Pause</span>
          </>
        ) : isFinished ? (
          <>
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span className="text-xs font-bold uppercase tracking-wider">Replay</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current stroke-[2] ml-0.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Voice Guide</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
};
