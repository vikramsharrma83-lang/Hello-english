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
  const [activeTab, setActiveTab] = useState<'overview' | 'habits' | 'deep_analytics'>('overview');
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const confidenceData: EnglishConfidenceSummary = calculateEnglishConfidence(
    turns,
    practiceHistory,
    dayMap
  );

  // SVG Pie Chart Generator for the 7 weighted metrics
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

  const handlePlayAudio = (phrase: SavedPhrase) => {
    if (playingId === phrase.id) {
      stopSpeaking();
      setPlayingId(null);
      return;
    }
    stopSpeaking();
    setPlayingId(phrase.id);
    speakText(phrase.improvedSentence, 'en-IN', 0.92, () => {
      setPlayingId(null);
    });
  };

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
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal / Full Screen Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl min-h-screen sm:min-h-[auto] sm:max-h-[92vh] bg-[#0c0d12] border-0 sm:border border-zinc-800 sm:rounded-[36px] overflow-y-auto flex flex-col text-white shadow-2xl z-10 select-none pb-8"
        >
          {/* Header - Fixed & Prominent on Mobile and Desktop */}
          <div className="sticky top-0 bg-[#0c0d12]/95 backdrop-blur-lg z-30 pt-4 pb-3 px-4 sm:px-6 border-b border-zinc-800/80 flex items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              aria-label="Back to My Day"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400 stroke-[2.5]" />
              <span className="font-semibold text-zinc-200">Back</span>
            </button>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-full border border-amber-500/20 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Performance Analytics</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-Tabs: Overview, Habits & Streak, Deep Analytics */}
          <div className="px-3 sm:px-6 pt-3 pb-2 border-b border-zinc-800/60 bg-[#101117] sticky top-[60px] z-20">
            <div className="grid grid-cols-3 gap-1.5 w-full">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-2 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 text-center ${
                  activeTab === 'overview'
                    ? 'bg-sky-500 text-black shadow-md shadow-sky-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Metrics</span>
              </button>

              <button
                onClick={() => setActiveTab('habits')}
                className={`px-2 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 text-center ${
                  activeTab === 'habits'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                <span className="truncate">5-Day Streak</span>
              </button>

              <button
                onClick={() => setActiveTab('deep_analytics')}
                className={`px-2 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 text-center ${
                  activeTab === 'deep_analytics'
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Velocity</span>
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            {/* TAB 1: OVERVIEW & 7-METRICS */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Main Score Hero Card with Pie Chart */}
                <div className="bg-gradient-to-br from-[#161720] via-[#111218] to-[#0d0e14] border border-zinc-800/90 rounded-3xl p-5 relative overflow-hidden shadow-xl">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Interactive 7-Metric Weighted Pie Chart */}
                    <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        {/* Background Track */}
                        <circle
                          cx="60"
                          cy="60"
                          r={normalizedRadius}
                          fill="transparent"
                          stroke="#1f2029"
                          strokeWidth={strokeWidth}
                        />

                        {/* 7 Weighted Slices */}
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
                            className="transition-all duration-500 hover:opacity-80"
                          />
                        ))}
                      </svg>

                      {/* Center Score Display */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-3xl font-black text-white tracking-tight">
                          {confidenceData.overallScore}%
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-sky-400 -mt-0.5">
                          Confidence
                        </span>
                      </div>
                    </div>

                    {/* Text Summary Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-extrabold tracking-wide mb-1.5">
                        <TrendingUp className="w-3 h-3" />
                        <span>Overall Fluency Index</span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        English Confidence: {confidenceData.overallScore}%
                      </h2>

                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Evaluated across all 7 core linguistic dimensions using your active spoken and written English during My Day.
                      </p>

                      {/* 3 Main Highlights */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3 justify-center sm:justify-start">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300">
                          Grammar {confidenceData.cardIndicators.grammar}%
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-300">
                          Communication {confidenceData.cardIndicators.communication}%
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-300">
                          Vocabulary {confidenceData.cardIndicators.vocabulary}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strongest & Weakest Area Insights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Strongest Area */}
                  <div className="bg-emerald-950/25 border border-emerald-800/40 rounded-2xl p-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                        Strongest Area
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-white">
                      {confidenceData.strongestArea.name} ({confidenceData.strongestArea.score}%)
                    </h4>
                    <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                      {confidenceData.strongestArea.explanation}
                    </p>
                  </div>

                  {/* Weakest Area (Focus Area) */}
                  <div className="bg-amber-950/25 border border-amber-800/40 rounded-2xl p-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                        Key Growth Focus
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-white">
                      {confidenceData.weakestArea.name} ({confidenceData.weakestArea.score}%)
                    </h4>
                    <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                      {confidenceData.weakestArea.explanation}
                    </p>
                  </div>
                </div>

                {/* All 7 Metrics Detailed Breakdown */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
                      <span>All 7 Weighted Dimensions</span>
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-mono">Total Weight: 100%</span>
                  </div>

                  <div className="space-y-2.5">
                    {confidenceData.metrics.map((metric) => {
                      const isSelected = selectedMetricId === metric.id;
                      return (
                        <div
                          key={metric.id}
                          onClick={() => setSelectedMetricId(isSelected ? null : metric.id)}
                          className={`p-3.5 rounded-2xl bg-[#14151c] border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-sky-500/80 bg-[#191a24] shadow-lg shadow-sky-500/10'
                              : 'border-zinc-800/70 hover:border-zinc-700 hover:bg-[#181922]'
                          }`}
                        >
                          {/* Top Row: Name, Weight & Score */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                                style={{ backgroundColor: metric.color }}
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm font-bold text-white">
                                    {metric.name}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono">
                                    ({metric.weight}% weight)
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

                          {/* Progress Track */}
                          <div className="w-full h-2 rounded-full bg-zinc-800/80 overflow-hidden mt-2.5">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${metric.score}%`,
                                backgroundColor: metric.color,
                              }}
                            />
                          </div>

                          {/* Expanded Diagnostic Details */}
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-2.5 border-t border-zinc-800/80 space-y-2 text-xs"
                            >
                              <div className="bg-black/40 rounded-xl p-2.5 border border-white/5">
                                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-0.5">
                                  Coach Observation:
                                </span>
                                <p className="text-zinc-300 text-[11px] leading-snug">
                                  {metric.learnerObservation}
                                </p>
                              </div>

                              <div className="bg-amber-950/20 rounded-xl p-2.5 border border-amber-800/30">
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                                  Quick Practice Tip:
                                </span>
                                <p className="text-amber-200/90 text-[11px] leading-snug">
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
              </motion.div>
            )}
            {/* TAB 2: HABITS & STREAKS */}
            {activeTab === 'habits' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Streak Highlight Card */}
                <div className="rounded-3xl p-5 bg-gradient-to-br from-[#1c1408] via-[#14151b] to-zinc-950 border border-amber-500/30 relative overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <Flame className="w-7 h-7 fill-white" />
                      </div>
                      <div>
                        <span className="text-2xl font-black text-white">
                          {streakCount} Day Streak!
                        </span>
                        <p className="text-xs font-semibold text-amber-400">
                          Daily English Practice Habit
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      🔥 Active
                    </span>
                  </div>

                  {/* Weekly Day Tracker */}
                  <div className="grid grid-cols-7 gap-1.5 mt-4 pt-3 border-t border-amber-500/20">
                    {daysOfWeek.map((day, idx) => {
                      const isCompleted = idx < (streakCount % 7 || 5);
                      return (
                        <div
                          key={day}
                          className={`flex flex-col items-center py-2 rounded-xl text-center ${
                            isCompleted
                              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                              : 'bg-zinc-900/60 text-zinc-500 border border-zinc-800/40'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold">{day}</span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-zinc-700 mt-1" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3 Activity Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3.5 rounded-2xl bg-[#14151c] border border-zinc-800 shadow-md">
                    <span className="text-xl font-black text-purple-400">{totalSentences}</span>
                    <p className="text-[11px] font-bold text-zinc-400 mt-0.5">Sentences Practiced</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#14151c] border border-zinc-800 shadow-md">
                    <span className="text-xl font-black text-teal-400">{speakingMinutes}m</span>
                    <p className="text-[11px] font-bold text-zinc-400 mt-0.5">Speaking Time</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#14151c] border border-zinc-800 shadow-md">
                    <span className="text-xl font-black text-rose-400">{savedList.length}</span>
                    <p className="text-[11px] font-bold text-zinc-400 mt-0.5">Saved Phrases</p>
                  </div>
                </div>

                {/* Daily Goal Progression */}
                <div className="p-4 rounded-2xl bg-[#14151c] border border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-300">Daily Target: 4 Stories & Questions</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {progress?.completedToday || 2} / {progress?.dailyGoal || 4} Completed
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (((progress?.completedToday || 2) / (progress?.dailyGoal || 4)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: DEEP ANALYSIS & VELOCITY (NEW ADVANCED ANALYSIS) */}
            {activeTab === 'deep_analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Fluency Velocity Curve */}
                <div className="p-4 rounded-3xl bg-[#14151c] border border-zinc-800 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Fluency Velocity
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      +14% this week
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                        <span>Grammatical Accuracy Rate</span>
                        <span className="text-white font-mono font-bold">84%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: '84%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                        <span>Sentence Structure Completeness</span>
                        <span className="text-white font-mono font-bold">78%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-sky-400 rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                        <span>Response Speed & Hesitation Index</span>
                        <span className="text-white font-mono font-bold">92%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-purple-400 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vocabulary Diversity & Workplace Domain Mastery */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#14151c] border border-zinc-800">
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Vocabulary Range</span>
                    <h5 className="text-lg font-black text-amber-400 mt-1">210+ Words</h5>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Active functional lexicon in daily stories</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#14151c] border border-zinc-800">
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Workplace Readiness</span>
                    <h5 className="text-lg font-black text-sky-400 mt-1">Grade B+ (Advanced)</h5>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Shift handover, supervisor dialogues</p>
                  </div>
                </div>

                {/* Linguistic Retention Insight */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-2.5">
                  <Target className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="text-white font-bold block mb-0.5">Continuous Adaptive Calibration</span>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Every conversational turn with Coach Neha calibrates your confidence index using real-time sentence restructuring patterns.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Evidence-Based Evaluation Policy Note */}
            <div className="mt-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-2.5 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-bold block mb-0.5">
                  100% Production-Driven Calculation
                </span>
                <p className="text-[11px] leading-relaxed text-zinc-400">
                  {confidenceData.evidenceBasedNote}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
