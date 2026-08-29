import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow, Mousewheel, Autoplay } from 'swiper/modules';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

import {
  Briefcase,
  Coffee,
  Users,
  BookOpen,
  Zap,
  Play,
  HelpCircle,
  AlertTriangle,
  X,
  Info,
  Layers,
  Gift,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
} from 'lucide-react';
import englishCard1 from '../Pics/english card 1.png';
import englishCard2 from '../Pics/English card 2.png';
import englishCard3 from '../Pics/English card 3.png';
import { SheekoCardGraphic } from '../components/SheekoCardGraphic';
import { Question, UserProgress } from '../types';
import { PRACTICE_QUESTIONS } from '../data/questions';
import { calculateEnglishConfidence } from '../utils/confidenceEngine';

interface HomeScreenProps {
  progress?: UserProgress;
  streakDays: number;
  completedToday: number;
  dailyGoal: number;
  onStartPractice: (question?: Question) => void;
  onNavigateTab: (tab: 'home' | 'myday' | 'practice' | 'progress' | 'profile' | 'challenge') => void;
  onOpenChallenge: () => void;
}

export type PracticeCategoryType = 'workplace' | 'daily_routine' | 'friends' | 'sheeko';

interface WordCardItem {
  id: string;
  englishWord: string;
  hindi: string;
  kannada: string;
  tamil: string;
  bengali: string;
  telugu: string;
  category: string;
}

const MULTI_LANG_WORDS: WordCardItem[] = [
  {
    id: 'w1',
    englishWord: 'Shift',
    hindi: 'शिफ्ट (पाली)',
    kannada: 'ಶಿಫ್ಟ್',
    tamil: 'ஷிப்ட்',
    bengali: 'শিফট',
    telugu: 'షిఫ్ట్',
    category: 'Workplace',
  },
  {
    id: 'w2',
    englishWord: 'Overtime',
    hindi: 'ओवरटाइम (अतिरिक्त समय)',
    kannada: 'ಓವರ್‌ಟೈಮ್',
    tamil: 'ஓவர்டைம்',
    bengali: 'ওভারটাইম',
    telugu: 'ఓవర్‌టైమ్',
    category: 'Workplace',
  },
  {
    id: 'w3',
    englishWord: 'Supervisor',
    hindi: 'सुपरवाइज़र (प्रभारी)',
    kannada: 'ಮೇಲ್ವಿಚಾರಕ',
    tamil: 'மேற்பார்வையாளர்',
    bengali: 'সুপারভাইজার',
    telugu: 'సూపర్‌వైజర్',
    category: 'Management',
  },
  {
    id: 'w4',
    englishWord: 'Inventory',
    hindi: 'माल सूची (स्टॉक)',
    kannada: 'ದಾಸ್ತಾನು',
    tamil: 'சரக்கு பட்டியல்',
    bengali: 'ইনভেন্টরি',
    telugu: 'జాబితా',
    category: 'Operations',
  },
  {
    id: 'w5',
    englishWord: 'Delivery',
    hindi: 'डिलीवरी (पहुंचाना)',
    kannada: 'ವಿತರಣೆ',
    tamil: 'டெலிவரி',
    bengali: 'ডেলিভারি',
    telugu: 'డెలివరీ',
    category: 'Logistics',
  },
  {
    id: 'w6',
    englishWord: 'Receipt',
    hindi: 'रसीद (बिल)',
    kannada: 'ರಶೀದಿ',
    tamil: 'ரசீது',
    bengali: 'রসিদ',
    telugu: 'రశీదు',
    category: 'Billing',
  },
  {
    id: 'w7',
    englishWord: 'Schedule',
    hindi: 'समय-सारणी (सूची)',
    kannada: 'ವೇಳಾಪಟ್ಟಿ',
    tamil: 'அட்டவணை',
    bengali: 'সময়সূচী',
    telugu: 'షెడ్యూల్',
    category: 'Planning',
  },
  {
    id: 'w8',
    englishWord: 'Break Time',
    hindi: 'आराम का समय (ब्रेक)',
    kannada: 'ವಿರಾಮ ಸಮಯ',
    tamil: 'ஓய்வு நேரம்',
    bengali: 'বিরতির সময়',
    telugu: 'విరామ సమయం',
    category: 'Daily Life',
  },
];

