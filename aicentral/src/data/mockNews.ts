export interface AINewsArticle {
  id: string;
  title: string;
  category: 'Breaking News' | 'Tutorial' | 'Comparison' | 'Product Launch';
  summary: string;
  fullContent?: string[];
  date: string;
  readTime: string;
  author: string;
  imageUrl: string;
  officialSource?: string;
  officialUrl?: string;
  likesCount?: number;
  viewsCount?: number;
  tags?: string[];
  featured?: boolean;
}

export const MOCK_NEWS: AINewsArticle[] = [
  {
    id: 'news-1',
    title: 'OpenAI Releases o1 Reasoning Model with Deep Math & Coding Benchmarks',
    category: 'Breaking News',
    summary: 'OpenAI has officially introduced its new reasoning model series designed to solve complex scientific, mathematical, and algorithmic challenges by spending more time thinking before responding.',
    fullContent: [
      'OpenAI has officially launched OpenAI o1, a new series of AI models trained with reinforcement learning to perform complex reasoning. Unlike standard LLMs that generate instant token-by-token output, o1 uses a hidden chain of thought process before responding.',
      'Key benchmarks demonstrate dramatic leaps: on competitive programming challenges (Codeforces), o1 ranks in the 89th percentile. On the American Invitational Mathematics Examination (AIME), o1 solved 83% of problems compared to GPT-4o’s 13%.',
      'Developers can access o1 via API for code optimization, scientific analysis, multi-step mathematical proofs, and complex debugging workflows.'
    ],
    date: '2026-08-04',
    readTime: '4 min read',
    author: 'AICentral Editorial',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    officialSource: 'OpenAI Newsroom',
    officialUrl: 'https://openai.com/index/learning-to-reason-with-llms/',
    likesCount: 1420,
    viewsCount: 18900,
    tags: ['OpenAI', 'Reasoning', 'o1', 'LLM', 'Benchmarks'],
    featured: true
  },
  {
    id: 'news-2',
    title: 'FLUX.1 Open-Weights Image Model Takes Top Spot on Artificial Analysis Arena',
    category: 'Product Launch',
    summary: 'Black Forest Labs’ open-weights FLUX.1 model outperforms proprietary image generators in visual quality, typography rendering, and prompt fidelity.',
    fullContent: [
      'Black Forest Labs, founded by original Stable Diffusion researchers, has unveiled FLUX.1 — a 12-billion parameter rectifying flow transformer model for text-to-image synthesis.',
      'Available in three variants — Schnell (fast local execution), Dev (non-commercial open-weights), and Pro (commercial API) — FLUX.1 sets new state-of-the-art records for photorealism, human anatomy rendering, and legibility of embedded text in generated images.',
      'Community benchmarks on Artificial Analysis place FLUX.1 ahead of Midjourney v6 and DALL-E 3 across prompt adherence and artistic detail.'
    ],
    date: '2026-08-03',
    readTime: '5 min read',
    author: 'Design AI Lab',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    officialSource: 'Black Forest Labs',
    officialUrl: 'https://blackforestlabs.ai/',
    likesCount: 980,
    viewsCount: 14300,
    tags: ['FLUX.1', 'Text-to-Image', 'Open Weights', 'Generative Art'],
    featured: false
  },
  {
    id: 'news-3',
    title: 'Claude 3.5 Sonnet Artifacts Canvas: The Ultimate Developer Workflow Guide',
    category: 'Tutorial',
    summary: 'Discover how front-end developers are leveraging Claude Artifacts to generate, test, and render complete interactive web applications in real-time.',
    fullContent: [
      'Anthropic’s Claude 3.5 Sonnet introduced Artifacts — a dedicated split-screen UI element that renders code, vector graphics, HTML pages, SVG diagrams, and React components alongside conversational chat.',
      'In this step-by-step masterclass, we explore best practices for engineering prompts that produce clean, modular React components using Tailwind CSS and Lucide icons.',
      'We also cover how to export artifacts directly to GitHub, run local builds, and iterate on complex UI designs without context window degradation.'
    ],
    date: '2026-08-02',
    readTime: '6 min read',
    author: 'Dev Pulse',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    officialSource: 'Anthropic Docs',
    officialUrl: 'https://www.anthropic.com/news/claude-3-5-sonnet',
    likesCount: 1250,
    viewsCount: 16200,
    tags: ['Claude', 'Artifacts', 'React', 'Frontend', 'Tutorial'],
    featured: false
  },
  {
    id: 'news-4',
    title: 'Meta Llama 3.2 Released with Vision & Edge Hardware Optimization',
    category: 'Product Launch',
    summary: 'Meta releases lightweight 1B and 3B vision-capable models optimized for mobile, Qualcomm Snapdragon chips, and local privacy-first AI devices.',
    fullContent: [
      'Meta has unveiled Llama 3.2, featuring multimodal 11B and 90B vision models alongside ultra-compact 1B and 3B text-only models tailored for edge execution.',
      'These smaller models fit within 1GB to 3GB of RAM, enabling instant response times on mobile devices, IoT hardware, and local desktop applications with zero cloud latency.',
      'Developers can deploy Llama 3.2 on Android, iOS, and edge microcontrollers using ONNX runtime and Apple MLX frameworks.'
    ],
    date: '2026-08-01',
    readTime: '4 min read',
    author: 'AI Research Hub',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    officialSource: 'Meta AI',
    officialUrl: 'https://ai.meta.com/blog/',
    likesCount: 840,
    viewsCount: 11500,
    tags: ['Llama 3.2', 'Meta AI', 'Edge Computing', 'Vision AI'],
    featured: false
  },
  {
    id: 'news-5',
    title: 'DeepSeek-V2.5 vs GPT-4o: Open Source Benchmark Breakdown',
    category: 'Comparison',
    summary: 'A detailed performance and cost analysis comparing DeepSeek’s Mixture-of-Experts architecture against industry leading commercial APIs.',
    fullContent: [
      'DeepSeek-V2.5 combines advanced MoE routing with multi-head latent attention, offering 236B total parameters with only 21B active per token.',
      'Our benchmark suite tests coding accuracy, long-context retrieval across 128k tokens, and multi-turn reasoning.',
      'Result: DeepSeek-V2.5 delivers 92% of GPT-4o performance at less than 5% of the API cost, making it the most cost-effective solution for high-throughput enterprise applications.'
    ],
    date: '2026-07-30',
    readTime: '7 min read',
    author: 'BenchMark Lab',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    officialSource: 'DeepSeek AI',
    officialUrl: 'https://deepseek.com/',
    likesCount: 760,
    viewsCount: 9800,
    tags: ['DeepSeek', 'MoE', 'GPT-4o', 'Benchmarks', 'Cost Analysis'],
    featured: false
  },
  {
    id: 'news-6',
    title: 'Google Gemini 1.5 Pro 2 Million Token Context Window Case Studies',
    category: 'Tutorial',
    summary: 'Learn how enterprises are ingesting entire codebases, multi-hour video recordings, and thousands of financial documents in a single prompt.',
    fullContent: [
      'Gemini 1.5 Pro’s 2M token context window fundamentally changes how developers approach information retrieval and RAG architectures.',
      'Instead of chunking vector databases, teams can upload entire code repositories or 3-hour video streams directly into the model context.',
      'We review real-world case studies in code refactoring, legal document compliance, and multi-language video transcription.'
    ],
    date: '2026-07-28',
    readTime: '5 min read',
    author: 'Cloud AI Specialist',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    officialSource: 'Google DeepMind',
    officialUrl: 'https://deepmind.google/technologies/gemini/',
    likesCount: 1100,
    viewsCount: 15400,
    tags: ['Gemini 1.5', 'Google AI', '2M Context', 'Enterprise'],
    featured: false
  }
];
