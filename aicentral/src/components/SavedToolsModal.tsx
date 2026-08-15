import React, { useState } from 'react';
import { Bookmark, X, Search, Trash2, ExternalLink, Star, Sparkles, Filter, ArrowRight } from 'lucide-react';
import { AITool } from '../types';

interface SavedToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedToolIds: string[];
  allTools: AITool[];
  onSelectTool: (tool: AITool) => void;
  onRemoveSaved: (toolId: string) => void;
  onClearAllSaved?: () => void;
}

export const SavedToolsModal: React.FC<SavedToolsModalProps> = ({
  isOpen,
  onClose,
  savedToolIds,
  allTools,
  onSelectTool,
  onRemoveSaved,
  onClearAllSaved
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  // Get saved tools list
  const savedTools = allTools.filter(t => savedToolIds.includes(t.id));

  // Extract unique categories among saved tools
  const availableCategories = ['All', ...Array.from(new Set(savedTools.map(t => t.category)))];

  // Filter saved tools by search and category
  const filteredSavedTools = savedTools.filter(tool => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col text-slate-100 ring-1 ring-white/10">
        
        {/* Saved Tools Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bookmark className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Saved Tools & Collections
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {savedTools.length}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Your bookmarked AI tools for quick access.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar: Search & Category Filters */}
        {savedTools.length > 0 && (
          <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/60 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved tools..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Clear all button */}
              {onClearAllSaved && savedTools.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to remove all saved tools?')) {
                      onClearAllSaved();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* Category filter pills if multiple categories */}
            {availableCategories.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] text-slate-500 font-medium mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  Category:
                </span>
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved Items Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 min-h-[250px]">
          {savedTools.length === 0 ? (
            /* Empty State */
            <div className="py-12 px-4 text-center space-y-4 bg-slate-950/40 rounded-2xl border border-slate-800/80 my-auto">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/5">
                <Bookmark className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-base font-bold text-white">No Saved AI Tools Yet</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bookmark your favorite tools while exploring the directory to build your personalized AI toolset here.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore AI Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : filteredSavedTools.length === 0 ? (
            /* No Search Match State */
            <div className="py-10 text-center space-y-2 bg-slate-950/40 rounded-2xl border border-slate-800/80 p-6">
              <p className="text-sm font-semibold text-slate-300">No saved tools match "{searchQuery}"</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="text-xs text-cyan-400 hover:underline font-medium"
              >
                Reset search filters
              </button>
            </div>
          ) : (
            /* Saved Tools Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredSavedTools.map((tool) => (
                <div
                  key={tool.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3 group shadow-md hover:shadow-cyan-500/5"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={tool.icon}
                      alt={tool.name}
                      className="w-11 h-11 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                          {tool.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                          {tool.pricing}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-normal">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-200">{tool.rating}</span>
                      <span className="text-[10px] text-slate-500 font-medium">• {tool.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onRemoveSaved(tool.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-colors cursor-pointer"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTool(tool);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="text-slate-500 text-[11px]">
            Tip: Tools saved here sync across your active session.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
