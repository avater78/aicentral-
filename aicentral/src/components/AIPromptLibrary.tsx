import React, { useState } from 'react';
import { 
  BookOpen, Copy, Check, Star, Sparkles, Plus, ShoppingBag, ExternalLink, Zap, 
  SlidersHorizontal, Search, Play, X, ArrowUpRight, Code, Megaphone, Palette, 
  PenTool, BarChart2, Share2, Layers, Compass, Video, Music, Rocket, GraduationCap, 
  RotateCcw, Cpu, Bot
} from 'lucide-react';
import { PromptItem } from '../types';
import { MOCK_PROMPTS } from '../data/mockPrompts';

interface AIPromptLibraryProps {
  userXP?: number;
  setUserXP?: React.Dispatch<React.SetStateAction<number>>;
  purchasedPrompts?: string[];
  setPurchasedPrompts?: React.Dispatch<React.SetStateAction<string[]>>;
}

const MODEL_URLS: Record<string, string> = {
  ChatGPT: 'https://chatgpt.com',
  Claude: 'https://claude.ai',
  Gemini: 'https://gemini.google.com',
  DeepSeek: 'https://chat.deepseek.com',
  Perplexity: 'https://www.perplexity.ai',
  Midjourney: 'https://www.midjourney.com',
  Flux: 'https://fal.ai/models/flux',
  'Stable Diffusion': 'https://dreamstudio.ai',
  'DALL-E': 'https://chatgpt.com/?model=dall-e',
  Sora: 'https://sora.com',
  Runway: 'https://runwayml.com',
  Llama: 'https://llama.meta.com',
  TikTok: 'https://www.tiktok.com',
  General: 'https://chatgpt.com',
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Coding': return <Code className="w-3.5 h-3.5" />;
    case 'Marketing': return <Megaphone className="w-3.5 h-3.5" />;
    case 'Design': return <Palette className="w-3.5 h-3.5" />;
    case 'Writing': return <PenTool className="w-3.5 h-3.5" />;
    case 'Data Analysis': return <BarChart2 className="w-3.5 h-3.5" />;
    case 'Social Media': return <Share2 className="w-3.5 h-3.5" />;
    case '3D': return <Layers className="w-3.5 h-3.5" />;
    case 'SEO': return <Compass className="w-3.5 h-3.5" />;
    case 'Video Generation': return <Video className="w-3.5 h-3.5" />;
    case 'Audio & Music': return <Music className="w-3.5 h-3.5" />;
    case 'Productivity': return <Rocket className="w-3.5 h-3.5" />;
    case 'Research': return <BookOpen className="w-3.5 h-3.5" />;
    case 'Education': return <GraduationCap className="w-3.5 h-3.5" />;
    default: return <Sparkles className="w-3.5 h-3.5" />;
  }
};

const getModelBadgeColor = (model: string) => {
  switch (model) {
    case 'ChatGPT': return 'from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30';
    case 'Claude': return 'from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30';
    case 'Gemini': return 'from-blue-500/20 to-indigo-500/10 text-blue-300 border-blue-500/30';
    case 'DeepSeek': return 'from-cyan-500/20 to-blue-500/10 text-cyan-300 border-cyan-500/30';
    case 'Perplexity': return 'from-teal-500/20 to-cyan-500/10 text-teal-300 border-teal-500/30';
    case 'Midjourney': return 'from-purple-500/20 to-pink-500/10 text-purple-300 border-purple-500/30';
    case 'Flux': return 'from-fuchsia-500/20 to-rose-500/10 text-fuchsia-300 border-fuchsia-500/30';
    case 'Stable Diffusion': return 'from-violet-500/20 to-purple-500/10 text-violet-300 border-violet-500/30';
    case 'DALL-E': return 'from-yellow-500/20 to-amber-500/10 text-yellow-300 border-yellow-500/30';
    case 'Sora': return 'from-red-500/20 to-rose-500/10 text-rose-300 border-rose-500/30';
    case 'Runway': return 'from-pink-500/20 to-purple-500/10 text-pink-300 border-pink-500/30';
    case 'Llama': return 'from-indigo-500/20 to-sky-500/10 text-sky-300 border-sky-500/30';
    case 'TikTok': return 'from-rose-500/20 to-cyan-500/10 text-rose-300 border-rose-500/30';
    default: return 'from-purple-500/20 to-cyan-500/10 text-cyan-300 border-purple-500/30';
  }
};

