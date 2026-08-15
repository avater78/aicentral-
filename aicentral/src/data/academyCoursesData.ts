export interface CourseModule {
  weekOrModule: string;
  title: string;
  topics: string[];
}

export interface AcademyCourse {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modulesCount: number;
  rating: number;
  studentsCount: number;
  description: string;
  keySkills: string[];
  badge?: string;
  syllabus: CourseModule[];
}

export const ACADEMY_COURSES: AcademyCourse[] = [
  {
    id: 'course-prompt-eng',
    title: 'Prompt Engineering Mastery for Developers',
    category: 'Prompt Engineering',
    level: 'Beginner',
    duration: '3 Hours',
    modulesCount: 5,
    rating: 4.9,
    studentsCount: 14200,
    badge: 'Popular',
    description: 'Master system prompts, chain-of-thought reasoning, few-shot conditioning, and structured JSON output techniques across Gemini, Claude, and GPT-4o.',
    keySkills: ['Chain of Thought', 'Few-Shot Learning', 'System Rules', 'Structured Output'],
    syllabus: [
      { weekOrModule: 'Module 1', title: 'Fundamentals of LLM Prompt Conditioning', topics: ['Tokenizer behavior & context limits', 'Role definitions & tone setting', 'Zero-shot vs Few-shot prompts'] },
      { weekOrModule: 'Module 2', title: 'Advanced Reasoning Techniques', topics: ['Chain of Thought (CoT)', 'ReAct (Reasoning + Acting)', 'Self-Consistency Sampling'] },
      { weekOrModule: 'Module 3', title: 'Structured Data Extraction', topics: ['Forcing JSON schemas', 'Handling edge cases & fallback parsing', 'Function calling parameters'] },
    ]
  },
  {
    id: 'course-genai-apps',
    title: 'Full-Stack Generative AI App Building',
    category: 'App Development',
    level: 'Intermediate',
    duration: '6 Hours',
    modulesCount: 8,
    rating: 4.95,
    studentsCount: 9800,
    badge: 'Featured',
    description: 'Build end-to-end full-stack web applications with React, Express, Gemini 2.5 SDK, streaming API routes, and real-time state management.',
    keySkills: ['React 18', 'Express Server', '@google/genai SDK', 'Streaming Responses', 'Tailwind CSS'],
    syllabus: [
      { weekOrModule: 'Module 1', title: 'Full-Stack GenAI Architecture', topics: ['Client/Server proxy patterns', 'Securing API keys server-side', 'Vite & Express setup'] },
      { weekOrModule: 'Module 2', title: 'Server-Sent Events & Streaming', topics: ['Streaming token output', 'Handling stream interruptions', 'UI typewriter rendering'] },
      { weekOrModule: 'Module 3', title: 'Multimodal Inputs & File Uploads', topics: ['Processing image base64 buffers', 'Audio transcription & PDF analysis', 'Token cost optimization'] },
    ]
  },
  {
    id: 'course-rag-masterclass',
    title: 'RAG Architecture & Vector Database Masterclass',
    category: 'Architecture & Search',
    level: 'Intermediate',
    duration: '5 Hours',
    modulesCount: 6,
    rating: 4.88,
    studentsCount: 8100,
    badge: 'Production Grade',
    description: 'Design enterprise Retrieval-Augmented Generation (RAG) pipelines with hybrid search, vector embeddings, chunking strategies, and re-ranking.',
    keySkills: ['Vector DBs', 'Dense & Sparse Hybrid Search', 'Document Chunking', 'Cohere Rerank'],
    syllabus: [
      { weekOrModule: 'Module 1', title: 'Vector Space & Embeddings', topics: ['Understanding cosine similarity', 'High-dimensional embeddings', 'Chunking strategies & overlap'] },
      { weekOrModule: 'Module 2', title: 'Hybrid Search & Vector Indexing', topics: ['Combining BM25 keyword search with Qdrant/Pinecone', 'Reciprocal Rank Fusion (RRF)'] },
      { weekOrModule: 'Module 3', title: 'Re-Ranking & Hallucination Prevention', topics: ['Cross-encoder re-ranking', 'Grounded answer generation with citations', 'Evaluating RAG accuracy'] },
    ]
  },
  {
    id: 'course-ai-agents',
    title: 'Autonomous AI Agents & Tool Calling Workflows',
    category: 'Agentic AI',
    level: 'Advanced',
    duration: '7 Hours',
    modulesCount: 9,
    rating: 4.92,
    studentsCount: 6400,
    badge: 'Trending',
    description: 'Build multi-agent autonomous teams with stateful tool execution, dynamic memory, loop reflection, and human-in-the-loop approvals.',
    keySkills: ['Tool/Function Calling', 'Multi-Agent Loops', 'Memory Management', 'Self-Healing Agents'],
    syllabus: [
      { weekOrModule: 'Module 1', title: 'Agent Loop Mechanics', topics: ['ReAct decision cycles', 'Parsing tool definitions & schemas', 'Error recovery & retry backoff'] },
      { weekOrModule: 'Module 2', title: 'Multi-Agent Orchestration', topics: ['Supervisor and sub-agent hierarchies', 'Context passing between specialized models', 'Task queue execution'] },
      { weekOrModule: 'Module 3', title: 'Production Agent Guardrails', topics: ['Cost caps and infinite loop detection', 'Human-in-the-loop approval gates', 'Sanitizing tool inputs'] },
    ]
  },
  {
    id: 'course-finetuning',
    title: 'Fine-Tuning Open Source LLMs (Llama 3 & DeepSeek)',
    category: 'Model Operations',
    level: 'Advanced',
    duration: '8 Hours',
    modulesCount: 7,
    rating: 4.85,
    studentsCount: 4200,
    badge: 'Deep Dive',
    description: 'Learn parameter-efficient fine-tuning (LoRA / QLoRA), dataset curation, reward modeling, and self-hosting models on private GPU servers.',
    keySkills: ['LoRA & QLoRA', 'Dataset Curation', 'Unsloth', 'vLLM & Ollama Deployment'],
    syllabus: [
      { weekOrModule: 'Module 1', title: 'Dataset Formatting & Cleaning', topics: ['Alpaca and ShareGPT data structures', 'Synthetic data generation with frontier models', 'De-duplication'] },
      { weekOrModule: 'Module 2', title: 'Quantization & QLoRA Training', topics: ['4-bit and 8-bit quantization', 'Training parameters and learning rate schedules', 'Loss curve analysis'] },
      { weekOrModule: 'Module 3', title: 'High-Throughput Model Serving', topics: ['Serving with vLLM and TensorRT-LLM', 'Benchmarking throughput & latency', 'Private cloud deployment'] },
    ]
  },
  {
    id: 'course-multimodal',
    title: 'Multimodal Vision & Audio Processing',
    category: 'Vision & Multimodal',
    level: 'Intermediate',
    duration: '4 Hours',
    modulesCount: 5,
    rating: 4.89,
    studentsCount: 7300,
    description: 'Incorporate real-time vision, document OCR, object grounding, and low-latency audio processing into modern software applications.',
    keySkills: ['Vision OCR', 'Spatial Grounding', 'WebRTC Audio Streams', 'Gemini Live API'],
    syllabus: [
      { weekOrModule: 'Module 1', title: 'Visual Data Analysis', topics: ['Extracting text from complex diagrams', 'Bounding box coordinate grounding', 'Multi-frame video analysis'] },
      { weekOrModule: 'Module 2', title: 'Real-Time Audio Pipelines', topics: ['Streaming speech-to-text', 'Low-latency conversational duplex loops', 'Voice synthesis integration'] },
    ]
  }
];
