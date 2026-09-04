/**
 * Audio synthesis, speech recognition, and sound effects for Coach Neha
 */

// Soft UI Chimes using Web Audio API
class SoundFx {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    try {
      if (typeof window === 'undefined') return null;
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch (e) {
      return null;
    }
  }

  playBubbleStart() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {
      // Audio fx ignored safely
    }
  }

  playBubblePop() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      // Audio fx ignored safely
    }
  }

  playSuccessChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.08, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    } catch (e) {
      // Audio fx ignored safely
    }
  }
}

export const soundFx = new SoundFx();

// Global active audio playback element
let currentAudioElement: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Strict male keyword blacklist to prevent robotic or male voices
 */
const STRICT_MALE_KEYWORDS = [
  'male',
  'ravi',
  'rishi',
  'madhur',
  'hemant',
  'david',
  'mark',
  'george',
  'guy',
  'ryan',
  'christopher',
  'eric',
  'stefan',
  'pradeep',
  'anand',
  'amit',
  'rahul',
  'karan',
  'vikram',
  'suresh',
  'mahesh',
  'james',
  'john',
  'robert',
  'michael',
  'william',
  'daniel',
  'paul',
  'charles',
  'alex',
  'fred',
  'oliver',
  'thomas',
  'arthur',
  'brian',
  'richard',
  'joseph',
  'stephen',
  'andrew',
  'kevin',
  'jason',
  'justin',
  'brandon',
];

/**
 * Checks if a SpeechSynthesisVoice is definitely or likely male
 */
export function isDefinitiveMaleVoice(v: SpeechSynthesisVoice): boolean {
  const name = (v.name || '').toLowerCase();
  const uri = (v.voiceURI || '').toLowerCase();

  // If explicitly labeled female, it is definitely not male
  if (name.includes('female') || uri.includes('female')) {
    return false;
  }

  // Exclude any known male voice names
  return STRICT_MALE_KEYWORDS.some((kw) => name.includes(kw) || uri.includes(kw));
}

/**
 * Female voice preference selector:
 * Strictly selects clear, natural female voices with priority on Indian English/Hindi
 */
export function getBestFemaleVoice(
  targetLang: 'en-IN' | 'hi-IN' | 'en-US' = 'en-IN'
): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const isHindi = targetLang.startsWith('hi');

  // Filter out all male voices first
  const nonMaleVoices = voices.filter((v) => !isDefinitiveMaleVoice(v));
  const pool = nonMaleVoices.length > 0 ? nonMaleVoices : voices;

  if (isHindi) {
    // 1. High-priority natural female Hindi voices (Swara, Kalpana, Lekha, Google Hindi Female)
    const naturalHindiFemale = pool.find((v) => {
      const n = v.name.toLowerCase();
      const l = v.lang.toLowerCase();
      const isHi = l.startsWith('hi') || n.includes('hindi');
      return (
        isHi &&
        (n.includes('swara') ||
          n.includes('kalpana') ||
          n.includes('lekha') ||
          n.includes('female') ||
          n.includes('google हिन्दी'))
      );
    });
    if (naturalHindiFemale) return naturalHindiFemale;

    // 2. Any non-male Hindi voice
    const anyHindi = pool.find(
      (v) =>
        !isDefinitiveMaleVoice(v) &&
        (v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'))
    );
    if (anyHindi) return anyHindi;

    // 3. Fallback: Indian English female voice (pronounces Hinglish with natural Indian cadence)
    const indianFemale = pool.find((v) => {
      const n = v.name.toLowerCase();
      const l = v.lang.toLowerCase();
      const isInd = l === 'en-in' || l.includes('in') || n.includes('india');
      return (
        isInd &&
        (n.includes('heera') ||
          n.includes('neha') ||
          n.includes('priya') ||
          n.includes('veena') ||
          n.includes('female'))
      );
    });
    if (indianFemale) return indianFemale;
  } else {
    // English Target
    // 1. Natural Indian English Female voices (Top priority: Heera, Neha, Priya, Veena, Lekha)
    const indianFemale = pool.find((v) => {
      const n = v.name.toLowerCase();
      const l = v.lang.toLowerCase();
      const isInd = l === 'en-in' || l.includes('in') || n.includes('india');
      return (
        isInd &&
        (n.includes('heera') ||
          n.includes('neha') ||
          n.includes('priya') ||
          n.includes('veena') ||
          n.includes('lekha') ||
          n.includes('female'))
      );
    });
    if (indianFemale) return indianFemale;

    // 2. Any Indian English voice that is verified non-male
    const anyIndianNonMale = pool.find((v) => {
      const l = v.lang.toLowerCase();
      const n = v.name.toLowerCase();
      return (
        !isDefinitiveMaleVoice(v) &&
        (l === 'en-in' || (n.includes('india') && l.startsWith('en')))
      );
    });
    if (anyIndianNonMale) return anyIndianNonMale;

    // 3. World-class natural, clear female voices (Jenny, Aria, Ava, Samantha, Zira, Serena)
    const topGlobalFemale = pool.find((v) => {
      const n = v.name.toLowerCase();
      return (
        n.includes('jenny') ||
        n.includes('aria') ||
        n.includes('ava') ||
        n.includes('samantha') ||
        n.includes('zira') ||
        n.includes('serena') ||
        n.includes('karen') ||
        n.includes('victoria') ||
        n.includes('female')
      );
    });
    if (topGlobalFemale) return topGlobalFemale;
  }

  // 4. Any voice with 'female' in its descriptor
  const anyExplicitFemale = pool.find((v) => v.name.toLowerCase().includes('female'));
  if (anyExplicitFemale) return anyExplicitFemale;

  // 5. Any language-matching non-male candidate
  const anyMatch = pool.find(
    (v) => !isDefinitiveMaleVoice(v) && v.lang.toLowerCase().startsWith(isHindi ? 'hi' : 'en')
  );
  if (anyMatch) return anyMatch;

  return pool[0] || null;
}

