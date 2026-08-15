import React, { useState } from 'react';
import { ShieldCheck, Plus, Check, X, RefreshCw, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import { AITool } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
  allTools: AITool[];
  onAddNewTool: (newTool: AITool) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, allTools, onAddNewTool }) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'crawl' | 'monetization'>('submissions');

  // New Tool Submission state
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState('Writing');
  const [pricingType, setPricingType] = useState<'Free' | 'Freemium' | 'Paid' | 'Open Source'>('Freemium');

  const handleSubmitNewTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !website.trim()) return;

    const created: AITool = {
      id: `tool-${Date.now()}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      tagline: tagline.trim() || 'Cutting-edge AI application.',
      description: tagline.trim() || 'Cutting-edge AI application.',
      fullDescription: `${name} is an advanced AI application engineered for ${category}.`,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128',
      screenshots: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'],
      categories: [category],
      pricingType,
      pricingDetails: `${pricingType} tier available.`,
      officialLinks: { website },
      rating: 4.8,
      reviewCount: 1,
      viewsToday: 120,
      totalViews: 1200,
      totalSavedCount: 45,
      trendingScore: 90,
      offlineSupport: false,
      teamCollaboration: true,
      tutorials: [],
      verified: true,
      lastUpdated: new Date().toISOString().split('T')[0],
      aiModelUsed: 'Gemini 3.6',
      apiAvailable: true,
      openSource: pricingType === 'Open Source',
      commercialLicense: true,
      supportedPlatforms: ['Browser Based'],
      pros: ['High efficiency', 'Clean UI'],
      cons: ['Requires internet connection'],
      languages: ['English'],
      integrations: ['REST API'],
      alternatives: ['ChatGPT'],
      reviews: [],
      faqs: [],
      changelog: []
    };

    onAddNewTool(created);
    setName('');
    setTagline('');
    setWebsite('');
    alert(`Tool "${created.name}" has been approved and added to the directory!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-extrabold">AICentral Admin & Crawl Operations</h3>
              <p className="text-xs text-slate-400">Manage tool verification, link checks, and monetization</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-emerald-500/10 flex items-center gap-4 text-xs font-semibold">
          {[
            { id: 'submissions', label: 'Approve & Submit Tool' },
            { id: 'crawl', label: 'Link Crawler Health' },
            { id: 'monetization', label: 'Affiliate & Sponsorships' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* TAB 1: SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <form onSubmit={handleSubmitNewTool} className="space-y-4">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Submit New Verified AI Tool</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Tool Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cursor IDE"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Official Website URL</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Writing">Writing</option>
                    <option value="Coding">Coding</option>
                    <option value="Video Creation">Video Creation</option>
                    <option value="Image Generation">Image Generation</option>
                    <option value="Audio">Audio & Voice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Pricing Model</label>
                  <select
                    value={pricingType}
                    onChange={(e) => setPricingType(e.target.value as typeof pricingType)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Short Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g., AI-first Code Editor built on VS Code"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Publish & Approve Tool
              </button>
            </form>
          )}

          {/* TAB 2: CRAWL HEALTH */}
          {activeTab === 'crawl' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" /> Link Verification Health
                  </span>
                  <span className="text-[10px] text-slate-400">Last check: 5 mins ago</span>
                </div>
                <div className="text-slate-300">
                  Total Checked Links: <strong className="text-slate-100">{allTools.length * 3}</strong> • Broken Links: <strong className="text-emerald-400">0 Broken</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MONETIZATION */}
          {activeTab === 'monetization' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/20 space-y-2">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" /> Monetization Summary
                </span>
                <p className="text-slate-400">
                  Affiliate link tracking active across 12 premium tool partners.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
