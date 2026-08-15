import { AITool, PricingType, PlatformType } from '../types';

const CATEGORIES_SPEC = [
  { name: 'Writing', roots: ['Scribe', 'Pen', 'Draft', 'Ink', 'Writer', 'Script', 'Word', 'Copy', 'Story', 'Text'], tagline: 'AI writing assistant and copy generator' },
  { name: 'Image Generation', roots: ['Art', 'Canvas', 'Render', 'Pixel', 'Vision', 'Draw', 'Frame', 'Studio', 'Diffusion', 'Gen'], tagline: 'Text-to-image AI generator and photo studio' },
  { name: 'Video Creation', roots: ['Reel', 'Motion', 'Film', 'Video', 'Clip', 'Stream', 'Scene', 'Cinema', 'Animate'], tagline: 'Generative AI video creator and editor' },
  { name: 'Music', roots: ['Beat', 'Tune', 'Track', 'Harmonix', 'Sound', 'Melody', 'Audio', 'Sonic', 'Rhythm'], tagline: 'AI music composition and soundtrack engine' },
  { name: 'Audio', roots: ['Voice', 'Sound', 'Sonic', 'Mic', 'Wave', 'Acoustic', 'Vocal', 'Echo', 'Clean'], tagline: 'AI audio enhancement and voice editing suite' },
  { name: 'Coding', roots: ['Code', 'Dev', 'Script', 'Build', 'Stack', 'Syntax', 'Compile', 'Terminal', 'Git', 'Coder'], tagline: 'AI coding assistant, auto-complete and refactoring' },
  { name: 'Marketing', roots: ['Reach', 'Ad', 'Campaign', 'Convert', 'Lead', 'Growth', 'Scale', 'Market', 'Funnel'], tagline: 'AI marketing copy, ad optimizer, and growth bot' },
  { name: 'Design', roots: ['UI', 'Layout', 'Craft', 'Design', 'Prototype', 'Vector', 'UX', 'Palette', 'Style'], tagline: 'AI graphic design and web UI layout generator' },
  { name: 'Productivity', roots: ['Task', 'Flow', 'Focus', 'Plan', 'Organize', 'Do', 'Sync', 'Workspace', 'Note'], tagline: 'AI productivity workspace, note-taker and task planner' },
  { name: 'Education', roots: ['Tutor', 'Learn', 'Study', 'Academy', 'Scholar', 'Brain', 'Edu', 'Quiz', 'Lesson'], tagline: 'AI personalized tutor and study companion' },
  { name: 'Business', roots: ['Biz', 'Corp', 'Strategy', 'Venture', 'Suite', 'Ops', 'Exec', 'Enterprise', 'BizOps'], tagline: 'AI business strategy, pitch deck and ops platform' },
  { name: 'Finance', roots: ['Pay', 'Ledger', 'Trade', 'Audit', 'Cash', 'Finance', 'Capital', 'Vault', 'Tax'], tagline: 'AI financial forecasting, accounting, and budgeting' },
  { name: 'Healthcare', roots: ['Med', 'Health', 'Care', 'Doc', 'Clinical', 'Pulse', 'Bio', 'Cure', 'Diag'], tagline: 'AI medical assistant, clinical summaries, and diagnostics' },
  { name: 'Legal', roots: ['Juris', 'Lex', 'Legal', 'Clause', 'Brief', 'Counsel', 'Court', 'Doc', 'Claim'], tagline: 'AI legal research, contract audit and drafting' },
  { name: 'Research', roots: ['Scholar', 'Paper', 'Search', 'Cite', 'Find', 'Lab', 'Insight', 'Query', 'Discovery'], tagline: 'AI academic literature review and research synthesis' },
  { name: 'Data Analysis', roots: ['Data', 'Metric', 'Chart', 'Query', 'Analyze', 'Graph', 'Pivot', 'Stats', 'Insight'], tagline: 'AI data analyst, SQL assistant and chart generator' },
  { name: 'Automation', roots: ['Auto', 'Flow', 'Bot', 'Zap', 'Agent', 'Pipe', 'Task', 'Action', 'Workflow'], tagline: 'AI workflow automation and autonomous agent runner' },
  { name: 'SEO', roots: ['SERP', 'Rank', 'Keyword', 'SEO', 'Search', 'Traffic', 'Index', 'Opti', 'Link'], tagline: 'AI search engine optimization and keyword planner' },
  { name: 'Social Media', roots: ['Social', 'Post', 'Feed', 'Share', 'Caption', 'Engage', 'Story', 'Viral', 'Reel'], tagline: 'AI social media content scheduler and viral caption writer' },
  { name: 'Chatbots', roots: ['Chat', 'Bot', 'Agent', 'Talk', 'Assistant', 'Convo', 'Reply', 'Prompt', 'Persona'], tagline: 'Conversational AI chatbot and custom agent platform' },
  { name: 'Translation', roots: ['Lingua', 'Translate', 'Poly', 'Global', 'Babel', 'Lang', 'Dub', 'Voice', 'Local'], tagline: 'AI real-time translation and multilingual dubbing' },
  { name: 'Voice', roots: ['Speech', 'Vocal', 'Voice', 'Talk', 'Speak', 'Dub', 'Accent', 'Tone', 'TTS'], tagline: 'AI text-to-speech and custom voice cloning studio' },
  { name: '3D', roots: ['3D', 'Mesh', 'Poly', 'Model', 'Sculpt', 'NeRF', 'Texture', 'Render', 'Spatial'], tagline: 'AI text-to-3D mesh generator and texture renderer' },
  { name: 'Architecture', roots: ['Arch', 'Draft', 'BIM', 'Plan', 'Space', 'Build', 'Cad', 'Structure', 'Interior'], tagline: 'AI architectural floorplan and interior render generator' },
  { name: 'Gaming', roots: ['Game', 'NPC', 'World', 'Quest', 'Asset', 'Sprite', 'Engine', 'Play', 'Level'], tagline: 'AI game asset generator, NPC dialogue, and level designer' },
  { name: 'E-commerce', roots: ['Shop', 'Store', 'Cart', 'Sell', 'Merch', 'Trade', 'Buy', 'Product', 'Listing'], tagline: 'AI e-commerce product writer and conversion booster' },
  { name: 'Customer Support', roots: ['Support', 'Help', 'Desk', 'Ticket', 'Care', 'Resolve', 'Assist', 'Serv', 'Reply'], tagline: 'AI customer support helpdesk and auto-responder bot' },
  { name: 'Cybersecurity', roots: ['Shield', 'Guard', 'Sec', 'Cyber', 'Defend', 'Vault', 'Lock', 'Scan', 'Audit'], tagline: 'AI threat detection, vulnerability scanner, and defense' },
  { name: 'HR', roots: ['Hire', 'Talent', 'Recruit', 'People', 'HR', 'Staff', 'Team', 'Resume', 'Match'], tagline: 'AI recruitment assistant, resume screener, and HR bot' },
  { name: 'Sales', roots: ['Sales', 'Deal', 'Pipeline', 'Close', 'Lead', 'Pitch', 'Quota', 'Revenue', 'Outreach'], tagline: 'AI sales outreach, cold email writer, and pipeline engine' }
];

