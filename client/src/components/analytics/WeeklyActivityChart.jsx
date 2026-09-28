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
          barColor: 'from-charcoal via-steel/40 to-steel',
          glowColor: '',
          textColor: 'text-bone',
          format: (v) => `${v}`,
        };
      case 'calories':
        return {
          label: 'METABOLIC BURN',
          unit: 'kcal',
          barColor: 'from-crimson-dark to-crimson',
          glowColor: '',
          textColor: 'text-crimson-bright',
          format: (v) => `${v.toLocaleString()} kcal`,
        };
      case 'minutes':
      default:
        return {
          label: 'ACTIVE TRAINING TIME',
          unit: 'minutes',
          barColor: 'from-charcoal via-steel/50 to-crimson/80',
          glowColor: '',
          textColor: 'text-bone',
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
    <GlassCard className="p-5 flex flex-col justify-between space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-charcoal border border-steel/60 flex items-center justify-center text-steel-light shadow-steel-card">
            <Activity className="w-4 h-4 text-crimson-bright" />
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-bone uppercase tracking-wide">
              7-DAY ACTIVITY CYCLE
            </h4>
            <span className="text-[10px] font-mono text-ash">
              ROLLING TELEMETRY (UTC)
            </span>
          </div>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-void border border-steel/50">
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

      {/* Chart Visualization Area */}
      <div className="pt-2">
        <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 pb-2 border-b border-steel/40">
          {data.map((item, idx) => {
            const rawVal = Number(item[activeMetric]) || 0;
            const heightPercent = maxValue > 0 ? Math.round((rawVal / maxValue) * 100) : 0;
            const isZero = rawVal === 0;

            return (
              <div key={`${item.date}-${idx}`} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-8 px-2 py-1 rounded bg-obsidian border border-steel text-[10px] font-mono text-bone pointer-events-none whitespace-nowrap z-20 shadow-steel-card">
                  <span className="font-bold text-crimson-bright">{config.format(rawVal)}</span>
                  <span className="text-ash ml-1">({item.date})</span>
                </div>

                {/* Animated Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${isZero ? 4 : Math.max(8, heightPercent)}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: 'easeOut' }}
                  className={`w-full max-w-[36px] rounded-t-sm transition-all duration-200 ${
                    isZero
                      ? 'bg-steel/15'
                      : `bg-gradient-to-t ${config.barColor} group-hover:brightness-110`
                  }`}
                />

                {/* Value Label on Top of Bar for desktop */}
                {!isZero && (
                  <span className="hidden sm:block text-[9px] font-mono font-bold text-ash absolute -top-5">
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
              <span className="text-[10px] font-orbitron font-bold text-bone block">
                {item.day}
              </span>
              <span className="text-[8px] font-mono text-ash hidden sm:block truncate">
                {item.date.split('-').slice(1).join('/')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Footer Summary */}
      <div className="pt-2 border-t border-steel/40 flex items-center justify-between text-xs font-mono">
        <span className="text-ash">
          7-Day Cumulative: <strong className={config.textColor}>{config.format(totalValue)}</strong>
        </span>
        <span className="text-ash">
          Daily Peak: <strong className="text-bone">{config.format(maxValue === 1 && totalValue === 0 ? 0 : maxValue)}</strong>
        </span>
      </div>
    </GlassCard>
  );
};

export default WeeklyActivityChart;
