import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Footprints, 
  MapPin, 
  Award, 
  Play, 
  ChevronRight, 
  Users, 
  Activity, 
  Search, 
  Calendar, 
  Sparkles, 
  CheckCircle2,
  Clock,
  Compass,
  BookOpen,
  User
} from 'lucide-react';
import { UserProgress, Question } from '../types';
import { PRACTICE_QUESTIONS } from '../data/questions';
import { EnglishProgressScreen } from '../components/myday/EnglishProgressScreen';
import { CourseView } from './CourseView';

interface FitnessDashboardViewProps {
  progress?: UserProgress;
  onStartPractice: (question?: Question) => void;
  onOpenMyDay: () => void;
}

type FitnessSubTab = 'summary' | 'fitness_plus' | 'workouts' | 'sharing';
type PlusCategory = 'For You' | 'Explore' | 'Plans' | 'Library';

export const FitnessDashboardView: React.FC<FitnessDashboardViewProps> = ({
  progress,
  onStartPractice,
  onOpenMyDay,
}) => {
  const [subTab, setSubTab] = useState<FitnessSubTab>('summary');
  const [plusCategory, setPlusCategory] = useState<PlusCategory>('For You');
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
  const [isMetricsOpen, setIsMetricsOpen] = useState<boolean>(false);

  const workouts = [
    {
      id: 'w-1',
      title: 'Strength with Kyle',
      category: 'Strength & Core',
      duration: '10 min',
      genre: 'Top Country',
      instructor: 'Kyle',
      badge: 'NEW',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      question: PRACTICE_QUESTIONS[0]
    },
    {
      id: 'w-2',
      title: 'Strength with Gregg',
      category: 'Full Body Power',
      duration: '20 min',
      genre: 'Everything Rock',
      instructor: 'Gregg',
      badge: 'NEW',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      question: PRACTICE_QUESTIONS[1]
    },
    {
      id: 'w-3',
      title: 'Strength with Jenn',
      category: 'Lower Body Focus',
      duration: '30 min',
      genre: 'Latin Grooves',
      instructor: 'Jenn',
      badge: 'NEW',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
      question: PRACTICE_QUESTIONS[2]
    },
  ];

  const meditations = [
    {
      id: 'm-1',
      title: 'Meditation with Dustin',
      category: 'Mindfulness',
      duration: '5 min',
      genre: 'Gratitude',
      instructor: 'Dustin',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      question: PRACTICE_QUESTIONS[3]
    },
    {
      id: 'm-2',
      title: 'Meditation with Jessica',
      category: 'Calm & Rest',
      duration: '5 min',
      genre: 'Sleep',
      instructor: 'Jessica',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      question: PRACTICE_QUESTIONS[4]
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white pb-32 pt-4 px-4 font-sans select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between mb-6 px-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            {subTab === 'summary' ? 'Summary' : 'Fitness+'}
          </p>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {subTab === 'summary' ? 'Sunday, 30 Aug' : 'Apple Fitness+'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenMyDay}
            className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide flex items-center gap-1.5 hover:bg-amber-500/30 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>My Day</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-sm text-white">
              {progress?.userName?.[0] || 'V'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Switcher */}
      <AnimatePresence mode="wait">
        {subTab === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 max-w-xl mx-auto"
          >
            {/* Activity Ring Card */}
            <div 
              onClick={() => setIsMetricsOpen(true)}
              className="bg-[#18191E] rounded-3xl p-4 border border-zinc-800/80 shadow-2xl relative overflow-hidden group cursor-pointer hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  Confidence Score
                </h2>
                <div className="w-7 h-7 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#3f1d24" strokeWidth="10" fill="none" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      stroke="#ff2d55" 
                      strokeWidth="10" 
                      fill="none" 
                      strokeDasharray="251.2"
                      strokeDashoffset="60.3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-black mb-0.5 shadow-[0_0_8px_rgba(255,45,85,0.6)]">
                      <ChevronRight className="w-3.5 h-3.5 -rotate-45 font-black stroke-[3]" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">Overall Average</p>
                  <p className="text-2xl font-black text-[#ff2d55] tracking-tight mt-0.5">
                    76%
                  </p>
                  <p className="text-xs font-bold text-zinc-300 mt-1">
                    24 Activities
                  </p>
                </div>
              </div>
            </div>

            {/* English Metrics Summary under Activity Ring */}
            <div className="bg-[#18191E] rounded-3xl p-4 border border-zinc-800/80 shadow-xl flex items-center justify-around text-center">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Grammar</p>
                <p className="text-lg font-black text-white mt-0.5">60%</p>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Comm</p>
                <p className="text-lg font-black text-cyan-400 mt-0.5">95%</p>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Vocab</p>
                <p className="text-lg font-black text-purple-400 mt-0.5">74%</p>
              </div>
            </div>

            {/* Grid for Words Spoken & Sentences Spoken */}
            <div className="grid grid-cols-2 gap-4">
              {/* Words Spoken Card */}
              <div className="bg-[#18191E] rounded-3xl p-4 border border-zinc-800/80 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 truncate pr-1">
                    Words Spoken
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400">This Week</p>
                  <p className="text-2xl font-black text-[#d9b8ff] tracking-tight">
                    1,450
                  </p>
                </div>
                <div className="h-10 mt-3 flex items-end gap-1">
                  {[30, 45, 60, 40, 75, 90, 65].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${h}%` }} 
                      className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-[#d9b8ff] shadow-[0_0_8px_rgba(217,184,255,0.6)]' : 'bg-zinc-700/50'}`} 
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[8px] font-semibold text-zinc-400 mt-1">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* Sentences Spoken Card */}
              <div className="bg-[#18191E] rounded-3xl p-4 border border-zinc-800/80 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 truncate pr-1">
                    Sentences Spoken
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400">This Week</p>
                  <p className="text-2xl font-black text-cyan-400 tracking-tight">
                    92
                  </p>
                </div>
                <div className="h-10 mt-3 flex items-end gap-1">
                  {[25, 50, 40, 65, 80, 95, 70].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${h}%` }} 
                      className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-zinc-700/50'}`} 
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[8px] font-semibold text-zinc-400 mt-1">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>

            {/* Grid for Sessions & Awards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Sessions */}
              <div className="bg-[#18191E] rounded-3xl p-4 border border-zinc-800/80 shadow-xl flex flex-col justify-between h-40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                    Sessions
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex flex-col justify-center my-auto">
                  <p className="text-xs text-zinc-400">This Week</p>
                  <p className="text-2xl font-black text-amber-400 tracking-tight mt-0.5">
                    125 <span className="text-xs text-zinc-300 font-bold">mins</span>
                  </p>
                </div>
              </div>

              {/* Awards */}
              <div 
                onClick={onOpenMyDay}
                className="bg-[#18191E] rounded-3xl p-4 border border-zinc-800/80 shadow-xl flex flex-col justify-between h-40 cursor-pointer group hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                    Awards
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lime-300 via-emerald-400 to-cyan-500 p-0.5 shadow-md flex items-center justify-center mb-1">
                    <div className="w-full h-full rounded-2xl bg-zinc-950 flex items-center justify-center">
                      <Award className="w-6 h-6 text-lime-400" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white">June Challenge</span>
                  <span className="text-[10px] text-zinc-400">2026</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {subTab === 'fitness_plus' && (
          <motion.div
            key="fitness_plus"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <CourseView onStartPractice={onStartPractice} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed English Progress Screen Modal */}
      <EnglishProgressScreen
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
        progress={progress}
        onStartPractice={() => {
          setIsMetricsOpen(false);
          onStartPractice();
        }}
      />
    </div>
  );
};
