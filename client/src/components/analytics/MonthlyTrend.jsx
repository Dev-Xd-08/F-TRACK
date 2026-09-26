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
          color: 'text-cyan-neon',
          barGrad: 'from-cyan-neon to-cyan-dark',
          glow: 'shadow-[0_0_12px_rgba(0,245,255,0.3)]',
          format: (v) => `${v} sessions`,
        };
      case 'minutes':
        return {
          label: 'ACTIVE MINUTES',
          unit: 'min',
          color: 'text-violet-glow',
          barGrad: 'from-violet-neon to-violet-dark',
          glow: 'shadow-[0_0_12px_rgba(139,92,246,0.3)]',
          format: (v) => `${v.toLocaleString()} min`,
        };
      case 'calories':
      default:
        return {
          label: 'CALORIE BURNOUT',
          unit: 'kcal',
          color: 'text-crimson-aura',
          barGrad: 'from-crimson-aura to-amber-500',
          glow: 'shadow-[0_0_12px_rgba(255,42,95,0.3)]',
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
    <GlassCard glow="violet" className="p-5 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-neon/10 border border-violet-neon/30 flex items-center justify-center text-violet-glow shadow-[0_0_10px_rgba(139,92,246,0.2)]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wide">
              6-MONTH TRAJECTORY
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              HISTORICAL ASCENSION ARC
            </span>
          </div>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveMetric('calories')}
            className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold transition-all ${
              activeMetric === 'calories'
                ? 'bg-crimson-aura/20 text-crimson-aura border border-crimson-aura/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CALORIES
          </button>
          <button
            onClick={() => setActiveMetric('minutes')}
            className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold transition-all ${
              activeMetric === 'minutes'
                ? 'bg-violet-neon/20 text-violet-glow border border-violet-neon/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MINUTES
          </button>
          <button
            onClick={() => setActiveMetric('workouts')}
            className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold transition-all ${
              activeMetric === 'workouts'
                ? 'bg-cyan-neon/20 text-cyan-neon border border-cyan-neon/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            QUESTS
          </button>
        </div>
      </div>

      {/* 6-Month Visual Representation */}
      <div className="pt-2">
        <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 px-2 pb-2 border-b border-slate-800/80">
          {data.map((item, idx) => {
            const rawVal = Number(item[activeMetric]) || 0;
            const heightPercent = maxValue > 0 ? Math.round((rawVal / maxValue) * 100) : 0;
            const isZero = rawVal === 0;

            return (
              <div key={`${item.monthKey}-${idx}`} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-8 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-100 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                  <span className="font-bold text-violet-glow">{config.format(rawVal)}</span>
                  <span className="text-slate-400 ml-1">({item.month})</span>
                </div>

                {/* Animated Column Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${isZero ? 4 : Math.max(8, heightPercent)}%` }}
                  transition={{ duration: 0.55, delay: idx * 0.06, ease: 'easeOut' }}
                  className={`w-full max-w-[42px] rounded-t-lg transition-all duration-200 ${
                    isZero
                      ? 'bg-slate-800/50'
                      : `bg-gradient-to-t ${config.barGrad} ${config.glow} group-hover:brightness-125`
                  }`}
                />

                {!isZero && (
                  <span className="hidden sm:block text-[9px] font-mono font-bold text-slate-400 absolute -top-5 truncate">
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
              <span className="text-[10px] font-orbitron font-bold text-slate-300 block truncate">
                {item.month.split(' ')[0]}
              </span>
              <span className="text-[8px] font-mono text-slate-500 hidden sm:block">
                {item.month.split(' ')[1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trajectory Status Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">
          6-Month Total: <strong className={config.color}>{config.format(totalValue)}</strong>
        </span>
        <span className={`inline-flex items-center gap-1 text-[10px] font-orbitron font-bold px-2 py-0.5 rounded border ${
          isTrendingUp
            ? 'bg-matrix-neon/15 text-matrix-neon border-matrix-neon/40'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          <span>{isTrendingUp ? '📈 MOMENTUM ACTIVE' : '📊 PACED CADENCE'}</span>
        </span>
      </div>
    </GlassCard>
  );
};

export default MonthlyTrend;
