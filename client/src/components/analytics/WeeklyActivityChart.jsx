import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Dumbbell, Clock, Flame, Calendar } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * WeeklyActivityChart Component (Stage 10)
 * Visualizes 7-day rolling physical activity across workouts, duration, and calories
 */
export const WeeklyActivityChart = ({ data = [] }) => {
  const [activeMetric, setActiveMetric] = useState('minutes'); // 'workouts' | 'minutes' | 'calories'

  const getMetricConfig = () => {
    switch (activeMetric) {
      case 'workouts':
        return {
          label: 'QUEST SESSIONS',
          unit: 'sessions',
          barColor: 'from-cyan-neon to-cyan-dark',
          glowColor: 'shadow-[0_0_12px_rgba(0,245,255,0.4)]',
          textColor: 'text-cyan-neon',
          format: (v) => `${v}`,
        };
      case 'calories':
        return {
          label: 'METABOLIC BURN',
          unit: 'kcal',
          barColor: 'from-crimson-aura to-amber-500',
          glowColor: 'shadow-[0_0_12px_rgba(255,42,95,0.4)]',
          textColor: 'text-crimson-aura',
          format: (v) => `${v.toLocaleString()} kcal`,
        };
      case 'minutes':
      default:
        return {
          label: 'ACTIVE TRAINING TIME',
          unit: 'minutes',
          barColor: 'from-violet-neon to-cyan-neon',
          glowColor: 'shadow-[0_0_12px_rgba(139,92,246,0.4)]',
          textColor: 'text-violet-glow',
          format: (v) => `${v} min`,
        };
    }
  };

  const config = getMetricConfig();

  // Find peak for scaling
  const values = data.map((d) => Number(d[activeMetric]) || 0);
  const maxValue = Math.max(...values, 1);
  const totalValue = values.reduce((sum, v) => sum + v, 0);

  return (
    <GlassCard glow="cyan" className="p-5 flex flex-col justify-between space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-neon/10 border border-cyan-neon/30 flex items-center justify-center text-cyan-neon shadow-[0_0_10px_rgba(0,245,255,0.2)]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wide">
              7-DAY ACTIVITY CYCLE
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              ROLLING TELEMETRY (UTC)
            </span>
          </div>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveMetric('minutes')}
            className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold transition-all ${
              activeMetric === 'minutes'
                ? 'bg-violet-neon/20 text-violet-glow border border-violet-neon/40 shadow-glow-violet'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MINUTES
          </button>
          <button
            onClick={() => setActiveMetric('calories')}
            className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold transition-all ${
              activeMetric === 'calories'
                ? 'bg-crimson-aura/20 text-crimson-aura border border-crimson-aura/40 shadow-glow-crimson'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CALORIES
          </button>
          <button
            onClick={() => setActiveMetric('workouts')}
            className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold transition-all ${
              activeMetric === 'workouts'
                ? 'bg-cyan-neon/20 text-cyan-neon border border-cyan-neon/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            QUESTS
          </button>
        </div>
      </div>

      {/* Chart Visualization Area */}
      <div className="pt-2">
        <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 pb-2 border-b border-slate-800/80">
          {data.map((item, idx) => {
            const rawVal = Number(item[activeMetric]) || 0;
            const heightPercent = maxValue > 0 ? Math.round((rawVal / maxValue) * 100) : 0;
            const isZero = rawVal === 0;

            return (
              <div key={`${item.date}-${idx}`} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-8 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-100 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                  <span className="font-bold text-cyan-neon">{config.format(rawVal)}</span>
                  <span className="text-slate-400 ml-1">({item.date})</span>
                </div>

                {/* Animated Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${isZero ? 4 : Math.max(8, heightPercent)}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: 'easeOut' }}
                  className={`w-full max-w-[36px] rounded-t-md transition-all duration-200 ${
                    isZero
                      ? 'bg-slate-800/60'
                      : `bg-gradient-to-t ${config.barColor} ${config.glowColor} group-hover:brightness-125`
                  }`}
                />

                {/* Value Label on Top of Bar for desktop */}
                {!isZero && (
                  <span className="hidden sm:block text-[9px] font-mono font-bold text-slate-400 absolute -top-5">
                    {rawVal}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* X-Axis Day Labels */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 px-2 pt-2">
          {data.map((item, idx) => (
            <div key={`label-${item.date}-${idx}`} className="flex-1 text-center">
              <span className="text-[10px] font-orbitron font-bold text-slate-300 block">
                {item.day}
              </span>
              <span className="text-[8px] font-mono text-slate-500 hidden sm:block truncate">
                {item.date.split('-').slice(1).join('/')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Footer Summary */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">
          7-Day Cumulative: <strong className={config.textColor}>{config.format(totalValue)}</strong>
        </span>
        <span className="text-slate-500">
          Daily Peak: <strong className="text-slate-300">{config.format(maxValue === 1 && totalValue === 0 ? 0 : maxValue)}</strong>
        </span>
      </div>
    </GlassCard>
  );
};

export default WeeklyActivityChart;
