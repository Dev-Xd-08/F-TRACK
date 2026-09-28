import React from 'react';
import { Calendar, CheckCircle2, RefreshCw, Clock, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import WhyThisInsight from './WhyThisInsight';

/**
 * PlanFitCard Component (Stage 21)
 * Analyzes planned vs actual training execution with zero guilt or shame.
 */
export const PlanFitCard = ({ planFit }) => {
  if (!planFit) return null;

  const {
    status = 'BALANCED_FIT',
    title = 'PLAN ADHERENCE & FIDELITY',
    observation,
    evidence,
    meaning,
    nextStep,
    completionRatio = 0,
    plannedSessions = 3,
    completedSessions = 0,
    rebalanced = false,
  } = planFit;

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-bone">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold block">
              ADAPTIVE FIDELITY
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              {title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-ash-400">COMPLETION:</span>
          <span className="text-bone font-bold">{completionRatio}%</span>
          <span className="text-steel-600">•</span>
          <span className="text-ash-400">{completedSessions} / {plannedSessions} SESSIONS</span>
        </div>
      </div>

      {/* Observation Text */}
      <p className="text-xs font-sans text-ash-300 leading-relaxed">
        {observation}
      </p>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2 rounded-full bg-charcoal-950 overflow-hidden border border-steel-800">
          <div
            className="h-full bg-crimson-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, completionRatio)}%` }}
          />
        </div>
      </div>

      {/* Why This Insight Accordion */}
      <WhyThisInsight
        observation={observation}
        evidence={evidence}
        meaning={meaning}
        nextStep={nextStep}
      />
    </GlassCard>
  );
};

export default PlanFitCard;
