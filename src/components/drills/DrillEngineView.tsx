import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Target,
  X,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import {
  DrillTarget,
  QuestionAttempt,
  ScoredCoreQuestion,
  DrillScoreSummary,
} from '../../types/drillTypes';
import { LlamaDrillEvalResult, LlamaNextQuestionResult } from '../../../server/services/llamaDrillService';
import { calculateDrillScores, saveDrillSessionRecord } from '../../utils/drillScoringEngine';

interface DrillEngineViewProps {
  target: DrillTarget;
  dayNumber?: number;
  onFinishSession: (scores: DrillScoreSummary) => void;
  onExit: () => void;
}

export const DrillEngineView: React.FC<DrillEngineViewProps> = ({
  target,
  dayNumber = 1,
  onFinishSession,
  onExit,
}) => {
  // Target 5 core questions (strictly not more than 5)
  const TOTAL_TARGET_QUESTIONS = 5;

  // Session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<LlamaNextQuestionResult | null>(null);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [attemptNumberForCurrent, setAttemptNumberForCurrent] = useState<number>(1); // 1, 2 (retry 1), 3 (retry 2)
  
  // Recorded attempts & scored questions
  const [allAttempts, setAllAttempts] = useState<QuestionAttempt[]>([]);
  const [scoredQuestions, setScoredQuestions] = useState<ScoredCoreQuestion[]>([]);
  const [currentQuestionAttempts, setCurrentQuestionAttempts] = useState<QuestionAttempt[]>([]);

  // UI & Voice interaction states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastEvaluation, setLastEvaluation] = useState<LlamaDrillEvalResult | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');
  const [showRetryPrompt, setShowRetryPrompt] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Optimized for Indian English

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error in Drill:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    // Load Question 1
    fetchNextQuestion(1, []);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Fetch contextual question from API
  const fetchNextQuestion = async (qNum: number, pastQuestions: string[]) => {
    setIsProcessing(true);
    setLastEvaluation(null);
    setShowRetryPrompt(false);
    setTranscript('');
    setManualText('');
    setAttemptNumberForCurrent(1);
    setCurrentQuestionAttempts([]);

    try {
      const res = await fetch('/api/drill/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          questionNumber: qNum,
          previousQuestions: pastQuestions,
        }),
      });
      const data = await res.json();
      setCurrentQuestion(data);
      setQuestionHistory((prev) => [...prev, data.question]);

      // Play question via TTS
      speakText(data.question);
    } catch (err) {
      console.error('Failed to load drill question:', err);
      const fallback = {
        question: `How would you describe your main goal or task for today?`,
        context: 'Daily focus',
        hintsOrScenario: 'General practice',
      };
      setCurrentQuestion(fallback);
      setQuestionHistory((prev) => [...prev, fallback.question]);
      speakText(fallback.question);
    } finally {
      setIsProcessing(false);
    }
  };

  // Natural TTS
  const speakText = async (text: string) => {
    if (!text) return;
    try {
      setIsAudioPlaying(true);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (data.audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
        audioRef.current = audio;
        audio.onended = () => setIsAudioPlaying(false);
        audio.onerror = () => {
          fallbackBrowserSpeak(text);
        };
        await audio.play();
      } else {
        fallbackBrowserSpeak(text);
      }
    } catch (e) {
      fallbackBrowserSpeak(text);
    }
  };

  const fallbackBrowserSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsAudioPlaying(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          console.warn('Recognition start failed:', e);
        }
      }
    }
  };

  // Submit learner's spoken or typed answer
  const handleSubmitAnswer = async () => {
    const rawAnswer = (transcript || manualText).trim();
    if (!rawAnswer || !currentQuestion) return;

    setIsProcessing(true);

    try {
      const res = await fetch('/api/drill/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          questionText: currentQuestion.question,
          learnerResponse: rawAnswer,
          attemptNumber: attemptNumberForCurrent,
        }),
      });

      const evaluation: LlamaDrillEvalResult = await res.json();
      setLastEvaluation(evaluation);

      // Create structured attempt
      const attempt: QuestionAttempt = {
        questionId: `q_${currentQuestionIndex + 1}`,
        questionText: currentQuestion.question,
        context: currentQuestion.context,
        attemptNumber: attemptNumberForCurrent,
        learnerRawText: rawAnswer,
        isRetry: attemptNumberForCurrent > 1,
        communicationSuccessful: evaluation.communicationSuccessful,
        targetSkillDemonstrated: evaluation.targetSkillDemonstrated,
        targetErrorPresent: evaluation.targetErrorPresent,
        sentenceClarity: evaluation.sentenceClarity,
        relevantGrammarCorrect: evaluation.relevantGrammarCorrect,
        hasRelevantGrammarEvidence: evaluation.hasRelevantGrammarEvidence,
        naturalCorrection: evaluation.naturalCorrection,
        retryRecommended: evaluation.retryRecommended,
        feedbackToLearner: evaluation.feedbackToLearner,
        errorType: evaluation.errorType,
      };

      const updatedAttempts = [...allAttempts, attempt];
      const updatedCurrentAttempts = [...currentQuestionAttempts, attempt];
      setAllAttempts(updatedAttempts);
      setCurrentQuestionAttempts(updatedCurrentAttempts);

      // If target skill is not demonstrated on first attempt, offer a gentle retry
      if (
        !evaluation.targetSkillDemonstrated &&
        attemptNumberForCurrent === 1 &&
        evaluation.retryRecommended
      ) {
        setShowRetryPrompt(true);
        speakText(
          `${evaluation.feedbackToLearner} For example: "${evaluation.naturalCorrection}". Would you like to try saying that once?`
        );
      } else {
        // Resolve question and advance
        setShowRetryPrompt(false);
        resolveCurrentQuestionAndAdvance(updatedCurrentAttempts, updatedAttempts);
      }
    } catch (err) {
      console.error('Error submitting drill answer:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Resolve core question scoring and move to next question or summary
  const resolveCurrentQuestionAndAdvance = (
    attemptsForThisQ: QuestionAttempt[],
    allAccAttempts: QuestionAttempt[]
  ) => {
    if (!currentQuestion) return;

    const firstAttempt = attemptsForThisQ[0];
    const retryAttempt = attemptsForThisQ.find((a) => a.isRetry);

    let score = 0.0;
    let firstAttemptCorrect = false;
    let requiredRetry = false;
    let correctAfterRetry = false;
    let targetDemonstrated = false;

    if (firstAttempt && firstAttempt.targetSkillDemonstrated) {
      score = 1.0;
      firstAttemptCorrect = true;
      targetDemonstrated = true;
    } else if (retryAttempt && retryAttempt.targetSkillDemonstrated) {
      score = 0.5;
      requiredRetry = true;
      correctAfterRetry = true;
      targetDemonstrated = true;
    } else if (firstAttempt && !firstAttempt.targetSkillDemonstrated) {
      score = 0.0;
      requiredRetry = true;
      correctAfterRetry = false;
      targetDemonstrated = false;
    }

    const scoredQ: ScoredCoreQuestion = {
      questionNumber: currentQuestionIndex + 1,
      questionText: currentQuestion.question,
      context: currentQuestion.context,
      attempts: attemptsForThisQ,
      score,
      firstAttemptCorrect,
      requiredRetry,
      correctAfterRetry,
      targetDemonstrated,
      bestOriginalAttempt: firstAttempt?.learnerRawText,
      bestCorrection: firstAttempt?.naturalCorrection,
    };

    const newScoredQuestions = [...scoredQuestions, scoredQ];
    setScoredQuestions(newScoredQuestions);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= TOTAL_TARGET_QUESTIONS) {
      // Completed drill session!
      finishSession(newScoredQuestions, allAccAttempts, 'COMPLETED');
    } else {
      setCurrentQuestionIndex(nextIndex);
      fetchNextQuestion(nextIndex + 1, questionHistory);
    }
  };

  // Handle explicit Retry click
  const handleStartRetry = () => {
    setAttemptNumberForCurrent((prev) => prev + 1);
    setTranscript('');
    setManualText('');
    setShowRetryPrompt(false);
  };

  // Skip retry and proceed
  const handleSkipRetry = () => {
    setShowRetryPrompt(false);
    resolveCurrentQuestionAndAdvance(currentQuestionAttempts, allAttempts);
  };

  // Finalize session and calculate mathematical scores
  const finishSession = (
    finalScoredQs: ScoredCoreQuestion[],
    finalAttempts: QuestionAttempt[],
    status: 'COMPLETED' | 'STOPPED_EARLY'
  ) => {
    const scores = calculateDrillScores(target, finalScoredQs, finalAttempts);

    // Save session record for Day 10, Day 15, Day 20 longitudinal tracking
    saveDrillSessionRecord({
      sessionId: `drill_${Date.now()}`,
      dayNumber,
      timestamp: Date.now(),
      target,
      questionsAttemptedCount: finalScoredQs.length,
      coreQuestions: finalScoredQs,
      scores,
      completionStatus: status,
    });

    onFinishSession(scores);
  };

  const handleEarlyExit = () => {
    // If learner wants to stop, end immediately and calculate scores based on completed attempts
    finishSession(scoredQuestions, allAttempts, 'STOPPED_EARLY');
  };

  return (
    <div className="w-full flex-1 flex flex-col px-4 pt-4 pb-20 text-zinc-100 max-w-[480px] mx-auto font-sans min-h-[calc(100vh-80px)]">
      {/* Top Bar with Target Pill and Close/Stop Button */}
      <div className="w-full flex items-center justify-between py-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
              Engine 2 • Drills
            </div>
            <div className="text-xs font-semibold text-zinc-200 line-clamp-1 max-w-[210px]">
              {target.title}
            </div>
          </div>
        </div>

        {/* Early Exit / End Session */}
        <button
          onClick={handleEarlyExit}
          className="px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-semibold border border-zinc-700/60 transition-colors flex items-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          <span>End</span>
        </button>
      </div>

      {/* Progress Bar (5–7 Questions) */}
      <div className="w-full bg-[#14151c] border border-zinc-800/90 rounded-2xl p-3 mb-4 shadow-md flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-200">
            Question {Math.min(TOTAL_TARGET_QUESTIONS, currentQuestionIndex + 1)} of {TOTAL_TARGET_QUESTIONS}
          </span>
          <span className="text-[11px] text-zinc-400">
            {currentQuestionIndex >= TOTAL_TARGET_QUESTIONS
              ? 'Complete'
              : `${TOTAL_TARGET_QUESTIONS - currentQuestionIndex} remaining`}
          </span>
        </div>
        <div className="w-full grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((num) => {
            const isDone = num <= currentQuestionIndex;
            const isCurrent = num === currentQuestionIndex + 1;
            return (
              <div
                key={num}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                    : isCurrent
                    ? 'bg-sky-500/50 animate-pulse'
                    : 'bg-zinc-800'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div
            key={currentQuestion.question}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full bg-gradient-to-b from-[#1a1b24] to-[#14151c] border border-zinc-800/90 rounded-2xl p-4 shadow-lg mb-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                {currentQuestion.context || 'Practical Situation'}
              </span>
              <button
                onClick={() => speakText(currentQuestion.question)}
                className={`p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 bg-zinc-800/60 hover:bg-zinc-700/60 transition-colors ${
                  isAudioPlaying ? 'text-sky-400 animate-pulse' : ''
                }`}
                title="Listen to question"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-base font-semibold text-zinc-100 leading-snug mt-1">
              "{currentQuestion.question}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Evaluation / Retry Banner */}
      {showRetryPrompt && lastEvaluation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-4 flex flex-col gap-2.5"
        >
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-bold text-amber-300">Natural Phrasing Tip</div>
              <div className="text-sm text-zinc-200 mt-1 font-medium">
                "{lastEvaluation.naturalCorrection}"
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleStartRetry}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry with this phrase</span>
            </button>
            <button
              onClick={handleSkipRetry}
              className="py-2 px-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs hover:bg-zinc-700 transition-colors"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}

      {/* Learner Speech/Input Area */}
      <div className="w-full flex-1 flex flex-col justify-end gap-3 mt-auto">
        {/* Live Transcript / Input Display / Chat Box */}
        <div className="w-full bg-[#12131a] border border-zinc-800 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="text-xs text-zinc-400 mb-1 flex items-center justify-between">
            <span>Your Response {attemptNumberForCurrent > 1 ? `(Retry ${attemptNumberForCurrent - 1})` : ''}</span>
            {isRecording && (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold animate-pulse text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Listening...
              </span>
            )}
          </div>

          <textarea
            value={transcript || manualText}
            onChange={(e) => {
              setManualText(e.target.value);
              setTranscript(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitAnswer();
              }
            }}
            placeholder="Type your answer here or tap 'Speak Answer'..."
            className="w-full bg-transparent text-sm text-zinc-100 font-medium leading-relaxed resize-none focus:outline-none min-h-[70px]"
            rows={2}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Big Mic Button */}
          <button
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                : 'bg-sky-500 hover:bg-sky-400 text-zinc-950 shadow-sky-500/20'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isRecording ? 'Stop Speaking' : 'Speak Answer'}</span>
          </button>

          {/* Submit Answer Button */}
          <button
            onClick={handleSubmitAnswer}
            disabled={isProcessing || (!transcript.trim() && !manualText.trim())}
            className="py-3.5 px-5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-100 font-bold text-sm transition-colors flex items-center gap-2 border border-zinc-700/70"
          >
            <span>{isProcessing ? 'Checking...' : 'Check'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
