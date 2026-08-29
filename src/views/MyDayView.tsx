import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  CheckCircle2,
  Circle,
  Play,
  Volume2,
  Sparkles,
  Trophy,
  ArrowRight,
  RefreshCw,
  Clock,
  HelpCircle,
  MessageSquare,
  Mic,
  Award,
  ChevronRight,
  Edit2,
  Check,
} from 'lucide-react';
import { MyDayTask, Question } from '../types';
import { speakText, stopSpeaking, soundFx } from '../utils/audio';
import { PRACTICE_QUESTIONS } from '../data/questions';

interface MyDayViewProps {
  userName?: string;
  onUpdateUserName?: (name: string) => void;
  streakDays: number;
  completedTaskIds: string[];
  onToggleTaskCompleted: (taskId: string) => void;
  onResetTasks: () => void;
  onStartPractice: (question?: Question) => void;
  onNavigateTab: (tab: 'home' | 'practice' | 'progress' | 'profile') => void;
}

export const MyDayView: React.FC<MyDayViewProps> = ({
  userName = 'Vikram',
  onUpdateUserName,
  streakDays = 5,
  completedTaskIds = ['share_day', 'conversation'],
  onToggleTaskCompleted,
  onResetTasks,
  onStartPractice,
  onNavigateTab,
}) => {
  const [activeTaskModal, setActiveTaskModal] = useState<MyDayTask | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Quick Check Interactive State
  const [quickCheckAnswer, setQuickCheckAnswer] = useState<number | null>(null);
  const [quickCheckFeedback, setQuickCheckFeedback] = useState<boolean | null>(null);

  // Share Day prompt state
  const [spokenDailyText, setSpokenDailyText] = useState<string>('');
  const [isRecordingDaily, setIsRecordingDaily] = useState<boolean>(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const DEFAULT_TASKS: MyDayTask[] = [
    {
      id: 'share_day',
      icon: '🎓',
      tag: 'Express',
      title: 'Share your day',
      subtitle: 'Express what happened on your shift or daily routine',
      detail: '“Today I completed 35 deliveries and updated my dispatch manager before 6 PM.”',
      hindiDetail: 'आज मैंने 35 डिलीवरी पूरी कीं और 6 बजे से पहले मैनेजर को अपडेट दिया।',
      completed: completedTaskIds.includes('share_day'),
      timeEstimate: '2 mins',
      accentColor: '#8B5CF6', // Purple
    },
    {
      id: 'conversation',
      icon: '🛠',
      tag: 'Dialogue',
      title: 'Conversation',
      subtitle: 'Practice a real workplace conversation scenario',
      detail: '“Sir, the supplier is asking for the signed invoice copy before unloading.”',
      hindiDetail: 'सर, सप्लायर अनलोडिंग से पहले हस्ताक्षरित इनवॉइस कॉपी मांग रहा है।',
      completed: completedTaskIds.includes('conversation'),
      timeEstimate: '3 mins',
      accentColor: '#3B82F6', // Blue
    },
    {
      id: 'score',
      icon: '🗣',
      tag: 'Fluency',
      title: 'Score',
      subtitle: 'Say 3 daily workplace phrases with clear confidence',
      detail: '1. “Could you please check this parcel tracking ID?”\n2. “I am heading to bay 4 for the morning handover.”\n3. “Let me confirm with my team lead right away.”',
      hindiDetail: 'दैनिक कार्यस्थल के 3 महत्वपूर्ण वाक्यों का स्पष्ट उच्चारण करें।',
      completed: completedTaskIds.includes('score'),
      timeEstimate: '2 mins',
      accentColor: '#10B981', // Emerald
    },
    {
      id: 'quick_check',
      icon: '✅',
      tag: 'Quiz',
      title: 'Quick Check',
      subtitle: 'Rapid 30-second confidence verification',
      detail: 'Choose the most polite response when informing a customer about a 10-minute delay.',
      hindiDetail: 'ग्राहक को 10 मिनट की देरी के बारे में विनम्रता से सूचित करने वाला सही विकल्प चुनें।',
      completed: completedTaskIds.includes('quick_check'),
      timeEstimate: '1 min',
      accentColor: '#F59E0B', // Amber
    },
  ];

  const totalTasks = DEFAULT_TASKS.length;
  const completedCount = DEFAULT_TASKS.filter((t) => t.completed).length;
  const isAllCompleted = completedCount === totalTasks;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const handlePlayAudio = (text: string, id: string) => {
    if (playingAudioId === id) {
      stopSpeaking();
      setPlayingAudioId(null);
      return;
    }
    setPlayingAudioId(id);
    speakText(text, 'en-IN', 0.9, () => {
      setPlayingAudioId(null);
    });
  };

  const handleToggleTask = (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundFx.playBubbleStart();
    onToggleTaskCompleted(taskId);
  };

  const handleSaveName = () => {
    if (nameInput.trim() && onUpdateUserName) {
      onUpdateUserName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const handleQuickCheckSelect = (optionIndex: number, isCorrect: boolean) => {
    setQuickCheckAnswer(optionIndex);
    setQuickCheckFeedback(isCorrect);
    if (isCorrect) {
      soundFx.playSuccessChime();
      if (!completedTaskIds.includes('quick_check')) {
        onToggleTaskCompleted('quick_check');
      }
    } else {
      soundFx.playBubbleStart();
    }
  };

  const handleLaunchConversationPractice = () => {
    const matched = PRACTICE_QUESTIONS.find(
      (q) => q.category === 'workplace' && q.level === 'Level 2'
    ) || PRACTICE_QUESTIONS[0];
    onStartPractice(matched);
  };

  const handleLaunchShareDayPractice = () => {
    const matched = PRACTICE_QUESTIONS.find(
      (q) => q.category === 'daily_routine'
    ) || PRACTICE_QUESTIONS[1];
    onStartPractice(matched);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white pb-28 pt-4 px-4 sm:px-5 flex flex-col justify-start select-none">
      {/* Top Header: Greeting, User Name, Streak & Progress Indicator */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F59E0B]">
              MY DAILY PLAN • {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            {isEditingName ? (
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  autoFocus
                  className="bg-zinc-800 text-white font-bold text-lg px-2.5 py-1 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 rounded-lg bg-amber-500 text-black hover:bg-amber-400 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h1 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight leading-tight">
                  {getGreeting()}, {userName}
                </h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  title="Edit Name"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Small Streak / XP Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span className="text-xs font-black">{streakDays} Days</span>
          </div>
        </div>
      </div>

      {/* DAY COMPLETE STATE (When all 4 required tasks are finished) */}
      <AnimatePresence>
        {isAllCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl p-4 bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-emerald-900/90 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-4 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                <Trophy className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                    🎉 DAY COMPLETE!
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-snug">
                  All 4 daily tasks finished! Streak extended to {streakDays} days!
                </p>
              </div>
            </div>

            <button
              onClick={onResetTasks}
              className="px-3 py-1.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset Tasks for practice"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TODAY'S TASKS AS COMPACT CARDS */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
            Today’s Tasks
          </span>
          <span className="text-[11px] font-semibold text-zinc-500">
            Tap card to practice • Mark done
          </span>
        </div>

        {DEFAULT_TASKS.map((task, index) => {
          const isDone = task.completed;
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => setActiveTaskModal(task)}
              className={`rounded-2xl p-4 transition-all cursor-pointer border relative overflow-hidden ${
                isDone
                  ? 'bg-[#15171E]/80 border-emerald-900/60 hover:border-emerald-700/80 shadow-xs'
                  : 'bg-[#181A22] border-zinc-800 hover:border-zinc-700 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left Icon */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border ${
                    isDone
                      ? 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300'
                      : 'bg-zinc-800 border-zinc-700'
                  }`}
                >
                  {task.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        isDone
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {task.tag}
                    </span>
                    <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {task.timeEstimate}
                    </span>
                  </div>

                  <h3
                    className={`text-base font-bold leading-tight ${
                      isDone ? 'text-zinc-300 line-through decoration-emerald-500/60' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </h3>

                  <p className="text-xs text-zinc-400 font-medium mt-0.5 leading-snug line-clamp-1">
                    {task.subtitle}
                  </p>
                </div>

                {/* Task Completed Action Button */}
                <button
                  onClick={(e) => handleToggleTask(task.id, e)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-xs ${
                    isDone
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 hover:text-white'
                  }`}
                  title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Done</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Complete</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sample Target Line Preview */}
              <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <span className="truncate max-w-[82%] text-[11px] font-medium text-zinc-300 italic">
                  {task.detail.split('\n')[0]}
                </span>
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-0.5 shrink-0">
                  Open <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* TODAY'S PROGRESS BAR & STATUS AT BOTTOM */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 mb-2 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-300">Today’s progress</span>
            <span className="text-xs font-black text-amber-400">
              {completedCount} of {totalTasks} tasks complete
            </span>
          </div>
          <span className="text-xs font-black text-zinc-400">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* 4 Step Dots */}
        <div className="flex items-center justify-between mt-2.5 pt-1 px-1">
          {DEFAULT_TASKS.map((t, idx) => (
            <div key={t.id} className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  t.completed ? 'bg-emerald-400 shadow-[0_0_6px_#34D399]' : 'bg-zinc-700'
                }`}
              />
              <span className="text-[10px] font-semibold text-zinc-400">
                Task {idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TASK DETAIL / INTERACTIVE MODAL */}
      <AnimatePresence>
        {activeTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="w-full max-w-[420px] max-h-[90vh] overflow-y-auto bg-[#181A22] rounded-3xl p-5 border border-zinc-700/80 shadow-2xl text-white flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl shrink-0">
                    {activeTaskModal.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {activeTaskModal.tag}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {activeTaskModal.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTaskModal(null)}
                  className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Body details per task */}
              <div className="py-4 space-y-3.5">
                <p className="text-sm font-semibold text-zinc-300 leading-relaxed">
                  {activeTaskModal.subtitle}
                </p>

                {/* TASK SPECIFIC INTERACTION */}
                {activeTaskModal.id === 'share_day' && (
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-purple-500/30 space-y-2.5">
                    <span className="text-[11px] font-bold uppercase text-purple-300 block">
                      Suggested Daily Share Phrasing
                    </span>
                    <p className="text-sm font-bold text-white leading-relaxed">
                      {activeTaskModal.detail}
                    </p>
                    {activeTaskModal.hindiDetail && (
                      <p className="text-xs text-purple-200/80 font-medium">
                        हिंदी: {activeTaskModal.hindiDetail}
                      </p>
                    )}

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(activeTaskModal.detail, 'share_day_audio')}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-600/60 text-purple-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Listen Pronunciation</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTaskModal(null);
                          handleLaunchShareDayPractice();
                        }}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Practice Speaking</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTaskModal.id === 'conversation' && (
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-blue-500/30 space-y-2.5">
                    <span className="text-[11px] font-bold uppercase text-blue-300 block">
                      Workplace Dialogue Target
                    </span>
                    <p className="text-sm font-bold text-white leading-relaxed">
                      {activeTaskModal.detail}
                    </p>
                    {activeTaskModal.hindiDetail && (
                      <p className="text-xs text-blue-200/80 font-medium">
                        हिंदी: {activeTaskModal.hindiDetail}
                      </p>
                    )}

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(activeTaskModal.detail, 'conv_audio')}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-600/60 text-blue-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Listen Audio</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTaskModal(null);
                          handleLaunchConversationPractice();
                        }}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Start Dialogue</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTaskModal.id === 'score' && (
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-emerald-500/30 space-y-2.5">
                    <span className="text-[11px] font-bold uppercase text-emerald-300 block">
                      3 Daily Target Fluency Phrases
                    </span>
                    <div className="space-y-2">
                      {[
                        'Could you please check this parcel tracking ID?',
                        'I am heading to bay 4 for the morning handover.',
                        'Let me confirm with my team lead right away.',
                      ].map((phrase, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-between gap-2"
                        >
                          <span className="text-xs font-bold text-zinc-200 flex-1">
                            {phrase}
                          </span>
                          <button
                            onClick={() => handlePlayAudio(phrase, `phrase_${pIdx}`)}
                            className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 cursor-pointer"
                            title="Pronounce phrase"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTaskModal.id === 'quick_check' && (
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-amber-500/30 space-y-3">
                    <span className="text-[11px] font-bold uppercase text-amber-300 block">
                      Rapid 15-Sec Workplace Check
                    </span>
                    <p className="text-xs font-bold text-white">
                      Customer says: “Why is my delivery taking longer than expected?”
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Which response is most professional and polite?
                    </p>

                    <div className="space-y-2">
                      {[
                        { text: 'Wait some time, I am busy right now.', correct: false },
                        {
                          text: 'I apologize for the delay. I will arrive in approximately 10 minutes.',
                          correct: true,
                        },
                        { text: 'Traffic is bad, not my fault.', correct: false },
                      ].map((opt, oIdx) => {
                        const isSelected = quickCheckAnswer === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleQuickCheckSelect(oIdx, opt.correct)}
                            className={`w-full p-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? opt.correct
                                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                                  : 'bg-rose-950/80 border-rose-500 text-rose-200'
                                : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span>{opt.text}</span>
                              {isSelected && (
                                <span className="text-[10px] font-black">
                                  {opt.correct ? '✓ Correct' : '✕ Try again'}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Modal Action: Complete Button */}
              <div className="pt-3 border-t border-zinc-800 flex items-center gap-2.5">
                <button
                  onClick={() => {
                    handleToggleTask(activeTaskModal.id);
                    setActiveTaskModal(null);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                    completedTaskIds.includes(activeTaskModal.id)
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold shadow-amber-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedTaskIds.includes(activeTaskModal.id)
                      ? 'Mark as Incomplete'
                      : 'Task completed'}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTaskModal(null)}
                  className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
