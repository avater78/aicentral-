import React, { useState } from 'react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  Search,
  Moon,
  Sun,
  Bell,
  Bookmark,
  User,
  Zap,
  Layers,
  ArrowLeftRight,
  BookOpen,
  GraduationCap,
  Award,
  BarChart3,
  ShieldCheck,
  Cpu,
  Calculator,
  HelpCircle,
  Newspaper,
  PlusCircle,
  CheckCircle2,
  X,
  LogIn,
  LogOut,
  Globe,
  ChevronDown,
  Check,
  Share2,
  SlidersHorizontal,
  Filter
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  savedCount: number;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenDashboard: (tab?: 'saved' | 'profile' | 'settings') => void;
  onOpenSaved?: () => void;
  onOpenAdmin: () => void;
  onOpenQuiz: () => void;
  onOpenAuthModal: () => void;
  onOpenShare?: () => void;
  currentUser: { name: string; email: string; avatar: string } | null;
  onLogout: () => void;
  userXP?: number;
  userLevel?: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  savedCount,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenDashboard,
  onOpenSaved,
  onOpenAdmin,
  onOpenQuiz,
  onOpenAuthModal,
  onOpenShare,
  currentUser,
  onLogout
}) => {
  const { currentLang, setLanguage, t, languages } = useLanguage();
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const popularTasks = [
    'remove background',
    'generate music',
    'edit videos',
    'build websites',
    'write emails',
    'create presentations',
    'voice cloning',
    'code debugging',
    'summarize pdfs'
  ];

  return (
    <header className={`sticky top-0 z-40 w-full max-w-full overflow-hidden transition-all duration-300 shadow-md ${
      darkMode
        ? 'bg-[#0f172a] border-b border-slate-800 text-slate-100'
        : 'bg-white border-b border-slate-200 text-slate-900 shadow-slate-900/5'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('discover')}
            className="cursor-pointer shrink-0"
          >
            <Logo size="md" />
          </div>

          {/* Task-based Smart Search Input */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative flex items-center">
              <Search className={`absolute left-3.5 w-4 h-4 transition-colors ${darkMode ? 'text-slate-400 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-cyan-600'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowTaskDropdown(true);
                }}
                onFocus={() => setShowTaskDropdown(true)}
                onBlur={() => setTimeout(() => setShowTaskDropdown(false), 200)}
                placeholder="Search AI tools or tasks..."
                className={`w-full pl-10 pr-16 py-2 rounded-xl text-xs font-medium transition-all duration-200 focus:outline-none ${
                  darkMode
                    ? 'bg-slate-900/90 border border-slate-700/80 text-slate-100 placeholder-slate-400/80 focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 focus:bg-white shadow-sm'
                }`}
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTaskDropdown(!showTaskDropdown);
                  }}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                    darkMode
                      ? 'bg-slate-800/80 hover:bg-slate-700/90 border-slate-700/80 text-cyan-400 hover:text-cyan-300'
                      : 'bg-slate-200/70 hover:bg-slate-300/80 border-slate-300/80 text-cyan-700 hover:text-cyan-800'
                  }`}
                  title="Filter tools and categories"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" />
                </button>
              </div>
            </div>

            {/* Task Autocomplete Dropdown */}
            {showTaskDropdown && (
              <div className={`absolute left-0 right-0 top-full mt-2 border rounded-2xl shadow-2xl overflow-hidden z-50 p-3 backdrop-blur-xl ${
                darkMode ? 'bg-[#0A0A0C] border-white/10 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-900'
              }`}>
                <div className="text-[11px] font-semibold text-cyan-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-cyan-500" /> Quick Task Suggestions
                </div>
                <div className="flex flex-wrap gap-1.5 p-1">
                  {popularTasks.map((task) => (
                    <button
                      key={task}
                      onClick={() => {
                        setSearchQuery(task);
                        setShowTaskDropdown(false);
                      }}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        darkMode
                          ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-cyan-300'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-cyan-700 font-medium'
                      }`}
                    >
                      {task}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Tools & User Stats */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Mobile Search Toggle Button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className={`p-2 sm:p-2 rounded-lg sm:rounded-xl border transition-all md:hidden cursor-pointer shadow-sm ${
                showMobileSearch
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                  : darkMode
                  ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-cyan-400'
                  : 'bg-white hover:bg-slate-50 border-slate-300/80 text-cyan-600'
              }`}
              title="Search AI tools"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            
            {/* Language Selector (20 Languages) - Symbol Only */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-full border transition-all text-xs font-semibold cursor-pointer shadow-md group ${
                  darkMode
                    ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-100'
                    : 'bg-white hover:bg-slate-50 border-slate-300/80 text-slate-800'
                }`}
                title={`${t('selectLanguage')}: ${currentLang.name}`}
              >
                <span className="text-sm sm:text-base leading-none">{currentLang.flag}</span>
                <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                } ${showLangDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown Menu */}
              {showLangDropdown && (
                <div className={`absolute right-0 mt-2 w-60 sm:w-64 max-h-80 overflow-y-auto border rounded-2xl shadow-2xl overflow-hidden z-50 p-2 backdrop-blur-2xl custom-scrollbar animate-in fade-in zoom-in-95 duration-150 ${
                  darkMode
                    ? 'bg-[#0A0A0C] border-slate-800 divide-y divide-white/5 text-slate-100'
                    : 'bg-white/95 border-slate-200 divide-y divide-slate-100 text-slate-900'
                }`}>
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Globe className="w-3 h-3" /> {t('selectLanguage')}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20">
                      20 Languages
                    </span>
                  </div>
                  <div className="pt-1.5 space-y-0.5">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          currentLang.code === lang.code
                            ? 'bg-cyan-500/20 text-cyan-600 font-bold border border-cyan-500/30'
                            : darkMode
                            ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base leading-none">{lang.flag}</span>
                          <div className="text-left">
                            <span className="block font-semibold">{lang.name}</span>
                            <span className="block text-[10px] opacity-70">{lang.nativeName}</span>
                          </div>
                        </div>
                        {currentLang.code === lang.code && (
                          <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Share Hub Button */}
            {onOpenShare && (
              <button
                onClick={onOpenShare}
                className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:text-indigo-600 transition-all shadow-sm hover:scale-105 cursor-pointer"
                title="Share AICentral"
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
              </button>
            )}

            {/* Saved Tools & Collections Button */}
            <button
              onClick={() => onOpenSaved ? onOpenSaved() : onOpenDashboard('saved')}
              className={`relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl border transition-all shadow-sm cursor-pointer group ${
                darkMode
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300'
                  : 'bg-white hover:bg-slate-50 border-slate-300/80 text-slate-700 hover:text-cyan-600'
              }`}
              title="Saved Tools & Collections"
            >
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 fill-cyan-500/20 shrink-0" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] px-1 rounded-full bg-cyan-500 text-[9px] sm:text-[10px] font-extrabold text-white flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className={`relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl border transition-all shadow-sm cursor-pointer group ${
                darkMode
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300'
                  : 'bg-white hover:bg-slate-50 border-slate-300/80 text-slate-700 hover:text-cyan-600'
              }`}
              title="Smart Notifications"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-12" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-cyan-500 text-[8px] sm:text-[9px] font-extrabold text-white items-center justify-center border border-white">
                    {unreadNotificationsCount}
                  </span>
                </span>
              )}
            </button>


            {/* Premium Light/Dark Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl border transition-all cursor-pointer shadow-md flex items-center justify-center ${
                darkMode
                  ? 'bg-slate-900/90 border-slate-700/80 text-amber-400 hover:border-amber-400/50'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-400 shadow-amber-500/20 hover:scale-105'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-current" />
              )}
            </button>

            {/* Auth Action: Sign In / Log In Button or User Profile + Log Out Button */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-2 pl-0.5 sm:pl-1">
                <button
                  onClick={() => onOpenDashboard('profile')}
                  className="p-0.5 sm:p-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 cursor-pointer transition-all shrink-0"
                  title={`Signed in as ${currentUser.name} (${currentUser.email}) - Open Profile`}
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                  />
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500/20 to-rose-600/20 hover:from-red-500/30 hover:to-rose-600/30 text-rose-400 hover:text-rose-200 border border-red-500/40 hover:border-red-400 shadow-md shadow-red-500/10 transition-all hover:scale-105 shrink-0 cursor-pointer"
                  title={t('logout')}
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 sm:gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-105 shrink-0"
              >
                <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">{t('login')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable Mobile Search Panel */}
        {showMobileSearch && (
          <div className="pb-3 pt-1 md:hidden transition-all duration-200">
            <div className="relative flex items-center">
              <Search className={`absolute left-3.5 w-4 h-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 1,500+ AI tools or tasks..."
                autoFocus
                className={`w-full pl-10 pr-10 py-2 rounded-xl text-xs font-medium transition-all focus:outline-none ${
                  darkMode
                    ? 'bg-slate-900 border border-cyan-500/50 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500/20'
                    : 'bg-slate-100 border border-cyan-500/50 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/20'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {/* Quick Mobile Task Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['remove background', 'video edit', 'code debug', 'pdf summary'].map((task) => (
                <button
                  key={task}
                  onClick={() => setSearchQuery(task)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full border ${
                    darkMode
                      ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-cyan-300'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-cyan-700'
                  }`}
                >
                  {task}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Primary Navigation Tabs */}
        <nav className={`flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none border-t text-xs font-medium touch-pan-x active:cursor-grabbing ${
          darkMode ? 'border-white/10' : 'border-slate-200/80'
        }`}>
          {[
            { id: 'discover', label: t('discover'), icon: Layers },
            { id: 'ai-detector', label: t('detector'), icon: ShieldCheck, badge: 'NEW' },
            { id: 'comparison-engine', label: t('compare'), icon: Zap },
            { id: 'skill-academy', label: t('academy'), icon: GraduationCap, badge: 'HUB' },
            { id: 'match-finder', label: t('match'), icon: Sparkles, badge: 'AI' },
            { id: 'workflow-builder', label: t('workflows'), icon: Cpu },
            { id: 'news-blog', label: t('news'), icon: Newspaper }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : darkMode
                    ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-slate-950 text-cyan-400'
                      : darkMode
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'bg-cyan-100 text-cyan-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
