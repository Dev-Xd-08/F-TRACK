import React from 'react';
import { motion } from 'framer-motion';
import { GitCompare, TrendingUp, Clock, Flame, Calendar, Award } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * SelfComparison Component (Stage 20)
 * Compares user exclusively against their own historical data (This Month vs Prior Month).
 * Zero competition, zero leaderboards.
 */
export const SelfComparison = ({ comparison }) => {
  if (!comparison || !comparison.hasComparison) {
    return null; // Quietly hide until enough multi-week history exists
  }

  const { heading = 'THIS MONTH vs YOUR PREVIOUS MONTH', periodLabel = 'Last 30 Days vs Prior 30 Days', metrics } = comparison;

  if (!metrics) return null;

  const { activeMinutes, sessions, averageDuration, calories } = metrics;

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-amber-500">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-semibold block">
              SELF-PROGRESSION DELTA
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              {heading}
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-ash-400">
          {periodLabel}
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Active Minutes */}
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            ACTIVE MINUTES
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-orbitron font-bold text-xl sm:text-2xl text-bone">
              {activeMinutes.current}m
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                activeMinutes.percentChange >= 0 ? 'text-emerald-400' : 'text-ash-400'
              }`}
            >
              {activeMinutes.formattedDelta}
            </span>
          </div>
          <span className="text-[10px] font-mono text-ash-400">
            Prior: {activeMinutes.previous}m
          </span>
        </div>

        {/* Metric 2: Completed Sessions */}
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            TOTAL SESSIONS
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-orbitron font-bold text-xl sm:text-2xl text-bone">
              {sessions.current}
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                sessions.delta >= 0 ? 'text-emerald-400' : 'text-ash-400'
              }`}
            >
              {sessions.formattedDelta}
            </span>
          </div>
          <span className="text-[10px] font-mono text-ash-400">
            Prior: {sessions.previous}
          </span>
        </div>

        {/* Metric 3: Average Session Duration */}
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            AVERAGE SESSION
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-orbitron font-bold text-xl sm:text-2xl text-bone">
              {averageDuration.current}m
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                averageDuration.delta >= 0 ? 'text-emerald-400' : 'text-ash-400'
              }`}
            >
              {averageDuration.formattedDelta}
            </span>
          </div>
          <span className="text-[10px] font-mono text-ash-400">
            Prior: {averageDuration.previous}m
          </span>
        </div>

        {/* Metric 4: Lifetime Calorie Burn */}
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            ESTIMATED KCAL
          </span>
          <div className="font-orbitron font-bold text-xl sm:text-2xl text-bone">
            {calories.current.toLocaleString()}
          </div>
          <span className="text-[10px] font-mono text-ash-400">
            Prior: {calories.previous.toLocaleString()}
          </span>
        </div>
      </div>
    </GlassCard>
  );
};

export default SelfComparison;
