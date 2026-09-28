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
      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal border border-steel/40 text-steel-light">
        <Sparkles className="w-3 h-3 text-steel" />
        <span>NEW LOG</span>
      </span>
    );
  }

  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/80 text-emerald-400">
        <ArrowUpRight className="w-3 h-3" />
        <span>+{value}%</span>
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-crimson/20 border border-crimson/50 text-crimson-bright">
        <ArrowDownRight className="w-3 h-3" />
        <span>{value}%</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal border border-steel/40 text-ash">
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
      <GlassCard className="p-8 text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-lg bg-charcoal border border-steel/60 flex items-center justify-center text-ash animate-spin">
          <RefreshCw className="w-5 h-5" />
        </div>
        <p className="font-orbitron text-xs text-ash tracking-wider uppercase">
          ANALYZING ASCENSION TELEMETRY...
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel/40 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-charcoal border border-steel/60 flex items-center justify-center text-steel-light shadow-steel-card">
            <BarChart3 className="w-4 h-4 text-crimson-bright" />
          </div>
          <div>
            <h3 className="font-orbitron font-black text-sm sm:text-base text-bone uppercase tracking-wider flex items-center gap-2">
              PROGRESS INTELLIGENCE & TELEMETRY
            </h3>
            <span className="text-[10px] font-mono text-ash tracking-widest uppercase">
              REAL-TIME DATA-DRIVEN PERFORMANCE MATRIX
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-lg bg-charcoal border border-steel/60 hover:border-steel text-xs font-mono text-ash hover:text-bone transition-colors flex items-center gap-1.5 group shadow-steel-card"
          >
            <RefreshCw className={`w-3.5 h-3.5 transition-transform ${isRefreshing ? 'animate-spin text-crimson-bright' : 'group-hover:rotate-180'}`} />
            <span>SYNC DATA</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* KPI 1: Total Workouts */}
        <GlassCard className="p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-ash">
            <span className="text-[10px] font-orbitron font-bold tracking-wider uppercase">SESSIONS</span>
            <Dumbbell className="w-3.5 h-3.5 text-steel-light" />
          </div>
          <div>
            <span className="font-orbitron font-black text-2xl text-bone">
              {summary.totalWorkouts || 0}
            </span>
            <span className="text-[10px] font-mono text-ash block">completed</span>
          </div>
        </GlassCard>

        {/* KPI 2: Total Minutes */}
        <GlassCard className="p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-ash">
            <span className="text-[10px] font-orbitron font-bold tracking-wider uppercase">TRAINING TIME</span>
            <Clock className="w-3.5 h-3.5 text-steel-light" />
          </div>
          <div>
            <span className="font-orbitron font-black text-2xl text-bone">
              {summary.totalMinutes || 0}
            </span>
            <span className="text-[10px] font-mono text-ash block">active minutes</span>
          </div>
        </GlassCard>

        {/* KPI 3: Total Calories */}
        <GlassCard className="p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-ash">
            <span className="text-[10px] font-orbitron font-bold tracking-wider uppercase">METABOLIC BURN</span>
            <Flame className="w-3.5 h-3.5 text-crimson-bright" />
          </div>
          <div>
            <span className="font-orbitron font-black text-2xl text-bone">
              {(summary.totalCalories || 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-ash block">kcal burned</span>
          </div>
        </GlassCard>

        {/* KPI 4: Avg Duration */}
        <GlassCard className="p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-ash">
            <span className="text-[10px] font-orbitron font-bold tracking-wider uppercase">AVG DURATION</span>
            <Clock className="w-3.5 h-3.5 text-steel-light" />
          </div>
          <div>
            <span className="font-orbitron font-black text-2xl text-bone">
              {summary.averageWorkoutDuration || 0}
            </span>
            <span className="text-[10px] font-mono text-ash block">min / workout</span>
          </div>
        </GlassCard>

        {/* KPI 5: Avg Calories */}
        <GlassCard className="p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-ash">
            <span className="text-[10px] font-orbitron font-bold tracking-wider uppercase">AVG INTENSITY</span>
            <Flame className="w-3.5 h-3.5 text-crimson-bright" />
          </div>
          <div>
            <span className="font-orbitron font-black text-2xl text-bone">
              {summary.averageCaloriesPerWorkout || 0}
            </span>
            <span className="text-[10px] font-mono text-ash block">kcal / workout</span>
          </div>
        </GlassCard>

        {/* KPI 6: Current & Longest Streak */}
        <GlassCard className="p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-ash">
            <span className="text-[10px] font-orbitron font-bold tracking-wider uppercase">WARRIOR STREAK</span>
            <Zap className="w-3.5 h-3.5 text-brass" />
          </div>
          <div>
            <span className="font-orbitron font-black text-2xl text-brass">
              {summary.currentStreak || 0}d
            </span>
            <span className="text-[10px] font-mono text-ash block">
              Best: {summary.longestStreak || 0}d
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Weekly Cycle Telemetry Comparison */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-charcoal border border-steel/60 flex items-center justify-center text-steel-light">
              <TrendingUp className="w-3.5 h-3.5 text-crimson-bright" />
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-xs sm:text-sm text-bone uppercase">
                WEEK-OVER-WEEK ASCENSION VELOCITY
              </h4>
              <span className="text-[10px] font-mono text-ash">
                CURRENT CYCLE ({currentWeek.periodStart} → {currentWeek.periodEnd}) vs PREVIOUS CYCLE ({previousWeek.periodStart} → {previousWeek.periodEnd})
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-ash uppercase">
            CALENDAR UTC CYCLES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Workouts delta */}
          <div className="p-3.5 rounded-lg bg-void/80 border border-steel/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-orbitron font-bold text-ash block uppercase">
                WORKOUT SESSIONS
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-orbitron font-black text-lg text-bone">
                  {currentWeek.workouts || 0}
                </span>
                <span className="text-[11px] font-mono text-ash">
                  vs {previousWeek.workouts || 0} prev
                </span>
              </div>
            </div>
            <TrendBadge value={percentageChange.workouts} />
          </div>

          {/* Minutes delta */}
          <div className="p-3.5 rounded-lg bg-void/80 border border-steel/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-orbitron font-bold text-ash block uppercase">
                TRAINING MINUTES
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-orbitron font-black text-lg text-bone">
                  {currentWeek.minutes || 0}m
                </span>
                <span className="text-[11px] font-mono text-ash">
                  vs {previousWeek.minutes || 0}m prev
                </span>
              </div>
            </div>
            <TrendBadge value={percentageChange.minutes} />
          </div>

          {/* Calories delta */}
          <div className="p-3.5 rounded-lg bg-void/80 border border-steel/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-orbitron font-bold text-ash block uppercase">
                CALORIC BURN
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-orbitron font-black text-lg text-crimson-bright">
                  {(currentWeek.calories || 0).toLocaleString()}
                </span>
                <span className="text-[11px] font-mono text-ash">
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
