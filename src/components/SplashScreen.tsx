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
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white overflow-hidden select-none cursor-pointer"
      onClick={onFinish}
    >
      {/* Ambient subtle backlight glow */}
      <div className="absolute w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      {/* Choreography: Enters from Left -> Rests at Center -> Zooms in to Max -> Settles Back -> Exits to Right (3s) */}
      <motion.div
        initial={{ x: '-100vw', opacity: 0, scale: 0.8 }}
        animate={{
          x: ['-100vw', '0vw', '0vw', '0vw', '100vw'],
          scale: [0.8, 1.0, 1.5, 1.0, 0.85],
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{
          duration: 3.0,
          times: [0, 0.22, 0.52, 0.74, 1.0], // 0s: start left, 0.66s: rest center, 1.56s: zoom max, 2.22s: settle back, 3.0s: exit right
          ease: ['easeOut', 'easeInOut', 'easeInOut', 'easeIn'],
        }}
        className="relative z-10 flex flex-col items-center justify-center p-4 max-w-[85vw] max-h-[70vh]"
      >
        {!imageError ? (
          <img
            src={logoSrc}
            alt="Hello English Logo"
            onError={() => setImageError(true)}
            className="w-auto h-auto max-w-[280px] sm:max-w-[340px] max-h-[220px] object-contain brightness-0 invert drop-shadow-[0_0_24px_rgba(255,255,255,0.4)]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center text-center p-6 text-white">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-3">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              Hello English
            </h1>
            <p className="text-xs font-semibold text-zinc-300 tracking-wider uppercase mt-1">
              Workplace English
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

