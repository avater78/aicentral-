import React from 'react';
import { Share2, Mail, Send } from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenShare?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenShare }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="cursor-pointer inline-block" onClick={() => setActiveTab('discover')}>
              <Logo size="md" />
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Platform Tools</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('discover')} className="hover:text-cyan-300 transition-colors">{t('discover')}</button></li>
              <li><button onClick={() => setActiveTab('match-finder')} className="hover:text-cyan-300 transition-colors">{t('match')}</button></li>
              <li><button onClick={() => setActiveTab('workflow-builder')} className="hover:text-cyan-300 transition-colors">{t('workflows')}</button></li>
              <li><button onClick={() => setActiveTab('ai-detector')} className="hover:text-cyan-300 transition-colors">{t('detector')}</button></li>
              <li><button onClick={() => setActiveTab('comparison-engine')} className="hover:text-cyan-300 transition-colors">{t('compare')}</button></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Learning & Resources</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('prompt-library')} className="hover:text-cyan-300 transition-colors">{t('prompts')}</button></li>
              <li><button onClick={() => setActiveTab('skill-academy')} className="hover:text-cyan-300 transition-colors">{t('academy')}</button></li>
              <li><button onClick={() => setActiveTab('news-blog')} className="hover:text-cyan-300 transition-colors">{t('news')}</button></li>
            </ul>
          </div>

          {/* Weekly Digest Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Join 85,000+ AI Pioneers</h4>
            <p className="text-slate-400">Get weekly breaking AI tools and prompt updates straight to your inbox.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = 'mailto:u15041338@gmail.com?subject=Inquiry%20from%20AICentral';
              }}
              className="flex gap-1.5"
            >
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shrink-0 shadow-md cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AICentral Inc. {t('allRightsReserved')}</p>

          {/* Colorful Social & Share Buttons in order: Telegram, WhatsApp, Email, Twitter, Share */}
          <div className="flex items-center gap-2.5">
            {/* 1. Telegram Button */}
            <a
              href="https://t.me/AIcentral12"
              target="_blank"
              rel="noreferrer"
              className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 flex items-center justify-center text-sky-400 hover:text-sky-300 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="Telegram Channel (@AIcentral12)"
            >
              <Send className="w-4 h-4 text-sky-400" />
            </a>

            {/* 2. WhatsApp Button */}
            <a
              href="https://chat.whatsapp.com/IuAKPEpfvye9EIboEZUMUJ"
              target="_blank"
              rel="noreferrer"
              className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:text-emerald-300 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="WhatsApp Group"
            >
              <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.149 4.197 4.292-1.127z"/>
              </svg>
            </a>

            {/* 3. Email Button */}
            <a
              href="mailto:u15041338@gmail.com?subject=Contact%20AICentral"
              className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 flex items-center justify-center text-rose-400 hover:text-rose-300 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="Email Contact (u15041338@gmail.com)"
            >
              <Mail className="w-4 h-4 text-rose-400" />
            </a>

            {/* 4. Twitter / X Button */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="X (Twitter)"
            >
              <svg className="w-3.5 h-3.5 fill-current text-slate-200" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* 5. Share Button */}
            <button
              onClick={() => {
                if (onOpenShare) {
                  onOpenShare();
                } else if (navigator.share) {
                  navigator.share({ title: 'AICentral', url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 flex items-center justify-center text-indigo-400 hover:text-indigo-300 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="Share AICentral"
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

