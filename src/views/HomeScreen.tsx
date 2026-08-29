import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow, Mousewheel } from 'swiper/modules';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/effect-coverflow';

import {
  Briefcase,
  Coffee,
  Users,
  Zap,
  Play,
  HelpCircle,
  AlertTriangle,
  X,
  Info,
  Layers,
  Gift,
} from 'lucide-react';
import englishCard1 from '../Pics/english card 1.png';
import englishCard2 from '../Pics/English card 2.png';
import englishCard3 from '../Pics/English card 3.png';
import { Question } from '../types';
import { PRACTICE_QUESTIONS } from '../data/questions';

interface HomeScreenProps {
  streakDays: number;
  completedToday: number;
  dailyGoal: number;
  onStartPractice: (question?: Question) => void;
  onNavigateTab: (tab: 'home' | 'myday' | 'practice' | 'progress' | 'profile') => void;
}

export type PracticeCategoryType = 'workplace' | 'daily_routine' | 'friends';

interface CarouselItem {
  id: PracticeCategoryType;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  image: string;
  alt: string;
  accentColor: string;
}

const CAROUSEL_BANNERS: CarouselItem[] = [
  {
    id: 'workplace',
    title: 'Workplace English',
    subtitle: 'Master shift handovers, manager updates, warehouse operations & team chats.',
    tagline: 'Office & Logistics Track',
    badge: '🏢 Workplace',
    image: englishCard1,
    alt: 'Workplace English Practice Banner',
    accentColor: '#A855F7',
  },
  {
    id: 'daily_routine',
    title: 'Daily Routine English',
    subtitle: 'Communicate smoothly during daily travel, commute, shopping & doctor visits.',
    tagline: 'Commute & Daily Life Track',
    badge: '☕ Daily Life',
    image: englishCard2,
    alt: 'Daily Routine English Practice Banner',
    accentColor: '#F43F5E',
  },
  {
    id: 'friends',
    title: 'Friends Conversation',
    subtitle: 'Build natural, friendly English for weekend catch-ups, advice & social circles.',
    tagline: 'Casual & Social Track',
    badge: '👥 Friends',
    image: englishCard3,
    alt: 'Friends Conversation English Practice Banner',
    accentColor: '#14B8A6',
  },
];

