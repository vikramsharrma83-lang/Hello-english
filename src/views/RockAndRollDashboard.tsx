import React from 'react';
import { RockAndRollSession } from '../types/rockAndRollTypes';
import { Target, Award, BarChart3, CheckCircle2, XCircle, Sparkles, Smile, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface RockAndRollDashboardProps {
  onBack: () => void;
  sessions: RockAndRollSession[];
}

export const RockAndRollDashboard: React.FC<RockAndRollDashboardProps> = ({ onBack, sessions }) => {
  const totalPoints = sessions.reduce((acc, s) => acc + s.score, 0);
  const avgScore = sessions.length > 0 ? Math.round(totalPoints / sessions.length) : 0;
  const completed = sessions.length;
  const happyPercent = sessions.length > 0 ? Math.round((sessions.filter(s => s.customerResponse === 'Happy').length / sessions.length) * 100) : 0;
  const resolvedPercent = sessions.length > 0 ? Math.round((sessions.filter(s => s.isResolved).length / sessions.length) * 100) : 0;
  const avgHandling = sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.situationHandling, 0) / sessions.length) : 0;
  const avgGrammar = sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.englishGrammar, 0) / sessions.length) : 0;

  return (
    <div className="w-full min-h-screen bg-black text-white p-4 pt-8 pb-12 flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/90 border border-zinc-800 rounded-full text-zinc-300 hover:text-white text-xs font-medium cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>{totalPoints} Pts Earned</span>
        </div>
      </div>

      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-white">Performance Overview</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Real-time coaching metrics & communication skill progress</p>
      </div>

      {/* Hero Overview Card */}
      <div className="w-full bg-gradient-to-br from-zinc-900 via-[#12141c] to-zinc-950 border border-white/10 rounded-2xl p-4 mb-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Mastery Score</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black tracking-tight text-white">{completed > 0 ? avgScore : '--'}</span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              {completed === 0 ? 'Complete a scenario to unlock stats' : `${completed} roleplay ${completed === 1 ? 'session' : 'sessions'} analyzed`}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1 text-xs bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{completed > 0 ? `${resolvedPercent}% Resolved` : '0%'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700 text-zinc-300">
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              <span>{completed > 0 ? `${happyPercent}% Happy` : '0%'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {[
          { label: 'Situation Handling', value: completed > 0 ? `${avgHandling}%` : '--', icon: Target, color: 'text-cyan-400', progress: avgHandling },
          { label: 'English & Grammar', value: completed > 0 ? `${avgGrammar}%` : '--', icon: Sparkles, color: 'text-pink-400', progress: avgGrammar },
          { label: 'Roleplay Drills', value: `${completed}`, icon: BarChart3, color: 'text-indigo-400' },
          { label: 'Customer Satisfaction', value: completed > 0 ? `${happyPercent}%` : '--', icon: Smile, color: 'text-amber-400', progress: happyPercent },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/70 border border-white/[0.08] p-3 rounded-xl flex flex-col justify-between backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold line-clamp-1">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-white">{stat.value}</p>
              {stat.progress !== undefined && completed > 0 && (
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500" 
                    style={{ width: `${stat.progress}%` }} 
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sessions List */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm font-bold tracking-tight text-zinc-200">Recent Roleplays</h2>
        {sessions.length > 0 && (
          <span className="text-[11px] text-zinc-500 font-medium">Last {Math.min(3, sessions.length)}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {sessions.length === 0 ? (
          <div className="p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-xl text-center">
            <Target className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400 font-medium">No roleplays recorded yet</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">Start a challenge in Rock & Roll to review your conversational score here</p>
          </div>
        ) : (
          sessions.slice(0, 4).map((session) => (
            <motion.div 
              key={session.id} 
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-zinc-900/60 border border-white/[0.08] rounded-xl flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${session.isResolved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {session.isResolved ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-zinc-200 truncate">{session.situationTitle}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] ${session.isResolved ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {session.isResolved ? 'Resolved' : 'Needs Work'}
                    </span>
                    <span className="text-[10px] text-zinc-600">•</span>
                    <span className="text-[10px] text-zinc-400">{session.customerResponse} Customer</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className="inline-block font-extrabold text-sm text-white px-2 py-0.5 bg-zinc-800/80 border border-zinc-700/60 rounded-lg">
                  {session.score}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
