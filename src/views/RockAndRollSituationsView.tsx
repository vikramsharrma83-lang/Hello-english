import React from 'react';

export const RockAndRollSituationsView: React.FC<{ theme: any, onBack: () => void, onSelectChallenge: (challenge: any) => void }> = ({ theme, onBack, onSelectChallenge }) => {
  return (
    <div className="w-full min-h-screen bg-black text-white p-6 pt-16">
      <button onClick={onBack} className="mb-6 p-2 bg-zinc-800 rounded-full cursor-pointer">← Back to Themes</button>
      <h1 className="text-3xl font-bold mb-8">{theme.theme} Situations</h1>
      <div className="flex flex-col gap-4">
        {theme.challenges.map((c: any) => (
          <div key={c.id} className="p-4 rounded-3xl border border-white/10 bg-zinc-900 cursor-pointer" onClick={() => onSelectChallenge(c)}>
            <h3 className="text-lg font-bold">{c.title}</h3>
            <p className="text-sm text-white/70">{c.shortDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
