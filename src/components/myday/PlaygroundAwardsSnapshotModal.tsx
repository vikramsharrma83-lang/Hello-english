import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trophy,
  Flame,
  MessageSquare,
  Zap,
  Music,
  Calendar,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { getPlaygroundDaySnapshots, DailyPlaygroundSnapshot } from '../../utils/playgroundManager';

interface PlaygroundAwardsSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlayground?: () => void;
}

export const PlaygroundAwardsSnapshotModal: React.FC<PlaygroundAwardsSnapshotModalProps> = ({
  isOpen,
  onClose,
  onOpenPlayground,
}) => {
  const snapshots: DailyPlaygroundSnapshot[] = React.useMemo(() => {
    if (!isOpen) return [];
    try {
      return getPlaygroundDaySnapshots();
    } catch (e) {
      return [];
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="w-full max-w-xl bg-[#0d1117] border border-zinc-800 rounded-2xl p-5 text-zinc-100 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Trophy className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight flex items-center gap-2">
                    <span>Playground Daily Snapshots</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-amber-400">
                      Awards
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Day-wise activity history and completion records
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subtitle / summary info banner */}
            <div className="my-3 px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 text-zinc-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Daily record of completed speech exercises</span>
              </div>
              <span className="text-xs font-semibold text-zinc-400">
                {snapshots.length} Days Recorded
              </span>
            </div>

            {/* Day Snapshots Timeline List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {snapshots.map((snap) => {
                const isFull = snap.completionPercent >= 100;
                return (
                  <div
                    key={snap.id}
                    className={`w-full bg-zinc-900/70 border rounded-xl p-3 sm:p-3.5 transition-colors ${
                      snap.isToday
                        ? 'border-amber-500/40 bg-zinc-900'
                        : isFull
                        ? 'border-emerald-500/30'
                        : 'border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    {/* Single Line Layout for Day Snapshot */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                      {/* Left: Date & Percentage Done */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                          {snap.formattedDate}
                        </span>
                        <span className="text-zinc-600 text-xs">—</span>

                        {/* Percentage Badge */}
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-md border whitespace-nowrap inline-flex items-center gap-1.5 ${
                            isFull
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : snap.completionPercent >= 70
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {isFull && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          {snap.completionPercent}% activity done
                        </span>
                      </div>

                      {/* Right: Activity Icons & Counts in One Single Line */}
                      <div className="flex items-center gap-2 sm:gap-2.5 text-xs text-zinc-300 bg-zinc-950/80 px-2.5 py-1.5 rounded-lg border border-zinc-800 whitespace-nowrap overflow-x-auto">
                        {/* Sheeko */}
                        <div
                          className="flex items-center gap-1 text-amber-400"
                          title={`Sheeko: ${snap.sheekoCount}`}
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span className="font-medium text-zinc-200">
                            Sheeko {snap.sheekoCount}
                          </span>
                        </div>

                        <span className="text-zinc-700">•</span>

                        {/* Buddy */}
                        <div
                          className="flex items-center gap-1 text-blue-400"
                          title={`Buddy: ${snap.buddyCount}`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="font-medium text-zinc-200">
                            Buddy {snap.buddyCount}
                          </span>
                        </div>

                        <span className="text-zinc-700">•</span>

                        {/* Bytes */}
                        <div
                          className="flex items-center gap-1 text-emerald-400"
                          title={`Bytes: ${snap.bytesCount}`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span className="font-medium text-zinc-200">
                            Bytes {snap.bytesCount}
                          </span>
                        </div>

                        <span className="text-zinc-700">•</span>

                        {/* Rock and Roll */}
                        <div
                          className="flex items-center gap-1 text-purple-400"
                          title={`Rock & Roll: ${snap.rockRollCount}`}
                        >
                          <Music className="w-3.5 h-3.5" />
                          <span className="font-medium text-zinc-200">
                            Rock & Roll {snap.rockRollCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer CTA */}
            <div className="pt-3.5 mt-2 border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-zinc-500">
                Completed plans update daily automatically
              </span>

              {onOpenPlayground && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPlayground();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Playground</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

