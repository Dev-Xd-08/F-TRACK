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
  let badgeColor = 'bg-steel-800/60 border-steel-700 text-ash-400';
  let IconComponent = Minus;
  let text = '0% STABLE';

  if (value === null || value === undefined) {
    badgeColor = 'bg-steel-800 border-steel-700 text-bone-200';
    IconComponent = Sparkles;
    text = 'NEW BASELINE';
  } else if (value > 0) {
    badgeColor = 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400';
    IconComponent = ArrowUpRight;
    text = `+${value}%`;
  } else if (value < 0) {
    badgeColor = 'bg-amber-950/40 border-amber-800/50 text-amber-400';
    IconComponent = ArrowDownRight;
    text = `${value}%`;
  }

  return (
    <div className="p-3 rounded bg-charcoal-900/80 border border-steel-800 flex items-center justify-between">
      <div className="space-y-0.5">
        <span className="text-[10px] font-orbitron font-bold text-ash-400 uppercase block">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-orbitron font-bold text-base text-bone-100">
            {current.toLocaleString()} {unit}
          </span>
          <span className="text-[10px] font-mono text-ash-500">
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
          badgeClass: 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400',
        };
      case 'DECLINING':
        return {
          label: '📉 VOLUME RECALIBRATION',
          badgeClass: 'bg-amber-950/40 border-amber-800/50 text-amber-400',
        };
      case 'STABLE':
        return {
          label: '📊 STABLE PACING',
          badgeClass: 'bg-steel-800/60 border-steel-700 text-bone-200',
        };
      case 'INSUFFICIENT_DATA':
      default:
        return {
          label: '⏳ INSUFFICIENT DATA',
          badgeClass: 'bg-steel-800 border-steel-700 text-ash-400',
        };
    }
  };

  const badge = getClassificationBadge();

  return (
    <GlassCard glow="none" className="p-5 space-y-4 border-steel-700/60 bg-charcoal-900/90 shadow-steel-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-steel-800/80 border border-steel-700 flex items-center justify-center text-bone-200">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-bone-100 uppercase tracking-wide">
              14-DAY PROGRESSION TRAJECTORY
            </h4>
            <span className="text-[10px] font-mono text-ash-400">
              CURRENT 14 DAYS ({currentPeriod.startDate} → {currentPeriod.endDate}) vs PRIOR 14 DAYS ({previousPeriod.startDate} → {previousPeriod.endDate})
            </span>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold border ${badge.badgeClass}`}>
          {badge.label}
        </span>
      </div>

      {/* Explanatory Context Note */}
      <p className="text-xs text-slate-300 font-sans leading-relaxed bg-void/60 p-3 rounded border border-steel-800/80">
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
