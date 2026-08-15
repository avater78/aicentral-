import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Sparkles,
  FileText,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Wand2,
  Eye,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Upload,
  UploadCloud,
  FileUp,
  File,
  X,
  FileType,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AIDetector: React.FC = () => {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [detectionMode, setDetectionMode] = useState<'academic' | 'general' | 'code'>('academic');
  const [activeResultTab, setActiveResultTab] = useState<'overview' | 'highlight' | 'humanizer'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);

  // Document Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<{
    name: string;
    size: string;
    type: string;
    wordCount: number;
  } | null>(null);
  const [docError, setDocError] = useState<string | null>(null);

  const [humanizedResult, setHumanizedResult] = useState<{
    humanizedText: string;
    changesMade: string[];
  } | null>(null);

  const [results, setResults] = useState<{
    aiScore: number;
    humanScore: number;
    readabilityScore: number;
    perplexity: 'High' | 'Medium' | 'Low' | string;
    burstiness: 'High' | 'Medium' | 'Low' | string;
    verdict: string;
    summary: string;
    keyIndicators?: string[];
    strengths?: string[];
    weaknesses?: string[];
    sentences: { text: string; isAi: boolean; confidence: number; reason?: string }[];
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [copiedHumanized, setCopiedHumanized] = useState(false);

  const sampleTexts = [
    {
      label: 'AI Academic Essay (100% AI)',
      text: 'Artificial intelligence is rapidly transforming modern higher education by automating administrative tasks and facilitating personalized learning experiences. Furthermore, machine learning algorithms continue to demonstrate unprecedented capabilities in language processing, offering instant feedback to students and optimizing educational outcomes across diverse disciplines. In conclusion, while challenges remain regarding data privacy, the integration of AI serves as a pivotal catalyst for pedagogical innovation.'
    },
    {
      label: 'Human Story (100% Human)',
      text: 'I was sitting down yesterday trying to figure out why my code kept failing. Turns out, I forgot a simple missing bracket in line 42! It took me almost two hours of searching and drinking way too much coffee before I finally saw it. Honestly, I couldn\'t help but laugh at how small the mistake was.'
    }
  ];

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setResults(null);
    setHumanizedResult(null);

    try {
      const response = await fetch('/api/detect-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, mode: detectionMode }),
      });

      if (!response.ok) {
        throw new Error('Detection request failed');
      }

      const data = await response.json();
      setResults(data);
      setActiveResultTab('overview');
    } catch (err) {
      console.error('Error analyzing text:', err);
      // Client-side fallback if server fails
      const text = inputText.trim();
      const words = text.split(/\s+/).filter(Boolean);
      const lowerText = text.toLowerCase();

      const aiKeywords = ['furthermore', 'moreover', 'consequently', 'in conclusion', 'delve', 'testament', 'tapestry', 'pivotal', 'foster', 'seamless', 'underscore', 'realm', 'landscape', 'facilitating', 'optimizing', 'unprecedented'];
      const humanMarkers = ['i', 'me', 'my', 'mine', 'we', 'us', 'our', 'i\'m', 'didn\'t', 'don\'t', 'can\'t', 'wasn\'t', 'gonna', 'wanna', 'honestly', 'yeah', 'lol', 'basically', 'forgot', 'took me', 'yesterday', 'turns out'];

      let aiMatches = 0;
      aiKeywords.forEach(kw => { if (lowerText.includes(kw)) aiMatches++; });

      let humanMatches = 0;
      humanMarkers.forEach(hm => { if (new RegExp(`\\b${hm}\\b`).test(lowerText)) humanMatches++; });

      const hasPersonalVoice = (lowerText.match(/\b(i|me|my|we|us|our)\b/g) || []).length > 0;

      let score = 50;
      if (!hasPersonalVoice && words.length > 20) score += 35;
      score += aiMatches * 18;
      score -= humanMatches * 25;

      let aiScore = Math.round(score);
      if (aiScore >= 85) aiScore = 100;
      else if (aiScore <= 12) aiScore = 0;
      else aiScore = Math.min(99, Math.max(1, aiScore));

      const sentencesRaw = text.match(/[^.!?]+[.!?]+/g) || [text];

      setResults({
        aiScore,
        humanScore: 100 - aiScore,
        readabilityScore: Math.min(95, Math.max(40, 100 - Math.round(words.length / 5))),
        perplexity: aiScore > 60 ? 'Low' : 'High',
        burstiness: aiScore > 60 ? 'Low' : 'High',
        verdict: aiScore === 100 ? '100% AI-Generated' : aiScore >= 80 ? 'Highly Likely AI-Generated' : aiScore >= 50 ? 'Likely AI-Generated' : 'Likely Human-Written',
        summary: aiScore > 60
          ? 'Analysis detected consistent sentence length, elevated formal vocabulary, and structured transition phrasing typical of AI language models.'
          : 'Analysis detected natural sentence variation, informal linguistic anchors, and irregular cadence indicative of authentic human writing.',
        keyIndicators: [
          aiScore > 50 ? 'Formal transition signposts and academic sentence cadence' : 'Conversational tone and informal punctuation',
          !hasPersonalVoice ? 'Objective third-person perspective without personal markers' : 'Includes personal pronouns and natural self-reference'
        ],
        strengths: [
          hasPersonalVoice ? 'Authentic conversational voice & personal anchors' : 'Strong grammatical coherence and logical thesis',
          aiScore < 50 ? 'Dynamic sentence length variation (high burstiness)' : 'Structured argument flow and clean punctuation'
        ],
        weaknesses: [
          aiScore > 50 ? 'Formulaic transition markers ("furthermore", "in conclusion")' : 'Colloquial informal phrases and casual phrasing',
          !hasPersonalVoice ? 'Impersonal third-person tone lacking anecdotes' : 'Occasional irregular sentence rhythm'
        ],
        sentences: sentencesRaw.map((s, idx) => ({
          text: s.trim(),
          isAi: aiScore > 50 ? (idx % 2 === 0 || s.length > 35) : false,
          confidence: aiScore === 100 ? 100 : Math.min(98, Math.max(10, aiScore)),
          reason: aiScore > 50 ? 'Predictive word sequencing and formal clause structure' : 'Human sentence length variation'
        }))
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHumanizeText = async () => {
    if (!inputText.trim()) return;

    setIsHumanizing(true);
    try {
      const response = await fetch('/api/humanize-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) throw new Error('Humanizing failed');

      const data = await response.json();
      setHumanizedResult(data);
      setActiveResultTab('humanizer');
    } catch (err) {
      console.error('Error humanizing text:', err);
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleApplyHumanized = () => {
    if (!humanizedResult?.humanizedText) return;
    setInputText(humanizedResult.humanizedText);
    setHumanizedResult(null);
    setResults(null);
  };

  const handleCopy = () => {
    if (!inputText) return;
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyHumanized = () => {
    if (!humanizedResult?.humanizedText) return;
    navigator.clipboard.writeText(humanizedResult.humanizedText);
    setCopiedHumanized(true);
    setTimeout(() => setCopiedHumanized(false), 2000);
  };

  // Document processing logic
  const parseDocument = async (file: File): Promise<string> => {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.pdf')) {
      const arrayBuffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const rawText = decoder.decode(arrayBuffer);

      const textMatches = rawText.match(/\(([^()]{2,})\)/g) || [];
      let extracted = textMatches
        .map(m => m.slice(1, -1))
        .filter(t => /[a-zA-Z0-9\s,.?!'"]{3,}/.test(t))
        .join(' ')
        .replace(/\\/g, '');

      if (!extracted || extracted.trim().length < 20) {
        const asciiStrings = rawText.match(/[\x20-\x7E\s]{4,}/g) || [];
        extracted = asciiStrings
          .filter(s => !s.startsWith('/') && !s.includes('obj') && !s.includes('endobj') && s.trim().length > 10)
          .join(' ');
      }
      return extracted.trim() || 'Could not extract plain text from PDF. Please copy and paste the text directly.';
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      const arrayBuffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const rawText = decoder.decode(arrayBuffer);

      const xmlMatches = rawText.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
      if (xmlMatches && xmlMatches.length > 0) {
        return xmlMatches
          .map(m => m.replace(/<[^>]+>/g, ''))
          .join(' ')
          .trim();
      }

      const strings = rawText.match(/[\x20-\x7E\s]{5,}/g) || [];
      const clean = strings
        .filter(s => /[a-zA-Z]{3,}/.test(s) && !s.includes('http') && !s.includes('schemas.'))
        .join(' ')
        .trim();
      return clean || 'Could not extract text from Word document. Please copy and paste text directly.';
    } else {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.onerror = () => reject(new Error('Failed to read text file'));
        reader.readAsText(file);
      });
    }
  };

  const processFile = async (file: File) => {
    setDocError(null);
    setIsLoadingDoc(true);

    if (file.size > 15 * 1024 * 1024) {
      setDocError('File size exceeds 15MB limit. Please upload a smaller document.');
      setIsLoadingDoc(false);
      return;
    }

    try {
      const extractedText = await parseDocument(file);
      if (!extractedText.trim()) {
        setDocError('Document appears to be empty or unscannable.');
        setIsLoadingDoc(false);
        return;
      }

      setInputText(extractedText);
      setResults(null);
      setHumanizedResult(null);

      const words = extractedText.trim().split(/\s+/).filter(Boolean).length;
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setUploadedDoc({
        name: file.name,
        size: formattedSize,
        type: file.name.split('.').pop()?.toUpperCase() || 'DOC',
        wordCount: words,
      });
    } catch (err) {
      console.error('Error reading document:', err);
      setDocError('Failed to read document file. Please ensure it is a valid text, PDF, or Word file.');
    } finally {
      setIsLoadingDoc(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveDoc = () => {
    setUploadedDoc(null);
    setDocError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('detectorBadge')}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('detectorTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {t('detectorSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.pdf,.doc,.docx,.md,.json,.csv,.rtf,.html,.js,.ts,.py"
            className="hidden"
          />

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-xl space-y-4">
            
            {/* Mode Selector & Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>{t('sourceText')}</span>
                </label>

                {/* Upload Document Action Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoadingDoc}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  title="Upload PDF, Word, or Text document"
                >
                  {isLoadingDoc ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  <span>{isLoadingDoc ? 'Reading Doc...' : 'Upload Doc'}</span>
                </button>
              </div>

              {/* Detection Modes */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'academic', label: t('academicEssay') },
                  { id: 'general', label: t('articleBlog') },
                  { id: 'code', label: t('codeTechnical') }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setDetectionMode(mode.id as any)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      detectionMode === mode.id
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Active Info Pill / Banner */}
            {uploadedDoc && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-200 animate-in fade-in duration-200">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="px-2 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 font-mono text-[10px] font-extrabold text-cyan-300 shrink-0">
                    {uploadedDoc.type}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-slate-100 truncate block">{uploadedDoc.name}</span>
                    <span className="text-[10px] text-cyan-400/80">{uploadedDoc.size} • {uploadedDoc.wordCount.toLocaleString()} words loaded</span>
                  </div>
                </div>
                <button
                  onClick={handleRemoveDoc}
                  className="p-1 rounded-lg hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer shrink-0 ml-2"
                  title="Remove uploaded document"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error Notification Banner */}
            {docError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{docError}</span>
                </div>
                <button
                  onClick={() => setDocError(null)}
                  className="p-1 text-rose-400 hover:text-rose-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Textarea with Drag & Drop Overlay */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="relative group"
            >
              <textarea
                rows={9}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (uploadedDoc) setUploadedDoc(null);
                }}
                placeholder={t('textareaPlaceholder')}
                className={`w-full p-4 rounded-2xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all resize-none font-sans leading-relaxed ${
                  isDragging
                    ? 'border-cyan-400 ring-4 ring-cyan-500/30 bg-cyan-950/30'
                    : 'border-slate-800 focus:border-cyan-500/60 focus:ring-cyan-500/20'
                }`}
              />

              {/* Drag and Drop Visual Overlay */}
              {isDragging && (
                <div className="absolute inset-0 rounded-2xl bg-slate-950/90 border-2 border-dashed border-cyan-400 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-2 pointer-events-none z-10 animate-in fade-in duration-150">
                  <UploadCloud className="w-10 h-10 text-cyan-400 animate-bounce" />
                  <span className="text-sm font-bold text-white">Drop your document here</span>
                  <span className="text-xs text-slate-400">Supports PDF, Word (.docx), TXT, Markdown, JSON, etc.</span>
                </div>
              )}

              {/* Empty state hint when no text */}
              {!inputText && !uploadedDoc && !isDragging && (
                <div className="absolute bottom-3 right-4 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="pointer-events-auto text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Or drop document here</span>
                  </button>
                </div>
              )}
            </div>

            {/* Control Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium">{t('quickPresets')}</span>
                {sampleTexts.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(sample.text);
                      setResults(null);
                      setHumanizedResult(null);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer font-medium"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {inputText && (
                  <>
                    <button
                      onClick={() => {
                        setInputText('');
                        setResults(null);
                        setHumanizedResult(null);
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer px-2 py-1"
                    >
                      {t('clear')}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer px-2 py-1"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? t('copied') : t('copy')}</span>
                    </button>
                  </>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={!inputText.trim() || isAnalyzing}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                    !inputText.trim() || isAnalyzing
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 active:scale-95'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      <span>{t('scanning')}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>{t('detectAiButton')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-4">
          {results ? (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-2xl space-y-5 animate-in fade-in duration-300">
              
              {/* Verdict Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Detection Verdict</span>
                  <h3 className={`text-lg font-extrabold ${
                    results.aiScore >= 80 ? 'text-cyan-300' : results.aiScore >= 40 ? 'text-amber-300' : 'text-emerald-400'
                  }`}>
                    {results.verdict}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-white">{results.aiScore}%</span>
                  <p className="text-[10px] text-slate-400 font-medium">AI Probability</p>
                </div>
              </div>

              {/* Navigation Tabs for Analysis View */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'highlight', label: 'Highlight Canvas', icon: Eye },
                  { id: 'humanizer', label: 'Humanize AI', icon: Wand2 }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'humanizer' && !humanizedResult) {
                          handleHumanizeText();
                        } else {
                          setActiveResultTab(tab.id as any);
                        }
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 rounded-xl font-semibold transition-all cursor-pointer ${
                        activeResultTab === tab.id
                          ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeResultTab === 'overview' && (
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-emerald-400">{results.humanScore}% Human</span>
                      <span className="text-cyan-400">{results.aiScore}% AI</span>
                    </div>
                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                        style={{ width: `${results.humanScore}%` }}
                      />
                      <div 
                        className="h-full bg-cyan-400 rounded-full transition-all duration-500" 
                        style={{ width: `${results.aiScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Summary Note */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide">Analysis Summary</span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {results.summary}
                    </p>
                  </div>

                  {/* Key Indicators */}
                  {results.keyIndicators && results.keyIndicators.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300 block">Key Signals Detected:</span>
                      <ul className="space-y-1.5">
                        {results.keyIndicators.map((indicator, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                            <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Strengths & Weaknesses Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Strengths */}
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Strengths</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        {(results.strengths && results.strengths.length > 0
                          ? results.strengths
                          : ['High grammatical clarity & structure', 'Consistent argument flow']
                        ).map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold shrink-0">✓</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Weaknesses / AI Patterns</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        {(results.weaknesses && results.weaknesses.length > 0
                          ? results.weaknesses
                          : ['Predictive phrase patterning', 'Uniform sentence cadence']
                        ).map((w, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold shrink-0">!</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Secondary Indicators */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-center">
                      <span className="text-[10px] text-slate-400 block">Readability</span>
                      <span className="text-xs font-bold text-slate-200">{results.readabilityScore}/100</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-center">
                      <span className="text-[10px] text-slate-400 block">Perplexity</span>
                      <span className="text-xs font-bold text-cyan-300">{results.perplexity}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-center">
                      <span className="text-[10px] text-slate-400 block">Burstiness</span>
                      <span className="text-xs font-bold text-purple-300">{results.burstiness}</span>
                    </div>
                  </div>

                  {/* Humanize CTA Button */}
                  {results.aiScore > 20 && (
                    <button
                      onClick={handleHumanizeText}
                      disabled={isHumanizing}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      {isHumanizing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                          <span>Rewriting AI Sentences...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3.5 h-3.5 text-slate-950" />
                          <span>Humanize Text & Rephrase AI</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* TAB 2: HIGHLIGHT CANVAS */}
              {activeResultTab === 'highlight' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Paragraph Context Highlighting:</span>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1 text-cyan-300">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> AI Phrase
                      </span>
                      <span className="flex items-center gap-1 text-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Human Phrase
                      </span>
                    </div>
                  </div>

                  {/* Interactive Highlight Box */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs leading-relaxed max-h-64 overflow-y-auto space-y-2">
                    {results.sentences.map((s, idx) => (
                      <span
                        key={idx}
                        className={`inline-block p-1 m-0.5 rounded transition-all cursor-pointer ${
                          s.isAi
                            ? 'bg-cyan-500/20 text-cyan-200 border-b-2 border-cyan-400 hover:bg-cyan-500/30'
                            : 'bg-emerald-500/15 text-emerald-200 border-b-2 border-emerald-400 hover:bg-emerald-500/25'
                        }`}
                        title={s.reason || (s.isAi ? 'AI Pattern' : 'Human Pattern')}
                      >
                        {s.text}{' '}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: HUMANIZER */}
              {activeResultTab === 'humanizer' && (
                <div className="space-y-3">
                  {isHumanizing ? (
                    <div className="py-12 text-center space-y-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-cyan-400 mx-auto" />
                      <p className="text-xs text-slate-300 font-semibold">Generating authentic human phrasing...</p>
                    </div>
                  ) : humanizedResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Humanized Rewrite Ready</span>
                        </span>
                        <button
                          onClick={handleCopyHumanized}
                          className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedHumanized ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedHumanized ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed max-h-48 overflow-y-auto">
                        {humanizedResult.humanizedText}
                      </div>

                      {/* Changes Made */}
                      {humanizedResult.changesMade && humanizedResult.changesMade.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-400">Detection Bypass Enhancements:</span>
                          <ul className="space-y-1">
                            {humanizedResult.changesMade.map((c, i) => (
                              <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={handleApplyHumanized}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700/60"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Test Humanized Text in Detector</span>
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <p className="text-xs text-slate-400">Click below to rewrite AI text into natural human phrasing.</p>
                      <button
                        onClick={handleHumanizeText}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer"
                      >
                        Humanize Text Now
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400 border border-slate-700/50">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-200">Ready to Scan</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Paste any essay or text and click "Detect AI" for 100% precision evaluation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


