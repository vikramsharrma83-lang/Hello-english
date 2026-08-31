import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const RockAndRollDummyView: React.FC<{ profileName: string; onBack: () => void }> = ({ profileName, onBack }) => {
  return (
    <div className="w-full min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center p-6 relative">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white uppercase tracking-wider font-bold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Profiles
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/80 border border-white/10 rounded-2xl p-8 text-center shadow-2xl flex flex-col items-center"
      >
        <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          {profileName} Section
        </h1>

        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          We are adding relevant scenarios and roleplay content for <span className="text-white font-semibold">{profileName}</span> soon. Check back shortly!
        </p>

        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-colors shadow-lg"
        >
          Return to Profiles
        </button>
      </motion.div>
    </div>
  );
};