/**
 * Strips emojis, UI keywords, quotes, markdown formatting, and symbols
 * so the TTS engine speaks naturally like a human instead of reading emojis
 * ("smiling face with smiling eyes", "clapping hands sign") or punctuation like a robot.
 */
export function cleanTextForSpeech(raw: string): string {
  if (!raw) return '';
  let text = raw;

  // Strip UI label prefixes if present
  text = text.replace(/^(Buddy|Coach Neha|Assistant|Learner|User):\s*/i, '');
  text = text.replace(/(Natural Phrasing|Suggested Answer|Correct Sentence|Grammar Correction):\s*/gi, '');

  // Strip markdown styling: headers, asterisks, underscores, backticks, tildes
  text = text.replace(/[*_~#`]/g, '');

  // Strip all emojis (Unicode ranges and pictographs)
  // This prevents Web Speech API and TTS models from saying "smiling face with smiling eyes", "clapping hands sign", etc.
  text = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1FA00}-\u{1FAFF}]/gu, '');
  try {
    text = text.replace(/\p{Extended_Pictographic}/gu, '');
  } catch (e) {}

  // Replace single and double quotes so TTS doesn't read aloud "single quote ... end single quote"
  text = text.replace(/['"“”‘’]/g, '');

  // Replace colons followed by a space with a comma so speech pauses naturally rather than saying "colon"
  text = text.replace(/:\s+/g, ', ');

  // Clean brackets and parentheses
  text = text.replace(/[()[\]{}]/g, ' ');

  // Collapse consecutive whitespaces and trim
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

export function getPreferredVoice(): string {
  try {
    return localStorage.getItem('buddy_preferred_voice') || 'ritu';
  } catch (e) {
    return 'ritu';
  }
}

export function setPreferredVoice(voice: string) {
  try {
    localStorage.setItem('buddy_preferred_voice', voice);
  } catch (e) {}
}

const AUDIO_MUTED_KEY = 'app_audio_muted';
let isMutedState = typeof window !== 'undefined' ? localStorage.getItem(AUDIO_MUTED_KEY) === 'true' : false;

export function isAudioMuted(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUDIO_MUTED_KEY) === 'true';
  }
  return isMutedState;
}

export function setAudioMuted(muted: boolean): void {
  isMutedState = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUDIO_MUTED_KEY, muted ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('app_audio_mute_change', { detail: { muted } }));
  }
  if (muted) {
    stopSpeaking();
  }
}

export function toggleAudioMute(): boolean {
  const next = !isAudioMuted();
  setAudioMuted(next);
  return next;
}

let activeSpeakSessionId = 0;

// Speech Synthesis & Natural Audio Helper
export async function speakText(
  rawText: string,
  lang: 'en-IN' | 'en-US' | 'hi-IN' = 'en-IN',
  rate: number = 0.93,
  onEnd?: () => void,
  customSpeaker?: string
): Promise<boolean> {
  try {
    if (isAudioMuted()) {
      if (onEnd) onEnd();
      return false;
    }

    // Stop any active audio / speech first and invalidate in-flight fetches
    stopSpeaking();
    const sessionId = ++activeSpeakSessionId;

    const text = cleanTextForSpeech(rawText);

    if (!text || !text.trim()) {
      if (onEnd) onEnd();
      return false;
    }

    const isHindiText = /[\u0900-\u097F]/.test(text) || lang.startsWith('hi');
    const targetLang = isHindiText ? 'hi-IN' : 'en-IN';

    const speaker = customSpeaker || getPreferredVoice();

    // If user selected browser native voice, use browser SpeechSynthesis directly
    if (speaker === 'browser') {
      return fallbackBrowserSpeak(text, targetLang, rate, onEnd);
    }

    // Attempt 1: Try natural backend TTS (using locked Indian speaker "ritu" on bulbul:v3)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          lang: targetLang,
          speaker: speaker || 'ritu',
          pace: 0.94,
          loudness: 1.0,
        }),
      });

      // If another speech request was triggered while fetching, ignore this obsolete response
      if (sessionId !== activeSpeakSessionId) {
        return false;
      }

      if (res.ok) {
        const data = await res.json();
        if (sessionId !== activeSpeakSessionId) {
          return false;
        }

        const audioSource = data.audioData || (data.audioBase64 ? `data:audio/wav;base64,${data.audioBase64}` : null);
        if (audioSource && (data.success || data.audioData || data.audioBase64)) {
          // Stop any intermediate audio before playing
          if (currentAudioElement) {
            try {
              currentAudioElement.pause();
              currentAudioElement.currentTime = 0;
            } catch (_) {}
            currentAudioElement = null;
          }

          const audio = new Audio(audioSource);
          currentAudioElement = audio;
          audio.playbackRate = rate;

          audio.onended = () => {
            if (currentAudioElement === audio) {
              currentAudioElement = null;
            }
            if (onEnd) onEnd();
          };

          audio.onerror = () => {
            if (currentAudioElement === audio) {
              currentAudioElement = null;
            }
            fallbackBrowserSpeak(text, targetLang, rate, onEnd);
          };

          if (sessionId !== activeSpeakSessionId) {
            return false;
          }

          await audio.play();
          return true;
        }
      }
    } catch (err) {
      // Gracefully fallback to browser speech synthesis
    }

    if (sessionId !== activeSpeakSessionId) {
      return false;
    }

    // Attempt 2: Fallback to high-quality browser SpeechSynthesis with female Indian voices
    return fallbackBrowserSpeak(text, targetLang, rate, onEnd);
  } catch (outerErr) {
    console.warn('Unhandled speakText error intercepted safely:', outerErr);
    if (onEnd) onEnd();
    return false;
  }
}

