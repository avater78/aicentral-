import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Zap, HelpCircle, Loader2, ExternalLink, Globe } from 'lucide-react';
import { AITool } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AIMatchFinderProps {
  allTools: AITool[];
  onSelectTool: (tool: AITool) => void;
}

interface MatchResult {
  name: string;
  matchScore: number;
  reasoning: string;
  recommendedPrompt: string;
  websiteUrl?: string;
}

export const AIMatchFinder: React.FC<AIMatchFinderProps> = ({ allTools, onSelectTool }) => {
  const { t } = useLanguage();
  const [taskDescription, setTaskDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const sampleTasks = [
    'I want to automatically generate code unit tests and document TypeScript interfaces',
    'I need to dub my 10-minute YouTube videos into Spanish with voice cloning',
    'Generate photorealistic product images for a mechanical keyboard ecommerce brand',
    'Summarize 50 PDF research papers and create cited literature matrices'
  ];

  const handleMatchFind = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDescription.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch('/api/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskDescription, category, budget })
      });
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error('Match finder error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>Gemini 3.6 Powered Smart Matcher</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-100">{t('match')}</h2>
        <p className="mt-2 text-sm text-slate-400">
          Describe the exact problem or outcome you need, and our AI will analyze thousands of parameters to recommend your ideal tools.
        </p>
      </div>

      {/* Task Input Form */}
      <form onSubmit={handleMatchFind} className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-2xl space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Describe Your Task or Goal
          </label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="e.g., 'I need an AI tool to remove backgrounds from 500 product photos automatically and add studio lighting'"
            rows={3}
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
          />
        </div>

        {/* Quick Sample Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium">Try an example:</span>
          {sampleTasks.map((st, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setTaskDescription(st)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-900/40 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              {st.slice(0, 45)}...
            </button>
          ))}
        </div>

        {/* Optional Criteria Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Target Category (Optional)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="">Any Category</option>
              <option value="Coding">Coding & Development</option>
              <option value="Video Creation">Video Creation</option>
              <option value="Writing">Writing & Copywriting</option>
              <option value="Image Generation">Image & Visual Art</option>
              <option value="Audio">Voice & Audio</option>
              <option value="Automation">Automation & Bots</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Budget Preference (Optional)</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="">Any Price</option>
              <option value="Free Only">100% Free</option>
              <option value="Freemium">Freemium (Free plan available)</option>
              <option value="Under $20/mo">Under $20 / month</option>
              <option value="Open Source">Open Source</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !taskDescription.trim()}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
              <span>Analyzing Tool Database with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Find Best Matching Tools</span>
            </>
          )}
        </button>
      </form>

      {/* Match Results */}
      {hasSearched && !loading && (
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Top AI Tool Matches
            </h3>
            <span className="text-xs text-slate-400">{matches.length} Recommended Tools</span>
          </div>

          <div className="space-y-4">
            {matches.map((m, idx) => {
              const matchedToolObj = allTools.find(
                (t) => t.name.toLowerCase().includes(m.name.toLowerCase()) || m.name.toLowerCase().includes(t.name.toLowerCase())
              );

              const toolUrl = matchedToolObj?.officialLinks?.website || m.websiteUrl || `https://www.google.com/search?q=${encodeURIComponent(m.name + ' AI tool')}`;
              const displayDomain = toolUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-xl flex flex-col sm:flex-row items-start justify-between gap-4 group hover:border-purple-500/50 transition-all"
                >
                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex items-center gap-3">
                      {matchedToolObj ? (
                        <a href={toolUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 hover:opacity-80 transition-opacity">
                          <img src={matchedToolObj.logo} alt={m.name} className="w-10 h-10 rounded-xl object-cover" />
                        </a>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={toolUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-extrabold text-slate-100 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                          >
                            <span>{m.name}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                            {m.matchScore}% Match
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          {matchedToolObj && (
                            <span className="text-xs text-slate-400">{matchedToolObj.pricingType} • {matchedToolObj.rating}★</span>
                          )}
                          <a
                            href={toolUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium hover:underline flex items-center gap-1"
                          >
                            <Globe className="w-3 h-3" />
                            <span>{displayDomain}</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {m.reasoning}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <span className="text-purple-400 font-bold block mb-1">Suggested Starting Prompt / Usage:</span>
                      <code className="text-slate-300 font-mono text-[11px] select-all block">{m.recommendedPrompt}</code>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 self-stretch sm:self-auto">
                    <a
                      href={toolUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shrink-0 flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer text-center"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {matchedToolObj && (
                      <button
                        onClick={() => onSelectTool(matchedToolObj)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 shrink-0 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Inspect Tool</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
