import React from 'react';
import { Search, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onExploreClick: () => void;
  onMatchFinderClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onExploreClick,
  onMatchFinderClick
}) => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-3 px-2.5 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[500px] h-[200px] bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Card Container - Fits Background Image Perfectly */}
      <div className="relative border-2 border-slate-300 dark:border-slate-700/90 rounded-2xl p-4 sm:p-8 shadow-2xl transition-all duration-300 overflow-hidden ring-1 ring-slate-900/10 dark:ring-cyan-500/30 min-h-[200px] sm:min-h-[220px]">
        {/* Full Image Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/om3eni0k/image/upload/v1786287043/ChatGPT_Image_Aug_9_2026_10_49_18_AM.png"
            alt="AI Platform Workflow Showcase"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
            referrerPolicy="no-referrer"
          />
          {/* Gradient Overlay for Crisp Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
        </div>

        {/* Top Accent Gradient Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 pointer-events-none z-10" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
          
          {/* Left Text & Controls Column */}
          <div className="flex-1 max-w-2xl space-y-3 sm:space-y-4 w-full">
            {/* Header Row with Heading */}
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {t('heroTitle1')}{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent">
                  {t('heroTitle2')}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl font-medium drop-shadow-sm">
                {t('heroSubtitle')}
              </p>
            </div>

            {/* Search Bar & Actions Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
              <div className="relative flex-1 flex items-center p-1 sm:p-1.5 rounded-xl bg-slate-950/80 border border-slate-700/80 backdrop-blur-md focus-within:border-cyan-400 transition-all shadow-inner">
                <Search className="w-4 h-4 ml-2 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full px-2 py-1 bg-transparent text-white placeholder-slate-400 text-xs focus:outline-none font-medium min-w-0"
                />
                <button
                  onClick={onExploreClick}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 sm:px-4 py-1.5 rounded-lg text-xs shrink-0 transition-all flex items-center gap-1 cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <span>{t('discover')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onMatchFinderClick}
                  className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 sm:px-4 py-2 sm:py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-lg shadow-indigo-600/30"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>{t('findMyMatch')}</span>
                </button>
                <button
                  onClick={onExploreClick}
                  className="flex-1 sm:flex-none bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 font-bold px-3 sm:px-3.5 py-2 sm:py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 backdrop-blur-md"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('viewAllCategories')}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


