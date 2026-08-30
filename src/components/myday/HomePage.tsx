import React, { useState, useEffect, useRef } from 'react';
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
  Mic,
} from 'lucide-react';
import { EnglishProgressScreen } from './EnglishProgressScreen';
import { SheekoCoverflowCarousel } from '../SheekoCoverflowCarousel';
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

const SlideToStartBar: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [dragX, setDragX] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleDrag = (_e: any, info: any) => {
    if (!trackRef.current || isUnlocked) return;
    const trackWidth = trackRef.current.clientWidth - 76; // thumb width ~64px + padding
    const currentX = Math.max(0, Math.min(info.offset.x, trackWidth));
    setDragX(currentX);
    if (currentX >= trackWidth * 0.75) {
      setIsUnlocked(true);
      onUnlock();
    }
  };

  const handleDragEnd = (_e: any, info: any) => {
    if (!trackRef.current || isUnlocked) return;
    const trackWidth = trackRef.current.clientWidth - 76;
    if (info.offset.x >= trackWidth * 0.7) {
      setIsUnlocked(true);
      onUnlock();
    } else {
      setDragX(0);
    }
  };

  return (
    <div
      ref={trackRef}
      className="w-full max-w-sm mx-auto h-20 rounded-full bg-gradient-to-r from-[#e5e7eb] via-[#d1d5db] to-[#9ca3af] border border-zinc-400/60 p-2 relative overflow-hidden flex items-center select-none shadow-[inset_0_4px_8px_rgba(0,0,0,0.25),0_8px_20px_rgba(0,0,0,0.3)] cursor-pointer group"
      onClick={() => {
        if (!isUnlocked) {
          setIsUnlocked(true);
          onUnlock();
        }
      }}
    >
      {/* Background track text */}
      <div className="absolute inset-0 flex items-center justify-center pl-8 pointer-events-none">
        <span className="text-sm font-black tracking-widest text-zinc-600 uppercase drop-shadow-sm">
          slide to start
        </span>
      </div>

      {/* Draggable white thumb with orange chevron */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 230 }}
        dragElastic={0.05}
        dragMomentum={false}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ x: isUnlocked ? 230 : dragX }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className="w-16 h-16 rounded-full bg-white border border-zinc-200 shadow-[0_6px_16px_rgba(0,0,0,0.35)] flex items-center justify-center text-[#f59e0b] relative z-10 cursor-grab active:cursor-grabbing"
      >
        <ChevronRight className="w-8 h-8 stroke-[3]" />
      </motion.div>
    </div>
  );
};

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

  // Pie chart parameters for Watch Progress Card (Thicker and Bigger)
  const radius = 54;
  const strokeWidth = 16;
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
    <div className="w-full flex-1 flex flex-col items-center justify-between px-4 pt-2 pb-28 text-zinc-100 max-w-[440px] mx-auto min-h-screen select-none relative">
      {/* Top Header with Close (X) button */}
      <div className="w-full flex items-center justify-end z-20 py-1">
        {/* Right: Close (X) icon button to exit My Day back to main app */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            title="Exit My Day"
            aria-label="Exit My Day"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        )}
      </div>

      {/* Main Content Area: Carousel above, Course card, and 3-grid compact cards */}
      <div className="w-full flex-1 flex flex-col justify-start max-w-sm mx-auto py-0 gap-1.5">
        {/* Coverflow Carousel with Floating Small Icon Buttons */}
        <div className="w-full">
          <SheekoCoverflowCarousel
            onVoiceStudio={onStart}
            onPerformance={() => setIsProgressOpen(true)}
            onPatterns={onOpenPatternLibrary}
          />
        </div>

        {/* Top / Center: iPhone Slide to Start Bar */}
        <div className="w-full pt-1">
          {onOpenChallenge && (
            <SlideToStartBar onUnlock={onOpenChallenge} />
          )}
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
