import React from 'react';
import { Compass, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import WhyThisInsight from './WhyThisInsight';

/**
 * PurposeAlignmentCard Component (Stage 21)
 * Observes behavioral alignment with stated Stage 19 purpose without moral judgment.
 */
export const PurposeAlignmentCard = ({ purposeAlignment }) => {
  if (!purposeAlignment) return null;

  const {
    configured = false,
    status = 'UNCONFIGURED',
    purposeName,
    identityStatement,
    coreWhy,
    observation,
    evidence,
    meaning,
    nextStep,
  } = purposeAlignment;

  if (!configured) {
    return (
      <GlassCard glow="none" className="p-5 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-ash-400 uppercase tracking-wider">
          <Compass className="w-4 h-4 text-steel-400" />
          <span>PURPOSE ALIGNMENT</span>
        </div>
        <h4 className="font-orbitron font-bold text-sm sm:text-base text-bone uppercase">
          PURPOSE UNCONFIGURED
        </h4>
        <p className="text-xs font-sans text-ash-400 leading-relaxed max-w-lg">
          Declare your training purpose in Purpose Setup to connect daily physical effort with personal meaning.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-bone">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold block">
              PURPOSE TELEMETRY
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              {purposeName}
            </h3>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border bg-charcoal-800 border-steel-700 text-bone uppercase">
          {status}
        </span>
      </div>

      {identityStatement && (
        <blockquote className="p-3 rounded-sm bg-charcoal-950 border-l-2 border-crimson-600 text-xs font-serif italic text-ash-300">
          "{identityStatement}"
        </blockquote>
      )}

      <p className="text-xs font-sans text-ash-300 leading-relaxed">
        {observation}
      </p>

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

export default PurposeAlignmentCard;
