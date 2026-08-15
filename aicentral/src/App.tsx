import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { ToolCard } from './components/ToolCard';
import { ToolDetailModal } from './components/ToolDetailModal';
import { AIMatchFinder } from './components/AIMatchFinder';
import { AIWorkflowBuilder } from './components/AIWorkflowBuilder';
import { AIDetector } from './components/AIDetector';
import { AIComparisonEngine } from './components/AIComparisonEngine';
import { AIPromptLibrary } from './components/AIPromptLibrary';
import { AIFinderQuiz } from './components/AIFinderQuiz';
import { AIBenchmarks } from './components/AIBenchmarks';
import { PersonalDashboard } from './components/PersonalDashboard';
import { SavedToolsModal } from './components/SavedToolsModal';
import { NotificationCenter } from './components/NotificationCenter';
import { AdminDashboard } from './components/AdminDashboard';
import { AINewsBlog } from './components/AINewsBlog';
import { AuthModal } from './components/AuthModal';
import { ShareModal } from './components/ShareModal';
import { Footer } from './components/Footer';

import { AITool, FilterState } from './types';
import { MOCK_TOOLS } from './data/mockTools';
import { MOCK_CATEGORIES } from './data/mockCategories';
import { Flame, Sparkles, Star, ShieldCheck, Zap, Heart, Lightbulb, ExternalLink, ArrowRight, ChevronDown, Compass, Newspaper, GitCompare, Bookmark } from 'lucide-react';

import { GlobalParticleBackground } from './components/GlobalParticleBackground';
import { useLanguage } from './context/LanguageContext';

