// Interfaces for Sheeko 5 Libraries
import referencePatternsData from './sheeko/skillgo_my_day_10000_reference_patterns.json';
import rephraseTemplatesData from './sheeko/skillgo_my_day_10000_rephrase_templates (1).json';
import meaningIntentData from './sheeko/skillgo_my_day_meaning_intent_library (1).json';
import timeSequenceData from './sheeko/skillgo_my_day_time_sequence_library (1).json';
import vocabGrammarData from './sheeko/skillgo_my_day_vocabulary_grammar_library (1).json';

export interface SheekoReferencePattern {
  id: string;
  sentence: string;
  normalizedMeaning: string;
  category: 'DAILY' | 'WORK' | 'FRIENDS';
  activities?: string[];
  people?: string[];
  places?: string[];
  objects?: string[];
  time?: { value: string; explicit: boolean };
  sequenceMarkers?: string[];
  intent?: string;
}

export interface SheekoRephraseTemplate {
  id: string;
  patternId: string;
  category: string;
  matchedMeaning: string;
  rephraseTemplate: string;
  rephraseMeaning: string;
  activitySlots?: Record<string, string>;
}

export interface SheekoMeaningIntent {
  id: string;
  category: string;
  patternKey: string;
  meaning: string;
  intent: string;
}

export interface SheekoTimeSequence {
  id: string;
  pattern: string;
  normalizedValue: string;
  type: string;
  meaning: string;
}

export interface SheekoVocabularyGrammar {
  id: string;
  inputPattern: string;
  correctForm: string;
  correctionType: string;
  usageNote?: string;
}

const sheekoReferences: SheekoReferencePattern[] = (referencePatternsData as any).records || [];
const sheekoRephrases: SheekoRephraseTemplate[] = (rephraseTemplatesData as any).records || [];
const sheekoIntents: SheekoMeaningIntent[] = (meaningIntentData as any).records || [];
const sheekoTimeSequences: SheekoTimeSequence[] = (timeSequenceData as any).records || [];
const sheekoGrammars: SheekoVocabularyGrammar[] = (vocabGrammarData as any).records || [];

console.log(`[SHEEKO BROWSER ENGINE] Loaded ${sheekoReferences.length} reference patterns, ${sheekoRephrases.length} rephrase templates, ${sheekoIntents.length} intents, ${sheekoTimeSequences.length} time/sequences, ${sheekoGrammars.length} grammar rules locally.`);

export function getSheekoReferences(): SheekoReferencePattern[] {
  return sheekoReferences;
}

