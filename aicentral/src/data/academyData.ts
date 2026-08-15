export interface LessonSection {
  heading: string;
  text: string;
  bulletPoints?: string[];
  examplePrompt?: string;
  codeSnippet?: string;
  proTip?: string;
}

export interface AcademyLesson {
  id: string;
  title: string;
  category: 'Start Here' | 'Prompt Engineering' | 'AI Tools' | 'AI for Creators' | 'AI for Work & Business' | 'AI Concepts' | 'Practical AI Tutorials';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  isBeginnerFriendly?: boolean;
  isPopularThisWeek?: boolean;
  isStartWithThese?: boolean;
  filterTags: string[];
  shortDescription: string;
  crossLink?: {
    label: string;
    targetTab: 'discover' | 'match-finder' | 'workflow-builder' | 'ai-detector' | 'comparison-engine' | 'prompt-library' | 'news-blog' | 'skill-academy';
    buttonText: string;
  };
  content: {
    overview: string;
    keyTakeaways: string[];
    sections: LessonSection[];
    recommendedTools?: string[];
  };
}

export const ACADEMY_LESSONS: AcademyLesson[] = [
  // ----------------------------------------------------
  // 1. START HERE (For Complete Beginners)
  // ----------------------------------------------------
  {
    id: 'lesson-what-is-ai',
    title: 'What is Artificial Intelligence?',
    category: 'Start Here',
    difficulty: 'Beginner',
    readTime: '4 min',
    isBeginnerFriendly: true,
    isStartWithThese: true,
    isPopularThisWeek: true,
    filterTags: ['Beginner', 'Guides', 'Concepts'],
    shortDescription: 'A friendly, non-technical introduction to what AI is, how it processes information, and why it matters today.',
    crossLink: {
      label: 'Explore curated AI tools across all categories',
      targetTab: 'discover',
      buttonText: 'Discover AI Tools'
    },
    content: {
      overview: 'Artificial Intelligence (AI) refers to computer systems engineered to perform tasks that historically required human intelligence—such as recognizing speech, identifying patterns in images, making decisions, and writing text.',
      keyTakeaways: [
        'AI is not a single magical program, but a collection of mathematical models and algorithms.',
        'Modern AI excels at pattern recognition, processing huge volumes of text, code, and media.',
        'Generative AI creates original content based on patterns learned from training data.'
      ],
      sections: [
        {
          heading: '1. Traditional Software vs. Artificial Intelligence',
          text: 'Traditional computer programs follow rigid step-by-step rules written by human developers (If X happens, do Y). AI systems, by contrast, learn from vast datasets to recognize patterns and make probabilistic predictions without needing explicit rules for every scenario.',
          bulletPoints: [
            'Traditional Code: Fixed rules + Input data = Output',
            'Machine Learning: Input data + Desired outputs = Learned patterns (Model)'
          ]
        },
        {
          heading: '2. Everyday Examples You Already Use',
          text: 'You interact with AI every day without realizing it: email spam filters, camera portrait modes, GPS navigation calculating traffic, and streaming recommendations.',
          proTip: 'Think of AI as an incredibly fast digital research partner—it gives you a 80% baseline draft in seconds, which you then refine with human judgment.'
        }
      ],
      recommendedTools: ['ChatGPT', 'Claude', 'Google Gemini', 'Perplexity']
    }
  },
  {
    id: 'lesson-what-is-genai',
    title: 'What is Generative AI?',
    category: 'Start Here',
    difficulty: 'Beginner',
    readTime: '5 min',
    isBeginnerFriendly: true,
    isStartWithThese: true,
    isPopularThisWeek: true,
    filterTags: ['Beginner', 'Guides', 'Concepts'],
    shortDescription: 'Learn how generative AI creates new text, images, code, audio, and video from simple text prompts.',
    crossLink: {
      label: 'Compare different generative AI models and tools',
      targetTab: 'comparison-engine',
      buttonText: 'Compare AI Models'
    },
    content: {
      overview: 'Generative AI is a branch of artificial intelligence capable of synthesizing brand-new content—whether essays, computer code, photorealistic artwork, or musical tracks—in response to human prompts.',
      keyTakeaways: [
        'Discriminative AI analyzes or categorizes existing data; Generative AI creates new data.',
        'Large Language Models (LLMs) generate text by predicting the most probable next word.',
        'Diffusion models generate images by turning random noise into structured visuals.'
      ],
      sections: [
        {
          heading: '1. How Does Generative AI Work?',
          text: 'Generative models absorb billions of data samples during training. They map complex relationships between words, concepts, colors, and sounds into a multi-dimensional mathematical space.',
          bulletPoints: [
            'Text Models (LLMs): Predict the next token based on context.',
            'Image Models (Diffusion): Un-noise random static into crisp imagery.'
          ]
        },
        {
          heading: '2. The Fundamental Rule of Generative AI',
          text: 'Generative AI generates plausible outputs based on probability. It does not "think" or "know" facts in the human sense. Always verify critical facts, figures, and code outputs.',
          proTip: 'Give AI a persona, background context, and explicit constraints to dramatically improve output quality.'
        }
      ]
    }
  },
  {
    id: 'lesson-how-assistants-work',
    title: 'How AI Assistants & Chatbots Work',
    category: 'Start Here',
    difficulty: 'Beginner',
    readTime: '4 min',
    isBeginnerFriendly: true,
    isStartWithThese: true,
    filterTags: ['Beginner', 'Guides', 'Tools'],
    shortDescription: 'Understand context windows, tokenization, memory, and how conversational AI formats its answers.',
    content: {
      overview: 'Conversational AI assistants like ChatGPT, Claude, and Gemini process user inputs by breaking text into tokens, searching their contextual memory, and streaming responses back line by line.',
      keyTakeaways: [
        'Tokens are the building blocks of AI language processing (~3/4 of an English word).',
        'Context windows define how much previous conversation the AI can remember at once.',
        'System prompts guide the assistant’s persona, tone, safety boundaries, and constraints.'
      ],
      sections: [
        {
          heading: '1. What are Tokens?',
          text: 'AI models do not read whole words or letters. They convert input text into numerical chunks called tokens. For instance, "Artificial Intelligence" is split into "Arti", "ficial", " Intel", "ligence".'
        },
        {
          heading: '2. Managing Context Windows',
          text: 'If a conversation exceeds the model’s context limit, earlier messages fall outside memory. Keep separate chats for distinct projects to maintain peak reasoning precision.'
        }
      ]
    }
  },
  {
    id: 'lesson-ai-terminology',
    title: 'Essential AI Terminology Every Beginner Should Know',
    category: 'Start Here',
    difficulty: 'Beginner',
    readTime: '6 min',
    isBeginnerFriendly: true,
    isStartWithThese: true,
    filterTags: ['Beginner', 'Guides', 'Concepts'],
    shortDescription: 'A cheat-sheet explaining LLM, Hallucination, RAG, Fine-Tuning, Parameters, and Inference.',
    content: {
      overview: 'Demystify tech jargon. Learn the fundamental glossary terms used by software engineers and AI practitioners every day.',
      keyTakeaways: [
        'LLM (Large Language Model): AI trained on massive text datasets.',
        'Hallucination: When an AI confidently generates incorrect or fabricated facts.',
        'Prompt: The text instruction or question you provide to an AI system.',
        'Inference: The act of the AI running and generating an output.'
      ],
      sections: [
        {
          heading: 'Top Glossary Terms',
          text: 'Key definitions to know:',
          bulletPoints: [
            'LLM: Large Language Model (e.g. Gemini 2.5, GPT-4o, Claude 3.5 Sonnet).',
            'Parameters: The internal weights/connections learned during training.',
            'Hallucination: Fabricated information presented with high confidence.',
            'Fine-Tuning: Further training a general model on specialized domain data.',
            'Multimodal: AI that can process text, images, video, and audio simultaneously.'
          ]
        }
      ]
    }
  },
  {
    id: 'lesson-responsible-ai',
    title: 'How to Use AI Responsibly & Securely',
    category: 'Start Here',
    difficulty: 'Beginner',
    readTime: '5 min',
    isBeginnerFriendly: true,
    filterTags: ['Beginner', 'Guides'],
    shortDescription: 'Protect confidential data, avoid bias, verify facts, and practice ethical AI usage.',
    crossLink: {
      label: 'Check if text or documents were written by AI',
      targetTab: 'ai-detector',
      buttonText: 'Try AI Detector'
    },
    content: {
      overview: 'As AI tools become ubiquitous, responsible usage ensures data privacy, accuracy, and ethical alignment in personal and professional workflows.',
      keyTakeaways: [
        'Never paste sensitive passwords, API keys, or private customer records into public LLM chats.',
        'Always double-check factual claims, citations, and mathematical calculations.',
        'Disclose AI assistance when required in academic or professional settings.'
      ],
      sections: [
        {
          heading: '1. Privacy & Data Protection',
          text: 'Public free tiers of AI services may use conversation histories to train future models unless you opt out in privacy settings or use enterprise API endpoints.'
        }
      ]
    }
  },

  // ----------------------------------------------------
  // 2. PROMPT ENGINEERING
  // ----------------------------------------------------
  {
    id: 'lesson-anatomy-of-prompt',
    title: 'Anatomy of a Perfect Prompt',
    category: 'Prompt Engineering',
    difficulty: 'Beginner',
    readTime: '5 min',
    isBeginnerFriendly: true,
    isPopularThisWeek: true,
    filterTags: ['Beginner', 'Prompts', 'Guides'],
    shortDescription: 'Learn the 4 core components of high-converting prompts: Persona, Task, Context, and Constraints.',
    crossLink: {
      label: 'Browse and test hundreds of production-ready prompts',
      targetTab: 'prompt-library',
      buttonText: 'Try Prompt Tool'
    },
    content: {
      overview: 'The difference between vague AI responses and world-class outputs lies in prompt structure. Master the 4-part prompt framework.',
      keyTakeaways: [
        'Role/Persona: Who the AI should act like.',
        'Task: Clear, explicit action verb detailing what needs to be created.',
        'Context: Background data, audience details, or reference material.',
        'Constraints: Word limits, forbidden words, tone, and output formatting.'
      ],
      sections: [
        {
          heading: '1. The 4-Part Prompt Structure',
          text: 'Construct prompts systematically for consistent, professional results:',
          bulletPoints: [
            '1. Persona: "Act as a Senior UX Writer with 10 years of experience..."',
            '2. Task: "Draft 3 headline variations for our eco-friendly water bottle brand."',
            '3. Context: "Our target audience is active urban millennials aged 22-35 who value minimal design."',
            '4. Constraints: "Keep each under 10 words. Avoid cliché words like supercharge or empower. Format as bullet points."'
          ],
          examplePrompt: `Act as a Principal Software Architect. Review the following React component code and identify memory leaks or unnecessary re-renders. Explain issues concisely in bullet points, then provide the refactored code block with TypeScript types.`
        }
      ]
    }
  },
  {
    id: 'lesson-few-shot-prompting',
    title: 'Few-Shot & Role Prompting Frameworks',
    category: 'Prompt Engineering',
    difficulty: 'Intermediate',
    readTime: '6 min',
    filterTags: ['Intermediate', 'Prompts', 'Guides'],
    shortDescription: 'Guide AI by providing 2–3 concrete input/output examples inside your prompt.',
    crossLink: {
      label: 'Test few-shot prompts in our interactive Prompt Library',
      targetTab: 'prompt-library',
      buttonText: 'Open Prompt Library'
    },
    content: {
      overview: 'Few-shot prompting is one of the most reliable ways to force exact formatting, tone, and structured classification without fine-tuning.',
      keyTakeaways: [
        'Zero-Shot: Asking the AI to perform a task with no examples.',
        'Few-Shot: Showing 2-4 input/output examples before asking your actual question.',
        'Drastically reduces formatting errors and tone inconsistencies.'
      ],
      sections: [
        {
          heading: 'Example of Few-Shot Prompting',
          text: 'By showing the desired input-to-output pattern, the AI imitates the exact structure:',
          examplePrompt: `Classify customer feedback sentiment and extract key topic.

Input: "The delivery took 5 days but the product quality is superb!"
Output: Sentiment: Positive | Topic: Product Quality

Input: "App crashed three times while submitting payment."
Output: Sentiment: Negative | Topic: Checkout Bug

Input: "Is this sweater machine washable?"
Output:`
        }
      ]
    }
  },
  {
    id: 'lesson-advanced-prompting',
    title: 'Chain-of-Thought & Reasoning Frameworks',
    category: 'Prompt Engineering',
    difficulty: 'Advanced',
    readTime: '7 min',
    filterTags: ['Advanced', 'Prompts', 'Concepts'],
    shortDescription: 'Unlock deep logical reasoning in AI by forcing step-by-step thinking before final answers.',
    crossLink: {
      label: 'Explore advanced prompts for engineering and research',
      targetTab: 'prompt-library',
      buttonText: 'Explore Prompts'
    },
    content: {
      overview: 'When solving complex logic, math, or coding problems, telling the AI to "think step by step" improves reasoning accuracy by up to 40%.',
      keyTakeaways: [
        'Chain of Thought (CoT) forces the model to allocate computation tokens to internal reasoning.',
        'Reduces premature conclusions and mathematical errors.',
        'Works exceptionally well with reasoning models like Gemini 2.5 Pro and Claude 3.5.'
      ],
      sections: [
        {
          heading: '1. The "Think Step-by-Step" Magic Phrase',
          text: 'Simply adding "Let’s think step by step before reaching a conclusion" causes the AI to decompose complex multi-stage problems before giving the final answer.',
          examplePrompt: `A company has $500k budget. Marketing gets 35%, R&D gets 40%, operations gets the remainder. If operations spends $45k on software, how much is left in operations? 

Let's break this down step-by-step before stating the final dollar amount.`
        }
      ]
    }
  },

  // ----------------------------------------------------
  // 3. AI TOOLS
  // ----------------------------------------------------
  {
    id: 'lesson-ai-tool-categories',
    title: 'Navigating the Landscape of AI Tools',
    category: 'AI Tools',
    difficulty: 'Beginner',
    readTime: '6 min',
    isBeginnerFriendly: true,
    isPopularThisWeek: true,
    filterTags: ['Beginner', 'Tools', 'Guides'],
    shortDescription: 'Understand the distinct categories: Chatbots, Writing, Vision, Audio, Video, Coding, and Search.',
    crossLink: {
      label: 'Search 1,000+ top AI tools in AI Discovery',
      targetTab: 'discover',
      buttonText: 'Discover AI Tools'
    },
    content: {
      overview: 'With thousands of AI tools emerging monthly, understanding category specializations helps you pick the right tool for any task.',
      keyTakeaways: [
        'Chatbots & General Assistants: ChatGPT, Claude, Gemini.',
        'AI Search Engines: Perplexity, Genspark, Google AI Overviews.',
        'Media Generation: Midjourney, Runway, ElevenLabs, Suno.',
        'AI Coding: Cursor, GitHub Copilot, v0, Bolt.'
      ],
      sections: [
        {
          heading: '1. Matching Task to Tool',
          text: 'General LLMs handle text analysis and brainstorming well, while specialized narrow tools (e.g., ElevenLabs for voice cloning or Cursor for coding) deliver superior domain performance.',
          bulletPoints: [
            'For Deep Research: Perplexity AI',
            'For Coding & Refactoring: Cursor / Claude 3.5 Sonnet',
            'For Visual Design & Logos: Midjourney / Recraft',
            'For Video Generation: Sora / Runway Gen-3 / Luma Dream Machine'
          ]
        }
      ]
    }
  },
  {
    id: 'lesson-ai-coding-tools',
    title: 'How to Build & Code with AI Tools',
    category: 'AI Tools',
    difficulty: 'Intermediate',
    readTime: '7 min',
    filterTags: ['Intermediate', 'Tools', 'Creativity'],
    shortDescription: 'How modern developers and non-technical builders use AI to construct apps, websites, and scripts.',
    crossLink: {
      label: 'Compare top AI Coding Assistants side-by-side',
      targetTab: 'comparison-engine',
      buttonText: 'Compare Coding Tools'
    },
    content: {
      overview: 'AI pair programming has transformed software development. Learn how to write code, debug errors, and generate entire web apps using natural language.',
      keyTakeaways: [
        'AI code completion speeds up boilerplate generation by 3x.',
        'Feed exact compiler/linter error messages to AI for instant bug diagnosis.',
        'Always verify TypeScript types and security vulnerabilities.'
      ],
      sections: [
        {
          heading: '1. The AI Coding Workflow',
          text: 'Start with detailed architecture specs, then ask AI to build small modular functions rather than huge monolith files.',
          proTip: 'Paste the exact error stack trace along with the relevant code snippet to get a precise one-shot fix.'
        }
      ]
    }
  },

  // ----------------------------------------------------
  // 4. AI FOR CREATORS
  // ----------------------------------------------------
  {
    id: 'lesson-ai-content-creation',
    title: 'AI Workflows for YouTube, TikTok & Social Media',
    category: 'AI for Creators',
    difficulty: 'Beginner',
    readTime: '6 min',
    isBeginnerFriendly: true,
    isPopularThisWeek: true,
    filterTags: ['Beginner', 'Creativity', 'Guides'],
    shortDescription: 'Automate scriptwriting, thumbnail ideas, voiceovers, video editing, and content repurposing.',
    crossLink: {
      label: 'Find creator tools in AI Match Finder',
      targetTab: 'match-finder',
      buttonText: 'Match Creator Tools'
    },
    content: {
      overview: 'Supercharge your digital content production line using AI tools for brainstorming, voiceovers, video cutdowns, and social media captions.',
      keyTakeaways: [
        'Idea Generation: Use LLMs to generate 20 viral video hooks based on trending topics.',
        'Voiceovers: Use realistic AI voice synthesis like ElevenLabs.',
        'Shorts/Reels: Use auto-clipping AI like Opus Clip to turn long podcasts into vertical clips with animated captions.'
      ],
      sections: [
        {
          heading: '1. Step-by-Step Creator Pipeline',
          text: 'How top solo creators publish 10x more content:',
          bulletPoints: [
            '1. Research: Query Perplexity for rising topic trends.',
            '2. Scripting: Draft YouTube script outline with Claude 3.5.',
            '3. Audio: Generate studio-quality narration with ElevenLabs.',
            '4. Visuals: Create custom video b-roll with Midjourney/Runway.',
            '5. Repurposing: Convert long video audio to blog posts & X threads.'
          ]
        }
      ]
    }
  },

  // ----------------------------------------------------
  // 5. AI FOR WORK & BUSINESS
  // ----------------------------------------------------
  {
    id: 'lesson-ai-business-automation',
    title: 'AI Productivity, Email & Business Automation',
    category: 'AI for Work & Business',
    difficulty: 'Intermediate',
    readTime: '6 min',
    filterTags: ['Intermediate', 'Business', 'Tools'],
    shortDescription: 'Streamline email responses, meeting summaries, customer support, and automated multi-step workflows.',
    crossLink: {
      label: 'Build automated AI workflows visually',
      targetTab: 'workflow-builder',
      buttonText: 'Build a Workflow'
    },
    content: {
      overview: 'Turn repetitive business administrative tasks into hands-off automated workflows using AI integrations and workflow builders.',
      keyTakeaways: [
        'Summarize 50-page PDF reports into key executive bullets in seconds.',
        'Draft personalized sales emails matching client tone.',
        'Automate lead triage and email response classification.'
      ],
      sections: [
        {
          heading: '1. Automating Meeting Notes & Tasks',
          text: 'AI meeting recording bots automatically transcribe discussions, assign owner action items, and post clean summaries directly into Slack or Notion.'
        }
      ]
    }
  },

  // ----------------------------------------------------
  // 6. AI CONCEPTS
  // ----------------------------------------------------
  {
    id: 'lesson-understanding-rag-agents',
    title: 'Understanding RAG (Retrieval-Augmented Generation) & AI Agents',
    category: 'AI Concepts',
    difficulty: 'Advanced',
    readTime: '8 min',
    filterTags: ['Advanced', 'Concepts', 'Guides'],
    shortDescription: 'Learn how modern enterprise AI connects private company databases to LLMs for accurate, hallucination-free answers.',
    crossLink: {
      label: 'Explore AI specifications & model benchmarks',
      targetTab: 'skill-academy',
      buttonText: 'View Model Specs'
    },
    content: {
      overview: 'Standard LLMs only know data up to their training cutoff date. RAG enables models to query your live private document store dynamically.',
      keyTakeaways: [
        'RAG combines vector database search with LLM text generation.',
        'Prevents hallucinations by forcing answers to rely strictly on retrieved source documents.',
        'AI Agents use tools (search, SQL, APIs) autonomously to complete multi-step goals.'
      ],
      sections: [
        {
          heading: '1. RAG Architecture Step-by-Step',
          text: 'How document retrieval works behind the scenes:',
          bulletPoints: [
            '1. Documents are converted into numerical vector embeddings.',
            '2. User query searches vector DB for closest matching paragraphs.',
            '3. Relevant paragraphs are injected into LLM context window as ground truth.',
            '4. LLM answers user query citing exact source paragraphs.'
          ]
        }
      ]
    }
  },

  // ----------------------------------------------------
  // 7. PRACTICAL AI TUTORIALS
  // ----------------------------------------------------
  {
    id: 'tutorial-build-website-ai',
    title: 'How to Build a Website with AI in 10 Minutes',
    category: 'Practical AI Tutorials',
    difficulty: 'Beginner',
    readTime: '8 min',
    isBeginnerFriendly: true,
    isPopularThisWeek: true,
    filterTags: ['Beginner', 'Tutorials', 'Creativity'],
    shortDescription: 'Step-by-step tutorial on generating responsive landing pages, React code, and styling using AI builders.',
    crossLink: {
      label: 'Find web development AI tools',
      targetTab: 'discover',
      buttonText: 'Find Web Tools'
    },
    content: {
      overview: 'Learn how to generate full HTML/CSS/React web pages from text prompts, style them with Tailwind, and deploy live.',
      keyTakeaways: [
        'Define layout structure and visual style in natural language.',
        'Iterate on components sequentially (Hero -> Features -> Testimonials -> Footer).',
        'Deploy directly using web runtime tools or GitHub Pages.'
      ],
      sections: [
        {
          heading: 'Step 1: Write a Clear Spec Prompt',
          text: 'Describe the purpose, color palette, navigation items, and target audience.',
          examplePrompt: `Build a modern dark-themed SaaS landing page for an AI podcast summarizer. Use navy blue (#0f172a), cyan accents (#06b6d4), and crisp typography. Include a sticky navbar, hero section with CTA, 3-card feature grid, pricing toggle, and footer.`
        },
        {
          heading: 'Step 2: Refine Visual Styling & Interactions',
          text: 'Ask the AI to add hover states, subtle gradient animations, and full mobile responsiveness.'
        }
      ],
      recommendedTools: ['v0.dev', 'Bolt.new', 'Cursor', 'AI Central Builder']
    }
  },
  {
    id: 'tutorial-create-images-ai',
    title: 'How to Create High-Quality Images & Art with AI',
    category: 'Practical AI Tutorials',
    difficulty: 'Beginner',
    readTime: '6 min',
    isBeginnerFriendly: true,
    filterTags: ['Beginner', 'Tutorials', 'Creativity'],
    shortDescription: 'Master camera angles, lighting prompts, art styles, and aspect ratios across Midjourney and DALL-E.',
    crossLink: {
      label: 'Compare top image generation tools',
      targetTab: 'comparison-engine',
      buttonText: 'Compare Image Tools'
    },
    content: {
      overview: 'Transform simple text descriptions into striking graphic designs, marketing imagery, or hyper-realistic photography.',
      keyTakeaways: [
        'Specify lighting: "cinematic volumetric lighting, golden hour shot".',
        'Specify camera lens: "85mm portrait lens, f/1.8 aperture, shallow depth of field".',
        'Specify aspect ratio: --ar 16:9 for landscape, --ar 9:16 for vertical.'
      ],
      sections: [
        {
          heading: 'Master Prompt Recipe for Visuals',
          text: 'Combine subject + environment + lighting + camera parameters:',
          examplePrompt: `Hyper-realistic close-up portrait of a futuristic female robot engineer working in a dimly lit neon cyberpunk workshop, volumetric cyan and blue neon lighting, shot on 35mm lens, 8k resolution, cinematic atmosphere --ar 16:9`
        }
      ],
      recommendedTools: ['Midjourney', 'DALL-E 3', 'Ideogram', 'Recraft']
    }
  },
  {
    id: 'tutorial-automate-tasks-ai',
    title: 'How to Automate Repetitive Office Tasks with AI',
    category: 'Practical AI Tutorials',
    difficulty: 'Intermediate',
    readTime: '7 min',
    filterTags: ['Intermediate', 'Tutorials', 'Business'],
    shortDescription: 'Connect spreadsheets, emails, and document summaries using no-code AI automation workflows.',
    crossLink: {
      label: 'Try our visual AI Workflow Builder',
      targetTab: 'workflow-builder',
      buttonText: 'Build a Workflow'
    },
    content: {
      overview: 'Stop spending hours manually copy-pasting data between emails and spreadsheets. Build automated background triggers.',
      keyTakeaways: [
        'Trigger: New incoming support email received.',
        'AI Action: Classify urgency & draft contextual reply.',
        'Output: Send draft to manager for 1-click approval.'
      ],
      sections: [
        {
          heading: 'Step-by-Step Workflow Blueprint',
          text: '1. Set up an email trigger in your workflow tool. 2. Pass body text to an LLM step with classification instructions. 3. Output formatted record to Google Sheets or Notion database.'
        }
      ],
      recommendedTools: ['Zapier AI', 'Make.com', 'n8n', 'AI Central Workflows']
    }
  }
];
