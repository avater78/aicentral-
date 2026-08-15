import React, { useState } from 'react';
import { Cpu, ArrowRight, Sparkles, Copy, Check, Download, Clock, DollarSign, Layers, Plus, Trash2, Loader2 } from 'lucide-react';
import { AITool } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AIWorkflowBuilderProps {
  allTools: AITool[];
  onSelectTool: (tool: AITool) => void;
}

interface WorkflowStep {
  stepNumber: number;
  phaseName: string;
  toolName: string;
  promptSuggestion: string;
  timeMinutes: number;
  costEstimate: string;
}

export const AIWorkflowBuilder: React.FC<AIWorkflowBuilderProps> = ({ allTools, onSelectTool }) => {
  const { t } = useLanguage();
  const [goal, setGoal] = useState('Create a 60-second video about futuristic space exploration');
  const [role, setRole] = useState('YouTuber & Content Creator');
  const [loading, setLoading] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const [workflow, setWorkflow] = useState<{
    title: string;
    description: string;
    totalTimeSaved: string;
    totalCostEstimate: string;
    steps: WorkflowStep[];
  }>({
    title: 'Automated YouTube Shorts Pipeline',
    description: 'Complete 5-stage automated video creation chain from script to voiceover and motion render.',
    totalTimeSaved: '14 Hours per video',
    totalCostEstimate: '$35 / month',
    steps: [
      { stepNumber: 1, phaseName: 'Idea & Scriptwriting', toolName: 'ChatGPT', promptSuggestion: 'Generate a high-hook 60s script about Mars colonization with 3 key facts.', timeMinutes: 5, costEstimate: 'Free' },
      { stepNumber: 2, phaseName: 'Voiceover Synthesis', toolName: 'ElevenLabs', promptSuggestion: 'Synthesize script using Adam voice at 1.1x speed with cinematic tone.', timeMinutes: 3, costEstimate: '$5/mo' },
      { stepNumber: 3, phaseName: 'Keyframe Image Art', toolName: 'Midjourney v6', promptSuggestion: 'Futuristic Martian human base, glowing domes, sunset lighting --ar 9:16 --v 6.0', timeMinutes: 8, costEstimate: '$10/mo' },
      { stepNumber: 4, phaseName: 'Video Motion Render', toolName: 'Runway Gen-3', promptSuggestion: 'Animate keyframe image with slow vertical camera sweep.', timeMinutes: 10, costEstimate: '$12/mo' },
      { stepNumber: 5, phaseName: 'Captions & Editing', toolName: 'Descript', promptSuggestion: 'Auto-caption audio, apply Studio Sound, export 1080p MP4.', timeMinutes: 6, costEstimate: '$12/mo' }
    ]
  });

  const handleGenerateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, role })
      });
      const data = await res.json();
      if (data.workflow && data.workflow.steps) {
        setWorkflow(data.workflow);
      }
    } catch (err) {
      console.error('Workflow generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = (prompt: string, stepNum: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedStep(stepNum);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const exportMarkdown = () => {
    let md = `# AI Workflow: ${workflow.title}\n\n`;
    md += `**Goal:** ${goal}\n`;
    md += `**Target Role:** ${role}\n`;
    md += `**Total Time Saved:** ${workflow.totalTimeSaved}\n`;
    md += `**Cost Estimate:** ${workflow.totalCostEstimate}\n\n`;
    md += `## Steps:\n\n`;

    workflow.steps.forEach((s) => {
      md += `### Step ${s.stepNumber}: ${s.phaseName} (${s.toolName})\n`;
      md += `- **Estimated Time:** ${s.timeMinutes} mins\n`;
      md += `- **Cost:** ${s.costEstimate}\n`;
      md += `- **Prompt:** \`${s.promptSuggestion}\` \n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.title.toLowerCase().replace(/\s+/g, '-')}-workflow.md`;
    a.click();
  };

  const presetWorkflows = [
    { label: '⚡ YouTube Shorts Automation', goal: 'Create a 60-second video about futuristic space exploration', role: 'YouTuber & Content Creator' },
    { label: '🚀 Full-Stack SaaS Pipeline', goal: 'Build a fullstack AI SaaS app with Stripe payments and high-converting landing page', role: 'Full-Stack Developer' },
    { label: '🎨 Figma to Production Code', goal: 'Design a responsive mobile-first UI component system in Figma and generate clean Tailwind code', role: 'UI/UX Designer' },
    { label: '📈 Viral Growth Funnel', goal: 'Draft viral LinkedIn & X posts with automated visual hooks and email sequence', role: 'Digital Marketer' },
    { label: '🔬 Academic Literature Synth', goal: 'Search, summarize, and synthesize 20 recent AI research papers into a literature review', role: 'Academic Researcher' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-300 mb-3">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>Visual Pipeline Generator</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-100">{t('workflows')}</h2>
        <p className="mt-2 text-sm text-slate-400">
          Chaining specialized AI tools creates superpowers. Chain scriptwriters, voice models, image art engines, video renderers, and editors into a single seamless pipeline.
        </p>
      </div>

      {/* Quick Preset Workflow Buttons */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>⚡ Select a Preset Workflow:</span>
          <span className="text-[10px] text-cyan-400 font-semibold uppercase">1-Click Auto Fill</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {presetWorkflows.map((pw, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setGoal(pw.goal);
                setRole(pw.role);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-purple-500/20 hover:border-purple-500/50 shadow-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:scale-105 cursor-pointer"
            >
              <span>{pw.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generator Controls Form */}
      <form onSubmit={handleGenerateWorkflow} className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Desired End Goal or Deliverable
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., 'Build a fullstack SaaS app with Stripe payment and landing page'"
              className="w-full p-3 rounded-xl bg-slate-950 border border-purple-500/30 text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Your Persona / Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="YouTuber & Content Creator">YouTuber & Content Creator</option>
              <option value="Full-Stack Developer">Full-Stack Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Startup Founder">Startup Founder</option>
              <option value="Digital Marketer">Digital Marketer</option>
              <option value="Academic Researcher">Academic Researcher</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !goal.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating AI Tool Pipeline...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Generate Custom Workflow Chain</span>
            </>
          )}
        </button>
      </form>

      {/* Pipeline Visual Header Stats */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-100">{workflow.title}</h3>
          <p className="text-xs text-slate-400 mt-1">{workflow.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Saved: {workflow.totalTimeSaved}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
            <DollarSign className="w-4 h-4 text-purple-400" />
            <span>Cost: {workflow.totalCostEstimate}</span>
          </div>

          <button
            onClick={exportMarkdown}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export MD</span>
          </button>
        </div>
      </div>

      {/* Workflow Step Nodes List */}
      <div className="relative space-y-6 before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-gradient-to-b before:from-violet-500 before:via-purple-500 before:to-cyan-400 hidden sm:block">
        {workflow.steps.map((step, idx) => {
          const matchedToolObj = allTools.find(
            (t) => t.name.toLowerCase().includes(step.toolName.toLowerCase()) || step.toolName.toLowerCase().includes(t.name.toLowerCase())
          );

          return (
            <div key={idx} className="relative pl-14 group">
              
              {/* Node Circle Badge */}
              <div className="absolute left-2.5 top-5 w-8 h-8 rounded-full bg-slate-950 border-2 border-purple-400 flex items-center justify-center font-extrabold text-xs text-cyan-300 shadow-lg shadow-purple-500/30">
                {step.stepNumber}
              </div>

              {/* Step Card */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/20 group-hover:border-purple-500/50 shadow-xl transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      Phase {step.stepNumber}: {step.phaseName}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                      <span>Tool: {step.toolName}</span>
                      {matchedToolObj && (
                        <button
                          onClick={() => onSelectTool(matchedToolObj)}
                          className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-semibold transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      )}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span>⏱️ ~{step.timeMinutes} mins execution</span>
                    <span>•</span>
                    <span className="text-purple-300 font-bold">{step.costEstimate}</span>
                  </div>
                </div>

                {/* Prompt Card */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 relative group/prompt">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Recommended Prompt Template:
                  </div>
                  <code className="text-xs text-cyan-200 font-mono block pr-12 select-all">
                    {step.promptSuggestion}
                  </code>

                  <button
                    onClick={() => copyPrompt(step.promptSuggestion, step.stepNumber)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
                    title="Copy Prompt"
                  >
                    {copiedStep === step.stepNumber ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
