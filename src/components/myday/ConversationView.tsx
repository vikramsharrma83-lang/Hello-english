import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Activity as ActivityIcon,
  RotateCcw,
  CheckCircle2,
  ListFilter,
  Check,
} from 'lucide-react';
import { DayMap, ActiveTopic, ConversationTurn } from '../../types';
import { speakText, stopSpeaking, soundFx } from '../../utils/audio';

interface ConversationViewProps {
  dayMap: DayMap;
  selectedTopic: ActiveTopic;
  turns: ConversationTurn[];
  onLearnerAnswer: (answerText: string) => void;
  isLoading: boolean;
  onGoBackToDayMap: () => void;
  onChooseAnotherActivity: () => void;
  onEndChatTopic: () => void;
  onEndSession: () => void;
  voiceEnabled: boolean;
  isWholeStoryMode: boolean;
  onOpenPatternLibrary?: () => void;
  onOpenInspector?: () => void;
  onToggleVoice?: () => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  dayMap,
  selectedTopic,
  turns,
  onLearnerAnswer,
  isLoading,
  onGoBackToDayMap,
  onChooseAnotherActivity,
  onEndChatTopic,
  onEndSession,
  voiceEnabled,
  isWholeStoryMode,
  onOpenPatternLibrary,
  onOpenInspector,
  onToggleVoice,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [playingTurnId, setPlayingTurnId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, isLoading]);

  // Voice playback on latest system turn if voiceEnabled
  useEffect(() => {
    if (!voiceEnabled || turns.length === 0) return;
    const latestTurn = turns[turns.length - 1];
    if (latestTurn.speaker === 'system') {
      const textToPlay = latestTurn.probeQuestion
        ? `${latestTurn.rephrase || ''}. ${latestTurn.probeQuestion}`
        : latestTurn.text;

      setPlayingTurnId(latestTurn.id);
      speakText(textToPlay, 'en-IN', 0.92, () => {
        setPlayingTurnId(null);
      });
    }
  }, [turns.length, voiceEnabled]);

  // Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        soundFx.playBubbleStart();
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTrans) {
          setInputText((prev) => (prev ? `${prev.trim()} ${finalTrans.trim()}` : finalTrans.trim()));
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type your answer below!');
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
      soundFx.playBubblePop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Speech recognition start error:', e);
      }
    }
  };

  const handleSend = () => {
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }
    if (!inputText.trim() || isLoading) return;
    soundFx.playSuccessChime();
    onLearnerAnswer(inputText.trim());
    setInputText('');
  };

  const handlePlayAudio = (turn: ConversationTurn) => {
    if (playingTurnId === turn.id) {
      stopSpeaking();
      setPlayingTurnId(null);
      return;
    }
    const textToPlay = turn.probeQuestion
      ? `${turn.rephrase || ''}. ${turn.probeQuestion}`
      : turn.text;

    setPlayingTurnId(turn.id);
    speakText(textToPlay, 'en-IN', 0.92, () => {
      setPlayingTurnId(null);
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col px-4 pt-3 pb-6 text-zinc-100 max-w-[460px] mx-auto min-h-[calc(100vh-80px)]">
      {/* Top App Bar with back button on page 4 */}
      <div className="w-full flex items-center justify-between py-2 mb-3">
        {/* Left: Back Button + Title + Subtitle + Buddy Pill */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onGoBackToDayMap}
            className="w-10 h-10 rounded-full bg-[#181920] hover:bg-[#232530] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Go Back to Day Summary"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div>
            <h2 className="text-sm font-bold text-white leading-tight">Conversation Flow</h2>
            <p className="text-[11px] text-zinc-400">With Buddy</p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-950/40 border border-sky-500/40 text-sky-400 text-xs font-bold ml-1">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
            <span>Buddy</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {onOpenPatternLibrary && (
            <button
              onClick={onOpenPatternLibrary}
              className="w-9 h-9 rounded-full bg-[#181920] hover:bg-[#232530] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Patterns"
            >
              <BookOpen className="w-4 h-4 stroke-[2]" />
            </button>
          )}

          {onOpenInspector && (
            <button
              onClick={onOpenInspector}
              className="w-9 h-9 rounded-full bg-[#181920] hover:bg-[#232530] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Performance & Analysis"
            >
              <ActivityIcon className="w-4 h-4 stroke-[2]" />
            </button>
          )}

          {onToggleVoice && (
            <button
              onClick={onToggleVoice}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                voiceEnabled
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                  : 'bg-[#181920] border-zinc-800 text-zinc-400'
              }`}
              title={voiceEnabled ? 'Mute Voice' : 'Enable Voice'}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4 stroke-[2]" />
              ) : (
                <VolumeX className="w-4 h-4 stroke-[2]" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto pb-4">
        {turns.map((turn, index) => {
          if (turn.speaker === 'system') {
            const probeDirectionLabel = turn.probeDirection
              ? `${turn.probeDirection} PROBE`
              : 'FEELING PROBE';

            const rephraseText = turn.rephrase ||
              (index === 0
                ? "So, it sounds like you had a really productive and fulfilling day, starting with your trip to the market and ending with caring for your parents."
                : turn.text);

            const probeQuestionText = turn.probeQuestion ||
              (index === 0
                ? "I'd love to hear more about your day—which part of your activities felt the most special to you?"
                : "What happened next in this part of your shift?");

            return (
              <motion.div
                key={turn.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-[#14151c] border border-zinc-800 rounded-[28px] p-5 shadow-2xl flex flex-col gap-3"
              >
                {/* Top Badge & Speaker Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                      <span className="text-xs font-extrabold text-sky-400 tracking-wider uppercase">
                        BUDDY
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/50 text-rose-400 text-[10px] font-extrabold uppercase tracking-wide">
                      {probeDirectionLabel}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePlayAudio(turn)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                      playingTurnId === turn.id
                        ? 'bg-sky-500 text-white border-sky-400 animate-pulse'
                        : 'bg-[#1b1d26] hover:bg-sky-950/40 text-sky-400 border-zinc-700/80'
                    }`}
                    title="Listen to Buddy's speech"
                  >
                    <Volume2 className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>

                {/* Subcard 1: SELECTED / Natural Rephrase */}
                <div className="bg-[#1b1d26] border border-zinc-800/80 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>SELECTED:</span>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed font-normal">
                    {rephraseText}
                  </p>
                </div>

                {/* Subcard 2: BUDDY ASKING / Probe Question */}
                <div className="bg-[#1b1d26] border border-sky-500/40 rounded-2xl p-4">
                  <div className="text-sky-400 font-bold text-xs uppercase tracking-wider mb-2">
                    BUDDY ASKING:
                  </div>
                  <p className="text-sm text-zinc-100 font-medium leading-relaxed italic">
                    "{probeQuestionText}"
                  </p>
                </div>
              </motion.div>
            );
          } else {
            // Learner message bubble
            return (
              <motion.div
                key={turn.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex justify-end"
              >
                <div className="max-w-[85%] bg-[#0B69A3] text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-lg">
                  <span className="text-[10px] font-bold text-sky-200 block uppercase tracking-wider mb-0.5">
                    YOU SHARED:
                  </span>
                  <p className="text-sm font-normal leading-relaxed">
                    {turn.text}
                  </p>
                </div>
              </motion.div>
            );
          }
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-[#14151c] border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-zinc-400 font-medium">
              Buddy is thinking of the next natural probe...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Control Action Buttons: End the Chat / Choose Another Activity */}
      <div className="w-full flex items-center justify-between gap-2.5 mb-3 pt-1">
        <button
          onClick={onChooseAnotherActivity}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-[#14151c] hover:bg-[#1b1d26] border border-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ListFilter className="w-3.5 h-3.5 text-sky-400" />
          <span>Choose Another Activity</span>
        </button>

        <button
          onClick={onEndSession}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-[#14151c] hover:bg-[#1b1d26] border border-zinc-800 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>End Session</span>
          <ArrowRight className="w-3.5 h-3.5 text-rose-400 stroke-[2.2]" />
        </button>
      </div>

      {/* Bottom Chat Input Bar matching Screenshot 5 */}
      <div className="w-full bg-[#13141a] border border-zinc-800 rounded-[26px] p-2 flex items-center gap-2.5 shadow-2xl">
        {/* Mic Button */}
        <button
          onClick={toggleRecording}
          className={`w-11 h-11 rounded-full border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
            isRecording
              ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse ring-2 ring-rose-500/40'
              : 'bg-[#1e2029] hover:bg-[#282b37] border-zinc-700/80 text-sky-400'
          }`}
          title={isRecording ? 'Stop Recording' : 'Speak'}
        >
          {isRecording ? (
            <MicOff className="w-4 h-4 stroke-[2.2]" />
          ) : (
            <Mic className="w-4 h-4 stroke-[2.2]" />
          )}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Type or speak your answer..."
          className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 text-sm font-normal focus:outline-none px-1"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isLoading}
          className={`py-2.5 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
            inputText.trim() && !isLoading
              ? 'bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-md shadow-sky-950/60'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <span>Enter</span>
          <Send className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
