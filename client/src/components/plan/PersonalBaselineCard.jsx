import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, Clock, Flame, Calendar, Activity, ShieldCheck } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * PersonalBaselineCard Component (Stage 20)
 * Visualizes the operator's own historical normal.
 * Zero leaderboards, zero external comparisons. Pure self-grounding.
 */
export const PersonalBaselineCard = ({ baseline }) => {
  if (!baseline || !baseline.hasBaseline) {
    return (
      <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-ash-400 uppercase tracking-wider">
          <Gauge className="w-4 h-4 text-steel-400" />
          <span>PERSONAL BASELINE</span>
        </div>
        <h4 className="font-orbitron font-bold text-base text-bone uppercase">
          BASELINE STILL FORMING
        </h4>
        <p className="text-xs font-sans text-ash-300 leading-relaxed max-w-lg">
          {baseline?.message || 'Complete a few more sessions and F-TRACK will learn your personal training normal without guesswork.'}
        </p>
      </GlassCard>
    );
  }

  const {
    typicalDuration = 25,
    medianDuration = 25,
    longestSession = 45,
    typicalCalories = 200,
    mostCommonActivity = 'General Training',
    averageSessionsPerWeek = 3,
    fourWeekAverage = 3,
    totalSessions = 0,
  } = baseline;

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-crimson-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-crimson-500 uppercase font-semibold block">
              HISTORICAL NORMAL
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              YOUR PERSONAL BASELINE
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-ash-400">
          DERIVED FROM {totalSessions} REAL SESSIONS
        </span>
      </div>

      {/* Baseline Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Typical Duration */}
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            TYPICAL SESSION
          </span>
          <div className="font-orbitron font-bold text-xl sm:text-2xl text-bone">
            {typicalDuration}m
          </div>
          <span className="text-[10px] font-mono text-ash-400">
            Median: {medianDuration}m
          </span>
        </div>

        {/* Metric 2: Typical Cadence */}
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            TYPICAL FREQUENCY
          </span>
          <div className="font-orbitron font-bold text-xl sm:text-2xl text-bone">
            {averageSessionsPerWeek} / wk
          </div>
          <span className="text-[10px] font-mono text-ash-400">
            4-wk avg: {fourWeekAverage}/wk
          </span>
        </div>

        {/* Metric 3: Primary Activity */}
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            PRIMARY DISCIPLINE
          </span>
          <div className="font-orbitron font-bold text-sm sm:text-base text-bone truncate">
            {mostCommonActivity}
          </div>
          <span className="text-[10px] font-mono text-ash-400">
            Most frequent movement
          </span>
        </div>

        {/* Metric 4: Longest Recorded Session */}
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            PEAK CAPACITY
          </span>
          <div className="font-orbitron font-bold text-xl sm:text-2xl text-bone">
            {longestSession}m
          </div>
          <span className="text-[10px] font-mono text-ash-400">
            Longest sustained work
          </span>
        </div>
      </div>
    </GlassCard>
  );
};

export default PersonalBaselineCard;
