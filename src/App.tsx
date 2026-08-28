import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './views/HomeScreen';
import { QuestionScreen } from './views/QuestionScreen';
import { SpeakScreen } from './views/SpeakScreen';
import { ResultScreen } from './views/ResultScreen';
import { ProgressView } from './views/ProgressView';
import { ProfileView } from './views/ProfileView';
import { BottomDockNav, NavTab } from './components/BottomDockNav';
import { AnalysisResult, Question, SavedPhrase, UserProgress } from './types';
import { PRACTICE_QUESTIONS } from './data/questions';

type PracticeStep = 'question' | 'speak' | 'result';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [practiceStep, setPracticeStep] = useState<PracticeStep>('question');
  
  // Current active question
  const [currentQuestion, setCurrentQuestion] = useState<Question>(PRACTICE_QUESTIONS[0]);
  
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
      streakDays: 5,
      totalPracticed: 18,
      totalMinutes: 24,
      targetRole: 'Warehouse & Logistics Staff',
      dailyGoal: 3,
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
    };
  });

  const [voiceSpeed, setVoiceSpeed] = useState<'normal' | 'slow'>('normal');

  // Save progress changes
  useEffect(() => {
    localStorage.setItem('hello_english_progress', JSON.stringify(progress));
  }, [progress]);

  // Start Practice from Home
  const handleStartPractice = (question?: Question) => {
    const targetQ = question || currentQuestion || PRACTICE_QUESTIONS[0];
    setCurrentQuestion(targetQ);
    setPracticeStep('question');
    setActiveTab('practice');
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

      // Update progress
      setProgress((prev) => ({
        ...prev,
        totalPracticed: prev.totalPracticed + 1,
        completedToday: Math.min(prev.dailyGoal, prev.completedToday + 1),
        totalMinutes: prev.totalMinutes + 1,
      }));

      setPracticeStep('result');
    } catch (err) {
      console.error('Error analyzing response:', err);
      // Fallback
      setAnalysisResult({
        learnerTranscript: transcript,
        intendedMeaning: 'You wanted to communicate clearly with your workplace team.',
        naturalEnglish: 'I will call my supervisor while I am on my way to work.',
        hindiMeaning: 'मैं काम पर जाते समय अपने सुपरवाइजर को सूचित करूंगा।',
        encouragingNote: 'Yes, I understand what you mean! Excellent attempt.',
        keyVocabulary: [
          { wordOrPhrase: 'on my way', hindiMeaning: 'रास्ते में' },
          { wordOrPhrase: 'inform my supervisor', hindiMeaning: 'सुपरवाइजर को बताना' }
        ],
        confidenceScore: 94,
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
    <main className="w-full min-h-screen bg-black flex justify-center selection:bg-amber-500/30 selection:text-amber-200">
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            onFinish={() => setShowSplash(false)}
            durationMs={3000}
          />
        )}
      </AnimatePresence>

      {/* Mobile Frame Container (Constrained on Desktop as requested) */}
      <div className="w-full max-w-[440px] min-h-screen bg-black shadow-2xl relative flex flex-col justify-between overflow-x-hidden border-x border-zinc-900">
        
        {/* VIEW ROUTING */}
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <HomeScreen
                streakDays={progress.streakDays}
                completedToday={progress.completedToday}
                dailyGoal={progress.dailyGoal}
                onStartPractice={handleStartPractice}
                onNavigateTab={(tab) => {
                  if (tab === 'practice') {
                    handleStartPractice();
                  } else {
                    setActiveTab(tab);
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
                  onBack={() => setActiveTab('home')}
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

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <ProgressView
                progress={progress}
                onSelectSavedPhrase={handleSelectSavedPhrase}
                onRemoveSavedPhrase={handleRemoveSavedPhrase}
                onStartPractice={() => handleStartPractice()}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <ProfileView
                targetRole={progress.targetRole}
                onChangeRole={(role) => setProgress((p) => ({ ...p, targetRole: role }))}
                dailyGoal={progress.dailyGoal}
                onChangeDailyGoal={(goal) => setProgress((p) => ({ ...p, dailyGoal: goal }))}
                voiceSpeed={voiceSpeed}
                onChangeVoiceSpeed={setVoiceSpeed}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING BOTTOM DOCK NAVIGATION (Only on main exploration tabs: Home, Progress, Profile) */}
        {activeTab !== 'practice' && (
          <BottomDockNav
            activeTab={activeTab}
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
