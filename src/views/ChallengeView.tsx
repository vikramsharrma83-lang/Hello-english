import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  Mic,
  Award,
  ChevronRight,
  Clock,
  Target,
  Play,
  Calendar,
  Zap,
} from 'lucide-react';
import { UserProgress, Question } from '../types';
import { getOrCreateChallenge } from '../utils/challengeManager';

interface ChallengeViewProps {
  progress: UserProgress;
  onBack: () => void;
  onStartMyDay: () => void;
  onStartPracticeQuestion: (question?: Question) => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  progress,
  onBack,
  onStartMyDay,
  onStartPracticeQuestion,
}) => {
  const challenge = getOrCreateChallenge(progress);

  const totalActivitiesTarget = challenge.myDayTarget + challenge.coachQuestionsTarget; // 105
  const totalActivitiesDone = challenge.myDayCompletedCount + challenge.coachQuestionsCompletedCount;
  const activitiesPending = Math.max(0, totalActivitiesTarget - totalActivitiesDone);
  const overallPercentage = Math.min(100, Math.round((totalActivitiesDone / totalActivitiesTarget) * 100));

  const myDayPercentage = Math.min(100, Math.round((challenge.myDayCompletedCount / challenge.myDayTarget) * 100));
  const questionsPercentage = Math.min(100, Math.round((challenge.coachQuestionsCompletedCount / challenge.coachQuestionsTarget) * 100));

  return (
    <div className="w-full min-h-screen bg-black text-white pb-28 pt-3 px-3.5 sm:px-5 flex flex-col select-none">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-[#181A22] hover:bg-[#222530] border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black tracking-wider uppercase shadow-[0_0_12px_rgba(245,158,11,0.15)]">
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>5-DAY FLUENCY CHALLENGE</span>
        </div>

        <div className="w-9 h-9 opacity-0" />
      </div>

      {/* Hero Header */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-white flex items-center justify-center gap-2">
          <span>5-Day Speaking Challenge</span>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </h1>
        <p className="text-xs sm:text-[13px] text-zinc-400 mt-1 max-w-[90%] mx-auto">
          5 दिनों में इंग्लिश बोलने का डर खत्म करें। डेली एक्टिविटी और सवाल पूरे करें।
        </p>
      </div>

      {/* SECTION 2: PROGRESS CARD */}
      <div className="w-full bg-[#13151D] rounded-3xl p-4 sm:p-5 border border-white/10 shadow-xl relative overflow-hidden mb-5">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Card Header: Stats Metrics Breakdown (Activities Completion, Pending, Days Remaining) */}
        <div className="relative z-10 grid grid-cols-3 gap-2 pb-4 border-b border-white/10 text-center">
          <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
              Completed
            </span>
            <span className="text-xl sm:text-2xl font-black text-white">
              {totalActivitiesDone}
            </span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Activities</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
              Pending
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-300">
              {activitiesPending}
            </span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Activities</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-0.5">
              Time Left
            </span>
            <span className="text-xl sm:text-2xl font-black text-sky-300">
              {challenge.daysRemaining}
            </span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Days Left</span>
          </div>
        </div>

        {/* Overall Challenge Progress Bar */}
        <div className="relative z-10 mt-3.5 mb-4">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-zinc-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Overall 5-Day Challenge Goal</span>
            </span>
            <span className="text-amber-400 font-extrabold">{overallPercentage}% Done</span>
          </div>
          <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            />
          </div>
        </div>

        {/* SECTION 2.a: PROGRESS BAR OF EACH DAY (5-DAY TIMELINE TRACKER) */}
        <div className="relative z-10 mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>Daily Progress Breakdown (5 Days)</span>
            </span>
            <span className="text-[11px] font-bold text-zinc-500">Day {challenge.currentDay} of 5</span>
          </div>

          <div className="space-y-2">
            {challenge.dailyProgress.map((dayItem) => {
              const isDayDone = dayItem.isCompleted;
              const isDayCurrent = dayItem.isCurrent;
              const dayScore = isDayDone ? 100 : isDayCurrent ? Math.min(90, Math.max(30, Math.round(((challenge.coachQuestionsCompletedCount % 20) / 20) * 100) || 45)) : 0;

              return (
                <div
                  key={dayItem.day}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    isDayCurrent
                      ? 'bg-amber-500/[0.08] border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.1)]'
                      : isDayDone
                      ? 'bg-emerald-500/[0.05] border-emerald-500/20'
                      : 'bg-black/30 border-white/5 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {isDayDone ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : isDayCurrent ? (
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold animate-pulse">
                          <Zap className="w-3.5 h-3.5 fill-amber-400" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold">
                          <Lock className="w-3 h-3" />
                        </div>
                      )}

                      <span className={`text-xs font-black ${isDayCurrent ? 'text-amber-300' : isDayDone ? 'text-emerald-300' : 'text-zinc-400'}`}>
                        {dayItem.dayLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isDayDone && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Completed
                        </span>
                      )}
                      {isDayCurrent && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                          Active Today
                        </span>
                      )}
                      {!isDayDone && !isDayCurrent && (
                        <span className="text-[10px] font-medium text-zinc-500">
                          Locked
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-zinc-400 w-8 text-right">
                        {dayScore}%
                      </span>
                    </div>
                  </div>

                  {/* Day Specific Progress Bar */}
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDayDone
                          ? 'bg-emerald-400'
                          : isDayCurrent
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-zinc-800'
                      }`}
                      style={{ width: `${dayScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION a: THE 2 PRIMARY 5-DAY CHALLENGE TASKS */}
      <div className="space-y-3.5 mb-5">
        <h2 className="text-xs font-black uppercase tracking-wider text-zinc-400 px-1">
          Challenge Requirements (2 Core Tasks)
        </h2>

        {/* Task a.1: Complete 5 "My Day" Activity */}
        <div className="bg-[#14161E] rounded-3xl p-4 sm:p-5 border border-amber-500/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_16px_rgba(245,158,11,0.2)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wide">
                  Task a.1 • Daily Stories
                </span>
                <h3 className="text-base font-extrabold text-white mt-1">
                  Complete 5 "My Day" Activities
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  हर दिन अपनी दिनचर्या और काम की बातें शेयर करें
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm font-black text-amber-400">
                {challenge.myDayCompletedCount} / {challenge.myDayTarget}
              </span>
              <span className="block text-[10px] text-zinc-500">Completed</span>
            </div>
          </div>

          {/* Task a.1 Progress Bar */}
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden mb-3.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${myDayPercentage}%` }}
            />
          </div>

          {/* 5 Day Activity Story Pills */}
          <div className="grid grid-cols-5 gap-1.5 mb-3.5">
            {[1, 2, 3, 4, 5].map((dayNum) => {
              const isDone = dayNum <= challenge.myDayCompletedCount;
              const isCurrent = dayNum === challenge.myDayCompletedCount + 1;
              return (
                <div
                  key={dayNum}
                  className={`py-1.5 px-1 rounded-xl text-center border text-[10px] font-bold ${
                    isDone
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : isCurrent
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                      : 'bg-zinc-900 border-white/5 text-zinc-600'
                  }`}
                >
                  <span>Day {dayNum}</span>
                  <span className="block mt-0.5">{isDone ? '✓ Done' : isCurrent ? 'Next' : 'Pending'}</span>
                </div>
              );
            })}
          </div>

          {/* Start My Day CTA Button */}
          <button
            onClick={onStartMyDay}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Start My Day Activity</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Task a.2: Complete 100 Questions of Coach Neha */}
        <div className="bg-[#14161E] rounded-3xl p-4 sm:p-5 border border-purple-500/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_16px_rgba(168,85,247,0.2)]">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wide">
                  Task a.2 • Coach Neha
                </span>
                <h3 className="text-base font-extrabold text-white mt-1">
                  Complete 100 Questions of Coach Neha
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  वर्कप्लेस, सोशल और डेली रूटीन के 100 सवालों का बोलकर अभ्यास
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm font-black text-purple-400">
                {challenge.coachQuestionsCompletedCount} / {challenge.coachQuestionsTarget}
              </span>
              <span className="block text-[10px] text-zinc-500">Questions</span>
            </div>
          </div>

          {/* Task a.2 Progress Bar */}
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden mb-3.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${questionsPercentage}%` }}
            />
          </div>

          {/* 4 Milestones Checklist */}
          <div className="grid grid-cols-4 gap-1.5 mb-3.5 text-center">
            {[
              { q: 25, label: '25Q' },
              { q: 50, label: '50Q' },
              { q: 75, label: '75Q' },
              { q: 100, label: '100Q 🏆' },
            ].map((milestone) => {
              const reached = challenge.coachQuestionsCompletedCount >= milestone.q;
              return (
                <div
                  key={milestone.q}
                  className={`py-1.5 px-1 rounded-xl border text-[10px] font-bold ${
                    reached
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'bg-zinc-900 border-white/5 text-zinc-600'
                  }`}
                >
                  <span>{milestone.label}</span>
                  <span className="block mt-0.5">{reached ? '✓ Reached' : 'Locked'}</span>
                </div>
              );
            })}
          </div>

          {/* Start Coach Neha Questions CTA Button */}
          <button
            onClick={() => onStartPracticeQuestion()}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4 stroke-[2.5]" />
            <span>Practice Coach Neha Questions</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Completion Reward Preview Card */}
      <div className="w-full p-4 rounded-3xl bg-gradient-to-br from-amber-950/30 via-[#161720] to-purple-950/30 border border-amber-500/20 flex items-center gap-3.5 mb-2">
        <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(245,158,11,0.2)]">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
            CHALLENGE REWARD
          </span>
          <h4 className="text-xs sm:text-sm font-extrabold text-white">
            5-Day Fluency Certificate & Badge
          </h4>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            5 My Day एक्टिविटी + 100 सवाल पूरे करके अपना सर्टिफ़िकेट अनलॉक करें।
          </p>
        </div>
      </div>
    </div>
  );
};
