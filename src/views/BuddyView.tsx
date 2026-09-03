import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  Bot, 
  User, 
  Sparkles, 
  ArrowLeft, 
  MessageSquare, 
  CheckCircle2, 
  Award, 
  Target, 
  ArrowRight,
  RotateCcw,
  TrendingUp,
  Check,
  FileText,
} from 'lucide-react';
import { speakText, soundFx } from '../utils/audio';
import { EnglishProgressScreen } from '../components/myday/EnglishProgressScreen';

interface BuddyMessage {
  id: string;
  sender: 'buddy' | 'user';
  text: string;
  nextQuestion?: string;
  rephrase?: string;
  subtleRecast?: string;
  timestamp: number;
}

interface BuddySummary {
  whatWeTalkedAbout: string;
  overallScore?: number;
  detailedScores?: {
    overallScore: number;
    expression: { score: number; rating: string };
    grammar: { score: number; rating: string };
    sentenceMaking: { score: number; rating: string };
    details: { score: number; rating: string };
    confidence: { score: number; rating: string };
  };
  ratings: {
    speaking: 'Great' | 'Good' | 'Getting Better' | 'Needs Practice';
    fluency: 'Great' | 'Good' | 'Getting Better' | 'Needs Practice';
    confidence: 'Great' | 'Good' | 'Getting Better' | 'Needs Practice';
    conversationFlow: 'Great' | 'Good' | 'Getting Better' | 'Needs Practice';
  };
  strengths: string[];
  improvementAreas: string[];
  naturalCorrections: Array<{
    learnerSaid: string;
    betterEnglish: string;
    explanation: string;
  }>;
  nextTimeGoal: string;
}

interface BuddyViewProps {
  onStartPractice?: () => void;
  onBack?: () => void;
  language?: 'en' | 'hi';
}

