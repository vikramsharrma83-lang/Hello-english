import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { findMatchingPatterns, generateLocalAnalysis, applyComprehensiveGrammarFixes } from "./src/data/patternEngine.ts";
import { 
  applySheekoGrammarCorrections, 
  parseLearnerStoryToMeaningRepresentation,
  synthesizeNaturalEnglishStory
} from "./src/data/sheekoEngine.ts";
import {
  findSheekoReferenceMatch,
  findSheekoRephraseTemplate,
  getSheekoReferences
} from "./server/services/sheekoServerEngine.ts";
import { callLlamaConversationStep } from "./server/services/llamaService.ts";
import { analyzeDrillFeedbackWithLlama } from "./server/services/llamaDrillService.ts";
import { generateGeminiContent } from "./server/services/geminiService.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

const referencePatterns = getSheekoReferences();
console.log(`[SHEEKO REFERENCE ENGINE] Active reference patterns count: ${referencePatterns.length}`);

// Token-based inverted lookup function leveraging sheekoEngine
function findBestReferenceMatch(text: string, category?: string) {
  return findSheekoReferenceMatch(text, category);
}

// Endpoint: Search 10,000 Reference Patterns with zero lag
app.get("/api/patterns/reference", (req, res) => {
  const query = ((req.query.q as string) || "").trim().toLowerCase();
  const category = (req.query.category as string) || "All";
  const limit = Math.min(parseInt((req.query.limit as string) || "40", 10), 100);
  const page = Math.max(parseInt((req.query.page as string) || "1", 10), 1);

  let filtered = referencePatterns;

  if (category !== "All") {
    filtered = filtered.filter((r) => r.category.toLowerCase() === category.toLowerCase());
  }

  if (query) {
    const qTokens = query.split(/\s+/).filter(Boolean);
    filtered = filtered.filter((r) => {
      const target = `${r.sentence} ${r.normalizedMeaning} ${(r.activities || []).join(" ")} ${(r.places || []).join(" ")} ${(r.people || []).join(" ")}`.toLowerCase();
      return qTokens.every((tok) => target.includes(tok));
    });
  }

  const totalCount = filtered.length;
  const startIndex = (page - 1) * limit;
  const records = filtered.slice(startIndex, startIndex + limit);

  return res.json({
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    page,
    limit,
    records,
    distribution: {
      DAILY: referencePatterns.filter((r) => r.category === "DAILY").length,
      WORK: referencePatterns.filter((r) => r.category === "WORK").length,
      FRIENDS: referencePatterns.filter((r) => r.category === "FRIENDS").length,
      total: referencePatterns.length,
    },
  });
});

// Endpoint: Engine 2 Post-Answer AI Feedback Pipeline (Listen -> Understand -> Rephrase -> Teach)
app.post("/api/understand", async (req, res) => {
  try {
    const { transcript, question, category } = req.body;

    if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
      return res.status(400).json({ error: "Transcript is required." });
    }

    const cleanTranscript = transcript.trim();
    const questionText = question || "";
    const drillCategory = category || "workplace";

    // Call Llama 3.1 8B via Groq with Gemini & Local fallback
    const analysis = await analyzeDrillFeedbackWithLlama({
      learnerTranscript: cleanTranscript,
      questionText,
      category: drillCategory,
    });

    return res.json(analysis);
  } catch (err) {
    console.error("Error in post-answer understanding:", err);
    const fallback = generateLocalAnalysis(
      (req.body?.transcript || "").trim(),
      req.body?.question || "",
      req.body?.category || "workplace"
    );
    return res.json(fallback);
  }
});