// Duplicate items to ensure a seamless 360-degree infinite continuous loop in Swiper
const LOOP_WORD_ITEMS = [...MULTI_LANG_WORDS, ...MULTI_LANG_WORDS];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  streakDays,
  completedToday,
  dailyGoal,
  onStartPractice,
  onNavigateTab,
  onOpenChallenge,
}) => {
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<PracticeCategoryType | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const currentWord = MULTI_LANG_WORDS[activeSlideIndex] || MULTI_LANG_WORDS[0];

  // Calculate live English confidence & level
  const userProg = progress || {
    streakDays,
    completedToday,
    dailyGoal,
    totalPracticed: 18,
    totalMinutes: 24,
    targetRole: 'Staff',
    savedPhrases: [],
    history: [],
  };
  const confidenceAssessment = calculateEnglishConfidence(userProg);

  // Helper to start practice for a specific category and level
  const handleStartCategoryLevel = (category: PracticeCategoryType, level: 'Level 1' | 'Level 2' | 'Level 3') => {
    const matching = PRACTICE_QUESTIONS.filter((q) => q.category === category && q.level === level);
    const pool = matching.length > 0 ? matching : PRACTICE_QUESTIONS.filter((q) => q.category === category);
    const randomQ = pool[Math.floor(Math.random() * pool.length)] || PRACTICE_QUESTIONS[0];
    setSelectedCategoryModal(null);
    onStartPractice(randomQ);
  };

  // Helper to pick any random question within a category
  const handleRandomInCategory = (category: PracticeCategoryType) => {
    const pool = PRACTICE_QUESTIONS.filter((q) => q.category === category);
    const randomQ = pool[Math.floor(Math.random() * pool.length)] || PRACTICE_QUESTIONS[0];
    setSelectedCategoryModal(null);
    onStartPractice(randomQ);
  };

  // Universal random question picker across all categories
  const handleAnyRandomPractice = () => {
    const randomQ = PRACTICE_QUESTIONS[Math.floor(Math.random() * PRACTICE_QUESTIONS.length)] || PRACTICE_QUESTIONS[0];
    onStartPractice(randomQ);
  };

  // Category specific details helper
  const getCategoryDetails = (cat: PracticeCategoryType) => {
    switch (cat) {
      case 'workplace':
        return {
          title: 'Workplace English',
          subtitle: 'Warehouse, shift duties, manager updates & logistics',
          icon: <Briefcase className="w-5 h-5 text-purple-400" />,
          badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800',
          accentColor: '#A855F7',
        };
      case 'daily_routine':
        return {
          title: 'Daily Routine English',
          subtitle: 'Commute, bus timing, tea stalls, doctor & delivery orders',
          icon: <Coffee className="w-5 h-5 text-rose-400" />,
          badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800',
          accentColor: '#F43F5E',
        };
      case 'friends':
        return {
          title: 'Friends Conversation',
          subtitle: 'Weekend cricket, tea catch-up, advice & real social situations',
          icon: <Users className="w-5 h-5 text-teal-400" />,
          badgeColor: 'bg-teal-950/80 text-teal-300 border-teal-800',
          accentColor: '#14B8A6',
        };
      case 'sheeko':
        return {
          title: 'My Day (Stories)',
          subtitle: 'Daily stories, life experiences, anecdotes & day events',
          icon: <BookOpen className="w-5 h-5 text-amber-400" />,
          badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
          accentColor: '#F59E0B',
        };
    }
  };

  const activeCategoryMeta = selectedCategoryModal ? getCategoryDetails(selectedCategoryModal) : null;

  // Get dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="w-full min-h-screen bg-black text-white pb-24 pt-1 px-3.5 sm:px-6 flex flex-col justify-between select-none">
      {/* Top Section: 360-degree coverflow carousel of English words with Hindi, Kannada, Tamil, Bengali, Telugu in black & grey shades */}
      <div className="w-full flex-shrink-0 pt-1">
        <div className="coverflow-carousel-container">
          <Swiper
            modules={[EffectCoverflow, Mousewheel, Autoplay]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView="auto"
            initialSlide={0}
            speed={400}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 16,
              depth: 95,
              modifier: 1,
              slideShadows: false,
              scale: 0.85,
            }}
            mousewheel={{ forceToAxis: true }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              const realIndex = swiper.realIndex % MULTI_LANG_WORDS.length;
              setActiveSlideIndex(realIndex);
            }}
            className="w-full py-4"
          >
            {LOOP_WORD_ITEMS.map((item, index) => {
              const baseIndex = index % MULTI_LANG_WORDS.length;
              const isCenterActive = activeSlideIndex === baseIndex;
              return (
                <SwiperSlide
                  key={`${item.id}-${index}`}
                  className="swiper-slide w-[350px] sm:w-[390px] cursor-pointer"
                  onClick={() => {
                    swiperRef.current?.slideToLoop(baseIndex);
                  }}
                >
                  <div className={`w-full rounded-2xl p-7 sm:p-8 min-h-[240px] sm:min-h-[260px] bg-gradient-to-br from-[#1c1c20] via-[#0d0d10] to-black border-0 transition-all duration-300 flex flex-col justify-center items-center text-center ${isCenterActive ? 'scale-[1.22] shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-20 opacity-100' : 'scale-90 opacity-45'}`}>
                    <div className="py-2 mb-2">
                      <h3 className="text-3xl sm:text-4xl font-black text-zinc-400 tracking-tight">
                        {item.englishWord}
                      </h3>
                    </div>

                    <div className="w-full mt-3 pt-3 border-t border-zinc-800/40 space-y-2 text-xs">
                      <div className="text-zinc-400 font-bold tracking-wide">{item.hindi}</div>
                      <div className="text-zinc-500 font-medium">{item.kannada}</div>
                      <div className="text-zinc-500 font-medium">{item.tamil}</div>
                      <div className="text-zinc-500 font-medium">{item.bengali}</div>
                      <div className="text-zinc-500 font-medium">{item.telugu}</div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Minimal Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {MULTI_LANG_WORDS.map((item, index) => {
              const isActive = activeSlideIndex === index;
              return (
                <button
                  key={item.id}
                  onClick={() => swiperRef.current?.slideToLoop(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive
                      ? 'w-5 h-1 bg-zinc-300 shadow-xs'
                      : 'w-1 h-1 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* CONFIDENCE & ENGLISH LEVEL CARD (UNDER THE BANNER) - Moved a little up */}
      <div className="w-full -mt-2 mb-1.5 bg-[#14161F] rounded-xl p-2.5 border border-white/10 shadow-md relative overflow-hidden scale-[0.95] origin-top">
        {/* Glow accent */}
        <div
          className={`absolute -top-10 -right-10 w-20 h-20 rounded-full blur-xl pointer-events-none opacity-30 ${
            confidenceAssessment.statusColor === 'green'
              ? 'bg-emerald-500'
              : confidenceAssessment.statusColor === 'amber'
              ? 'bg-amber-500'
              : 'bg-rose-500'
          }`}
        />

        {/* Top Header of Card: Level & Score */}
        <div className="relative z-10 flex items-center justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${confidenceAssessment.colorClasses.bg} ${confidenceAssessment.colorClasses.border} border`}>
              <TrendingUp className={`w-3 h-3 ${confidenceAssessment.colorClasses.text}`} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-black text-white tracking-tight">
                  English Level
                </span>
                <span className={`text-[9px] font-black px-1 py-0.1 rounded ${confidenceAssessment.colorClasses.bg} ${confidenceAssessment.colorClasses.text} border ${confidenceAssessment.colorClasses.border}`}>
                  {confidenceAssessment.cefrLevel}
                </span>
              </div>
              <span className="text-[10px] font-bold text-zinc-300 block leading-none mt-0.5">
                {confidenceAssessment.levelTitle}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${confidenceAssessment.colorClasses.dot} animate-pulse`} />
              <span className={`text-sm font-black ${confidenceAssessment.colorClasses.text}`}>
                {confidenceAssessment.overallScore}%
              </span>
            </div>
            <span className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-400">
              Confidence
            </span>
          </div>
        </div>

        {/* Composite Progress Bar */}
        <div className="relative z-10 w-full h-1.5 bg-black/60 rounded-full overflow-hidden mb-1.5 p-0.5 border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidenceAssessment.overallScore}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`h-full rounded-full ${confidenceAssessment.colorClasses.progress}`}
          />
        </div>

        {/* 4 Micro Metrics (Activities, Spoken Accuracy, Answers, Effort) */}
        <div className="relative z-10 grid grid-cols-4 gap-1 pt-0.5 text-center">
          <div className="p-1 rounded-lg bg-white/[0.03] border border-white/5">
            <span className="text-[7.5px] font-bold uppercase text-zinc-400 block">Activities</span>
            <span className="text-[10px] font-black text-white">{confidenceAssessment.metrics.activitiesScore}%</span>
          </div>
          <div className="p-1 rounded-lg bg-white/[0.03] border border-white/5">
            <span className="text-[7.5px] font-bold uppercase text-zinc-400 block">Spoken</span>
            <span className="text-[10px] font-black text-white">{confidenceAssessment.metrics.spokenAccuracy}%</span>
          </div>
          <div className="p-1 rounded-lg bg-white/[0.03] border border-white/5">
            <span className="text-[7.5px] font-bold uppercase text-zinc-400 block">Answers</span>
            <span className="text-[10px] font-black text-white">{confidenceAssessment.metrics.answersAccuracy}%</span>
          </div>
          <div className="p-1 rounded-lg bg-white/[0.03] border border-white/5">
            <span className="text-[7.5px] font-bold uppercase text-zinc-400 block">Effort</span>
            <span className="text-[10px] font-black text-white">{confidenceAssessment.metrics.effortScore}%</span>
          </div>
        </div>

        {/* Spoken Hindi Feedback Tip */}
        <div className="relative z-10 mt-1.5 pt-1.5 border-t border-white/5 flex items-center gap-1 text-[10px] text-zinc-300">
          <Sparkles className={`w-3 h-3 shrink-0 ${confidenceAssessment.colorClasses.text}`} />
          <span className="truncate">{confidenceAssessment.hindiInsight}</span>
        </div>
      </div>



      {/* MODAL / BOTTOM SHEET: 3 LEVELS INSIDE THE SELECTED CATEGORY CARD */}
      <AnimatePresence>
        {selectedCategoryModal && activeCategoryMeta && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="w-full max-w-[440px] max-h-[92vh] overflow-y-auto bg-[#111319] rounded-[28px] p-5 sm:p-6 shadow-2xl border border-white/10 flex flex-col text-white relative select-none"
            >
              {/* Top Row: Category Badge & Close Button */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#3B1954]/90 border border-[#7C3AED]/50 text-[#D8B4FE] text-xs font-bold shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                  <span>{activeCategoryMeta.title}</span>
                </div>

                <button
                  onClick={() => setSelectedCategoryModal(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Header Title with Neon Globe/Building Icon */}
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-950/80 to-purple-950/80 border border-cyan-500/40 p-2.5 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(6,182,212,0.25)] relative overflow-hidden">
                  <div className="relative w-full h-full flex items-center justify-center text-cyan-400">
                    {selectedCategoryModal === 'sheeko' ? (
                      <BookOpen className="w-7 h-7 text-amber-400" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-current fill-none stroke-[1.7]" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" className="stroke-cyan-400" />
                        <path d="M12 3a14.5 14.5 0 0 0 0 18M12 3a14.5 14.5 0 0 1 0 18M3 12h18" className="stroke-purple-400" />
                        <path d="M16 10h4v8h-4zM18 10V8a2 2 0 0 0-2-2h-1" className="stroke-cyan-300" />
                      </svg>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                    Choose Practice Level
                  </h3>
                </div>
              </div>

              {/* Category Switcher Tabs Container */}
              <div className="flex items-center justify-between p-1 bg-[#1A1D26] rounded-2xl border border-white/5 mb-4.5 gap-1 overflow-x-auto">
                {(['workplace', 'daily_routine', 'friends', 'sheeko'] as PracticeCategoryType[]).map((catKey) => {
                  const isCur = selectedCategoryModal === catKey;
                  const catLabel = catKey === 'workplace' ? 'Workplace' : catKey === 'daily_routine' ? 'Daily Routine' : catKey === 'friends' ? 'Friends' : 'My Day';
                  const catIcon = catKey === 'workplace' ? <Briefcase className="w-3.5 h-3.5" /> : catKey === 'daily_routine' ? <Coffee className="w-3.5 h-3.5" /> : catKey === 'friends' ? <Users className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />;
                  return (
                    <button
                      key={catKey}
                      onClick={() => setSelectedCategoryModal(catKey)}
                      className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                        isCur
                          ? 'bg-[#2E3342] text-white shadow-md border border-white/10'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {catIcon}
                      <span>{catLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* 3 HIGH-TECH LEVEL CARDS */}
              <div className="space-y-3">
                {/* LEVEL 1: Words & Phrases - Emerald Theme */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartCategoryLevel(selectedCategoryModal, 'Level 1')}
                  className="w-full rounded-2xl p-4 bg-[#0c1815]/90 border border-emerald-500/70 hover:border-emerald-400 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.12)] transition-all relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left Graphic: Words & Lightbulb Constellation */}
                    <div className="w-14 h-14 rounded-xl bg-emerald-950/60 border border-emerald-800/40 shrink-0 flex flex-col items-center justify-center relative p-1">
                      <div className="flex items-center justify-center gap-1 text-[7px] text-emerald-400 font-bold leading-none">
                        <span>dynam</span>
                        <span>small</span>
                      </div>
                      <div className="my-0.5 text-amber-300">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-amber-300 stroke-amber-400 stroke-1">
                          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
                        </svg>
                      </div>
                      <div className="text-[7px] text-emerald-400 font-bold leading-none">
                        words
                      </div>
                    </div>

                    {/* Center Text */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block mb-0.5">
                        LEVEL 1
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                        Words & Phrases
                      </h4>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/60 text-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-105">
                        <Play className="w-4 h-4 fill-emerald-400 stroke-none ml-0.5" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-950/70 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                        <Zap className="w-4 h-4 fill-emerald-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* LEVEL 2: Sentence - Electric Blue Theme */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartCategoryLevel(selectedCategoryModal, 'Level 2')}
                  className="w-full rounded-2xl p-4 bg-[#0c1628]/90 border border-blue-500/70 hover:border-blue-400 cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.12)] transition-all relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left Graphic: Node Tree / Flowchart Diagram */}
                    <div className="w-14 h-14 rounded-xl bg-blue-950/60 border border-blue-800/40 shrink-0 flex items-center justify-center p-1.5">
                      <svg viewBox="0 0 48 48" className="w-9 h-9 stroke-blue-400 fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round">
                        {/* Top Node */}
                        <rect x="14" y="6" width="20" height="10" rx="3" className="fill-blue-600/40 stroke-blue-400" />
                        {/* Connector lines */}
                        <path d="M24 16v8M10 24h28M10 24v6M24 24v6M38 24v6" className="stroke-blue-400" />
                        {/* Bottom 3 Nodes */}
                        <rect x="4" y="30" width="12" height="10" rx="2" className="fill-blue-900/60 stroke-blue-400" />
                        <rect x="18" y="30" width="12" height="10" rx="2" className="fill-blue-900/60 stroke-blue-400" />
                        <rect x="32" y="30" width="12" height="10" rx="2" className="fill-blue-900/60 stroke-blue-400" />
                      </svg>
                    </div>

                    {/* Center Text */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider block mb-0.5">
                        LEVEL 2
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                        Sentence
                      </h4>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/60 text-blue-400 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-transform group-hover:scale-105">
                        <Play className="w-4 h-4 fill-blue-400 stroke-none ml-0.5" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-950/70 border border-blue-800/60 flex items-center justify-center text-blue-400">
                        <HelpCircle className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* LEVEL 3: Scenarios - Ruby / Red Theme */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartCategoryLevel(selectedCategoryModal, 'Level 3')}
                  className="w-full rounded-2xl p-4 bg-[#1f1015]/90 border border-rose-500/70 hover:border-rose-400 cursor-pointer shadow-[0_0_20px_rgba(244,63,94,0.12)] transition-all relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left Graphic: Scenarios / Decision Logic Chart */}
                    <div className="w-14 h-14 rounded-xl bg-rose-950/60 border border-rose-800/40 shrink-0 flex items-center justify-center p-1.5">
                      <svg viewBox="0 0 48 48" className="w-9 h-9 stroke-rose-400 fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round">
                        {/* Top left check */}
                        <rect x="4" y="6" width="10" height="10" rx="2" className="fill-emerald-800/50 stroke-emerald-400" />
                        <path d="M6 11l2 2 4-4" className="stroke-emerald-300 stroke-2" />
                        {/* Top right check */}
                        <rect x="34" y="6" width="10" height="10" rx="2" className="fill-emerald-800/50 stroke-emerald-400" />
                        <path d="M36 11l2 2 4-4" className="stroke-emerald-300 stroke-2" />
                        {/* Center Warning */}
                        <path d="M24 16l8 14H16z" className="fill-amber-600/40 stroke-amber-400" />
                        <path d="M24 22v3M24 28h.01" className="stroke-amber-300 stroke-2" />
                        {/* Bottom left X */}
                        <rect x="4" y="32" width="10" height="10" rx="2" className="fill-rose-900/60 stroke-rose-400" />
                        <path d="M7 35l4 4M11 35l-4 4" className="stroke-rose-300 stroke-2" />
                        {/* Bottom right ? */}
                        <rect x="34" y="32" width="10" height="10" rx="2" className="fill-rose-900/60 stroke-rose-400" />
                        <path d="M37 35a2 2 0 0 1 3 1c0 1-1.5 1.5-1.5 2M38.5 40h.01" className="stroke-rose-300 stroke-2" />
                      </svg>
                    </div>

                    {/* Center Text */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider block mb-0.5">
                        LEVEL 3
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                        Scenarios
                      </h4>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/60 text-rose-400 flex items-center justify-center shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-transform group-hover:scale-105">
                        <Play className="w-4 h-4 fill-rose-400 stroke-none ml-0.5" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-rose-950/70 border border-rose-800/60 flex items-center justify-center text-rose-400">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Glowing Surprise Question Button */}
              <div className="mt-4 pt-1">
                <button
                  onClick={() => handleRandomInCategory(selectedCategoryModal)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 hover:from-amber-500/20 hover:to-amber-500/20 border border-amber-400/50 hover:border-amber-300 text-amber-200 hover:text-amber-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-[0_0_18px_rgba(245,158,11,0.18)] transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                    <Gift className="w-3.5 h-3.5" />
                  </div>
                  <span>Surprise Question in {activeCategoryMeta.title}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
