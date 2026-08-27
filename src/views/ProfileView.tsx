import React from 'react';
import {
  User,
  Briefcase,
  Target,
  Volume2,
  Heart,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { CoachNehaAvatar } from '../components/CoachNehaAvatar';

interface ProfileViewProps {
  targetRole: string;
  onChangeRole: (role: string) => void;
  dailyGoal: number;
  onChangeDailyGoal: (goal: number) => void;
  voiceSpeed: 'normal' | 'slow';
  onChangeVoiceSpeed: (speed: 'normal' | 'slow') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  targetRole,
  onChangeRole,
  dailyGoal,
  onChangeDailyGoal,
  voiceSpeed,
  onChangeVoiceSpeed,
}) => {
  const roles = [
    { id: 'Warehouse & Logistics Staff', label: 'Warehouse & Logistics Associate', hindi: 'गोदाम एवं लॉजिस्टिक्स' },
    { id: 'Delivery Partner', label: 'Delivery Driver / Rider', hindi: 'डिलीवरी पार्टनर' },
    { id: 'QSR & Restaurant Crew', label: 'QSR / Restaurant Staff', hindi: 'रेस्टोरेंट व काउंटर स्टाफ' },
    { id: 'Retail Store Associate', label: 'Retail & Store Associate', hindi: 'रिटेल स्टोर सेल्स' },
    { id: 'Office & Admin Assistant', label: 'Office & Facility Assistant', hindi: 'ऑफिस असिस्टेंट' },
    { id: 'General Spoken English', label: 'Everyday Spoken English', hindi: 'दैनिक बातचीत' },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#FDF4FF] via-[#F8F7FF] to-[#FFF1F5] text-slate-900 pb-28 pt-4 px-4 sm:px-5">
      {/* Title */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
          LEARNER SETTINGS
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Profile & Preferences
        </h1>
      </div>

      {/* Coach Neha Philosophy Card */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#FFFBEB] via-[#FFF1F2] to-[#FAF5FF] border border-[#FED7AA] pastel-card-shadow relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <CoachNehaAvatar size="lg" showBadge />
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#7C3AED]">
              <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
              Coach Neha
            </div>
            <h2 className="text-base font-extrabold text-slate-900">
              “Understand first. Improve second.”
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Practice speaking freely without fear of mistakes.
            </p>
          </div>
        </div>
      </div>

      {/* WORKPLACE ROLE CUSTOMIZATION */}
      <div className="mt-5">
        <div className="flex items-center gap-2 mb-2.5 px-1">
          <Briefcase className="w-4 h-4 text-[#7C3AED]" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
            Select Your Target Work Role
          </h3>
        </div>

        <div className="space-y-2">
          {roles.map((role) => {
            const isSelected = targetRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => onChangeRole(role.id)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#7C3AED] pastel-card-shadow ring-2 ring-[#7C3AED]/20 shadow-sm'
                    : 'bg-white/80 border-[#E9D5FF] hover:bg-white hover:border-[#D8B4FE]'
                }`}
              >
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {role.label}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500">
                    {role.hindi}
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white shadow-xs' : 'border border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DAILY PRACTICE TARGET */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2.5 px-1">
          <Target className="w-4 h-4 text-[#EA580C]" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
            Daily Practice Target
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[1, 3, 5].map((count) => {
            const isSelected = dailyGoal === count;
            return (
              <button
                key={count}
                onClick={() => onChangeDailyGoal(count)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#EA580C] pastel-card-shadow ring-2 ring-[#EA580C]/20 shadow-sm'
                    : 'bg-white/80 border-[#E9D5FF] hover:bg-white'
                }`}
              >
                <span className="text-lg font-black text-slate-900">{count}</span>
                <p className="text-[11px] font-bold text-slate-500">
                  {count === 1 ? 'Quick (1 min)' : count === 3 ? 'Standard (3 min)' : 'Mastery (5 min)'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* COACH NEHA AUDIO SPEED */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2.5 px-1">
          <Volume2 className="w-4 h-4 text-[#0D9488]" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
            Voice Pronunciation Speed
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onChangeVoiceSpeed('normal')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              voiceSpeed === 'normal'
                ? 'bg-white border-[#0D9488] pastel-card-shadow ring-2 ring-[#0D9488]/20 shadow-sm'
                : 'bg-white/80 border-[#E9D5FF] hover:bg-white'
            }`}
          >
            <span className="text-xs font-extrabold text-slate-900">
              Natural Speed (1.0x)
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Normal conversation pace
            </p>
          </button>

          <button
            onClick={() => onChangeVoiceSpeed('slow')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              voiceSpeed === 'slow'
                ? 'bg-white border-[#0D9488] pastel-card-shadow ring-2 ring-[#0D9488]/20 shadow-sm'
                : 'bg-white/80 border-[#E9D5FF] hover:bg-white'
            }`}
          >
            <span className="text-xs font-extrabold text-slate-900">
              Clear & Slow (0.8x)
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Easy word-by-word pronunciation
            </p>
          </button>
        </div>
      </div>

      {/* About Box */}
      <div className="mt-6 p-4 rounded-2xl bg-white/70 border border-[#E9D5FF] text-center text-xs text-slate-500">
        <p className="font-bold text-slate-800">HELLO ENGLISH • Mobile-First AI Coach</p>
        <p className="text-[11px] mt-0.5">Crafted with ❤️ for Indian frontline learners</p>
      </div>
    </div>
  );
};
