import React from 'react';
import { HelpCircle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * DataGapCard Component (Stage 21)
 * Honest uncertainty disclosure: highlights areas where F-TRACK still needs history
 * rather than guessing or fabricating conclusions.
 */
export const DataGapCard = ({ dataGaps = [] }) => {
  if (!dataGaps || dataGaps.length === 0) {
    return (
      <GlassCard glow="none" className="p-5 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>DATA INTEGRITY COMPLETE</span>
        </div>
        <p className="text-xs font-sans text-ash-300">
          All primary telemetry signals (Workouts, Purpose, Plan, Goals, and Reflections) have active records.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-steel-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold block">
              HONEST UNCERTAINTY
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              TELEMETRY GAPS
            </h3>
          </div>
        </div>

        <span className="text-[10px] font-mono text-ash-500 uppercase tracking-widest">
          {dataGaps.length} AREA{dataGaps.length === 1 ? '' : 'S'} FORMING
        </span>
      </div>

      <p className="text-xs font-sans text-ash-400 leading-relaxed">
        F-TRACK refuses to guess or fabricate insights. Where information is incomplete, the system admits uncertainty:
      </p>

      {/* Gaps List */}
      <div className="space-y-2.5 pt-1">
        {dataGaps.map((gap) => (
          <div
            key={gap.id}
            className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-orbitron font-bold text-xs uppercase text-bone">
                {gap.title}
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-steel-800 border border-steel-700 text-ash-300">
                {gap.category}
              </span>
            </div>

            <p className="text-xs font-sans text-ash-300 leading-relaxed">
              {gap.observation}
            </p>

            <div className="pt-1 flex items-center justify-between text-[11px] font-mono border-t border-steel-800/80">
              <span className="text-ash-400">{gap.meaning}</span>
              <span className="text-bone font-semibold">{gap.nextStep}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default DataGapCard;