const PREFIXES = [
  'Omni', 'Neura', 'Synth', 'Vocal', 'Flow', 'Mind', 'Prompt', 'Data', 'Cyber', 'Docu',
  'Kroma', 'Hyper', 'Deep', 'Logic', 'Pulse', 'Zen', 'Aura', 'Nova', 'Vivid', 'Apex',
  'Clarity', 'Sphere', 'Nexus', 'Matrix', 'Echo', 'Atlas', 'Vector', 'Optima', 'Vision', 'Aether',
  'Core', 'Glide', 'Quantum', 'Velox', 'Signal', 'Spark', 'Orbit', 'Pixel', 'Starlight', 'Cortex',
  'Aether', 'Aero', 'Zeta', 'Prism', 'Lumina', 'Veritas', 'Cogni', 'Flux', 'Vortex', 'Kinetix'
];

const SUFFIXES = ['AI', 'Pro', 'Studio', 'Labs', 'Engine', 'Hub', 'Flow', 'Bot', 'X', 'Copilot', 'Mind', 'Gen', 'IQ', 'Pulse'];

const LOGO_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=128&q=80'
];

const PRICING_TYPES: PricingType[] = ['Freemium', 'Free', 'Paid', 'Enterprise', 'Open Source'];
const PLATFORMS: PlatformType[] = ['Browser Based', 'Windows', 'macOS', 'Linux', 'Android', 'iOS', 'Chrome Extension'];
const AI_MODELS = ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'Llama 3.1 405B', 'FLUX.1 Dev', 'Custom Fine-tuned LLM', 'Mistral Large 2', 'DeepSeek-V2'];