export function App() {
  const { t } = useLanguage();
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('discover');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync html element class for theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Tools & State
  const [toolsList, setToolsList] = useState<AITool[]>(MOCK_TOOLS);
  const [savedToolIds, setSavedToolIds] = useState<string[]>(['tool-1', 'tool-3']);
  const [comparedToolIds, setComparedToolIds] = useState<string[]>(['tool-1', 'tool-2']);
  const [purchasedPrompts, setPurchasedPrompts] = useState<string[]>([]);
  
  // User Auth State
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatar: string } | null>(() => {
    try {
      const saved = localStorage.getItem('aicentral_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.name && parsed.email) {
          return {
            name: String(parsed.name),
            email: String(parsed.email),
            avatar: String(parsed.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(parsed.name)}&background=0284C7&color=fff&bold=true`)
          };
        }
      }
    } catch (e) {
      console.warn('localStorage read error:', e);
    }
    return null;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('aicentral_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('aicentral_user');
      }
    } catch (e) {
      console.warn('localStorage write error:', e);
    }
  }, [currentUser]);

  // Modals & Drawers
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSavedToolsOpen, setIsSavedToolsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'profile' | 'settings'>('profile');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(2);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: 'All',
    pricingTypes: [],
    platforms: [],
    openSourceOnly: false,
    apiAvailableOnly: false,
    commercialLicenseOnly: false,
    teamCollabOnly: false,
    offlineOnly: false,
    aiModelFilter: '',
    sortBy: 'trending'
  });

  // Toggle Save Tool
  const handleToggleSave = (toolId: string) => {
    setSavedToolIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  // Toggle Compare Tool
  const handleToggleCompare = (toolId: string) => {
    setComparedToolIds((prev) => {
      if (prev.includes(toolId)) {
        return prev.filter((id) => id !== toolId);
      }
      if (prev.length >= 6) {
        alert('You can compare up to 6 tools at once.');
        return prev;
      }
      return [...prev, toolId];
    });
  };

  // Filter & Sort Tools Logic
  const filteredTools = useMemo(() => {
    const query = (searchQuery || filters.searchQuery).toLowerCase().trim();

    return toolsList.filter((tool) => {
      // 1. Text Search
      if (query) {
        const matchesText =
          tool.name.toLowerCase().includes(query) ||
          tool.tagline.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.categories.some((c) => c.toLowerCase().includes(query)) ||
          tool.pros.some((p) => p.toLowerCase().includes(query));
        if (!matchesText) return false;
      }

      // 2. Category
      if (filters.selectedCategory !== 'All') {
        const selected = filters.selectedCategory.toLowerCase();
        const matchesCategory = tool.categories.some((c) =>
          c.toLowerCase() === selected || c.toLowerCase().includes(selected) || selected.includes(c.toLowerCase())
        );
        if (!matchesCategory) return false;
      }

      // 3. Pricing
      if (filters.pricingTypes.length > 0) {
        if (!filters.pricingTypes.includes(tool.pricingType)) return false;
      }

      // 4. Platforms
      if (filters.platforms.length > 0) {
        const matchesPlat = tool.supportedPlatforms.some((p) => filters.platforms.includes(p));
        if (!matchesPlat) return false;
      }

      // 5. Capabilities
      if (filters.openSourceOnly && !tool.openSource) return false;
      if (filters.apiAvailableOnly && !tool.apiAvailable) return false;
      if (filters.commercialLicenseOnly && !tool.commercialLicense) return false;

      return true;
    }).sort((a, b) => {
      // Always place verified tools at the top first across all categories
      if (a.verified !== b.verified) {
        return a.verified ? -1 : 1;
      }
      if (filters.sortBy === 'trending') return b.viewsToday - a.viewsToday;
      if (filters.sortBy === 'popular') return (b.reviewCount || 0) - (a.reviewCount || 0);
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return b.id.localeCompare(a.id);
      return 0;
    });
  }, [toolsList, searchQuery, filters]);

  // Special Curated Tool Subsets
  const toolOfDay = useMemo(() => toolsList.find((t) => t.isToolOfDay) || toolsList[0], [toolsList]);
  const trendingTools = useMemo(() => [...toolsList].sort((a, b) => b.viewsToday - a.viewsToday).slice(0, 6), [toolsList]);
  const editorsPicks = useMemo(() => toolsList.filter((t) => t.isEditorsPick).slice(0, 6), [toolsList]);
  // Pagination state for 1,500 tools catalog
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setVisibleCount(24);
  }, [filters, searchQuery]);

  const displayedTools = useMemo(
    () => filteredTools.slice(0, visibleCount),
    [filteredTools, visibleCount]
  );

  return (
    <div className={`relative min-h-screen w-full max-w-full overflow-x-hidden font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Fullsite Slowly Moving Animated Particle Background */}
      <GlobalParticleBackground darkMode={darkMode} />
      
      {/* Top Header Bar */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        savedCount={savedToolIds.length}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenDashboard={(tab = 'profile') => {
          setDashboardTab(tab === 'settings' ? 'settings' : 'profile');
          setIsDashboardOpen(true);
        }}
        onOpenSaved={() => setIsSavedToolsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      {/* MAIN CONTENT VIEWS */}
      <main className="w-full max-w-full overflow-x-hidden pb-20 md:pb-8">
        {activeTab === 'discover' && (
          <div>
            {/* Hero Banner */}
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onExploreClick={() => {
                const el = document.getElementById('directory-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onMatchFinderClick={() => setActiveTab('match-finder')}
            />

            {/* Category & Filter Bar */}
            <CategorySection
              categories={MOCK_CATEGORIES}
              filters={filters}
              setFilters={setFilters}
              totalResultsCount={filteredTools.length}
              toolsList={toolsList}
            />



            {/* Main AI Tools Directory Grid */}
            <section id="directory-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <span>{t('discoverAiTools')}</span>
                </h2>
                <span className="text-xs text-slate-400">{filteredTools.length} {t('toolsAvailable')}</span>
              </div>

              {filteredTools.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3 bg-slate-900/40 rounded-2xl border border-purple-500/10">
                  <p className="text-sm font-semibold">{t('noToolsMatched')}</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        searchQuery: '',
                        selectedCategory: 'All',
                        pricingTypes: [],
                        platforms: [],
                        openSourceOnly: false,
                        apiAvailableOnly: false,
                        commercialLicenseOnly: false,
                        teamCollabOnly: false,
                        offlineOnly: false,
                        aiModelFilter: '',
                        sortBy: 'trending'
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                  >
                    {t('resetAllFilters')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedTools.map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        isSaved={savedToolIds.includes(tool.id)}
                        onToggleSave={handleToggleSave}
                        isCompared={comparedToolIds.includes(tool.id)}
                        onToggleCompare={handleToggleCompare}
                        onSelectTool={(t) => setSelectedTool(t)}
                      />
                    ))}
                  </div>

                  {visibleCount < filteredTools.length && (
                    <div className="mt-12 text-center flex flex-col items-center justify-center gap-3">
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 24)}
                        className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
                      >
                        <span>{t('loadMoreAiTools')}</span>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                        <span className="ml-1 px-2.5 py-0.5 rounded-full bg-slate-950/15 text-slate-950 text-xs font-extrabold tracking-wide">
                          {filteredTools.length - visibleCount} {t('remaining')}
                        </span>
                      </button>
                      <p className="text-xs text-slate-400 font-medium">
                        {t('showing')} <span className="text-slate-200 font-semibold">{displayedTools.length}</span> {t('of')} <span className="text-slate-200 font-semibold">{filteredTools.length.toLocaleString()}</span> {t('matchingTools')}
                      </p>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: AI MATCH FINDER */}
        {activeTab === 'match-finder' && (
          <AIMatchFinder
            allTools={toolsList}
            onSelectTool={(t) => setSelectedTool(t)}
          />
        )}

        {/* TAB 3: WORKFLOW BUILDER */}
        {activeTab === 'workflow-builder' && (
          <AIWorkflowBuilder
            allTools={toolsList}
            onSelectTool={(t) => setSelectedTool(t)}
          />
        )}

        {/* TAB 4: AI DETECTOR */}
        {activeTab === 'ai-detector' && (
          <AIDetector />
        )}

        {/* TAB 5: COMPARISON ENGINE */}
        {activeTab === 'comparison-engine' && (
          <AIComparisonEngine
            allTools={toolsList}
            selectedCompareIds={comparedToolIds}
            onToggleCompare={handleToggleCompare}
            onSelectTool={(t) => setSelectedTool(t)}
          />
        )}

        {/* TAB 6: PROMPT LIBRARY */}
        {activeTab === 'prompt-library' && (
          <AIPromptLibrary
            purchasedPrompts={purchasedPrompts}
            setPurchasedPrompts={setPurchasedPrompts}
          />
        )}

        {/* TAB 7: AI ACADEMY */}
        {activeTab === 'skill-academy' && (
          <AIBenchmarks onNavigateTab={(tab) => setActiveTab(tab)} />
        )}

        {/* TAB 9: AI NEWS & BLOG */}
        {activeTab === 'news-blog' && <AINewsBlog />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} onOpenShare={() => setIsShareModalOpen(true)} />

      {/* Mobile Bottom Quick-Nav Dock */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden border-t backdrop-blur-xl px-2 py-1.5 flex justify-around items-center transition-colors shadow-2xl ${
        darkMode ? 'bg-slate-950/95 border-slate-800/80 text-slate-400' : 'bg-white/95 border-slate-200 text-slate-600'
      }`}>
        <button
          onClick={() => { setActiveTab('discover'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'discover'
              ? darkMode ? 'text-cyan-400 font-bold' : 'text-cyan-600 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Discover</span>
        </button>

        <button
          onClick={() => { setActiveTab('news-blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl relative transition-all cursor-pointer ${
            activeTab === 'news-blog'
              ? darkMode ? 'text-cyan-400 font-bold' : 'text-cyan-600 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <span className="relative">
            <Newspaper className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </span>
          <span className="text-[10px]">AI News</span>
        </button>

        <button
          onClick={() => { setActiveTab('ai-detector'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'ai-detector'
              ? darkMode ? 'text-cyan-400 font-bold' : 'text-cyan-600 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px]">Detector</span>
        </button>

        <button
          onClick={() => { setActiveTab('compare'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'compare'
              ? darkMode ? 'text-cyan-400 font-bold' : 'text-cyan-600 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <GitCompare className="w-5 h-5" />
          <span className="text-[10px]">Compare</span>
        </button>

        <button
          onClick={() => setIsSavedToolsOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl relative transition-all cursor-pointer hover:text-cyan-400"
        >
          <span className="relative">
            <Bookmark className="w-5 h-5" />
            {savedToolIds.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-extrabold text-[9px] px-1 rounded-full min-w-[14px] text-center leading-3">
                {savedToolIds.length}
              </span>
            )}
          </span>
          <span className="text-[10px]">Saved</span>
        </button>
      </div>

      {/* MODALS & DRAWERS */}

      {/* 1. Tool Detail Modal */}
      {selectedTool && (
        <ToolDetailModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
          isSaved={savedToolIds.includes(selectedTool.id)}
          onToggleSave={handleToggleSave}
          allTools={toolsList}
          onSelectAlternative={(alt) => setSelectedTool(alt)}
        />
      )}

      {/* 2. Notifications Center */}
      {isNotificationsOpen && (
        <NotificationCenter
          onClose={() => setIsNotificationsOpen(false)}
          onClearAll={() => setUnreadNotificationsCount(0)}
        />
      )}

      {/* 3. Dedicated Saved AI Tools Modal */}
      <SavedToolsModal
        isOpen={isSavedToolsOpen}
        onClose={() => setIsSavedToolsOpen(false)}
        savedToolIds={savedToolIds}
        allTools={toolsList}
        onSelectTool={(t) => setSelectedTool(t)}
        onRemoveSaved={handleToggleSave}
        onClearAllSaved={() => setSavedToolIds([])}
      />

      {/* 4. Personal User Dashboard & Account Settings */}
      {isDashboardOpen && (
        <PersonalDashboard
          onClose={() => setIsDashboardOpen(false)}
          initialTab={dashboardTab}
          savedToolIds={savedToolIds}
          allTools={toolsList}
          onSelectTool={(t) => setSelectedTool(t)}
          onRemoveSaved={handleToggleSave}
          currentUser={currentUser}
          onLogout={() => setCurrentUser(null)}
          onUpdateUser={(updated) => setCurrentUser(updated)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {/* 4. Admin Portal */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          allTools={toolsList}
          onAddNewTool={(newTool) => setToolsList([newTool, ...toolsList])}
        />
      )}

      {/* 5. AI Finder Quiz */}
      {isQuizOpen && (
        <AIFinderQuiz
          allTools={toolsList}
          onClose={() => setIsQuizOpen(false)}
          onSelectTool={(t) => setSelectedTool(t)}
        />
      )}

      {/* 6. Sign In / Sign Up Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(userData) => {
          setCurrentUser(userData);
        }}
      />

      {/* 7. Share Hub Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

    </div>
  );
}

export default App;
