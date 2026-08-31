import React from 'react';
import { Award, CheckCircle2, MessageSquare, Sparkles, Smile, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const RockAndRollSummaryView: React.FC<{ challenge: any; summary?: any; onBack: () => void }> = ({ challenge, summary, onBack }) => {
  const score = summary?.score || 82;
  const situationHandling = summary?.situationHandling || 85;
  const englishGrammar = summary?.englishGrammar || 78;
  const isResolved = summary?.isResolved ?? true;
  const customerResponse = summary?.customerResponse || 'Happy';

  const metrics = [
    { label: 'Situation Handling', value: `${situationHandling}%`, progress: situationHandling, icon: ShieldCheck, color: 'text-cyan-400', barGradient: 'from-cyan-500 to-blue-500' },
    { label: 'English & Grammar', value: `${englishGrammar}%`, progress: englishGrammar, icon: Sparkles, color: 'text-purple-400', barGradient: 'from-purple-500 to-pink-500' },
    { label: 'Resolution Status', value: isResolved ? 'Resolved' : 'Pending', isBadge: true, icon: CheckCircle2, color: isResolved ? 'text-emerald-400' : 'text-amber-400', badgeBg: isResolved ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
    { label: 'Customer Sentiment', value: customerResponse, isBadge: true, icon: Smile, color: 'text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  ];

  return (
    <div className="w-full min-h-screen bg-black text-white p-4 pt-8 pb-12 flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col">
        {/* Top Tag */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Session Debrief
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold">
            {challenge?.title || 'Roleplay Challenge'}
          </span>
        </div>

        {/* Hero Score Ring / Glass Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-gradient-to-b from-[#14151f] via-[#0e1017] to-zinc-950 border border-white/10 rounded-2xl p-5 mb-4 shadow-2xl relative overflow-hidden text-center flex flex-col items-center"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
            <Award className="w-5 h-5" />
          </div>

          <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Overall Result</p>
          
          <div className="flex items-baseline justify-center gap-1 my-1">
            <span className="text-5xl font-black text-white tracking-tight">{score}</span>
            <span className="text-lg font-bold text-zinc-500">/ 100</span>
          </div>

          <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            Passed • Great Handling
          </span>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {metrics.map((m, i) => (
            <div key={i} className="bg-zinc-900/70 border border-white/[0.08] p-3 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider line-clamp-1">{m.label}</span>
                <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
              </div>

              {m.isBadge ? (
                <div className="mt-1">
                  <span className={`inline-block px-2 py-0.5 rounded-md border text-[11px] font-bold ${m.badgeBg}`}>
                    {m.value}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-lg font-extrabold text-white">{m.value}</span>
                  <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${m.barGradient} rounded-full`} style={{ width: `${m.progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Conversation Summary Card */}
        <div className="bg-zinc-900/60 border border-white/[0.08] rounded-xl p-3.5 mb-5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <h2 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Coach Summary</h2>
          </div>
          <p className="text-zinc-300 leading-relaxed text-xs">
            You handled the situation professionally, de-escalating customer hesitation with empathy and clear phrasing. The core issue was resolved efficiently.
          </p>
        </div>

        {/* Apple Submerged Home Button */}
        <div className="w-full flex flex-col items-center justify-center pt-2 pb-1">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onBack}
            aria-label="Home"
            className="group relative w-16 h-16 rounded-full bg-[#0a0b0e] border border-white/[0.07] shadow-[inset_0_4px_10px_rgba(0,0,0,0.95),0_1px_1px_rgba(255,255,255,0.06)] flex items-center justify-center cursor-pointer transition-all duration-150"
          >
            {/* Inner Submerged Dark Grey Button Disc */}
            <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-b from-[#24262c] via-[#1a1b20] to-[#131417] border border-[#2f323a]/70 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.12),inset_0_-2px_5px_rgba(0,0,0,0.85),0_3px_8px_rgba(0,0,0,0.7)] flex items-center justify-center group-hover:brightness-110 group-active:brightness-90 group-active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] transition-all">
              {/* Iconic Apple Home Rounded Square Symbol */}
              <div className="w-4 h-4 rounded-[4px] border-[1.5px] border-zinc-400/60 shadow-[0_1px_1px_rgba(0,0,0,0.8)] group-hover:border-zinc-300 transition-colors" />
            </div>
          </motion.button>
          <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase mt-2.5">
            Tap Home to Finish
          </span>
        </div>
      </div>
    </div>
  );
};
