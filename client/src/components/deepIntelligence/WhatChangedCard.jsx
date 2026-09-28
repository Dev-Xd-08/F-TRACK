import React from 'react';
import { motion } from 'framer-motion';
import { GitCompare, TrendingUp, TrendingDown, Minus, Clock, Flame, Calendar, Activity } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * WhatChangedCard Component (Stage 21)
 * Highlights what measurably shifted between comparable time windows.
 */
export const WhatChangedCard = ({ changes }) => {
  if (!changes || !changes.hasComparison) {
    return (
      <GlassCard glow="none" className="p-5 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-ash-400 uppercase tracking-wider">
          <GitCompare className="w-4 h-4 text-steel-400" />
          <span>WHAT CHANGED</span>
        </div>
        <h4 className="font-orbitron font-bold text-sm sm:text-base text-bone uppercase">
          COMPARATIVE WINDOW FORMING
        </h4>
        <p className="text-xs font-sans text-ash-400 leading-relaxed max-w-lg">
          {changes?.message || 'Requires at least 3 workouts across multiple calendar periods to calculate objective changes over time.'}
        </p>
      </GlassCard>
    );
  }

  const {
    periodLabel = 'Last 14 Days vs Prior 14 Days',
    summaryExplanation,
    metrics = [],
    primaryDisciplineShift,
  } = changes;

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-bone">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold block">
              DIFFERENTIAL TELEMETRY
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              WHAT CHANGED
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-ash-400">
          {periodLabel}
        </span>
      </div>

      {/* Summary Narrative */}
      {summaryExplanation && (
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 text-xs font-sans text-ash-300 leading-relaxed">
          {summaryExplanation}
        </div>
      )}

      {/* Comparative Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const isUp = m.trend === 'UP';
          const isDown = m.trend === 'DOWN';

          return (
            <div key={m.label} className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
              <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
                {m.label}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-orbitron font-bold text-lg sm:text-xl text-bone">
                  {m.current}
                </span>
                <span
                  className={`text-xs font-mono font-bold flex items-center ${
                    isUp ? 'text-emerald-400' : isDown ? 'text-ash-400' : 'text-ash-500'
                  }`}
                >
                  {m.formattedDelta}
                </span>
              </div>
              <span className="text-[10px] font-mono text-ash-500 block truncate">
                Prior: {m.previous} {m.unit}
              </span>
            </div>
          );
        })}
      </div>

      {/* Movement Discipline Shift Note */}
      {primaryDisciplineShift && primaryDisciplineShift.changed && (
        <div className="pt-2 border-t border-steel-800 text-xs font-mono text-ash-400 flex items-center justify-between">
          <span>PRIMARY DISCIPLINE SHIFT:</span>
          <span className="text-bone">
            {primaryDisciplineShift.previous} → <strong className="text-crimson-400">{primaryDisciplineShift.current}</strong>
          </span>
        </div>
      )}
    </GlassCard>
  );
};

export default WhatChangedCard;
