import React, { useState } from 'react';
import { Category, FilterState, PricingType, PlatformType, AITool } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Filter,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Star,
  Clock,
  TrendingUp,
  Flame
} from 'lucide-react';

interface CategorySectionProps {
  categories: Category[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalResultsCount: number;
  toolsList?: AITool[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  filters,
  setFilters,
  totalResultsCount,
  toolsList = []
}) => {
  const { t } = useLanguage();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const pricingOptions: PricingType[] = ['Free', 'Freemium', 'Paid', 'Enterprise', 'Open Source'];
  const platformOptions: PlatformType[] = [
    'Browser Based',
    'Windows',
    'macOS',
    'Linux',
    'Android',
    'iOS',
    'Chrome Extension'
  ];

  const handleCategorySelect = (catName: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategory: prev.selectedCategory === catName ? 'All' : catName
    }));
  };

  const togglePricingFilter = (pricing: PricingType) => {
    setFilters((prev) => {
      const exists = prev.pricingTypes.includes(pricing);
      return {
        ...prev,
        pricingTypes: exists
          ? prev.pricingTypes.filter((p) => p !== pricing)
          : [...prev.pricingTypes, pricing]
      };
    });
  };

  const togglePlatformFilter = (platform: PlatformType) => {
    setFilters((prev) => {
      const exists = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: exists
          ? prev.platforms.filter((p) => p !== platform)
          : [...prev.platforms, platform]
      };
    });
  };

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 12);

  return (
    <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      {/* Categories Bar */}
      <div className="mb-6">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
          <button
            onClick={() => handleCategorySelect('All')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              filters.selectedCategory === 'All'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-lg shadow-cyan-500/20'
                : 'bg-white dark:bg-[#0f172a] hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-500/30'
            }`}
          >
            <div className="text-xs font-bold">{t('allTools')}</div>
            <div className={`text-[10px] ${filters.selectedCategory === 'All' ? 'text-slate-900 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
              {toolsList.length} {t('tools')}
            </div>
          </button>

          {visibleCategories.map((cat) => {
            const isSelected = filters.selectedCategory === cat.name;
            const matchingCount = toolsList.filter((t) =>
              t.categories.some((c) => c.toLowerCase() === cat.name.toLowerCase() || c.toLowerCase().includes(cat.name.toLowerCase()))
            ).length;
            const displayCount = matchingCount > 0 ? matchingCount : cat.toolCount;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-white dark:bg-[#0f172a] hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-500/30'
                }`}
              >
                <div className="text-xs font-bold truncate">{t(cat.name)}</div>
                <div className={`text-[10px] ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                  {displayCount} {displayCount === 1 ? t('tool') : t('tools')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar & Sorting */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-end gap-4">
          
          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm ${
                showAdvancedFilters || filters.pricingTypes.length > 0 || filters.platforms.length > 0
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 hover:bg-cyan-400 active:scale-95'
                  : 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-cyan-500/50 hover:text-cyan-300 shadow-slate-950/40 hover:shadow-cyan-500/10 active:scale-95'
              }`}
              title={t('filter')}
              aria-label={t('filter')}
            >
              <SlidersHorizontal className={`w-4 h-4 transition-transform duration-200 ${
                showAdvancedFilters || filters.pricingTypes.length > 0 || filters.platforms.length > 0
                  ? 'text-slate-950'
                  : 'text-cyan-400'
              }`} />
              {(filters.pricingTypes.length > 0 || filters.platforms.length > 0) && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-extrabold flex items-center justify-center border border-slate-900 ${
                  showAdvancedFilters || filters.pricingTypes.length > 0 || filters.platforms.length > 0
                    ? 'bg-slate-950 text-cyan-300'
                    : 'bg-cyan-400 text-slate-950'
                }`}>
                  {filters.pricingTypes.length + filters.platforms.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expanded Filter Panel */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-purple-500/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pricing Filter */}
            <div>
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                {t('pricingModel')}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {pricingOptions.map((pricing) => {
                  const isChecked = filters.pricingTypes.includes(pricing);
                  return (
                    <button
                      key={pricing}
                      onClick={() => togglePricingFilter(pricing)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                        isChecked
                          ? 'bg-violet-600/30 text-violet-200 border-violet-500/50'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-cyan-400" />}
                      <span>{t(pricing)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platform Filter */}
            <div>
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                {t('supportedPlatforms')}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {platformOptions.map((plat) => {
                  const isChecked = filters.platforms.includes(plat);
                  return (
                    <button
                      key={plat}
                      onClick={() => togglePlatformFilter(plat)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                        isChecked
                          ? 'bg-violet-600/30 text-violet-200 border-violet-500/50'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-cyan-400" />}
                      <span>{t(plat)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Capabilities Checkboxes */}
            <div>
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                {t('capabilitiesLicensing')}
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer hover:text-purple-300">
                  <input
                    type="checkbox"
                    checked={filters.apiAvailableOnly}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, apiAvailableOnly: e.target.checked }))
                    }
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>{t('apiAvailable')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-purple-300">
                  <input
                    type="checkbox"
                    checked={filters.openSourceOnly}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, openSourceOnly: e.target.checked }))
                    }
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>{t('openSource')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-purple-300">
                  <input
                    type="checkbox"
                    checked={filters.commercialLicenseOnly}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, commercialLicenseOnly: e.target.checked }))
                    }
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>{t('commercialLicense')}</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Result Counter & Active Tags */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <div>
          {t('showing')} <span className="font-bold text-slate-200">{totalResultsCount}</span> {t('matchingTools')}
          {filters.selectedCategory !== 'All' && (
            <span> {t('in')} <span className="text-cyan-400 font-semibold">{t(filters.selectedCategory)}</span></span>
          )}
        </div>
      </div>
    </div>
  );
};
