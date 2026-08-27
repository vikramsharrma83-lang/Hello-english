import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  Award,
  BookOpen,
  Volume2,
  Trash2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { SavedPhrase, UserProgress } from '../types';
import { speakText, stopSpeaking } from '../utils/audio';

interface ProgressViewProps {
  progress: UserProgress;
  onSelectSavedPhrase: (phrase: SavedPhrase) => void;
  onRemoveSavedPhrase: (id: string) => void;
  onStartPractice: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onSelectSavedPhrase,
  onRemoveSavedPhrase,
  onStartPractice,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

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

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#FDF4FF] via-[#F8F7FF] to-[#FFF1F5] text-slate-900 pb-28 pt-4 px-4 sm:px-5">
      {/* Title */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
          LEARNER DASHBOARD
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Your Progress & Phrases
        </h1>
      </div>

      {/* Streak Highlight Card */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#FFFBEB] via-[#FFF1F2] to-[#FAF5FF] border border-[#FED7AA] pastel-card-shadow relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EA580C] to-[#F97316] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/25">
              <Flame className="w-7 h-7 fill-white" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">
                {progress.streakDays} Day Streak!
              </span>
              <p className="text-xs font-semibold text-[#C2410C]">
                Daily English Practice Habit
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 text-[#EA580C] border border-[#FED7AA]">
            🔥 Active
          </span>
        </div>

        {/* Weekly Day Tracker */}
        <div className="grid grid-cols-7 gap-1.5 mt-4 pt-3 border-t border-[#FED7AA]/60">
          {daysOfWeek.map((day, idx) => {
            const isCompleted = idx < (progress.streakDays % 7 || 5);
            return (
              <div
                key={day}
                className={`flex flex-col items-center py-2 rounded-xl text-center ${
                  isCompleted
                    ? 'bg-gradient-to-b from-white to-[#FFF7ED] text-[#EA580C] font-bold shadow-2xs border border-[#FED7AA]'
                    : 'bg-white/50 text-slate-400'
                }`}
              >
                <span className="text-[10px] uppercase font-bold">{day}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#EA580C] mt-1" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 mt-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 mt-4">
        <div className="p-3.5 rounded-2xl bg-white border border-[#E9D5FF] pastel-card-shadow">
          <span className="text-xl font-black text-[#7C3AED]">{progress.totalPracticed}</span>
          <p className="text-[11px] font-bold text-slate-700 mt-0.5">Sentences Practiced</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#CCFBF1] pastel-card-shadow">
          <span className="text-xl font-black text-[#0D9488]">{progress.totalMinutes}m</span>
          <p className="text-[11px] font-bold text-slate-700 mt-0.5">Speaking Time</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#FECDD3] pastel-card-shadow">
          <span className="text-xl font-black text-[#E11D48]">{progress.savedPhrases.length}</span>
          <p className="text-[11px] font-bold text-slate-700 mt-0.5">Saved Phrases</p>
        </div>
      </div>

      {/* SAVED PHRASES PERSONAL PRACTICE BOOK */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#7C3AED]" />
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
              My Saved Phrases
            </h2>
          </div>
          <span className="text-xs font-bold text-[#7C3AED]">
            {progress.savedPhrases.length} saved
          </span>
        </div>

        {progress.savedPhrases.length === 0 ? (
          <div className="p-6 rounded-3xl bg-white/90 border border-[#E9D5FF] text-center pastel-card-shadow">
            <Sparkles className="w-8 h-8 text-[#C084FC] mx-auto mb-2" />
            <p className="text-sm font-extrabold text-slate-900">
              No saved phrases yet
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Whenever Coach Neha improves a sentence, tap the bookmark icon to save it here for quick revision!
            </p>
            <button
              onClick={onStartPractice}
              className="mt-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white text-xs font-bold shadow-md shadow-[#DB2777]/25 hover:opacity-95 cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Practice a Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {progress.savedPhrases.map((phrase) => (
              <motion.div
                key={phrase.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4 bg-white border border-[#E9D5FF] pastel-card-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#7E22CE]">
                    Workplace Practice
                  </span>
                  <button
                    onClick={() => onRemoveSavedPhrase(phrase.id)}
                    className="text-slate-400 hover:text-[#E11D48] p-1 transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-sm font-extrabold text-slate-900 leading-snug">
                  “{phrase.improvedSentence}”
                </p>

                {phrase.hindiTranslation && (
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    हिंदी: {phrase.hindiTranslation}
                  </p>
                )}

                <div className="mt-3 pt-2 border-t border-[#E9D5FF]/60 flex items-center justify-between">
                  <button
                    onClick={() => handlePlayAudio(phrase)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      playingId === phrase.id
                        ? 'bg-[#7C3AED] text-white'
                        : 'bg-[#FAF5FF] text-[#7C3AED] hover:bg-[#F3E8FF]'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{playingId === phrase.id ? 'Playing...' : 'Pronounce'}</span>
                  </button>

                  <button
                    onClick={() => onSelectSavedPhrase(phrase)}
                    className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Practice this</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
