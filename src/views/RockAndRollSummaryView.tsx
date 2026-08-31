import React from 'react';
import { Award, CheckCircle2, MessageSquare, Sparkles, Smile, ShieldCheck, ArrowRight, Target } from 'lucide-react';
import { motion } from 'motion/react';

export const RockAndRollSummaryView: React.FC<{ challenge: any; summary?: any; onBack: () => void }> = ({ challenge, summary, onBack }) => {
  const score = summary?.score || 82;
  const situationName = summary?.situationName || challenge?.title || 'Workplace Roleplay Situation';
  const howIHandledIt = summary?.howIHandledIt || {
    communication: 'Good',
    speaking: 'Good',
    confidence: 'Getting Better',
    situationHandling: 'Good'
  };
  const iDidWell = summary?.iDidWell || [
    "Maintained a professional and empathetic tone throughout the customer dispute.",
    "Quickly acknowledged the customer's core concern and urgency."
  ];
  const practiceNext = summary?.practiceNext || [
    "Avoid unnecessary pauses when gathering customer verification details.",
    "Use more direct and confident timeframe commitments."
  ];
  const myNaturalEnglish = summary?.myNaturalEnglish || [
    { learnerSaid: "I will check room right now sir.", betterEnglish: "I will check the room right away, sir.", explanation: "Add article 'the' and use 'right away'." },
    { learnerSaid: "Don't worry I make it fix.", betterEnglish: "Don't worry, I will get this fixed right away.", explanation: "Use future tense 'will get this fixed'." }
  ];
  const nextTimeGoal = summary?.nextTimeGoal || "State the exact expected resolution timeframe clearly within the first 30 seconds.";

  return (
    <div className="w-full min-h-screen bg-black text-white p-4 pt-8 pb-12 flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col space-y-4">
        {/* Top Tag */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Rock & Roll Debrief
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold">
            {score} / 100 Score
          </span>
        </div>

        {/* Situation Card */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-3.5">
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Situation</span>
          <h2 className="text-xs font-bold text-white mt-0.5">{situationName}</h2>
        </div>

        {/* How I Handled It Card */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-3.5 space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">How I Handled It</span>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400">Communication</span>
              <span className="text-xs font-extrabold text-emerald-400 mt-1">{howIHandledIt.communication}</span>
            </div>
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400">Speaking</span>
              <span className="text-xs font-extrabold text-cyan-400 mt-1">{howIHandledIt.speaking}</span>
            </div>
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400">Confidence</span>
              <span className="text-xs font-extrabold text-amber-400 mt-1">{howIHandledIt.confidence}</span>
            </div>
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400">Situation Handling</span>
              <span className="text-xs font-extrabold text-purple-400 mt-1">{howIHandledIt.situationHandling}</span>
            </div>
          </div>
        </div>

        {/* I Did Well */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">I Did Well</span>
          </div>
          <ul className="space-y-1.5">
            {iDidWell.map((item: string, idx: number) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Practice Next */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Practice Next</span>
          </div>
          <ul className="space-y-1.5">
            {practiceNext.map((item: string, idx: number) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* My Natural English */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-3.5 space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">My Natural English</span>
          <div className="space-y-2">
            {myNaturalEnglish.map((ex: any, idx: number) => (
              <div key={idx} className="bg-black/40 p-2.5 rounded-lg border border-white/5 space-y-1 text-xs">
                <div className="text-rose-300 font-medium">You said: &ldquo;{ex.learnerSaid}&rdquo;</div>
                <div className="text-emerald-300 font-semibold flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  <span>{ex.betterEnglish}</span>
                </div>
                <div className="text-[11px] text-zinc-400 italic">{ex.explanation}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Time Goal */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Next Time</span>
          </div>
          <p className="text-xs text-zinc-200 font-medium">{nextTimeGoal}</p>
        </div>

        {/* Apple Submerged Home Button */}
        <div className="w-full flex flex-col items-center justify-center pt-2 pb-1">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onBack}
            aria-label="Home"
            className="group relative w-16 h-16 rounded-full bg-[#0a0b0e] border border-white/[0.07] shadow-[inset_0_4px_10px_rgba(0,0,0,0.95),0_1px_1px_rgba(255,255,255,0.06)] flex items-center justify-center cursor-pointer transition-all duration-150"
          >
            <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-b from-[#24262c] via-[#1a1b20] to-[#131417] border border-[#2f323a]/70 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.12),inset_0_-2px_5px_rgba(0,0,0,0.85),0_3px_8px_rgba(0,0,0,0.7)] flex items-center justify-center group-hover:brightness-110 group-active:brightness-90 group-active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] transition-all">
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

