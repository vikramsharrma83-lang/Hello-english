import React from 'react';
import { RockAndRollSession } from '../types/rockAndRollTypes';
import { Target, Award, BarChart3, CheckCircle2, XCircle } from 'lucide-react';

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
    <div className="w-full min-h-screen bg-[#FDFDFD] text-[#1D1D1F] p-6 pt-16">
      <button onClick={onBack} className="mb-8 flex items-center text-[#0071E3] font-medium cursor-pointer text-sm">
        <span className="mr-1">←</span> Back
      </button>
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Performance Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          { label: 'Total Points', value: totalPoints, icon: Award, color: 'text-amber-500' },
          { label: 'Roleplays', value: completed, icon: Target, color: 'text-blue-500' },
          { label: 'Avg Score', value: `${avgScore}%`, icon: BarChart3, color: 'text-indigo-500' },
          { label: 'Happy %', value: `${happyPercent}%`, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Handling %', value: `${avgHandling}%`, icon: Target, color: 'text-purple-500' },
          { label: 'Grammar %', value: `${avgGrammar}%`, icon: BarChart3, color: 'text-pink-500' },
          { label: 'Resolved %', value: `${resolvedPercent}%`, icon: CheckCircle2, color: 'text-teal-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-zinc-100 flex flex-col justify-between">
            <stat.icon className={`w-6 h-6 mb-3 ${stat.color}`} />
            <div>
              <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-semibold">{stat.label}</p>
              <p className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Performance */}
      <h2 className="text-xl font-bold mb-5 tracking-tight text-zinc-900">Recent Sessions</h2>
      <div className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-zinc-100 overflow-hidden">
        {sessions.length === 0 ? (
          <div className="p-10 text-center text-zinc-400">No sessions recorded yet.</div>
        ) : (
          sessions.slice(0, 3).map((session, i) => (
            <div key={session.id} className={`p-6 flex justify-between items-center ${i !== 2 ? 'border-b border-zinc-50' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${session.isResolved ? 'bg-green-50' : 'bg-red-50'}`}>
                    {session.isResolved ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                </div>
                <div>
                  <p className="font-semibold text-sm">{session.situationTitle}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{session.isResolved ? 'Successfully Resolved' : 'Resolution Failed'}</p>
                </div>
              </div>
              <p className="font-bold text-lg bg-zinc-50 px-4 py-2 rounded-2xl text-zinc-800">{session.score}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