// Endpoint: Engine 3 Buddy Chat conversation step
app.post("/api/buddy-chat", async (req, res) => {
  try {
    const { history, learnerMessage, exchangeCount } = req.body;
    const cleanMsg = (learnerMessage || "").trim();
    const currentExchanges = typeof exchangeCount === 'number' ? exchangeCount : 1;

    // Detect if previous Buddy message was waiting for an English retry
    let wasAwaitingEnglishRetry = false;
    if (history && history.length > 0) {
      const lastBuddyMsg = [...history].reverse().find((m: any) => m.sender === 'buddy');
      if (lastBuddyMsg) {
        const text = (lastBuddyMsg.text || '').toLowerCase();
        if (
          text.includes('try karo') ||
          text.includes('try saying') ||
          text.includes('main sun raha hoon') ||
          text.includes('ab aap try') ||
          text.includes('aap try karo') ||
          text.includes('in english:') ||
          text.includes('english mein aap keh sakte ho') ||
          text.includes('you can say:')
        ) {
          wasAwaitingEnglishRetry = true;
        }
      }
    }

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are Buddy, a friendly English-speaking companion and language coach for beginner Indian learners.

BUDDY ADAPTIVE CONVERSATION INTELLIGENCE:
Buddy always starts the conversation in simple English with one short, friendly question.
Example: "Hello! I'm your English Buddy 😊 How are you today?"
Do not ask the learner to choose Hindi or English.

The learner may respond in Hindi, Hinglish, broken English, or English.

FOR EVERY LEARNER MESSAGE, BUDDY MUST INTELLIGENTLY UNDERSTAND:
1. What does the learner mean?
2. What language is the learner comfortable using right now?
3. How well can the learner currently express themselves in English?
4. Is the learner attempting English?
5. How much help does the learner need?
6. Should Buddy give support in Hinglish or continue the conversation in English?

BUDDY MUST ADAPT NATURALLY ON EVERY TURN:

1. IF THE LEARNER SPEAKS HINDI:
* Understand the meaning.
* Respond naturally in Hinglish.
* Give a simple English sentence for the learner's exact meaning.
* Encourage the learner to try saying it in English.
* STOP AND WAIT (Do not ask a new question! Leave nextQuestion as "").
Example:
Learner: "Aaj mera din acha nahi tha."
Buddy: "Achha, toh aaj aapka din acha nahi raha 😊 English mein aap bol sakte ho, 'My day was not good.' Aap ek baar English mein try karo."

2. IF THE LEARNER TRIES BROKEN ENGLISH:
* First recognise and encourage the effort.
* Understand the meaning.
* Give a gentle improvement only if needed.
* Do not make the learner feel wrong.
* Continue the natural conversation with ONE short question.
Example:
Learner: "My day not good."
Buddy: "Very good! 😊 Aapne acha try kiya. Bas ek chhota improvement: 'My day was not good.' Tell me, why was your day not good?"

3. IF THE LEARNER SPEAKS CORRECT OR UNDERSTANDABLE ENGLISH:
* Respond naturally.
* Continue the conversation primarily in simple English.
* Do not unnecessarily translate or teach.
Example:
Learner: "My day was not good."
Buddy: "Oh, I understand. Why was your day not good?"

4. IF THE LEARNER SWITCHES BACK TO HINDI:
* Do not reject Hindi.
* Understand the meaning.
* Return to Hinglish support.
* Give the learner the English version.
* Encourage another English attempt.

LANGUAGE PROGRESSION:
- Hindi/Hinglish is the support language.
- English is the conversation goal.
- As the learner becomes more comfortable speaking English, Buddy should naturally increase the amount of English used.
- Do not force this progression.
- Do not ask the learner which language they prefer.
- Buddy must infer the learner's current comfort level from the conversation.

BUDDY IS NOT A TRANSLATOR:
- Do not mechanically translate every sentence.
- Buddy is a natural conversation companion who: listens, understands, responds, encourages, gently improves English, continues the conversation.
- After helping the learner express something in English, Buddy should continue the conversation naturally in simple English whenever the learner is ready.
- If the learner struggles to understand the English question (e.g. "Samajh nahi aaya"), then Buddy may briefly explain it in Hindi/Hinglish and help them answer.
- Always provide the minimum amount of help needed. Never over-explain. Never give grammar lectures unless specifically asked.
- Never behave like an interviewer. Do not ask a question after every message. Sometimes simply respond naturally and allow the learner to continue.
- When asking a question, ask only one short and relevant question.

NO MACHINE-LIKE OUTPUT:
- Buddy must sound like a real, friendly person.
- Keep responses short, warm, and conversational.
- Do NOT output UI labels, SVG text, icon descriptions, headings, or technical information.
- Never output prefixes like "Natural Phrasing:", "Suggested Answer:", "Correct Sentence:", "Grammar Correction:".
- Put the complete, natural conversational reply directly in "naturalResponse".

THE GOLDEN RULE:
Buddy should meet the learner at their current level and gently move them one step toward better English.
Never push too hard. Never leave the learner stuck. Never make the learner feel wrong.
Understand first. Encourage second. Guide third. Adapt continuously.

Target exchange count is 12-15. If exchangeCount >= 13 or learner expresses goodbye/stopping, set shouldEnd to true.

RESPONSE FORMAT (Valid JSON ONLY):
{
  "understoodMeaning": "string - what the learner intended to say",
  "naturalResponse": "string - the complete, warm conversational response for Buddy to speak/send",
  "nextQuestion": "string - leave as empty string \"\" if already included in naturalResponse or if not asking a question",
  "subtleRecast": "string - simple English sentence model, or empty string \"\"",
  "awaitingEnglishRetry": boolean,
  "learnerComfortLanguage": "hindi" | "hinglish" | "english",
  "topic": "string",
  "conversationDepth": number,
  "needsClarification": boolean,
  "shouldEnd": boolean
}`;

    const userPrompt = JSON.stringify({
      exchangeCount: currentExchanges,
      history: history || [],
      latestLearnerMessage: cleanMsg,
      wasAwaitingEnglishRetry,
    });

    const parseJSONSafely = (text: string) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        // Try extracting json block via regex
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            return JSON.parse(match[0]);
          } catch (err) {
            return null;
          }
        }
        return null;
      }
    };

    let result = null;
    if (groqKey && groqKey.trim()) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey.trim()}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.6,
            max_tokens: 600,
            response_format: { type: "json_object" },
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            result = parseJSONSafely(content);
          }
        }
      } catch (e) {
        console.warn("Groq buddy chat error:", e);
      }
    }

    if (!result && geminiKey && geminiKey.trim()) {
      try {
        const text = await generateGeminiContent({
          apiKey: geminiKey,
          contents: `${systemPrompt}\n\nContext:\n${userPrompt}`,
          responseMimeType: "application/json",
          temperature: 0.6,
        });
        if (text) {
          result = parseJSONSafely(text);
        }
      } catch (e) {
        console.warn("Gemini buddy chat error:", e);
      }
    }

    if (!result) {
      const lower = cleanMsg.toLowerCase();
      const shouldEnd = currentExchanges >= 13 || lower.includes('bye') || lower.includes('goodbye') || lower.includes('stop');

      // Check if learner said they didn't understand the English question
      const isNotUnderstanding = /\b(samajh|samjha|nahi aaya|nahi samjha|samjh|kya matlab|don't understand|did not understand)\b/i.test(lower);

      const isHindiOrHinglish = /[\u0900-\u097F]/.test(cleanMsg) ||
        /\b(maine|khana|kha|liya|kiya|kaam|theek|samajh|gaya|gayi|aaya|aayi|kar|raha|rahi|hoon|hai|hain|mein|mera|meri|kuch|nahi|kya|bhai|dost|aaj|kal|subah|shaam|bahut|achha|accha|bohot|ghar|pata|mujhe|tum|aap|khelne|khel)\b/i.test(cleanMsg);

      let understoodMeaning = cleanMsg ? `You shared: "${cleanMsg}"` : "You started the conversation.";
      let naturalResponse = "Nice! 😊 That sounds interesting.";
      let nextQuestion = "";
      let subtleRecast = "";
      let awaitingEnglishRetry = false;
      let learnerComfortLanguage: 'hindi' | 'hinglish' | 'english' = isHindiOrHinglish ? 'hinglish' : 'english';

      if (!cleanMsg) {
        naturalResponse = "Hello! I'm your English Buddy 😊 How are you today?";
        nextQuestion = "";
      } else if (isNotUnderstanding) {
        // Learner does not understand the English question -> Explain gently in Hinglish + repeat in English + ask to try
        understoodMeaning = "You needed clarification on what was asked.";
        naturalResponse = "No problem 😊 Main pooch raha hoon: 'Aap aaj kya kar rahe the?' In English: 'What were you doing today?' Ab aap answer try karo. Main sun raha hoon 😊";
        nextQuestion = ""; // STOP AND WAIT!
        subtleRecast = "What were you doing today?";
        awaitingEnglishRetry = true;
      } else if (wasAwaitingEnglishRetry && !isHindiOrHinglish) {
        // Learner tried in English after practice prompt!
        understoodMeaning = "You practiced expressing your thought in English.";
        if (/\bmy day was not good\b/i.test(lower)) {
          naturalResponse = "Oh, I understand. Why was your day not good?";
        } else {
          naturalResponse = "Bahut badhiya! 👏 You said that very well.";
        }
        nextQuestion = shouldEnd ? "It was so wonderful chatting with you! Would you like to see our chat report?" : "";
        subtleRecast = "";
        awaitingEnglishRetry = false;
        learnerComfortLanguage = 'english';
      } else if (isHindiOrHinglish) {
        // Learner expressed in Hindi/Hinglish -> Follow flow: Understand -> Respond naturally in Hinglish -> English model -> Encourage -> WAIT
        awaitingEnglishRetry = true;
        learnerComfortLanguage = 'hindi';

        if (/\b(din.*(acha|accha|theek|kharab|sahi|bad)|nahi tha|din acha|din theek)\b/i.test(lower)) {
          understoodMeaning = "Your day was not good.";
          naturalResponse = "Achha, toh aaj aapka din acha nahi raha 😊 English mein aap bol sakte ho, 'My day was not good.' Aap ek baar English mein try karo.";
          nextQuestion = ""; // STOP AND WAIT!
          subtleRecast = "My day was not good.";
        } else if (/\b(khelne|khel|play|cricket|football|game)\b/i.test(lower)) {
          understoodMeaning = "You talked about not playing or going out to play.";
          naturalResponse = "Achha 😊 Samajh gaya. Kabhi kabhi aisa hota hai. English mein aap keh sakte ho: 'I didn't go out to play today.' Ab aap try karo. Main sun raha hoon.";
          nextQuestion = ""; // STOP AND WAIT!
          subtleRecast = "I didn't go out to play today.";
        } else if (/\b(thak|thaka|tired|neend|rest)\b/i.test(lower)) {
          understoodMeaning = "You were tired or exhausted.";
          naturalResponse = "Achha 😊 Samajh gaya. Aap keh sakte ho: 'I was tired today.' Ab aap English mein try karo. Main sun raha hoon.";
          nextQuestion = ""; // STOP AND WAIT!
          subtleRecast = "I was tired today.";
        } else if (/\b(khana|kha|dinner|lunch|breakfast|roti|chai)\b/i.test(lower)) {
          understoodMeaning = "You talked about your meal or food.";
          naturalResponse = "Achha 😊 Samajh gaya. English mein aap keh sakte ho: 'I have had my food.' Ab aap try karo. Main sun raha hoon.";
          nextQuestion = ""; // STOP AND WAIT!
          subtleRecast = "I have had my food.";
        } else if (/\b(kaam|office|shift|duty)\b/i.test(lower)) {
          understoodMeaning = "You talked about your work or office.";
          naturalResponse = "Got it! 😊 Work days can be busy. English mein aap keh sakte ho: 'I was busy with my work.' Ab aap try karo. Main sun raha hoon.";
          nextQuestion = ""; // STOP AND WAIT!
          subtleRecast = "I was busy with my work.";
        } else if (/\b(market|bazaar|shopping|dukaan)\b/i.test(lower)) {
          understoodMeaning = "You went to the market or shopping.";
          naturalResponse = "Achha 😊 Samajh gaya. English mein aap keh sakte ho: 'I went to the market.' Ab aap try karo. Main sun raha hoon.";
          nextQuestion = ""; // STOP AND WAIT!
          subtleRecast = "I went to the market.";
        } else if (/\b(theek|badhiya|accha|achha|mast)\b/i.test(lower)) {
          understoodMeaning = "You are feeling good today.";
          naturalResponse = "Bahut badhiya! 😊 Glad to hear that. English mein aap keh sakte ho: 'I am doing well today.' Ab aap try karo. Main sun raha hoon.";
          nextQuestion = ""; // STOP AND WAIT!
          subtleRecast = "I am doing well today.";
        } else {
          understoodMeaning = `You expressed: "${cleanMsg}"`;
          naturalResponse = `Achha 😊 Samajh gaya. English mein aap keh sakte ho: 'I want to share my thoughts.' Ab aap try karo. Main sun raha hoon.`;
          nextQuestion = ""; // STOP AND WAIT!
          subtleRecast = "I want to share my thoughts.";
        }
      } else if (/\b(my day not good|day not good|i not good)\b/i.test(lower)) {
        understoodMeaning = "Your day was not good.";
        naturalResponse = "Very good! 😊 Aapne acha try kiya. Bas ek chhota improvement: 'My day was not good.' Tell me, why was your day not good?";
        nextQuestion = "";
        subtleRecast = "My day was not good.";
        awaitingEnglishRetry = false;
        learnerComfortLanguage = 'english';
      } else if (/\bmy day was not good\b/i.test(lower)) {
        understoodMeaning = "Your day was not good.";
        naturalResponse = "Oh, I understand. Why was your day not good?";
        nextQuestion = "";
        subtleRecast = "";
        awaitingEnglishRetry = false;
        learnerComfortLanguage = 'english';
      } else if (/\bi go (yesterday|market|home)\b/i.test(lower)) {
        understoodMeaning = "You went somewhere recently.";
        naturalResponse = "Bahut badhiya! 👏 I understood you clearly. A more natural way to say it is: 'I went yesterday.' Where did you go?";
        nextQuestion = "";
        subtleRecast = "I went yesterday.";
        awaitingEnglishRetry = false;
        learnerComfortLanguage = 'english';
      } else {
        // Learner spoke clear or understandable English
        const encouragementResponses = [
          "Bahut badhiya! 👏 You expressed that so clearly.",
          "Nice! 😊 You said that very naturally.",
          "Awesome! That sounded really clear.",
          "Very good! 😊 I understood you completely."
        ];
        const idx = Math.abs(cleanMsg.length + currentExchanges) % encouragementResponses.length;
        naturalResponse = encouragementResponses[idx];

        // Continue in simple English; occasionally ask ONE natural question
        if (shouldEnd) {
          nextQuestion = "It was so wonderful chatting with you! Would you like to see our chat report?";
        } else if (currentExchanges % 3 === 0) {
          nextQuestion = "What did you do instead?";
        } else {
          nextQuestion = ""; // Sometimes simply listen!
        }
        subtleRecast = "";
        awaitingEnglishRetry = false;
        learnerComfortLanguage = 'english';
      }

      result = {
        understoodMeaning,
        naturalResponse,
        nextQuestion: shouldEnd ? "It was so wonderful chatting with you! Would you like to see our chat report?" : nextQuestion,
        subtleRecast,
        awaitingEnglishRetry,
        learnerComfortLanguage,
        newFacts: cleanMsg ? [cleanMsg] : [],
        topic: "Daily Life & Experiences",
        conversationDepth: currentExchanges,
        needsClarification: false,
        shouldEnd,
      };
    }

    return res.json(result);
  } catch (err) {
    console.error("Buddy chat API error:", err);
    return res.json({
      understoodMeaning: "Shared thoughts",
      naturalResponse: "I'm listening and understand you completely 😊 Take your time.",
      nextQuestion: "",
      subtleRecast: "",
      awaitingEnglishRetry: false,
      learnerComfortLanguage: "english",
      newFacts: [],
      topic: "Daily Life",
      conversationDepth: 1,
      needsClarification: false,
      shouldEnd: false,
    });
  }
});

// Endpoint: Engine 3 Buddy Chat Session Summary
app.post("/api/buddy-chat/summary", async (req, res) => {
  try {
    const { history } = req.body;
    const learnerUtterances = (history || [])
      .filter((m: any) => m.sender === 'user')
      .map((m: any) => m.text);

    const systemPrompt = `You are an encouraging English speaking coach evaluating a beginner Indian learner's conversation with their Buddy.
The learner may be a beginner from a Hindi/Hinglish background.
Your evaluation must:
1. Celebrate communicative willingness and effort (including when Hindi/Hinglish was used to express ideas).
2. Highlight genuine strengths (e.g. willingness to participate, clear intent, expanding vocabulary).
3. Offer 1-2 gentle, simple English recommendations with warm explanations.
4. Keep all explanations simple, positive, and non-judgmental (never say "bad English" or "wrong").

Return ONLY a valid JSON object with this exact schema:
{
  "whatWeTalkedAbout": "string - short paragraph summarizing the conversation in simple warm words",
  "ratings": {
    "speaking": "Great" | "Good" | "Getting Better" | "Needs Practice",
    "fluency": "Great" | "Good" | "Getting Better" | "Needs Practice",
    "confidence": "Great" | "Good" | "Getting Better" | "Needs Practice",
    "conversationFlow": "Great" | "Good" | "Getting Better" | "Needs Practice"
  },
  "strengths": ["string", "string"],
  "improvementAreas": ["string", "string"],
  "naturalCorrections": [
    { "learnerSaid": "string", "betterEnglish": "string", "explanation": "string" }
  ],
  "nextTimeGoal": "string"
}`;

    const userPrompt = JSON.stringify({ learnerUtterances, fullHistory: history });

    let summaryResult = null;
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && groqKey.trim()) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey.trim()}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.2,
            max_tokens: 800,
            response_format: { type: "json_object" },
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            summaryResult = JSON.parse(content.replace(/^```json/, '').replace(/```$/, '').trim());
          }
        }
      } catch (e) {
        console.warn("Groq summary error:", e);
      }
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!summaryResult && geminiKey && geminiKey.trim()) {
      try {
        const text = await generateGeminiContent({
          apiKey: geminiKey,
          contents: `${systemPrompt}\n\nUser Context:\n${userPrompt}`,
          responseMimeType: "application/json",
          temperature: 0.2,
        });
        if (text) {
          summaryResult = JSON.parse(text.replace(/^```json/, '').replace(/```$/, '').trim());
        }
      } catch (e) {
        console.warn("Gemini summary error:", e);
      }
    }

    if (!summaryResult) {
      summaryResult = {
        whatWeTalkedAbout: learnerUtterances.length > 0 
          ? `You discussed your daily routine and experiences across ${learnerUtterances.length} conversation exchanges.`
          : "You started an everyday English conversation practice session.",
        ratings: {
          speaking: "Good",
          fluency: "Getting Better",
          confidence: "Good",
          conversationFlow: "Getting Better"
        },
        strengths: [
          "Successfully communicated your core ideas and daily experiences.",
          "Responded promptly to buddy questions and stayed on topic."
        ],
        improvementAreas: [
          "Practice using past tense verbs consistently.",
          "Expand answers with extra details (e.g. why or how)."
        ],
        naturalCorrections: learnerUtterances.slice(0, 2).map((u: string) => ({
          learnerSaid: u,
          betterEnglish: u.replace(/\\bi go\\b/gi, 'I went').replace(/\\bi do\\b/gi, 'I did'),
          explanation: "Use past tense when describing completed actions."
        })),
        nextTimeGoal: "Try adding at least one descriptive detail (like your feelings or time) to every sentence."
      };
    }

    const utteranceCount = learnerUtterances.length;
    const wordCount = learnerUtterances.reduce((acc: number, u: string) => acc + u.split(/\s+/).length, 0);

    const expressionScore = Math.min(95, Math.max(45, 50 + utteranceCount * 6 + Math.min(25, wordCount)));
    const grammarScore = Math.min(95, Math.max(45, 80 - utteranceCount * 2));
    const sentenceMakingScore = Math.min(92, Math.max(48, 55 + utteranceCount * 5));
    const detailsScore = Math.min(90, Math.max(40, 45 + wordCount * 1.5));

    const weightedConfidence = Math.round(
      expressionScore * 0.20 +
      grammarScore * 0.40 +
      sentenceMakingScore * 0.25 +
      detailsScore * 0.15
    );

    const getRating = (score: number) => {
      if (score >= 85) return 'Great';
      if (score >= 70) return 'Good';
      if (score >= 52) return 'Getting Better';
      return 'Needs Practice';
    };

    summaryResult.overallScore = weightedConfidence;
    summaryResult.detailedScores = {
      overallScore: weightedConfidence,
      expression: { score: expressionScore, rating: getRating(expressionScore) },
      grammar: { score: grammarScore, rating: getRating(grammarScore) },
      sentenceMaking: { score: sentenceMakingScore, rating: getRating(sentenceMakingScore) },
      details: { score: detailsScore, rating: getRating(detailsScore) },
      confidence: { score: weightedConfidence, rating: getRating(weightedConfidence) }
    };

    return res.json(summaryResult);
  } catch (err) {
    console.error("Summary API error:", err);
    return res.status(500).json({ error: "Failed to generate summary" });
  }
});

// Endpoint: Engine 4 Rock & Roll Chat
app.post("/api/rock-and-roll/chat", async (req, res) => {
  try {
    const { challenge, history, learnerMessage, turnCount } = req.body;
    const cleanMsg = (learnerMessage || "").trim();
    const currentTurn = typeof turnCount === 'number' ? turnCount : 1;

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are an AI customer or workplace stakeholder in a professional workplace roleplay scenario for Indian professionals practicing workplace English.
Scenario: ${challenge?.title || 'Workplace Challenge'}
Mission: ${challenge?.mission || ''}
Current Turn: ${currentTurn}

Rules:
- Understand Indian/broken English and intent.
- Stay strictly in character for the situation.
- Respond naturally according to the role/situation.
- Ask one relevant question or give the next situation response.
- Target 6-10 exchanges before concluding or resolving.
- If learner gives short/incomplete answers, probe naturally.
- Return ONLY a valid JSON object with this exact schema:
{
  "customerReply": "string - customer response in character",
  "customerMood": "angry" | "frustrated" | "neutral" | "satisfied" | "happy",
  "coachingFeedback": {
    "type": "positive" | "warning" | "tip",
    "message": "string"
  },
  "resolutionReached": boolean
}`;

    const userPayload = JSON.stringify({
      history: history || [],
      latestLearnerMessage: cleanMsg,
      turnCount: currentTurn,
    });

    const parseJSONSafely = (text: string) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            return JSON.parse(match[0]);
          } catch (err) {
            return null;
          }
        }
        return null;
      }
    };

    let result = null;
    if (groqKey && groqKey.trim()) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey.trim()}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPayload },
            ],
            temperature: 0.6,
            max_tokens: 600,
            response_format: { type: "json_object" },
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            result = parseJSONSafely(content);
          }
        }
      } catch (e) {
        console.warn("Groq Rock&Roll chat error:", e);
      }
    }

    if (!result && geminiKey && geminiKey.trim()) {
      try {
        const text = await generateGeminiContent({
          apiKey: geminiKey,
          contents: `${systemPrompt}\n\nContext:\n${userPayload}`,
          responseMimeType: "application/json",
          temperature: 0.6,
        });
        if (text) {
          result = parseJSONSafely(text);
        }
      } catch (e) {
        console.warn("Gemini Rock&Roll chat error:", e);
      }
    }

    if (!result) {
      result = {
        customerReply: "I understand. Let's make sure this is sorted out right away. What are the next steps?",
        customerMood: "neutral",
        coachingFeedback: { type: "positive", message: "Good engagement. Keep it professional." },
        resolutionReached: currentTurn >= 6,
      };
    }

    return res.json(result);
  } catch (err) {
    console.error("Rock & Roll chat API error:", err);
    return res.status(500).json({ error: "Failed to generate customer reply" });
  }
});

