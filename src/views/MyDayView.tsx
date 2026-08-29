import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MyDayHeader } from '../components/myday/MyDayHeader';
import { HomePage } from '../components/myday/HomePage';
import { LearnerDayInput } from '../components/myday/LearnerDayInput';
import { DayMapVisualizer } from '../components/myday/DayMapVisualizer';
import { ConversationView } from '../components/myday/ConversationView';
import { TopicCompletionCard } from '../components/myday/TopicCompletionCard';
import { SessionSummary } from '../components/myday/SessionSummary';
import { EngineInspectorDrawer } from '../components/myday/EngineInspectorDrawer';
import { PatternLibraryModal } from '../components/myday/PatternLibraryModal';
import { MyDayPatternsHub } from '../components/myday/MyDayPatternsHub';
import { ChallengeView } from './ChallengeView';
import { DayMap, ActiveTopic, ConversationTurn, DeepAnalysis, Question, UserProgress } from '../types';

interface MyDayViewProps {
  userName?: string;
  onUpdateUserName?: (name: string) => void;
  streakDays?: number;
  completedTaskIds?: string[];
  onToggleTaskCompleted?: (taskId: string) => void;
  onResetTasks?: () => void;
  onStartPractice?: (question?: Question) => void;
  onNavigateTab?: (tab: 'home' | 'myday' | 'practice' | 'progress' | 'profile' | 'challenge') => void;
  initialMode?: 'story' | 'patterns' | 'challenge';
  progress?: UserProgress;
  onUpdateProgress?: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const MyDayView: React.FC<MyDayViewProps> = ({
  userName = 'Vikram',
  streakDays = 5,
  completedTaskIds = ['share_day', 'conversation'],
  onToggleTaskCompleted,
  onResetTasks,
  onStartPractice,
  onNavigateTab,
  initialMode = 'story',
  progress,
  onUpdateProgress,
}) => {
  // Navigation State Machine matching story workflow + patterns hub + challenge view
  const [step, setStep] = useState<
    '1_HOME' | '2_CHAT_INPUT' | '3_SYSTEM_SUMMARIZATION' | '4_CHATBOT_CONVERSATION' | '5_TOPIC_COMPLETE' | '6_SESSION_SUMMARY' | 'PATTERNS_HUB' | 'CHALLENGE'
  >(initialMode === 'patterns' ? 'PATTERNS_HUB' : initialMode === 'challenge' ? 'CHALLENGE' : '1_HOME');

  const [dayMap, setDayMap] = useState<DayMap>({
    activities: [],
    emotions: [],
    environments: [],
    rawStatement: '',
    knownFacts: [],
    capturedAt: Date.now(),
  });

  const [selectedTopic, setSelectedTopic] = useState<ActiveTopic | null>(null);
  const [isWholeStoryMode, setIsWholeStoryMode] = useState<boolean>(false);
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<DeepAnalysis | undefined>(undefined);
  const [lastCompletionSummary, setLastCompletionSummary] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [patternLibraryOpen, setPatternLibraryOpen] = useState(false);

  // 1. Submit Initial Learner Statement (From Page 2 or Presets)
  const handleSubmitInitialStatement = async (statement: string) => {
    const clean = statement.trim();
    if (!clean) return;
    setIsLoading(true);

    const fallbackDayMap: DayMap = {
      activities: [
        clean.toLowerCase().includes('bike') ? 'Went to work by bike' : 'Started daily shift & work tasks',
        clean.toLowerCase().includes('inbound') ? 'Handled inbound product items' : 'Completed planned activities',
        clean.toLowerCase().includes('ravi') || clean.toLowerCase().includes('friend') ? 'Met friends in the evening' : 'Wrapped up evening routine',
      ],
      emotions: [
        clean.toLowerCase().includes('angry') || clean.toLowerCase().includes('tension') ? 'Felt worried about feedback' : 'Felt focused and motivated',
      ],
      environments: [
        clean.toLowerCase().includes('supervisor') ? 'Supervisor at workplace' : 'Daily workplace',
        clean.toLowerCase().includes('ravi') ? 'Ravi in the evening' : 'Transit & neighborhood',
      ],
      rawStatement: clean,
      knownFacts: [`Learner shared: "${clean}"`],
      naturalEnglishMeaning: `The learner shared their daily experience: ${clean}`,
      pointsExtractedCount: 6,
      capturedAt: Date.now(),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch('/api/analyze-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement: clean }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.dayMap) {
        setDayMap(data.dayMap);
      } else {
        setDayMap(fallbackDayMap);
      }
    } catch (error) {
      console.warn('Day analysis fast fallback triggered:', error);
      setDayMap(fallbackDayMap);
    } finally {
      setIsWholeStoryMode(true);
      setSelectedTopic({
        pointer: 'Whole Story Flow (Morning to Evening)',
        category: 'ACTIVITY',
        exploredAspects: {},
        isCompleted: false,
        turnCount: 0,
      });
      setStep('3_SYSTEM_SUMMARIZATION');
      setIsLoading(false);
    }
  };

  // 2. Select Individual Activity/Emotion/Environment Topic from Day Map
  const handleSelectTopic = (pointer: string, category: 'ACTIVITY' | 'EMOTION' | 'ENVIRONMENT') => {
    setIsWholeStoryMode(false);
    setSelectedTopic({
      pointer,
      category,
      exploredAspects: {},
      isCompleted: false,
      turnCount: 0,
    });
  };

  // 3. Select Whole Story Mode
  const handleSelectWholeStory = () => {
    setIsWholeStoryMode(true);
    setSelectedTopic({
      pointer: 'Whole Story Flow (Morning to Evening)',
      category: 'ACTIVITY',
      exploredAspects: {},
      isCompleted: false,
      turnCount: 0,
    });
  };

  // 4. Begin / Continue Conversation on Selected Topic (Page 4: Chat Bot Starts)
  const handleStartConversation = async () => {
    if (!selectedTopic) return;
    setIsLoading(true);
    setStep('4_CHATBOT_CONVERSATION');

    try {
      // Clear previous turns if starting fresh on this topic
      const res = await fetch('/api/conversation-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayMap,
          selectedTopic,
          conversationHistory: turns,
          answeredQuestions,
          knownFacts: dayMap.knownFacts,
          isFirstTurnOfTopic: true,
        }),
      });

