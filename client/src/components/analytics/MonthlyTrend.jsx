import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Zap, Clock, Flame, Dumbbell } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * MonthlyTrend Component (Stage 10)
 * Visualizes 6-month historical training trajectory and volume trend
 */
export const MonthlyTrend = ({ data = [] }) => {
  const [activeMetric, setActiveMetric] = useState('calories'); // 'calories' | 'minutes' | 'workouts'

  const getMetricConfig = () => {
    switch (activeMetric) {
      case 'workouts':
        return {
          label: 'QUEST SESSIONS',
          unit: 'sessions',
          color: 'text-bone',
          barGrad: 'from-charcoal via-steel/40 to-steel',
          glow: '',
          format: (v) => `${v} sessions`,
        };
      case 'minutes':
        return {
          label: 'ACTIVE MINUTES',
          unit: 'min',
          color: 'text-bone',
          barGrad: 'from-charcoal via-steel/50 to-crimson/80',
          glow: '',
          format: (v) => `${v.toLocaleString()} min`,
        };
      case 'calories':
      default:
        return {
          label: 'CALORIE BURNOUT',
          unit: 'kcal',
          color: 'text-crimson-bright',
          barGrad: 'from-crimson-dark to-crimson',
          glow: '',
          format: (v) => `${v.toLocaleString()} kcal`,
        };
    }
  };

  const config = getMetricConfig();

  const values = data.map((d) => Number(d[activeMetric]) || 0);
  const maxValue = Math.max(...values, 1);
  const totalValue = values.reduce((sum, v) => sum + v, 0);

  // Compute simple trajectory trend (current month vs previous month)
  const currentMonthVal = values[values.length - 1] || 0;
  const prevMonthVal = values[values.length - 2] || 0;
  const isTrendingUp = currentMonthVal >= prevMonthVal && currentMonthVal > 0;

  return (
    <GlassCard className="p-5 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-charcoal border border-steel/60 flex items-center justify-center text-steel-light shadow-steel-card">
            <TrendingUp className="w-4 h-4 text-crimson-bright" />
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-bone uppercase tracking-wide">
              6-MONTH TRAJECTORY
            </h4>
            <span className="text-[10px] font-mono text-ash">
              HISTORICAL ASCENSION ARC
            </span>
          </div>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-void border border-steel/50">
          <button
            onClick={() => setActiveMetric('calories')}
            className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold transition-all ${
              activeMetric === 'calories'
                ? 'bg-crimson/20 text-crimson-bright border border-crimson/60 shadow-steel-card'
                : 'text-ash hover:text-bone'
            }`}
          >
            CALORIES
          </button>
          <button
            onClick={() => setActiveMetric('minutes')}
            className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold transition-all ${
              activeMetric === 'minutes'
                ? 'bg-charcoal text-bone border border-steel shadow-steel-card'
                : 'text-ash hover:text-bone'
            }`}
          >
            MINUTES
          </button>
          <button
            onClick={() => setActiveMetric('workouts')}
            className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold transition-all ${
              activeMetric === 'workouts'
                ? 'bg-charcoal text-bone border border-steel shadow-steel-card'
                : 'text-ash hover:text-bone'
            }`}
          >
            QUESTS
          </button>
        </div>
      </div>

      {/* 6-Month Visual Representation */}
      <div className="pt-2">
        <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 px-2 pb-2 border-b border-steel/40">
          {data.map((item, idx) => {
            const rawVal = Number(item[activeMetric]) || 0;
            const heightPercent = maxValue > 0 ? Math.round((rawVal / maxValue) * 100) : 0;
            const isZero = rawVal === 0;

            return (
              <div key={`${item.monthKey}-${idx}`} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-8 px-2 py-1 rounded bg-obsidian border border-steel text-[10px] font-mono text-bone pointer-events-none whitespace-nowrap z-20 shadow-steel-card">
                  <span className="font-bold text-crimson-bright">{config.format(rawVal)}</span>
                  <span className="text-ash ml-1">({item.month})</span>
                </div>

                {/* Animated Column Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${isZero ? 4 : Math.max(8, heightPercent)}%` }}
                  transition={{ duration: 0.55, delay: idx * 0.06, ease: 'easeOut' }}
                  className={`w-full max-w-[42px] rounded-t-sm transition-all duration-200 ${
                    isZero
                      ? 'bg-steel/15'
                      : `bg-gradient-to-t ${config.barGrad} group-hover:brightness-110`
                  }`}
                />

                {!isZero && (
                  <span className="hidden sm:block text-[9px] font-mono font-bold text-ash absolute -top-5 truncate">
                    {rawVal > 1000 ? `${(rawVal / 1000).toFixed(1)}k` : rawVal}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* X-Axis Month Labels */}
        <div className="flex items-center justify-between gap-3 sm:gap-6 px-2 pt-2">
          {data.map((item, idx) => (
            <div key={`mlabel-${item.monthKey}-${idx}`} className="flex-1 text-center truncate">
              <span className="text-[10px] font-orbitron font-bold text-bone block truncate">
                {item.month.split(' ')[0]}
              </span>
              <span className="text-[8px] font-mono text-ash hidden sm:block">
                {item.month.split(' ')[1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trajectory Status Footer */}
      <div className="pt-2 border-t border-steel/40 flex items-center justify-between text-xs font-mono">
        <span className="text-ash">
          6-Month Total: <strong className={config.color}>{config.format(totalValue)}</strong>
        </span>
        <span className={`inline-flex items-center gap-1 text-[10px] font-orbitron font-bold px-2 py-0.5 rounded border ${
          isTrendingUp
            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80'
            : 'bg-charcoal text-ash border-steel/50'
        }`}>
          <span>{isTrendingUp ? '📈 MOMENTUM ACTIVE' : '📊 PACED CADENCE'}</span>
        </span>
      </div>
    </GlassCard>
  );
};

export default MonthlyTrend;
