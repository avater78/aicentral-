import React, { useState } from 'react';
import { HelpCircle, ArrowRight, RotateCcw, CheckCircle2, Sparkles, X, ExternalLink } from 'lucide-react';
import { AITool } from '../types';

interface AIFinderQuizProps {
  allTools: AITool[];
  onClose: () => void;
  onSelectTool: (tool: AITool) => void;
}

export const AIFinderQuiz: React.FC<AIFinderQuizProps> = ({ allTools, onClose, onSelectTool }) => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [budget, setBudget] = useState('');
  const [recommendations, setRecommendations] = useState<AITool[]>([]);

  const handleGoalSelect = (selectedGoal: string) => {
    setGoal(selectedGoal);
    setStep(2);
  };

  const handleLevelSelect = (level: string) => {
    setSkillLevel(level);
    setStep(3);
  };

  const handleBudgetSelect = (selectedBudget: string) => {
    setBudget(selectedBudget);

    // Compute recommendations based on choices
    let filtered = allTools;
    if (goal === 'Coding') {
      filtered = allTools.filter((t) => t.categories.includes('Coding'));
    } else if (goal === 'Video') {
      filtered = allTools.filter((t) => t.categories.includes('Video Creation'));
    } else if (goal === 'Writing') {
      filtered = allTools.filter((t) => t.categories.includes('Writing'));
    } else if (goal === 'Image') {
      filtered = allTools.filter((t) => t.categories.includes('Image Generation'));
    } else if (goal === 'Audio') {
      filtered = allTools.filter((t) => t.categories.includes('Voice') || t.categories.includes('Music'));
    }

    if (selectedBudget === 'Free') {
      filtered = filtered.filter((t) => t.pricingType === 'Free' || t.pricingType === 'Freemium' || t.pricingType === 'Open Source');
    }

    setRecommendations(filtered.slice(0, 3));
    setStep(4);
  };

  const resetQuiz = () => {
    setStep(1);
    setGoal('');
    setSkillLevel('');
    setBudget('');
    setRecommendations([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-6">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-100">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Tool Wizard
          </div>
          <h3 className="text-xl font-extrabold">30-Second AI Finder Quiz</h3>
          <p className="text-xs text-slate-400 mt-1">Answer 3 simple questions to unlock your custom AI tool recommendations.</p>
        </div>

        {/* STEP 1: GOAL */}
        {step === 1 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Step 1: What is your primary goal today?</h4>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Writing & Copywriting', key: 'Writing' },
                { label: 'Coding & App Development', key: 'Coding' },
                { label: 'Image Art & Graphics', key: 'Image' },
                { label: 'Video Production & Editing', key: 'Video' },
                { label: 'Voice & Music Synthesis', key: 'Audio' },
                { label: 'Automation & Workflow Bots', key: 'Automation' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleGoalSelect(opt.key)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 text-left text-xs font-bold text-slate-200 hover:text-cyan-300 transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: EXPERIENCE */}
        {step === 2 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Step 2: What is your technical skill level?</h4>
            <div className="space-y-2">
              {[
                { label: 'Beginner (I want simple 1-click tools)', key: 'Beginner' },
                { label: 'Intermediate (Comfortable with prompts and web apps)', key: 'Intermediate' },
                { label: 'Advanced / Developer (Need API access & local models)', key: 'Advanced' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleLevelSelect(opt.key)}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 text-left text-xs font-bold text-slate-200 hover:text-cyan-300 transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: BUDGET */}
        {step === 3 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Step 3: What is your budget preference?</h4>
            <div className="space-y-2">
              {[
                { label: 'Strictly $0 / Free tools only', key: 'Free' },
                { label: 'Under $20 / month', key: 'Budget' },
                { label: 'Flexible budget for premium pro features', key: 'Pro' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleBudgetSelect(opt.key)}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 text-left text-xs font-bold text-slate-200 hover:text-cyan-300 transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: RECOMMENDATIONS RESULT */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Recommended Top AI Tools</h4>
              <button onClick={resetQuiz} className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => {
                const websiteUrl = rec.officialLinks?.website || `https://www.google.com/search?q=${encodeURIComponent(rec.name + ' AI tool')}`;
                return (
                  <div key={rec.id} className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 hover:opacity-80 transition-opacity">
                        <img src={rec.logo} alt={rec.name} className="w-10 h-10 rounded-lg object-cover" />
                      </a>
                      <div>
                        <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="font-extrabold text-xs text-slate-100 hover:text-cyan-300 transition-colors flex items-center gap-1">
                          <span>{rec.name}</span>
                          <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
                        </a>
                        <div className="text-[10px] text-slate-400">{rec.pricingType} • {rec.rating}★</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectTool(rec);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
