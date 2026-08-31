import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  User, 
  CheckCircle2, 
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  HelpCircle
} from 'lucide-react';
import { speakText, stopSpeaking, soundFx } from '../utils/audio';

interface BuddyMessage {
  id: string;
  sender: 'buddy' | 'user';
  text: string;
  rephrase?: string;
  timestamp: number;
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
      text: language === 'hi'
        ? "नमस्ते! मैं आपका Buddy हूँ। आज आपका दिन कैसा रहा? आप मुझसे अंग्रेजी या हिंदी में खुलकर बात कर सकते हैं!"
        : "Hello! I'm your English Buddy. How was your day today? You can talk to me freely in English or Hindi-English, and I'll help you speak better!",
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Voice synthesis for latest buddy message if voiceEnabled
  useEffect(() => {
    if (!voiceEnabled || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === 'buddy') {
      setPlayingId(lastMsg.id);
      speakText(lastMsg.text, 'en-IN', 0.92, () => {
        setPlayingId(null);
      });
    }
  }, [messages.length, voiceEnabled]);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
          setInputMessage(prev => (prev ? `${prev.trim()} ${finalTrans.trim()}` : finalTrans.trim()));
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
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
      soundFx.playBubblePop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Speech start error:', e);
      }
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }

    const userMsg: BuddyMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    // Simulate AI Buddy processing: listens -> understands -> rephrases & replies
    setTimeout(() => {
      let buddyReplyText = "That sounds wonderful! You explained that clearly. Let's continue: what did you do next in your day?";
      let rephrased = "";

      const lower = text.toLowerCase();
      if (lower.includes('morning') || lower.includes('tea') || lower.includes('wake')) {
        rephrased = "In the morning, I woke up and had tea.";
        buddyReplyText = "Great start! When you say that, in proper English we say: 'In the morning, I woke up and had tea.' How did you go to work afterwards?";
      } else if (lower.includes('market') || lower.includes('vegetable')) {
        rephrased = "I went to the market to buy fresh vegetables.";
        buddyReplyText = "Very nice! Correct phrasing: 'I went to the market to buy fresh vegetables.' Did you go by bus or walking?";
      } else if (lower.includes('office') || lower.includes('work')) {
        rephrased = "I went to my office and started my shift.";
        buddyReplyText = "Awesome! Working hard is wonderful. How was your meeting or task with your colleagues?";
      } else if (lower.includes('friend') || lower.includes('ravi') || lower.includes('evening')) {
        rephrased = "In the evening, my friend called me for some work.";
        buddyReplyText = "That's great to hear! Staying connected with friends is so important. Did you finish the work together?";
      } else {
        rephrased = `I understand: "${text.trim()}"`;
        buddyReplyText = `I understand completely! You are doing fantastic with your English practice. Tell me more about your day!`;
      }

      const buddyMsg: BuddyMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'buddy',
        text: buddyReplyText,
        rephrase: rephrased,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, buddyMsg]);
      setIsThinking(false);
    }, 1200);
  };

  const quickPrompts = [
    "I woke up late and had tea.",
    "I went to the market to buy vegetables.",
    "I went to office by bus.",
    "My friend Ravi called me in the evening."
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white pb-32 pt-4 px-4 sm:px-6 flex flex-col max-w-2xl mx-auto">
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
            <h1 className="text-lg font-black tracking-tight whitespace-nowrap">{language === 'hi' ? 'बडी स्पीकिंग पार्टनर' : 'Buddy Speaking Partner'}</h1>
            <p className="text-xs text-zinc-400">
              {language === 'hi' ? 'खुलकर बात करें' : 'Talk freely'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`p-2.5 rounded-xl border transition-colors ${
            voiceEnabled 
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-400' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-500'
          }`}
          title={voiceEnabled ? "Voice Enabled" : "Voice Muted"}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Chat Messages List */}
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

            <div className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
              msg.sender === 'user'
                ? 'bg-purple-600 text-white rounded-tr-xs'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-xs'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>

              {msg.rephrase && (
                <div className="mt-3 pt-3 border-t border-zinc-800/80 bg-zinc-950/40 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Buddy's Corrected Rephrase:</span>
                  </div>
                  <p className="text-xs text-zinc-200 italic font-medium">"{msg.rephrase}"</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isThinking && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 rounded-tl-xs">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>Buddy is listening and thinking of the best reply...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>



      {/* Input Bar */}
      <div className="sticky bottom-0 bg-zinc-950/95 backdrop-blur-md pt-3 pb-4 z-30 mt-auto">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl">
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              isRecording 
                ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40' 
                : 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30'
            }`}
            title={isRecording ? "Stop recording" : "Speak with microphone"}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRecording ? "Listening to your voice..." : "Type or speak to Buddy in English..."}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 px-2"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputMessage.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
