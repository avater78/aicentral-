import React, { useState } from 'react';
import { AITool, ToolReview } from '../types';
import {
  X,
  ExternalLink,
  ShieldCheck,
  Star,
  Bookmark,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  FileText,
  Github,
  MessageSquare,
  Linkedin,
  Twitter,
  Youtube,
  Code,
  Layers,
  Sparkles,
  Zap,
  HelpCircle,
  Send
} from 'lucide-react';

interface ToolDetailModalProps {
  tool: AITool | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (toolId: string) => void;
  allTools: AITool[];
  onSelectAlternative: (tool: AITool) => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  onClose,
  isSaved,
  onToggleSave,
  allTools,
  onSelectAlternative
}) => {
  if (!tool) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'reviews' | 'changelog' | 'faqs'>('overview');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState<ToolReview[]>(tool.reviews || []);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const added: ToolReview = {
      id: `r-${Date.now()}`,
      userName: 'You (AI Explorer)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64',
      rating: newReviewRating,
      comment: newReviewText.trim(),
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      badge: 'Verified User'
    };

    setLocalReviews([added, ...localReviews]);
    setNewReviewText('');
  };

  // Find alternative tool objects matching names
  const alternativeToolObjects = allTools.filter((t) =>
    tool.alternatives.some((alt) => alt.toLowerCase() === t.name.toLowerCase() || alt.toLowerCase() === t.id.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-100">
        
        {/* Top Header Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-purple-500/20 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={tool.logo}
                alt={tool.name}
                className="w-16 h-16 rounded-2xl object-cover border border-purple-500/30 p-1 bg-slate-950 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-100">{tool.name}</h2>
                  {tool.verified && (
                    <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Verified Official
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 font-medium mt-0.5">{tool.tagline}</p>

                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="px-2.5 py-0.5 rounded-md font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {tool.pricingType}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{tool.rating.toFixed(1)}</span>
                    <span className="text-slate-500 font-normal">({localReviews.length} reviews)</span>
                  </div>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" /> Updated {tool.lastUpdated}
                  </span>
                </div>
              </div>
            </div>

            {/* Save & Direct Link Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                onClick={() => onToggleSave(tool.id)}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  isSaved
                    ? 'bg-violet-600/30 text-violet-300 border-violet-500/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-violet-400' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save Tool'}</span>
              </button>

              <a
                href={tool.officialLinks.website}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all hover:scale-105"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Official Links Toolbar */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-purple-500/10 flex items-center gap-2 overflow-x-auto text-xs font-medium">
          <span className="text-slate-400 shrink-0">Official Channels:</span>
          {tool.officialLinks.website && (
            <a href={tool.officialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Website
            </a>
          )}
          {tool.officialLinks.documentation && (
            <a href={tool.officialLinks.documentation} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors">
              <FileText className="w-3.5 h-3.5 text-purple-400" /> Docs
            </a>
          )}
          {tool.officialLinks.github && (
            <a href={tool.officialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors">
              <Github className="w-3.5 h-3.5 text-slate-300" /> GitHub
            </a>
          )}
          {tool.officialLinks.discord && (
            <a href={tool.officialLinks.discord} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Discord
            </a>
          )}
          {tool.officialLinks.twitter && (
            <a href={tool.officialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors">
              <Twitter className="w-3.5 h-3.5 text-sky-400" /> X (Twitter)
            </a>
          )}
          {tool.officialLinks.youtube && (
            <a href={tool.officialLinks.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors">
              <Youtube className="w-3.5 h-3.5 text-red-400" /> YouTube
            </a>
          )}
        </div>

        {/* Modal Tabs Bar */}
        <div className="px-6 border-b border-purple-500/10 flex items-center gap-4 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview & Pricing' },
            { id: 'features', label: 'Pros, Cons & Specs' },
            { id: 'reviews', label: `Reviews (${localReviews.length})` },
            { id: 'faqs', label: 'FAQs & Tutorials' },
            { id: 'changelog', label: 'Changelog' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Detailed Description */}
              <div>
                <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-2">
                  About {tool.name}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {tool.fullDescription}
                </p>
              </div>

              {/* Screenshots Gallery */}
              {tool.screenshots && tool.screenshots.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-2">
                    Visual Previews & Interface
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tool.screenshots.map((img, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                        <img src={img} alt={`${tool.name} preview ${i}`} className="w-full h-48 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Breakdown Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/20">
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-1">
                  Pricing & Trial Details
                </h3>
                <p className="text-sm font-semibold text-slate-200">{tool.pricingDetails}</p>
              </div>

              {/* Alternatives & Similar Tools */}
              {alternativeToolObjects.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">
                    Similar & Alternative AI Tools
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {alternativeToolObjects.map((alt) => (
                      <div
                        key={alt.id}
                        onClick={() => onSelectAlternative(alt)}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center gap-3"
                      >
                        <img src={alt.logo} alt={alt.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="text-xs font-bold text-slate-200 hover:text-cyan-300">{alt.name}</div>
                          <div className="text-[10px] text-slate-400">{alt.pricingType} • {alt.rating}★</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FEATURES, PROS, CONS */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              
              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Pros */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Strengths (Pros)
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {tool.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-400" /> Limitations (Cons)
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {tool.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/20 space-y-3">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Technical Specifications & Compatibility
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">AI Model Used</span>
                    <span className="font-semibold text-slate-200">{tool.aiModelUsed}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">API Available</span>
                    <span className="font-semibold text-slate-200">{tool.apiAvailable ? 'Yes (REST/WS)' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Commercial License</span>
                    <span className="font-semibold text-slate-200">{tool.commercialLicense ? 'Allowed' : 'Non-commercial'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Open Source</span>
                    <span className="font-semibold text-slate-200">{tool.openSource ? 'Yes' : 'Proprietary'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 text-[10px] block mb-1">Supported Languages</span>
                  <div className="flex flex-wrap gap-1">
                    {tool.languages.map((lang) => (
                      <span key={lang} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-300 border border-slate-800">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 text-[10px] block mb-1">Integrations</span>
                  <div className="flex flex-wrap gap-1">
                    {tool.integrations.map((integ) => (
                      <span key={integ} className="px-2 py-0.5 rounded bg-purple-950/40 text-[10px] text-purple-300 border border-purple-500/30">
                        {integ}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="p-4 rounded-xl bg-slate-950 border border-purple-500/20 space-y-3">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Leave a Community Rating & Review
                </h4>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= newReviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Share your experience using this AI tool..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {localReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <span className="text-xs font-bold text-slate-200">{rev.userName}</span>
                          <span className="text-[10px] text-slate-500 ml-2">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FAQS & TUTORIALS */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              
              {/* Tutorials */}
              {tool.tutorials && tool.tutorials.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                    Official & Community Video Guides
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tool.tutorials.map((tut, idx) => (
                      <a
                        key={idx}
                        href={tut.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Youtube className="w-4 h-4 text-red-400 shrink-0" />
                          <span className="line-clamp-1">{tut.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal shrink-0">{tut.duration}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              <div>
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3">
                  Frequently Asked Questions
                </h4>
                <div className="space-y-2">
                  {tool.faqs.map((faq, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{faq.question}</span>
                      </div>
                      <p className="text-slate-400 pl-5 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CHANGELOG */}
          {activeTab === 'changelog' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3">
                Release History & Updates
              </h4>
              {tool.changelog.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-purple-500/20 relative pl-6">
                  <div className="absolute left-2.5 top-5 w-2 h-2 rounded-full bg-cyan-400" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">{item.version} — {item.title}</span>
                    <span className="text-[10px] text-slate-500">{item.date}</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300">
                    {item.changes.map((ch, i) => (
                      <li key={i}>• {ch}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
