import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  Clock, 
  Dumbbell, 
  Zap, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import WeeklyActivityChart from './WeeklyActivityChart';
import MonthlyTrend from './MonthlyTrend';
import ActivityBreakdown from './ActivityBreakdown';

/**
 * Helper to render a percentage badge
 */
const TrendBadge = ({ value, label }) => {
  if (value === null || value === undefined) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon">
        <Sparkles className="w-3 h-3" />
        <span>NEW ACTIVITY</span>
      </span>
    );
  }

  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-matrix-neon/15 border border-matrix-neon/40 text-matrix-neon">
        <ArrowUpRight className="w-3 h-3" />
        <span>+{value}%</span>
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-crimson-aura/15 border border-crimson-aura/40 text-crimson-aura">
        <ArrowDownRight className="w-3 h-3" />
        <span>{value}%</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
      <Minus className="w-3 h-3" />
      <span>0% STEADY</span>
    </span>
  );
};

/**
 * AnalyticsDashboard Component (Stage 10)
 * Comprehensive Progress Intelligence & Fitness Telemetry Suite
 */
export const AnalyticsDashboard = ({ analyticsData, onRefresh }) => {
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

  if (!analyticsData) {
    return (
      <GlassCard glow="cyan" className="p-8 text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-neon/10 border border-cyan-neon/30 flex items-center justify-center text-cyan-neon animate-spin">
          <RefreshCw className="w-5 h-5" />
        </div>
        <p className="font-orbitron text-xs text-cyan-neon tracking-wider uppercase">
          ANALYZING YOUR ASCENSION TELEMETRY...
        </p>
      </GlassCard>
    );
  }

  const {
    summary = {},
    weeklyActivity = [],
    weeklyComparison = {},
    monthlyTrend = [],
    activityBreakdown = [],
  } = analyticsData;

  const currentWeek = weeklyComparison.currentWeek || {};
  const previousWeek = weeklyComparison.previousWeek || {};
  const percentageChange = weeklyComparison.percentageChange || {};

  const isZeroData = (summary.totalWorkouts || 0) === 0;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-dark to-violet-dark border border-cyan-neon/40 flex items-center justify-center text-cyan-neon shadow-glow-cyan">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-orbitron font-black text-sm sm:text-base text-slate-100 uppercase tracking-wider flex items-center gap-2">
              PROGRESS INTELLIGENCE & TELEMETRY
            </h3>
            <span className="text-[10px] font-mono text-cyan-neon tracking-widest uppercase">
              REAL-TIME DATA-DRIVEN PERFORMANCE MATRIX
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-lg bg-obsidian border border-slate-800 hover:border-cyan-neon/40 text-xs font-mono text-slate-300 hover:text-cyan-neon transition-colors flex items-center gap-1.5 group"
          >
            <RefreshCw className={`w-3.5 h-3.5 transition-transform ${isRefreshing ? 'animate-spin text-cyan-neon' : 'group-hover:rotate-180'}`} />
            <span>SYNC DATA</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* KPI 1: Total Workouts */}
        <GlassCard glow="cyan" className="p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-orbitron font-bold tracking-wider uppercase">SESSIONS</span>
            <Dumbbell className="w-3.5 h-3.5 text-cyan-neon" />
          </div>
          <div>
            <span className="font-orbitron font-black text-2xl text-slate-100">
              {summary.totalWorkouts || 0}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">completed</span>
          </div>
        </GlassCard>

        {/* KPI 2: Total Minutes */}
        <GlassCard glow="violet" className="p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-orbitron font-bold tracking-wider uppercase">TRAINING TIME</span>
            <Clock className="w-3.5 h-3.5 text-violet-glow" />
          </div>
          <div>
            <span className="font-orbitron font-black text-2xl text-violet-glow">
              {summary.totalMinutes || 0}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">active minutes</span>
          </div>
        </GlassCard>

        {/* KPI 3: Total Calories */}
        <GlassCard glow="crimson" className="p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-orbitron font-bold tracking-wider uppercase">METABOLIC BURN</span>
            <Flame className="w-3.5 h-3.5 text-crimson-aura" />
          </div>
          <div>
            <span className="font-orbitron font-black text-2xl text-crimson-aura">
              {(summary.totalCalories || 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">kcal burned</span>
          </div>
        </GlassCard>

        {/* KPI 4: Avg Duration */}
        <GlassCard glow="cyan" className="p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-orbitron font-bold tracking-wider uppercase">AVG DURATION</span>
            <Clock className="w-3.5 h-3.5 text-cyan-neon" />
          </div>
          <div>
            <span className="font-orbitron font-black text-2xl text-cyan-neon">
              {summary.averageWorkoutDuration || 0}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">min / workout</span>
          </div>
        </GlassCard>

        {/* KPI 5: Avg Calories */}
        <GlassCard glow="violet" className="p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-orbitron font-bold tracking-wider uppercase">AVG INTENSITY</span>
            <Flame className="w-3.5 h-3.5 text-violet-glow" />
          </div>
          <div>
            <span className="font-orbitron font-black text-2xl text-violet-glow">
              {summary.averageCaloriesPerWorkout || 0}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">kcal / workout</span>
          </div>
        </GlassCard>

        {/* KPI 6: Current & Longest Streak */}
        <GlassCard glow="matrix" className="p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-orbitron font-bold tracking-wider uppercase">HUNTER STREAK</span>
            <Zap className="w-3.5 h-3.5 text-matrix-neon" />
          </div>
          <div>
            <span className="font-orbitron font-black text-2xl text-matrix-neon">
              {summary.currentStreak || 0}d
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">
              Best: {summary.longestStreak || 0}d
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Weekly Cycle Telemetry Comparison */}
      <GlassCard glow="violet" className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-violet-neon/15 border border-violet-neon/30 flex items-center justify-center text-violet-glow">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-xs sm:text-sm text-slate-200 uppercase">
                WEEK-OVER-WEEK ASCENSION VELOCITY
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                CURRENT CYCLE ({currentWeek.periodStart} → {currentWeek.periodEnd}) vs PREVIOUS CYCLE ({previousWeek.periodStart} → {previousWeek.periodEnd})
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-violet-glow uppercase">
            CALENDAR UTC CYCLES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Workouts delta */}
          <div className="p-3.5 rounded-lg bg-void/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-orbitron font-bold text-slate-400 block uppercase">
                QUEST SESSIONS
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-orbitron font-black text-lg text-slate-100">
                  {currentWeek.workouts || 0}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  vs {previousWeek.workouts || 0} prev
                </span>
              </div>
            </div>
            <TrendBadge value={percentageChange.workouts} />
          </div>

          {/* Minutes delta */}
          <div className="p-3.5 rounded-lg bg-void/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-orbitron font-bold text-slate-400 block uppercase">
                TRAINING MINUTES
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-orbitron font-black text-lg text-violet-glow">
                  {currentWeek.minutes || 0}m
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  vs {previousWeek.minutes || 0}m prev
                </span>
              </div>
            </div>
            <TrendBadge value={percentageChange.minutes} />
          </div>

          {/* Calories delta */}
          <div className="p-3.5 rounded-lg bg-void/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-orbitron font-bold text-slate-400 block uppercase">
                CALORIC BURN
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-orbitron font-black text-lg text-crimson-aura">
                  {(currentWeek.calories || 0).toLocaleString()}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  vs {(previousWeek.calories || 0).toLocaleString()} prev
                </span>
              </div>
            </div>
            <TrendBadge value={percentageChange.calories} />
          </div>
        </div>
      </GlassCard>

      {/* Visual Analytics Grid: 7-Day Bar Chart & 6-Month Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyActivityChart data={weeklyActivity} />
        <MonthlyTrend data={monthlyTrend} />
      </div>

      {/* Activity Discipline Breakdown */}
      <ActivityBreakdown data={activityBreakdown} />
    </section>
  );
};

export default AnalyticsDashboard;