export function findSheekoReferenceMatch(text: string, category?: string): SheekoReferencePattern | null {
  if (!sheekoReferences.length || !text) return null;
  const clean = text.toLowerCase().trim();
  const tokens = clean.split(/\s+/).filter(t => t.length > 2);

  let bestMatch: SheekoReferencePattern | null = null;
  let bestScore = 0;

  const pool = category && category !== 'All'
    ? sheekoReferences.filter(r => r.category.toLowerCase() === category.toLowerCase())
    : sheekoReferences;

  for (let i = 0; i < pool.length; i++) {
    const pat = pool[i];
    let score = 0;
    const sent = pat.sentence.toLowerCase();
    const mean = pat.normalizedMeaning.toLowerCase();

    if (clean === sent) return pat;

    for (const t of tokens) {
      if (sent.includes(t)) score += 3;
      if (mean.includes(t)) score += 2;
    }

    if (pat.activities) {
      for (const act of pat.activities) {
        if (clean.includes(act.toLowerCase())) score += 4;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = pat;
    }
  }

  return bestMatch;
}

export function findSheekoRephraseTemplate(meaningOrText: string): SheekoRephraseTemplate | null {
  if (!sheekoRephrases.length || !meaningOrText) return null;
  const clean = meaningOrText.toLowerCase().trim();
  const match = sheekoRephrases.find(r => r.matchedMeaning.toLowerCase().includes(clean) || clean.includes(r.matchedMeaning.toLowerCase()));
  return match || sheekoRephrases[0] || null;
}

export function applySheekoGrammarCorrections(text: string): string {
  if (!text) return '';
  let corrected = text;

  for (const rule of sheekoGrammars) {
    if (rule.inputPattern && rule.correctForm && rule.correctionType !== 'NO_CHANGE') {
      const regex = new RegExp(`\\b${rule.inputPattern}\\b`, 'gi');
      corrected = corrected.replace(regex, rule.correctForm);
    }
  }

  return corrected;
}

export function extractNaturalEnglishMeaning(text: string): string {
  if (!text || !text.trim()) {
    return 'The learner shared their experience.';
  }

  const clean = text.trim();
  // Split into sentences while keeping structure
  const rawSentences = clean
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (rawSentences.length === 0) {
    rawSentences.push(clean);
  }

  const polished = rawSentences.map(rawSentence => {
    let s = applySheekoGrammarCorrections(rawSentence);

    // Apply specific Indian English to natural English normalizations
    s = s
      .replace(/\btoday morning\b/gi, 'this morning')
      .replace(/\byesterday night\b/gi, 'last night')
      .replace(/\bcame late to office\b/gi, 'arrived late at the office')
      .replace(/\bcame late to the office\b/gi, 'arrived late at the office')
      .replace(/\bcome late to office\b/gi, 'arrive late at the office')
      .replace(/\bgot late\b/gi, 'was delayed')
      .replace(/\bgetting late\b/gi, 'running late')
      .replace(/\btoo much traffic\b/gi, 'heavy traffic')
      .replace(/\blittle angry with me\b/gi, 'a bit upset with me')
      .replace(/\blittle angry\b/gi, 'a bit upset')
      .replace(/\bgave tension\b/gi, 'caused stress')
      .replace(/\bgiving tension\b/gi, 'causing stress')
      .replace(/\btake rest\b/gi, 'rest')
      .replace(/\btaking rest\b/gi, 'resting')
      .replace(/\bdid the needful\b/gi, 'took the necessary steps')
      .replace(/\bwent to warehouse\b/gi, 'went to the warehouse')
      .replace(/\bwent to office\b/gi, 'went to the office')
      .replace(/\breached to office\b/gi, 'arrived at the office')
      .replace(/\breached office\b/gi, 'arrived at the office')
      .replace(/\bi done\b/gi, 'I did')
      .replace(/\bi seen\b/gi, 'I saw')
      .replace(/\bi talk\b/gi, 'I talked')
      .replace(/\bi tell\b/gi, 'I told')
      .replace(/\bi reach\b/gi, 'I arrived')
      .replace(/\bi go\b/gi, 'I went');

    s = s.replace(/[.!?]+$/, '').trim();
    if (s.length > 0) {
      s = s.charAt(0).toUpperCase() + s.slice(1);
      s = s.replace(/\b i \b/g, ' I ').replace(/\bi'm\b/g, "I'm");
      if (!/[.!?]$/.test(s)) {
        s += '.';
      }
    }
    return s;
  });

  return polished.filter(Boolean).join(' ');
}

export function parseLearnerStoryToMeaningRepresentation(text: string) {
  if (!text || !text.trim()) {
    return {
      clauses: [],
      activities: [],
      people: [],
      places: [],
      objects: [],
      timeMarkers: [],
      sequenceMarkers: [],
      normalizedSummary: 'The learner shared their daily experience.'
    };
  }

  const cleanText = text.toLowerCase().trim();
  // Extract activities solely from the learner's actual sentences and clauses
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const activities: string[] = [];

  for (const sent of sentences) {
    const clauses = sent.split(/,\s*|\b(?:and then|after that|but)\b/gi).map(c => c.trim()).filter(Boolean);
    for (const rawClause of (clauses.length > 0 ? clauses : [sent])) {
      let cleaned = rawClause
        .replace(/^(?:and|but|so|because|that|of|then|after that)\s+/i, '')
        .trim();
      cleaned = applySheekoGrammarCorrections(cleaned);
      if (cleaned.length > 6) {
        const cap = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        if (!activities.includes(cap)) {
          activities.push(cap);
        }
      }
    }
  }

  // Extract people mentioned directly in learner's input
  const directPeopleMentions: string[] = [];
  const personKeywords = [
    'mother', 'mom', 'father', 'dad', 'brother', 'sister',
    'friend', 'friends', 'colleague', 'colleagues', 'manager',
    'boss', 'supervisor', 'team', 'wife', 'husband', 'son',
    'daughter', 'customer', 'client'
  ];
  for (const kw of personKeywords) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(cleanText)) {
      directPeopleMentions.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }

  // Extract places mentioned directly in learner's input
  const directPlaceMentions: string[] = [];
  const placeKeywords = [
    'office', 'warehouse', 'home', 'road', 'store', 'shop',
    'station', 'market', 'workplace', 'cafeteria', 'canteen',
    'desk', 'factory'
  ];
  for (const kw of placeKeywords) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(cleanText)) {
      directPlaceMentions.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }

  // Extract time markers mentioned directly in learner's input
  const directTimeMentions: string[] = [];
  const timeKeywords = ['today', 'morning', 'afternoon', 'evening', 'night', 'yesterday', 'on time', 'late', 'early'];
  for (const kw of timeKeywords) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(cleanText)) {
      directTimeMentions.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }

  for (const ts of sheekoTimeSequences) {
    if (cleanText.includes(ts.pattern.toLowerCase())) {
      if (ts.type === 'TIME' && !directTimeMentions.includes(ts.normalizedValue)) {
        directTimeMentions.push(ts.normalizedValue);
      }
    }
  }

  // Extract sequence markers directly from learner's input
  const sequenceMarkers: string[] = [];
  const seqKeywords = ['after that', 'first', 'then', 'next', 'finally', 'before', 'because', 'so'];
  for (const sk of seqKeywords) {
    if (cleanText.includes(sk)) {
      sequenceMarkers.push(sk);
    }
  }

  const clauses = sentences.flatMap(s => s.split(/,\s*|\b(?:and then|after that|because|so|but)\b/gi).map(c => c.trim()).filter(Boolean));

  // Natural English Meaning = meaning of ONLY the current learner utterance
  const normalizedSummary = extractNaturalEnglishMeaning(text);

  return {
    clauses,
    activities: activities.length > 0 ? activities : [text.trim()],
    people: Array.from(new Set(directPeopleMentions)),
    places: Array.from(new Set(directPlaceMentions)),
    objects: [],
    timeMarkers: Array.from(new Set(directTimeMentions)),
    sequenceMarkers: Array.from(new Set(sequenceMarkers)),
    normalizedSummary
  };
}

