import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Calendar,
  Clock,
  Flame,
  Dumbbell,
  ShieldAlert,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * Metric delta pill formatter
 */
const MetricDelta = ({ value, label, current, previous, unit = '' }) => {
  let badgeColor = 'bg-slate-800 border-slate-700 text-slate-400';
  let IconComponent = Minus;
  let text = '0% STABLE';

  if (value === null || value === undefined) {
    badgeColor = 'bg-cyan-neon/15 border-cyan-neon/40 text-cyan-neon';
    IconComponent = Sparkles;
    text = 'NEW BASELINE';
  } else if (value > 0) {
    badgeColor = 'bg-matrix-neon/15 border-matrix-neon/40 text-matrix-neon';
    IconComponent = ArrowUpRight;
    text = `+${value}%`;
  } else if (value < 0) {
    badgeColor = 'bg-amber-400/15 border-amber-400/40 text-amber-400';
    IconComponent = ArrowDownRight;
    text = `${value}%`;
  }

  return (
    <div className="p-3 rounded-lg bg-void/60 border border-slate-800/80 flex items-center justify-between">
      <div className="space-y-0.5">
        <span className="text-[10px] font-orbitron font-bold text-slate-400 uppercase block">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-orbitron font-bold text-base text-slate-100">
            {current.toLocaleString()} {unit}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            vs {previous.toLocaleString()} {unit}
          </span>
        </div>
      </div>

      <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center gap-1 ${badgeColor}`}>
        <IconComponent className="w-3 h-3" />
        <span>{text}</span>
      </div>
    </div>
  );
};

/**
 * ProgressTrend Component (Stage 12)
 * Visualizes 14-day current cycle vs 14-day previous cycle with non-alarmist classification
 */
export const ProgressTrend = ({ trend }) => {
  if (!trend) return null;

  const {
    classification = 'INSUFFICIENT_DATA',
    reasoning = '',
    currentPeriod = {},
    previousPeriod = {},
    changes = {},
  } = trend;

  const getClassificationBadge = () => {
    switch (classification) {
      case 'IMPROVING':
        return {
          label: '📈 EXPANDING TRAJECTORY',
          badgeClass: 'bg-matrix-neon/15 border-matrix-neon/40 text-matrix-neon shadow-glow-matrix',
        };
      case 'DECLINING':
        return {
          label: '📉 VOLUME RECALIBRATION',
          badgeClass: 'bg-amber-400/15 border-amber-400/40 text-amber-400',
        };
      case 'STABLE':
        return {
          label: '📊 STABLE PACING',
          badgeClass: 'bg-cyan-neon/15 border-cyan-neon/40 text-cyan-neon shadow-glow-cyan',
        };
      case 'INSUFFICIENT_DATA':
      default:
        return {
          label: '⏳ INSUFFICIENT DATA',
          badgeClass: 'bg-slate-800 border-slate-700 text-slate-400',
        };
    }
  };

  const badge = getClassificationBadge();

  return (
    <GlassCard glow="violet" className="p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-neon/15 border border-violet-neon/30 flex items-center justify-center text-violet-glow">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wide">
              14-DAY PROGRESSION TRAJECTORY
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              CURRENT 14 DAYS ({currentPeriod.startDate} → {currentPeriod.endDate}) vs PRIOR 14 DAYS ({previousPeriod.startDate} → {previousPeriod.endDate})
            </span>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold border ${badge.badgeClass}`}>
          {badge.label}
        </span>
      </div>

      {/* Explanatory Context Note */}
      <p className="text-xs text-slate-300 font-sans leading-relaxed bg-void/40 p-3 rounded-lg border border-slate-800/60">
        {reasoning}
      </p>

      {/* 3 Metric Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricDelta
          label="QUEST SESSIONS"
          current={currentPeriod.workouts || 0}
          previous={previousPeriod.workouts || 0}
          value={changes.workoutChange}
        />
        <MetricDelta
          label="ACTIVE MINUTES"
          current={currentPeriod.minutes || 0}
          previous={previousPeriod.minutes || 0}
          value={changes.minuteChange}
          unit="min"
        />
        <MetricDelta
          label="CALORIC BURN"
          current={currentPeriod.calories || 0}
          previous={previousPeriod.calories || 0}
          value={changes.calorieChange}
          unit="kcal"
        />
      </div>
    </GlassCard>
  );
};

export default ProgressTrend;
