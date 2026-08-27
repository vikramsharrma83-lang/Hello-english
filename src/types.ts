export type QuestionCategory =
  | 'workplace'
  | 'daily_routine'
  | 'friends'
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

export interface PracticeHistoryItem {
  id: string;
  question: Question;
  learnerSpeech: string;
  improvedEnglish: string;
  timestamp: number;
}

export interface UserProgress {
  streakDays: number;
  totalPracticed: number;
  totalMinutes: number;
  targetRole: string;
  dailyGoal: number;
  completedToday: number;
  savedPhrases: SavedPhrase[];
  history: PracticeHistoryItem[];
}