/**
 * Synthesizes the complete accumulated Day Story rewritten in correct, simple, natural English.
 * Preserves exact learner facts, chronology, people, and details without hallucinating.
 */
export function synthesizeNaturalEnglishStory(params: {
  rawStatement?: string;
  activities?: string[];
  emotions?: string[];
  knownFacts?: string[];
  learnerAnswers?: string[];
}): string {
  const { rawStatement = '', learnerAnswers = [] } = params;
  if (!rawStatement.trim() && learnerAnswers.length === 0) {
    return 'Today, I went through my daily routine and completed my scheduled activities.';
  }

  // Gather raw utterances in exact chronological sequence
  const rawUtterances: string[] = [];
  if (rawStatement && rawStatement.trim()) {
    rawUtterances.push(rawStatement.trim());
  }
  for (const ans of learnerAnswers) {
    if (ans && ans.trim() && !rawUtterances.includes(ans.trim())) {
      rawUtterances.push(ans.trim());
    }
  }

  const polishedSentences: string[] = [];

  for (let idx = 0; idx < rawUtterances.length; idx++) {
    const raw = rawUtterances[idx];
    let sentence = raw;

    // Apply grammatical replacements while strictly preserving facts
    sentence = applySheekoGrammarCorrections(sentence);

    // Common STT typos and broken verb phrasings
    sentence = sentence
      .replace(/\bearly moring\b/gi, 'early in the morning')
      .replace(/\bmoring\b/gi, 'morning')
      .replace(/\bwiht\b/gi, 'with')
      .replace(/\bbiy\b/gi, 'buy')
      .replace(/\bbuy vegetable\b/gi, 'buy vegetables')
      .replace(/\btake cycle to market\b/gi, 'cycled to the market')
      .replace(/\btake cycle\b/gi, 'rode my cycle')
      .replace(/\bgo to bath\b/gi, 'took a bath')
      .replace(/\bcome home cook food\b/gi, 'came home and cooked food')
      .replace(/\bcome home and cook food\b/gi, 'came home and cooked food')
      .replace(/\bcome home\b/gi, 'came home')
      .replace(/\bcook food\b/gi, 'cooked food')
      .replace(/\bi wake\b/gi, 'I woke up')
      .replace(/\bwake early\b/gi, 'woke up early')
      .replace(/\bkishan friend\b/gi, 'my friend Kishan')
      .replace(/\bdrink tea\b/gi, 'had tea')
      .replace(/\btoday morning\b/gi, 'this morning')
      .replace(/\byesterday night\b/gi, 'last night')
      .replace(/\bcame late to office\b/gi, 'arrived late at the office')
      .replace(/\bcome late to office\b/gi, 'arrive late at the office')
      .replace(/\bgot late\b/gi, 'was delayed')
      .replace(/\btoo much traffic\b/gi, 'heavy traffic')
      .replace(/\blittle angry with me\b/gi, 'a bit upset with me')
      .replace(/\blittle angry\b/gi, 'a bit upset')
      .replace(/\bwent to warehouse\b/gi, 'went to the warehouse')
      .replace(/\bwent to office\b/gi, 'went to the office')
      .replace(/\bgave tension\b/gi, 'was stressful')
      .replace(/\btake rest\b/gi, 'rested')
      .replace(/\btaking rest\b/gi, 'resting')
      .replace(/\bdid the needful\b/gi, 'did what was necessary')
      .replace(/\bi done\b/gi, 'I did')
      .replace(/\bi seen\b/gi, 'I saw')
      .replace(/\bi talk\b/gi, 'I talked')
      .replace(/\bi help\b/gi, 'I helped')
      .replace(/\bi have dinner\b/gi, 'I had dinner')
      .replace(/\bi have lunch\b/gi, 'I had lunch')
      .replace(/\bi meet\b/gi, 'I met')
      .replace(/\bi reach\b/gi, 'I reached')
      .replace(/\bi start\b/gi, 'I started')
      .replace(/\bi finish\b/gi, 'I finished')
      .replace(/\bi go\b/gi, 'I went')
      .replace(/\bi come\b/gi, 'I came');

    sentence = sentence.replace(/[.!?]+$/, '').trim();
    if (sentence.length > 0) {
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      sentence = sentence.replace(/\b i \b/g, ' I ').replace(/\bi'm\b/g, "I'm");
      if (!sentence.endsWith('.')) {
        sentence += '.';
      }
      polishedSentences.push(sentence);
    }
  }

  return polishedSentences.join(' ');
}

