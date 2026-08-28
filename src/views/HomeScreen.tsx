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
  Dices,
  Zap,
  Play,
  HelpCircle,
  AlertTriangle,
  X,
  Info,
  Layers,
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
  onNavigateTab: (tab: 'home' | 'practice' | 'progress' | 'profile') => void;
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
  const l1Count = selectedCategoryModal ? PRACTICE_QUESTIONS.filter((q) => q.category === selectedCategoryModal && q.level === 'Level 1').length : 0;
  const l2Count = selectedCategoryModal ? PRACTICE_QUESTIONS.filter((q) => q.category === selectedCategoryModal && q.level === 'Level 2').length : 0;
  const l3Count = selectedCategoryModal ? PRACTICE_QUESTIONS.filter((q) => q.category === selectedCategoryModal && q.level === 'Level 3').length : 0;

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

      {/* MODAL / BOTTOM SHEET: 3 LEVELS INSIDE THE SELECTED CATEGORY CARD (PURE BLACK THEME) */}
      <AnimatePresence>
        {selectedCategoryModal && activeCategoryMeta && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 120 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 120 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="w-full max-w-[440px] max-h-[90vh] overflow-y-auto bg-[#18181B] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-zinc-800 flex flex-col text-white"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center shrink-0 shadow-2xs">
                    {activeCategoryMeta.icon}
                  </div>
                  <div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${activeCategoryMeta.badgeColor}`}>
                      {activeCategoryMeta.title}
                    </span>
                    <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
                      Choose Practice Level
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">
                      {activeCategoryMeta.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCategoryModal(null)}
                  className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
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
                          ? 'bg-white text-black shadow-xs'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
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
                  className="w-full rounded-2xl p-4 bg-zinc-900/90 border border-emerald-900/80 hover:border-emerald-500/80 cursor-pointer shadow-xs transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase">
                          Level 1 • Easy
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400">
                          {l1Count} Questions Available
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white">
                        Short Words Questions (2–4 Words)
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 shadow-2xs flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400">
                        <Zap className="w-4 h-4 fill-emerald-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* LEVEL 2: Little More Words / Sentences */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartCategoryLevel(selectedCategoryModal, 'Level 2')}
                  className="w-full rounded-2xl p-4 bg-zinc-900/90 border border-blue-900/80 hover:border-blue-500/80 cursor-pointer shadow-xs transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase">
                          Level 2 • Medium
                        </span>
                        <span className="text-[10px] font-bold text-blue-400">
                          {l2Count} Questions Available
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white">
                        Sentence Building (More Words)
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-700 text-blue-300 shadow-2xs flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-blue-400">
                        <HelpCircle className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* LEVEL 3: Hard - Real Scenarios & Decisions */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartCategoryLevel(selectedCategoryModal, 'Level 3')}
                  className="w-full rounded-2xl p-4 bg-zinc-900/90 border border-rose-900/80 hover:border-rose-500/80 cursor-pointer shadow-xs transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase">
                          Level 3 • Hard
                        </span>
                        <span className="text-[10px] font-bold text-rose-400">
                          {l3Count} Scenarios Available
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white">
                        Hard • Real Scenarios & Decisions
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-8 h-8 rounded-xl bg-rose-950 border border-rose-700 text-rose-300 shadow-2xs flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-rose-400">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Quick Random for this Category button */}
              <div className="mt-4 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => handleRandomInCategory(selectedCategoryModal)}
                  className="w-full py-3 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border border-zinc-700"
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
