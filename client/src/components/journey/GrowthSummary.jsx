import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Flame, Calendar, Award, ShieldCheck, Activity } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * GrowthSummary Component (Stage 19)
 * Highlights long-term metric growth derived purely from real historical sessions.
 * Never fabricates numbers. Provides mature, honest perspective on training volume.
 */
export const GrowthSummary = ({ growthSummary, habitPatterns, plateauAnalysis }) => {
  if (!growthSummary || !growthSummary.hasGrowthData) {
    return (
      <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-ash-400 uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-steel-400" />
          <span>LONG-TERM METRIC GROWTH</span>
        </div>
        <h4 className="font-orbitron font-bold text-base text-bone uppercase">
          {growthSummary?.heading || 'YOUR STORY IS JUST COMMENCING'}
        </h4>
        <p className="text-xs font-sans text-ash-300 leading-relaxed max-w-xl">
          {growthSummary?.message || 'Keep training. F-TRACK will map your measurable endurance and volume progression as your journey unfolds.'}
        </p>
      </GlassCard>
    );
  }

  const {
    totalSessions = 0,
    daysOnPath = 1,
    earlyAvgMinutes = 0,
    recentAvgMinutes = 0,
    durationDelta = 0,
    totalMinutes = 0,
    totalCalories = 0,
  } = growthSummary;

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-crimson-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-crimson-500 uppercase font-semibold block">
              LONG-TERM PERSPECTIVE
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              GROWTH & ENDURANCE SUMMARY
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-ash-400">
          {daysOnPath} {daysOnPath === 1 ? 'DAY' : 'DAYS'} ON THE PATH
        </span>
      </div>

      {/* Grid of Long-Term Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Total Completed Sessions */}
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            TOTAL SESSIONS
          </span>
          <div className="font-orbitron font-bold text-xl sm:text-2xl text-bone">
            {totalSessions}
          </div>
          <span className="text-[10px] font-mono text-ash-400">
            Recorded in combat archive
          </span>
        </div>

        {/* Metric 2: Average Duration Delta */}
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            SESSION CAPACITY
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-orbitron font-bold text-xl sm:text-2xl text-bone">
              {recentAvgMinutes}m
            </span>
            {durationDelta !== 0 && (
              <span
                className={`text-xs font-mono font-bold ${
                  durationDelta > 0 ? 'text-emerald-400' : 'text-ash-400'
                }`}
              >
                {durationDelta > 0 ? `+${durationDelta}m` : `${durationDelta}m`}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-ash-400">
            vs initial avg {earlyAvgMinutes}m
          </span>
        </div>

        {/* Metric 3: Total Time Under Tension */}
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            TOTAL TIME
          </span>
          <div className="font-orbitron font-bold text-xl sm:text-2xl text-bone">
            {Math.round(totalMinutes / 60 * 10) / 10}h
          </div>
          <span className="text-[10px] font-mono text-ash-400">
            {totalMinutes} total minutes
          </span>
        </div>

        {/* Metric 4: Lifetime Caloric Output */}
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            ENERGY EXPENDED
          </span>
          <div className="font-orbitron font-bold text-xl sm:text-2xl text-bone">
            {totalCalories.toLocaleString()}
          </div>
          <span className="text-[10px] font-mono text-ash-400">
            Total verified kcal
          </span>
        </div>
      </div>

      {/* Habit Pattern & Plateau Diagnostics */}
      {(habitPatterns?.hasPattern || plateauAnalysis?.stabilized) && (
        <div className="space-y-2 pt-1 border-t border-steel-800">
          {habitPatterns?.hasPattern && (
            <div className="p-3 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1 text-xs font-sans text-ash-300">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-500 font-semibold uppercase">
                <Activity className="w-3.5 h-3.5" />
                <span>{habitPatterns.title}</span>
              </div>
              <p>{habitPatterns.message}</p>
              {habitPatterns.suggestion && (
                <p className="text-ash-400 italic pt-0.5">
                  Recommendation: {habitPatterns.suggestion}
                </p>
              )}
            </div>
          )}

          {plateauAnalysis?.stabilized && (
            <div className="p-3 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1 text-xs font-sans text-ash-300">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-crimson-400 font-semibold uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{plateauAnalysis.title}</span>
              </div>
              <p>{plateauAnalysis.message}</p>
              {plateauAnalysis.recommendation && (
                <p className="text-ash-400 italic pt-0.5">
                  Recommendation: {plateauAnalysis.recommendation}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Philosophical Grounding */}
      <div className="pt-2 text-center text-[11px] font-sans text-ash-400 italic">
        "Real change is quiet. It compounds one recorded day at a time."
      </div>
    </GlassCard>
  );
};

export default GrowthSummary;
