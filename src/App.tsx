import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import { RolePicker } from './components/RolePicker';
import { QuestionScreen } from './views/QuestionScreen';
import { SpeakScreen } from './views/SpeakScreen';
import { ResultScreen } from './views/ResultScreen';
import { ProgressView } from './views/ProgressView';
import { BuddyView } from './views/BuddyView';
import { MyDayView } from './views/MyDayView';
import { CourseView } from './views/CourseView';
import { FitnessDashboardView } from './views/FitnessDashboardView';
import { RockAndRollContainer } from './views/RockAndRollContainer';
import { DrillView } from './views/DrillView';
import { BottomDockNav, NavTab } from './components/BottomDockNav';
import { AnalysisResult, Question, SavedPhrase, UserProgress } from './types';
import { PRACTICE_QUESTIONS } from './data/questions';
import { generateLocalAnalysis } from './data/patternEngine';
import { recordChallengePractice } from './utils/challengeManager';

type PracticeStep = 'question' | 'speak' | 'result';

export default function App() {
  // Splash Screen & Industry Role Picker State
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [showRolePicker, setShowRolePicker] = useState<boolean>(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('myday');
  const [returnTab, setReturnTab] = useState<NavTab>('myday');
  const [practiceStep, setPracticeStep] = useState<PracticeStep>('question');
  const [myDayStep, setMyDayStep] = useState<string>('1_HOME');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  
  // Current active question (Defaults to the Workplace Shift scenario as requested)
  const [currentQuestion, setCurrentQuestion] = useState<Question>(
    () => PRACTICE_QUESTIONS.find((q) => q.id === 'wp-l2-why-late-shift') || PRACTICE_QUESTIONS[0]
  );
  
  // Result analysis state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // User Progress & Settings (with LocalStorage)
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('hello_english_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      userName: 'Vikram',
      streakDays: 5,
      totalPracticed: 18,
      totalMinutes: 24,
      targetRole: 'Warehouse & Logistics Staff',
      dailyGoal: 4,
      completedToday: 2,
      savedPhrases: [
        {
          id: 'sp-1',
          questionText: 'When you are late for your shift, how would you inform your supervisor?',
          originalSaid: 'I call supervisor on road when bike running.',
          improvedSentence: 'I will call my supervisor while I am on my way to work.',
          hindiTranslation: 'मैं काम पर जाते समय अपने सुपरवाइजर को सूचित करूंगा।',
          savedAt: Date.now() - 86400000,
        },
        {
          id: 'sp-2',
          questionText: 'How would you tell your team lead that a received parcel is damaged?',
          originalSaid: 'This parcel box breaking outside, water coming.',
          improvedSentence: 'Sir, this parcel box arrived damaged and the contents are leaking.',
          hindiTranslation: 'सर, यह पार्सल बॉक्स डैमेज स्थिति में मिला है और सामान लीक हो रहा है।',
          savedAt: Date.now() - 172800000,
        }
      ],
      history: [],
      myDayCompletedTasks: ['share_day', 'conversation'],
    };
  });

  const [voiceSpeed, setVoiceSpeed] = useState<'normal' | 'slow'>('normal');

  // Save progress changes
  useEffect(() => {
    localStorage.setItem('hello_english_progress', JSON.stringify(progress));
  }, [progress]);

  // My Day Task Toggle
  const handleToggleMyDayTask = (taskId: string) => {
    const currentCompleted = progress.myDayCompletedTasks || ['share_day', 'conversation'];
    const isAlreadyDone = currentCompleted.includes(taskId);
    const updated = isAlreadyDone
      ? currentCompleted.filter((id) => id !== taskId)
      : [...currentCompleted, taskId];

    setProgress((prev) => {
      let nextState = {
        ...prev,
        myDayCompletedTasks: updated,
        completedToday: updated.length,
        streakDays: updated.length === 4 && currentCompleted.length < 4 ? prev.streakDays + 1 : prev.streakDays,
      };

      if (!isAlreadyDone) {
        nextState = recordChallengePractice(nextState, 'my_day_activity');
      }

      return nextState;
    });
  };

  const handleResetMyDayTasks = () => {
    setProgress((prev) => ({
      ...prev,
      myDayCompletedTasks: [],
      completedToday: 0,
    }));
  };

  const handleUpdateUserName = (newName: string) => {
    setProgress((prev) => ({
      ...prev,
      userName: newName,
    }));
  };

  // Start Practice from Home or My Day Patterns
  const handleStartPractice = (question?: Question, fromTab?: NavTab) => {
    const targetQ = question || currentQuestion || PRACTICE_QUESTIONS[0];
    if (fromTab) {
      setReturnTab(fromTab);
    } else if (activeTab !== 'practice') {
      setReturnTab(activeTab);
    }
    setCurrentQuestion(targetQ);
    setPracticeStep('question');
    setActiveTab('practice');
  };

  // Start Engine 2 Drill using existing target without changing selection logic
  const handleStartDrill = (question?: Question, fromTab?: NavTab) => {
    const targetQ = question || currentQuestion || PRACTICE_QUESTIONS[0];
    if (fromTab) {
      setReturnTab(fromTab);
    } else if (activeTab !== 'drill') {
      setReturnTab(activeTab);
    }
    setCurrentQuestion(targetQ);
    setActiveTab('drill');
  };

  // Shuffle or Next random question
  const handleShuffleQuestion = () => {
    const otherQuestions = PRACTICE_QUESTIONS.filter((q) => q.id !== currentQuestion.id);
    const random = otherQuestions[Math.floor(Math.random() * otherQuestions.length)] || PRACTICE_QUESTIONS[0];
    setCurrentQuestion(random);
    setPracticeStep('question');
    setAnalysisResult(null);
  };

  // Handle Learner Submitted Speech/Text
  const handleSubmitAnswer = async (transcript: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/understand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          question: currentQuestion.questionEn,
          category: currentQuestion.category,
        }),
      });

      const data: AnalysisResult = await res.json();
      setAnalysisResult(data);

      // Update progress and challenge
      setProgress((prev) => {
        const base = {
          ...prev,
          totalPracticed: prev.totalPracticed + 1,
          completedToday: Math.min(prev.dailyGoal, prev.completedToday + 1),
          totalMinutes: prev.totalMinutes + 1,
        };
        return recordChallengePractice(base, 'coach_question');
      });

      setPracticeStep('result');
    } catch (err) {
      console.warn('Network issue analyzing response, using dynamic pattern engine fallback:', err);
      const fallbackResult = generateLocalAnalysis(
        transcript,
        currentQuestion.questionEn,
        currentQuestion.category
      );
      setAnalysisResult(fallbackResult);
      setProgress((prev) => {
        const base = {
          ...prev,
          totalPracticed: prev.totalPracticed + 1,
          completedToday: Math.min(prev.dailyGoal, prev.completedToday + 1),
          totalMinutes: prev.totalMinutes + 1,
        };
        return recordChallengePractice(base, 'coach_question');
      });
      setPracticeStep('result');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save phrase toggle
  const handleToggleSavePhrase = (shouldSave: boolean) => {
    if (!analysisResult) return;
    if (shouldSave) {
      const newSaved: SavedPhrase = {
        id: `sp-${Date.now()}`,
        questionId: currentQuestion.id,
        questionText: currentQuestion.questionEn,
        originalSaid: analysisResult.learnerTranscript,
        improvedSentence: analysisResult.naturalEnglish,
        hindiTranslation: analysisResult.hindiMeaning,
        savedAt: Date.now(),
      };
      setProgress((prev) => ({
        ...prev,
        savedPhrases: [newSaved, ...prev.savedPhrases.filter((p) => p.improvedSentence !== analysisResult.naturalEnglish)],
      }));
    } else {
      setProgress((prev) => ({
        ...prev,
        savedPhrases: prev.savedPhrases.filter((p) => p.improvedSentence !== analysisResult.naturalEnglish),
      }));
    }
  };

  const handleRemoveSavedPhrase = (id: string) => {
    setProgress((prev) => ({
      ...prev,
      savedPhrases: prev.savedPhrases.filter((p) => p.id !== id),
    }));
  };

  const handleSelectSavedPhrase = (savedPhrase: SavedPhrase) => {
    const matched = PRACTICE_QUESTIONS.find((q) => q.questionEn === savedPhrase.questionText) || {
      id: `custom-${Date.now()}`,
      category: 'workplace',
      categoryLabel: 'Workplace Practice',
      categoryHindi: 'कार्यस्थल',
      questionEn: savedPhrase.questionText,
      questionHi: savedPhrase.hindiTranslation,
      hintEn: 'Practice saying the improved sentence with Coach Neha.',
      hintHi: 'कोच नेहा के साथ सुधरे हुए वाक्य का अभ्यास करें।',
      level: 'Beginner',
      samplePhrases: [savedPhrase.improvedSentence],
      sampleLearnerSpoken: savedPhrase.originalSaid,
    };

    setCurrentQuestion(matched as Question);
    setPracticeStep('speak');
    setActiveTab('practice');
  };

  const isCurrentPhraseSaved = analysisResult
    ? progress.savedPhrases.some((p) => p.improvedSentence === analysisResult.naturalEnglish)
    : false;

  return (
    <main className="w-full min-h-screen bg-[#090d16] text-slate-100 flex justify-center selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Splash Screen & Industry Role Picker */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            onFinish={() => {
              setShowSplash(false);
              setShowRolePicker(true);
            }}
            durationMs={3000}
          />
        )}
        {showRolePicker && (
          <RolePicker
            options={["All", "Retail", "Hotels", "Warehouse", "Home service"]}
            onSelect={(role) => {
              setProgress((prev) => ({
                ...prev,
                targetRole: role,
              }));
              setShowRolePicker(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Frame Container (Constrained on Desktop as requested) */}
      <div className="w-full max-w-[440px] min-h-screen bg-[#090d16] shadow-2xl relative flex flex-col justify-between overflow-x-hidden border-x border-slate-800/80">
        
        {/* VIEW ROUTING */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">


          {activeTab === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="w-full"
            >
              <RockAndRollContainer onBack={() => setActiveTab('sheeko')} />
            </motion.div>
          )}

          {(activeTab === 'sheeko' || activeTab === 'myday') && (
            <motion.div
              key="sheeko"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <MyDayView
                userName={progress.userName || 'Vikram'}
                onUpdateUserName={handleUpdateUserName}
                streakDays={progress.streakDays}
                completedTaskIds={progress.myDayCompletedTasks || ['share_day', 'conversation']}
                onToggleTaskCompleted={handleToggleMyDayTask}
                onResetTasks={handleResetMyDayTasks}
                onStartPractice={handleStartPractice}
                onStartDrill={handleStartDrill}
                progress={progress}
                onUpdateProgress={setProgress}
                onStepChange={setMyDayStep}
                onOpenRolePicker={() => setShowRolePicker(true)}
                language={language}
                onToggleLanguage={() => setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'))}
                onNavigateTab={(tab) => {
                  if (tab === 'practice') {
                    handleStartPractice();
                  } else if (tab === 'home' || tab === 'fitness' || tab === 'dashboard') {
                    setActiveTab('sheeko');
                  } else {
                    setActiveTab(tab as any);
                  }
                }}
              />
            </motion.div>
          )}

          {activeTab === 'practice' && (
            <motion.div
              key={`practice-${practiceStep}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {practiceStep === 'question' && (
                <QuestionScreen
                  question={currentQuestion}
                  onBack={() => {
                    const fallback = returnTab === 'dashboard' || returnTab === 'fitness' ? 'sheeko' : (returnTab || 'sheeko');
                    setActiveTab(fallback);
                  }}
                  onContinue={() => setPracticeStep('speak')}
                  onShuffleQuestion={handleShuffleQuestion}
                />
              )}

              {practiceStep === 'speak' && (
                <SpeakScreen
                  question={currentQuestion}
                  onBack={() => setPracticeStep('question')}
                  onSubmitAnswer={handleSubmitAnswer}
                  isAnalyzing={isAnalyzing}
                />
              )}

              {practiceStep === 'result' && analysisResult && (
                <ResultScreen
                  question={currentQuestion}
                  result={analysisResult}
                  onTryAgain={() => setPracticeStep('speak')}
                  onNextQuestion={handleShuffleQuestion}
                  onSavePhrase={handleToggleSavePhrase}
                  isSaved={isCurrentPhraseSaved}
                />
              )}
            </motion.div>
          )}



          {(activeTab === 'dashboard' || activeTab === 'fitness') && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <FitnessDashboardView
                progress={progress}
                onStartPractice={(q) => handleStartPractice(q, 'sheeko')}
                onOpenMyDay={() => setActiveTab('sheeko')}
              />
            </motion.div>
          )}

          {(activeTab === 'buddy' || activeTab === 'course') && (
            <motion.div
              key="buddy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <BuddyView
                onStartPractice={() => handleStartPractice()}
                onBack={() => setActiveTab('sheeko')}
                language={language}
              />
            </motion.div>
          )}

          {(activeTab === 'snippets' || activeTab === 'profile') && (
            <motion.div
              key="snippets"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <CourseView
                onStartPractice={(q) => handleStartPractice(q, 'snippets')}
              />
            </motion.div>
          )}

          {activeTab === 'drill' && (
            <motion.div
              key="drill"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <DrillView
                existingQuestion={currentQuestion}
                dayNumber={progress.streakDays || 1}
                onExit={() => {
                  const fallback = returnTab === 'dashboard' || returnTab === 'fitness' ? 'sheeko' : (returnTab || 'sheeko');
                  setActiveTab(fallback);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {(activeTab !== 'practice' &&
          activeTab !== 'drill' &&
          activeTab !== 'buddy' &&
          activeTab !== 'course' &&
          activeTab !== 'challenge' &&
          (activeTab !== 'sheeko' || myDayStep === '1_HOME') &&
          activeTab !== 'dashboard' &&
          activeTab !== 'fitness' &&
          !showRolePicker &&
          !((activeTab === 'sheeko') && (myDayStep === '2_CHAT_INPUT' || myDayStep === '4_CHATBOT_CONVERSATION'))) && (
          <BottomDockNav
            activeTab={activeTab}
            language={language}
            onSelectTab={(tab) => {
              if (tab === 'practice') {
                handleStartPractice();
              } else {
                setActiveTab(tab);
              }
            }}
          />
        )}
      </div>
    </main>
  );
}
