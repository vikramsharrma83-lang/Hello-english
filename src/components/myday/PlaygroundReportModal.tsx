import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Layers,
  Flame,
  MessageSquare,
  Music,
  Zap,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { getPlaygroundData, getSheekoJourney, PlaygroundPlan } from '../../utils/playgroundManager';

interface PlaygroundReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlayground?: () => void;
}

export const PlaygroundReportModal: React.FC<PlaygroundReportModalProps> = ({
  isOpen,
  onClose,
  onOpenPlayground,
}) => {
  if (!isOpen) return null;

  const plan: PlaygroundPlan = getPlaygroundData();
  const journey = getSheekoJourney();
  const currentDay = journey ? journey.currentDay : 1;
  const journeyLength = journey ? journey.journeyLength : 3;
  const journeyPercent = Math.min(
    100,
    Math.round((currentDay / journeyLength) * 100)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-sm bg-[#171513] border border-amber-500/25 rounded-3xl p-5 text-stone-100 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-100 tracking-tight">
                  Playground Daily Progress
                </h3>
                <p className="text-[10.5px] text-stone-400 font-medium">
                  Consolidated plan & activity report
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-900 border border-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="py-3.5 space-y-2.5">
            {/* Start My Day Status */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-stone-200">Start My Day Drills</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  plan.isStartMyDayDrillCompleted
                    ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                    : 'bg-stone-800 border-stone-700 text-stone-400'
                }`}
              >
                {plan.isStartMyDayDrillCompleted ? 'Completed ✓' : 'Pending'}
              </span>
            </div>

            {/* Sheeko Journey Progress */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-stone-200">Sheeko Journey</span>
                </div>
                <span className="text-[11px] font-bold text-amber-300">
                  Day {currentDay} of {journeyLength} ({journeyPercent}%)
                </span>
              </div>
              <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden">
                <div
                  style={{ width: `${journeyPercent}%` }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
            </div>

            {/* 3 Activity Metrics Grid in Warm Tones */}
            <div className="grid grid-cols-3 gap-2">
              {/* Buddy */}
              <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-2.5 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-[10px] font-bold text-stone-300 uppercase">Buddy</span>
                </div>
                <div className="text-base font-black text-amber-300 leading-tight">
                  {plan.buddyCompletedCount || 0}
                  <span className="text-xs text-stone-500 font-normal"> / {plan.buddyTargetCount || 2}</span>
                </div>
                <span className="text-[9px] text-stone-400 mt-0.5">sessions</span>
              </div>

              {/* Rock & Roll */}
              <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-2.5 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Music className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-bold text-stone-300 uppercase">R&R</span>
                </div>
                <div className="text-base font-black text-amber-400 leading-tight">
                  {plan.rockRollCompletedCount || 0}
                  <span className="text-xs text-stone-500 font-normal"> / {plan.rockRollTargetCount || 1}</span>
                </div>
                <span className="text-[9px] text-stone-400 mt-0.5">scenarios</span>
              </div>

              {/* Bytes */}
              <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-2.5 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-[10px] font-bold text-stone-300 uppercase">Bytes</span>
                </div>
                <div className="text-base font-black text-amber-300 leading-tight">
                  {plan.bytesCompletedCount || 0}
                  <span className="text-xs text-stone-500 font-normal"> / {plan.bytesTargetCount || 3}</span>
                </div>
                <span className="text-[9px] text-stone-400 mt-0.5">snippets</span>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-2 border-t border-stone-800/80">
            {onOpenPlayground && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPlayground();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Consolidated Plan</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
