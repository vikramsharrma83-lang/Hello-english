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

export function parseLearnerStoryToMeaningRepresentation(text: string) {
  if (!text) {
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

  const clauses = text
    .split(/[,.;!?]+|\b(?:and|then|after|when|because|so)\b/gi)
    .map(c => c.trim())
    .filter(c => c.length > 2);

  const cleanText = text.toLowerCase().trim();
  const textTokens = cleanText.split(/\s+/).filter(t => t.length > 2);

  const scoredPatterns: { pattern: SheekoReferencePattern; score: number }[] = [];

  for (const pat of sheekoReferences) {
    let score = 0;
    const sent = pat.sentence.toLowerCase();
    const mean = pat.normalizedMeaning.toLowerCase();

    if (cleanText === sent) {
      score += 50;
    }

    for (const t of textTokens) {
      if (sent.includes(t)) score += 5;
      if (mean.includes(t)) score += 3;
    }

    if (pat.activities) {
      for (const act of pat.activities) {
        if (cleanText.includes(act.toLowerCase())) score += 10;
      }
    }

    if (score > 5) {
      scoredPatterns.push({ pattern: pat, score });
    }
  }

  scoredPatterns.sort((a, b) => b.score - a.score);
  const topMatches = scoredPatterns.slice(0, 3).map(p => p.pattern);

  const allActivities: string[] = [];
  const allPeople: string[] = [];
  const allPlaces: string[] = [];
  const allObjects: string[] = [];
  const allTimes: string[] = [];
  const allSequences: string[] = [];
  const matchedMeanings: string[] = [];

  if (topMatches.length > 0) {
    for (const pat of topMatches) {
      if (pat.activities) allActivities.push(...pat.activities);
      if (pat.people) allPeople.push(...pat.people);
      if (pat.places) allPlaces.push(...pat.places);
      if (pat.objects) allObjects.push(...pat.objects);
      if (pat.time?.value) allTimes.push(pat.time.value);
      if (pat.sequenceMarkers) allSequences.push(...pat.sequenceMarkers);
      if (pat.normalizedMeaning) matchedMeanings.push(pat.normalizedMeaning);
    }
  } else {
    for (const clause of clauses) {
      allActivities.push(applySheekoGrammarCorrections(clause));
    }
  }

  for (const ts of sheekoTimeSequences) {
    if (cleanText.includes(ts.pattern.toLowerCase())) {
      if (ts.type === 'TIME') allTimes.push(ts.normalizedValue);
      if (ts.type === 'SEQUENCE') allSequences.push(ts.normalizedValue);
    }
  }

  const uniqueActivities = Array.from(new Set(allActivities));
  const uniquePeople = Array.from(new Set(allPeople));
  const uniquePlaces = Array.from(new Set(allPlaces));
  const uniqueObjects = Array.from(new Set(allObjects));
  const uniqueTimes = Array.from(new Set(allTimes));
  const uniqueSequences = Array.from(new Set(allSequences));

  let normalizedSummary = '';
  if (matchedMeanings.length > 0) {
    normalizedSummary = Array.from(new Set(matchedMeanings)).slice(0, 2).join('. ') + '.';
  } else {
    const actStr = uniqueActivities.join(', ');
    const timeStr = uniqueTimes.length ? ` at ${uniqueTimes.join(', ')}` : '';
    const placeStr = uniquePlaces.length ? ` at ${uniquePlaces.join(', ')}` : '';
    normalizedSummary = `The learner reported ${actStr}${timeStr}${placeStr}.`;
  }

  return {
    clauses,
    activities: uniqueActivities,
    people: uniquePeople,
    places: uniquePlaces,
    objects: uniqueObjects,
    timeMarkers: uniqueTimes,
    sequenceMarkers: uniqueSequences,
    normalizedSummary
  };
}