// Endpoint: Engine 4 Rock & Roll Summary Debrief
app.post("/api/rock-and-roll/summary", async (req, res) => {
  try {
    const { challenge, history } = req.body;
    const learnerUtterances = (history || [])
      .filter((m: any) => m.sender === 'learner')
      .map((m: any) => m.text);

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are an expert English communication coach evaluating a workplace roleplay session.
Scenario: ${challenge?.title || 'Workplace Roleplay'}
Learner Utterances: ${JSON.stringify(learnerUtterances)}

Evaluate objectively based on performance.
You MUST return ONLY a valid JSON object with this exact schema:
{
  "situationName": "string - Theme + situation practiced",
  "score": number (0-100),
  "howIHandledIt": {
    "communication": "Great" | "Good" | "Getting Better" | "Needs Practice",
    "speaking": "Great" | "Good" | "Getting Better" | "Needs Practice",
    "confidence": "Great" | "Good" | "Getting Better" | "Needs Practice",
    "situationHandling": "Great" | "Good" | "Getting Better" | "Needs Practice"
  },
  "iDidWell": ["string"],
  "practiceNext": ["string"],
  "myNaturalEnglish": [
    { "learnerSaid": "string", "betterEnglish": "string", "explanation": "string" }
  ],
  "nextTimeGoal": "string",
  "isResolved": boolean,
  "customerResponse": "string"
}`;

    const parseJSONSafely = (text: string) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            return JSON.parse(match[0]);
          } catch (err) {
            return null;
          }
        }
        return null;
      }
    };

    let result = null;
    if (groqKey && groqKey.trim()) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey.trim()}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: "Generate debrief summary JSON." },
            ],
            temperature: 0.5,
            max_tokens: 800,
            response_format: { type: "json_object" },
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            result = parseJSONSafely(content);
          }
        }
      } catch (e) {
        console.warn("Groq Rock&Roll summary error:", e);
      }
    }

    if (!result && geminiKey && geminiKey.trim()) {
      try {
        const text = await generateGeminiContent({
          apiKey: geminiKey,
          contents: `${systemPrompt}\n\nGenerate debrief summary JSON.`,
          responseMimeType: "application/json",
          temperature: 0.5,
        });
        if (text) {
          result = parseJSONSafely(text);
        }
      } catch (e) {
        console.warn("Gemini Rock&Roll summary error:", e);
      }
    }

    if (!result) {
      result = {
        situationName: challenge?.title || "Workplace Customer Handling",
        score: 82,
        howIHandledIt: {
          communication: "Good",
          speaking: "Good",
          confidence: "Getting Better",
          situationHandling: "Good"
        },
        iDidWell: [
          "Maintained professional de-escalation tone",
          "Acknowledged customer urgency promptly"
        ],
        practiceNext: [
          "Avoid pausing too long between verification steps",
          "Use more assertive phrasing when setting timeframes"
        ],
        myNaturalEnglish: [
          { learnerSaid: "I will check room right now sir.", betterEnglish: "I will check the room right away, sir.", explanation: "Adding articles and polite timeframe adverbs." }
        ],
        nextTimeGoal: "Confidently state the exact expected timeframe within the first 30 seconds.",
        isResolved: true,
        customerResponse: "Happy"
      };
    }

    return res.json(result);
  } catch (err) {
    console.error("Rock & Roll summary API error:", err);
    return res.status(500).json({ error: "Failed to generate summary" });
  }
});

// Endpoint: Search Pattern Library (500 curated patterns)
app.get("/api/patterns/search", (req, res) => {
  const query = (req.query.q as string) || "";
  const limit = parseInt((req.query.limit as string) || "10", 10);
  const matches = findMatchingPatterns(query, limit);
  res.json({
    query,
    count: matches.length,
    matches,
  });
});

// Endpoint: Get Pattern Categories
app.get("/api/patterns/categories", async (_req, res) => {
  const { englishPatterns } = await import("./src/data/patternEngine.ts");
  const categories = Array.from(new Set(englishPatterns.map((p) => p.category)));
  const categoryCounts = categories.map((cat) => ({
    category: cat,
    count: englishPatterns.filter((p) => p.category === cat).length,
  }));
  res.json({ categories: categoryCounts, totalPatterns: englishPatterns.length });
});

// Endpoint: Get all patterns with optional category filter
app.get("/api/patterns/all", async (req, res) => {
  const { englishPatterns } = await import("./src/data/patternEngine.ts");
  const category = req.query.category as string;
  const filtered = category
    ? englishPatterns.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    : englishPatterns;
  res.json({ count: filtered.length, patterns: filtered });
});

// Grounded Day Map Generator fully integrated with Sheeko Clause Parser & Meaning Representation
function buildLocalDayMap(text: string) {
  const cleanStatement = text.trim();
  const lower = cleanStatement.toLowerCase();

  // Parse learner input into multiple meaningful clauses and combine detected attributes
  const meaningRep = parseLearnerStoryToMeaningRepresentation(cleanStatement);

  const activities = meaningRep.activities.length > 0
    ? meaningRep.activities
    : [cleanStatement];

  const emotions: string[] = [];
  const environments: string[] = [];
  const knownFacts: string[] = [];

  // Dynamic Emotion & Mood Extraction based on actual learner statement
  if (lower.includes('angry') || lower.includes('tension') || lower.includes('late') || lower.includes('traffic') || lower.includes('worry')) {
    emotions.push('Felt concerned about the delay, then focused on resolving work');
  }
  if (lower.includes('happy') || lower.includes('good') || lower.includes('friend') || lower.includes('lunch')) {
    emotions.push('Felt positive and energized connecting with friends');
  }
  if (lower.includes('tired') || lower.includes('rest') || lower.includes('shift') || lower.includes('woke')) {
    emotions.push('Felt productive after completing duties');
  }
  if (lower.includes('stock') || lower.includes('supervisor') || lower.includes('manager') || lower.includes('team') || lower.includes('check')) {
    emotions.push('Felt focused and responsible during duties');
  }
  if (emotions.length === 0) {
    emotions.push('Felt focused, engaged, and productive');
  }

  // Dynamic Context & People Extraction
  if (meaningRep.people.length > 0) {
    environments.push(`With ${meaningRep.people.join(', ')}`);
  }
  if (meaningRep.places.length > 0) {
    environments.push(`At ${meaningRep.places.join(', ')}`);
  }
  if (meaningRep.timeMarkers.length > 0) {
    environments.push(`At time: ${meaningRep.timeMarkers.join(', ')}`);
  }
  if (environments.length === 0) {
    environments.push('Workplace & daily routine environment');
  }

  // Known Facts Registration
  knownFacts.push(`Learner shared: "${cleanStatement}"`);
  meaningRep.clauses.forEach(c => knownFacts.push(`Clause: ${c}`));

  // Natural English Narrative from composite meaning representation (Short interpretation)
  const naturalEnglishMeaning = meaningRep.normalizedSummary;

  // Complete accumulated Day Story rewritten in correct, simple, natural English
  const naturalEnglishStory = synthesizeNaturalEnglishStory({
    rawStatement: cleanStatement,
    activities,
    emotions,
    knownFacts,
  });

  return {
    activities: Array.from(new Set(activities)),
    emotions: Array.from(new Set(emotions)),
    environments: Array.from(new Set(environments)),
    rawStatement: cleanStatement,
    knownFacts: Array.from(new Set(knownFacts)),
    naturalEnglishMeaning,
    naturalEnglishStory,
    pointsExtractedCount: activities.length + emotions.length + environments.length + knownFacts.length,
    capturedAt: Date.now(),
  };
}

// Endpoint: Analyze Learner's Day Statement into Structured 3-Area DayMap with Natural English Story
app.post("/api/analyze-day", async (req, res) => {
  try {
    const { statement } = req.body;
    if (!statement || typeof statement !== "string" || !statement.trim()) {
      return res.status(400).json({ error: "Statement is required." });
    }

    const cleanStatement = statement.trim();
    const dayMap = buildLocalDayMap(cleanStatement);

    // Call LLM Language Intelligence Engine to generate accurate, fluent, first-person Natural English Story
    try {
      const aiResult = await callLlamaConversationStep({
        latestLearnerAnswer: cleanStatement,
        selectedTopic: { pointer: 'Daily Routine', turnCount: 0 },
        dayMap: { rawStatement: cleanStatement },
        isFirstTurnOfTopic: true,
      });

      if (aiResult && aiResult.naturalStory && aiResult.naturalStory.trim()) {
        dayMap.naturalEnglishStory = aiResult.naturalStory.trim();
      }
      if (aiResult && aiResult.extractedFacts && aiResult.extractedFacts.length > 0) {
        dayMap.knownFacts = Array.from(new Set([...dayMap.knownFacts, ...aiResult.extractedFacts]));
      }
    } catch (aiErr) {
      console.warn("[Analyze Day] LLM refinement fallback to rule-based:", aiErr);
    }

    return res.json({ dayMap });
  } catch (err) {
    console.error("Error in /api/analyze-day:", err);
    return res.json({
      dayMap: {
        activities: ["Went to work by bike", "Completed scheduled tasks", "Met friends in the evening"],
        emotions: ["Felt focused and engaged"],
        environments: ["Workplace and transit"],
        rawStatement: req.body?.statement || "Daily routine",
        knownFacts: ["Learner shared daily routine"],
        naturalEnglishMeaning: "The learner commuted to work, completed their scheduled tasks, and connected with friends.",
        naturalEnglishStory: "Today, I went to work by bike, completed my scheduled tasks, and met my friends in the evening.",
        pointsExtractedCount: 6,
        capturedAt: Date.now(),
      },
    });
  }
});

// Deterministic Multi-Turn Conversational Generator (Zero AI / Instant Grounded Matching)
function buildLocalConversationStep(params: {
  dayMap: any;
  selectedTopic: any;
  conversationHistory: any[];
  answeredQuestions: string[];
  knownFacts: string[];
  latestLearnerAnswer?: string;
  isFirstTurnOfTopic?: boolean;
}) {
  const {
    dayMap,
    selectedTopic,
    answeredQuestions = [],
    latestLearnerAnswer = "",
    isFirstTurnOfTopic = false,
  } = params;

  const topicPointer = selectedTopic?.pointer || "your day";
  const turnCount = selectedTopic?.turnCount || 0;
  const cleanAnswer = latestLearnerAnswer.trim();
  const lowerAnswer = cleanAnswer.toLowerCase();

  // Find matching reference pattern for context
  const refContext = findBestReferenceMatch(topicPointer);

  if (isFirstTurnOfTopic) {
    const cleanTopic = topicPointer.replace(/^["']|["']$/g, '');
    let firstProbe = `Can you tell me more about "${cleanTopic}" and how that experience went?`;
    let direction: 'WHAT' | 'HOW' | 'WHO' | 'WHERE' | 'FEELING' = 'WHAT';

    const tLower = cleanTopic.toLowerCase();
    if (tLower.includes('work') || tLower.includes('office') || tLower.includes('job') || tLower.includes('supervisor')) {
      firstProbe = `How did your work or tasks go, and what was the most important part?`;
      direction = 'WHAT';
    } else if (tLower.includes('bus') || tLower.includes('travel') || tLower.includes('reach') || tLower.includes('commute')) {
      firstProbe = `How was your commute, and did you reach your destination on time?`;
      direction = 'WHERE';
    } else if (tLower.includes('friend') || tLower.includes('lunch') || tLower.includes('meet')) {
      firstProbe = `Where did you meet, and what did you discuss during that time?`;
      direction = 'WHERE';
    } else if (tLower.includes('rest') || tLower.includes('home') || tLower.includes('finish')) {
      firstProbe = `How did you feel after finishing your tasks and returning home?`;
      direction = 'FEELING';
    }

    return {
      rephrase: `You mentioned: "${cleanTopic}".`,
      probeQuestion: firstProbe,
      probeDirection: direction,
      topicIsCompleted: false,
      updatedDayMap: dayMap,
      deepAnalysis: {
        mainMeaning: `Starting focus on ${cleanTopic}`,
        intent: 'Initial topic exploration',
        sentiment: 'Engaged',
        fluencyScore: 85,
        clarityScore: 88,
        detectedPatterns: ['Action phrase initiation', 'Topic introduction'],
        keyInsights: ['Clear communication intent', 'Ready for conversational elaboration'],
        recommendedPhrases: ['First of all', 'At that time', 'When I arrived'],
      },
    };
  }

  // Turn 1+ : Generate natural professional English summary rephrase (Rule 10)
  let rephraseText = `So, you handled that situation.`;
  if (cleanAnswer) {
    const fixed = applyComprehensiveGrammarFixes(cleanAnswer);
    let stripped = fixed
      .replace(/[.?!]+$/, '')
      .replace(/^[iI]\s+/i, '')
      .replace(/^[yY][oO][uU]\s+/i, '');
    stripped = stripped.replace(/\b([iI])\s+\1\b/g, '$1');

    if (stripped) {
      const formattedSummary = stripped.charAt(0).toLowerCase() + stripped.slice(1);
      rephraseText = `So, you ${formattedSummary}.`;
    } else {
      rephraseText = `So, you ${cleanAnswer}.`;
    }
  }

  // Determine intelligent probing direction & topic completion (Max 5 turns)
  const isCompleted = turnCount >= 5;

  const probeBank: { question: string; direction: 'HOW' | 'WHY' | 'WHO' | 'RESULT' | 'FEELING' | 'DETAIL' }[] = [
    { question: `How did you resolve that, and what was the final outcome?`, direction: 'RESULT' },
    { question: `Who else was there with you when that happened?`, direction: 'WHO' },
    { question: `How did you feel once everything was completed?`, direction: 'FEELING' },
    { question: `What did you decide to do right after that?`, direction: 'DETAIL' },
    { question: `What was the most important thing you learned or achieved from that part of your day?`, direction: 'RESULT' },
  ];

  let selectedProbe = probeBank.find((p) => !answeredQuestions.includes(p.question)) || probeBank[0];

  if (isCompleted) {
    selectedProbe = {
      question: `What was the most rewarding part of that experience before your day ended?`,
      direction: 'RESULT',
    };
  }

  // Check if learner introduced a new activity or emotion (Rule 12 & 13)
  let updatedDayMap = { ...dayMap };
  const newFacts: string[] = [];
  let newActivity: string | undefined = undefined;
  let newEmotion: string | undefined = undefined;

  if (lowerAnswer.includes('tea') || lowerAnswer.includes('coffee')) {
    newActivity = 'Had tea with friends';
    newFacts.push('Had tea in the evening');
  } else if (lowerAnswer.includes('call') || lowerAnswer.includes('phone')) {
    newActivity = 'Made important phone calls';
    newFacts.push('Spoke on the phone');
  }

  if (lowerAnswer.includes('happy') || lowerAnswer.includes('relax') || lowerAnswer.includes('relief')) {
    newEmotion = 'Felt relieved and relaxed';
  } else if (lowerAnswer.includes('tension') || lowerAnswer.includes('worry')) {
    newEmotion = 'Experienced temporary tension';
  }

  if (newActivity && !updatedDayMap.activities.includes(newActivity)) {
    updatedDayMap.activities = [...updatedDayMap.activities, newActivity];
  }
  if (newEmotion && !updatedDayMap.emotions.includes(newEmotion)) {
    updatedDayMap.emotions = [...updatedDayMap.emotions, newEmotion];
  }
  if (cleanAnswer) {
    newFacts.push(`Learner noted: "${cleanAnswer}"`);
    updatedDayMap.knownFacts = Array.from(new Set([...(updatedDayMap.knownFacts || []), ...newFacts]));
  }

  // Update complete Natural English Story
  updatedDayMap.naturalEnglishStory = synthesizeNaturalEnglishStory({
    rawStatement: updatedDayMap.rawStatement,
    activities: updatedDayMap.activities,
    emotions: updatedDayMap.emotions,
    knownFacts: updatedDayMap.knownFacts,
    learnerAnswers: cleanAnswer ? [cleanAnswer] : [],
  });

  return {
    rephrase: rephraseText,
    probeQuestion: selectedProbe.question,
    probeDirection: selectedProbe.direction,
    topicIsCompleted: isCompleted,
    completionSummary: isCompleted
      ? `Wonderful job explaining "${topicPointer}"! You clearly described the situation, the actions you took, and how it was resolved.`
      : undefined,
    updatedDayMap,
    deepAnalysis: {
      mainMeaning: cleanAnswer || 'Handling daily work & personal routine',
      intent: refContext?.intent || 'Narrating past daily events',
      sentiment: newEmotion || 'Constructive & Engaged',
      fluencyScore: Math.min(95, 82 + (cleanAnswer.length > 20 ? 8 : 4)),
      clarityScore: Math.min(96, 85 + (cleanAnswer.length > 25 ? 7 : 3)),
      detectedPatterns: ['Action verb sequencing', 'Situational clarity', 'Conversational confidence'],
      keyInsights: ['Preserved core message naturally', 'Demonstrated clear context and chronology'],
      recommendedPhrases: ['After resolving that', 'Everything went smoothly', 'As soon as possible'],
    },
  };
}

// Sarvam AI LLM Helper for Conversational Understand -> Rephrase -> Respond
async function callSarvamConversationLLM(params: {
  dayMap: any;
  selectedTopic: any;
  conversationHistory: any[];
  latestLearnerAnswer: string;
  isFirstTurnOfTopic: boolean;
}) {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error("SARVAM_API_KEY not configured");
  }

  const { selectedTopic, conversationHistory, latestLearnerAnswer, isFirstTurnOfTopic } = params;

  if (isFirstTurnOfTopic || !latestLearnerAnswer || !latestLearnerAnswer.trim()) {
    return null;
  }

  const prompt = `Topic: ${selectedTopic?.pointer || "Daily Routine"}
Learner's latest statement: "${latestLearnerAnswer.trim()}"
Recent Conversation History: ${JSON.stringify((conversationHistory || []).slice(-4))}

Analyze this statement, understand its true meaning, rephrase it into natural fluent professional Indian English, and provide a warm conversational response and probing follow-up question. Return ONLY valid JSON.`;

  const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": apiKey,
    },
    body: JSON.stringify({
      model: "sarvam-105b-conversations",
      messages: [
        {
          role: "system",
          content: `You are an expert English speaking coach and dialogue partner for an Indian English learner (using Hindi-English or broken English).
Your task is to process the learner's latest statement in a multi-turn conversation about their day.
You must analyze the learner's input, understand its true meaning, rephrase it into natural, fluent, professional Indian English (WITHOUT repeating broken fragments, WITHOUT saying "You said...", preserving all facts, people, places, and events), provide a warm conversational response and a follow-up probing question to continue the conversation.

Return ONLY a valid JSON object (no markdown fences, or strip them if present) matching this exact schema:
{
  "understoodMeaning": "string explaining the core meaning",
  "naturalEnglish": "natural fluent English rephrasing of what the learner said",
  "response": "conversational empathetic response acknowledging what they said",
  "probeQuestion": "follow-up question to probe deeper (WHAT, HOW, WHY, WHO, RESULT, FEELS, DETAIL)",
  "probeDirection": "WHAT|HOW|WHY|WHO|RESULT|FEELING|DETAIL",
  "confidenceScore": 90,
  "deepAnalysis": {
    "mainMeaning": "string",
    "intent": "string",
    "sentiment": "string",
    "fluencyScore": 88,
    "clarityScore": 90,
    "detectedPatterns": ["string"],
    "keyInsights": ["string"],
    "recommendedPhrases": ["string"]
  },
  "topicIsCompleted": false,
  "completionSummary": null
}

CRITICAL RULES:
1. Do NOT repeat the learner's broken sentence.
2. Do NOT say "You said...".
3. Do NOT invent facts or change people, places, or events.
4. Preserve the exact meaning and sequence of events.
5. Provide natural, professional English.
6. Return ONLY valid JSON.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Sarvam API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  
  let cleanContent = content.trim();
  if (cleanContent.startsWith("```json")) {
    cleanContent = cleanContent.replace(/^```json/, "").replace(/```$/, "").trim();
  } else if (cleanContent.startsWith("```")) {
    cleanContent = cleanContent.replace(/^```/, "").replace(/```$/, "").trim();
  }

  return JSON.parse(cleanContent);
}

// Endpoint: Conversational Multi-Turn Engine (Llama 3.1 8B via Groq with Sarvam & deterministic fallback)
app.post("/api/conversation-step", async (req, res) => {
  try {
    const { latestLearnerAnswer, isFirstTurnOfTopic, dayMap, selectedTopic } = req.body;
    const cleanAnswer = typeof latestLearnerAnswer === "string" ? latestLearnerAnswer.trim() : "";
    const turnCount = selectedTopic?.turnCount || 0;

    // Primary: Llama / Gemini Conversational Intelligence Engine
    try {
      const llamaResult = await callLlamaConversationStep(req.body);
      if (llamaResult) {
          let updatedDayMap = { ...dayMap };
          const newFacts: string[] = [];

          if (cleanAnswer && !updatedDayMap.knownFacts?.includes(`Learner shared: "${cleanAnswer}"`)) {
            newFacts.push(`Learner shared: "${cleanAnswer}"`);
          }

          if (llamaResult.extractedFacts && llamaResult.extractedFacts.length > 0) {
            newFacts.push(...llamaResult.extractedFacts);
          }

          if (newFacts.length > 0) {
            updatedDayMap.knownFacts = Array.from(new Set([...(updatedDayMap.knownFacts || []), ...newFacts]));
          }

          if (llamaResult.rephrase && !updatedDayMap.activities?.includes(llamaResult.rephrase)) {
            // If topic complete or substantive, track activity
            if (llamaResult.topicCompleted && !updatedDayMap.activities?.includes(llamaResult.rephrase)) {
              updatedDayMap.activities = [...(updatedDayMap.activities || []), llamaResult.rephrase];
            }
          }

          // Update complete accumulated Natural English Story
          updatedDayMap.naturalEnglishStory = llamaResult.naturalStory || synthesizeNaturalEnglishStory({
            rawStatement: updatedDayMap.rawStatement,
            activities: updatedDayMap.activities,
            emotions: updatedDayMap.emotions,
            knownFacts: updatedDayMap.knownFacts,
            learnerAnswers: cleanAnswer ? [cleanAnswer] : [],
          });

          const isCompleted = (llamaResult.topicCompleted && turnCount >= 5) || turnCount >= 5;

          return res.json({
            rephrase: llamaResult.rephrase,
            probeQuestion: llamaResult.probeQuestion,
            probeDirection: llamaResult.probeDirection,
            topicIsCompleted: isCompleted,
            completionSummary: isCompleted
              ? `Wonderful job sharing "${selectedTopic?.pointer || 'your day'}"! You completed all 5 conversational practice turns with great dedication.`
              : undefined,
            updatedDayMap,
            deepAnalysis: {
              mainMeaning: llamaResult.meaning,
              intent: llamaResult.intent || "Narrating daily experience",
              sentiment: "Constructive & Engaged",
              fluencyScore: Math.round((llamaResult.confidence || 0.88) * 100),
              clarityScore: Math.round(Math.min(98, 85 + (llamaResult.confidence || 0.85) * 12)),
              detectedPatterns: ["Llama 3.1 8B Language Intelligence", "Natural Indian English Rephrasing"],
              keyInsights: [llamaResult.meaning],
              recommendedPhrases: ["After that", "As a result", "Next"],
            },
            understoodMeaning: llamaResult.meaning,
            response: llamaResult.rephrase,
            conversationalResponse: llamaResult.rephrase,
          });
        }
    } catch (llamaErr) {
      console.warn("[Llama / LLM API] conversation-step call encountered an issue, trying fallback:", llamaErr);
    }

    // Secondary Fallback: Sarvam LLM (if configured and learner answered)
    if (!isFirstTurnOfTopic && cleanAnswer && process.env.SARVAM_API_KEY) {
      try {
        const sarvamResult = await callSarvamConversationLLM(req.body);
        if (sarvamResult) {
          let updatedDayMap = { ...dayMap };
          if (cleanAnswer && !updatedDayMap.knownFacts?.includes(`Learner shared: "${cleanAnswer}"`)) {
            updatedDayMap.knownFacts = [...(updatedDayMap.knownFacts || []), `Learner shared: "${cleanAnswer}"`];
          }
          if (sarvamResult.naturalEnglish && !updatedDayMap.activities?.includes(sarvamResult.naturalEnglish)) {
            updatedDayMap.activities = [...(updatedDayMap.activities || []), sarvamResult.naturalEnglish];
          }

          // Update complete accumulated Natural English Story
          updatedDayMap.naturalEnglishStory = synthesizeNaturalEnglishStory({
            rawStatement: updatedDayMap.rawStatement,
            activities: updatedDayMap.activities,
            emotions: updatedDayMap.emotions,
            knownFacts: updatedDayMap.knownFacts,
            learnerAnswers: cleanAnswer ? [cleanAnswer] : [],
          });

          const isCompleted = sarvamResult.topicIsCompleted ? (turnCount >= 5) : (turnCount >= 5);

          return res.json({
            rephrase: sarvamResult.naturalEnglish || sarvamResult.response,
            probeQuestion: sarvamResult.probeQuestion || "What happened after that?",
            probeDirection: sarvamResult.probeDirection || "RESULT",
            topicIsCompleted: isCompleted,
            completionSummary: isCompleted ? (sarvamResult.completionSummary || `Great job exploring "${selectedTopic?.pointer}"!`) : undefined,
            updatedDayMap,
            deepAnalysis: sarvamResult.deepAnalysis || {
              mainMeaning: sarvamResult.understoodMeaning || cleanAnswer,
              intent: "Narrating daily events",
              sentiment: "Engaged",
              fluencyScore: sarvamResult.confidenceScore || 88,
              clarityScore: 90,
              detectedPatterns: ["Semantic understanding", "Natural rephrasing"],
              keyInsights: [sarvamResult.understoodMeaning || "Clear communication"],
              recommendedPhrases: ["After that", "As a result"],
            },
            understoodMeaning: sarvamResult.understoodMeaning,
            response: sarvamResult.response,
            conversationalResponse: sarvamResult.response,
          });
        }
      } catch (sarvamErr) {
        console.warn("[Sarvam LLM] conversation-step fallback failed:", sarvamErr);
      }
    }

    // Tertiary Fallback: Deterministic local conversation engine (instant zero-lag, no API needed)
    const stepResult = buildLocalConversationStep(req.body);
    return res.json(stepResult);
  } catch (err) {
    console.error("Error in /api/conversation-step:", err);
    const stepResult = buildLocalConversationStep(req.body);
    return res.json(stepResult);
  }
});

// Endpoint: Dynamic Practical Question Selector (Zero AI / Curated Local Bank)
app.post("/api/generate-question", async (req, res) => {
  try {
    const { category } = req.body;
    const { PRACTICE_QUESTIONS } = await import("./src/data/questions.ts");
    
    const matching = category
      ? PRACTICE_QUESTIONS.filter((q) => q.category.toLowerCase() === category.toLowerCase())
      : PRACTICE_QUESTIONS;

    const selected = matching[Math.floor(Math.random() * matching.length)] || PRACTICE_QUESTIONS[0];

    return res.json({
      questionEn: selected.questionEn,
      questionHi: selected.questionHi,
      hintEn: selected.hintEn,
      hintHi: selected.hintHi,
      level: selected.level,
      samplePhrases: selected.samplePhrases,
    });
  } catch (err) {
    console.error("Error in local question generator:", err);
    return res.json({
      questionEn: "How do you explain a delay to your supervisor?",
      questionHi: "आप अपने सुपरवाइज़र को देरी की वजह कैसे बताएंगे?",
      hintEn: "Start with: 'Sir, I will be slightly delayed because...'",
      hintHi: "शुरुआत करें: 'Sir, I will be slightly delayed because...'",
      level: "Beginner",
      samplePhrases: ["Sir, I will reach in 10 minutes due to traffic."],
    });
  }
});

// Endpoint: Sarvam AI Text-to-Speech (Bulbul v3 model proxy)
app.post("/api/sarvam/tts", async (req, res) => {
  try {
    const { text, target_language_code = "en-IN", speaker = "ritu", pace = 0.94, loudness = 1.0 } = req.body;
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "SARVAM_API_KEY not configured on server." });
    }

    // Default to 'ritu' (clear, professional, warm educator voice)
    const chosenSpeaker = (!speaker || speaker === "meera" || speaker === "neha") ? "ritu" : speaker;

    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code,
        speaker: chosenSpeaker,
        pitch: 0,
        pace: typeof pace === 'number' ? pace : 0.94,
        loudness: typeof loudness === 'number' ? loudness : 1.0,
        speech_sample_rate: 16000,
        enable_preprocessing: true,
        model: "bulbul:v3",
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    return res.json(data);
  } catch (err) {
    console.error("Error in Sarvam TTS proxy:", err);
    return res.status(500).json({ error: "Failed to generate Sarvam AI speech." });
  }
});

