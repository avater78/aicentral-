import React, { useState, useMemo } from 'react';
import { AIAcademyBackground } from './AIAcademyBackground';
import { ACADEMY_LESSONS, AcademyLesson } from '../data/academyData';
import { MOCK_BENCHMARKS, MOCK_BLUEPRINTS, ArchitectureBlueprint } from '../data/benchmarkData';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Star, 
  ChevronRight, 
  ArrowRight, 
  X, 
  Copy, 
  Check, 
  PlayCircle, 
  ShieldCheck, 
  Cpu, 
  Calculator, 
  Layers, 
  ExternalLink, 
  Award, 
  Users, 
  Lightbulb, 
  Filter, 
  Share2, 
  Code2, 
  BarChart3, 
  Briefcase, 
  Wand2, 
  HelpCircle,
  Video,
  FileText,
  Workflow
} from 'lucide-react';

interface AIBenchmarksProps {
  onNavigateTab?: (tab: string) => void;
}

export const AIBenchmarks: React.FC<AIBenchmarksProps> = ({ onNavigateTab }) => {
  // Navigation State
  const [activeNav, setActiveNav] = useState<'home' | 'learn' | 'tutorials' | 'topics' | 'tools' | 'beginner' | 'specs'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFilterTag, setSelectedFilterTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected Lesson for Reading Modal
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);

  // Specs & Benchmarks Sub-Tab State
  const [specSubTab, setSpecSubTab] = useState<'benchmarks' | 'blueprints' | 'calculator'>('benchmarks');
  const [sortBy, setSortBy] = useState<'coding' | 'reasoning' | 'speed' | 'price'>('coding');
  const [copiedBlueprintId, setCopiedBlueprintId] = useState<string | null>(null);

  // Calculator State
  const [inputTokens, setInputTokens] = useState<number>(2000000);
  const [outputTokens, setOutputTokens] = useState<number>(500000);

  // Filter Categories list
  const categoryList = [
    'All',
    'Start Here',
    'Prompt Engineering',
    'AI Tools',
    'AI For Creators',
    'AI for Work & Business',
    'AI Concepts',
    'Practical AI Tutorials'
  ];

  // Filter Tags list
  const filterTagList = [
    'All',
    'Beginner',
    'Intermediate',
    'Advanced',
    'Tutorials',
    'Guides',
    'Concepts',
    'Tools',
    'Prompts',
    'Business',
    'Creativity'
  ];

  // Filter Lessons
  const filteredLessons = useMemo(() => {
    return ACADEMY_LESSONS.filter((lesson) => {
      // Nav sub-tab filter
      if (activeNav === 'beginner' && !lesson.isBeginnerFriendly && lesson.category !== 'Start Here') return false;
      if (activeNav === 'tutorials' && lesson.category !== 'Practical AI Tutorials') return false;
      if (activeNav === 'tools' && lesson.category !== 'AI Tools') return false;
      if (activeNav === 'topics' && !['AI Concepts', 'Prompt Engineering', 'AI for Work & Business'].includes(lesson.category)) return false;

      // Category Chip filter
      if (selectedCategory !== 'All' && lesson.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Filter Tag filter
      if (selectedFilterTag !== 'All') {
        const matchesDifficulty = lesson.difficulty.toLowerCase() === selectedFilterTag.toLowerCase();
        const matchesTag = lesson.filterTags.some(t => t.toLowerCase() === selectedFilterTag.toLowerCase());
        if (!matchesDifficulty && !matchesTag) return false;
      }

      // Search Query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = lesson.title.toLowerCase().includes(query);
        const matchesDesc = lesson.shortDescription.toLowerCase().includes(query);
        const matchesCategory = lesson.category.toLowerCase().includes(query);
        const matchesTag = lesson.filterTags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesTag) return false;
      }

      return true;
    });
  }, [activeNav, selectedCategory, selectedFilterTag, searchQuery]);

  // Popular Lessons
  const popularLessons = useMemo(() => {
    return ACADEMY_LESSONS.filter(l => l.isPopularThisWeek);
  }, []);

  // Beginner Start Lessons
  const beginnerStartLessons = useMemo(() => {
    return ACADEMY_LESSONS.filter(l => l.isStartWithThese || l.category === 'Start Here');
  }, []);

  const handleCopyConfig = (blueprint: ArchitectureBlueprint) => {
    navigator.clipboard.writeText(blueprint.configSnippet);
    setCopiedBlueprintId(blueprint.id);
    setTimeout(() => setCopiedBlueprintId(null), 2000);
  };

  const handleCrossLinkNavigation = (targetTab?: string) => {
    if (targetTab && onNavigateTab) {
      setSelectedLesson(null);
      onNavigateTab(targetTab);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050B1A] text-slate-100 py-6 px-3 sm:px-6 lg:px-8 space-y-8 rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl">
      
      {/* 🌌 ANIMATED NEURAL PARTICLE CANVAS BACKGROUND */}
      <AIAcademyBackground />

      {/* ---------------------------------------------------- */}
      {/* 🌟 HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-6 pt-2">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide shadow-lg shadow-cyan-500/10">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>AI Central Academy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Learn AI. Use AI. <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Build With AI.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Practical guides, tutorials, and lessons to help you understand AI and get more from the tools you use every day.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveNav('learn');
                const el = document.getElementById('academy-content-area');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xl shadow-cyan-500/20 hover:scale-105 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 fill-current" />
              <span>Start Learning</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('topics');
                const el = document.getElementById('academy-content-area');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all backdrop-blur-md cursor-pointer"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Explore Topics</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 🧭 SECONDARY ACADEMY NAVIGATION BAR */}
        {/* ---------------------------------------------------- */}
        <div className="flex items-center justify-center pt-2">
          <nav className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-md shadow-xl">
            {[
              { id: 'home', label: 'Academy Home', icon: GraduationCap },
              { id: 'learn', label: 'Learn', icon: BookOpen },
              { id: 'tutorials', label: 'Tutorials', icon: PlayCircle },
              { id: 'topics', label: 'Topics', icon: Layers },
              { id: 'tools', label: 'Tools', icon: Zap },
              { id: 'beginner', label: 'Beginner Start', icon: Sparkles, badge: 'Easy' },
              { id: 'specs', label: 'Model Specs', icon: BarChart3, badge: 'Specs' }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id as any);
                    setSelectedCategory('All');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-slate-950 text-cyan-300' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 🔍 SEARCH ACADEMY BAR */}
        <div className="max-w-2xl mx-auto relative pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-cyan-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI lessons, tutorials, and topics..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-md shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 🌟 FEATURED LEARNING (HOMEPAGE TOP HIGHLIGHTS) */}
      {/* ---------------------------------------------------- */}
      {activeNav === 'home' && searchQuery === '' && (
        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          
          {/* 1. START WITH THESE (BEGINNER ESSENTIALS) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Start With These</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-extrabold uppercase">
                  Beginner Essentials
                </span>
              </div>
              <button
                onClick={() => setActiveNav('beginner')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>View All Beginner Lessons</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {beginnerStartLessons.slice(0, 3).map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-amber-500/30 hover:border-amber-400/60 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 group cursor-pointer backdrop-blur-md relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                        {lesson.category}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lesson.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {lesson.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {lesson.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Beginner Friendly
                    </span>
                    <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Start Reading</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. POPULAR THIS WEEK */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Popular This Week</h2>
              </div>
              <button
                onClick={() => setActiveNav('learn')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Browse All Lessons</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularLessons.slice(0, 4).map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 group cursor-pointer backdrop-blur-md"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                        {lesson.category}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                        {lesson.difficulty}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {lesson.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {lesson.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> {lesson.readTime}
                    </span>
                    <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Read</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 📚 MAIN ACADEMY CONTENT & LESSON CARDS GRID */}
      {/* ---------------------------------------------------- */}
      {activeNav !== 'specs' && (
        <div id="academy-content-area" className="relative z-10 max-w-7xl mx-auto space-y-6 pt-2">
          
          {/* Filter Chips Bar */}
          <div className="flex flex-col gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Categories:
              </span>
              {categoryList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tag / Difficulty Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-slate-800/80 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filters:
              </span>
              {filterTagList.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedFilterTag(tag)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedFilterTag === tag
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing <strong className="text-slate-200">{filteredLessons.length}</strong> AI lessons & tutorials</span>
            {(selectedCategory !== 'All' || selectedFilterTag !== 'All' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedFilterTag('All');
                  setSearchQuery('');
                }}
                className="text-cyan-400 hover:underline cursor-pointer font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Lessons Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 group backdrop-blur-md"
              >
                <div className="space-y-3">
                  {/* Category & Badges Header */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase tracking-wider">
                      {lesson.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {lesson.isBeginnerFriendly && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold">
                          Beginner
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 font-medium">
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {lesson.shortDescription}
                  </p>

                  {/* Filter Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {lesson.filterTags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer & Read Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> {lesson.readTime}
                  </span>

                  <button
                    onClick={() => setSelectedLesson(lesson)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/10"
                  >
                    <span>Start / Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <p className="text-slate-300 font-semibold text-sm">No lessons found matching your filters or search criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedFilterTag('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 📊 OPTIONAL TAB: MODEL SPECS & CALCULATOR */}
      {/* ---------------------------------------------------- */}
      {activeNav === 'specs' && (
        <div className="relative z-10 max-w-7xl mx-auto space-y-6 pt-2">
          
          {/* Sub Tab Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSpecSubTab('benchmarks')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  specSubTab === 'benchmarks' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Model Benchmarks
              </button>

              <button
                onClick={() => setSpecSubTab('blueprints')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  specSubTab === 'blueprints' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Architecture Blueprints
              </button>

              <button
                onClick={() => setSpecSubTab('calculator')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  specSubTab === 'calculator' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Token Cost Calculator
              </button>
            </div>

            {specSubTab === 'benchmarks' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="coding">Highest Coding Score</option>
                  <option value="reasoning">Highest Reasoning Score</option>
                  <option value="speed">Fastest Speed (TPS)</option>
                  <option value="price">Lowest Price</option>
                </select>
              </div>
            )}
          </div>

          {/* Benchmarks List */}
          {specSubTab === 'benchmarks' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_BENCHMARKS.map((model) => (
                <div key={model.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{model.name}</h3>
                      <span className="text-xs text-slate-400">By {model.provider}</span>
                    </div>
                    {model.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                        {model.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{model.description}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Coding Score:</span>
                      <strong className="text-cyan-400">{model.scores.coding}%</strong>
                    </div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Reasoning (MMLU):</span>
                      <strong className="text-purple-400">{model.scores.reasoning}%</strong>
                    </div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Speed:</span>
                      <strong className="text-emerald-400">{model.scores.speedTps} tps</strong>
                    </div>
                  </div>

                  <a
                    href={model.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Official Specs</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Blueprints */}
          {specSubTab === 'blueprints' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {MOCK_BLUEPRINTS.map((bp) => (
                <div key={bp.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
                  <div className="space-y-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold uppercase">{bp.category}</span>
                    <h3 className="text-base font-bold text-white">{bp.title}</h3>
                  </div>

                  <p className="text-xs text-slate-300">{bp.description}</p>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Starter Config</span>
                      <button onClick={() => handleCopyConfig(bp)} className="text-cyan-400 flex items-center gap-1 text-[11px]">
                        {copiedBlueprintId === bp.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-32">
                      {bp.configSnippet}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Calculator */}
          {specSubTab === 'calculator' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 backdrop-blur-md">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <span>Monthly AI Token API Cost Estimator</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200">Monthly Input Tokens: {(inputTokens/1000000).toFixed(1)}M</label>
                  <input type="range" min={100000} max={50000000} step={100000} value={inputTokens} onChange={(e) => setInputTokens(Number(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200">Monthly Output Tokens: {(outputTokens/1000000).toFixed(1)}M</label>
                  <input type="range" min={50000} max={10000000} step={50000} value={outputTokens} onChange={(e) => setOutputTokens(Number(e.target.value))} className="w-full accent-purple-500 cursor-pointer" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Model</th>
                      <th className="p-3">Input Cost</th>
                      <th className="p-3">Output Cost</th>
                      <th className="p-3">Total Monthly Est.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {MOCK_BENCHMARKS.filter(m => m.inputPricePer1M > 0).map((m) => {
                      const grandTotal = ((inputTokens / 1000000) * m.inputPricePer1M) + ((outputTokens / 1000000) * m.outputPricePer1M);
                      return (
                        <tr key={m.id} className="hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-white">{m.name}</td>
                          <td className="p-3">${((inputTokens / 1000000) * m.inputPricePer1M).toFixed(2)}</td>
                          <td className="p-3">${((outputTokens / 1000000) * m.outputPricePer1M).toFixed(2)}</td>
                          <td className="p-3 font-extrabold text-cyan-300">${grandTotal.toFixed(2)} / mo</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 📖 INTERACTIVE LESSON READING OVERLAY MODAL */}
      {/* ---------------------------------------------------- */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a0f24] border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8 space-y-6 shadow-2xl relative custom-scrollbar">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedLesson(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                  {selectedLesson.category}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                  {selectedLesson.difficulty}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> {selectedLesson.readTime} read
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {selectedLesson.title}
              </h2>
            </div>

            {/* Overview Box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-cyan-400" /> Lesson Overview
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedLesson.content.overview}
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Key Takeaways
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedLesson.content.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lesson Sections */}
            <div className="space-y-6 pt-2">
              {selectedLesson.content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center font-extrabold shrink-0 border border-cyan-500/30">
                      {idx + 1}
                    </span>
                    <span>{sec.heading}</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {sec.text}
                  </p>

                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <ul className="space-y-1 pl-3 text-xs text-slate-300 list-disc list-inside">
                      {sec.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx}>{bp}</li>
                      ))}
                    </ul>
                  )}

                  {sec.examplePrompt && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                        <Wand2 className="w-3.5 h-3.5 text-amber-400" /> Example Prompt Recipe
                      </span>
                      <pre className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-xs font-mono text-amber-200 whitespace-pre-wrap leading-relaxed">
                        {sec.examplePrompt}
                      </pre>
                    </div>
                  )}

                  {sec.proTip && (
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-cyan-300 font-bold mb-0.5">Pro Tip:</strong>
                        <span>{sec.proTip}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recommended Tools */}
            {selectedLesson.content.recommendedTools && selectedLesson.content.recommendedTools.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300">Recommended Tools for this Topic:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedLesson.content.recommendedTools.map((toolName) => (
                    <span key={toolName} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300">
                      {toolName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions & Cross Links */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Smart Cross-Link to AI Central feature */}
              {selectedLesson.crossLink ? (
                <button
                  onClick={() => handleCrossLinkNavigation(selectedLesson.crossLink?.targetTab)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{selectedLesson.crossLink.buttonText}</span>
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={() => setSelectedLesson(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Done Reading
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
