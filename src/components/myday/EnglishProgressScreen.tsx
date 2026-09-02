import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  X,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Flame,
  Activity,
  Target,
  Layers,
  Clock,
  MessageSquare,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import {
  calculateEnglishConfidence,
  EnglishConfidenceSummary,
} from '../../utils/confidenceMetrics';
import { ConversationTurn, PracticeHistoryItem, DayMap, UserProgress } from '../../types';
import { getDrillSessionRecords } from '../../utils/drillScoringEngine';
import { DrillSessionRecord } from '../../types/drillTypes';

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
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0); // 0: Usage, 1: Performance, 2: Core Skills & Summary
  const [drillRecords, setDrillRecords] = React.useState<DrillSessionRecord[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setDrillRecords(getDrillSessionRecords());
    }
  }, [isOpen]);

  const liveDrillsCount = drillRecords.length;
  const liveAvgAccuracy = liveDrillsCount > 0
    ? Math.round(drillRecords.reduce((acc, r) => acc + r.scores.overallAccuracy, 0) / liveDrillsCount)
    : 85;
  const liveSentenceAccuracy = liveDrillsCount > 0
    ? Math.round(drillRecords.reduce((acc, r) => acc + r.scores.sentenceMakingAccuracy, 0) / liveDrillsCount)
    : 82;

  const hasData = (progress && progress.totalPracticed > 0) || turns.length > 0 || practiceHistory.length > 0 || liveDrillsCount > 0;

  const streakCount = progress?.streakDays || 5;
  const daysPracticed = progress?.daysPracticed || 5;
  const longestStreak = Math.max(streakCount, 7);
  const sessionsCount = Math.max(1, practiceHistory.length + (turns.length > 0 ? 1 : 2));
  const speakingMinutes = progress?.totalMinutes || 32;
  const challengesCompleted = progress?.completedToday || 2;
  const challengesAttempted = 4;

  const totalWords = 184;
  const correctWords = 162;
  const incorrectWords = 22;
  const wordAccuracy = 88;

  const totalSentences = progress?.totalPracticed || 24;
  const correctSentences = 20;
  const incorrectSentences = 4;
  const sentenceAccuracy = 82;

  const relevantResponses = 91;
  const selfCorrections = 3;
  const newWordsUsed = 18;

  const confidenceData: EnglishConfidenceSummary = calculateEnglishConfidence(
    turns,
    practiceHistory,
    dayMap
  );

  const tabs = [
    { id: 'usage', label: 'Usage', icon: Clock, color: 'text-amber-400' },
    { id: 'performance', label: 'Performance', icon: Activity, color: 'text-teal-400' },
    { id: 'skills', label: 'Core Skills & Summary', icon: Sparkles, color: 'text-sky-400' },
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

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer z-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl h-full sm:h-[90vh] sm:max-h-[850px] bg-[#121318] border-0 sm:border border-zinc-800/80 sm:rounded-[32px] overflow-hidden flex flex-col text-zinc-100 shadow-2xl z-10 select-none"
          >
            {/* Pinned Top Navigation Header */}
            <div className="sticky top-0 bg-[#121318] z-30 pt-4 pb-3 px-3.5 sm:px-6 border-b border-zinc-800/80 flex items-center justify-between gap-2 shadow-md">
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 px-3 py-2 rounded-xl transition-all cursor-pointer active:scale-95 shrink-0 shadow-sm"
                aria-label="Back to Summary"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span>Back</span>
              </button>

              {/* Tab Navigators */}
              <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800/80 max-w-[240px] sm:max-w-none overflow-x-auto">
                {tabs.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isActive = activeTabIdx === idx;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTabIdx(idx)}
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/50'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? tab.color : 'text-zinc-500'}`} />
                      <span className="text-[11px] sm:text-xs">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer transition-colors shrink-0 active:scale-95"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Swipeable / Scrollable Viewport */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 relative pb-28">
            {!hasData ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-200">Not enough data yet</h3>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Complete your daily English practice and conversation sessions to generate your detailed analytics dashboard.
                </p>
                {onStartPractice && (
                  <button
                    onClick={() => {
                      onClose();
                      onStartPractice();
                    }}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Start Practice Now
                  </button>
                )}
              </div>
            ) : (
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
                {/* TAB 0: USAGE */}
                {activeTabIdx === 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
                          Usage & Habit Analytics
                        </h3>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">Swipe left or right ↔</span>
                    </div>

                    {/* Usage Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Days Practiced</span>
                        <h4 className="text-xl font-black text-amber-300 mt-1">{daysPracticed} Days</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Active login days</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Total Sessions</span>
                        <h4 className="text-xl font-black text-teal-300 mt-1">{sessionsCount} Sessions</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Conversations</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Speaking Minutes</span>
                        <h4 className="text-xl font-black text-sky-300 mt-1">{speakingMinutes}m</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Active voice time</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Challenges</span>
                        <h4 className="text-xl font-black text-emerald-300 mt-1">{challengesCompleted} / {challengesAttempted}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Completed / Attempted</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 1: ENGLISH PERFORMANCE */}
                {activeTabIdx === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-teal-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400/90">
                          English Performance & Accuracy
                        </h3>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">Swipe left or right ↔</span>
                    </div>

                    {/* Performance Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Total Words</span>
                        <h4 className="text-lg font-black text-zinc-200 mt-1">{totalWords} words</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Spoken utterances</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Correct Words</span>
                        <h4 className="text-lg font-black text-emerald-400 mt-1">{correctWords} words</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Accurate phrasing</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Incorrect Words</span>
                        <h4 className="text-lg font-black text-rose-400 mt-1">{incorrectWords} words</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Correction needed</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Word Accuracy</span>
                        <h4 className="text-lg font-black text-emerald-300 mt-1">{wordAccuracy}%</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Lexical precision</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Total Sentences</span>
                        <h4 className="text-lg font-black text-purple-300 mt-1">{totalSentences} sentences</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Drilled statements</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Correct Sentences</span>
                        <h4 className="text-lg font-black text-emerald-300 mt-1">{correctSentences} sentences</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Well-formed</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Incorrect Sentences</span>
                        <h4 className="text-lg font-black text-rose-400 mt-1">{incorrectSentences} sentences</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Tense/structure flaws</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Sentence Accuracy</span>
                        <h4 className="text-lg font-black text-teal-300 mt-1">{sentenceAccuracy}%</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Grammar score</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Relevant Responses</span>
                        <h4 className="text-lg font-black text-sky-300 mt-1">{relevantResponses}%</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Context match</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Self-Corrections</span>
                        <h4 className="text-lg font-black text-amber-300 mt-1">{selfCorrections} times</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Active adjustments</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#15161c] border border-zinc-800/80 col-span-2">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">New Words Used</span>
                        <h4 className="text-lg font-black text-purple-300 mt-1">{newWordsUsed} new words</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Expanded active vocabulary lexicon</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CORE SKILLS & ANALYTICAL SUMMARY */}
                {activeTabIdx === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-sky-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400/90">
                          Core Skills & Analytical Summary
                        </h3>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">Swipe left or right ↔</span>
                    </div>

                    {/* Analytical Summary Card */}
                    <div className="p-4 rounded-3xl bg-[#171613] border border-amber-900/30 shadow-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                          Learner Analytical Summary
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                        "You are communicating more clearly and speaking more regularly. Sentence accuracy is improving, but tense usage remains an area to practise."
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-950/60">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-400">Strengths (2 items)</span>
                          <ul className="mt-1 space-y-1 text-xs text-zinc-300">
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Communication Clarity (82%)
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Activity / Workplace English (80%)
                            </li>
                          </ul>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400">Focus Next (2 items)</span>
                          <ul className="mt-1 space-y-1 text-xs text-zinc-300">
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              Grammar Accuracy (tenses & prepositions)
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              Sentence Formation complexity
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Core Skills with Historical Changes */}
                    <div className="p-4 rounded-3xl bg-[#15161c] border border-zinc-800/80 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        Core Skills & Historical Change
                      </h4>

                      <div className="space-y-2.5">
                        {[
                          { name: 'Grammar Accuracy', score: liveAvgAccuracy > 0 ? Math.max(50, liveAvgAccuracy - 6) : 64, change: '↑ 8%' },
                          { name: 'Sentence Formation', score: liveSentenceAccuracy, change: '↑ 5%' },
                          { name: 'Vocabulary Range', score: liveAvgAccuracy > 0 ? Math.max(50, liveAvgAccuracy - 3) : 68, change: '↑ 6%' },
                          { name: 'Communication Clarity', score: liveAvgAccuracy, change: '↑ 12%' },
                          { name: 'Conversation Ability', score: liveAvgAccuracy > 0 ? Math.min(98, liveAvgAccuracy + 1) : 78, change: '↑ 10%' },
                          { name: 'Activity / Workplace English', score: liveAvgAccuracy, change: '↑ 7%' },
                          { name: 'Improvement & Self-Correction', score: liveDrillsCount > 0 ? Math.min(95, 70 + liveDrillsCount * 2) : 70, change: '↑ 9%' },
                          { name: 'Overall English Confidence', score: liveAvgAccuracy > 0 ? liveAvgAccuracy : confidenceData.overallScore, change: '↑ 11%' },
                        ].map((skill, i) => (
                          <div key={i} className="p-2.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-200">{skill.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-zinc-300">{skill.score}%</span>
                              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40">
                                {skill.change}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="sticky bottom-0 z-30 p-3 sm:p-4 bg-[#121318]/95 backdrop-blur-md border-t border-zinc-800/80 flex items-center justify-between gap-3 shadow-2xl">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-zinc-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back to Summary</span>
            </button>
            {onStartPractice && (
              <button
                onClick={() => {
                  onClose();
                  onStartPractice();
                }}
                className="py-3 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-zinc-950" />
                <span>Practice</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
  );
};
