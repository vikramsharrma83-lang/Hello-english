import React, { useState } from 'react';
import { RockAndRollProfilesView } from './RockAndRollProfilesView';
import { RockAndRollDashboardView } from './RockAndRollDashboardView';
import { RetailDashboardView } from './RetailDashboardView';
import { RockAndRollSituationsView } from './RockAndRollSituationsView';
import { RockAndRollChatView } from './RockAndRollChatView';
import { RockAndRollSummaryView } from './RockAndRollSummaryView';
import { RockAndRollDashboard } from './RockAndRollDashboard';
import { RockAndRollDummyView } from './RockAndRollDummyView';
import { RockAndRollSession } from '../types/rockAndRollTypes';

export const RockAndRollContainer: React.FC<{ 
  onBack: () => void;
  initialView?: 'dashboard' | 'retail-dashboard' | 'dummy';
  initialDummyName?: string;
}> = ({ onBack, initialView = 'dashboard', initialDummyName = 'Retail' }) => {
  const [view, setView] = useState<'dashboard' | 'retail-dashboard' | 'situations' | 'chat' | 'summary' | 'stats' | 'dummy'>(initialView);
  const [selectedTheme, setSelectedTheme] = useState<any | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [dummyProfileName, setDummyProfileName] = useState<string>(initialDummyName);
  const [sessions, setSessions] = useState<RockAndRollSession[]>([]);
  const [completedSummary, setCompletedSummary] = useState<any | null>(null);

  React.useEffect(() => {
    setView(initialView);
    if (initialDummyName) {
      setDummyProfileName(initialDummyName);
    }
  }, [initialView, initialDummyName]);

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
    <div className="w-full min-h-full bg-black flex flex-col">
      {view === 'dummy' && (
        <RockAndRollDummyView 
          profileName={dummyProfileName} 
          onBack={onBack} 
        />
      )}
      {view === 'dashboard' && <RockAndRollDashboardView onBack={onBack} onSelectTheme={handleSelectTheme} onOpenDashboard={() => setView('stats')} />}
      {view === 'retail-dashboard' && <RetailDashboardView onBack={onBack} onSelectTheme={handleSelectTheme} />}
      {view === 'stats' && <RockAndRollDashboard onBack={() => setView('dashboard')} sessions={sessions} />}
      {view === 'situations' && <RockAndRollSituationsView theme={selectedTheme} onBack={() => {
        if (selectedTheme?.bucketId?.startsWith('retail_')) {
          setView('retail-dashboard');
        } else {
          setView('dashboard');
        }
      }} onSelectChallenge={handleSelectChallenge} />}
      {view === 'chat' && <RockAndRollChatView challenge={selectedChallenge} onComplete={handleChatComplete} onBack={() => setView('situations')} />}
      {view === 'summary' && <RockAndRollSummaryView challenge={selectedChallenge} summary={completedSummary} onBack={() => {
        if (selectedTheme?.bucketId?.startsWith('retail_')) {
          setView('retail-dashboard');
        } else {
          setView('dashboard');
        }
      }} />}
    </div>
  );
};