      const data = await res.json();
      const rephrase = data.rephrase || `Let's focus on ${selectedTopic.pointer}.`;
      const probeQuestion = data.probeQuestion || `How did that part of your day begin?`;

      const initialSystemTurn: ConversationTurn = {
        id: `turn-${Date.now()}`,
        speaker: 'system',
        text: `${rephrase} ${probeQuestion}`,
        rephrase,
        probeQuestion,
        probeDirection: data.probeDirection || 'WHAT',
        deepAnalysis: data.deepAnalysis,
        timestamp: Date.now(),
      };

      setTurns((prev) => [...prev, initialSystemTurn]);
      if (probeQuestion) {
        setAnsweredQuestions((prev) => [...prev, probeQuestion]);
      }
      if (data.updatedDayMap) {
        setDayMap(data.updatedDayMap);
      }
      if (data.deepAnalysis) {
        setLatestAnalysis(data.deepAnalysis);
      }

      setSelectedTopic((prev) => (prev ? { ...prev, turnCount: prev.turnCount + 1 } : null));
    } catch (e) {
      console.error('Conversation init error:', e);
      const fallbackTurn: ConversationTurn = {
        id: `turn-${Date.now()}`,
        speaker: 'system',
        text: `Let's talk about ${selectedTopic?.pointer || 'your day'}. How did that go?`,
        rephrase: `Let's focus on ${selectedTopic?.pointer || 'your day'}.`,
        probeQuestion: `How did that go?`,
        probeDirection: 'WHAT',
        timestamp: Date.now(),
      };
      setTurns((prev) => [...prev, fallbackTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Learner Answers a Probe Question
  const handleLearnerAnswer = async (answerText: string) => {
    if (!selectedTopic) return;

    // Add Learner Turn
    const learnerTurn: ConversationTurn = {
      id: `turn-learner-${Date.now()}`,
      speaker: 'learner',
      text: answerText,
      rawLearnerText: answerText,
      timestamp: Date.now(),
    };

    setTurns((prev) => [...prev, learnerTurn]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/conversation-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayMap,
          selectedTopic,
          conversationHistory: [...turns, learnerTurn],
          answeredQuestions,
          knownFacts: dayMap.knownFacts,
          latestLearnerAnswer: answerText,
          isFirstTurnOfTopic: false,
        }),
      });

      const data = await res.json();
      const rephrase = data.rephrase || `I understand. You shared: "${answerText}".`;
      const probeQuestion = data.probeQuestion || `What happened after that?`;

      const systemTurn: ConversationTurn = {
        id: `turn-sys-${Date.now()}`,
        speaker: 'system',
        text: `${rephrase} ${probeQuestion}`,
        rephrase,
        probeQuestion,
        probeDirection: data.probeDirection || 'WHAT',
        deepAnalysis: data.deepAnalysis,
        timestamp: Date.now(),
      };

      setTurns((prev) => [...prev, systemTurn]);

      if (probeQuestion) {
        setAnsweredQuestions((prev) => [...prev, probeQuestion]);
      }
      if (data.updatedDayMap) {
        setDayMap(data.updatedDayMap);
      }
      if (data.deepAnalysis) {
        setLatestAnalysis(data.deepAnalysis);
      }

      // Mark share_day completed in global progress tracker
      if (onToggleTaskCompleted && !completedTaskIds.includes('share_day')) {
        onToggleTaskCompleted('share_day');
      }

      // Check if topic reached natural exploration completion
      if (data.topicIsCompleted && selectedTopic.turnCount >= 2) {
        setCompletedTopics((prev) => Array.from(new Set([...prev, selectedTopic.pointer])));
        setLastCompletionSummary(data.completionSummary);
        setSelectedTopic((prev) => (prev ? { ...prev, isCompleted: true } : null));
        setTimeout(() => {
          setStep('5_TOPIC_COMPLETE');
        }, 1200);
      } else {
        setSelectedTopic((prev) => (prev ? { ...prev, turnCount: prev.turnCount + 1 } : null));
      }
    } catch (e) {
      console.error('Conversation step error:', e);
      const fallbackTurn: ConversationTurn = {
        id: `turn-sys-${Date.now()}`,
        speaker: 'system',
        text: `I see what you mean. What happened next in your day?`,
        rephrase: `I see what you mean.`,
        probeQuestion: `What happened next in your day?`,
        probeDirection: 'WHAT',
        timestamp: Date.now(),
      };
      setTurns((prev) => [...prev, fallbackTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Navigation Back Button Handler
  const handleGlobalBack = () => {
    switch (step) {
      case '2_CHAT_INPUT':
        setStep('1_HOME');
        break;
      case '3_SYSTEM_SUMMARIZATION':
        setStep('2_CHAT_INPUT');
        break;
      case '4_CHATBOT_CONVERSATION':
        setStep('3_SYSTEM_SUMMARIZATION');
        break;
      case '5_TOPIC_COMPLETE':
        setStep('3_SYSTEM_SUMMARIZATION');
        break;
      case '6_SESSION_SUMMARY':
        setStep('4_CHATBOT_CONVERSATION');
        break;
      default:
        setStep('1_HOME');
        break;
    }
  };

  // 7. Select Next Topic from Completion View
  const handleSelectNextTopicFromCompletion = (
    pointer: string,
    category: 'ACTIVITY' | 'EMOTION' | 'ENVIRONMENT'
  ) => {
    setSelectedTopic({
      pointer,
      category,
      exploredAspects: {},
      isCompleted: false,
      turnCount: 0,
    });
    setStep('3_SYSTEM_SUMMARIZATION');
  };

  // 8. Reset Session
  const handleResetSession = () => {
    setStep('1_HOME');
    setDayMap({
      activities: [],
      emotions: [],
      environments: [],
      rawStatement: '',
      knownFacts: [],
      capturedAt: Date.now(),
    });
    setSelectedTopic(null);
    setIsWholeStoryMode(false);
    setTurns([]);
    setAnsweredQuestions([]);
    setCompletedTopics([]);
    setLatestAnalysis(undefined);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-sky-500 selection:text-black">
      {/* Main Page Router */}
      <main className="flex-1 flex flex-col">
        {/* PAGE 1: Minimalist Home Page (With top X exit button to return to Home) */}
        {step === '1_HOME' && (
          <HomePage
            onStart={() => setStep('2_CHAT_INPUT')}
            onOpenPatternLibrary={() => setStep('PATTERNS_HUB')}
            onOpenChallenge={() => setStep('CHALLENGE')}
            onOpenInspector={() => setInspectorOpen(true)}
            onClose={() => {
              if (onNavigateTab) {
                onNavigateTab('home');
              }
            }}
            onSelectSample={(sampleText) => {
              handleSubmitInitialStatement(sampleText);
            }}
            turns={turns}
            dayMap={dayMap}
            progress={progress}
          />
        )}

        {/* 5-DAY FLUENCY CHALLENGE VIEW */}
        {step === 'CHALLENGE' && (
          <div className="w-full flex-1 flex flex-col">
            <ChallengeView
              progress={
                progress || {
                  userName: userName,
                  streakDays: streakDays,
                  completedToday: 3,
                  dailyGoal: 5,
                  totalPracticed: 18,
                  weakAreas: ['Grammar Accuracy'],
                  strongAreas: ['Communication Clarity'],
                  challenge: {
                    isStarted: true,
                    startDate: Date.now() - 2 * 86400000,
                    totalDays: 5,
                    daysRemaining: 3,
                    currentDay: 3,
                    myDayTarget: 5,
                    myDayCompletedCount: 2,
                    coachQuestionsTarget: 100,
                    coachQuestionsCompletedCount: 18,
                    dailyProgress: [
                      {
                        day: 1,
                        dayLabel: 'Day 1',
                        isCompleted: true,
                        isCurrent: false,
                        isStarted: true,
                        myDayCompleted: true,
                        questionsCompleted: 20,
                        questionsTarget: 20,
                        completedActivities: [
                          'Morning Routine & Work Greeting Story',
                          '20 Workplace Speaking Drills (Coach Neha)',
                        ],
                      },
                      {
                        day: 2,
                        dayLabel: 'Day 2',
                        isCompleted: true,
                        isCurrent: false,
                        isStarted: true,
                        myDayCompleted: true,
                        questionsCompleted: 20,
                        questionsTarget: 20,
                        completedActivities: [
                          'Inventory & Parcel Damage Reporting Story',
                          '20 Logistics & Warehouse Questions (Coach Neha)',
                        ],
                      },
                      {
                        day: 3,
                        dayLabel: 'Day 3',
                        isCompleted: false,
                        isCurrent: true,
                        isStarted: true,
                        myDayCompleted: false,
                        questionsCompleted: 8,
                        questionsTarget: 20,
                        completedActivities: [
                          '8 Workplace Speaking Drills completed today',
                        ],
                      },
                      {
                        day: 4,
                        dayLabel: 'Day 4',
                        isCompleted: false,
                        isCurrent: false,
                        isStarted: false,
                        myDayCompleted: false,
                        questionsCompleted: 0,
                        questionsTarget: 20,
                        completedActivities: [],
                      },
                      {
                        day: 5,
                        dayLabel: 'Day 5',
                        isCompleted: false,
                        isCurrent: false,
                        isStarted: false,
                        myDayCompleted: false,
                        questionsCompleted: 0,
                        questionsTarget: 20,
                        completedActivities: [],
                      },
                    ],
                  },
                }
              }
              onBack={() => setStep('1_HOME')}
              onStartMyDay={() => setStep('2_CHAT_INPUT')}
              onStartPracticeQuestion={(q) => {
                if (onStartPractice) {
                  onStartPractice(q);
                }
              }}
              onUpdateProgress={onUpdateProgress}
            />
          </div>
        )}

        {/* PATTERNS & PRACTICE HUB (Apple Watch Discover & Categories / Levels) */}
        {step === 'PATTERNS_HUB' && (
          <div className="w-full flex-1 flex flex-col">
            <MyDayPatternsHub
              onStartPracticeQuestion={(q) => {
                if (onStartPractice) {
                  onStartPractice(q);
                }
              }}
              onUsePatternForStory={(pat) => {
                handleSubmitInitialStatement(pat);
              }}
              onBackToBuddy={() => setStep('1_HOME')}
            />
          </div>
        )}

        {/* PAGE 2: Chat Input Page (Type and Speak, with back button to Page 1) */}
        {step === '2_CHAT_INPUT' && (
          <LearnerDayInput
            onSubmitStatement={handleSubmitInitialStatement}
            onGoBack={() => setStep('1_HOME')}
            isLoading={isLoading}
            initialText={dayMap.rawStatement}
            onOpenPatternLibrary={() => setStep('PATTERNS_HUB')}
            onOpenInspector={() => setInspectorOpen(true)}
            voiceEnabled={voiceEnabled}
            onToggleVoice={() => setVoiceEnabled((prev) => !prev)}
          />
        )}

        {/* PAGE 3: System Summarization & Activity Pointers (with back button to Page 2) */}
        {step === '3_SYSTEM_SUMMARIZATION' && (
          <DayMapVisualizer
            dayMap={dayMap}
            selectedTopic={selectedTopic}
            onSelectTopic={handleSelectTopic}
            onSelectWholeStory={handleSelectWholeStory}
            onContinueToConversation={handleStartConversation}
            onGoBack={() => setStep('2_CHAT_INPUT')}
            completedTopics={completedTopics}
            isWholeStorySelected={isWholeStoryMode}
            onOpenPatternLibrary={() => setStep('PATTERNS_HUB')}
            onOpenInspector={() => setInspectorOpen(true)}
            voiceEnabled={voiceEnabled}
            onToggleVoice={() => setVoiceEnabled((prev) => !prev)}
          />
        )}

        {/* PAGE 4: Chatbot Conversation Starts (with back button to Page 3) */}
        {step === '4_CHATBOT_CONVERSATION' && selectedTopic && (
          <ConversationView
            dayMap={dayMap}
            selectedTopic={selectedTopic}
            turns={turns}
            onLearnerAnswer={handleLearnerAnswer}
            isLoading={isLoading}
            onGoBackToDayMap={() => setStep('3_SYSTEM_SUMMARIZATION')}
            onChooseAnotherActivity={() => setStep('3_SYSTEM_SUMMARIZATION')}
            onEndChatTopic={() => {
              setCompletedTopics((prev) => Array.from(new Set([...prev, selectedTopic.pointer])));
              setStep('5_TOPIC_COMPLETE');
            }}
            onEndSession={() => setStep('6_SESSION_SUMMARY')}
            voiceEnabled={voiceEnabled}
            isWholeStoryMode={isWholeStoryMode}
            onOpenPatternLibrary={() => setStep('PATTERNS_HUB')}
            onOpenInspector={() => setInspectorOpen(true)}
            onToggleVoice={() => setVoiceEnabled((prev) => !prev)}
          />
        )}

        {/* PAGE 5: Topic Completion Card */}
        {step === '5_TOPIC_COMPLETE' && selectedTopic && (
          <TopicCompletionCard
            topic={selectedTopic}
            completionSummary={lastCompletionSummary}
            dayMap={dayMap}
            onSelectNextTopic={handleSelectNextTopicFromCompletion}
            onViewSummary={() => setStep('6_SESSION_SUMMARY')}
            onGoBackToDayMap={() => setStep('3_SYSTEM_SUMMARIZATION')}
            completedTopics={completedTopics}
          />
        )}

        {/* PAGE 6: Full Session Summary */}
        {step === '6_SESSION_SUMMARY' && (
          <SessionSummary
            dayMap={dayMap}
            turns={turns}
            onStartNewDay={handleResetSession}
            onGoBackToChat={() => setStep('4_CHATBOT_CONVERSATION')}
          />
        )}
      </main>

      {/* Slide-out Performance Analytics Drawer */}
      <EngineInspectorDrawer
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        dayMap={dayMap}
        answeredQuestions={answeredQuestions}
        latestAnalysis={latestAnalysis}
      />

      {/* Reference Pattern Library Modal (500+ Patterns) */}
      <PatternLibraryModal
        isOpen={patternLibraryOpen}
        onClose={() => setPatternLibraryOpen(false)}
        onSelectPattern={(patternText) => {
          handleSubmitInitialStatement(patternText);
        }}
      />
    </div>
  );
};
