import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  gradient: string;
}

const CHALLENGES: Challenge[] = [
  { id: '1', title: 'Wild Card Story', description: '5 words. One story. Make it work.', points: 30, gradient: 'from-purple-900 to-indigo-900' },
  { id: '2', title: 'Describe It', description: 'Make them see exactly what you see.', points: 20, gradient: 'from-red-900 to-orange-900' },
  { id: '3', title: 'Get to the Point', description: 'Make your point. Say it once. Under 30 seconds.', points: 15, gradient: 'from-blue-900 to-cyan-900' },
  { id: '4', title: 'Convince Me', description: 'Pitch it. Defend it. Win them over.', points: 25, gradient: 'from-green-900 to-emerald-900' },
  { id: '5', title: 'Don\'t Choke', description: 'We start it. You finish it. No hesitation.', points: 20, gradient: 'from-amber-900 to-orange-900' },
];

export const ChallengeListScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="w-full min-h-screen bg-black text-white p-6 flex flex-col">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Challenges</h1>
      </header>

      <div className="flex-1 space-y-4">
        {CHALLENGES.map((challenge) => (
          <motion.div
            key={challenge.id}
            whileHover={{ scale: 1.02 }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${challenge.gradient} border border-white/10 shadow-lg`}
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold">{challenge.title}</h2>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+{challenge.points} Points</span>
            </div>
            <p className="text-xs text-white/70 mb-4">{challenge.description}</p>
            <button className="w-full py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              Start Challenge
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
