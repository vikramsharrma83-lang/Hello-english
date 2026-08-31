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

export const RockAndRollContainer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [view, setView] = useState<'profiles' | 'dashboard' | 'retail-dashboard' | 'situations' | 'chat' | 'summary' | 'stats' | 'dummy'>('profiles');
  const [selectedTheme, setSelectedTheme] = useState<any | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [dummyProfileName, setDummyProfileName] = useState<string>('Retail');
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
      {view === 'profiles' && (
        <RockAndRollProfilesView 
          onBack={onBack} 
          onSelectHospitality={() => setView('dashboard')}
          onSelectRetail={() => setView('retail-dashboard')}
          onSelectDummy={(name) => {
            setDummyProfileName(name);
            setView('dummy');
          }}
        />
      )}
      {view === 'dummy' && (
        <RockAndRollDummyView 
          profileName={dummyProfileName} 
          onBack={() => setView('profiles')} 
        />
      )}
      {view === 'dashboard' && <RockAndRollDashboardView onBack={() => setView('profiles')} onSelectTheme={handleSelectTheme} onOpenDashboard={() => setView('stats')} />}
      {view === 'retail-dashboard' && <RetailDashboardView onBack={() => setView('profiles')} onSelectTheme={handleSelectTheme} />}
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
