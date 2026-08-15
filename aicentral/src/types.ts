export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Enterprise' | 'Open Source';

export type PlatformType =
  | 'Browser Based'
  | 'Windows'
  | 'macOS'
  | 'Linux'
  | 'Android'
  | 'iOS'
  | 'Chrome Extension'
  | 'Discord'
  | 'VS Code Extension';

export interface OfficialLinks {
  website: string;
  documentation?: string;
  github?: string;
  discord?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  blog?: string;
  forum?: string;
}

export interface ToolReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  likes: number;
  badge?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export interface AITool {
  id: string;
  name: string;
  slug: string;
  logo: string;
  tagline: string;
  description: string;
  fullDescription: string;
  categories: string[];
  pricingType: PricingType;
  pricingDetails: string; // e.g., "Free plan available; Pro starts at $10/mo"
  rating: number; // e.g., 4.8
  reviewCount: number;
  viewsToday: number;
  totalViews: number;
  totalSavedCount?: number;
  trendingScore: number; // 1-100
  isFeatured?: boolean;
  isEditorsPick?: boolean;
  isNew?: boolean;
  isCommunityFavorite?: boolean;
  isWeeklyFeatured?: boolean;
  isToolOfDay?: boolean;
  supportedPlatforms: PlatformType[];
  apiAvailable: boolean;
  openSource: boolean;
  commercialLicense: boolean;
  offlineSupport: boolean;
  teamCollaboration: boolean;
  aiModelUsed: string; // e.g. "GPT-4o", "Claude 3.5 Sonnet", "Gemini 2.5", "Flux.1"
  officialLinks: OfficialLinks;
  screenshots: string[];
  demoVideoUrl?: string;
  pros: string[];
  cons: string[];
  alternatives: string[]; // Tool IDs or names
  tutorials: { title: string; url: string; duration: string }[];
  faqs: FAQItem[];
  changelog: ChangelogItem[];
  reviews: ToolReview[];
  lastUpdated: string; // YYYY-MM-DD
  languages: string[];
  integrations: string[];
  verified: boolean;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
  toolCount: number;
}

export interface FilterState {
  searchQuery: string;
  selectedTask?: string;
  selectedCategory: string; // 'All' or specific category
  pricingTypes: PricingType[];
  platforms: PlatformType[];
  openSourceOnly: boolean;
  apiAvailableOnly: boolean;
  commercialLicenseOnly: boolean;
  teamCollabOnly: boolean;
  offlineOnly: boolean;
  aiModelFilter: string;
  sortBy: 'trending' | 'popular' | 'rating' | 'newest' | 'updated';
}

export interface WorkflowStep {
  stepNumber: number;
  phaseName: string;
  recommendedTool: AITool;
  alternativeTools: AITool[];
  suggestedPrompt: string;
  estimatedTimeMinutes: number;
  estimatedCost: string;
}

export interface AIWorkflow {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  steps: WorkflowStep[];
  totalTimeSaved: string;
  totalCostEstimate: string;
}

export interface AIStackItem {
  tool: AITool;
  roleInStack: string; // e.g. "Primary Scriptwriter"
  monthlyCost: number; // numeric value for aggregation
}

export interface AIStack {
  id: string;
  title: string;
  targetRole: string;
  description: string;
  items: AIStackItem[];
  totalMonthlyCost: number;
}

export interface PromptItem {
  id: string;
  title: string;
  targetModel: 'ChatGPT' | 'Claude' | 'Gemini' | 'DeepSeek' | 'Perplexity' | 'Midjourney' | 'Flux' | 'Stable Diffusion' | 'DALL-E' | 'Sora' | 'Runway' | 'Llama' | 'TikTok' | 'General' | string;
  category: string;
  promptText: string;
  author: string;
  likes: number;
  price: number; // 0 for free
  rating: number;
  tags: string[];
  sampleOutputUrl?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
  content?: string;
  simpleExplanation?: string;
  examples?: string[];
  imageUrl?: string;
  videoUrl?: string;
  practicalTask?: string;
  promptExample?: string;
  quizQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface SkillCourse {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessonsCount: number;
  modulesCount: number;
  xpReward?: number;
  thumbnail: string;
  rating: number;
  enrolledCount: number;
  description: string;
  instructor: string;
  lessons: CourseLesson[];
  certificateUrl?: string;
}

export type CourseItem = SkillCourse;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'update' | 'price' | 'new_tool' | 'discount' | 'news';
  read: boolean;
  link?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  xpPoints?: number;
  level: number;
  streakDays: number;
  lastLoginDate: string;
  badges: { name: string; icon: string; description: string; unlockedAt?: string }[];
  favorites: string[]; // Tool IDs
  customCollections: { id: string; name: string; toolIds: string[] }[];
  viewedHistory: string[]; // Tool IDs
  purchasedPrompts: string[]; // Prompt IDs
}

export interface AdminAnalytics {
  totalTools: number;
  pendingApprovals: number;
  brokenLinksDetected: number;
  missingLogos: number;
  dailyViews: number;
  databaseHealth: 'Optimal' | 'Degraded' | 'Syncing';
  lastCrawlTimestamp: string;
}
