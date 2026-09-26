import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Clock,
  TrendingUp,
  Target,
  Flame,
  Dumbbell,
  Sparkles,
  Info,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * Get category icon and styling
 */
const getCategoryConfig = (category) => {
  switch (category) {
    case 'CONSISTENCY':
      return {
        icon: Activity,
        label: 'CONSISTENCY INDEX',
        textColor: 'text-cyan-neon',
        badgeBg: 'bg-cyan-neon/15 border-cyan-neon/40 text-cyan-neon',
        glow: 'cyan',
      };
    case 'STREAK':
      return {
        icon: Flame,
        label: 'STREAK TELEMETRY',
        textColor: 'text-amber-400',
        badgeBg: 'bg-amber-400/15 border-amber-400/40 text-amber-400',
        glow: 'matrix',
      };
    case 'ACTIVITY':
      return {
        icon: Dumbbell,
        label: 'DISCIPLINE PATTERN',
        textColor: 'text-violet-glow',
        badgeBg: 'bg-violet-neon/15 border-violet-neon/40 text-violet-glow',
        glow: 'violet',
      };
    case 'PROGRESS':
      return {
        icon: TrendingUp,
        label: 'PROGRESS TRAJECTORY',
        textColor: 'text-matrix-neon',
        badgeBg: 'bg-matrix-neon/15 border-matrix-neon/40 text-matrix-neon',
        glow: 'matrix',
      };
    case 'PATTERN':
      return {
        icon: Clock,
        label: 'METABOLIC WORKLOAD',
        textColor: 'text-crimson-aura',
        badgeBg: 'bg-crimson-aura/15 border-crimson-aura/40 text-crimson-aura',
        glow: 'crimson',
      };
    case 'FOCUS':
    default:
      return {
        icon: Target,
        label: 'STRATEGIC FOCUS',
        textColor: 'text-gold-mythic',
        badgeBg: 'bg-gold-mythic/15 border-gold-mythic/40 text-gold-mythic',
        glow: 'cyan',
      };
  }
};

/**
 * InsightCard Component (Stage 12)
 * Renders an individual explainable fitness intelligence insight card
 */
export const InsightCard = ({ insight, index = 0 }) => {
  if (!insight) return null;

  const { category, title, explanation, dataSource, priority = 'MEDIUM' } = insight;
  const config = getCategoryConfig(category);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <GlassCard glow={config.glow} className="p-4 sm:p-5 flex flex-col justify-between space-y-3 h-full">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg ${config.badgeBg} border flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className={`text-[10px] font-orbitron font-bold tracking-wider uppercase ${config.textColor}`}>
              {config.label}
            </span>
          </div>

          {priority === 'HIGH' && (
            <span className="text-[9px] font-orbitron font-extrabold px-1.5 py-0.5 rounded bg-crimson-aura/15 border border-crimson-aura/40 text-crimson-aura">
              KEY INSIGHT
            </span>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1.5 flex-1">
          <h4 className="font-orbitron font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wide">
            {title}
          </h4>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Card Footer: Data Source / Evidence */}
        {dataSource && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
            <Info className="w-3 h-3 text-slate-600 flex-shrink-0" />
            <span className="truncate">Source: {dataSource}</span>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default InsightCard;
