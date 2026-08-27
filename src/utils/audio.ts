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

// Speech Synthesis & Natural Audio Helper
export async function speakText(
  text: string,
  lang: 'en-IN' | 'en-US' | 'hi-IN' = 'en-IN',
  rate: number = 0.92,
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

  // Attempt 1: Try natural backend TTS for high quality human-like Indian voice
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        lang: targetLang,
        voice: isHindiText ? 'Kore' : 'Zephyr',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audioData && data.success) {
        const audio = new Audio(data.audioData);
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

  // Attempt 2: Fallback to high-quality browser SpeechSynthesis with Indian voices
  return fallbackBrowserSpeak(text, targetLang, rate, onEnd);
}

// Fallback browser speech synthesis with Indian accent prioritization
function fallbackBrowserSpeak(
  text: string,
  lang: 'en-IN' | 'hi-IN' | 'en-US',
  rate: number = 0.92,
  onEnd?: () => void
): boolean {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported in this browser.');
    if (onEnd) onEnd();
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.02; // Warm, natural friendly pitch

  const voices = window.speechSynthesis.getVoices();
  const isHindi = lang.startsWith('hi') || /[\u0900-\u097F]/.test(text);

  if (isHindi) {
    utterance.lang = 'hi-IN';
    const hindiVoice = voices.find(
      (v) =>
        v.lang === 'hi-IN' ||
        v.lang.startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('swara') ||
        v.name.toLowerCase().includes('madhur') ||
        v.name.toLowerCase().includes('kalpana') ||
        v.name.toLowerCase().includes('hemant')
    );
    if (hindiVoice) utterance.voice = hindiVoice;
  } else {
    utterance.lang = 'en-IN';
    // Prioritize natural Indian English voices
    const indianVoice = voices.find(
      (v) =>
        v.lang === 'en-IN' ||
        v.lang.toLowerCase().includes('en-in') ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('indian') ||
        v.name.toLowerCase().includes('heera') ||
        v.name.toLowerCase().includes('ravi') ||
        v.name.toLowerCase().includes('neha') ||
        v.name.toLowerCase().includes('priya') ||
        v.name.toLowerCase().includes('rishi') ||
        v.name.toLowerCase().includes('lekha') ||
        v.name.toLowerCase().includes('veena')
    );
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('zira'))
    );
    if (indianVoice) {
      utterance.voice = indianVoice;
    } else if (naturalVoice) {
      utterance.voice = naturalVoice;
    }
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
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
