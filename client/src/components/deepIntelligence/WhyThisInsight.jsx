import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Eye, Compass } from 'lucide-react';

/**
 * WhyThisInsight Component (Stage 21)
 * Standardized 4-pillar explanatory disclosure for any intelligence insight:
 * - OBSERVATION: What happened?
 * - EVIDENCE: What data supports it?
 * - MEANING: Why does this matter?
 * - NEXT STEP: What can the user consider doing?
 */
export const WhyThisInsight = ({
  observation,
  evidence,
  meaning,
  nextStep,
  defaultExpanded = false,
  title = 'WHY DOES F-TRACK CONCLUDE THIS?',
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!observation && !evidence && !meaning && !nextStep) return null;

  return (
    <div className="rounded-sm bg-charcoal-950/70 border border-steel-800 text-xs font-sans overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3.5 py-2 flex items-center justify-between text-left text-ash-400 hover:text-bone transition-colors font-mono text-[11px] uppercase tracking-wider"
      >
        <span className="flex items-center gap-1.5 text-steel-400">
          <HelpCircle className="w-3.5 h-3.5 text-steel-500" />
          <span className="text-ash-300 font-semibold">{title}</span>
        </span>
        <span className="flex items-center gap-1 text-[10px] text-ash-500">
          <span>{expanded ? 'COLLAPSE' : 'DISCLOSE'}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </span>
      </button>

      {expanded && (
        <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-steel-800/80 text-ash-300">
          {observation && (
            <div>
              <span className="font-mono text-[10px] tracking-widest text-ash-400 uppercase block font-semibold mb-0.5">
                OBSERVATION
              </span>
              <p className="leading-relaxed text-bone text-xs">{observation}</p>
            </div>
          )}

          {evidence && (
            <div>
              <span className="font-mono text-[10px] tracking-widest text-ash-400 uppercase block font-semibold mb-0.5">
                RECORDED EVIDENCE
              </span>
              <p className="leading-relaxed text-ash-300 text-xs font-mono bg-charcoal-900/60 p-2 rounded-sm border border-steel-800/60">
                {evidence}
              </p>
            </div>
          )}

          {meaning && (
            <div>
              <span className="font-mono text-[10px] tracking-widest text-ash-400 uppercase block font-semibold mb-0.5">
                WHY THIS MATTERS
              </span>
              <p className="leading-relaxed text-ash-300 text-xs">{meaning}</p>
            </div>
          )}

          {nextStep && (
            <div className="pt-1 border-t border-steel-800/60">
              <span className="font-mono text-[10px] tracking-widest text-crimson-400 uppercase block font-semibold mb-0.5">
                CONSIDER FOR YOUR ROUTINE
              </span>
              <p className="leading-relaxed text-bone text-xs">{nextStep}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WhyThisInsight;
