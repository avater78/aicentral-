export interface ModelBenchmark {
  id: string;
  name: string;
  provider: string;
  category: 'LLM & Reasoning' | 'Code Generation' | 'Vision & Multimodal' | 'Voice & Audio' | 'Embedding & RAG';
  badge?: string;
  description: string;
  contextWindow: string;
  inputPricePer1M: number;
  outputPricePer1M: number;
  scores: {
    coding: number; // 0-100 (HumanEval)
    reasoning: number; // 0-100 (MMLU-Pro / MATH)
    speedTps: number; // Tokens per second
    arenaElo: number; // Chatbot Arena Elo
  };
  keyFeatures: string[];
  bestFor: string;
  websiteUrl: string;
}

export interface ArchitectureBlueprint {
  id: string;
  title: string;
  category: string;
  complexity: 'Simple' | 'Intermediate' | 'Production Grade';
  description: string;
  latency: string;
  estimatedCost: string;
  stack: string[];
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    component: string;
  }[];
  configSnippet: string;
}

export const MOCK_BENCHMARKS: ModelBenchmark[] = [
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    category: 'LLM & Reasoning',
    badge: 'Top Reasoning Value',
    description: 'Open-weights reasoning model matching closed frontier models in math, code, and complex logical chain-of-thought.',
    contextWindow: '128K',
    inputPricePer1M: 0.55,
    outputPricePer1M: 2.19,
    scores: {
      coding: 92.8,
      reasoning: 94.2,
      speedTps: 42,
      arenaElo: 1358,
    },
    keyFeatures: ['Self-verification Chain of Thought', 'Open Weights', 'Ultra-low API Pricing', 'SOTA Math & Logic'],
    bestFor: 'Complex algorithmic code, scientific math proofs, and cost-effective deep reasoning',
    websiteUrl: 'https://deepseek.com',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    category: 'Code Generation',
    badge: 'Developer Choice',
    description: 'Industry gold standard for software engineering, frontend UI generation, agentic tool use, and nuanced text.',
    contextWindow: '200K',
    inputPricePer1M: 3.00,
    outputPricePer1M: 15.00,
    scores: {
      coding: 93.7,
      reasoning: 92.0,
      speedTps: 78,
      arenaElo: 1372,
    },
    keyFeatures: ['Artifacts Visual Rendering', 'SOTA Code Synthesis', 'Superior Tool & Function Calling', '200k Context'],
    bestFor: 'Full-stack web application generation, complex code refactoring, and AI autonomous agents',
    websiteUrl: 'https://anthropic.com',
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    provider: 'OpenAI',
    category: 'Vision & Multimodal',
    badge: 'Multimodal Frontier',
    description: 'Omni-model processing text, image, audio, and vision inputs natively with low latency and balanced execution.',
    contextWindow: '128K',
    inputPricePer1M: 2.50,
    outputPricePer1M: 10.00,
    scores: {
      coding: 90.2,
      reasoning: 89.6,
      speedTps: 110,
      arenaElo: 1362,
    },
    keyFeatures: ['Native Audio & Vision', 'High Throughput', 'Structured JSON Output', 'Widespread Tool Ecosystem'],
    bestFor: 'Multimodal vision inspection, customer service bots, and fast production API backends',
    websiteUrl: 'https://openai.com',
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    category: 'Vision & Multimodal',
    badge: '2M Token Window',
    description: 'Breakthrough 2-million token context window capable of ingesting whole video files, codebase repositories, and lengthy books.',
    contextWindow: '2,000K',
    inputPricePer1M: 1.25,
    outputPricePer1M: 5.00,
    scores: {
      coding: 88.5,
      reasoning: 90.1,
      speedTps: 85,
      arenaElo: 1348,
    },
    keyFeatures: ['2M Token Context Window', 'Video & Audio Native OCR', 'Google Grounding Integration', 'Low Pricing'],
    bestFor: 'Repository-wide code analysis, long document summarization, and direct video understanding',
    websiteUrl: 'https://ai.google.dev',
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    category: 'LLM & Reasoning',
    badge: 'Open Source Standard',
    description: 'Meta’s flaghip 70B parameter open model rivaling previous generation closed frontier models on enterprise hardware.',
    contextWindow: '128K',
    inputPricePer1M: 0.18,
    outputPricePer1M: 0.59,
    scores: {
      coding: 86.4,
      reasoning: 88.0,
      speedTps: 140,
      arenaElo: 1320,
    },
    keyFeatures: ['Permissive License', 'Self-Hosted Privacy', 'High Fine-tuning Adaptability', 'Incredible Throughput'],
    bestFor: 'On-premise enterprise deployments, custom fine-tuning, and ultra-cheap private AI servers',
    websiteUrl: 'https://meta.com',
  },
  {
    id: 'elevenlabs-turbo-v2-5',
    name: 'ElevenLabs Voice Turbo v2.5',
    provider: 'ElevenLabs',
    category: 'Voice & Audio',
    badge: 'Lowest Audio Latency',
    description: 'Ultra-realistic text-to-speech with conversational low latency (~250ms) and emotional expressiveness across 32 languages.',
    contextWindow: 'N/A',
    inputPricePer1M: 15.00, // per 1M characters
    outputPricePer1M: 0,
    scores: {
      coding: 0,
      reasoning: 96.0, // voice naturalness
      speedTps: 320, // characters per sec
      arenaElo: 1390,
    },
    keyFeatures: ['250ms Latency', '32 Native Languages', 'Emotion Controllability', 'Voice Cloning'],
    bestFor: 'Real-time conversational voice agents, podcast automation, and audiobooks',
    websiteUrl: 'https://elevenlabs.io',
  },
  {
    id: 'text-embedding-3-large',
    name: 'Text Embedding 3 Large',
    provider: 'OpenAI',
    category: 'Embedding & RAG',
    badge: 'SOTA Vector Indexing',
    description: 'High-density vector embedding model with flexible dimensions up to 3072 for maximum search retrieval precision.',
    contextWindow: '8K',
    inputPricePer1M: 0.13,
    outputPricePer1M: 0,
    scores: {
      coding: 82.0,
      reasoning: 94.0, // Retrieval benchmark (MTEB)
      speedTps: 500,
      arenaElo: 1330,
    },
    keyFeatures: ['3072 Vector Dimensions', 'Dimension Truncation Support', 'MTEB Benchmark Leader', 'Ultra Low Cost'],
    bestFor: 'Enterprise RAG knowledge bases, semantic document search, and recommendation engines',
    websiteUrl: 'https://openai.com',
  }
];

