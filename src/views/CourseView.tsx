import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Play, 
  ChevronRight, 
  ArrowLeft,
  MoreHorizontal,
  Volume2,
  Mic,
  Check,
  RotateCcw
} from 'lucide-react';
import { Question } from '../types';
import { PRACTICE_QUESTIONS } from '../data/questions';

interface CourseViewProps {
  onStartPractice: (question?: Question) => void;
}

interface SubModule {
  title: string;
  duration: string;
  sentences: { english: string; meaning: string }[];
  question: Question;
}

interface CourseModule {
  id: string;
  title: string;
  category: 'Tenses' | 'Helping Verbs' | 'Office' | 'Daily' | 'Friends';
  duration: string;
  instructor: string;
  badge: string;
  image: string;
  description: string;
  subModules: SubModule[];
}

type LessonStep = 'hub' | 'how_to_use' | 'practice' | 'real_situation' | 'completed';

export const CourseView: React.FC<CourseViewProps> = ({ onStartPractice }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeProgram, setActiveProgram] = useState<CourseModule | null>(null);
  
  // Lesson Flow States
  const [activeSubModule, setActiveSubModule] = useState<SubModule | null>(null);
  const [lessonStep, setLessonStep] = useState<LessonStep>('hub');
  const [cardIndex, setCardIndex] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const courseModules: CourseModule[] = [
    {
      id: 'c-1',
      title: 'Mastering Past, Present & Future Tenses',
      category: 'Tenses',
      duration: '15 min • Fluency Masterclass',
      instructor: 'Coach Neha',
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      description: 'Learn how to accurately state what happened yesterday, during past shifts, or last weekend using correct past verbs.',
      subModules: [
        {
          title: 'Day 1: Start Speaking & Self Introduction',
          duration: '3 min',
          sentences: [
            { english: 'I am Rahul.', meaning: 'Your name / পরিচয়' },
            { english: 'I am from Bangalore.', meaning: 'Where you live / घर या शहर' },
            { english: 'I work in a warehouse.', meaning: 'Your job / काम' },
            { english: 'I am ready.', meaning: 'Ready for duty / तैयार हूँ' }
          ],
          question: PRACTICE_QUESTIONS[0]
        },
        {
          title: 'Day 2: Yesterday & Past Actions',
          duration: '4 min',
          sentences: [
            { english: 'Yesterday I went to work.', meaning: 'कल काम पर गया' },
            { english: 'I checked the stock.', meaning: 'मैंने सामान चेक किया' },
            { english: 'I finished my shift.', meaning: 'शिफ्ट खत्म किया' }
          ],
          question: PRACTICE_QUESTIONS[1]
        },
        {
          title: 'Day 3: Tomorrow & Future Plans',
          duration: '4 min',
          sentences: [
            { english: 'Tomorrow I will come early.', meaning: 'कल मैं जल्दी आऊंगा' },
            { english: 'I will check the box.', meaning: 'मैं बॉक्स चेक करूँगा' }
          ],
          question: PRACTICE_QUESTIONS[2]
        }
      ]
    },
    {
      id: 'c-2',
      title: 'Frequently Used Helping Verbs',
      category: 'Helping Verbs',
      duration: '18 min • Core Grammar',
      instructor: 'Coach Neha',
      badge: 'ESSENTIAL',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
      description: 'Master auxiliary verbs (do, does, did, have, has, can, should) naturally in conversation.',
      subModules: [
        {
          title: 'Day 1: Do & Does in Daily Questions',
          duration: '4 min',
          sentences: [
            { english: 'Do you work here?', meaning: 'क्या आप यहाँ काम करते हैं?' },
            { english: 'Do you need help?', meaning: 'क्या आपको मदद चाहिए?' },
            { english: 'Does he work here?', meaning: 'क्या वह यहाँ काम करता है?' }
          ],
          question: PRACTICE_QUESTIONS[1]
        },
        {
          title: 'Day 2: Did you check yesterday?',
          duration: '5 min',
          sentences: [
            { english: 'Did you come yesterday?', meaning: 'क्या आप कल आए थे?' },
            { english: 'Did you check the box?', meaning: 'क्या आपने बॉक्स चेक किया?' }
          ],
          question: PRACTICE_QUESTIONS[2]
        }
      ]
    },
    {
      id: 'c-3',
      title: 'Office & Workplace Communication',
      category: 'Office',
      duration: '20 min • Professional',
      instructor: 'Coach Neha',
      badge: 'WORK',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      description: 'Talk to supervisors, report damaged inventory, and handle shipments with confidence.',
      subModules: [
        {
          title: 'Day 1: Reporting to Supervisor',
          duration: '5 min',
          sentences: [
            { english: 'Sir, I have finished the task.', meaning: 'सर, मैंने काम पूरा कर लिया है।' },
            { english: 'Can you check this item?', meaning: 'क्या आप यह आइटम चेक कर सकते हैं?' }
          ],
          question: PRACTICE_QUESTIONS[3]
        }
      ]
    },
    {
      id: 'c-4',
      title: 'Daily Routine English',
      category: 'Daily',
      duration: '15 min • Practical',
      instructor: 'Coach Neha',
      badge: 'NEW',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      description: 'Practice describing your morning routine, commute, meals, and evening relaxation.',
      subModules: [
        {
          title: 'Day 1: Morning & Commute',
          duration: '4 min',
          sentences: [
            { english: 'I woke up at 6 AM.', meaning: 'मैं सुबह 6 बजे उठा।' },
            { english: 'I took the bus to work.', meaning: 'मैंने काम के लिए बस पकड़ी।' }
          ],
          question: PRACTICE_QUESTIONS[1]
        }
      ]
    },
    {
      id: 'c-5',
      title: 'Friends & Social Chat',
      category: 'Friends',
      duration: '15 min • Casual',
      instructor: 'Coach Neha',
      badge: 'SOCIAL',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      description: 'Discuss weekend plans, share news, and chat easily with friends.',
      subModules: [
        {
          title: 'Day 1: Catching Up',
          duration: '4 min',
          sentences: [
            { english: 'How are you doing?', meaning: 'आप कैसे हैं?' },
            { english: 'Let us grab tea together.', meaning: 'चलो साथ में चाय पीते हैं।' }
          ],
          question: PRACTICE_QUESTIONS[0]
        }
      ]
    },
  ];

  const filteredModules = selectedCategory 
    ? courseModules.filter(m => m.category === selectedCategory)
    : courseModules;

  // Handler to start a specific Day/Submodule flow
  const handleStartSubModule = (sub: SubModule) => {
    setActiveSubModule(sub);
    setLessonStep('how_to_use');
    setCardIndex(0);
    setPracticeStep(0);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
  };

  // 1. If we are inside a Lesson Flow (HOW TO USE -> PRACTICE -> REAL SITUATION -> COMPLETED)
  if (activeSubModule && lessonStep !== 'hub') {
    return (
      <div className="min-h-screen bg-[#000000] text-white pb-32 pt-6 px-4 font-sans select-none max-w-xl mx-auto">
        {/* Top Progress / Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (lessonStep === 'how_to_use') setActiveSubModule(null);
              else setLessonStep('how_to_use');
            }}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">SkillGo Lesson</span>
            <h2 className="text-sm font-bold text-white truncate max-w-[200px]">{activeSubModule.title}</h2>
          </div>
          <div className="w-10" />
        </div>

        {/* STEP 1: HOW TO USE (Learn one sentence at a time swipe cards) */}
        {lessonStep === 'how_to_use' && (
          <div className="space-y-6">
            <div className="bg-[#18191E] rounded-3xl p-6 border border-zinc-800 shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-3 right-3 text-xs font-bold text-zinc-500">
                Sentence {cardIndex + 1} of {activeSubModule.sentences.length}
              </div>

              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8" />
              </div>

              <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2">Learn This Sentence</p>
              
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                "{activeSubModule.sentences[cardIndex].english}"
              </h3>
              
              <p className="text-sm text-zinc-400 font-medium bg-zinc-900/80 py-2 px-4 rounded-xl inline-block border border-zinc-800/60 mb-6">
                💡 {activeSubModule.sentences[cardIndex].meaning}
              </p>

              {/* Audio Listen & Say button */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <button 
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(activeSubModule.sentences[cardIndex].english);
                    window.speechSynthesis.speak(utterance);
                  }}
                  className="px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-white text-xs font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all cursor-pointer shadow"
                >
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span>Listen Audio</span>
                </button>
              </div>

              {/* Navigation Card Button */}
              <button
                onClick={() => {
                  if (cardIndex < activeSubModule.sentences.length - 1) {
                    setCardIndex(cardIndex + 1);
                  } else {
                    setLessonStep('practice');
                    setPracticeStep(0);
                  }
                }}
                className="w-full py-4 rounded-2xl bg-[#ccff00] text-black text-sm font-black hover:bg-[#b8f500] transition-all shadow-lg cursor-pointer"
              >
                {cardIndex < activeSubModule.sentences.length - 1 ? 'Next Sentence →' : 'Now Let’s Practice (Start Practice)'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PRACTICE SESSION (Activities 1 to 6) */}
        {lessonStep === 'practice' && (
          <div className="space-y-6">
            <div className="bg-[#18191E] rounded-3xl p-6 border border-zinc-800 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Practice Activity {practiceStep + 1} of 4</span>
                <span className="text-xs text-zinc-400">Interactive Drill</span>
              </div>

              {practiceStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-2">Choose the correct missing word:</h3>
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-xl font-bold">
                    "I <span className="text-cyan-400 underline decoration-cyan-400/50">___</span> Rahul."
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {['am', 'is', 'are'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedOption(opt);
                          setIsAnswerCorrect(opt === 'am');
                        }}
                        className={`py-3 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                          selectedOption === opt 
                            ? opt === 'am' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {practiceStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-2">Complete the sentence:</h3>
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-lg font-bold">
                    "I am from <span className="text-cyan-400 underline decoration-cyan-400/50">______</span>."
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {['Bangalore', 'Yesterday', 'Work'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedOption(opt);
                          setIsAnswerCorrect(opt === 'Bangalore');
                        }}
                        className={`py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedOption === opt 
                            ? opt === 'Bangalore' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {practiceStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-2">Arrange the sentence cards in correct order:</h3>
                  <div className="flex gap-2 justify-center py-2">
                    <span className="px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-bold">am</span>
                    <span className="px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-bold">I</span>
                    <span className="px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-bold">ready</span>
                  </div>
                  <p className="text-xs text-zinc-400 text-center">Tap the correct starting word:</p>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {['am', 'I', 'ready'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedOption(opt);
                          setIsAnswerCorrect(opt === 'I');
                        }}
                        className={`py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedOption === opt 
                            ? opt === 'I' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {practiceStep === 3 && (
                <div className="space-y-4 text-center">
                  <h3 className="text-lg font-bold text-white mb-2">Voice Speaking Practice</h3>
                  <p className="text-xs text-zinc-400">Say this sentence out loud:</p>
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-lg font-bold text-cyan-400">
                    "I am ready for work."
                  </div>
                  <button
                    onClick={() => {
                      setIsAnswerCorrect(true);
                      setSelectedOption('spoken');
                    }}
                    className={`w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                      selectedOption === 'spoken' ? 'bg-emerald-600 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    <Mic className="w-5 h-5 animate-pulse" />
                    <span>{selectedOption === 'spoken' ? '✓ Spoken Successfully!' : 'Tap to Speak'}</span>
                  </button>
                </div>
              )}

              {isAnswerCorrect && (
                <div className="mt-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>✓ Correct! Great job.</span>
                </div>
              )}

              <div className="mt-6">
                <button
                  disabled={!selectedOption}
                  onClick={() => {
                    if (practiceStep < 3) {
                      setPracticeStep(practiceStep + 1);
                      setSelectedOption(null);
                      setIsAnswerCorrect(null);
                    } else {
                      setLessonStep('real_situation');
                    }
                  }}
                  className={`w-full py-4 rounded-2xl text-sm font-black transition-all shadow-lg ${
                    selectedOption 
                      ? 'bg-[#ccff00] text-black hover:bg-[#b8f500] cursor-pointer' 
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  {practiceStep < 3 ? 'Next Practice →' : 'Proceed to Real Situation (AI Roleplay) →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: REAL LIFE SITUATION (AI Conversation Roleplay) */}
        {lessonStep === 'real_situation' && (
          <div className="space-y-6">
            <div className="bg-[#18191E] rounded-3xl p-6 border border-zinc-800 shadow-2xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Real-Life Workplace Situation</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">Meeting Your Supervisor</h3>
              
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                    Sup
                  </div>
                  <div className="bg-zinc-800/80 p-3 rounded-2xl rounded-tl-none text-xs text-zinc-200">
                    "Hello! Tell me about yourself and your background."
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mb-3 font-medium">Choose your response or tap to speak:</p>
              
              <div className="space-y-2.5 mb-6">
                {[
                  'My name is Rahul and I am from Bangalore.',
                  'I work in the warehouse everyday.',
                  'I am ready for the shift.'
                ].map((resp, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedOption(resp)}
                    className={`w-full p-3.5 rounded-2xl text-left text-xs font-bold border transition-all cursor-pointer ${
                      selectedOption === resp
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    "{resp}"
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  onStartPractice(activeSubModule.question);
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 text-white text-sm font-black hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Open AI Live Conversation Roleplay</span>
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setLessonStep('completed')}
                  className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Skip to Lesson Completion
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: LESSON COMPLETION */}
        {lessonStep === 'completed' && (
          <div className="space-y-6 text-center">
            <div className="bg-[#18191E] rounded-3xl p-8 border border-zinc-800 shadow-2xl space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">🎉 WELL DONE!</span>
                <h2 className="text-2xl font-black text-white mt-1">You completed today's practice</h2>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-zinc-300">Learn Sentences</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-zinc-300">Practice Drills</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-zinc-300">Voice Speaking</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-zinc-300">Real Situation</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setActiveSubModule(null)}
                  className="w-full py-4 rounded-2xl bg-[#ccff00] text-black text-sm font-black hover:bg-[#b8f500] transition-all shadow-lg cursor-pointer"
                >
                  Continue to Next Day →
                </button>
                <button
                  onClick={() => setActiveProgram(null)}
                  className="w-full py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  Back to Course
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. If a program is active, render the Day-wise Course Plan (Day 1, Day 2...)
  if (activeProgram) {
    return (
      <div className="min-h-screen bg-[#000000] text-white pb-36 font-sans select-none relative">
        <div className="relative h-80 w-full overflow-hidden">
          <img 
            src={activeProgram.image} 
            alt={activeProgram.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-black/40 to-black/60" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <button
              onClick={() => setActiveProgram(null)}
              className="w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-zinc-800 transition-colors shadow-lg cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-20">
            <p className="text-xs font-bold text-rose-400 tracking-wider uppercase mb-1">SkillGo Day-Wise Curriculum</p>
            <h1 className="text-2xl font-black text-white tracking-tight">{activeProgram.title}</h1>
          </div>
        </div>

        {/* Day Wise Course List */}
        <div className="px-5 mt-4 space-y-4 max-w-xl mx-auto">
          <div>
            <h2 className="text-sm font-bold text-zinc-300">{activeProgram.instructor}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{activeProgram.duration} • Day-wise Practice Plan</p>
          </div>

          <div className="pt-2">
            <h3 className="text-lg font-black text-white mb-3">Day-Wise Plan</h3>
            <div className="space-y-3">
              {activeProgram.subModules.map((sub, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleStartSubModule(sub)}
                  className="bg-[#18191E] rounded-2xl p-4 border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-rose-400 flex items-center justify-center font-bold text-sm border border-rose-500/30">
                      D{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">{sub.title}</h4>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {sub.duration} • Learn → Practice → Speak
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:bg-[#ccff00] group-hover:text-black transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Main Course Categories Hub
  return (
    <div className="min-h-screen bg-[#000000] text-white pb-36 pt-4 px-4 font-sans select-none">
      <header className="mb-6 px-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-black text-rose-500 tracking-tight"> SkillGo</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">English Courses</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Categories 1 to 6</h1>
      </header>

      <div className="space-y-6 max-w-xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === null
                ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.5)]'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {['Tenses', 'Helping Verbs', 'Office', 'Daily', 'Friends'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.5)]'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">SkillGo Core Programs (1–6)</h2>
            <span className="text-xs text-zinc-400 font-semibold">{filteredModules.length} Programs</span>
          </div>

          {filteredModules.map((module) => (
            <div
              key={module.id}
              onClick={() => setActiveProgram(module)}
              className="bg-[#18191E] rounded-3xl overflow-hidden border border-zinc-800/80 shadow-xl group cursor-pointer hover:border-zinc-700 transition-all flex flex-col"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={module.image} 
                  alt={module.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black tracking-wider uppercase shadow">
                  {module.badge}
                </span>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">{module.category}</span>
                    <h3 className="text-lg font-bold text-white drop-shadow mt-0.5">{module.title}</h3>
                    <p className="text-xs text-zinc-300 mt-0.5">{module.duration} • {module.instructor}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-rose-600 transition-colors shadow-lg">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-[#18191E]">
                <p className="text-xs text-zinc-400 leading-relaxed">{module.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