// Duplicate items to ensure a seamless 360-degree infinite continuous loop in Swiper
const LOOP_CAROUSEL_ITEMS = [...CAROUSEL_BANNERS, ...CAROUSEL_BANNERS];

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

  const currentBanner = CAROUSEL_BANNERS[activeSlideIndex] || CAROUSEL_BANNERS[0];

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
    <div className="w-full min-h-screen bg-black text-white pb-24 pt-3 px-4 sm:px-6 flex flex-col justify-between select-none">
      {/* Top Section: 30% Enlarged Continuous 360 Loop Coverflow Banner */}
      <div className="w-full flex-1 flex flex-col justify-center my-auto">
        <div className="coverflow-carousel-container">
          <Swiper
            modules={[EffectCoverflow, Mousewheel]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView="auto"
            initialSlide={0}
            speed={420}
            coverflowEffect={{
              rotate: 0,
              stretch: 8,
              depth: 75,
              modifier: 1,
              slideShadows: false,
              scale: 0.88,
            }}
            mousewheel={{ forceToAxis: true }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              const realIndex = swiper.realIndex % CAROUSEL_BANNERS.length;
              setActiveSlideIndex(realIndex);
            }}
            className="w-full"
          >
            {LOOP_CAROUSEL_ITEMS.map((banner, index) => {
              const baseIndex = index % CAROUSEL_BANNERS.length;
              const isCenterActive = activeSlideIndex === baseIndex;
              return (
                <SwiperSlide
                  key={`${banner.id}-${index}`}
                  className="swiper-slide cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => {
                    if (isCenterActive) {
                      setSelectedCategoryModal(banner.id);
                    } else {
                      swiperRef.current?.slideToLoop(baseIndex);
                    }
                  }}
                >
                  <div className="w-full relative overflow-hidden group">
                    <img
                      src={banner.image}
                      alt={banner.alt}
                      draggable={false}
                      className="w-full h-auto object-cover block select-none pointer-events-none"
                    />

                    {/* Subtle Overlay Hint on Active Slide */}
                    {isCenterActive && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                        <Layers className="w-2.5 h-2.5" />
                        <span>3 Lvls</span>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Minimal Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {CAROUSEL_BANNERS.map((banner, index) => {
              const isActive = activeSlideIndex === index;
              return (
                <button
                  key={banner.id}
                  onClick={() => swiperRef.current?.slideToLoop(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive
                      ? 'w-5 h-1 bg-white shadow-xs'
                      : 'w-1 h-1 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Extreme Bottom Section: Good Morning Text + Start Tab Just Above Bottom Bar Menu */}
      <div className="mt-auto pt-2 flex flex-col items-center text-center">
        <h1 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight leading-tight">
          {getGreeting()}
        </h1>

        <p className="text-xs sm:text-[13px] font-normal text-zinc-400 mt-1 max-w-[88%] leading-relaxed">
          If you want to speak fluent English, you can start your practice with Coach Neha here.
        </p>

        {/* Learn More / Choose Level Link */}
        <button
          onClick={() => setSelectedCategoryModal(currentBanner.id)}
          className="mt-2.5 inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#F59E0B] hover:text-[#FBBF24] transition-colors cursor-pointer group"
        >
          <div className="w-4 h-4 rounded-full bg-[#F59E0B] text-black flex items-center justify-center font-bold text-[10px] group-hover:scale-105 transition-transform">
            <Info className="w-3 h-3 stroke-[2.5]" />
          </div>
          <span>Learn more about {currentBanner.title} Levels</span>
        </button>

        {/* Start Tab Button at extreme bottom */}
        <div className="w-full mt-3.5 flex justify-center">
          <button
            onClick={() => handleRandomInCategory(currentBanner.id)}
            className="w-full max-w-[250px] py-2.5 px-6 rounded-full bg-[#2C2C2E] hover:bg-[#3A3A3C] active:bg-[#1C1C1E] text-white font-semibold text-sm sm:text-[15px] flex items-center justify-center gap-1.5 shadow-md shadow-black/60 active:scale-[0.98] transition-all cursor-pointer border border-zinc-700/50"
          >
            <Play className="w-3.5 h-3.5 fill-white stroke-none" />
            <span>Start</span>
          </button>
        </div>
      </div>

      {/* MODAL / BOTTOM SHEET: 3 LEVELS INSIDE THE SELECTED CATEGORY CARD (HIGH-TECH GLOWING NEON THEME MATCHING REFERENCE PIC) */}
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
                    <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-current fill-none stroke-[1.7]" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" className="stroke-cyan-400" />
                      <path d="M12 3a14.5 14.5 0 0 0 0 18M12 3a14.5 14.5 0 0 1 0 18M3 12h18" className="stroke-purple-400" />
                      <path d="M16 10h4v8h-4zM18 10V8a2 2 0 0 0-2-2h-1" className="stroke-cyan-300" />
                    </svg>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                    Choose Practice Level
                  </h3>
                  <p className="text-xs text-zinc-400 font-normal mt-1 leading-snug">
                    {activeCategoryMeta.subtitle}
                  </p>
                </div>
              </div>

              {/* Category Switcher Tabs Container */}
              <div className="flex items-center justify-between p-1 bg-[#1A1D26] rounded-2xl border border-white/5 mb-4.5">
                {(['workplace', 'daily_routine', 'friends'] as PracticeCategoryType[]).map((catKey) => {
                  const isCur = selectedCategoryModal === catKey;
                  const catLabel = catKey === 'workplace' ? 'Workplace' : catKey === 'daily_routine' ? 'Daily Routine' : 'Friends';
                  const catIcon = catKey === 'workplace' ? <Briefcase className="w-3.5 h-3.5" /> : catKey === 'daily_routine' ? <Coffee className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />;
                  return (
                    <button
                      key={catKey}
                      onClick={() => setSelectedCategoryModal(catKey)}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
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
                {/* LEVEL 1: Words (Easy) - Emerald Theme */}
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
                        Words
                      </h4>
                      <p className="text-xs text-zinc-400 font-medium mt-0.5">
                        Easy
                      </p>
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

                {/* LEVEL 2: Sentence (Medium) - Electric Blue Theme */}
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
                      <p className="text-xs text-zinc-400 font-medium mt-0.5">
                        Medium
                      </p>
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

                {/* LEVEL 3: Scenarios (Hard) - Ruby / Red Theme */}
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
                      <p className="text-xs text-zinc-400 font-medium mt-0.5">
                        Hard
                      </p>
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
