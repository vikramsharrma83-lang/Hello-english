import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { findMatchingPatterns } from "./src/data/patternEngine";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI lazily and safely with telemetry header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment. Fallback heuristic engine will be used.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback heuristic generator when API key is not yet configured or for instant offline response
function getFallbackAnalysis(transcript: string, question: string) {
  const lower = transcript.toLowerCase();
  let natural = transcript;
  let hindi = "मैं इसे अच्छे तरीके से समझाऊंगा।";
  let vocab = [{ wordOrPhrase: "on my way", hindiMeaning: "रास्ते में" }];

  // Reference the English patterns library for matching broken English patterns
  const matchingPatterns = findMatchingPatterns(transcript, 3);
  const topPattern = matchingPatterns.length > 0 ? matchingPatterns[0] : null;

  if (topPattern && topPattern.score >= 3.0) {
    natural = topPattern.pattern.natural_english;
    hindi = "मैं इसे स्पष्ट और स्वाभाविक अंग्रेजी में कह रहा हूँ।";
    vocab = [
      { wordOrPhrase: topPattern.pattern.pattern, hindiMeaning: topPattern.pattern.category }
    ];
  } else if (lower.includes("bike") || lower.includes("road") || lower.includes("traffic") || lower.includes("late")) {
    natural = "I will call my supervisor while I am on my way to work.";
    hindi = "मैं काम पर जाते समय अपने सुपरवाइजर को सूचित कर दूंगा।";
    vocab = [
      { wordOrPhrase: "on my way to work", hindiMeaning: "काम पर जाते समय / रास्ते में" },
      { wordOrPhrase: "inform my supervisor", hindiMeaning: "अपने सुपरवाइजर को सूचित करना" }
    ];
  } else if (lower.includes("sir") && (lower.includes("explain") || lower.includes("help") || lower.includes("not understand"))) {
    natural = "Excuse me sir, could you please explain this task once again?";
    hindi = "माफ़ कीजिये सर, क्या आप कृपया यह काम एक बार फिर समझा सकते हैं?";
    vocab = [
      { wordOrPhrase: "once again", hindiMeaning: "एक बार फिर" },
      { wordOrPhrase: "explain this task", hindiMeaning: "इस काम को समझाना" }
    ];
  } else if (lower.includes("mistake") || lower.includes("sorry") || lower.includes("wrong")) {
    natural = "I made a mistake in the order scanning, and I will fix it right away.";
    hindi = "मुझसे ऑर्डर स्कैनिंग में गलती हो गई, और मैं इसे तुरंत ठीक कर दूंगा।";
    vocab = [
      { wordOrPhrase: "right away", hindiMeaning: "तुरंत / अभी" },
      { wordOrPhrase: "fix it", hindiMeaning: "इसे ठीक करना" }
    ];
  } else if (lower.includes("box") || lower.includes("parcel") || lower.includes("damage") || lower.includes("broken")) {
    natural = "Sir, this parcel arrived in damaged condition and is leaking.";
    hindi = "सर, यह पार्सल डैमेज स्थिति में मिला है और इसमें से सामान लीक हो रहा है।";
    vocab = [
      { wordOrPhrase: "arrived in damaged condition", hindiMeaning: "खराब स्थिति में आया" },
      { wordOrPhrase: "leaking", hindiMeaning: "रिसाव होना / रिसना" }
    ];
  } else if (lower.includes("leave") || lower.includes("doctor") || lower.includes("tomorrow") || lower.includes("urgent")) {
    natural = "I need one day of leave tomorrow due to an urgent family doctor visit.";
    hindi = "मुझे परिवार में डॉक्टर के पास जाने के कारण कल एक दिन की छुट्टी चाहिए।";
    vocab = [
      { wordOrPhrase: "one day of leave", hindiMeaning: "एक दिन की छुट्टी" },
      { wordOrPhrase: "due to", hindiMeaning: "के कारण" }
    ];
  } else {
    // General polished sentence
    const words = transcript.trim().split(/\s+/);
    if (words.length > 0) {
      natural = transcript.charAt(0).toUpperCase() + transcript.slice(1);
      if (!natural.endsWith('.')) natural += '.';
    }
  }

  return {
    learnerTranscript: transcript,
    intendedMeaning: "You wanted to clearly communicate your message in simple workplace English.",
    naturalEnglish: natural,
    hindiMeaning: hindi,
    encouragingNote: "Great attempt! Coach Neha understood your exact thought.",
    keyVocabulary: vocab,
    confidenceScore: 94
  };
}

