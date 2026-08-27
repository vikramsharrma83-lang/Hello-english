import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow, Mousewheel, Autoplay } from 'swiper/modules';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/effect-coverflow';

import {
  Briefcase,
  Coffee,
  Users,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Dices,
  Zap,
  Play,
  HelpCircle,
  AlertTriangle,
  X,
  ChevronRight,
  Compass,
} from 'lucide-react';
import englishCard1 from '../Pics/english card 1.png';
import englishCard2 from '../Pics/English card 2.png';
import englishCard3 from '../Pics/English card 3.png';
import { CoachNehaAvatar } from '../components/CoachNehaAvatar';
import { Header } from '../components/Header';
import { Question } from '../types';
import { CATEGORIES, PRACTICE_QUESTIONS } from '../data/questions';

interface HomeScreenProps {
  streakDays: number;
  completedToday: number;
  dailyGoal: number;
  onStartPractice: (question?: Question) => void;
  onNavigateTab: (tab: 'home' | 'practice' | 'progress' | 'profile') => void;
}

type PracticeCategoryType = 'workplace' | 'daily_routine' | 'friends';

const CAROUSEL_BANNERS = [
  {
    id: 'workplace' as PracticeCategoryType,
    title: 'Workplace English',
    badge: 'Office & Warehouse',
    image: englishCard1,
    alt: 'Workplace English Practice Banner',
  },
  {
    id: 'daily_routine' as PracticeCategoryType,
    title: 'Daily Routine English',
    badge: 'Travel & Daily Life',
    image: englishCard2,
    alt: 'Daily Routine English Practice Banner',
  },
  {
    id: 'friends' as PracticeCategoryType,
    title: 'Friends Conversation',
    badge: 'Friendly & Casual',
    image: englishCard3,
    alt: 'Friends Conversation English Practice Banner',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  streakDays,
  completedToday,
  dailyGoal,
  onStartPractice,
  onNavigateTab,
}) => {
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<PracticeCategoryType | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

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
          hindiTitle: 'कार्यस्थल की बातचीत',
          subtitle: 'Warehouse, shift duties, manager updates & logistics',
          icon: <Briefcase className="w-5 h-5 text-[#7E22CE]" />,
          badgeColor: 'bg-[#F3E8FF] text-[#6B21A8] border-[#D8B4FE]',
          accentColor: '#7C3AED',
          level1Examples: '“What is the time?”, “Where is the parcel?”, “Is packing done?”',
          level2Examples: '“Where were you yesterday?”, “Why late for shift?”, “Shift handover duties”',
          level3Examples: '“What will you do if parcel is torn?”, “Two supervisors give urgent tasks?”',
        };
      case 'daily_routine':
        return {
          title: 'Daily Routine English',
          hindiTitle: 'दैनिक जीवन और यात्रा',
          subtitle: 'Commute, bus timing, tea stalls, doctor & delivery orders',
          icon: <Coffee className="w-5 h-5 text-[#BE123C]" />,
          badgeColor: 'bg-[#FFE4E6] text-[#9F1239] border-[#FDA4AF]',
          accentColor: '#E11D48',
          level1Examples: '“Are you coming today?”, “Where are you going?”, “How much for tea?”',
          level2Examples: '“Send exact delivery address”, “How much total bill?”, “Doctor appointment”',
          level3Examples: '“Angry delayed customer in rain”, “Wrong medicine delivered”, “Lost wallet in metro”',
        };
      case 'friends':
        return {
          title: 'Friends Conversation',
          hindiTitle: 'दोस्तों से दोस्ताना बातचीत',
          subtitle: 'Weekend cricket, tea catch-up, advice & real social situations',
          icon: <Users className="w-5 h-5 text-[#0F766E]" />,
          badgeColor: 'bg-[#CCFBF1] text-[#115E59] border-[#5EEAD4]',
          accentColor: '#0D9488',
          level1Examples: '“How are you doing?”, “What is your name?”, “Did you have lunch?”',
          level2Examples: '“Weekend cricket match plans”, “Movie recommendation”, “Smartphone advice”',
          level3Examples: '“Friend asking for money loan”, “Missed wedding apology”, “Risky business offer”',
        };
    }
  };

  const activeCategoryMeta = selectedCategoryModal ? getCategoryDetails(selectedCategoryModal) : null;
  const l1Count = selectedCategoryModal ? PRACTICE_QUESTIONS.filter((q) => q.category === selectedCategoryModal && q.level === 'Level 1').length : 0;
  const l2Count = selectedCategoryModal ? PRACTICE_QUESTIONS.filter((q) => q.category === selectedCategoryModal && q.level === 'Level 2').length : 0;
  const l3Count = selectedCategoryModal ? PRACTICE_QUESTIONS.filter((q) => q.category === selectedCategoryModal && q.level === 'Level 3').length : 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#FDF4FF] via-[#F8F7FF] to-[#FFF1F5] text-slate-900 pb-28 pt-2 px-4 sm:px-5">
      {/* Top Header */}
      <Header streakDays={streakDays} onOpenProfile={() => onNavigateTab('profile')} />

      {/* Main Greeting */}
      <div className="mt-4 mb-4">
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-snug">
          Hi! Ready to practice English?
        </h1>
      </div>

      {/* MAIN HERO CARD: Coach Neha */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="mt-2 relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#FFFBEB] via-[#FFF1F2] to-[#FDF2F8] border border-[#FED7AA] pastel-card-shadow overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#EC4899]/20 via-[#8B5CF6]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#F59E0B]/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Coach Neha
              </h2>
              <p className="text-sm font-bold text-[#9A3412] mt-0.5">
                Let's practice together.
              </p>
            </div>

            <div className="relative">
              <CoachNehaAvatar size="lg" showBadge />
            </div>
          </div>

          <p className="text-xs sm:text-[13px] font-medium text-[#7C2D12] mt-3 leading-relaxed max-w-[90%]">
            Speak without fear. Coach Neha understands your intent and helps you speak fluent workplace English.
          </p>

          {/* Large Rounded CTA Button (Picks a random question) */}
          <button
            onClick={handleAnyRandomPractice}
            className="mt-5 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F97316] via-[#EC4899] to-[#8B5CF6] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#EC4899]/30 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Dices className="w-4 h-4 stroke-[2.5]" />
            <span>Start Practice (Random Question)</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </motion.div>

      {/* 3D COVERFLOW CAROUSEL (Swiper.js with dynamic scaling depth & capsule side cards) */}
      <div className="coverflow-carousel-container mt-5">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Practice Topics
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#7C3AED]">
              {activeSlideIndex + 1} of {CAROUSEL_BANNERS.length}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#7C3AED]">
            Tap Active Card for 3 Levels
          </span>
        </div>

        {/* Swiper 3D Coverflow Container with Auto-Rotation every 2 seconds */}
        <Swiper
          modules={[EffectCoverflow, Mousewheel, Autoplay]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          initialSlide={0}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={600}
          coverflowEffect={{
            rotate: 0,
            stretch: -14,
            depth: 160,
            modifier: 1.3,
            slideShadows: false,
            scale: 0.84,
          }}
          mousewheel={{ forceToAxis: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveSlideIndex(swiper.realIndex);
          }}
          className="w-full"
        >
          {CAROUSEL_BANNERS.map((banner, index) => {
            const isCenterActive = activeSlideIndex === index;
            return (
              <SwiperSlide
                key={banner.id}
                className="swiper-slide cursor-grab active:cursor-grabbing"
                onClick={() => {
                  if (isCenterActive) {
                    setSelectedCategoryModal(banner.id);
                  } else {
                    swiperRef.current?.slideToLoop(index);
                  }
                }}
              >
                <div className="w-full relative overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    draggable={false}
                    className="w-full h-auto object-cover block select-none pointer-events-none"
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Clean Custom Navigation Buttons beneath the carousel */}
        <div className="flex items-center justify-center gap-2 mt-2.5">
          {CAROUSEL_BANNERS.map((banner, index) => {
            const isActive = activeSlideIndex === index;
            return (
              <button
                key={banner.id}
                onClick={() => {
                  swiperRef.current?.slideTo(index);
                }}
                aria-label={`Go to slide ${index + 1} - ${banner.title}`}
                className={`transition-all duration-300 rounded-full cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white px-3.5 py-1 text-[11px] font-extrabold shadow-sm shadow-[#7C3AED]/30 scale-105'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/90 px-2.5 py-1 text-[10px] font-bold shadow-2xs'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                <span>{banner.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Practice Target Bar */}
      <div className="mt-5 rounded-2xl bg-white/95 border border-[#E9D5FF] p-3.5 pastel-card-shadow flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFF1F2] to-[#FFEDD5] flex items-center justify-center text-[#EA580C] border border-[#FDBA74]">
            <Flame className="w-5 h-5 fill-[#EA580C]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-900">
                Today's Goal: {completedToday}/{dailyGoal} questions
              </span>
              {completedToday >= dailyGoal && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
              )}
            </div>
            <p className="text-[10px] font-medium text-slate-500">
              Practice 3 mins daily to build natural English confidence
            </p>
          </div>
        </div>

        <div className="w-12 text-right">
          <span className="text-xs font-black text-[#7C3AED]">
            {Math.round((completedToday / dailyGoal) * 100)}%
          </span>
        </div>
      </div>

      {/* EXPLORE ALL SCENARIOS PREVIEW LIST */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#7C3AED]" />
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase">
              Featured Practice Prompts
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#7C3AED]">
            {PRACTICE_QUESTIONS.length} Questions
          </span>
        </div>

        <div className="space-y-2.5">
          {PRACTICE_QUESTIONS.slice(0, 4).map((item) => (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => onStartPractice(item)}
              className="w-full rounded-2xl p-3.5 bg-white border border-[#E9D5FF] pastel-card-shadow hover:border-[#C084FC] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#7E22CE]">
                    {item.categoryLabel}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">
                    {item.level}
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] font-bold text-slate-900 truncate">
                  {item.questionEn}
                </p>
                <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                  {item.questionHi}
                </p>
              </div>

              <div className="w-7 h-7 rounded-full bg-[#FAF5FF] group-hover:bg-[#7C3AED] group-hover:text-white text-[#7C3AED] flex items-center justify-center transition-colors shrink-0">
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* QUICK SURPRISE PRACTICE BANNER */}
      <div className="mt-5 rounded-3xl p-5 bg-gradient-to-r from-[#7C3AED] via-[#DB2777] to-[#EA580C] text-white shadow-xl shadow-[#DB2777]/25 relative overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200">
              🎲 SURPRISE QUESTION CHALLENGE
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
              Ready for a Random Question?
            </h3>
            <p className="text-xs text-white/90 font-medium mt-1">
              Coach Neha will give you a surprise question across any category and level.
            </p>
          </div>

          <button
            onClick={handleAnyRandomPractice}
            className="w-12 h-12 rounded-2xl bg-white text-[#7C3AED] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer"
            title="Start Random Question"
          >
            <Play className="w-6 h-6 fill-[#7C3AED]" />
          </button>
        </div>
      </div>

      {/* MODAL / BOTTOM SHEET: 3 LEVELS INSIDE THE SELECTED CATEGORY CARD */}
      <AnimatePresence>
        {selectedCategoryModal && activeCategoryMeta && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 120 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 120 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="w-full max-w-[440px] max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-200 flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {activeCategoryMeta.icon}
                  </div>
                  <div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${activeCategoryMeta.badgeColor}`}>
                      {activeCategoryMeta.title}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                      Choose Practice Level
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {activeCategoryMeta.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCategoryModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Switcher Tabs inside the dialog */}
              <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar">
                {(['workplace', 'daily_routine', 'friends'] as PracticeCategoryType[]).map((catKey) => {
                  const isCur = selectedCategoryModal === catKey;
                  const catLabel = catKey === 'workplace' ? '🏢 Workplace' : catKey === 'daily_routine' ? '☕ Daily Routine' : '👥 Friends';
                  return (
                    <button
                      key={catKey}
                      onClick={() => setSelectedCategoryModal(catKey)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isCur
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {catLabel}
                    </button>
                  );
                })}
              </div>

              {/* 3 LEVELS FOR THIS SPECIFIC CATEGORY */}
              <div className="space-y-3 mt-1">
                {/* LEVEL 1: Short Words */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartCategoryLevel(selectedCategoryModal, 'Level 1')}
                  className="w-full rounded-2xl p-4 bg-gradient-to-br from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0] border-2 border-[#86EFAC] cursor-pointer shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase">
                          Level 1 • Easy
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800">
                          {l1Count} Questions Available
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-emerald-950">
                        Short Words Questions (2–4 Words)
                      </h4>
                      <p className="text-[11px] font-medium text-emerald-900 mt-1 leading-relaxed">
                        Examples: <span className="font-semibold">{activeCategoryMeta.level1Examples}</span>
                      </p>

                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-emerald-800 text-[11px] font-bold shadow-2xs border border-emerald-300">
                        <Play className="w-3 h-3 fill-emerald-700 text-emerald-700" />
                        <span>Practice Random Level 1 Question</span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-white/95 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                      <Zap className="w-4 h-4 fill-emerald-600" />
                    </div>
                  </div>
                </motion.div>

                {/* LEVEL 2: Little More Words / Sentences */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartCategoryLevel(selectedCategoryModal, 'Level 2')}
                  className="w-full rounded-2xl p-4 bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE] border-2 border-[#93C5FD] cursor-pointer shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase">
                          Level 2 • Medium
                        </span>
                        <span className="text-[10px] font-bold text-blue-800">
                          {l2Count} Questions Available
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-blue-950">
                        Sentence Building (More Words)
                      </h4>
                      <p className="text-[11px] font-medium text-blue-900 mt-1 leading-relaxed">
                        Examples: <span className="font-semibold">{activeCategoryMeta.level2Examples}</span>
                      </p>

                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-blue-800 text-[11px] font-bold shadow-2xs border border-blue-300">
                        <Play className="w-3 h-3 fill-blue-700 text-blue-700" />
                        <span>Practice Random Level 2 Question</span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-white/95 border border-blue-300 flex items-center justify-center text-blue-700 shrink-0">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </motion.div>

                {/* LEVEL 3: Hard - Real Scenarios & Decisions */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartCategoryLevel(selectedCategoryModal, 'Level 3')}
                  className="w-full rounded-2xl p-4 bg-gradient-to-br from-[#FFF1F2] via-[#FFE4E6] to-[#FECDD3] border-2 border-[#FDA4AF] cursor-pointer shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase">
                          Level 3 • Hard
                        </span>
                        <span className="text-[10px] font-bold text-rose-800">
                          {l3Count} Scenarios Available
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-rose-950">
                        Hard • Real Scenarios & Decisions
                      </h4>
                      <p className="text-[11px] font-medium text-rose-900 mt-1 leading-relaxed">
                        “What will you do if this happens?”: <span className="font-semibold">{activeCategoryMeta.level3Examples}</span>
                      </p>

                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-rose-800 text-[11px] font-bold shadow-2xs border border-rose-300">
                        <Play className="w-3 h-3 fill-rose-700 text-rose-700" />
                        <span>Practice Random Level 3 Scenario</span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-white/95 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Quick Random for this Category button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleRandomInCategory(selectedCategoryModal)}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                >
                  <Dices className="w-4 h-4 text-amber-400" />
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