function generateSingleTool(index: number): AITool {
  const catSpec = CATEGORIES_SPEC[index % CATEGORIES_SPEC.length];
  const prefix = PREFIXES[(index * 7 + index % 11) % PREFIXES.length];
  const root = catSpec.roots[(index + (index % 5)) % catSpec.roots.length];
  const suffix = SUFFIXES[(index * 3) % SUFFIXES.length];
  
  const name = `${prefix} ${root} ${suffix}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const id = `generated-tool-${index + 1}`;
  
  const logo = LOGO_IMAGES[index % LOGO_IMAGES.length];
  const pricingType = PRICING_TYPES[(index * 13) % PRICING_TYPES.length];
  const rating = Number((4.3 + (index % 7) * 0.1).toFixed(1));
  const reviewCount = 200 + ((index * 37) % 8500);
  const viewsToday = 500 + ((index * 73) % 12000);
  const totalViews = 25000 + ((index * 911) % 1800000);
  const trendingScore = 70 + (index % 28);
  const isFeatured = index % 18 === 0;
  
  const supportedPlatforms: PlatformType[] = [
    'Browser Based',
    ...(index % 2 === 0 ? ['macOS' as PlatformType, 'Windows' as PlatformType] : []),
    ...(index % 5 === 0 ? ['iOS' as PlatformType, 'Android' as PlatformType] : []),
    ...(index % 7 === 0 ? ['Chrome Extension' as PlatformType] : [])
  ];

  const secondaryCatIndex = (index + 3) % CATEGORIES_SPEC.length;
  const categories = Array.from(new Set([catSpec.name, CATEGORIES_SPEC[secondaryCatIndex].name]));

  return {
    id,
    name,
    slug,
    logo,
    tagline: `${catSpec.tagline} with intelligent automation`,
    description: `${name} provides automated ${catSpec.name.toLowerCase()} solutions tailored for creative professionals and high-performance teams.`,
    fullDescription: `${name} empowers creators, engineers, and businesses by integrating modern machine learning models to streamline ${catSpec.name.toLowerCase()} workflows. Featuring intuitive visual controls, API integration, and enterprise-grade data security.`,
    categories,
    pricingType,
    pricingDetails: pricingType === 'Free' ? '100% Free with no hidden charges' : pricingType === 'Freemium' ? 'Free tier with upgrades from $9/mo' : 'Plans starting at $15/month',
    rating,
    reviewCount,
    viewsToday,
    totalViews,
    trendingScore,
    isFeatured,
    supportedPlatforms,
    apiAvailable: index % 2 === 0,
    openSource: pricingType === 'Open Source' || index % 11 === 0,
    commercialLicense: true,
    offlineSupport: index % 9 === 0,
    teamCollaboration: index % 3 === 0,
    aiModelUsed: AI_MODELS[index % AI_MODELS.length],
    officialLinks: {
      website: `https://${slug}.ai`,
      github: index % 4 === 0 ? `https://github.com/tools/${slug}` : undefined,
      twitter: `https://x.com/${slug}`
    },
    screenshots: [logo],
    pros: [
      `Ultra-fast ${catSpec.name.toLowerCase()} generation`,
      'Intuitive and modern browser UI',
      'Extensive integration options'
    ],
    cons: [
      'High-throughput export requires pro subscription'
    ],
    alternatives: ['ChatGPT', 'Claude 3.5 Sonnet', 'Perplexity'],
    tutorials: [
      { title: `Getting Started with ${name}`, url: 'https://youtube.com', duration: '8m' }
    ],
    faqs: [
      { question: `How does ${name} handle data privacy?`, answer: 'All workspace data is encrypted using AES-256 standards.' }
    ],
    changelog: [
      { version: 'v2.0', date: '2026-07-10', title: 'Performance Upgrade', changes: ['Enhanced processing speed by 40%'] }
    ],
    reviews: [
      {
        id: `rev-${index}-1`,
        userName: 'Alex Dev',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64',
        rating: 5,
        comment: `Incredible efficiency booster for our ${catSpec.name.toLowerCase()} stack!`,
        date: '2026-07-28',
        likes: 24
      }
    ],
    lastUpdated: '2026-08-01',
    languages: ['English', 'Spanish', 'German'],
    integrations: ['REST API', 'Zapier', 'Webhooks'],
    verified: true
  };
}

export function generateFullToolsCatalog(existingToolsCount: number, targetTotalCount: number = 1500): AITool[] {
  const needed = targetTotalCount - existingToolsCount;
  const generated: AITool[] = [];
  for (let i = 0; i < needed; i++) {
    generated.push(generateSingleTool(i));
  }
  return generated;
}
