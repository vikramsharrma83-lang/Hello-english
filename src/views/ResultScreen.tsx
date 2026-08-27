import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  ArrowRight,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Heart,
  CheckCircle2,
  Square,
  HelpCircle,
} from 'lucide-react';
import { CoachNehaAvatar } from '../components/CoachNehaAvatar';
import { AnalysisResult, Question } from '../types';
import { speakText, stopSpeaking, soundFx } from '../utils/audio';

interface ResultScreenProps {
  question: Question;
  result: AnalysisResult;
  onTryAgain: () => void;
  onNextQuestion: () => void;
  onSavePhrase?: (saved: boolean) => void;
  isSaved?: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  question,
  result,
  onTryAgain,
  onNextQuestion,
  onSavePhrase,
  isSaved = false,
}) => {
  const [isPlayingCoach, setIsPlayingCoach] = useState<boolean>(false);
  const [isPlayingLearner, setIsPlayingLearner] = useState<boolean>(false);
  const [isPlayingHindi, setIsPlayingHindi] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.92);
  const [saved, setSaved] = useState<boolean>(isSaved);

  useEffect(() => {
    // Play celebratory sound & soft confetti burst
    soundFx.playSuccessChime();
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#D6A9FF', '#FFAEC9', '#90E0EF', '#FFE180'],
      });
    } catch (e) {}

    // Automatically speak Coach Neha's improved sentence
    const timer = setTimeout(() => {
      handlePlayCoachAudio();
    }, 600);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, []);

  const handlePlayCoachAudio = (rate?: number) => {
    const activeRate = rate || speechRate;
    if (isPlayingCoach) {
      stopSpeaking();
      setIsPlayingCoach(false);
      return;
    }
    stopSpeaking();
    setIsPlayingLearner(false);
    setIsPlayingHindi(false);
    setIsPlayingCoach(true);

    speakText(result.naturalEnglish, 'en-IN', activeRate, () => {
      setIsPlayingCoach(false);
    });
  };

  const handlePlayHindiAudio = () => {
    if (isPlayingHindi) {
      stopSpeaking();
      setIsPlayingHindi(false);
      return;
    }
    stopSpeaking();
    setIsPlayingCoach(false);
    setIsPlayingLearner(false);
    setIsPlayingHindi(true);

    speakText(result.hindiMeaning, 'hi-IN', 0.9, () => {
      setIsPlayingHindi(false);
    });
  };

  const handlePlayLearnerAudio = () => {
    if (isPlayingLearner) {
      stopSpeaking();
      setIsPlayingLearner(false);
      return;
    }
    stopSpeaking();
    setIsPlayingCoach(false);
    setIsPlayingHindi(false);
    setIsPlayingLearner(true);

    speakText(result.learnerTranscript, 'en-IN', 0.95, () => {
      setIsPlayingLearner(false);
    });
  };

  const handleToggleSave = () => {
    const nextState = !saved;
    setSaved(nextState);
    if (onSavePhrase) {
      onSavePhrase(nextState);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#FDF4FF] via-[#F8F7FF] to-[#FFF1F5] text-slate-900 flex flex-col justify-between pb-6 pt-3 px-4 sm:px-5">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between py-2 border-b border-[#E9D5FF]/70">
          <button
            onClick={onTryAgain}
            className="w-10 h-10 rounded-full bg-white/95 border border-[#E9D5FF] flex items-center justify-center text-slate-700 hover:bg-[#FAF5FF] hover:border-[#D8B4FE] transition-colors shadow-2xs cursor-pointer"
            aria-label="Try again"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
              HELLO ENGLISH
            </span>
            <span className="text-sm font-extrabold text-slate-900">
              Practice Feedback
            </span>
          </div>

          {/* Save phrase bookmark button */}
          <button
            onClick={handleToggleSave}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors shadow-2xs cursor-pointer ${
              saved
                ? 'bg-[#FFF1F2] text-[#E11D48] border-[#FDA4AF]'
                : 'bg-white/95 text-slate-600 border-[#E9D5FF] hover:bg-[#FAF5FF]'
            }`}
            title={saved ? 'Saved to Practice Book' : 'Save to Practice Book'}
          >
            {saved ? (
              <BookmarkCheck className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Bookmark className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>
        </div>

        {/* Coach Neha Supportive Greeting Banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 mb-3 rounded-2xl bg-gradient-to-r from-[#FAF5FF] via-[#FFF1F2] to-[#F0FDF4] p-3.5 border border-[#E9D5FF] flex items-center gap-3 pastel-card-shadow"
        >
          <div className="shrink-0">
            <CoachNehaAvatar size="md" isSpeaking={isPlayingCoach} />
          </div>
          <div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#7C3AED]">
              <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
              Coach Neha says
            </div>
            <p className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-snug">
              “Yes, I understand what you mean!”
            </p>
            <p className="text-[10px] font-medium text-slate-500 mt-0.5">
              {result.encouragingNote || 'Great attempt! Here is how to express it with natural confidence.'}
            </p>
          </div>
        </motion.div>

        {/* TWO LARGE ROUNDED CARDS (Core Product Feature) */}
        <div className="space-y-3.5 mt-2">
          {/* CARD 1 — What you said (Soft Pastel Lavender Card) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#EDE9FE] border border-[#DDD6FE] pastel-card-shadow relative"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#6D28D9] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                What you said
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#6D28D9] border border-[#DDD6FE]">
                Recorded
              </span>
            </div>

            <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
              “{result.learnerTranscript}”
            </p>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#DDD6FE]/80">
              <button
                onClick={handlePlayLearnerAudio}
                className="text-xs font-bold text-[#6D28D9] hover:text-slate-900 inline-flex items-center gap-1.5 cursor-pointer"
              >
                {isPlayingLearner ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-[#6D28D9]" />
                    <span>Playing your voice...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen to your recording</span>
                  </>
                )}
              </button>

              <span className="text-[10px] font-medium text-slate-500">
                Clear understanding ✓
              </span>
            </div>
          </motion.div>

          {/* CARD 2 — What you want to say (AI's Natural Interpretation Card) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#FFFBEB] via-[#FFF1F2] to-[#FAF5FF] border-2 border-[#FED7AA] pastel-card-glow relative overflow-hidden"
          >
            {/* Header pill with high encouragement */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white text-xs font-extrabold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                What you want to say
              </div>

              {/* Speed Toggle for Listen */}
              <div className="flex items-center gap-1 bg-white/90 border border-[#E9D5FF] p-0.5 rounded-full text-[10px] font-bold">
                <button
                  onClick={() => {
                    setSpeechRate(0.92);
                    handlePlayCoachAudio(0.92);
                  }}
                  className={`px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                    speechRate === 0.92 ? 'bg-[#7C3AED] text-white' : 'text-slate-600'
                  }`}
                >
                  1.0x
                </button>
                <button
                  onClick={() => {
                    setSpeechRate(0.78);
                    handlePlayCoachAudio(0.78);
                  }}
                  className={`px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                    speechRate === 0.78 ? 'bg-[#7C3AED] text-white' : 'text-slate-600'
                  }`}
                >
                  Slow 0.8x
                </button>
              </div>
            </div>

            {/* Improved English Sentence */}
            <div className="my-3">
              <p className="text-base sm:text-lg font-extrabold text-slate-900 leading-relaxed">
                “{result.naturalEnglish}”
              </p>
            </div>

            {/* Hindi Translation Pill Box */}
            <div className="p-3 rounded-2xl bg-white/90 border border-[#FED7AA] text-xs font-semibold text-slate-700 leading-relaxed flex items-start justify-between gap-2">
              <div>
                <span className="font-bold text-[#C2410C] mr-1.5">हिंदी अर्थ:</span>
                {result.hindiMeaning}
              </div>
              <button
                onClick={handlePlayHindiAudio}
                className="shrink-0 p-1.5 rounded-full bg-[#FFF1F2] border border-[#FDA4AF] text-[#BE123C] hover:bg-[#FFE4E6] transition-colors cursor-pointer"
                title="हिंदी में सुनें (Listen in Hindi)"
                aria-label="Listen in Hindi"
              >
                {isPlayingHindi ? (
                  <Square className="w-3.5 h-3.5 fill-[#BE123C]" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Listen Button Pill */}
            <button
              onClick={() => handlePlayCoachAudio()}
              className={`mt-4 w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-2xs ${
                isPlayingCoach
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white border-[#7C3AED] shadow-md shadow-[#7C3AED]/25'
                  : 'bg-white text-slate-800 border-[#E9D5FF] hover:bg-[#FAF5FF] hover:border-[#D8B4FE]'
              }`}
            >
              {isPlayingCoach ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Coach Neha is speaking...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#7C3AED]" />
                  <span>🔊 Listen to Coach Neha pronounce it</span>
                </>
              )}
            </button>

            {/* Key Vocabulary Highlights */}
            {result.keyVocabulary && result.keyVocabulary.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#FED7AA]/60">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C3AED] block mb-2">
                  Useful Workplace Phrases
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.keyVocabulary.map((vocab, vIdx) => (
                    <div
                      key={vIdx}
                      className="px-3 py-1.5 rounded-xl bg-white/95 border border-[#E9D5FF] flex items-center gap-1.5 text-xs font-bold text-slate-800 shadow-2xs"
                    >
                      <span className="text-[#7C3AED] font-extrabold">{vocab.wordOrPhrase}</span>
                      <span className="text-[10px] font-medium text-slate-500">
                        ({vocab.hindiMeaning})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* BOTTOM ACTIONS: Try Again & Next Question */}
      <div className="sticky bottom-0 mt-6 pt-3 pb-2 bg-gradient-to-t from-[#FFF1F5] via-[#FFF1F5]/95 to-transparent backdrop-blur-xs z-20 grid grid-cols-2 gap-3">
        {/* Button 1: 🎤 Try Again */}
        <button
          onClick={() => {
            stopSpeaking();
            onTryAgain();
          }}
          className="py-3.5 px-4 rounded-2xl bg-white border border-[#E9D5FF] text-slate-800 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#FAF5FF] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-[#7C3AED]" />
          <span>🎤 Try Again</span>
        </button>

        {/* Button 2: → Next Question */}
        <button
          onClick={() => {
            stopSpeaking();
            onNextQuestion();
          }}
          className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#DB2777] to-[#EA580C] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#DB2777]/30 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Next Question</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
