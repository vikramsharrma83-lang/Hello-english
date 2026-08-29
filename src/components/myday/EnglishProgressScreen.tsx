import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  X,
  Sparkles,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Flame,
  Zap,
  Info,
  ShieldCheck,
} from 'lucide-react';
import {
  calculateEnglishConfidence,
  EnglishConfidenceSummary,
  ConfidenceMetric,
} from '../../utils/confidenceMetrics';
import { ConversationTurn, PracticeHistoryItem, DayMap } from '../../types';

interface EnglishProgressScreenProps {
  isOpen: boolean;
  onClose: () => void;
  turns?: ConversationTurn[];
  practiceHistory?: PracticeHistoryItem[];
  dayMap?: DayMap;
}

export const EnglishProgressScreen: React.FC<EnglishProgressScreenProps> = ({
  isOpen,
  onClose,
  turns = [],
  practiceHistory = [],
  dayMap,
}) => {
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);

  if (!isOpen) return null;

  const confidenceData: EnglishConfidenceSummary = calculateEnglishConfidence(
    turns,
    practiceHistory,
    dayMap
  );

  // SVG Pie Chart Generator for the 7 weighted metrics
  const radius = 54;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Compute slice offsets for 7 metrics based on their weights
  let cumulativeWeight = 0;
  const pieSlices = confidenceData.metrics.map((metric) => {
    const startAngle = (cumulativeWeight / 100) * 360;
    const sliceAngle = (metric.weight / 100) * 360;
    cumulativeWeight += metric.weight;

    const strokeDasharray = `${(metric.weight / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((startAngle / 360) * circumference);

    return {
      ...metric,
      startAngle,
      sliceAngle,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal / Full Screen Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg min-h-screen sm:min-h-[auto] sm:max-h-[92vh] bg-[#0c0d12] border-0 sm:border border-zinc-800 sm:rounded-[36px] p-5 sm:p-6 overflow-y-auto flex flex-col text-white shadow-2xl z-10 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5 sticky top-0 bg-[#0c0d12]/90 backdrop-blur-md z-20">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer py-1 px-2 -ml-2 rounded-xl hover:bg-zinc-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to My Day</span>
            </button>

            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <Sparkles className="w-3 h-3" />
              <span>English Progress</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Score Hero Card with Pie Chart */}
          <div className="bg-gradient-to-br from-[#161720] via-[#111218] to-[#0d0e14] border border-zinc-800/90 rounded-3xl p-5 mb-5 relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Interactive 7-Metric Weighted Pie Chart */}
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background Track */}
                  <circle
                    cx="60"
                    cy="60"
                    r={normalizedRadius}
                    fill="transparent"
                    stroke="#1f2029"
                    strokeWidth={strokeWidth}
                  />

                  {/* 7 Weighted Slices */}
                  {pieSlices.map((slice) => (
                    <circle
                      key={slice.id}
                      cx="60"
                      cy="60"
                      r={normalizedRadius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-500 hover:opacity-80"
                    />
                  ))}
                </svg>

                {/* Center Score Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-3xl font-black text-white tracking-tight">
                    {confidenceData.overallScore}%
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-sky-400 -mt-0.5">
                    Confidence
                  </span>
                </div>
              </div>

              {/* Text Summary Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-extrabold tracking-wide mb-1.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>Overall Fluency Index</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  English Confidence: {confidenceData.overallScore}%
                </h2>

                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Evaluated across all 7 core linguistic dimensions using your active spoken and written English during My Day.
                </p>

                {/* 3 Main Highlights */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 justify-center sm:justify-start">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300">
                    Grammar {confidenceData.cardIndicators.grammar}%
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-300">
                    Communication {confidenceData.cardIndicators.communication}%
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-300">
                    Vocabulary {confidenceData.cardIndicators.vocabulary}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Strongest & Weakest Area Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {/* Strongest Area */}
            <div className="bg-emerald-950/25 border border-emerald-800/40 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  Strongest Area
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white">
                {confidenceData.strongestArea.name} ({confidenceData.strongestArea.score}%)
              </h4>
              <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                {confidenceData.strongestArea.explanation}
              </p>
            </div>

            {/* Weakest Area (Focus Area) */}
            <div className="bg-amber-950/25 border border-amber-800/40 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  Key Growth Focus
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white">
                {confidenceData.weakestArea.name} ({confidenceData.weakestArea.score}%)
              </h4>
              <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                {confidenceData.weakestArea.explanation}
              </p>
            </div>
          </div>

          {/* All 7 Metrics Detailed Breakdown */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
                <span>All 7 Weighted Dimensions</span>
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">Total Weight: 100%</span>
            </div>

            <div className="space-y-2.5">
              {confidenceData.metrics.map((metric) => {
                const isSelected = selectedMetricId === metric.id;
                return (
                  <div
                    key={metric.id}
                    onClick={() => setSelectedMetricId(isSelected ? null : metric.id)}
                    className={`p-3.5 rounded-2xl bg-[#14151c] border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-500/80 bg-[#191a24] shadow-lg shadow-sky-500/10'
                        : 'border-zinc-800/70 hover:border-zinc-700 hover:bg-[#181922]'
                    }`}
                  >
                    {/* Top Row: Name, Weight & Score */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: metric.color }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {metric.name}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              ({metric.weight}% weight)
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400 block -mt-0.5">
                            {metric.hindiName}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className="text-sm sm:text-base font-black"
                          style={{ color: metric.color }}
                        >
                          {metric.score}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2 rounded-full bg-zinc-800/80 overflow-hidden mt-2.5">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${metric.score}%`,
                          backgroundColor: metric.color,
                        }}
                      />
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                      {metric.description}
                    </p>

                    {/* Expanded Diagnostic Details */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-2.5 border-t border-zinc-800/80 space-y-2 text-xs"
                      >
                        <div className="bg-black/40 rounded-xl p-2.5 border border-white/5">
                          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-0.5">
                            Coach Observation:
                          </span>
                          <p className="text-zinc-300 text-[11px] leading-snug">
                            {metric.learnerObservation}
                          </p>
                        </div>

                        <div className="bg-amber-950/20 rounded-xl p-2.5 border border-amber-800/30">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                            Quick Practice Tip:
                          </span>
                          <p className="text-amber-200/90 text-[11px] leading-snug">
                            {metric.actionableTip}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence-Based Evaluation Policy Note */}
          <div className="mt-auto p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-2.5 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-bold block mb-0.5">
                100% Production-Driven Calculation
              </span>
              <p className="text-[11px] leading-relaxed text-zinc-400">
                {confidenceData.evidenceBasedNote}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