// Endpoint: Sarvam AI Speech-to-Text (Saaras model proxy)
app.post("/api/sarvam/stt", async (req, res) => {
  try {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "SARVAM_API_KEY not configured on server." });
    }
    // Expecting multipart or json audio data forwarding
    const response = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": apiKey,
      },
      body: req.body,
    });

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Error in Sarvam STT proxy:", err);
    return res.status(500).json({ error: "Failed to transcribe audio via Sarvam AI." });
  }
});

// ==========================================
// ENGINE 2: DRILLS FOR THE DAY API ENDPOINTS
// ==========================================

// Endpoint: Generate Next Drill Question tailored to the day's target
app.post("/api/drill/question", async (req, res) => {
  try {
    const { target, questionNumber, previousQuestions } = req.body;
    if (!target) {
      return res.status(400).json({ error: "Drill target is required" });
    }

    const { generateDrillQuestionWithLlama } = await import("./server/services/llamaDrillService.ts");
    const result = await generateDrillQuestionWithLlama(
      target,
      questionNumber || 1,
      previousQuestions || []
    );

    return res.json(result);
  } catch (err) {
    console.error("Error in /api/drill/question:", err);
    return res.status(500).json({ error: "Failed to generate drill question" });
  }
});

// Endpoint: Evaluate Drill Attempt using Llama 3.1 8B Groq
app.post("/api/drill/evaluate", async (req, res) => {
  try {
    const { target, questionText, learnerResponse, attemptNumber } = req.body;
    if (!target || !learnerResponse) {
      return res.status(400).json({ error: "target and learnerResponse are required" });
    }

    const { evaluateDrillAttemptWithLlama } = await import("./server/services/llamaDrillService.ts");
    const evaluation = await evaluateDrillAttemptWithLlama(
      target,
      questionText || "Practice scenario",
      learnerResponse,
      attemptNumber || 1
    );

    return res.json(evaluation);
  } catch (err) {
    console.error("Error in /api/drill/evaluate:", err);
    return res.status(500).json({ error: "Failed to evaluate drill attempt" });
  }
});

