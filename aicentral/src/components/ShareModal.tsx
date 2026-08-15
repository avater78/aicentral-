import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, Sparkles, Search, CheckCircle2, Shield } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  url?: string;
  customMessage?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title = 'AICentral - The Ultimate AI Tools & Prompt Hub',
  url,
  customMessage: initialMessage = 'Discover the best AI tools, engineered prompts, and breaking AI news on AICentral!'
}) => {
  const [copied, setCopied] = useState(false);
  const [customMsg, setCustomMsg] = useState(initialMessage);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://aicentral.app');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${customMsg}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: customMsg,
        url: shareUrl,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const shareTextEncoded = encodeURIComponent(`${customMsg} ${shareUrl}`);
  const shareUrlEncoded = encodeURIComponent(shareUrl);

  // List of all platforms with category tags & modern styling
  const sharePlatforms = [
    {
      id: 'copy',
      name: 'Copy Link',
      category: 'Featured',
      bgColor: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-400 shadow-emerald-500/20',
      onClick: handleCopy,
      icon: <Copy className="w-4 h-4" />
    },
    {
      id: 'youtube',
      name: 'YouTube',
      category: 'Video & Media',
      bgColor: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-rose-400 shadow-red-500/20',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent('AICentral AI tools')}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      category: 'Video & Media',
      bgColor: 'bg-gradient-to-r from-slate-900 via-neutral-900 to-black text-white border border-slate-800 hover:border-cyan-500/50 shadow-cyan-500/10',
      url: `https://www.tiktok.com/search?q=${encodeURIComponent('AICentral AI')}`,
      icon: (
        <svg className="w-4 h-4 fill-current text-cyan-400" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.32 1.56-1.25 2.56.07 1.22.8 2.33 1.95 2.76 1.1.41 2.41.16 3.22-.65.7-.7 1.05-1.7 1.02-2.69-.01-4.71-.01-9.42 0-14.13z"/>
        </svg>
      )
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      category: 'Messaging',
      bgColor: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 shadow-emerald-500/20',
      url: `https://api.whatsapp.com/send?text=${shareTextEncoded}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      )
    },
    {
      id: 'telegram',
      name: 'Telegram',
      category: 'Messaging',
      bgColor: 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:from-sky-400 hover:to-cyan-400 shadow-sky-500/20',
      url: `https://t.me/share/url?url=${shareUrlEncoded}&text=${encodeURIComponent(customMsg)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.03 9.56c-.15.68-.55.84-1.12.52l-3.1-2.29-1.5 1.44c-.16.16-.3.3-.61.3l.22-3.17 5.77-5.21c.25-.22-.05-.35-.39-.12l-7.14 4.5-3.08-.96c-.67-.21-.68-.67.14-.99l12.04-4.64c.56-.2 1.05.14.86.86z"/>
        </svg>
      )
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      category: 'Social',
      bgColor: 'bg-gradient-to-r from-slate-900 via-slate-950 to-black text-white border border-slate-700 hover:border-slate-500 shadow-slate-900/30',
      url: `https://twitter.com/intent/tweet?url=${shareUrlEncoded}&text=${encodeURIComponent(customMsg)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      id: 'facebook',
      name: 'Facebook',
      category: 'Social',
      bgColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      category: 'Social',
      bgColor: 'bg-gradient-to-r from-blue-700 to-sky-600 text-white hover:from-blue-600 hover:to-sky-500 shadow-blue-600/20',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrlEncoded}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/>
        </svg>
      )
    },
    {
      id: 'reddit',
      name: 'Reddit',
      category: 'Social',
      bgColor: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-500 hover:to-amber-500 shadow-orange-500/20',
      url: `https://reddit.com/submit?url=${shareUrlEncoded}&title=${encodeURIComponent(title)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701z"/>
        </svg>
      )
    },
    {
      id: 'blogger',
      name: 'Blogger',
      category: 'Email & Web',
      bgColor: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400 shadow-orange-500/20',
      url: `https://www.blogger.com/blog-this.g?u=${shareUrlEncoded}&n=${encodeURIComponent(title)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M20.25 0H3.75A3.75 3.75 0 0 0 0 3.75v16.5A3.75 3.75 0 0 0 3.75 24h16.5A3.75 3.75 0 0 0 24 20.25V3.75A3.75 3.75 0 0 0 20.25 0zm-3.5 8h-4c-.83 0-1.5.67-1.5 1.5v1c0 .28.22.5.5.5h5c.83 0 1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5zm1 8h-6c-.83 0-1.5.67-1.5 1.5v1c0 .28.22.5.5.5h7c.83 0 1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5z"/>
        </svg>
      )
    },
    {
      id: 'bluesky',
      name: 'Bluesky',
      category: 'Social',
      bgColor: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 shadow-sky-500/20',
      url: `https://bsky.app/intent/compose?text=${shareTextEncoded}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566 1.009 1.562 1.524.93 2.128c-.628.601-.84 1.708-.433 3.012.871 2.787 3.328 6.98 5.768 8.878 1.021.794 2.138 1.396 3.14 1.838-1.002.442-2.119 1.044-3.14 1.838-2.44 1.898-4.897 6.091-5.768 8.878-.407 1.304-.195 2.411.433 3.012.632.604 1.636 1.119 4.272-.678C7.954 20.053 10.913 16.114 12 14c1.087 2.114 4.046 6.053 6.798 7.995 2.636 1.797 3.64.282 4.272-.678.628-.601.84-1.708.433-3.012-.871-2.787-3.328-6.98-5.768-8.878-1.021-.794-2.138-1.396-3.14-1.838 1.002-.442 2.119-1.044 3.14-1.838 2.44-1.898 4.897-6.091 5.768-8.878.407-1.304.195-2.411-.433-3.012-.632-.604-1.636-1.119-4.272.678C16.046 4.747 13.087 8.686 12 10.8z"/>
        </svg>
      )
    },
    {
      id: 'gmail',
      name: 'Gmail',
      category: 'Email & Web',
      bgColor: 'bg-gradient-to-r from-rose-600 to-red-500 text-white hover:from-rose-500 hover:to-red-400 shadow-rose-500/20',
      url: `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${encodeURIComponent(title)}&body=${shareTextEncoded}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052c1.618-1.214 3.927-.059 3.927 1.964z"/>
        </svg>
      )
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      category: 'Social',
      bgColor: 'bg-gradient-to-r from-red-600 to-rose-700 text-white hover:from-red-500 hover:to-rose-600 shadow-red-600/20',
      url: `https://pinterest.com/pin/create/button/?url=${shareUrlEncoded}&description=${encodeURIComponent(customMsg)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.6 0 12.017 0z"/>
        </svg>
      )
    },
    {
      id: 'messenger',
      name: 'Messenger',
      category: 'Messaging',
      bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400 shadow-blue-500/20',
      url: `https://www.facebook.com/dialog/send?link=${shareUrlEncoded}&app_id=291494419107518&redirect_uri=${shareUrlEncoded}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.302 2.252.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.259 5.889-3.259-6.56 6.964z"/>
        </svg>
      )
    },
    {
      id: 'outlook',
      name: 'Outlook',
      category: 'Email & Web',
      bgColor: 'bg-gradient-to-r from-sky-600 to-blue-700 text-white hover:from-sky-500 hover:to-blue-600 shadow-sky-600/20',
      url: `https://outlook.live.com/owa/?path=/mail/action/compose&subject=${encodeURIComponent(title)}&body=${shareTextEncoded}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 7.5v9a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3zM12 13.5l10.5-6H1.5L12 13.5z"/>
        </svg>
      )
    },
    {
      id: 'hackernews',
      name: 'HackerNews',
      category: 'Social',
      bgColor: 'bg-gradient-to-r from-amber-600 to-orange-500 text-white hover:from-amber-500 hover:to-orange-400 shadow-amber-500/20',
      url: `https://news.ycombinator.com/submitlink?u=${shareUrlEncoded}&t=${encodeURIComponent(title)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M0 0v24h24V0H0zm12.9 14.7v5.3h-2v-5.3L6.5 6h2.4l2.9 6 3-6h2.4l-4.3 8.7z"/>
        </svg>
      )
    },
    {
      id: 'line',
      name: 'Line',
      category: 'Messaging',
      bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 shadow-green-500/20',
      url: `https://social-plugins.line.me/lineit/share?url=${shareUrlEncoded}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19.34 10.12c0-3.83-3.85-6.94-8.58-6.94s-8.58 3.11-8.58 6.94c0 3.43 3.05 6.3 7.18 6.81.28.06.66.19.76.43.08.2.06.51.03.71l-.13.79c-.04.24-.19.93.81.51 1-.42 5.39-3.17 7.35-5.43 1.22-1.33 1.16-2.58 1.16-3.82z"/>
        </svg>
      )
    },
    {
      id: 'vk',
      name: 'VKontakte',
      category: 'Social',
      bgColor: 'bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-500 hover:to-sky-500 shadow-blue-500/20',
      url: `https://vk.com/share.php?url=${shareUrlEncoded}&title=${encodeURIComponent(title)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.644c-.623 0-.813-.495-1.933-1.616-1.12-1.12-1.616-1.268-1.896-1.268-.39 0-.5.11-.5.645v1.616c0 .414-.132.623-1.22.623-1.81 0-3.818-1.1-5.234-3.14-2.13-3.003-2.712-5.253-2.712-5.717 0-.25.095-.484.58-.484h1.644c.437 0 .602.196.77.672.846 2.45 2.27 4.594 2.854 4.594.223 0 .324-.102.324-.658V9.897c-.07-.1.082-.1.082-.1.082-.082.322-.118.598-.118.423 0 .783.056.983.172.197.118.197.382.197.77v3.085c0 .337.146.452.247.452.223 0 .408-.115.828-.535 1.282-1.42 2.195-3.618 2.195-3.618 0-.118.102-.3.484-.3h1.644c.493 0 .602.25.493.602-.218.995-2.298 3.94-2.298 3.94-.183.278-.25.408 0 .74 0 0 2.128 2.88 2.41 4.148.167.502-.1.74-.594.74z"/>
        </svg>
      )
    },
    {
      id: 'tumblr',
      name: 'Tumblr',
      category: 'Social',
      bgColor: 'bg-gradient-to-r from-slate-700 to-indigo-900 text-white hover:from-slate-600 hover:to-indigo-800 shadow-indigo-900/20',
      url: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${shareUrlEncoded}&caption=${encodeURIComponent(customMsg)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469h3.35v5.52h4.522v3.048h-4.522v7.124c0 1.485.877 2.228 2.302 2.228 1.135 0 2.2-.423 2.2-.423v3.313s-1.898 1.012-3.115 1.012z"/>
        </svg>
      )
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      category: 'Email & Web',
      bgColor: 'bg-gradient-to-r from-sky-700 to-indigo-800 text-white hover:from-sky-600 hover:to-indigo-700 shadow-sky-700/20',
      url: `https://wordpress.com/wp-admin/press-this.php?u=${shareUrlEncoded}&t=${encodeURIComponent(title)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.158 0C5.457 0 0 5.457 0 12.158c0 6.702 5.457 12.158 12.158 12.158 6.702 0 12.158-5.456 12.158-12.158C24.316 5.457 18.86 0 12.158 0zm.001 2.373c2.251 0 4.318.736 5.993 1.972l-3.212 9.324-2.781-8.077c.365-.034.733-.051 1.096-.051zm-7.98 2.748c1.398-1.442 3.32-2.33 5.45-2.33.242 0 .482.012.72.035L5.783 16.321l-1.604-5.201a11.905 11.905 0 0 1 .001-5.999zm7.98 16.664c-1.82 0-3.518-.521-4.96-1.42l3.228-9.37 3.266 9.07c-1.28.113-2.58.113-3.86.033zm5.727-2.321l2.45-7.11c.42 1.48.65 3.03.65 4.63 0 1.96-.51 3.8-1.4 5.39l-1.7-2.91z"/>
        </svg>
      )
    }
  ];

  const categories = ['All', 'Featured', 'Messaging', 'Social', 'Video & Media', 'Email & Web'];

  const filteredPlatforms = sharePlatforms.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory || (selectedCategory === 'Featured' && (p.id === 'copy' || p.id === 'whatsapp' || p.id === 'telegram' || p.id === 'twitter' || p.id === 'youtube' || p.id === 'tiktok'));
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      
      {/* Glow Effects Behind Modal */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-4xl bg-slate-950/90 border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col text-slate-100 ring-1 ring-white/10 max-h-[92vh] backdrop-blur-2xl">
        
        {/* Modern Modal Header */}
        <div className="px-6 py-4.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-cyan-300 shadow-inner">
              <Share2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span>Share Hub</span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm">
                  Universal Share
                </span>
              </h3>
              <p className="text-xs text-slate-400">Distribute AICentral tools & prompts across all major networks</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Direct Link & Custom Caption Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-950 border border-slate-800/90 shadow-xl space-y-3.5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-all" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-extrabold tracking-wider text-slate-200 uppercase">
                  Direct Link
                </span>
              </div>
              
              <button
                onClick={handleNativeShare}
                className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 cursor-pointer transition-all hover:scale-105"
                title="Native Share"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            {/* URL Input with Instant Copy */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <div className="w-full relative flex-1">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 focus:outline-none select-all font-mono tracking-tight"
                />
              </div>

              <button
                onClick={handleCopy}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-extrabold text-xs shrink-0 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-slate-950 font-black shadow-cyan-500/25'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Copied Link!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="space-y-3">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter social networks & apps..."
                  className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-bold">
                  {filteredPlatforms.length} Networks
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-cyan-300 border-purple-500/50 shadow-md ring-1 ring-cyan-400/30'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Social Networks Cards Grid */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {filteredPlatforms.map((platform) => {
                if (platform.onClick) {
                  return (
                    <button
                      key={platform.id}
                      onClick={platform.onClick}
                      className={`h-11 px-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-start gap-2.5 transition-all cursor-pointer shadow-md hover:scale-[1.04] active:scale-95 ${platform.bgColor}`}
                    >
                      {copied && platform.id === 'copy' ? (
                        <Check className="w-4 h-4 shrink-0 text-white" />
                      ) : (
                        <div className="shrink-0">{platform.icon}</div>
                      )}
                      <span className="truncate">{copied && platform.id === 'copy' ? 'Copied!' : platform.name}</span>
                    </button>
                  );
                }

                return (
                  <a
                    key={platform.id}
                    href={platform.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`h-11 px-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-start gap-2.5 transition-all cursor-pointer shadow-md hover:scale-[1.04] active:scale-95 ${platform.bgColor}`}
                  >
                    <div className="shrink-0">{platform.icon}</div>
                    <span className="truncate">{platform.name}</span>
                  </a>
                );
              })}
            </div>

            {filteredPlatforms.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                No matching network found for "{searchQuery}". Try a different keyword!
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Banner */}
        <div className="px-6 py-3 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure 1-Click Sharing</span>
          </span>
          <span className="text-slate-500">AICentral Network Hub v2.4</span>
        </div>

      </div>
    </div>
  );
};
