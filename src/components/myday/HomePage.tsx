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
  Languages,
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
  language?: 'en' | 'hi';
  onToggleLanguage?: () => void;
}

const SlideToStartBar: React.FC<{ onUnlock: () => void; language?: 'en' | 'hi' }> = ({ onUnlock, language = 'en' }) => {
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
      className="w-full max-w-sm mx-auto h-20 rounded-full bg-gradient-to-r from-[#1c1d24] via-[#15161b] to-[#0e0f12] border border-zinc-700/80 p-2 relative overflow-hidden flex items-center select-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer group"
      onClick={() => {
        if (!isUnlocked) {
          setIsUnlocked(true);
          onUnlock();
        }
      }}
    >
      {/* Background track text */}
      <div className="absolute inset-0 flex items-center justify-center pl-8 pointer-events-none">
        <span className="text-sm font-black tracking-widest text-zinc-400 uppercase drop-shadow-sm">
          {language === 'hi' ? 'स्लाइड करके शुरू करें' : 'slide to start'}
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
  language = 'en',
  onToggleLanguage,
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
      {/* Top Header with Language Selection Button */}
      <div className="w-full flex items-center justify-end z-20 py-1">
        {onToggleLanguage && (
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95 text-xs font-semibold"
            title="Toggle Language / भाषा बदलें"
            aria-label="Toggle Language"
          >
            <Languages className="w-4 h-4 text-amber-400" />
            <span>{language === 'hi' ? 'हिंदी (EN)' : 'English (हिन्दी)'}</span>
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
            <SlideToStartBar onUnlock={onOpenChallenge} language={language} />
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
