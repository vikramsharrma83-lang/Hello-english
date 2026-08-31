import React from 'react';
import pikku from '../data/rockandrole/pikku.json';
import chakkar from '../data/rockandrole/chakkar.json';
import jaldi from '../data/rockandrole/jaldi.json';
import mehmaan from '../data/rockandrole/mehmaan.json';
import hisab from '../data/rockandrole/hisab.json';
import kyaHua from '../data/rockandrole/kyaHua.json';
import vip from '../data/rockandrole/vip.json';
import { BarChart3 } from 'lucide-react';

interface ThemeCardProps {
  theme: any;
  gradientClass: string;
  onSelect: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, gradientClass, onSelect }) => (
  <div className={`p-4 rounded-3xl border border-white/10 ${gradientClass} bg-opacity-20 flex flex-col gap-2 cursor-pointer`} onClick={onSelect}>
    <h3 className="text-xl font-bold">{theme.theme}</h3>
    <p className="text-sm text-white/80">{theme.themeDescription}</p>
  </div>
);

export const RockAndRollDashboardView: React.FC<{ onBack: () => void, onSelectTheme: (theme: any) => void, onOpenDashboard: () => void }> = ({ onBack, onSelectTheme, onOpenDashboard }) => {
  const data = [pikku, chakkar, jaldi, mehmaan, hisab, kyaHua, vip];
  const gradients = [
    'bg-gradient-to-br from-indigo-900 to-purple-900',
    'bg-gradient-to-br from-red-900 to-orange-900',
    'bg-gradient-to-br from-blue-900 to-cyan-900',
    'bg-gradient-to-br from-green-900 to-emerald-900',
    'bg-gradient-to-br from-yellow-900 to-orange-900',
    'bg-gradient-to-br from-teal-900 to-blue-900',
    'bg-gradient-to-br from-pink-900 to-rose-900',
  ];

  return (
    <div className="w-full min-h-screen bg-black text-white p-6 pt-16">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="p-2 bg-zinc-800 rounded-full cursor-pointer">Back</button>
        <button onClick={onOpenDashboard} className="p-2 bg-zinc-800 rounded-full cursor-pointer"><BarChart3 size={20}/></button>
      </div>
      <h1 className="text-3xl font-bold mb-8">Rock and Roll Themes</h1>
      <div className="flex flex-col gap-4">
        {data.map((d, i) => (
          <ThemeCard key={d.bucketId} theme={d} gradientClass={gradients[i % gradients.length]} onSelect={() => onSelectTheme(d)} />
        ))}
      </div>
    </div>
  );
};