// Endpoint: TTS with Sarvam AI integration when key is available
app.post("/api/tts", async (req, res) => {
  try {
    const { text, lang = "en-IN", speaker = "ritu", pace = 0.94, loudness = 1.0 } = req.body;
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey || !text) {
      return res.json({ fallback: true, message: "Use client-side Web Speech API." });
    }

    const target_language_code = lang.startsWith('hi') ? 'hi-IN' : 'en-IN';
    const chosenSpeaker = (!speaker || speaker === "meera" || speaker === "neha") ? "ritu" : speaker;

    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code,
        speaker: chosenSpeaker,
        pitch: 0,
        pace: typeof pace === 'number' ? pace : 0.94,
        loudness: typeof loudness === 'number' ? loudness : 1.0,
        speech_sample_rate: 16000,
        enable_preprocessing: true,
        model: "bulbul:v3",
      }),
    });

    const data = await response.json();
    if (response.ok && data.audios && data.audios[0]) {
      return res.json({
        success: true,
        speaker: chosenSpeaker,
        audioData: `data:audio/wav;base64,${data.audios[0]}`,
        audioBase64: data.audios[0],
      });
    }

    return res.json({ fallback: true, message: "Sarvam TTS fallback." });
  } catch (err) {
    console.error("Error in /api/tts Sarvam wrapper:", err);
    return res.json({ fallback: true, message: "Use client-side Web Speech API." });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    coach: "Coach Neha",
    app: "HELLO ENGLISH",
    engine: "Deterministic Local 10000-Reference-Pattern Engine",
    referencePatternsLoaded: referencePatterns.length,
  });
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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HELLO ENGLISH Server running on port ${PORT} (${referencePatterns.length} Reference Patterns Ready)`);
  });
}

startServer();
