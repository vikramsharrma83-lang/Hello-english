import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [zoomComplete, setZoomComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Zoom-in finishes after 1800ms
    const timer = setTimeout(() => {
      setZoomComplete(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleTap = () => {
    if (isExiting) return;
    setIsExiting(true);
    // Smooth dissolve exit duration 800ms
    setTimeout(() => {
      onFinish();
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      animate={
        isExiting
          ? { opacity: 0, scale: 1.02, filter: 'blur(8px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleTap}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#FAFAFA] text-black cursor-pointer select-none overflow-hidden px-6 py-16"
    >
      {/* Top spacing / subtle brand mark */}
      <div className="w-full flex justify-center pt-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: zoomComplete ? 0.6 : 0, y: zoomComplete ? 0 : -10 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-400"
          style={{ fontFamily: "'Syncopate', sans-serif" }}
        >
          Cinematic Edition
        </motion.div>
      </div>

      {/* Central Wordmark with Slow Zoom-In Animation */}
      <div className="flex flex-col items-center justify-center my-auto">
        <motion.h1
          initial={{ scale: 0.9, opacity: 0, filter: 'blur(6px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={{
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-center text-black"
          style={{ fontFamily: "'Syncopate', sans-serif" }}
        >
          HELLO ENGLISH
        </motion.h1>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: zoomComplete ? '80px' : '40px', opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="h-[2px] bg-black mt-6"
        />
      </div>

      {/* Bottom Interactive Hint */}
      <div className="w-full flex flex-col items-center pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: zoomComplete ? 1 : 0, y: zoomComplete ? 0 : 10 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center space-y-2"
        >
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-neutral-500 animate-pulse">
            Tap anywhere to continue
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1" />
        </motion.div>
      </div>
    </motion.div>
  );
};
