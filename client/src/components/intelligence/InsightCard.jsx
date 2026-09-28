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
        textColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400',
      };
    case 'STREAK':
      return {
        icon: Flame,
        label: 'STREAK TELEMETRY',
        textColor: 'text-amber-400',
        badgeBg: 'bg-amber-950/40 border-amber-800/50 text-amber-400',
      };
    case 'ACTIVITY':
      return {
        icon: Dumbbell,
        label: 'DISCIPLINE PATTERN',
        textColor: 'text-bone-200',
        badgeBg: 'bg-steel-800/60 border-steel-700 text-bone-200',
      };
    case 'PROGRESS':
      return {
        icon: TrendingUp,
        label: 'PROGRESS TRAJECTORY',
        textColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400',
      };
    case 'PATTERN':
      return {
        icon: Clock,
        label: 'METABOLIC WORKLOAD',
        textColor: 'text-crimson-400',
        badgeBg: 'bg-crimson-950/40 border-crimson-800/50 text-crimson-300',
      };
    case 'FOCUS':
    default:
      return {
        icon: Target,
        label: 'STRATEGIC FOCUS',
        textColor: 'text-amber-300',
        badgeBg: 'bg-amber-950/40 border-amber-800/50 text-amber-300',
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
      <GlassCard glow="none" className="p-4 sm:p-5 flex flex-col justify-between space-y-3 h-full border-steel-700/60 bg-charcoal-900/90 shadow-steel-card">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 border-b border-steel-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded ${config.badgeBg} border flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className={`text-[10px] font-orbitron font-bold tracking-wider uppercase ${config.textColor}`}>
              {config.label}
            </span>
          </div>

          {priority === 'HIGH' && (
            <span className="text-[9px] font-orbitron font-extrabold px-1.5 py-0.5 rounded bg-crimson-950/50 border border-crimson-800/60 text-crimson-400">
              KEY INSIGHT
            </span>
          )}
        </div>

        {/* Content Hierarchy: WHAT HAPPENED -> WHY IT MATTERS */}
        <div className="space-y-2.5 flex-1">
          <div>
            <span className="text-[9px] font-orbitron font-bold tracking-wider text-ash-500 uppercase block mb-0.5">
              WHAT HAPPENED:
            </span>
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-bone-100 uppercase tracking-wide">
              {title}
            </h4>
          </div>

          <div>
            <span className="text-[9px] font-orbitron font-bold tracking-wider text-ash-500 uppercase block mb-0.5">
              WHY IT MATTERS:
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>

        {/* Card Footer: Data Source / Evidence */}
        {dataSource && (
          <div className="pt-2 border-t border-steel-800 flex items-center gap-1.5 text-[10px] font-mono text-ash-500">
            <Info className="w-3 h-3 text-steel-500 flex-shrink-0" />
            <span className="truncate">Source: {dataSource}</span>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default InsightCard;