export const BuddyView: React.FC<BuddyViewProps> = ({ onStartPractice, onBack, language = 'en' }) => {
  const [messages, setMessages] = useState<BuddyMessage[]>([
    {
      id: '1',
      sender: 'buddy',
      text: "Hello! I'm your English Buddy. How was your day today? Tell me about what you did or what is on your mind.",
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [isSummaryView, setIsSummaryView] = useState(false);
  const [summaryData, setSummaryData] = useState<BuddySummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isProgressScreenOpen, setIsProgressScreenOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [shortAnswerError, setShortAnswerError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Voice synthesis for latest buddy message
  useEffect(() => {
    if (!voiceEnabled || messages.length === 0 || isSummaryView) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === 'buddy') {
      setPlayingId(lastMsg.id);
      speakText(lastMsg.text, 'en-IN', 0.92, () => {
        setPlayingId(null);
      });
    }
  }, [messages.length, voiceEnabled, isSummaryView]);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        soundFx.playBubbleStart();
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputMessage(transcript);
        }
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message below!');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isThinking) return;

    const words = text.trim().split(/\s+/);
    if (words.length <= 3) {
      setShortAnswerError(true);
      return;
    }
    setShortAnswerError(false);

    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }

    const newExchanges = exchangeCount + 1;
    setExchangeCount(newExchanges);
    setInputMessage('');

    const userMsg: BuddyMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsThinking(true);

    try {
      const response = await fetch('/api/buddy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: updatedMessages.map(m => ({ sender: m.sender, text: m.text })),
          learnerMessage: text.trim(),
          exchangeCount: newExchanges,
        })
      });

      const data = await response.json();

      const buddyMsg: BuddyMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'buddy',
        text: data.naturalResponse || "That's really interesting!",
        nextQuestion: data.nextQuestion || "What else did you do?",
        subtleRecast: data.subtleRecast || '',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, buddyMsg]);
      setIsThinking(false);

      // If shouldEnd is true or exchangeCount reaches 13+, prompt or auto-show summary
      if (data.shouldEnd || newExchanges >= 13) {
        // Automatically fetch and show summary after a short pause
        setTimeout(() => {
          fetchSummary([...updatedMessages, buddyMsg]);
        }, 1500);
      }
    } catch (err) {
      console.error("Buddy chat error:", err);
      setIsThinking(false);
      const fallbackMsg: BuddyMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'buddy',
        text: "That's very interesting! Can you tell me a little more about that?",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  const fetchSummary = async (currentHistory: BuddyMessage[]) => {
    setIsLoadingSummary(true);
    try {
      const response = await fetch('/api/buddy-chat/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: currentHistory })
      });
      const data = await response.json();
      setSummaryData(data);
      setIsLoadingSummary(false);
      setIsSummaryView(true);
    } catch (err) {
      console.error("Summary fetch error:", err);
      setIsLoadingSummary(false);
      // Fallback summary
      setSummaryData({
        whatWeTalkedAbout: "You had a natural conversation about your daily life and activities.",
        ratings: { speaking: 'Good', fluency: 'Getting Better', confidence: 'Good', conversationFlow: 'Good' },
        strengths: ["Expressed ideas clearly", "Maintained conversation flow"],
        improvementAreas: ["Use past tense verbs", "Add more descriptive details"],
        naturalCorrections: [
          { learnerSaid: "I go to office", betterEnglish: "I went to the office", explanation: "Use past tense for completed actions." }
        ],
        nextTimeGoal: "Try adding time expressions to your sentences."
      });
      setIsSummaryView(true);
    }
  };

  const handleRestart = () => {
    setMessages([
      {
        id: '1',
        sender: 'buddy',
        text: "Hello! I'm your English Buddy. How was your day today? Tell me about what you did or what is on your mind.",
        timestamp: Date.now()
      }
    ]);
    setExchangeCount(0);
    setIsSummaryView(false);
    setSummaryData(null);
  };

  if (isSummaryView && summaryData) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-h-screen bg-slate-50 text-zinc-900 pb-16 pt-4 px-4 sm:px-6 flex flex-col max-w-xl mx-auto font-sans"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onBack ? onBack() : handleRestart()}
              className="w-10 h-10 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-bold mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>Session Complete</span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-zinc-950">Buddy Chat Summary</h1>
            </div>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-sky-600 text-white font-semibold text-xs hover:bg-sky-700 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>
        </div>

        {/* Large Overall Confidence Hero Banner (Clickable to open 30-Day Graph) */}
        {summaryData.detailedScores && (
          <div 
            onClick={() => setIsProgressScreenOpen(true)}
            className="mb-5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden cursor-pointer active:scale-[0.99] transition-all group"
            title="Click to view 30-Day Confidence History"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                    Overall English Confidence
                  </span>
                </div>
                <div className="text-xs text-zinc-400 font-medium">
                  {summaryData.detailedScores.overallScore >= 85 ? 'High Confidence & Fluency' :
                   summaryData.detailedScores.overallScore >= 70 ? 'Clear & Capable Speaking' : 'Steady Progress & Building'}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full w-fit">
                    <TrendingUp className="w-3 h-3" />
                    <span>Rating: {summaryData.detailedScores.overallScore >= 85 ? 'Great' : summaryData.detailedScores.overallScore >= 70 ? 'Good' : 'Getting Better'}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 group-hover:text-amber-400 flex items-center gap-1 font-semibold transition-colors">
                    View 30-Day Graph <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-5xl font-black text-white tracking-tight flex items-baseline">
                  <span>{summaryData.detailedScores.overallScore}</span>
                  <span className="text-lg font-bold text-zinc-400 ml-0.5">%</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mt-1">
                  Calculated Score
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* 1. What We Talked About */}
          <section className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-600" />
              <span>1. What We Talked About</span>
            </h2>
            <p className="text-sm text-zinc-700 leading-relaxed font-normal">
              {summaryData.whatWeTalkedAbout}
            </p>
          </section>

          {/* 2. My English Today (Scoring Breakdown) */}
          {summaryData.detailedScores && (
            <section className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="mb-3.5">
                <h2 className="text-sm font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>2. My English Today</span>
                </h2>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Evaluated strictly from your conversational turns and grammar structure.
                </p>
              </div>

              <div className="divide-y divide-zinc-100">
                {Object.entries(summaryData.detailedScores)
                  .filter(([k]) => k !== 'overallScore')
                  .map(([key, item]: [string, any]) => (
                    <div key={key} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-[11px] text-zinc-400 font-normal">({item.score}%)</span>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        item.rating === 'Great' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                        item.rating === 'Good' ? 'bg-sky-50 border-sky-200 text-sky-800' :
                        item.rating === 'Getting Better' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                        'bg-rose-50 border-rose-200 text-rose-800'
                      }`}>
                        {item.rating}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* 3. I Did Well */}
          <section className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3. I Did Well</span>
            </h2>

            <div className="space-y-2.5">
              {summaryData.strengths.map((str, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed font-normal">{str}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Practice Next */}
          <section className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-600" />
              <span>4. Practice Next</span>
            </h2>

            <div className="space-y-2.5">
              {summaryData.improvementAreas.map((area, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed font-normal">{area}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. My Natural English */}
          {summaryData.naturalCorrections && summaryData.naturalCorrections.length > 0 && (
            <section className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>5. My Natural English</span>
              </h2>
              <div className="space-y-3">
                {summaryData.naturalCorrections.map((corr, idx) => (
                  <div key={idx} className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1.5 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-zinc-500 font-medium">You said:</span>
                      <span className="text-rose-600 line-through font-semibold">"{corr.learnerSaid}"</span>
                      <span className="text-zinc-500 font-medium ml-2">Better:</span>
                      <span className="text-emerald-700 font-bold">"{corr.betterEnglish}"</span>
                    </div>
                    {corr.explanation && (
                      <p className="text-zinc-600 text-[11px] italic pl-2 border-l-2 border-indigo-400">
                        {corr.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Next Time Goal */}
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block mb-0.5">Next Time Goal</span>
              <p className="text-xs sm:text-sm text-zinc-900 font-semibold">{summaryData.nextTimeGoal}</p>
            </div>
          </div>
        </div>

        {/* 30-Day Confidence History Modal */}
        <EnglishProgressScreen
          isOpen={isProgressScreenOpen}
          onClose={() => setIsProgressScreenOpen(false)}
          initialTab={0}
        />
      </motion.div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white pb-6 pt-4 px-4 sm:px-6 flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25 shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight">Buddy Chat</h1>
          </div>
        </div>

        {/* Action Controls: Chat Number & Summary Report Icon */}
        <div className="flex items-center gap-2">
          {/* Chat Numbers (eg 0/15) */}
          <div 
            className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-bold text-sky-400 flex items-center gap-1.5 shadow-xs"
            title={`Completed Exchanges: ${exchangeCount} of 15`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span>{exchangeCount}/15</span>
          </div>

          {/* Icon for summary report */}
          <button
            onClick={() => fetchSummary(messages)}
            disabled={isLoadingSummary || messages.length === 0}
            className="h-9 px-3 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/50 hover:border-sky-400 flex items-center gap-1.5 text-sky-300 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-xs"
            title="Open Summary Report"
            aria-label="Summary Report"
          >
            {isLoadingSummary ? (
              <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileText className="w-4 h-4 text-sky-400" />
            )}
            <span className="text-xs font-bold hidden sm:inline">Report</span>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 space-y-4 mb-4 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-md' 
                : 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[82%] rounded-2xl p-4 shadow-lg ${
              msg.sender === 'user'
                ? 'bg-purple-600 text-white rounded-tr-xs'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-xs'
            }`}>
              <div className="space-y-2">
                <p className="text-sm sm:text-base leading-relaxed text-zinc-100 font-medium">{msg.text}</p>
                {msg.nextQuestion && msg.nextQuestion !== msg.text && (
                  <p className="text-sm sm:text-base leading-relaxed text-sky-200 font-semibold pt-1.5 border-t border-zinc-800/60">
                    {msg.nextQuestion}
                  </p>
                )}
              </div>

              {msg.subtleRecast && (
                <div className="mt-2.5 pt-2.5 border-t border-zinc-800/80 bg-zinc-950/40 rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Natural Phrasing:</span>
                  </div>
                  <p className="text-xs text-zinc-200 italic font-medium">"{msg.subtleRecast}"</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isThinking && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-zinc-400 text-sm flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 bg-sky-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
              <motion.div 
                className="w-2 h-2 bg-indigo-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
              />
              <motion.div 
                className="w-2 h-2 bg-purple-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
              />
              <span className="ml-1 text-xs font-medium text-zinc-400">Buddy is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-0 bg-zinc-950/95 backdrop-blur-md pt-3 pb-4 z-30 mt-auto space-y-2">
        {shortAnswerError && (
          <div className="px-3 py-2 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-medium flex items-center justify-between">
            <span>Please write at least 4 words for a complete answer!</span>
            <button onClick={() => setShortAnswerError(false)} className="text-amber-400 hover:text-white font-bold ml-2">×</button>
          </div>
        )}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl">
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition-colors cursor-pointer ${
              isRecording 
                ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-500/30' 
                : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
            }`}
            title="Voice input"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRecording ? "Listening..." : "Type your message or speak naturally..."}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 px-2"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputMessage.trim() || isThinking}
            className="p-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 30-Day Confidence History Modal */}
      <EnglishProgressScreen
        isOpen={isProgressScreenOpen}
        onClose={() => setIsProgressScreenOpen(false)}
        initialTab={0}
      />
    </div>
  );
};
