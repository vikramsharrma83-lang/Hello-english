import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { findMatchingPatterns, generateLocalAnalysis } from "./src/data/patternEngine.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI lazily and safely with telemetry header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment. Dynamic Pattern Engine will be used.");
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

// Endpoint: AI Understanding Pipeline
app.post("/api/understand", async (req, res) => {
  try {
    const { transcript, question, category } = req.body;

    if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
      return res.status(400).json({ error: "Transcript is required." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const fallback = generateLocalAnalysis(transcript, question || "", category || "workplace");
      return res.json(fallback);
    }

    // Retrieve relevant reference patterns from englishPatterns library
    const matchingPatterns = findMatchingPatterns(transcript, 6);
    const patternReferenceText = matchingPatterns.length > 0
      ? matchingPatterns
          .map(
            (m) =>
              `- [${m.pattern.id}] (${m.pattern.category} | ${m.pattern.pattern}): Broken: "${m.pattern.broken_english}" -> Natural: "${m.pattern.natural_english}"`
          )
          .join("\n")
      : "No direct pattern match; use standard simple conversational English principles.";

    const systemPrompt = `You are Coach Neha, a friendly, warm, and empowering AI English coach designed for Indian blue-collar and frontline learners (warehouse staff, delivery riders, QSR & retail workers, drivers, technicians).

PRODUCT PHILOSOPHY & PATTERN LIBRARY:
- "Understand first. Improve second."
- NEVER make the learner feel that they failed. Never use words like "Wrong", "Incorrect", "Grammar Error", "Mistake", or "Failed".
- The learner may speak broken English, literal Hindi-to-English translations (e.g. "I reaching warehouse", "Manager telling me", "Why you not pick call", "parcel is break").

CORE INSTRUCTIONS:
1. Understand the learner's exact intended message with empathy.
2. Rephrase what they want to say into clear, natural, workplace-appropriate English. NEVER just repeat their broken sentence.
3. Provide a clear, natural conversational Hindi translation in Devanagari script.
4. Write a warm, encouraging one-sentence coaching remark from Coach Neha.
5. Provide 1 to 2 key phrases/vocabulary with simple Hindi meanings.
6. Reference patterns from the library to ensure practical, natural phrasing.`;

    const userPrompt = `Category: ${category || 'workplace'}
Context Situation: "${question || 'Workplace conversation'}"
Learner Speech: "${transcript}"

REFERENCE PATTERNS FROM 500-PATTERN LIBRARY:
${patternReferenceText}

Analyze the learner's speech and output strictly valid JSON matching the schema.`;

    const local = generateLocalAnalysis(transcript, question || "", category || "workplace");

    const generatePromise = ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
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
              description: "The improved, natural, polite workplace English sentence representing what they want to say.",
            },
            hindiMeaning: {
              type: Type.STRING,
              description: "Natural conversational Hindi translation in Devanagari script.",
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
              description: "Confidence score percentage (85 to 99).",
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

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI generation timeout")), 12000)
    );

    let parsed: any = {};
    try {
      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      parsed = JSON.parse(response.text || "{}");
    } catch (apiErr) {
      console.warn("AI generation fallback to pattern engine:", apiErr);
      return res.json(local);
    }

    return res.json({
      learnerTranscript: transcript,
      intendedMeaning: parsed.intendedMeaning || local.intendedMeaning,
      naturalEnglish: parsed.naturalEnglish || local.naturalEnglish,
      hindiMeaning: parsed.hindiMeaning || local.hindiMeaning,
      encouragingNote: parsed.encouragingNote || local.encouragingNote,
      keyVocabulary: (parsed.keyVocabulary && parsed.keyVocabulary.length > 0) ? parsed.keyVocabulary : local.keyVocabulary,
      confidenceScore: typeof parsed.confidenceScore === 'number' && parsed.confidenceScore > 1 ? parsed.confidenceScore : local.confidenceScore,
    });
  } catch (error: any) {
    console.error("Error in /api/understand, switching to dynamic pattern engine:", error);
    const { transcript, question, category } = req.body;
    const fallback = generateLocalAnalysis(transcript || "", question || "", category || "workplace");
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
