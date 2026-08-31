import React from 'react';

export const RockAndRollSummaryView: React.FC<{ challenge: any, onBack: () => void }> = ({ challenge, onBack }) => {
  // Mock data for the summary metrics based on the request
  const score = 82;
  const metrics = [
    { label: 'Situation Handling', value: '85%' },
    { label: 'English & Grammar', value: '78%' },
    { label: 'Resolution', value: 'Resolved' },
    { label: 'Customer Response', value: 'Happy' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#090d16] text-white p-6 pt-16 flex flex-col items-center">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-center text-zinc-400 mb-8 tracking-wide uppercase">Overall Result</h1>
        
        <div className="text-center mb-10">
          <span className="text-7xl font-bold text-white">{score}</span>
          <span className="text-2xl text-zinc-600"> / 100</span>
        </div>

        <div className="bg-zinc-900/60 rounded-3xl p-6 border border-zinc-800 mb-8 space-y-4">
          {metrics.map((m, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0 last:pb-0">
              <span className="text-zinc-400">{m.label}</span>
              <span className="font-semibold text-white">{m.value}</span>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <h2 className="text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wide">Conversation Summary</h2>
          <p className="text-zinc-300 leading-relaxed">
            You handled the customer's request professionally, showing empathy and clear communication. 
            The situation was resolved successfully, leaving the customer satisfied.
          </p>
        </div>

        <button 
          onClick={onBack} 
          className="w-full bg-white text-black font-bold py-4 px-6 rounded-2xl cursor-pointer hover:bg-zinc-200 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};
