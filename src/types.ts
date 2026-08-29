export type QuestionCategory =
  | 'workplace'
  | 'daily_routine'
  | 'friends'
  | 'sheeko'
  | 'logistics'
  | 'qsr_retail'
  | 'supervisors'
  | 'customer';

export type QuestionLevel = 'Level 1' | 'Level 2' | 'Level 3' | 'Beginner' | 'Intermediate' | 'Advanced';

export interface Question {
  id: string;
  category: QuestionCategory;
  categoryLabel: string;
  categoryHindi: string;
  questionEn: string;
  questionHi: string;
  hintEn: string;
  hintHi: string;
  level: QuestionLevel;
  samplePhrases: string[];
  sampleLearnerSpoken?: string;
  cardColor?: string;
  iconType?: string;
}

export interface AnalysisResult {
  learnerTranscript: string;
  intendedMeaning: string;
  naturalEnglish: string;
  hindiMeaning: string;
  encouragingNote: string;
  keyVocabulary: {
    wordOrPhrase: string;
    hindiMeaning: string;
  }[];
  confidenceScore: number;
}

export interface SavedPhrase {
  id: string;
  questionId?: string;
  questionText: string;
  originalSaid: string;
  improvedSentence: string;
  hindiTranslation: string;
  savedAt: number;
}

export interface MyDayTask {
  id: 'share_day' | 'conversation' | 'score' | 'quick_check';
  icon: string;
  tag: string;
  title: string;
  subtitle: string;
  detail: string;
  hindiDetail?: string;
  completed: boolean;
  timeEstimate: string;
  accentColor: string;
}

export interface PracticeHistoryItem {
  id: string;
  question: Question;
  learnerSpeech: string;
  improvedEnglish: string;
  timestamp: number;
}

export interface DayMap {
  activities: string[];
  emotions: string[];
  environments: string[];
  rawStatement: string;
  knownFacts: string[];
  naturalEnglishMeaning?: string;
  pointsExtractedCount?: number;
  capturedAt: number;
}

export interface ActiveTopic {
  pointer: string;
  category: 'ACTIVITY' | 'EMOTION' | 'ENVIRONMENT';
  exploredAspects: Record<string, boolean>;
  isCompleted: boolean;
  turnCount: number;
}

export interface DeepAnalysis {
  intent?: string;
  sentiment?: string;
  mainMeaning?: string;
  newActivity?: string;
  newPerson?: string;
  newPlace?: string;
  newObject?: string;
  newTime?: string;
  emotion?: string;
  reason?: string;
  problem?: string;
  result?: string;
  sequence?: string;
  isOffTopic?: boolean;
  unclearInfo?: string;
  newFacts?: string[];
  fluencyScore?: number;
  clarityScore?: number;
  detectedPatterns?: string[];
  keyInsights?: string[];
  recommendedPhrases?: string[];
}

export interface ConversationTurn {
  id: string;
  speaker: 'system' | 'learner';
  text: string;
  rawLearnerText?: string;
  rephrase?: string;
  probeQuestion?: string;
  probeDirection?: 'WHO' | 'WHAT' | 'WHY' | 'HOW' | 'WHEN' | 'WHERE' | 'FEELING' | 'RESULT' | 'DETAIL';
  deepAnalysis?: DeepAnalysis;
  timestamp: number;
  audioData?: string;
}

export interface UserProgress {
  userName?: string;
  streakDays: number;
  totalPracticed: number;
  totalMinutes: number;
  targetRole: string;
  dailyGoal: number;
  completedToday: number;
  savedPhrases: SavedPhrase[];
  history: PracticeHistoryItem[];
  myDayCompletedTasks?: string[];
}
