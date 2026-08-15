import React, { useState } from 'react';
import { Zap, X, Plus, Star, CheckCircle2, XCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { AITool } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AIComparisonEngineProps {
  allTools: AITool[];
  selectedCompareIds: string[];
  onToggleCompare: (toolId: string) => void;
  onSelectTool: (tool: AITool) => void;
}

export const AIComparisonEngine: React.FC<AIComparisonEngineProps> = ({
  allTools,
  selectedCompareIds,
  onToggleCompare,
  onSelectTool
}) => {
  const { t } = useLanguage();
  const comparedTools = allTools.filter((t) => selectedCompareIds.includes(t.id));

  // Default pre-select top 3 popular tools if none selected
  const displayTools = comparedTools.length > 0 ? comparedTools : allTools.slice(0, 3);

  const [selectModalOpen, setSelectModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-semibold text-violet-300 mb-2">
            <Zap className="w-4 h-4 text-violet-400" />
            <span>{t('sideBySideMatrix')}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100">{t('aiToolComparison')}</h2>
          <p className="text-xs text-slate-400 mt-1">
            {t('comparisonDesc')}
          </p>
        </div>

        {/* Add Tool Button */}
        <button
          onClick={() => setSelectModalOpen(!selectModalOpen)}
          disabled={selectedCompareIds.length >= 6}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shrink-0 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addToolToCompare')} ({selectedCompareIds.length}/6)</span>
        </button>
      </div>

      {/* Select Tool Drawer Modal */}
      {selectModalOpen && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Select Tools to Compare</h4>
            <button onClick={() => setSelectModalOpen(false)} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {allTools.map((t) => {
              const isSelected = selectedCompareIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => onToggleCompare(t.id)}
                  className={`p-2 rounded-xl border text-left text-xs transition-colors flex items-center gap-2 ${
                    isSelected
                      ? 'bg-purple-600/30 text-cyan-300 border-cyan-400/50'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <img src={t.logo} alt={t.name} className="w-6 h-6 rounded-md object-cover" />
                  <span className="truncate font-semibold">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-purple-500/20 bg-slate-900/90 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-purple-500/20 bg-slate-950/80">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-purple-400 min-w-[180px]">
                Criteria
              </th>
              {displayTools.map((t) => (
                <th key={t.id} className="p-4 min-w-[220px] relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <img src={t.logo} alt={t.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                      <div>
                        <div className="font-extrabold text-sm text-slate-100 flex items-center gap-1">
                          {t.name}
                          {t.verified && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400">{t.pricingType}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleCompare(t.id)}
                      className="p-1 rounded bg-slate-800 text-slate-400 hover:text-slate-100"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-purple-500/10 text-xs text-slate-300">
            {/* Row 1: Rating */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Overall Rating</td>
              {displayTools.map((t) => (
                <td key={t.id} className="p-4">
                  <div className="flex items-center gap-1 font-extrabold text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{t.rating.toFixed(1)} / 5</span>
                    <span className="text-slate-500 font-normal">({t.reviewCount})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Row 2: Pricing Details */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Pricing Breakdown</td>
              {displayTools.map((t) => (
                <td key={t.id} className="p-4 font-medium leading-relaxed">
                  {t.pricingDetails}
                </td>
              ))}
            </tr>

            {/* Row 3: AI Model Engine */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/40">AI Model Used</td>
              {displayTools.map((t) => (
                <td key={t.id} className="p-4 font-semibold text-purple-300">
                  {t.aiModelUsed}
                </td>
              ))}
            </tr>

            {/* Row 4: API Availability */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/40">API Available</td>
              {displayTools.map((t) => (
                <td key={t.id} className="p-4">
                  {t.apiAvailable ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Yes (REST/WS)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
                      No API
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Row 5: Supported Platforms */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Platforms</td>
              {displayTools.map((t) => (
                <td key={t.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {t.supportedPlatforms.map((p) => (
                      <span key={p} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Row 6: Key Advantages */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Key Pros</td>
              {displayTools.map((t) => (
                <td key={t.id} className="p-4">
                  <ul className="space-y-1">
                    {t.pros.slice(0, 3).map((p, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Row 7: Action CTAs */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/40">Inspect Details</td>
              {displayTools.map((t) => (
                <td key={t.id} className="p-4">
                  <button
                    onClick={() => onSelectTool(t)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Full Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};
