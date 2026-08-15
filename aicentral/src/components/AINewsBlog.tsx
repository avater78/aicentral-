import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Newspaper,
  Clock,
  ExternalLink,
  Bookmark,
  Sparkles,
  Search,
  Filter,
  Share2,
  Heart,
  Eye,
  Check,
  X,
  Volume2,
  VolumeX,
  Send,
  ArrowRight,
  TrendingUp,
  Zap,
  Globe,
  Tag,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Flame,
  RefreshCw,
  Radio,
  Play,
  Pause
} from 'lucide-react';
import { MOCK_NEWS, AINewsArticle } from '../data/mockNews';
import { useLanguage } from '../context/LanguageContext';

export const AINewsBlog: React.FC = () => {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<AINewsArticle[]>(MOCK_NEWS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['news-1']);
  const [likedArticles, setLikedArticles] = useState<{ [id: string]: number }>({});
  const [activeArticleModal, setActiveArticleModal] = useState<AINewsArticle | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState<boolean>(false);
  
  // Audio narration state inside reader modal
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Live Auto-Sync News State
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState<boolean>(true);
  const [isFetchingNews, setIsFetchingNews] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [nextSyncCountdown, setNextSyncCountdown] = useState<number>(30);
  const [newArticlesBadge, setNewArticlesBadge] = useState<number>(0);

  // Categories list
  const categories = ['All', 'Breaking News', 'Product Launch', 'Tutorial', 'Comparison'];

  // Trigger brief toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Live News Auto-Fetch Function
  const fetchLiveNews = useCallback(async (isManual = false) => {
    setIsFetchingNews(true);
    try {
      const res = await fetch(`/api/ai-news${isManual ? '?refresh=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles((prev) => {
            const serverArticles: AINewsArticle[] = data.articles;
            const existingIds = new Set(prev.map((a) => a.id));
            const newCount = serverArticles.filter((a) => !existingIds.has(a.id)).length;

            if (newCount > 0) {
              setNewArticlesBadge((b) => b + newCount);
              showToast(`⚡ Live Stream updated: ${newCount} breaking AI story added!`);
            } else if (isManual) {
              showToast('News feed is synced with the latest AI breakthroughs!');
            }

            const map = new Map<string, AINewsArticle>();
            serverArticles.forEach((a) => map.set(a.id, a));
            prev.forEach((a) => {
              if (!map.has(a.id)) map.set(a.id, a);
            });
            return Array.from(map.values());
          });
          setLastSyncTime(new Date());
        }
      }
    } catch (err) {
      console.error('Failed to fetch live AI news:', err);
    } finally {
      setIsFetchingNews(false);
      setNextSyncCountdown(30);
    }
  }, []);

  // Fetch initial news on component mount
  useEffect(() => {
    fetchLiveNews(true);
  }, [fetchLiveNews]);

  // Periodic Auto-Sync Timer Interval
  useEffect(() => {
    if (!isAutoSyncEnabled) return;

    const interval = setInterval(() => {
      setNextSyncCountdown((prev) => {
        if (prev <= 1) {
          fetchLiveNews(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoSyncEnabled, fetchLiveNews]);

  // Toggle bookmark
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => {
      const isSaved = prev.includes(id);
      const next = isSaved ? prev.filter((i) => i !== id) : [...prev, id];
      showToast(isSaved ? 'Removed from saved articles' : 'Bookmark saved to your library!');
      return next;
    });
  };

  // Toggle Like
  const toggleLike = (id: string, initialLikes: number = 0, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedArticles((prev) => {
      const current = prev[id] || initialLikes;
      const hasLiked = prev[id] !== undefined && prev[id] > initialLikes;
      const nextCount = hasLiked ? current - 1 : current + 1;
      showToast(hasLiked ? 'Upvote removed' : 'Article upvoted!');
      return { ...prev, [id]: nextCount };
    });
  };

  // Share article link
  const shareArticle = (article: AINewsArticle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.officialUrl || window.location.href);
      showToast(`Link to "${article.title.slice(0, 25)}..." copied!`);
    } else {
      showToast('Article link copied to clipboard!');
    }
  };

  // Filtered news articles
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Featured article
  const featuredArticle = useMemo(() => {
    return articles.find((n) => n.featured) || articles[0];
  }, [articles]);

  // Handle TTS Audio narration in reader modal
  const toggleTTSNarration = (article: AINewsArticle) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Text-to-Speech narration is not supported in this browser');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      showToast('Voice narration paused');
    } else {
      window.speechSynthesis.cancel();
      const fullText = `${article.title}. ${article.summary}. ${article.fullContent ? article.fullContent.join(' ') : ''}`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      showToast('Playing AI voice narration...');
    }
  };

  // Newsletter submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    setIsSubmittingNewsletter(true);
    setTimeout(() => {
      setIsSubmittingNewsletter(false);
      setIsNewsletterSubscribed(true);
      showToast('Subscribed! You will receive daily AI intelligence briefings.');
      setNewsletterEmail('');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-cyan-500/50 text-cyan-200 text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          AI News & Insights
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Curated breaking news, model releases, benchmark analyses, and developer tutorials updated in real-time.
        </p>
      </div>

      {/* Live Auto-Sync Status & Control Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Pulse Beacon Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold tracking-wider uppercase shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
            </span>
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{t('liveNewsStream')}</span>
          </div>

          {/* Countdown & Status */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {isAutoSyncEnabled ? (
                <>
                  {t('autoUpdatingIn')}{' '}
                  <span className="text-cyan-300 font-extrabold font-mono bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    {nextSyncCountdown}s
                  </span>
                </>
              ) : (
                <span className="text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                  Auto-sync Paused
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Sync Controls & Actions */}
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
            Last synced: <span className="text-slate-200 font-semibold">{lastSyncTime.toLocaleTimeString()}</span>
          </span>

          <button
            onClick={() => setIsAutoSyncEnabled(!isAutoSyncEnabled)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isAutoSyncEnabled
                ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            {isAutoSyncEnabled ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isAutoSyncEnabled ? t('pauseAutoSync') : t('resumeAutoSync')}</span>
          </button>

          <button
            onClick={() => fetchLiveNews(true)}
            disabled={isFetchingNews}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingNews ? 'animate-spin' : ''}`} />
            <span>{t('fetchLatestNews')}</span>
          </button>
        </div>
      </div>



      {/* Featured Story Hero Card */}
      {selectedCategory === 'All' && !searchQuery && featuredArticle && (
        <div className="relative group rounded-3xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-500/60 shadow-2xl overflow-hidden transition-all duration-300 p-6 sm:p-8">
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/90 text-slate-950 font-extrabold text-[11px] shadow-lg uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 text-slate-950 fill-slate-950" />
                    <span>Featured</span>
                  </span>
                  <span className="font-semibold text-cyan-400">{featuredArticle.author}</span>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{featuredArticle.readTime}</span>
                </span>
              </div>

              <h2
                onClick={() => setActiveArticleModal(featuredArticle)}
                className="text-xl sm:text-2xl font-extrabold text-slate-100 hover:text-cyan-300 transition-colors cursor-pointer leading-tight"
              >
                {featuredArticle.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {featuredArticle.summary}
              </p>

              {/* Tags */}
              {featuredArticle.tags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {featuredArticle.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                
                {/* Modern CTA Button: Read Full Story */}
                <button
                  onClick={() => setActiveArticleModal(featuredArticle)}
                  className="group/btn relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-extrabold text-xs transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </button>

                {/* Secondary Action Icon Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleBookmark(featuredArticle.id, e)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      bookmarkedIds.includes(featuredArticle.id)
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                    title="Bookmark Article"
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(featuredArticle.id) ? 'fill-purple-400' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => shareArticle(featuredArticle, e)}
                    className="p-2.5 rounded-xl bg-slate-950 text-slate-400 border border-slate-800 hover:text-cyan-300 hover:border-cyan-500/40 transition-all cursor-pointer"
                    title="Share Article"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
        </div>
      )}

      {/* Main Articles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>Latest Intelligence Articles</span>
          </h3>
          <span className="text-xs text-slate-400">{filteredArticles.length} stories found</span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-sm font-semibold">No AI news stories matched your search filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((item) => {
              const isBookmarked = bookmarkedIds.includes(item.id);
              const likes = likedArticles[item.id] !== undefined ? likedArticles[item.id] : (item.likesCount || 120);

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveArticleModal(item)}
                  className="group relative rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1"
                >
                  {/* Card Header & Image */}
                  <div className="space-y-4 p-5">
                    <div className="relative rounded-xl overflow-hidden h-32 sm:h-36 border border-slate-800/80 bg-slate-950">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-slate-950/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                        {item.category}
                      </span>

                      {/* Bookmark Icon Overlay */}
                      <button
                        onClick={(e) => toggleBookmark(item.id, e)}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
                          isBookmarked
                            ? 'bg-purple-600/90 text-white shadow-lg'
                            : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                        title="Save Bookmark"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Meta bar */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">{item.author}</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{item.readTime}</span>
                      </span>
                    </div>

                    {/* Title & Summary */}
                    <h4 className="text-base font-extrabold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Card Bottom Modern Action Bar */}
                  <div className="p-4 pt-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs gap-2">
                    
                    {/* Upvote / Like Button */}
                    <button
                      onClick={(e) => toggleLike(item.id, item.likesCount || 120, e)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-pink-300 hover:border-pink-500/40 transition-all cursor-pointer text-[11px] font-bold"
                      title="Upvote story"
                    >
                      <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20" />
                      <span>{likes}</span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={(e) => shareArticle(item, e)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all cursor-pointer"
                      title="Share link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Modern Primary CTA Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveArticleModal(item);
                      }}
                      className="group/story flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all hover:border-cyan-400 hover:shadow-md hover:shadow-cyan-500/10 cursor-pointer ml-auto"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/story:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modern Newsletter Subscription Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 p-8 sm:p-10 shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-extrabold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>Daily AI Executive Digest</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Get the Top AI Intelligence directly in your inbox.
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Join 45,000+ AI researchers, engineers, and product leaders receiving daily 3-minute summaries of breakthroughs, model weight drops, and benchmarks.
          </p>

          {isNewsletterSubscribed ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>You're subscribed! Check your inbox for your first intelligence briefing.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full sm:flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all"
              />
              
              <button
                type="submit"
                disabled={isSubmittingNewsletter}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-purple-500/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                {isSubmittingNewsletter ? (
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Subscribe Free</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FULL ARTICLE READER MODAL ("INSIDE THE STORY") */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Top Header Image & Controls */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 shrink-0">
              <img
                src={activeArticleModal.imageUrl}
                alt={activeArticleModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsPlayingAudio(false);
                  setActiveArticleModal(null);
                }}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer shadow-xl z-20"
                title="Close Reader"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 space-y-2">
                <span className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider">
                  {activeArticleModal.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {activeArticleModal.title}
                </h2>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200">
              
              {/* Meta bar & TTS Voice Reader Button */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-bold text-cyan-300">{activeArticleModal.author}</span>
                  <span>&bull;</span>
                  <span>{activeArticleModal.date}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{activeArticleModal.readTime}</span>
                  </span>
                </div>

                {/* AI Audio Narration Button */}
                <button
                  onClick={() => toggleTTSNarration(activeArticleModal)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                    isPlayingAudio
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 animate-pulse'
                      : 'bg-slate-900 text-cyan-300 border-cyan-500/40 hover:border-cyan-400'
                  }`}
                  title="Listen to AI Voice Narration"
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-4 h-4 text-purple-400" />
                      <span>Pause Voice Narration</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      <span>Listen to Audio Summary</span>
                    </>
                  )}
                </button>
              </div>

              {/* Summary Lead Paragraph */}
              <p className="text-base font-semibold text-slate-100 leading-relaxed border-l-4 border-cyan-400 pl-4 bg-slate-950/40 py-2">
                {activeArticleModal.summary}
              </p>

              {/* Full Content Paragraphs */}
              {activeArticleModal.fullContent && activeArticleModal.fullContent.length > 0 ? (
                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  {activeArticleModal.fullContent.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-300 leading-relaxed">
                  The rapidly evolving landscape of generative AI continues to redefine benchmarks across software engineering, creative media, and scientific research. Stay tuned for real-time benchmark updates and technical teardowns.
                </p>
              )}

              {/* Article Tags */}
              {activeArticleModal.tags && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" /> Topic Tags
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeArticleModal.tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Footer */}
            <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
              
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => toggleLike(activeArticleModal.id, activeArticleModal.likesCount || 120, e)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-pink-300 hover:border-pink-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span>Upvote ({likedArticles[activeArticleModal.id] !== undefined ? likedArticles[activeArticleModal.id] : (activeArticleModal.likesCount || 120)})</span>
                </button>

                <button
                  onClick={(e) => toggleBookmark(activeArticleModal.id, e)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                    bookmarkedIds.includes(activeArticleModal.id)
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                      : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(activeArticleModal.id) ? 'fill-purple-400' : ''}`} />
                  <span>{bookmarkedIds.includes(activeArticleModal.id) ? 'Saved' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={(e) => shareArticle(activeArticleModal, e)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 cursor-pointer transition-all hover:scale-105"
                  title="Share Article"
                >
                  <Share2 className="w-4 h-4 text-cyan-400" />
                </button>
              </div>

              {activeArticleModal.officialUrl && (
                <a
                  href={activeArticleModal.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer ml-auto"
                >
                  <span>Official Press Release</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
