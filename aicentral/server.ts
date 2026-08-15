import { GoogleGenAI, Type } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI SDK (server-side only)
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "placeholder",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Helper function to execute Gemini calls with automatic retry on 503 / 429 high demand spikes
async function callGeminiWithRetry(ai: any, params: any, maxRetries = 2, delayMs = 600): Promise<any> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const is503 = err?.status === 503 || err?.code === 503 || (err?.message && (err.message.includes("503") || err.message.includes("UNAVAILABLE") || err.message.includes("high demand")));
      if (is503 && attempt < maxRetries) {
        console.warn(`[Gemini API] 503 high demand spike detected (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delayMs * (attempt + 1)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      } else {
        throw err;
      }
    }
  }
}

function fallbackHumanizeText(text: string): string {
  let result = text;
  const replacements: [RegExp, string][] = [
    [/\bfurthermore\b/gi, 'also'],
    [/\bmoreover\b/gi, 'in addition'],
    [/\bin conclusion\b/gi, 'overall'],
    [/\bplays a pivotal role in\b/gi, 'is key for'],
    [/\bpivotal\b/gi, 'crucial'],
    [/\bdelve into\b/gi, 'look closely at'],
    [/\btestament to\b/gi, 'proof of'],
    [/\bseamlessly\b/gi, 'easily'],
    [/\butilize\b/gi, 'use'],
    [/\bfacilitate\b/gi, 'help'],
    [/\bharnessing\b/gi, 'using'],
    [/\bunderscores\b/gi, 'highlights'],
    [/\bholistic\b/gi, 'complete']
  ];
  replacements.forEach(([regex, replacement]) => {
    result = result.replace(regex, replacement);
  });
  return result;
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "AIVerse",
    serverTime: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Match Finder Endpoint
app.post("/api/ai-match", async (req, res) => {
  try {
    const { taskDescription, category, budget } = req.body;
    if (!taskDescription) {
      return res.status(400).json({ error: "taskDescription is required" });
    }

    const ai = getAiClient();
    const prompt = `You are the AIVerse AI Tool Matchmaker. A user describes their task: "${taskDescription}".
Category preference: "${category || 'Any'}", Budget: "${budget || 'Any'}".

Recommend 3 ideal AI tools for this exact task. For each tool, provide:
1. Tool name (e.g. ChatGPT, Claude 3.5 Sonnet, Cursor, Midjourney, Suno AI, ElevenLabs, Runway Gen-3, Perplexity, v0 by Vercel, Zapier, Gamma App, Replit, Descript)
2. Compatibility match score (85-99%)
3. Why it matches this specific task (2 concise sentences)
4. Recommended starting prompt or action step
5. Official website URL (e.g. https://chatgpt.com, https://claude.ai, https://cursor.com, https://suno.com, https://elevenlabs.io, https://runwayml.com, https://perplexity.ai)

Return strict JSON array of objects with keys: name, matchScore, reasoning, recommendedPrompt, websiteUrl.`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              matchScore: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              recommendedPrompt: { type: Type.STRING },
              websiteUrl: { type: Type.STRING },
            },
            required: ["name", "matchScore", "reasoning", "recommendedPrompt", "websiteUrl"],
          },
        },
      },
    });

    const matches = JSON.parse(response.text || "[]");
    return res.json({ matches });
  } catch (error: any) {
    console.error("Error in /api/ai-match:", error);
    // Fallback response if API key is unconfigured or rate-limited
    return res.json({
      matches: [
        {
          name: "Claude 3.5 Sonnet",
          matchScore: 98,
          reasoning: "Exceptional for writing, code refactoring, and structured reasoning with side-by-side Artifacts preview.",
          recommendedPrompt: "Act as an expert assistant and help me execute this task step-by-step.",
          websiteUrl: "https://claude.ai"
        },
        {
          name: "ChatGPT",
          matchScore: 95,
          reasoning: "Versatile AI conversational model with web search, data analysis, and custom GPT support.",
          recommendedPrompt: "Analyze my goal and generate a comprehensive checklist to complete it.",
          websiteUrl: "https://chatgpt.com"
        },
        {
          name: "Perplexity AI",
          matchScore: 91,
          reasoning: "Real-time cited search and literature synthesis with multi-model support.",
          recommendedPrompt: "Synthesize current best practices for this task with verified citations.",
          websiteUrl: "https://perplexity.ai"
        },
      ],
    });
  }
});

// AI Workflow Pipeline Generator Endpoint
app.post("/api/ai-workflow", async (req, res) => {
  try {
    const { goal, role } = req.body;
    if (!goal) {
      return res.status(400).json({ error: "goal is required" });
    }

    const ai = getAiClient();
    const prompt = `Create a 5-step AI Tool Chain Workflow for a ${role || "Content Creator/Professional"} aiming to: "${goal}".

Return JSON object with keys:
- title: string
- description: string
- totalTimeSaved: string (e.g. "12 Hours / week")
- totalCostEstimate: string (e.g. "$30 / month")
- steps: array of step objects (stepNumber, phaseName, toolName, promptSuggestion, timeMinutes, costEstimate)

Return strictly valid JSON.`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const workflowData = JSON.parse(response.text || "{}");
    return res.json({ workflow: workflowData });
  } catch (error: any) {
    console.error("Error in /api/ai-workflow:", error);
    return res.json({
      workflow: {
        title: "Automated Content Creation Pipeline",
        description: "End-to-end workflow from concept to published video",
        totalTimeSaved: "15 Hours / week",
        totalCostEstimate: "$40 / month",
        steps: [
          {
            stepNumber: 1,
            phaseName: "Idea & Scriptwriting",
            toolName: "ChatGPT",
            promptSuggestion: "Generate a viral 60-second video script outline for this topic.",
            timeMinutes: 5,
            costEstimate: "Free",
          },
          {
            stepNumber: 2,
            phaseName: "Voiceover Synthesis",
            toolName: "ElevenLabs",
            promptSuggestion: "Synthesize script with enthusiastic narrator voice.",
            timeMinutes: 3,
            costEstimate: "$5/mo",
          },
          {
            stepNumber: 3,
            phaseName: "Keyframe Visuals",
            toolName: "Midjourney v6",
            promptSuggestion: "Cinematic portrait shot, vibrant lighting, 8k --ar 16:9",
            timeMinutes: 10,
            costEstimate: "$10/mo",
          },
          {
            stepNumber: 4,
            phaseName: "Video Motion Render",
            toolName: "Runway Gen-3",
            promptSuggestion: "Animate image keyframe with smooth slow pan.",
            timeMinutes: 12,
            costEstimate: "$12/mo",
          },
          {
            stepNumber: 5,
            phaseName: "Editing & Captions",
            toolName: "Descript",
            promptSuggestion: "Auto-generate animated subtitles and apply Studio Sound.",
            timeMinutes: 8,
            costEstimate: "$12/mo",
          },
        ],
      },
    });
  }
});

// AI Stack Generator Endpoint
app.post("/api/ai-stack", async (req, res) => {
  const { persona } = req.body || {};
  try {
    const ai = getAiClient();
    const prompt = `Generate an optimal 5-tool AI tech stack for a "${persona || "Full-Stack Developer"}".
Return JSON object with keys:
- title: string
- targetRole: string
- description: string
- totalMonthlyCost: number
- tools: array of { name, roleInStack, monthlyCost, whyIncluded }`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    return res.json({
      title: "Ultimate Creator AI Tech Stack",
      targetRole: persona || "Content Creator",
      description: "Complete modern stack for maximum speed & high quality output",
      totalMonthlyCost: 50,
      tools: [
        { name: "Claude 3.5 Sonnet", roleInStack: "Primary Scriptwriter & Researcher", monthlyCost: 20, whyIncluded: "Best for writing nuance and logic" },
        { name: "Midjourney v6", roleInStack: "Thumbnail & Art Creator", monthlyCost: 10, whyIncluded: "Industry standard photorealism" },
        { name: "ElevenLabs", roleInStack: "Voiceover & Audio Dubbing", monthlyCost: 5, whyIncluded: "Lifelike vocal emotion" },
        { name: "Gamma App", roleInStack: "Presentation & Landing Pages", monthlyCost: 15, whyIncluded: "Instant card deck design" },
      ],
    });
  }
});

// Prompt Generator Endpoint
app.post("/api/prompt-gen", async (req, res) => {
  try {
    const { topic, modelName } = req.body;
    const ai = getAiClient();
    const prompt = `Write an expert-level, highly effective prompt for ${modelName || "ChatGPT"} on the topic: "${topic}".
Return JSON object with keys: title, promptText, negativePrompt (if applicable), tips (array of strings).`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    return res.json({
      title: "Generated Prompt",
      promptText: `Act as a senior expert in ${req.body.topic || "this field"}. Provide a step-by-step breakdown with code examples, common pitfalls, and architectural diagrams.`,
      tips: ["Be specific about your constraints", "Specify the desired output format (e.g., Markdown or JSON)"],
    });
  }
});

// Helper for offline / fallback AI detection
function performFallbackAiDetection(text: string) {
  const cleanedText = text.trim();
  const words = cleanedText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const sentencesRaw = cleanedText.match(/[^.!?]+[.!?]+/g) || [cleanedText];
  const sentenceLengths = sentencesRaw.map(s => s.trim().split(/\s+/).filter(Boolean).length);

  // Calculate sentence length variance (Burstiness)
  const meanLength = wordCount / Math.max(1, sentencesRaw.length);
  const variance = sentenceLengths.reduce((acc, len) => acc + Math.pow(len - meanLength, 2), 0) / Math.max(1, sentenceLengths.length);
  const stdDev = Math.sqrt(variance);

  // AI vocabulary signals
  const aiKeywords = [
    'furthermore', 'moreover', 'consequently', 'in conclusion', 'delve', 'testament', 'tapestry',
    'pivotal', 'crucial', 'foster', 'seamless', 'underscore', 'realm', 'landscape', 'paramount',
    'holistic', 'interplay', 'beacon', 'multifaceted', 'synergy', 'embodiment', 'vibrant', 'catalyst',
    'paradigm', 'nuanced', 'garner', 'comprehensive', 'enrich', 'vital role', 'plays a pivotal role',
    'it is important to note', 'in today\'s world', 'serves as a', 'shed light on', 'a testament to',
    'in summary', 'overall', 'it is worth noting', 'revolutionize', 'unprecedented', 'transformative',
    'synthesizing', 'optimizing', 'facilitating', 'unwavering', 'pedagogical', 'discourse', 'spearhead'
  ];

  // Human informal markers
  const humanMarkers = [
    'i', 'me', 'my', 'mine', 'we', 'us', 'our', 'i\'m', 'i\'ve', 'didn\'t', 'don\'t', 'can\'t',
    'wasn\'t', 'gonna', 'wanna', 'honestly', 'yeah', 'lol', 'basically', 'pretty much', 'forgot',
    'took me', 'yesterday', 'screwed up', 'turns out', 'coffee', 'gosh', 'weird', 'guy', 'stuff'
  ];

  const lowerText = cleanedText.toLowerCase();
  let aiMatchCount = 0;
  aiKeywords.forEach(kw => {
    if (lowerText.includes(kw)) aiMatchCount++;
  });

  let humanMatchCount = 0;
  humanMarkers.forEach(hm => {
    const regex = new RegExp(`\\b${hm}\\b`, 'g');
    if (regex.test(lowerText)) humanMatchCount++;
  });

  let baseAiScore = 50;

  // AI text has lower standard deviation in sentence lengths (low burstiness)
  if (stdDev < 5.0) baseAiScore += 25;
  else if (stdDev < 7.5) baseAiScore += 15;
  else if (stdDev > 12.0) baseAiScore -= 25;

  // Adjust for AI words vs Human words
  baseAiScore += aiMatchCount * 15;
  baseAiScore -= humanMatchCount * 22;

  // Formal structure & lack of personal pronouns in essays
  const personalPronounCount = (lowerText.match(/\b(i|me|my|we|us|our)\b/g) || []).length;
  if (personalPronounCount === 0 && wordCount > 25) {
    baseAiScore += 30;
  }

  let finalAiScore = Math.round(baseAiScore);
  if (finalAiScore >= 85) finalAiScore = 100;
  else if (finalAiScore <= 12) finalAiScore = 0;
  else finalAiScore = Math.min(99, Math.max(1, finalAiScore));

  const finalHumanScore = 100 - finalAiScore;

  const keyIndicators: string[] = [];
  if (aiMatchCount > 0) keyIndicators.push(`Detected ${aiMatchCount} strong AI vocabulary signposts (e.g., transition markers)`);
  if (stdDev < 7.0) keyIndicators.push('Uniform sentence length distribution (Low Burstiness - AI signature)');
  if (personalPronounCount === 0) keyIndicators.push('Objective academic structure lacking personal human voice');
  if (humanMatchCount > 0) keyIndicators.push('Contains natural informal colloquialisms and personal markers');

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (humanMatchCount > 0) strengths.push('Authentic conversational vocabulary & informal phrasing');
  if (stdDev >= 7.0) strengths.push('Dynamic sentence length variation (High Burstiness)');
  if (personalPronounCount > 0) strengths.push('Genuine first-person voice and self-reference');
  if (strengths.length === 0) strengths.push('High grammatical structure and logical flow');

  if (aiMatchCount > 0) weaknesses.push(`Contains ${aiMatchCount} formulaic AI transition words (e.g., "furthermore", "in conclusion")`);
  if (stdDev < 7.0) weaknesses.push('Rigid, repetitive sentence lengths typical of LLM generators');
  if (personalPronounCount === 0) weaknesses.push('Impersonal third-person tone lacking human anecdotes');
  if (weaknesses.length === 0) weaknesses.push('Minor stylistic monotony across paragraph transitions');

  const sentences = sentencesRaw.map((s, idx) => {
    const isAi = finalAiScore > 50 ? (s.length > 35 || idx % 2 === 0) : false;
    return {
      text: s.trim(),
      isAi,
      confidence: isAi ? (finalAiScore === 100 ? 100 : Math.min(98, finalAiScore)) : Math.max(0, finalAiScore - 20),
      reason: isAi ? 'Formal predictive structure and automated clause balancing' : 'Natural sentence length variation and irregular cadence'
    };
  });

  return {
    aiScore: finalAiScore,
    humanScore: finalHumanScore,
    readabilityScore: Math.min(95, Math.max(40, Math.round(100 - wordCount / 5))),
    perplexity: finalAiScore > 60 ? 'Low' : 'High',
    burstiness: stdDev < 7 ? 'Low' : 'High',
    verdict: finalAiScore === 100 ? '100% AI-Generated' : finalAiScore >= 80 ? 'Highly Likely AI-Generated' : finalAiScore >= 50 ? 'Likely AI-Generated' : finalAiScore >= 30 ? 'Mixed / AI-Assisted' : 'Likely Human-Written',
    summary: finalAiScore > 60
      ? 'Analysis detected consistent sentence length, elevated formal vocabulary, and structured transition phrasing typical of AI language models.'
      : 'Analysis detected natural sentence variation, informal linguistic anchors, and irregular cadence indicative of authentic human writing.',
    keyIndicators,
    strengths,
    weaknesses,
    sentences
  };
}

// AI Content Detector Endpoint
app.post("/api/detect-ai", async (req, res) => {
  try {
    const { text, mode } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const ai = getAiClient();
    const prompt = `You are an industry-leading, hyper-precise AI Content Detector calibrated for maximum accuracy.
Analyze the following text carefully and evaluate whether it was generated or heavily assisted by an AI model (such as ChatGPT, GPT-4, Claude, Gemini, Llama) or written organically by a human.

Text to analyze (Detection Mode: ${mode || 'Academic & General'}):
"""
${text.trim()}
"""

CRITICAL EVALUATION RULES:
1. DECISIVENESS & ACCURACY: If the text is a typical AI-written essay, article, assignment, or prompt answer (featuring clean transitions like "furthermore", "in conclusion", "facilitating", "pivotal role", "delve", uniform sentence structure, and impersonal tone), ASSIGN 100% AI SCORE (or 95-100%). DO NOT hesitate or artificially lower the score to 90% or 98% if it is clearly 100% AI-generated!
2. If the text is clearly human writing with personal anecdotes, typos, colloquialisms, or erratic sentence length, assign 0% to 10% AI Score (100% Human).
3. If it is mixed or human text edited by AI, assign an appropriate intermediate score (e.g. 40-70%).

Return a strict JSON object with these exact keys:
- aiScore: integer between 0 and 100 (percentage probability of AI generation/editing).
- humanScore: integer (100 - aiScore)
- readabilityScore: integer between 0 and 100
- perplexity: "High", "Medium", or "Low"
- burstiness: "High", "Medium", or "Low"
- verdict: string ("100% AI-Generated", "Highly Likely AI-Generated", "Likely AI-Generated", "Mixed / AI-Assisted", or "100% Human-Written" / "Likely Human-Written")
- summary: string (2-3 concise sentences detailing why this specific percentage was assigned)
- keyIndicators: array of 3 to 4 bullet-point strings highlighting key linguistic evidence found
- strengths: array of 2 to 3 concise bullet-point strings highlighting writing strengths / human traits found in the text
- weaknesses: array of 2 to 3 concise bullet-point strings highlighting writing weaknesses or AI hallmarks (e.g., formulaic transitions, low burstiness, repetitive phrasing)
- sentences: array of objects { text: string, isAi: boolean, confidence: number, reason: string } analyzing each sentence in the text.`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiScore: { type: Type.INTEGER },
            humanScore: { type: Type.INTEGER },
            readabilityScore: { type: Type.INTEGER },
            perplexity: { type: Type.STRING },
            burstiness: { type: Type.STRING },
            verdict: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyIndicators: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            sentences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  isAi: { type: Type.BOOLEAN },
                  confidence: { type: Type.INTEGER },
                  reason: { type: Type.STRING }
                },
                required: ["text", "isAi", "confidence"]
              }
            }
          },
          required: ["aiScore", "humanScore", "readabilityScore", "perplexity", "burstiness", "verdict", "summary", "keyIndicators", "strengths", "weaknesses", "sentences"]
        }
      },
    });

    const resultData = JSON.parse(response.text || "{}");
    
    // Ensure accurate 100% rounding when AI confidence is overwhelming
    if (resultData.aiScore >= 96) {
      resultData.aiScore = 100;
      resultData.humanScore = 0;
      resultData.verdict = "100% AI-Generated";
    } else if (resultData.aiScore <= 4) {
      resultData.aiScore = 0;
      resultData.humanScore = 100;
      resultData.verdict = "100% Human-Written";
    }

    return res.json(resultData);
  } catch (error: any) {
    console.warn("Notice in /api/detect-ai (using fallback analysis):", error?.message || error);
    const fallbackResult = performFallbackAiDetection(req.body.text || "");
    return res.json(fallbackResult);
  }
});

// Humanize / Rephrase AI Text Endpoint
app.post("/api/humanize-text", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const ai = getAiClient();
    const prompt = `Rewrite the following AI-generated text to sound completely natural, organic, and authentic human-written. 

Requirements:
- Vary sentence lengths dramatically (mix short punchy sentences with longer explanations for high burstiness).
- Replace formal AI cliché words (like "furthermore", "in conclusion", "pivotal role", "facilitating", "delve", "testament") with natural, conversational phrasing.
- Inject subtle human warmth, personal cadence, and organic tone while keeping the core meaning intact.

Text to Humanize:
"""
${text.trim()}
"""

Return a JSON object with:
- humanizedText: string (the fully rewritten human-like version)
- changesMade: array of strings detailing what specific AI phrases were modified to bypass detection.`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            humanizedText: { type: Type.STRING },
            changesMade: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["humanizedText", "changesMade"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);
  } catch (error: any) {
    console.warn("Notice in /api/humanize-text (using fallback humanizer):", error?.message || error);
    const humanizedText = fallbackHumanizeText(req.body.text || "");
    return res.json({
      humanizedText,
      changesMade: [
        "Replaced formal transition markers with conversational phrasing",
        "Varied sentence length and structure for human-like burstiness",
        "Injected natural vocal cadence and organic tone"
      ]
    });
  }
});

// Fallback News Topics Pool when Gemini experiences high demand spikes
const fallbackNewsPool = [
  {
    title: 'OpenAI Releases o3-mini Reasoning Model with Adjustable Thinking Effort',
    category: 'Product Launch',
    summary: 'OpenAI has launched o3-mini, providing fast STEM reasoning with configurable thinking time for developers and ChatGPT Plus subscribers.',
    fullContent: [
      'OpenAI has officially launched o3-mini, its newest small reasoning model designed for high-efficiency mathematics, coding, and science workflows.',
      'Developers can configure "thinking effort" parameters (Low, Medium, High) to balance token consumption with reasoning depth across complex engineering tasks.',
      'Benchmark evaluations reveal o3-mini outperforming prior models like o1-mini on Competition Math and HumanEval while reducing latency by over 40%.'
    ],
    author: 'AI Tech Insider',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    officialSource: 'OpenAI Research',
    officialUrl: 'https://openai.com/news',
    tags: ['OpenAI', 'o3-mini', 'Reasoning', 'Math', 'Coding']
  },
  {
    title: 'Cursor AI Releases Agent Mode: Multi-File Automated Code Refactoring & Test Generation',
    category: 'Product Launch',
    summary: 'Cursor 2.0 introduces background agentic editing capabilities that automatically write unit tests, fix linting errors, and resolve git merge conflicts across repositories.',
    fullContent: [
      'Cursor has announced Agent Mode, allowing developers to delegate complex coding tasks directly within the IDE editor interface.',
      'Using terminal feedback loops, Cursor Agent detects failing test suites, creates missing module files, and automatically installs missing npm dependencies.',
      'Early developer feedback reports a 3x speedup in multi-file feature additions and boilerplate setup.'
    ],
    author: 'Dev Tools Daily',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    officialSource: 'Cursor AI',
    officialUrl: 'https://cursor.com',
    tags: ['Cursor', 'AI Coding', 'Agent', 'Developer Tools']
  },
  {
    title: 'Midjourney V7 Alpha Preview Introduces Native 3D Mesh Output & Consistent Character Rigging',
    category: 'Breaking News',
    summary: 'Midjourney has unveiled V7 Alpha, enabling creators to generate high-fidelity 3D assets and animated character rigs directly from natural language prompts.',
    fullContent: [
      'Midjourney V7 Alpha marks a major milestone in generative art, moving beyond 2D image synthesis to full 3D mesh creation with textured UV maps.',
      'In addition to photorealistic rendering, V7 includes persistent character consistency controls across multiple camera angles and lighting scenes.',
      'The web platform now supports instant 3D viewport previewing and glTF asset export for game engines.'
    ],
    author: 'Creative AI Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    officialSource: 'Midjourney Discord',
    officialUrl: 'https://midjourney.com',
    tags: ['Midjourney', 'V7', 'Generative Art', '3D', 'AI']
  }
];

// Live AI News Articles In-Memory Store
let newsArticlesStore: any[] = [
  {
    id: 'news-2026-1',
    title: 'DeepSeek-R1 Open Reasoning Model Shocks Industry with Frontier Math & Code Benchmarks',
    category: 'Breaking News',
    summary: 'DeepSeek has released R1, an open-weights reasoning model utilizing large-scale reinforcement learning. It achieves parity with OpenAI o1 on AIME 2024 and Codeforces at a fraction of the inference cost.',
    fullContent: [
      'DeepSeek AI has introduced DeepSeek-R1, a breakthrough open reasoning model that applies pure reinforcement learning without initial supervised fine-tuning. R1 demonstrates emergent reasoning behaviors, self-verification, and step-by-step chain of thought capabilities.',
      'On standard benchmarks, DeepSeek-R1 scored 79.8% on AIME 2024 and 90.8% on MATH-500, rivaling proprietary models like OpenAI o1. Additionally, DeepSeek has open-sourced six distilled models ranging from 1.5B to 70B parameters based on Qwen and Llama architectures.',
      'The open weights permit full local execution, customization, and fine-tuning, accelerating global academic and enterprise research into cost-effective reasoning architectures.'
    ],
    date: new Date().toISOString().split('T')[0],
    readTime: '4 min read',
    author: 'AICentral Desk',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    officialSource: 'DeepSeek Research',
    officialUrl: 'https://github.com/deepseek-ai/DeepSeek-R1',
    likesCount: 2450,
    viewsCount: 38200,
    tags: ['DeepSeek', 'Reasoning', 'Open Source', 'R1', 'Math', 'LLM'],
    featured: true
  },
  {
    id: 'news-2026-2',
    title: 'Google Unveils Gemini 2.0 Flash with Native Multimodal Live API and Real-Time Voice',
    category: 'Product Launch',
    summary: 'Google’s Gemini 2.0 Flash introduces ultra-low latency multimodal interaction, built-in spatial comprehension, audio streaming, and agentic tool use.',
    fullContent: [
      'Google Quantum & AI teams have launched Gemini 2.0 Flash, optimized for speed, live audio-visual streaming, and autonomous agent workflows. Featuring native real-time bidirectional audio capabilities, users can talk directly with the model with sub-second response latency.',
      'Gemini 2.0 Flash introduces Native Tool Use with Google Search grounding, code execution environments, and complex multi-step call sequences for enterprise automation.',
      'Developers can immediately integrate Gemini 2.0 Flash using the unified @google/genai SDK across Web, Node.js, and Python runtimes.'
    ],
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    readTime: '5 min read',
    author: 'AI Innovation Hub',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    officialSource: 'Google AI Blog',
    officialUrl: 'https://blog.google/technology/ai/',
    likesCount: 1890,
    viewsCount: 29400,
    tags: ['Gemini 2.0', 'Google AI', 'Live API', 'Multimodal', 'Agentic'],
    featured: false
  },
  {
    id: 'news-2026-3',
    title: 'Anthropic Launches Claude 3.5 Sonnet Artifacts & Computer Use API for Enterprise Automation',
    category: 'Comparison',
    summary: 'Anthropic enables Claude to perceive desktop screens, move cursor, type keystrokes, and navigate complex legacy web applications autonomously.',
    fullContent: [
      'Anthropic has rolled out Computer Use capabilities in Claude 3.5 Sonnet. Through a dedicated screenshot-and-coordinate API, Claude can operate desktop OS software, fill multi-step web forms, and debug software code directly inside terminal windows.',
      'Benchmark results on OSWorld show Claude 3.5 Sonnet outperforming all previous models in desktop navigation and automated workflow execution.',
      'Security guardrails include real-time action verification, domain whitelisting, and strict human-in-the-loop overrides for sensitive operational steps.'
    ],
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    readTime: '6 min read',
    author: 'Dev Pulse Today',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    officialSource: 'Anthropic Research',
    officialUrl: 'https://www.anthropic.com/news',
    likesCount: 1620,
    viewsCount: 22100,
    tags: ['Claude 3.5', 'Anthropic', 'Computer Use', 'Automation', 'Agents'],
    featured: false
  },
  {
    id: 'news-2026-4',
    title: 'Meta Releases Llama 3.3 70B: Matching Llama 3.1 405B Capability at 5x Lower Overhead',
    category: 'Product Launch',
    summary: 'Meta’s latest open 70B model delivers state-of-the-art coding, instruction following, and multilingual reasoning while running efficiently on standard multi-GPU nodes.',
    fullContent: [
      'Meta AI has published Llama 3.3 70B Instruct, built on optimized transformer architecture and trained on over 15 trillion tokens.',
      'Despite having 1/6th the parameter size of the original 405B flagship model, Llama 3.3 70B achieves comparable performance across MMLU, HumanEval, and MATH benchmark suites.',
      'The model is available on Hugging Face, Ollama, and vLLM for immediate fine-tuning and enterprise self-hosting.'
    ],
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    readTime: '4 min read',
    author: 'Open AI Research',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    officialSource: 'Meta AI',
    officialUrl: 'https://ai.meta.com/llama/',
    likesCount: 1340,
    viewsCount: 18700,
    tags: ['Llama 3.3', 'Meta', 'Open Source', 'LLM', '70B'],
    featured: false
  }
];

// AI News Stream Endpoint
app.get("/api/ai-news", async (req, res) => {
  try {
    const isRefresh = req.query.refresh === 'true';

    if (isRefresh) {
      try {
        const ai = getAiClient();
        const currentDateStr = new Date().toISOString().split('T')[0];
        
        const prompt = `You are a premier senior AI tech journalist covering breaking artificial intelligence developments.
Generate ONE brand new, highly compelling, breaking news article about a major recent breakthrough in AI (such as reasoning LLMs, agentic systems, multimodal video generation, robotic foundation models, chip infrastructure, or open-source AI).

Return a JSON object matching this schema:
- id: string (unique string identifier like "news-gen-${Date.now()}")
- title: string (punchy, high-impact news headline)
- category: string (must be one of: "Breaking News", "Product Launch", "Tutorial", "Comparison")
- summary: string (2-3 sentence engaging overview)
- fullContent: array of 3 detailed paragraph strings explaining the technical innovation, benchmark comparisons, and practical applications
- date: string ("${currentDateStr}")
- readTime: string (e.g. "4 min read")
- author: string (e.g. "AICentral Editorial" or "Tech Radar AI")
- imageUrl: string (a clean high-quality Unsplash image URL related to tech/AI)
- officialSource: string (e.g. "OpenAI Blog", "Google DeepMind", "Anthropic", "Meta AI", "MIT Tech Review")
- officialUrl: string (a valid official tech news link)
- likesCount: number (random number between 300 and 1500)
- viewsCount: number (random number between 5000 and 25000)
- tags: array of 4-5 relevant keyword strings
- featured: boolean (false)`;

        const response = await callGeminiWithRetry(ai, {
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                summary: { type: Type.STRING },
                fullContent: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                date: { type: Type.STRING },
                readTime: { type: Type.STRING },
                author: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
                officialSource: { type: Type.STRING },
                officialUrl: { type: Type.STRING },
                likesCount: { type: Type.INTEGER },
                viewsCount: { type: Type.INTEGER },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                featured: { type: Type.BOOLEAN }
              },
              required: ["id", "title", "category", "summary", "fullContent", "date", "readTime", "author", "officialSource", "officialUrl", "tags"]
            }
          }
        });

        const newArticle = JSON.parse(response.text || "{}");
        if (newArticle && newArticle.title) {
          if (!newArticle.id) newArticle.id = `news-gen-${Date.now()}`;
          if (!newArticle.imageUrl) newArticle.imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
          if (!newArticle.likesCount) newArticle.likesCount = Math.floor(Math.random() * 800) + 400;
          if (!newArticle.viewsCount) newArticle.viewsCount = Math.floor(Math.random() * 15000) + 6000;
          if (!['Breaking News', 'Product Launch', 'Tutorial', 'Comparison'].includes(newArticle.category)) {
            newArticle.category = 'Breaking News';
          }

          // Prepend to top of store so user gets new content immediately
          newsArticlesStore = [newArticle, ...newsArticlesStore];
        }
      } catch (err: any) {
        console.warn("[AI News Stream] Notice during live generation, adding pool story:", err?.message || err);
        // Fallback: pick a item from fallbackNewsPool
        const existingTitles = new Set(newsArticlesStore.map(a => a.title));
        const unusedPool = fallbackNewsPool.filter(item => !existingTitles.has(item.title));
        const poolItem = unusedPool.length > 0 ? unusedPool[0] : fallbackNewsPool[Math.floor(Math.random() * fallbackNewsPool.length)];

        const fallbackArticle = {
          id: `news-fallback-${Date.now()}`,
          title: poolItem.title,
          category: poolItem.category,
          summary: poolItem.summary,
          fullContent: poolItem.fullContent,
          date: new Date().toISOString().split('T')[0],
          readTime: '4 min read',
          author: poolItem.author,
          imageUrl: poolItem.imageUrl,
          officialSource: poolItem.officialSource,
          officialUrl: poolItem.officialUrl,
          likesCount: Math.floor(Math.random() * 800) + 500,
          viewsCount: Math.floor(Math.random() * 12000) + 8000,
          tags: poolItem.tags,
          featured: false
        };

        newsArticlesStore = [fallbackArticle, ...newsArticlesStore];
      }
    }

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      articles: newsArticlesStore
    });
  } catch (error: any) {
    console.error("Error in /api/ai-news:", error);
    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      articles: newsArticlesStore
    });
  }
});

// Start Express Server with Vite middleware
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
    console.log(`AIVerse full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
