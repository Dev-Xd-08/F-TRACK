import React from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  Dumbbell, 
  Flame, 
  Clock, 
  Footprints, 
  Bike, 
  Waves, 
  Heart, 
  Zap, 
  Trophy, 
  HelpCircle 
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * Activity icon mapping
 */
const getActivityIcon = (type) => {
  switch (type) {
    case 'Running':
      return Footprints;
    case 'Walking':
      return Footprints;
    case 'Cycling':
      return Bike;
    case 'Gym':
      return Dumbbell;
    case 'Swimming':
      return Waves;
    case 'Yoga':
      return Heart;
    case 'HIIT':
      return Zap;
    case 'Sports':
      return Trophy;
    default:
      return HelpCircle;
  }
};

/**
 * Activity theme color mapping
 */
const getActivityColor = (type) => {
  switch (type) {
    case 'Running':
      return {
        text: 'text-cyan-neon',
        bg: 'bg-cyan-neon/15',
        border: 'border-cyan-neon/40',
        bar: 'bg-cyan-neon',
        glow: 'shadow-[0_0_8px_rgba(0,245,255,0.4)]',
      };
    case 'Gym':
      return {
        text: 'text-violet-glow',
        bg: 'bg-violet-neon/15',
        border: 'border-violet-neon/40',
        bar: 'bg-violet-neon',
        glow: 'shadow-[0_0_8px_rgba(139,92,246,0.4)]',
      };
    case 'HIIT':
      return {
        text: 'text-crimson-aura',
        bg: 'bg-crimson-aura/15',
        border: 'border-crimson-aura/40',
        bar: 'bg-crimson-aura',
        glow: 'shadow-[0_0_8px_rgba(255,42,95,0.4)]',
      };
    case 'Cycling':
      return {
        text: 'text-matrix-neon',
        bg: 'bg-matrix-neon/15',
        border: 'border-matrix-neon/40',
        bar: 'bg-matrix-neon',
        glow: 'shadow-[0_0_8px_rgba(0,255,102,0.4)]',
      };
    case 'Swimming':
      return {
        text: 'text-blue-400',
        bg: 'bg-blue-400/15',
        border: 'border-blue-400/40',
        bar: 'bg-blue-400',
        glow: 'shadow-[0_0_8px_rgba(96,165,250,0.4)]',
      };
    case 'Yoga':
      return {
        text: 'text-purple-300',
        bg: 'bg-purple-300/15',
        border: 'border-purple-300/40',
        bar: 'bg-purple-300',
        glow: 'shadow-[0_0_8px_rgba(216,180,254,0.4)]',
      };
    case 'Sports':
      return {
        text: 'text-gold-mythic',
        bg: 'bg-gold-mythic/15',
        border: 'border-gold-mythic/40',
        bar: 'bg-gold-mythic',
        glow: 'shadow-[0_0_8px_rgba(255,184,0,0.4)]',
      };
    case 'Walking':
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-400/15',
        border: 'border-emerald-400/40',
        bar: 'bg-emerald-400',
        glow: 'shadow-[0_0_8px_rgba(52,211,153,0.4)]',
      };
    default:
      return {
        text: 'text-slate-300',
        bg: 'bg-slate-700/30',
        border: 'border-slate-600',
        bar: 'bg-slate-400',
        glow: '',
      };
  }
};

/**
 * ActivityBreakdown Component (Stage 10)
 * Visualizes the warrior's training discipline distribution across 9 activity types
 */
export const ActivityBreakdown = ({ data = [] }) => {
  // Filter active disciplines (having at least 1 workout) or fallback to top if all zero
  const activeDisciplines = data.filter((item) => item.workouts > 0);
  const totalWorkouts = data.reduce((sum, item) => sum + item.workouts, 0);

  return (
    <GlassCard glow="cyan" className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-neon/10 border border-cyan-neon/30 flex items-center justify-center text-cyan-neon shadow-[0_0_10px_rgba(0,245,255,0.2)]">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wide">
              TRAINING DISCIPLINE BREAKDOWN
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              ACTIVITY MATRIX & VOLUME DISTRIBUTION
            </span>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-neon">
          {activeDisciplines.length} / {data.length} ACTIVE DISCIPLINES
        </span>
      </div>

      {/* Zero State */}
      {totalWorkouts === 0 ? (
        <div className="py-8 text-center space-y-2">
          <p className="text-xs font-mono text-slate-400">
            NO TRAINING DISCIPLINES RECORDED YET
          </p>
          <p className="text-[11px] text-slate-500 font-sans">
            Complete workouts across Running, Gym, Cycling, HIIT, and more to map your activity distribution.
          </p>
        </div>
      ) : (
        /* Breakdown Items */
        <div className="space-y-3 pt-1">
          {activeDisciplines.map((item, idx) => {
            const colors = getActivityColor(item.type);
            const Icon = getActivityIcon(item.type);

            return (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-3 rounded-lg bg-void/60 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2"
              >
                {/* Row Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-md ${colors.bg} ${colors.border} border flex items-center justify-center ${colors.text}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-orbitron font-bold text-xs text-slate-200 uppercase">
                        {item.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 ml-2">
                        {item.workouts} {item.workouts === 1 ? 'quest' : 'quests'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {item.minutes}m
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-crimson-aura" />
                      {item.calories} kcal
                    </span>
                    <span className={`font-orbitron font-bold text-xs ${colors.text} min-w-[36px] text-right`}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.6, delay: 0.1 + idx * 0.05, ease: 'easeOut' }}
                    className={`h-full rounded-full ${colors.bar} ${colors.glow}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
};

export default ActivityBreakdown;
