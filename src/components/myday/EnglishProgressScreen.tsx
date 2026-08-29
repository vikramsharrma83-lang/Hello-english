import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  X,
  Sparkles,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Flame,
  Zap,
  Info,
  ShieldCheck,
  BookOpen,
  Volume2,
  Clock,
  MessageSquare,
  Compass,
  ArrowRight,
  Activity,
  Target,
  Layers,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import {
  calculateEnglishConfidence,
  EnglishConfidenceSummary,
  ConfidenceMetric,
} from '../../utils/confidenceMetrics';
import { ConversationTurn, PracticeHistoryItem, DayMap, UserProgress, SavedPhrase } from '../../types';
import { speakText, stopSpeaking } from '../../utils/audio';

interface EnglishProgressScreenProps {
  isOpen: boolean;
  onClose: () => void;
  turns?: ConversationTurn[];
  practiceHistory?: PracticeHistoryItem[];
  dayMap?: DayMap;
  progress?: UserProgress;
  onStartPractice?: () => void;
}

export const EnglishProgressScreen: React.FC<EnglishProgressScreenProps> = ({
  isOpen,
  onClose,
  turns = [],
  practiceHistory = [],
  dayMap,
  progress,
  onStartPractice,
}) => {
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0); // 0: Habits/Streak, 1: Velocity, 2: Metrics
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const tabs = [
    { id: 'habits', label: '5-Day Streak', icon: Flame, color: 'text-amber-400' },
    { id: 'velocity', label: 'Velocity', icon: TrendingUp, color: 'text-teal-400' },
    { id: 'metrics', label: 'Confidence', icon: Activity, color: 'text-sky-400' },
  ];

  const handleDragEnd = (e: any, info: { offset: { x: number } }) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      if (activeTabIdx < tabs.length - 1) {
        setActiveTabIdx((prev) => prev + 1);
      }
    } else if (info.offset.x > swipeThreshold) {
      if (activeTabIdx > 0) {
        setActiveTabIdx((prev) => prev - 1);
      }
    }
  };

  const confidenceData: EnglishConfidenceSummary = calculateEnglishConfidence(
    turns,
    practiceHistory,
    dayMap
  );

  const radius = 54;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  let cumulativeWeight = 0;
  const pieSlices = confidenceData.metrics.map((metric) => {
    const startAngle = (cumulativeWeight / 100) * 360;
    const sliceAngle = (metric.weight / 100) * 360;
    cumulativeWeight += metric.weight;

    const strokeDasharray = `${(metric.weight / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((startAngle / 360) * circumference);

    return {
      ...metric,
      startAngle,
      sliceAngle,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const streakCount = progress?.streakDays || 5;
  const totalSentences = progress?.totalPracticed || 24;
  const speakingMinutes = progress?.totalMinutes || 32;
  const savedList = progress?.savedPhrases || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl min-h-screen sm:min-h-[auto] sm:max-h-[90vh] bg-[#121318] border-0 sm:border border-zinc-800/80 sm:rounded-[32px] overflow-hidden flex flex-col text-zinc-100 shadow-2xl z-10 select-none"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#121318]/95 backdrop-blur-md z-30 pt-4 pb-3 px-4 sm:px-6 border-b border-zinc-800/60 flex items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-medium text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 px-3 py-2 rounded-xl transition-all cursor-pointer active:scale-95 shrink-0"
              aria-label="Back to My Day"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-400" />
              <span>Back</span>
            </button>

            {/* Tab Navigators */}
            <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800/80">
              {tabs.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeTabIdx === idx;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabIdx(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/50'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? tab.color : 'text-zinc-500'}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Swipeable Viewport */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 relative">
            <motion.div
              key={activeTabIdx}
              initial={{ opacity: 0, x: activeTabIdx > 0 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTabIdx > 0 ? -20 : 20 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="w-full min-h-[400px] pb-10"
            >
              {/* TAB 0: 5-DAY STREAK & HABITS */}
              {activeTabIdx === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-500/80" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
                        5-Day Streak & Daily Habits
                      </h3>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">Swipe left or right ↔</span>
                  </div>

                  {/* Streak Card - Low Temp Muted Amber */}
                  <div className="rounded-3xl p-5 bg-[#171613] border border-amber-900/30 relative overflow-hidden shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-800/40 text-amber-400 flex items-center justify-center shadow-inner">
                          <Flame className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-2xl font-black text-zinc-100">
                            {streakCount} Day Streak
                          </span>
                          <p className="text-xs text-amber-300/80 font-medium">
                            Consistent Daily English Habit
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-950/50 text-amber-300 border border-amber-800/40">
                        Active Habit
                      </span>
                    </div>

                    {/* Weekly Tracker */}
                    <div className="grid grid-cols-7 gap-1.5 mt-4 pt-3 border-t border-amber-950/60">
                      {daysOfWeek.map((day, idx) => {
                        const isCompleted = idx < (streakCount % 7 || 5);
                        return (
                          <div
                            key={day}
                            className={`flex flex-col items-center py-2 rounded-xl text-center ${
                              isCompleted
                                ? 'bg-amber-950/40 text-amber-200 border border-amber-800/30'
                                : 'bg-zinc-900/40 text-zinc-600 border border-zinc-800/40'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold">{day}</span>
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400/80 mt-1" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border border-zinc-700/60 mt-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activity Grid */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                      <span className="text-lg font-black text-purple-300">{totalSentences}</span>
                      <p className="text-[11px] font-medium text-zinc-400 mt-0.5">Sentences</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                      <span className="text-lg font-black text-teal-300">{speakingMinutes}m</span>
                      <p className="text-[11px] font-medium text-zinc-400 mt-0.5">Speaking</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                      <span className="text-lg font-black text-zinc-300">{savedList.length}</span>
                      <p className="text-[11px] font-medium text-zinc-400 mt-0.5">Phrases</p>
                    </div>
                  </div>

                  {/* Daily Target */}
                  <div className="p-4 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-zinc-300">Daily Target: 4 Stories & Questions</span>
                      <span className="text-xs font-mono font-bold text-amber-300/90">
                        {progress?.completedToday || 2} / {progress?.dailyGoal || 4}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-600/70 transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (((progress?.completedToday || 2) / (progress?.dailyGoal || 4)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: FLUENCY VELOCITY & DEEP ANALYSIS */}
              {activeTabIdx === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-teal-400/80" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400/90">
                        Frequency & Fluency Velocity
                      </h3>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">Swipe left or right ↔</span>
                  </div>

                  {/* Velocity Card - Muted Teal */}
                  <div className="p-4 rounded-3xl bg-[#131718] border border-teal-900/30 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-teal-400" />
                        <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                          Velocity Trend
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-800/40">
                        +14% this week
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Grammatical Accuracy</span>
                          <span className="text-teal-200 font-mono font-bold">84%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                          <div className="h-full bg-teal-600/70 rounded-full" style={{ width: '84%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Sentence Completeness</span>
                          <span className="text-sky-200 font-mono font-bold">78%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                          <div className="h-full bg-sky-600/70 rounded-full" style={{ width: '78%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Response Fluency Speed</span>
                          <span className="text-purple-200 font-mono font-bold">92%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                          <div className="h-full bg-purple-600/70 rounded-full" style={{ width: '92%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Range & Readiness */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                      <span className="text-[10px] uppercase font-bold text-zinc-500">Vocabulary Range</span>
                      <h5 className="text-lg font-black text-amber-300/90 mt-1">210+ Words</h5>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Active functional lexicon</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                      <span className="text-[10px] uppercase font-bold text-zinc-500">Workplace Readiness</span>
                      <h5 className="text-lg font-black text-sky-300/90 mt-1">Grade B+</h5>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Shift handover dialogues</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONFIDENCE & 7-DIMENSION BREAKDOWN */}
              {activeTabIdx === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-sky-400/80" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400/90">
                        English Confidence & 7 Dimensions
                      </h3>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">Swipe left or right ↔</span>
                  </div>

                  {/* Main Score Hero Card */}
                  <div className="bg-[#15161e] border border-zinc-800/90 rounded-3xl p-5 relative overflow-hidden shadow-lg">
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      {/* Interactive Pie Chart */}
                      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r={normalizedRadius}
                            fill="transparent"
                            stroke="#1a1b24"
                            strokeWidth={strokeWidth}
                          />
                          {pieSlices.map((slice) => (
                            <circle
                              key={slice.id}
                              cx="60"
                              cy="60"
                              r={normalizedRadius}
                              fill="transparent"
                              stroke={slice.color}
                              strokeWidth={strokeWidth}
                              strokeDasharray={slice.strokeDasharray}
                              strokeDashoffset={slice.strokeDashoffset}
                              strokeLinecap="round"
                              className="transition-all duration-500 hover:opacity-80 opacity-90"
                            />
                          ))}
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                          <span className="text-3xl font-black text-zinc-100 tracking-tight">
                            {confidenceData.overallScore}%
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-sky-400/80 -mt-0.5">
                            Confidence
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950/60 border border-sky-800/40 text-sky-300 text-[11px] font-semibold mb-1.5">
                          <TrendingUp className="w-3 h-3" />
                          <span>Overall Fluency Index</span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">
                          English Confidence: {confidenceData.overallScore}%
                        </h2>

                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                          Evaluated across 7 core linguistic dimensions using your active spoken & written English.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* All 7 Dimensions List */}
                  <div className="space-y-2.5">
                    {confidenceData.metrics.map((metric) => {
                      const isSelected = selectedMetricId === metric.id;
                      return (
                        <div
                          key={metric.id}
                          onClick={() => setSelectedMetricId(isSelected ? null : metric.id)}
                          className={`p-3.5 rounded-2xl bg-[#14151c] border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-sky-500/60 bg-[#191a24] shadow-md'
                              : 'border-zinc-800/70 hover:border-zinc-700/80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: metric.color }}
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm font-bold text-zinc-200">
                                    {metric.name}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono">
                                    ({metric.weight}%)
                                  </span>
                                </div>
                                <span className="text-[10px] text-zinc-400 block -mt-0.5">
                                  {metric.hindiName}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span
                                className="text-sm sm:text-base font-black"
                                style={{ color: metric.color }}
                              >
                                {metric.score}%
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden mt-2.5">
                            <div
                              className="h-full rounded-full opacity-90"
                              style={{
                                width: `${metric.score}%`,
                                backgroundColor: metric.color,
                              }}
                            />
                          </div>

                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-2.5 border-t border-zinc-800/80 space-y-2 text-xs"
                            >
                              <div className="bg-black/30 rounded-xl p-2.5 border border-white/5">
                                <span className="text-[10px] font-bold text-sky-400/90 uppercase block mb-0.5">
                                  Coach Observation:
                                </span>
                                <p className="text-zinc-300 text-[11px] leading-snug">
                                  {metric.learnerObservation}
                                </p>
                              </div>

                              <div className="bg-amber-950/15 rounded-xl p-2.5 border border-amber-900/20">
                                <span className="text-[10px] font-bold text-amber-400/80 uppercase block mb-0.5">
                                  Quick Practice Tip:
                                </span>
                                <p className="text-amber-200/80 text-[11px] leading-snug">
                                  {metric.actionableTip}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
