import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Activity,
  Flame,
  Clock,
  Dumbbell,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import EnergyBar from '../ui/EnergyBar';
import InsightCard from './InsightCard';
import ProgressTrend from './ProgressTrend';
import NextFocus from './NextFocus';

/**
 * FitnessIntelligence Component (Stage 12)
 * Comprehensive Personal Fitness Intelligence & Smart Insights Dashboard
 */
export const FitnessIntelligence = ({ intelligenceData, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  // 1. Loading State
  if (!intelligenceData) {
    return (
      <GlassCard glow="cyan" className="p-8 text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-neon/10 border border-cyan-neon/30 flex items-center justify-center text-cyan-neon animate-spin">
          <RefreshCw className="w-5 h-5" />
        </div>
        <p className="font-orbitron text-xs text-cyan-neon tracking-wider uppercase">
          SYNCHRONIZING PERSONAL FITNESS INTELLIGENCE...
        </p>
      </GlassCard>
    );
  }

  const {
    summary = {},
    consistency = {},
    workoutPattern = {},
    activityPreference = {},
    progressTrend = {},
    insights = [],
    nextFocus = [],
    safetyDisclaimer = '',
  } = intelligenceData;

  const totalWorkouts = summary.totalWorkouts || 0;

  // 2. Brand-New User Empty State (Required by prompt)
  if (totalWorkouts === 0) {
    return (
      <GlassCard glow="cyan" className="p-8 sm:p-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-obsidian border border-slate-800 flex items-center justify-center text-cyan-neon shadow-glow-cyan">
          <Brain className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon text-[10px] font-orbitron font-bold tracking-widest uppercase">
            <Sparkles className="w-3 h-3" />
            <span>INTELLIGENCE CORE INITIALIZED</span>
          </div>

          <h3 className="font-orbitron font-black text-lg sm:text-xl text-slate-100 uppercase tracking-wide">
            NOT ENOUGH ACTIVITY DATA YET
          </h3>

          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Complete a few workout quests to unlock personalized fitness intelligence, 
            consistency indexing, progress trends, and evidence-based focus recommendations.
          </p>
        </div>

        <div className="pt-2 text-[10px] font-mono text-slate-500">
          <span>ZERO FABRICATED STATISTICS • REAL EMPIRICAL TELEMETRY ONLY</span>
        </div>
      </GlassCard>
    );
  }

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-dark to-cyan-dark border border-violet-neon/40 flex items-center justify-center text-violet-glow shadow-glow-violet">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-orbitron font-black text-sm sm:text-base text-slate-100 uppercase tracking-wider flex items-center gap-2">
              F-TRACK INTELLIGENCE CORE
            </h3>
            <span className="text-[10px] font-mono text-violet-glow tracking-widest uppercase">
              EXPLAINABLE EMPIRICAL INSIGHTS & NEXT FOCUS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-lg bg-obsidian border border-slate-800 hover:border-violet-neon/40 text-xs font-mono text-slate-300 hover:text-violet-glow transition-colors flex items-center gap-1.5 group"
          >
            <RefreshCw className={`w-3.5 h-3.5 transition-transform ${isRefreshing ? 'animate-spin text-violet-glow' : 'group-hover:rotate-180'}`} />
            <span>RE-ANALYZE</span>
          </button>
        </div>
      </div>

      {/* Top Intelligence Grid: Consistency Index & Pattern KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consistency Index Hero Card */}
        <GlassCard glow="cyan" className="p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-neon" />
              {consistency.label || 'F-TRACK CONSISTENCY INDEX'}
            </span>
            <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-cyan-neon/15 border border-cyan-neon/40 text-cyan-neon">
              {consistency.tier || 'ACTIVE'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-orbitron font-black text-4xl text-cyan-neon">
                  {consistency.score || 0}%
                </span>
                <span className="text-xs font-mono text-slate-400">30-day adherence</span>
              </div>
              <span className="text-xs font-mono text-slate-300">
                <strong className="text-cyan-neon">{consistency.activeDays || 0}</strong> / {consistency.periodDays || 30} days
              </span>
            </div>

            {/* Gauge Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${consistency.score || 0}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-violet-neon via-cyan-neon to-matrix-neon shadow-[0_0_10px_rgba(0,245,255,0.6)]"
              />
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {consistency.summary}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Period: {consistency.startDate} → {consistency.endDate}</span>
            <span className="text-cyan-neon font-bold">UTC Window</span>
          </div>
        </GlassCard>

        {/* 4 Pattern KPI Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* KPI 1: Total Quests */}
          <GlassCard glow="violet" className="p-4 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-orbitron font-bold uppercase">SESSIONS</span>
              <Dumbbell className="w-3.5 h-3.5 text-violet-glow" />
            </div>
            <div>
              <span className="font-orbitron font-black text-2xl text-slate-100">
                {workoutPattern.totalWorkouts || 0}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">completed quests</span>
            </div>
          </GlassCard>

          {/* KPI 2: Average Duration */}
          <GlassCard glow="cyan" className="p-4 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-orbitron font-bold uppercase">AVG DURATION</span>
              <Clock className="w-3.5 h-3.5 text-cyan-neon" />
            </div>
            <div>
              <span className="font-orbitron font-black text-2xl text-cyan-neon">
                {workoutPattern.averageWorkoutDuration || 0}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">minutes / quest</span>
            </div>
          </GlassCard>

          {/* KPI 3: Average Calories */}
          <GlassCard glow="crimson" className="p-4 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-orbitron font-bold uppercase">AVG BURN</span>
              <Flame className="w-3.5 h-3.5 text-crimson-aura" />
            </div>
            <div>
              <span className="font-orbitron font-black text-2xl text-crimson-aura">
                {workoutPattern.averageCalories || 0}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">kcal / quest</span>
            </div>
          </GlassCard>

          {/* KPI 4: Primary Activity */}
          <GlassCard glow="matrix" className="p-4 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-orbitron font-bold uppercase">TOP DISCIPLINE</span>
              <Activity className="w-3.5 h-3.5 text-matrix-neon" />
            </div>
            <div>
              <span className="font-orbitron font-black text-base text-matrix-neon truncate block">
                {activityPreference.primaryDiscipline || 'None'}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">
                {activityPreference.isTied ? 'Tied disciplines' : 'Preferred activity'}
              </span>
            </div>
          </GlassCard>

          {/* Wide Pattern Summary Row */}
          <div className="col-span-2 sm:col-span-4 p-3.5 rounded-xl bg-void/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-glow" />
              <span className="text-slate-400">
                Most Active Day:{' '}
                <strong className="text-slate-200">{workoutPattern.mostActiveDay || 'Distributed evenly'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>Cumulative Workload:</span>
              <strong className="text-violet-glow">{(workoutPattern.totalMinutes || 0).toLocaleString()}m</strong>
              <span>•</span>
              <strong className="text-crimson-aura">{(workoutPattern.totalCalories || 0).toLocaleString()} kcal</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 14-Day Progress Trend Comparison */}
      <ProgressTrend trend={progressTrend} />

      {/* Strategic Next Focus (Evidence-Based Suggestions) */}
      <NextFocus suggestions={nextFocus} />

      {/* Explainable Insights Matrix */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-slate-200 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-mythic" />
              PERSONALIZED TELEMETRY INSIGHTS
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              {insights.length} EXPLAINABLE OBSERVATIONS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((item, idx) => (
              <InsightCard key={item.id || idx} insight={item} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Non-Medical Disclaimer Banner */}
      <div className="p-3 rounded-lg bg-obsidian/70 border border-slate-800/80 flex items-center justify-center text-center gap-2 text-[10px] font-mono text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span>{safetyDisclaimer || 'F-TRACK PERSONAL FITNESS INTELLIGENCE • INFORMATIONAL PERFORMANCE ANALYTICS ONLY • NOT MEDICAL ADVICE OR DIAGNOSIS'}</span>
      </div>
    </section>
  );
};

export default FitnessIntelligence;