// Fallback browser speech synthesis with strict female voice and warm natural pitch
function fallbackBrowserSpeak(
  text: string,
  lang: 'en-IN' | 'hi-IN' | 'en-US',
  rate: number = 0.93,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis || typeof window.speechSynthesis.speak !== 'function') {
    console.warn('SpeechSynthesis not supported in this browser.');
    if (onEnd) onEnd();
    return false;
  }

  try {
    if (typeof window.speechSynthesis.cancel === 'function') {
      window.speechSynthesis.cancel();
    }
  } catch (e) {}

  const isHindi = lang.startsWith('hi') || /[\u0900-\u097F]/.test(text);
  const targetLang = isHindi ? 'hi-IN' : 'en-IN';

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLang;
  utterance.rate = rate || 0.93; // Clear, comfortable instructional cadence
  utterance.pitch = 1.08; // Warm, natural, bright female vocal pitch (no deep male timbre)

  // Strictly select female voice
  const femaleVoice = getBestFemaleVoice(targetLang);
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  // Prevent Chrome garbage-collection bug
  activeUtterance = utterance;

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    activeUtterance = null;
    console.warn('Speech synthesis error:', e);
    if (onEnd) onEnd();
  };

  try {
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.warn('Failed to call window.speechSynthesis.speak:', e);
    activeUtterance = null;
    if (onEnd) onEnd();
    return false;
  }
}

export function playFixedAudio(
  filename: string,
  onPlay?: () => void,
  onEnded?: () => void
): HTMLAudioElement | null {
  if (isAudioMuted()) {
    if (onEnded) onEnded();
    return null;
  }

  try {
    stopSpeaking();
    let cleanPath = filename.trim();
    if (cleanPath.startsWith('public/')) {
      cleanPath = cleanPath.slice(6);
    }
    if (!cleanPath.startsWith('/')) {
      cleanPath = cleanPath.startsWith('audio/fixed/') ? `/${cleanPath}` : `/audio/fixed/${cleanPath}`;
    }
    const audio = new Audio(cleanPath);
    audio.preload = 'auto';
    currentAudioElement = audio;

    audio.onplay = () => {
      if (onPlay) onPlay();
    };

    audio.onended = () => {
      if (currentAudioElement === audio) {
        currentAudioElement = null;
      }
      if (onEnded) onEnded();
    };

    audio.onerror = () => {
      console.warn(`Fixed audio file ${cleanPath} not found or failed to play.`);
      if (currentAudioElement === audio) {
        currentAudioElement = null;
      }
      if (onEnded) onEnded();
    };

    audio.play().then(() => {
      if (onPlay) onPlay();
    }).catch(err => {
      console.log('Fixed audio play prevented or failed (autoplay policy):', err);
      if (onEnded) onEnded();
    });
    return audio;
  } catch (e) {
    console.warn('Failed to play fixed audio:', e);
    if (onEnded) onEnded();
    return null;
  }
}

export function stopSpeaking() {
  activeSpeakSessionId++;
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch (e) {}
    currentAudioElement = null;
  }
  try {
    if (typeof window !== 'undefined' && window.speechSynthesis && typeof window.speechSynthesis.cancel === 'function') {
      window.speechSynthesis.cancel();
    }
  } catch (e) {}
}

// Browser Speech Recognition Factory
export function createSpeechRecognizer(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void
) {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-IN'; // Optimized for Indian English accents

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    const currentText = final || interim;
    onResult(currentText, Boolean(final));
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech recognition error:', event.error);
    onError(event.error);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