// Endpoint: AI Understanding Pipeline
app.post("/api/understand", async (req, res) => {
  try {
    const { transcript, question, category } = req.body;

    if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
      return res.status(400).json({ error: "Transcript is required." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const fallback = getFallbackAnalysis(transcript, question || "");
      return res.json(fallback);
    }

    // Retrieve relevant reference patterns from englishPatterns.json library
    const matchingPatterns = findMatchingPatterns(transcript, 6);
    const patternReferenceText = matchingPatterns.length > 0
      ? matchingPatterns
          .map(
            (m) =>
              `- [${m.pattern.id}] (${m.pattern.category} | ${m.pattern.pattern}): Broken: "${m.pattern.broken_english}" -> Natural: "${m.pattern.natural_english}"`
          )
          .join("\n")
      : "No direct pattern match; use standard simple conversational English principles.";

    const systemPrompt = `You are Coach Neha, a friendly, warm, and empowering AI English coach designed for Indian blue-collar and entry-level learners (warehouse staff, delivery drivers, QSR & retail workers, supervisors, technicians).

PRODUCT PHILOSOPHY & PATTERN LIBRARY ENGINE:
- "Understand first. Improve second."
- NEVER make the learner feel that they failed.
- NEVER use words like "Wrong", "Incorrect", "Grammar Error", "Mistake", or "Failed".
- The learner may speak imperfect English, literal Hindi-to-English translations (e.g., "bike running", "order making", "traffic stucking", "sir please tell again"), or broken phrases.

REFERENCE LIBRARY RULES (from src/data/englishPatterns.json):
1. Understand the learner's intended meaning first.
2. Detect whether their sentence matches or resembles an English pattern in the library.
3. Use the matching pattern to help produce a simple, correct natural rephrase.
4. Never force a library sentence if it changes the learner's intended meaning.
5. Never invent facts that the learner did not say.
6. Keep the existing My Day behaviour: natural rephrase first, then one relevant leading question to continue the conversation when in conversational dialogue.

OUTPUT REQUIREMENTS:
- Step 1: Detect their true intended meaning with total empathy.
- Step 2: Formulate the exact natural, clear, workplace-appropriate English sentence that expresses what they want to say. Do NOT make it overly complex, formal, or academic. Keep it practical, polite, and natural.
- Step 3: Provide a simple Hindi translation of the natural English sentence in Devanagari script.
- Step 4: Write a warm, encouraging one-sentence coaching remark from Coach Neha.
- Step 5: Highlight 1 or 2 high-utility vocabulary or phrases with their Hindi meanings.`;

    const userPrompt = `Context Question: "${question || 'Workplace situation'}"
Category: ${category || 'workplace'}
What the learner said: "${transcript}"

REFERENCE PATTERNS FROM LIBRARY:
${patternReferenceText}

Analyze the learner's speech according to the 6 engine rules and respond strictly in JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intendedMeaning: {
              type: Type.STRING,
              description: "A clear, empathetic summary of what the learner is trying to communicate.",
            },
            naturalEnglish: {
              type: Type.STRING,
              description: "The closest natural, practical workplace English sentence representing what they want to say.",
            },
            hindiMeaning: {
              type: Type.STRING,
              description: "Natural conversational Hindi translation of the improved English sentence in Devanagari script.",
            },
            encouragingNote: {
              type: Type.STRING,
              description: "A warm, uplifting Coach Neha remark celebrating their effort.",
            },
            keyVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  wordOrPhrase: { type: Type.STRING },
                  hindiMeaning: { type: Type.STRING },
                },
                required: ["wordOrPhrase", "hindiMeaning"],
              },
              description: "1 to 2 key phrases in the improved sentence with simple Hindi meaning.",
            },
            confidenceScore: {
              type: Type.INTEGER,
              description: "Confidence percentage of intent comprehension (85 to 99).",
            },
          },
          required: [
            "intendedMeaning",
            "naturalEnglish",
            "hindiMeaning",
            "encouragingNote",
            "keyVocabulary",
            "confidenceScore",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");

    return res.json({
      learnerTranscript: transcript,
      intendedMeaning: parsed.intendedMeaning || "You wanted to share your message clearly.",
      naturalEnglish: parsed.naturalEnglish || transcript,
      hindiMeaning: parsed.hindiMeaning || "मैं काम पर जाते समय अपने सुपरवाइजर को सूचित करूंगा।",
      encouragingNote: parsed.encouragingNote || "Yes, I understand what you mean! Great job practicing.",
      keyVocabulary: parsed.keyVocabulary || [{ wordOrPhrase: "on my way", hindiMeaning: "रास्ते में" }],
      confidenceScore: parsed.confidenceScore || 95,
    });
  } catch (error: any) {
    console.error("Error in /api/understand:", error);
    // Graceful fallback so learner never experiences a broken screen
    const { transcript, question } = req.body;
    const fallback = getFallbackAnalysis(transcript || "I am on the way", question || "");
    return res.json(fallback);
  }
});

// Convert 24kHz Mono 16-bit PCM to standard WAV base64 format
function pcmToWavBase64(pcmBase64: string, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): string {
  const pcmBuffer = Buffer.from(pcmBase64, 'base64');
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  const wavBuffer = Buffer.alloc(totalSize);

  // RIFF chunk descriptor
  wavBuffer.write('RIFF', 0);
  wavBuffer.writeUInt32LE(totalSize - 8, 4);
  wavBuffer.write('WAVE', 8);

  // "fmt " sub-chunk
  wavBuffer.write('fmt ', 12);
  wavBuffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  wavBuffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  wavBuffer.writeUInt16LE(numChannels, 22);
  wavBuffer.writeUInt32LE(sampleRate, 24);
  wavBuffer.writeUInt32LE(byteRate, 28);
  wavBuffer.writeUInt16LE(blockAlign, 32);
  wavBuffer.writeUInt16LE(bitsPerSample, 34);

  // "data" sub-chunk
  wavBuffer.write('data', 36);
  wavBuffer.writeUInt32LE(dataSize, 40);
  pcmBuffer.copy(wavBuffer, 44);

  return wavBuffer.toString('base64');
}

// Endpoint: Dynamic Practical Question Generator
app.post("/api/generate-question", async (req, res) => {
  try {
    const { category, targetRole } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({ status: "ok" });
    }

    const prompt = `Generate 1 fresh, practical, realistic spoken English practice question for an Indian frontline/entry-level worker (${targetRole || 'general frontline'}).
Category: ${category || 'workplace'}
Make sure the question is relatable to daily workplace or life situations.
Provide English question, Hindi translation in Devanagari, English hint, Hindi hint, and level (Beginner/Intermediate/Advanced).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are Coach Neha's curriculum designer for conversational Indian English learners.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questionEn: { type: Type.STRING },
            questionHi: { type: Type.STRING },
            hintEn: { type: Type.STRING },
            hintHi: { type: Type.STRING },
            level: { type: Type.STRING },
            samplePhrases: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["questionEn", "questionHi", "hintEn", "hintHi", "level", "samplePhrases"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);
  } catch (err) {
    console.error("Error generating question:", err);
    return res.status(500).json({ error: "Failed to generate question" });
  }
});

// Endpoint: High Quality Natural Audio Speech Synthesis (Indian English / Hindi)
app.post("/api/tts", async (req, res) => {
  try {
    const { text, lang = 'en-IN', voice = 'Kore' } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: "Text is required for TTS." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({ fallback: true, message: "Use client-side speech synthesis." });
    }

    const isHindi = /[\u0900-\u097F]/.test(text) || lang.startsWith('hi');
    const promptInstruction = isHindi
      ? `Speak naturally in a warm, polite, and encouraging Hindi voice: ${text}`
      : `Speak clearly in a natural, polite, and friendly Indian English accent: ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: promptInstruction }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const pcmData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (pcmData) {
      const wavBase64 = pcmToWavBase64(pcmData, 24000);
      return res.json({ audioData: `data:audio/wav;base64,${wavBase64}`, success: true });
    }

    return res.json({ fallback: true });
  } catch (err) {
    console.warn("TTS API fallback to client synthesis:", err);
    return res.json({ fallback: true });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", coach: "Coach Neha", app: "HELLO ENGLISH" });
});

// Vite Middleware for Full-Stack App
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HELLO ENGLISH Server running on port ${PORT}`);
  });
}

startServer();
