import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  BookOpen,
  Mic,
  Calendar,
  Clock,
  Target,
  ChevronRight,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  ListChecks,
} from 'lucide-react';
import { UserProgress, Question, ChallengeDayProgress } from '../types';
import { getOrCreateChallenge, startNewChallenge } from '../utils/challengeManager';

interface ChallengeViewProps {
  progress: UserProgress;
  onBack: () => void;
  onStartMyDay: () => void;
  onStartPracticeQuestion: (question?: Question) => void;
  onUpdateProgress?: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  progress,
  onBack,
  onStartMyDay,
  onStartPracticeQuestion,
  onUpdateProgress,
}) => {
  const challenge = getOrCreateChallenge(progress);
  const isStarted = challenge.isStarted ?? true;

  // Selected day for viewing completed activities modal / detail drawer
  const [selectedDayDetail, setSelectedDayDetail] = useState<ChallengeDayProgress | null>(null);

  const totalActivitiesTarget = challenge.myDayTarget + challenge.coachQuestionsTarget; // 105
  const totalActivitiesDone = challenge.myDayCompletedCount + challenge.coachQuestionsCompletedCount;
  const activitiesPending = Math.max(0, totalActivitiesTarget - totalActivitiesDone);
  const overallPercentage = Math.min(100, Math.round((totalActivitiesDone / totalActivitiesTarget) * 100));

  const myDayPercentage = Math.min(100, Math.round((challenge.myDayCompletedCount / challenge.myDayTarget) * 100));
  const questionsPercentage = Math.min(100, Math.round((challenge.coachQuestionsCompletedCount / challenge.coachQuestionsTarget) * 100));

  const handleStartOrResume = () => {
    if (!isStarted) {
      if (onUpdateProgress) {
        onUpdateProgress((prev) => startNewChallenge(prev));
      }
    }
    // Direct user into practice or my day
    if (challenge.myDayCompletedCount < challenge.currentDay) {
      onStartMyDay();
    } else {
      onStartPracticeQuestion();
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0E1015] text-zinc-100 pb-28 pt-3 px-3.5 sm:px-5 flex flex-col select-none">
      {/* Top Header Bar with Back Button */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-[#181A22] hover:bg-[#222530] border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          5-Day Fluency Challenge
        </span>

        <div className="w-9 h-9 opacity-0" />
      </div>

      {/* Hero Title */}
      <div className="mb-3.5 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          5-Day Fluency Challenge
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-[92%] mx-auto leading-relaxed">
          Daily micro-habits to build fluent workplace English in 5 days.
        </p>
      </div>

      {/* 
        MAIN 5-DAYS CHALLENGE CARD (ONLY THIS CARD ON SCREEN)
        Color tone:
        - If challenge is already ongoing/started: Elegant matte emerald/slate background with "Ongoing" badge and "Resume Challenge"
        - If not yet started: Slate/zinc subtle card with "Not Started" badge and "Start Challenge"
        No neon/glowing gradients — pure, refined matte cohesive palette.
      */}
      <div
        className={`w-full rounded-2xl p-4 sm:p-5 border transition-all shadow-md ${
          isStarted
            ? 'bg-[#121915] border-emerald-900/60 text-zinc-100'
            : 'bg-[#14171F] border-zinc-800 text-zinc-200'
        }`}
      >
        {/* Header of the Card: Status Badge & Day Indicator */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isStarted ? 'bg-emerald-500' : 'bg-zinc-500'
              }`}
            />
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isStarted ? 'text-emerald-400' : 'text-zinc-400'
              }`}
            >
              {isStarted ? 'Ongoing Challenge' : 'Ready to Start'}
            </span>
          </div>

          <span className="text-xs font-semibold text-zinc-400">
            Day {challenge.currentDay} of {challenge.totalDays}
          </span>
        </div>

        {/* Compact Key Stats Metrics (Completed, Pending, Days Left) */}
        <div className="grid grid-cols-3 gap-2 py-3 border-b border-white/5 text-center">
          <div className="p-2 rounded-xl bg-black/25 border border-white/5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block">
              Completed
            </span>
            <span className="text-lg sm:text-xl font-bold text-white mt-0.5 block">
              {totalActivitiesDone}
            </span>
            <span className="text-[10px] text-zinc-400 block">Activities</span>
          </div>

          <div className="p-2 rounded-xl bg-black/25 border border-white/5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-300 block">
              Pending
            </span>
            <span className="text-lg sm:text-xl font-bold text-zinc-200 mt-0.5 block">
              {activitiesPending}
            </span>
            <span className="text-[10px] text-zinc-400 block">Activities</span>
          </div>

          <div className="p-2 rounded-xl bg-black/25 border border-white/5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
              Time Left
            </span>
            <span className="text-lg sm:text-xl font-bold text-white mt-0.5 block">
              {challenge.daysRemaining}
            </span>
            <span className="text-[10px] text-zinc-400 block">Days Left</span>
          </div>
        </div>

        {/* Overall Completion Bar */}
        <div className="py-3 border-b border-white/5">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="text-zinc-300">Total Completion</span>
            <span className="text-emerald-400 font-bold">{overallPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isStarted ? 'bg-emerald-500' : 'bg-zinc-600'
              }`}
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* 
          VERTICAL 5 BARS IN A COMPACT 5-COLUMN GRID
          Clickable bars that open day-specific completed activities drawer
        */}
        <div className="pt-3.5 pb-2">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              5-Day Progress (Click a day to view activities)
            </span>
          </div>

          {/* 5-Column Grid with Vertical Bars */}
          <div className="grid grid-cols-5 gap-2">
            {challenge.dailyProgress.map((dayItem) => {
              const isDone = dayItem.isCompleted;
              const isCurrent = dayItem.isCurrent;
              const hasActivities = (dayItem.completedActivities && dayItem.completedActivities.length > 0) || isDone;

              // Vertical progress height calculation
              const fillHeight = isDone
                ? 100
                : isCurrent
                ? Math.min(95, Math.max(25, Math.round((dayItem.questionsCompleted / dayItem.questionsTarget) * 80) + (dayItem.myDayCompleted ? 20 : 0)))
                : 0;

              return (
                <button
                  key={dayItem.day}
                  type="button"
                  onClick={() => setSelectedDayDetail(dayItem)}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer active:scale-95 group text-center relative ${
                    isCurrent
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-sm'
                      : isDone
                      ? 'bg-emerald-950/20 border-emerald-800/40 hover:bg-emerald-950/40'
                      : 'bg-black/20 border-white/5 hover:bg-black/40 text-zinc-500'
                  }`}
                >
                  {/* Status Indicator Icon / Dot */}
                  <div className="mb-1.5 flex items-center justify-center">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ) : (
                      <Lock className="w-3 h-3 text-zinc-600" />
                    )}
                  </div>

                  {/* Vertical Bar Track */}
                  <div className="w-3.5 h-16 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/5 flex flex-col justify-end">
                    <div
                      className={`w-full rounded-full transition-all duration-500 ${
                        isDone
                          ? 'bg-emerald-500'
                          : isCurrent
                          ? 'bg-emerald-400'
                          : 'bg-zinc-700'
                      }`}
                      style={{ height: `${fillHeight}%` }}
                    />
                  </div>

                  {/* Day Label */}
                  <span
                    className={`text-[11px] font-bold mt-2 ${
                      isCurrent
                        ? 'text-emerald-300'
                        : isDone
                        ? 'text-zinc-200'
                        : 'text-zinc-500'
                    }`}
                  >
                    D{dayItem.day}
                  </span>

                  {/* Micro subtext */}
                  <span className="text-[9px] text-zinc-400 block mt-0.5">
                    {isDone ? '100%' : isCurrent ? `${fillHeight}%` : '0%'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two Core Target Summaries (Compact) */}
        <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
          {/* Target 1: My Day Activities */}
          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-300 font-medium">5 "My Day" Stories</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">
                {challenge.myDayCompletedCount} / 5
              </span>
              <span className="text-[10px] text-zinc-400">Done</span>
            </div>
          </div>

          {/* Target 2: Coach Neha Questions */}
          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-2">
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-300 font-medium">100 Coach Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">
                {challenge.coachQuestionsCompletedCount} / 100
              </span>
              <span className="text-[10px] text-zinc-400">Done</span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTON (Resume Challenge if ongoing, Start Challenge if not) */}
        <div className="mt-4 pt-2">
          <button
            onClick={handleStartOrResume}
            className={`w-full py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98] ${
              isStarted
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-zinc-100 hover:bg-white text-zinc-900'
            }`}
          >
            <Play className="w-4 h-4 fill-current stroke-none" />
            <span>{isStarted ? 'Resume Challenge' : 'Start Challenge'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ACTIVITIES LOG MODAL (SHOWN WHEN CLICKING ON ANY DAY BAR) */}
      <AnimatePresence>
        {selectedDayDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-[#151821] border border-zinc-700/60 rounded-2xl p-5 shadow-2xl text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {selectedDayDetail.dayLabel} Activities
                    </span>
                    {selectedDayDetail.isCompleted ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                        Completed
                      </span>
                    ) : selectedDayDetail.isCurrent ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">
                        Active Today
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400 block mt-0.5">
                    Target: 1 My Day Activity + 20 Speaking Questions
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDayDetail(null)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Body: List of activities done or pending */}
              <div className="py-4 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Completed Tasks on {selectedDayDetail.dayLabel}</span>
                </span>

                {selectedDayDetail.completedActivities && selectedDayDetail.completedActivities.length > 0 ? (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {selectedDayDetail.completedActivities.map((act, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-start gap-2 text-xs text-zinc-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-black/25 border border-white/5 text-center text-xs text-zinc-400">
                    {selectedDayDetail.isCompleted
                      ? 'All required activities for this day are marked completed.'
                      : selectedDayDetail.isCurrent
                      ? 'You are currently practicing for today. Complete 1 My Day Story and Coach Neha questions to mark this day complete.'
                      : 'This day will unlock once previous days are completed.'}
                  </div>
                )}
              </div>

              {/* Action Button inside modal */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setSelectedDayDetail(null)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all"
                >
                  Close
                </button>
                {selectedDayDetail.isCurrent && (
                  <button
                    onClick={() => {
                      setSelectedDayDetail(null);
                      handleStartOrResume();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Practice Now</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
