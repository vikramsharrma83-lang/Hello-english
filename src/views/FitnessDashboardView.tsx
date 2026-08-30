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
            <div className="bg-[#18191E] rounded-3xl p-5 border border-zinc-800/80 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Activity Ring
                </h2>
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#3f1d24" strokeWidth="10" fill="none" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      stroke="#ff2d55" 
                      strokeWidth="10" 
                      fill="none" 
                      strokeDasharray="251.2"
                      strokeDashoffset="240"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center text-black mb-0.5 shadow-[0_0_10px_rgba(255,45,85,0.6)]">
                      <ChevronRight className="w-4 h-4 -rotate-45 font-black stroke-[3]" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium">Move</p>
                  <p className="text-3xl font-black text-[#ff2d55] tracking-tight mt-0.5">
                    8<span className="text-xl text-zinc-300 font-bold">/360</span> <span className="text-lg text-[#ff2d55]">KCAL</span>
                  </p>
                  <p className="text-xs text-zinc-400 mt-2">
                    🔥 <strong className="text-white">{progress?.streakDays || 5} Day Streak</strong> • Daily Activity Goal
                  </p>
                </div>
              </div>
            </div>

            {/* Grid for Step Count & Step Distance */}
            <div className="grid grid-cols-2 gap-4">
              {/* Step Count */}
              <div className="bg-[#18191E] rounded-3xl p-4 border border-zinc-800/80 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                    Step Count
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Today</p>
                  <p className="text-2xl font-black text-[#d9b8ff] tracking-tight">
                    332
                  </p>
                </div>
                <div className="h-10 mt-3 flex items-end gap-1">
                  {[10, 5, 15, 8, 5, 5, 5, 45, 60, 20, 10, 5].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${h}%` }} 
                      className={`flex-1 rounded-t-sm ${i === 8 ? 'bg-[#d9b8ff] shadow-[0_0_8px_rgba(217,184,255,0.6)]' : 'bg-zinc-700/50'}`} 
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-zinc-500 mt-1">
                  <span>12 AM</span>
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                </div>
              </div>

              {/* Step Distance */}
              <div className="bg-[#18191E] rounded-3xl p-4 border border-zinc-800/80 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                    Step Distance
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Today</p>
                  <p className="text-2xl font-black text-cyan-400 tracking-tight">
                    0.20<span className="text-sm font-bold">KM</span>
                  </p>
                </div>
                <div className="h-10 mt-3 flex items-end gap-1">
                  {[10, 5, 15, 8, 5, 5, 5, 45, 80, 20, 10, 5].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${h}%` }} 
                      className={`flex-1 rounded-t-sm ${i === 8 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-zinc-700/50'}`} 
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-zinc-500 mt-1">
                  <span>12 AM</span>
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
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
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-600 border-t-zinc-300 animate-spin" />
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
            className="space-y-6 max-w-xl mx-auto"
          >
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {(['For You', 'Explore', 'Plans', 'Library'] as PlusCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPlusCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    plusCategory === cat
                      ? 'bg-white text-black shadow-lg scale-105'
                      : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Workouts Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-black text-white">Workouts</h2>
                <span className="text-xs text-rose-400 font-semibold tracking-wider uppercase">New & Picked</span>
              </div>
              <div className="space-y-4">
                {workouts.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => onStartPractice(w.question)}
                    className="bg-[#18191E] rounded-3xl overflow-hidden border border-zinc-800/80 shadow-xl group cursor-pointer hover:border-zinc-700 transition-all flex flex-col"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img 
                        src={w.image} 
                        alt={w.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black tracking-wider uppercase shadow">
                        {w.badge}
                      </span>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white drop-shadow">{w.title}</h3>
                          <p className="text-xs text-zinc-300">{w.duration} • {w.genre}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-rose-600 transition-colors shadow-lg">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meditations Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-black text-white">Meditations & Focus</h2>
                <span className="text-xs text-cyan-400 font-semibold tracking-wider uppercase">Calm & Mind</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {meditations.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onStartPractice(m.question)}
                    className="bg-[#18191E] rounded-3xl overflow-hidden border border-zinc-800/80 shadow-xl group cursor-pointer hover:border-zinc-700 transition-all"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img 
                        src={m.image} 
                        alt={m.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <h4 className="text-sm font-bold text-white drop-shadow truncate">{m.title}</h4>
                        <p className="text-[10px] text-zinc-300">{m.duration} • {m.genre}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apple Fitness Floating Bottom Navigation Bar */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto bg-[#1C1D22]/95 backdrop-blur-2xl rounded-full px-4 py-2 border border-zinc-800 flex items-center justify-around gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)] max-w-sm w-full">
          <button
            onClick={() => setSubTab('summary')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              subTab === 'summary' ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-6 h-6" />
            <span className="text-[10px] font-bold tracking-tight">Summary</span>
          </button>

          <button
            onClick={() => setSubTab('fitness_plus')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer relative ${
              subTab === 'fitness_plus' ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <Compass className="w-6 h-6" />
            <span className="text-[10px] font-bold tracking-tight">Bytes</span>
          </button>

          <button
            onClick={onOpenMyDay}
            className="flex flex-col items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px] font-bold tracking-tight">sheeko</span>
          </button>

          <button
            onClick={() => onStartPractice()}
            className="flex flex-col items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <Footprints className="w-6 h-6" />
            <span className="text-[10px] font-bold tracking-tight">buddy</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
