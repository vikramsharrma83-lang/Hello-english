import React, { useState } from 'react';
import { RockAndRollDashboardView } from './RockAndRollDashboardView';
import { RockAndRollSituationsView } from './RockAndRollSituationsView';
import { RockAndRollChatView } from './RockAndRollChatView';
import { RockAndRollSummaryView } from './RockAndRollSummaryView';
import { RockAndRollDashboard } from './RockAndRollDashboard';
import { RockAndRollSession } from '../types/rockAndRollTypes';

export const RockAndRollContainer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [view, setView] = useState<'dashboard' | 'situations' | 'chat' | 'summary' | 'stats'>('dashboard');
  const [selectedTheme, setSelectedTheme] = useState<any | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [sessions, setSessions] = useState<RockAndRollSession[]>([]);
  const [completedSummary, setCompletedSummary] = useState<any | null>(null);

  const handleSelectTheme = (theme: any) => {
    setSelectedTheme(theme);
    setView('situations');
  };

  const handleSelectChallenge = (challenge: any) => {
    setSelectedChallenge(challenge);
    setView('chat');
  };

  const handleChatComplete = (summary: any) => {
    const newSession: RockAndRollSession = {
      id: Date.now().toString(),
      situationTitle: selectedChallenge?.title || 'Roleplay Challenge',
      score: summary?.score || 82,
      isResolved: summary?.isResolved ?? true,
      situationHandling: summary?.situationHandling || 85,
      englishGrammar: summary?.englishGrammar || 78,
      customerResponse: summary?.customerResponse || 'Happy',
      timestamp: Date.now(),
    };
    setSessions([newSession, ...sessions]);
    setCompletedSummary(summary);
    setView('summary');
  };

  return (
    <div className="w-full h-full">
      {view === 'dashboard' && <RockAndRollDashboardView onBack={onBack} onSelectTheme={handleSelectTheme} onOpenDashboard={() => setView('stats')} />}
      {view === 'stats' && <RockAndRollDashboard onBack={() => setView('dashboard')} sessions={sessions} />}
      {view === 'situations' && <RockAndRollSituationsView theme={selectedTheme} onBack={() => setView('dashboard')} onSelectChallenge={handleSelectChallenge} />}
      {view === 'chat' && <RockAndRollChatView challenge={selectedChallenge} onComplete={handleChatComplete} onBack={() => setView('situations')} />}
      {view === 'summary' && <RockAndRollSummaryView challenge={selectedChallenge} summary={completedSummary} onBack={() => setView('dashboard')} />}
    </div>
  );
};