export const MOCK_BLUEPRINTS: ArchitectureBlueprint[] = [
  {
    id: 'blueprint-rag',
    title: 'Enterprise Production RAG Pipeline',
    category: 'Knowledge Base & Search',
    complexity: 'Production Grade',
    description: 'A resilient, hybrid-search Retrieval-Augmented Generation pipeline combining dense vector embeddings with BM25 keyword matching and re-ranking.',
    latency: '< 450ms',
    estimatedCost: '~$0.0015 / query',
    stack: ['Text-Embedding-3-Large', 'Qdrant / Pinecone', 'Cohere Rerank', 'Claude 3.5 Sonnet'],
    steps: [
      { stepNumber: 1, title: 'Document Ingestion & Chunking', description: 'Parse PDFs & Markdown files into semantic 500-token chunks with 50-token overlap.', component: 'LangChain TextSplitter' },
      { stepNumber: 2, title: 'Dense & Sparse Hybrid Embedding', description: 'Generate 3072-dim embeddings for vector search alongside sparse BM25 token indices.', component: 'OpenAI Embeddings + Qdrant' },
      { stepNumber: 3, title: 'Reciprocal Rank Fusion (RRF)', description: 'Retrieve top 25 candidate chunks and re-rank top 5 using cross-encoder relevance.', component: 'Cohere Rerank v3' },
      { stepNumber: 4, title: 'Grounded LLM Generation', description: 'Stream response strictly grounded in retrieved chunks with inline citation markers.', component: 'Claude 3.5 Sonnet' },
    ],
    configSnippet: `{
  "pipeline": "enterprise_rag_v2",
  "embedding_model": "text-embedding-3-large",
  "vector_store": {
    "provider": "qdrant",
    "distance": "Cosine",
    "dimensions": 3072
  },
  "reranker": {
    "model": "cohere-rerank-v3",
    "top_k": 5
  },
  "llm_generator": {
    "model": "claude-3-5-sonnet",
    "temperature": 0.1,
    "max_tokens": 1024
  }
}`
  },
  {
    id: 'blueprint-coding-agent',
    title: 'Autonomous Code Editing & Self-Healing Agent',
    category: 'Agentic Workflows',
    complexity: 'Intermediate',
    description: 'An AI coding loop that reads codebase ASTs, proposes surgical edits, executes linting checks, and self-corrects on errors.',
    latency: '1.2s - 3.5s',
    estimatedCost: '~$0.0080 / edit',
    stack: ['DeepSeek R1', 'Claude 3.5 Sonnet', 'TypeScript AST Parser', 'Docker Sandbox'],
    steps: [
      { stepNumber: 1, title: 'Context AST Aggregation', description: 'Parse project imports & target file AST tree into prompt window context.', component: 'TypeScript Compiler API' },
      { stepNumber: 2, title: 'Reasoning & Surgical Edit Plan', description: 'Generate step-by-step reasoning chain and exact target-replacement chunks.', component: 'DeepSeek R1' },
      { stepNumber: 3, title: 'Isolated Linter Execution', description: 'Apply diff in isolated container sandbox and run static typecheck + linting.', component: 'Docker / Node Exec' },
      { stepNumber: 4, title: 'Self-Healing Error Correction', description: 'If build fails, feed stdout stack trace back into model for automated patch correction.', component: 'Claude 3.5 Sonnet' },
    ],
    configSnippet: `{
  "agent": "code_self_healer",
  "reasoning_engine": "deepseek-r1",
  "synthesis_engine": "claude-3-5-sonnet",
  "max_repair_loops": 3,
  "sandbox": {
    "type": "docker",
    "timeout_ms": 10000,
    "allowed_commands": ["npm run lint", "tsc --noEmit"]
  }
}`
  },
  {
    id: 'blueprint-voice-ai',
    title: 'Low-Latency Conversational Voice Assistant',
    category: 'Voice & Real-Time',
    complexity: 'Production Grade',
    description: 'Ultra-fast, two-way conversational voice pipeline delivering streaming audio responses under 300ms total end-to-end latency.',
    latency: '< 290ms',
    estimatedCost: '~$0.012 / minute',
    stack: ['Deepgram Nova-2', 'Gemini 1.5 Flash', 'ElevenLabs Voice Turbo v2.5', 'WebSocket Server'],
    steps: [
      { stepNumber: 1, title: 'Streaming Voice Speech-to-Text', description: 'Convert microphone WebSockets audio buffers to text in real-time with automatic endpointing.', component: 'Deepgram Nova-2 STT' },
      { stepNumber: 2, title: 'Streamed LLM Conversational Reply', description: 'Stream first-sentence response tokens back within 120ms.', component: 'Gemini 1.5 Flash' },
      { stepNumber: 3, title: 'Streaming Text-to-Speech Output', description: 'Pipe streaming text chunks into low-latency voice audio buffer stream.', component: 'ElevenLabs Turbo v2.5' },
    ],
    configSnippet: `{
  "voice_pipeline": "realtime_duplex_v1",
  "stt_provider": "deepgram_nova_2",
  "llm_provider": {
    "model": "gemini-1-5-flash",
    "stream": true,
    "max_tokens": 150
  },
  "tts_provider": {
    "model": "elevenlabs_turbo_v2_5",
    "latency_mode": 4
  }
}`
  }
];
