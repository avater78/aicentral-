import React from 'react';
import { AITool } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Star,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Cpu,
  Flame,
  Zap,
  Check,
  Plus
} from 'lucide-react';

interface ToolCardProps {
  tool: AITool;
  isSaved: boolean;
  onToggleSave: (toolId: string) => void;
  isCompared: boolean;
  onToggleCompare: (toolId: string) => void;
  onSelectTool: (tool: AITool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare,
  onSelectTool
}) => {
  const { t } = useLanguage();

  const getPricingBadgeColor = (pricing: string) => {
    switch (pricing) {
      case 'Free':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Open Source':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Freemium':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Paid':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div 
      onClick={() => onSelectTool(tool)}
      className="group relative rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-[#131d33] p-5 transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Header: Logo, Name, Badges & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-1 shrink-0 overflow-hidden group-hover:border-cyan-500/30 transition-colors">
              <img
                src={tool.logo}
                alt={tool.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80';
                }}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate">
                  {tool.name}
                </h3>
                {tool.verified && (
                  <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" title={t('verified')} />
                )}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPricingBadgeColor(tool.pricingType)}`}>
                  {t(tool.pricingType)}
                </span>

                <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 text-xs font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{tool.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions: Save & Compare */}
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleCompare(tool.id)}
              className={`p-1.5 px-2.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 ${
                isCompared
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
              title={t('compare')}
            >
              {isCompared ? <Check className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" /> : <Plus className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{t('compare')}</span>
            </button>

            <button
              onClick={() => onToggleSave(tool.id)}
              className={`p-1.5 rounded-lg border transition-all ${
                isSaved
                  ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/40'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
              title={isSaved ? t('saved') : t('saveTool')}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-500 dark:fill-purple-300' : ''}`} />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-900 dark:text-slate-100 line-clamp-2 mb-3 leading-relaxed font-normal opacity-100">
          {tool.tagline || tool.description}
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tool.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-200/90 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-white/10"
            >
              {t(cat)}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 font-medium">
        <span className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-200">
          <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          {tool.viewsToday.toLocaleString()} {t('views')}
        </span>

        <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 flex items-center gap-1 transition-colors">
          {t('viewDetails')}
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
};
