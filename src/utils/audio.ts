/**
 * Audio synthesis, speech recognition, and sound effects for Coach Neha
 */

// Soft UI Chimes using Web Audio API
class SoundFx {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playBubbleStart() {
    try {
      const ctx = this.getContext();
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
      console.log('Audio fx ignored');
    }
  }

  playBubblePop() {
    try {
      const ctx = this.getContext();
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
      console.log('Audio fx ignored');
    }
  }

  playSuccessChime() {
    try {
      const ctx = this.getContext();
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
      console.log('Audio fx ignored');
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

// Speech Synthesis & Natural Audio Helper
export async function speakText(
  text: string,
  lang: 'en-IN' | 'en-US' | 'hi-IN' = 'en-IN',
  rate: number = 0.93,
  onEnd?: () => void
): Promise<boolean> {
  // Stop any active audio / speech first
  stopSpeaking();

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return false;
  }

  const isHindiText = /[\u0900-\u097F]/.test(text) || lang.startsWith('hi');
  const targetLang = isHindiText ? 'hi-IN' : 'en-IN';

  // Attempt 1: Try natural backend TTS (using Sarvam Indian female speaker "meera")
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        lang: targetLang,
        speaker: 'meera', // Female Indian speaker
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const audioSource = data.audioData || (data.audioBase64 ? `data:audio/wav;base64,${data.audioBase64}` : null);
      if (audioSource && (data.success || data.audioData || data.audioBase64)) {
        const audio = new Audio(audioSource);
        currentAudioElement = audio;
        audio.playbackRate = rate;

        audio.onended = () => {
          currentAudioElement = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          currentAudioElement = null;
          fallbackBrowserSpeak(text, targetLang, rate, onEnd);
        };

        await audio.play();
        return true;
      }
    }
  } catch (err) {
    // Gracefully fallback to browser speech synthesis
  }

  // Attempt 2: Fallback to high-quality browser SpeechSynthesis with female Indian voices
  return fallbackBrowserSpeak(text, targetLang, rate, onEnd);
}

// Fallback browser speech synthesis with strict female voice and warm natural pitch
function fallbackBrowserSpeak(
  text: string,
  lang: 'en-IN' | 'hi-IN' | 'en-US',
  rate: number = 0.93,
  onEnd?: () => void
): boolean {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported in this browser.');
    if (onEnd) onEnd();
    return false;
  }

  window.speechSynthesis.cancel();

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

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch (e) {}
    currentAudioElement = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
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
