import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import logoSrc from '../Pics/Hello english logo.png';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number; // 3000ms (3.0s)
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 3000,
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onFinish]);

  return (
    <motion.div
      key="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden select-none"
      onClick={onFinish}
    >
      {/* Choreography: Enters from Left -> Stays in Center & Zooms In -> Exits to Right */}
      <motion.div
        initial={{ x: '-100vw', opacity: 0, scale: 0.9 }}
        animate={{
          x: ['-100vw', '0vw', '0vw', '100vw'],
          opacity: [0, 1, 1, 0],
          scale: [0.9, 1, 1.22, 1.1],
        }}
        transition={{
          duration: 3.0,
          times: [0, 0.25, 0.78, 1.0], // Left entrance (0-25%), Center stay & zoom (25-78%), Right exit (78-100%)
          ease: ['easeOut', 'easeInOut', 'easeIn'],
        }}
        className="relative z-10 flex flex-col items-center justify-center p-4 max-w-[85vw] max-h-[70vh]"
      >
        {!imageError ? (
          <img
            src={logoSrc}
            alt="Hello English Logo"
            onError={() => setImageError(true)}
            className="w-auto h-auto max-w-[280px] sm:max-w-[340px] max-h-[220px] object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#F97316] via-[#EC4899] to-[#8B5CF6] flex items-center justify-center text-white shadow-md mb-3">
              <Sparkles className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Hello <span className="text-[#EC4899]">English</span>
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1">
              Speak Fluent Workplace English
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
