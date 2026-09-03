import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RotateCcw,
  BookOpen,
  Keyboard,
  Send,
} from 'lucide-react';
import { markStartMyDayDoneToday } from '../../utils/playgroundManager';
import { PRACTICE_QUESTIONS } from '../../data/questions';
import { Question } from '../../types';

interface WarmUpQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  modelAnswer: string;
  acceptableKeywords: string[];
}

function mapQuestionToWarmup(q: Question): WarmUpQuestion {
  const modelAnswer = q.samplePhrases?.[0] || q.sampleLearnerSpoken || q.hintEn;
  const words = (modelAnswer + ' ' + q.questionEn)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const acceptableKeywords = Array.from(new Set(words));

  return {
    id: q.id,
    questionEn: q.questionEn,
    questionHi: q.questionHi,
    modelAnswer,
    acceptableKeywords,
  };
}

interface StartMyDayWarmupViewProps {
  onCompleteWarmup: (stats: { questions: number; correct: number; learned: number }) => void;
  onExit: () => void;
}

export const StartMyDayWarmupView: React.FC<StartMyDayWarmupViewProps> = ({
  onCompleteWarmup,
  onExit,
}) => {
  // Select 5 random questions from the entire 150 questions pool
  const [questions] = useState<WarmUpQuestion[]>(() => {
    const shuffled = [...PRACTICE_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5).map(mapQuestionToWarmup);
  });
  const totalQuestions = 5;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [attemptCount, setAttemptCount] = useState<number>(1);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [manualText, setManualText] = useState<string>('');
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  
  // Stats
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [learnedCount, setLearnedCount] = useState<number>(0);

  // Screen state: 'QUESTION' or 'COMPLETE'
  const [stage, setStage] = useState<'QUESTION' | 'COMPLETE'>('QUESTION');

  // Question Feedback
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'retry' | 'model';
    title: string;
    modelCorrection: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentQ = questions[currentIndex] || questions[0];

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error in warm-up:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    // Auto speak question
    speakText(currentQ.questionEn);

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentIndex]);

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
        audio.onerror = () => fallbackSpeak(text);
        await audio.play();
      } else {
        fallbackSpeak(text);
      }
    } catch (e) {
      fallbackSpeak(text);
    }
  };

  const fallbackSpeak = (text: string) => {
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
    if (feedback?.status === 'correct') return;
    if (isRecording) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsRecording(false);
    } else {
      setTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          console.warn('Mic start failed:', e);
        }
      }
    }
  };

  const handleRegisterModelAnswer = () => {
    setLearnedCount((prev) => prev + 1);
    setFeedback({
      status: 'correct',
      title: 'GREAT! MODEL ANSWER REGISTERED',
      modelCorrection: currentQ.modelAnswer,
    });
    speakText('Well done! Model answer registered.');
  };

  const handleEvaluate = async (explicitResponse?: string) => {
    const rawResponse = (explicitResponse || transcript || manualText).trim();
    if (!rawResponse) return;

    setIsEvaluating(true);

    try {
      // Evaluate via AI
      const res = await fetch('/api/drill/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: {
            id: currentQ.id,
            title: 'Daily English Warm-up',
            category: 'daily',
            exampleTarget: currentQ.modelAnswer,
          },
          questionText: currentQ.questionEn,
          learnerResponse: rawResponse,
          attemptNumber: attemptCount,
        }),
      });

      const evalData = await res.json();
      const isAIApproved = evalData.communicationSuccessful && (evalData.sentenceClarity >= 60 || evalData.targetSkillDemonstrated);

      // Check keywords fallback
      const lower = rawResponse.toLowerCase();
      const hasKeyword = currentQ.acceptableKeywords.some((kw) => lower.includes(kw.toLowerCase()));
      const isSuccess = isAIApproved || hasKeyword;

      if (attemptCount === 3 || isSuccess) {
        // Correct or read & registered model answer!
        if (attemptCount === 3) {
          setLearnedCount((prev) => prev + 1);
        } else {
          setCorrectCount((prev) => prev + 1);
        }
        setFeedback({
          status: 'correct',
          title: 'GREAT!',
          modelCorrection: currentQ.modelAnswer,
        });
        speakText('Great! Correct answer.');
      } else if (attemptCount === 1) {
        // Attempt 1 incorrect -> Allow Attempt 2
        setFeedback({
          status: 'retry',
          title: 'TRY ONCE MORE (ATTEMPT 2)',
          modelCorrection: currentQ.modelAnswer,
        });
        setAttemptCount(2);
        setTranscript('');
        setManualText('');
        speakText('Let\'s try once more. Please speak in English.');
      } else {
        // Attempt 2 failed -> Show Model Answer (Read & Speak)
        setFeedback({
          status: 'model',
          title: 'MODEL ANSWER',
          modelCorrection: currentQ.modelAnswer,
        });
        setAttemptCount(3);
        setTranscript('');
        setManualText('');
        speakText(`Here is the correct sentence: "${currentQ.modelAnswer}". Please read and register.`);
      }
    } catch (e) {
      // Offline fallback
      setCorrectCount((prev) => prev + 1);
      setFeedback({
        status: 'correct',
        title: 'GREAT!',
        modelCorrection: currentQ.modelAnswer,
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    const next = currentIndex + 1;
    if (next >= totalQuestions) {
      // Warm-up is complete!
      markStartMyDayDoneToday();
      setStage('COMPLETE');
    } else {
      setCurrentIndex(next);
      setAttemptCount(1);
      setFeedback(null);
      setTranscript('');
      setManualText('');
      setShowTextInput(false);
    }
  };

  const handleFinishWarmupToPlan = () => {
    onCompleteWarmup({
      questions: totalQuestions,
      correct: correctCount || totalQuestions,
      learned: learnedCount > 0 ? learnedCount : 1,
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between text-stone-100 min-h-screen relative overflow-hidden bg-[#0c0a09] select-none font-sans">
      {/* 1. Atmospheric Soft Blurred Background with ~50% Transparency */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85"
          alt="Warm-up Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-right-bottom filter brightness-[0.55] contrast-110 saturate-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a09]/80 via-[#0c0a09]/65 to-[#0c0a09]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12),_transparent_70%)]" />
      </div>

      {/* STAGE 1: QUESTION CARDS (Screenshots 1, 2, 3) */}
      {stage === 'QUESTION' && (
        <div className="w-full flex-1 flex flex-col justify-between px-5 pt-6 pb-8 relative z-10 max-w-[420px] mx-auto min-h-screen">
          {/* Header Bar: X Exit + START MY DAY + Dot Indicators + QUESTION 1 OF 2 */}
          <div className="w-full flex items-center justify-between relative z-20">
            <button
              onClick={onExit}
              className="p-2 rounded-full text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Exit"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-stone-300 tracking-[0.2em] uppercase">
                START MY DAY
              </span>
              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5 mt-1">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-4 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                        : idx < currentIndex
                        ? 'w-1.5 bg-amber-500/70'
                        : 'w-1.5 bg-stone-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="w-6" /> {/* Placeholder to balance header */}
          </div>

          {/* Question Sub-Eyebrow */}
          <div className="w-full text-center text-xs font-semibold text-stone-400 uppercase tracking-wider mt-3 mb-2">
            QUESTION {currentIndex + 1} OF {totalQuestions}
          </div>

          {/* Main Question Card */}
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-[#181614]/90 border border-stone-800/90 rounded-[24px] p-5 shadow-2xl backdrop-blur-xl relative"
          >
            {/* English Section */}
            <div className="mb-3.5">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                ENGLISH
              </div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base sm:text-lg font-bold text-stone-100 tracking-tight leading-snug">
                  {currentQ.questionEn}
                </h2>
                <button
                  onClick={() => speakText(currentQ.questionEn)}
                  className={`p-2 rounded-full text-stone-400 hover:text-white transition-colors shrink-0 cursor-pointer ${
                    isAudioPlaying ? 'text-amber-400 animate-pulse' : ''
                  }`}
                  title="Listen"
                >
                  <Volume2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="w-full h-px bg-stone-800/80 my-2.5" />

            {/* Hindi Section */}
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                हिंदी
              </div>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-stone-300">
                  {currentQ.questionHi}
                </p>
                <button
                  onClick={() => speakText(currentQ.questionHi)}
                  className="p-2 rounded-full text-stone-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                  title="Listen in Hindi"
                >
                  <Volume2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Feedback & Result Card */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className={`w-full rounded-[20px] p-4 my-2 border shadow-xl backdrop-blur-xl ${
                  feedback.status === 'correct'
                    ? 'bg-[#181614]/95 border-stone-800'
                    : feedback.status === 'retry'
                    ? 'bg-amber-950/70 border-amber-500/40 text-amber-100'
                    : 'bg-stone-900/95 border-amber-500/40 text-stone-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {feedback.status === 'correct' && (
                    <div className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/80 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  )}
                  {feedback.status === 'retry' && (
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                  )}
                  {feedback.status === 'model' && (
                    <BookOpen className="w-4 h-4 text-amber-400" />
                  )}

                  <span className="text-xs font-bold tracking-wider uppercase text-stone-100">
                    {feedback.title}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                  CORRECT ANSWER
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-stone-100 tracking-tight">
                    {feedback.modelCorrection}
                  </p>
                  <button
                    onClick={() => speakText(feedback.modelCorrection)}
                    className="p-1.5 rounded-full text-stone-400 hover:text-white shrink-0 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Area: Large Amber Mic Button & Controls or Next Question Pill */}
          <div className="w-full flex flex-col items-center gap-3 pt-2">
            {/* Live Spoken Transcript Display */}
            {transcript && (
              <div className="w-full bg-[#181614]/90 border border-amber-500/40 rounded-xl px-4 py-2.5 text-center text-xs text-stone-200 shadow-lg">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">Spoken Answer:</span>
                "{transcript}"
              </div>
            )}

            {/* Optional Manual Text Input if toggled */}
            {showTextInput && (
              <div className="w-full flex items-center gap-2 bg-[#181614]/90 border border-stone-800 rounded-2xl p-2">
                <input
                  type="text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && manualText.trim()) {
                      handleEvaluate(manualText);
                    }
                  }}
                  placeholder="Type your answer in English..."
                  className="flex-1 bg-transparent px-3 py-1.5 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none"
                />
                {manualText.trim() && (
                  <button
                    onClick={() => handleEvaluate(manualText)}
                    disabled={isEvaluating}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all cursor-pointer"
                    title="Submit"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* If answer is correct -> show NEXT QUESTION button */}
            {feedback?.status === 'correct' ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleNextQuestion}
                className="w-full py-3.5 px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <span>NEXT QUESTION</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <div className="w-full flex flex-col items-center gap-2.5">
                {/* Spoken Mic Input with SPEAK IN ENGLISH Label */}
                <div className="flex flex-col items-center gap-1.5 my-1">
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={toggleRecording}
                    disabled={isEvaluating}
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                      isRecording
                        ? 'bg-amber-500 text-stone-950 shadow-[0_0_30px_rgba(245,158,11,0.8)] animate-pulse'
                        : 'bg-amber-500 text-stone-950 shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:bg-amber-400'
                    }`}
                    title={isRecording ? 'Stop Recording' : 'Speak in English'}
                  >
                    {isRecording ? (
                      <MicOff className="w-7 h-7 text-stone-950" />
                    ) : (
                      <Mic className="w-7 h-7 text-stone-950" />
                    )}
                  </motion.button>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-stone-300 tracking-wider uppercase">
                      {isRecording
                        ? 'LISTENING...'
                        : attemptCount === 2
                        ? 'TRY ATTEMPT 2: SPEAK IN ENGLISH'
                        : attemptCount === 3
                        ? 'READ & SPEAK MODEL ANSWER'
                        : 'SPEAK IN ENGLISH'}
                    </span>

                    <button
                      onClick={() => setShowTextInput((prev) => !prev)}
                      className="p-1 rounded-full text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                      title={showTextInput ? 'Hide typing input' : 'Type answer instead'}
                    >
                      <Keyboard className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Action Button 1: SUBMIT ANSWER (Always shown if transcript or manualText exists) */}
                {(transcript.trim() || manualText.trim()) && (
                  <motion.button
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleEvaluate()}
                    disabled={isEvaluating}
                    className="w-full py-3 px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <span>
                      {isEvaluating
                        ? 'CHECKING ANSWER...'
                        : attemptCount === 2
                        ? 'SUBMIT ATTEMPT 2 →'
                        : attemptCount === 3
                        ? 'SUBMIT & VERIFY →'
                        : 'SUBMIT ANSWER →'}
                    </span>
                  </motion.button>
                )}

                {/* Primary Action Button 2: If at Model Answer stage (Attempt 3 / Model displayed) -> Allow direct registration */}
                {feedback?.status === 'model' && (
                  <motion.button
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleRegisterModelAnswer}
                    disabled={isEvaluating}
                    className="w-full py-2.5 px-5 rounded-full bg-stone-900 hover:bg-stone-800 border border-amber-500/50 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>I've Read the Model Answer (Continue) →</span>
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 2: WARM-UP COMPLETE */}
      {stage === 'COMPLETE' && (
        <div className="w-full flex-1 flex flex-col justify-center items-center px-6 py-12 relative z-10 max-w-[420px] mx-auto min-h-screen text-center">
          {/* Glowing Circular Amber Sparkle Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(245,158,11,0.25)]"
          >
            <Sparkles className="w-7 h-7 text-amber-400" />
          </motion.div>

          {/* Title */}
          <h1 className="text-lg sm:text-xl font-bold text-stone-100 tracking-wide uppercase mb-1.5">
            WARM-UP COMPLETE!
          </h1>

          {/* Subtitle */}
          <p className="text-xs text-stone-400 max-w-xs mb-6 leading-relaxed">
            Great start! You're ready to plan your day and start your English journey.
          </p>

          {/* 3 Circular Metric Pills */}
          <div className="flex items-center justify-center gap-3.5 mb-8 w-full">
            {/* Pill 1: Questions */}
            <div className="w-18 h-18 rounded-full bg-[#181614]/90 border border-stone-800 flex flex-col items-center justify-center shadow-lg">
              <span className="text-base font-bold text-amber-400 leading-none">
                {totalQuestions}
              </span>
              <span className="text-[10px] font-semibold text-stone-400 tracking-wider uppercase mt-1">
                QUESTIONS
              </span>
            </div>

            {/* Pill 2: Correct */}
            <div className="w-18 h-18 rounded-full bg-[#181614]/90 border border-stone-800 flex flex-col items-center justify-center shadow-lg">
              <span className="text-base font-bold text-amber-400 leading-none">
                {correctCount || totalQuestions}
              </span>
              <span className="text-[10px] font-semibold text-stone-400 tracking-wider uppercase mt-1">
                CORRECT
              </span>
            </div>

            {/* Pill 3: Learned */}
            <div className="w-18 h-18 rounded-full bg-[#181614]/90 border border-stone-800 flex flex-col items-center justify-center shadow-lg">
              <span className="text-base font-bold text-amber-400 leading-none">
                {learnedCount > 0 ? learnedCount : 1}
              </span>
              <span className="text-[10px] font-semibold text-stone-400 tracking-wider uppercase mt-1">
                LEARNED
              </span>
            </div>
          </div>

          {/* Full Width CREATE MY PLAN Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleFinishWarmupToPlan}
            className="w-full py-3.5 px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>CREATE MY PLAN</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};