export const AIPromptLibrary: React.FC<AIPromptLibraryProps> = () => {
  const [promptsList, setPromptsList] = useState<PromptItem[]>(MOCK_PROMPTS);
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Customize/Test Modal State
  const [customizingPrompt, setCustomizingPrompt] = useState<PromptItem | null>(null);
  const [variableInputs, setVariableInputs] = useState<Record<string, string>>({});

  // Publish Prompt Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTargetModel, setNewTargetModel] = useState<string>('ChatGPT');
  const [newCategory, setNewCategory] = useState('Coding');
  const [newPromptText, setNewPromptText] = useState('');
  const [newPrice, setNewPrice] = useState(0);

  const modelsList = [
    'All',
    'ChatGPT',
    'Claude',
    'Gemini',
    'DeepSeek',
    'Perplexity',
    'Midjourney',
    'Flux',
    'Stable Diffusion',
    'DALL-E',
    'Sora',
    'Runway',
    'Llama',
    'TikTok',
    'General'
  ];

  const categoriesList = [
    'All',
    'Coding',
    'Marketing',
    'Design',
    'Writing',
    'Data Analysis',
    'Social Media',
    '3D',
    'SEO',
    'Video Generation',
    'Audio & Music',
    'Productivity',
    'Research',
    'Education'
  ];

  const getModelCount = (model: string) => {
    if (model === 'All') return promptsList.length;
    return promptsList.filter((p) => p.targetModel === model).length;
  };

  const getCategoryCount = (category: string) => {
    if (category === 'All') return promptsList.length;
    return promptsList.filter((p) => p.category === category).length;
  };

  const filteredPrompts = promptsList.filter((p) => {
    const matchesModel = selectedModel === 'All' || p.targetModel === selectedModel;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesModel && matchesCategory && matchesQuery;
  });

  const handleCopyPrompt = (p: PromptItem, textToCopy?: string) => {
    const text = textToCopy || p.promptText;
    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAndLaunch = (p: PromptItem, textToCopy?: string) => {
    const text = textToCopy || p.promptText;
    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);

    const targetUrl = MODEL_URLS[p.targetModel] || 'https://chatgpt.com';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const openCustomizer = (p: PromptItem) => {
    setCustomizingPrompt(p);
    const matches = p.promptText.match(/\[(.*?)\]/g) || [];
    const initialInputs: Record<string, string> = {};
    matches.forEach((m) => {
      initialInputs[m] = '';
    });
    setVariableInputs(initialInputs);
  };

  const getCustomizedText = (p: PromptItem) => {
    let result = p.promptText;
    Object.entries(variableInputs).forEach(([key, val]) => {
      const stringVal = String(val || '');
      if (stringVal.trim()) {
        result = result.replaceAll(key, stringVal.trim());
      }
    });
    return result;
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPromptText.trim()) return;

    const added: PromptItem = {
      id: `p-${Date.now()}`,
      title: newTitle.trim(),
      targetModel: newTargetModel,
      category: newCategory,
      promptText: newPromptText.trim(),
      author: 'You (AI Creator)',
      likes: 1,
      price: 0,
      rating: 5.0,
      tags: [newTargetModel, newCategory]
    };

    setPromptsList([added, ...promptsList]);
    setShowUploadModal(false);
    setNewTitle('');
    setNewPromptText('');
    setNewPrice(0);
  };

  const isFiltered = selectedModel !== 'All' || selectedCategory !== 'All' || searchQuery !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 sm:p-8 border border-purple-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold text-xs tracking-wider uppercase">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Master Prompt Library</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Engineered Prompts for Every <span className="text-cyan-400">AI Workflow</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Copy, customize, and launch production-ready prompts directly into ChatGPT, Claude, Gemini, Midjourney, and leading AI models.
          </p>
        </div>
      </div>

      {/* Filter & Search Control Panel */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/20 shadow-2xl space-y-4 backdrop-blur-md">
        
        {/* Search Bar & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, model, tag, or topic..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-bold">
                {filteredPrompts.length} Prompts Found
              </span>
            </div>

            {isFiltered && (
              <button
                onClick={() => {
                  setSelectedModel('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}


          </div>
        </div>

        {/* AI Model Selector Pills - Moderate & Simple Styling */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Model</span>
            </span>
            {selectedModel !== 'All' && (
              <span className="text-[11px] text-slate-400">
                Active: <strong className="text-cyan-300 font-semibold">{selectedModel}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
            {modelsList.map((m) => {
              const count = getModelCount(m);
              const isSelected = selectedModel === m;

              return (
                <button
                  key={m}
                  onClick={() => setSelectedModel(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-sm'
                      : 'bg-slate-950/80 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <Bot className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`} />
                  <span>{m}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                    isSelected ? 'bg-cyan-950/80 text-cyan-300' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter Tabs - Moderate & Simple Styling */}
        <div className="space-y-2 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              <span>Category</span>
            </span>
            {selectedCategory !== 'All' && (
              <span className="text-[11px] text-slate-400">
                Active: <strong className="text-purple-300 font-semibold">{selectedCategory}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
            {categoriesList.map((c) => {
              const count = getCategoryCount(c);
              const isSelected = selectedCategory === c;

              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-purple-500/20 text-purple-200 border-purple-500/40 shadow-sm'
                      : 'bg-slate-950/80 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {getCategoryIcon(c)}
                  <span>{c}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                    isSelected ? 'bg-purple-950/80 text-purple-300' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Publish Prompt Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUploadSubmit} className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Share Prompt to Marketplace</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Prompt Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Ultimate React & TypeScript Refactoring Agent"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Target AI Model</label>
                  <select
                    value={newTargetModel}
                    onChange={(e) => setNewTargetModel(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    {modelsList.filter((m) => m !== 'All').map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    {categoriesList.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Prompt Instructions / Text</label>
                <textarea
                  required
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  placeholder="Enter system instructions. Tip: Use bracket placeholders like [YOUR CODE] or [TOPIC] for easy variables..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-slate-950 font-extrabold text-xs hover:scale-105 transition-transform cursor-pointer"
              >
                Publish Prompt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Prompt Customizer / Test Modal */}
      {customizingPrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl p-6 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {customizingPrompt.targetModel}
                </span>
                <h3 className="text-base font-extrabold text-slate-100 mt-1">{customizingPrompt.title}</h3>
              </div>
              <button
                onClick={() => setCustomizingPrompt(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Variable Inputs */}
            {Object.keys(variableInputs).length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Customize Prompt Variables:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(variableInputs).map((varKey) => (
                    <div key={varKey}>
                      <label className="block text-[11px] font-mono text-purple-300 mb-1">{varKey}</label>
                      <input
                        type="text"
                        value={variableInputs[varKey]}
                        onChange={(e) => setVariableInputs({ ...variableInputs, [varKey]: e.target.value })}
                        placeholder={`Enter ${varKey.replace(/[[\]]/g, '')}...`}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compiled Output Preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Final Prompt Preview:</label>
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 font-mono text-xs text-cyan-200 leading-relaxed whitespace-pre-wrap select-all">
                {getCustomizedText(customizingPrompt)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleCopyPrompt(customizingPrompt, getCustomizedText(customizingPrompt))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === customizingPrompt.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleCopyAndLaunch(customizingPrompt, getCustomizedText(customizingPrompt))}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Copy & Launch in {customizingPrompt.targetModel}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Cards Grid */}
      {filteredPrompts.length === 0 ? (
        <div className="py-16 text-center text-slate-400 space-y-3 bg-slate-900/40 rounded-2xl border border-purple-500/10">
          <p className="text-sm font-semibold">No prompt templates found matching your filters.</p>
          <button
            onClick={() => {
              setSelectedModel('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPrompts.map((p) => {
            const hasVariables = /\[(.*?)\]/.test(p.promptText);

            return (
              <div key={p.id} className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/20 hover:border-purple-500/50 shadow-xl space-y-3 flex flex-col justify-between group transition-all">
                
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {p.targetModel}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">{p.category}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{p.rating.toFixed(1)}</span>
                      <span className="text-slate-500">({p.likes})</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-extrabold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {p.title}
                  </h3>

                  {/* Sample Image Preview if Midjourney or SD */}
                  {p.sampleOutputUrl && (
                    <img src={p.sampleOutputUrl} alt={p.title} className="w-full h-36 object-cover rounded-xl border border-slate-800" />
                  )}

                  {/* Prompt Text Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 relative">
                    <code className="text-xs text-cyan-200 font-mono block select-all whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                      {p.promptText}
                    </code>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-purple-500/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400 text-[11px]">By {p.author}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyPrompt(p)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedId === p.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopyAndLaunch(p)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold flex items-center gap-1.5 shadow-md transition-all hover:scale-105 cursor-pointer"
                      title={`Copy and open in ${p.targetModel}`}
                    >
                      <span>Open in {p.targetModel}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

