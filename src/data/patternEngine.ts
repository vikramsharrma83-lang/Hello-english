import englishPatternsData from './englishPatterns.json';

export interface EnglishPattern {
  id: string;
  category: string;
  pattern: string;
  broken_english: string;
  natural_english: string;
}

export const englishPatterns: EnglishPattern[] = englishPatternsData as EnglishPattern[];

/**
 * Clean and tokenize a sentence for matching
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Compute word overlap score between learner input and a pattern
 */
function computeSimilarity(inputTokens: string[], patternTokens: string[]): number {
  if (!inputTokens.length || !patternTokens.length) return 0;
  const inputSet = new Set(inputTokens);
  let common = 0;
  for (const token of patternTokens) {
    if (inputSet.has(token)) {
      common++;
    }
  }
  // Dice coefficient
  return (2 * common) / (inputTokens.length + patternTokens.length);
}

/**
 * Finds matching or resembling patterns from englishPatterns.json
 * based on lexical overlap, substring inclusion, and grammatical indicators.
 */
export function findMatchingPatterns(
  transcript: string,
  limit: number = 6
): { pattern: EnglishPattern; score: number }[] {
  if (!transcript || !transcript.trim()) {
    return [];
  }

  const cleanInput = transcript.trim().toLowerCase();
  const inputTokens = tokenize(cleanInput);

  const scored = englishPatterns.map((item) => {
    let score = 0;
    const brokenLower = item.broken_english.toLowerCase();
    const naturalLower = item.natural_english.toLowerCase();
    const brokenTokens = tokenize(brokenLower);

    // Exact match
    if (brokenLower === cleanInput) {
      score += 10.0;
    } else if (cleanInput.includes(brokenLower) || brokenLower.includes(cleanInput)) {
      score += 5.0;
    }

    // Token similarity
    const tokenScore = computeSimilarity(inputTokens, brokenTokens);
    score += tokenScore * 4.0;

    // Natural sentence token match
    const naturalTokens = tokenize(naturalLower);
    const naturalSim = computeSimilarity(inputTokens, naturalTokens);
    score += naturalSim * 2.0;

    // Grammatical pattern indicator boosts
    // 1. Past tense markers
    if (cleanInput.includes('yesterday') || cleanInput.includes('last') || cleanInput.includes('morning')) {
      if (item.category.toLowerCase().includes('past') || item.category.toLowerCase().includes('was')) {
        score += 1.2;
      }
    }

    // 2. Future markers
    if (cleanInput.includes('will') || cleanInput.includes('tomorrow') || cleanInput.includes('later')) {
      if (item.category.toLowerCase().includes('future')) {
        score += 1.2;
      }
    }

    // 3. Continuous tense markers
    if (cleanInput.includes('now') || cleanInput.includes(' am ') || cleanInput.includes(' is ') || cleanInput.includes(' are ') || cleanInput.includes('ing')) {
      if (item.category.toLowerCase().includes('continuous')) {
        score += 1.0;
      }
    }

    // 4. Modals (can/can't/could)
    if (cleanInput.includes('can') || cleanInput.includes("can't") || cleanInput.includes('cannot')) {
      if (item.category.toLowerCase().includes('can')) {
        score += 1.5;
      }
    }

    // 5. Questions / Do / Did
    if (cleanInput.includes('?') || cleanInput.startsWith('you ') || cleanInput.startsWith('he ') || cleanInput.includes(' did ') || cleanInput.includes(' do ')) {
      if (item.category.toLowerCase().includes('do') || item.category.toLowerCase().includes('did')) {
        score += 1.2;
      }
    }

    // 6. Have / Has
    if (cleanInput.includes('have') || cleanInput.includes('has')) {
      if (item.category.toLowerCase().includes('have') || item.category.toLowerCase().includes('has')) {
        score += 1.2;
      }
    }

    // 7. Prepositions
    if (
      cleanInput.includes('in ') ||
      cleanInput.includes('at ') ||
      cleanInput.includes('on ') ||
      cleanInput.includes('to ') ||
      cleanInput.includes('for ')
    ) {
      if (item.category.toLowerCase().includes('preposition')) {
        score += 0.8;
      }
    }

    return { pattern: item, score };
  });

  // Filter out low scores and sort descending
  return scored
    .filter((entry) => entry.score > 0.3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Direct search or lookup in englishPatterns
 */
export function getPatternById(id: string): EnglishPattern | undefined {
  return englishPatterns.find((p) => p.id === id);
}
