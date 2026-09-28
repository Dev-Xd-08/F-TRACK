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
        text: 'text-bone',
        bg: 'bg-charcoal',
        border: 'border-steel/60',
        bar: 'bg-crimson',
        glow: '',
      };
    case 'Gym':
      return {
        text: 'text-bone',
        bg: 'bg-charcoal',
        border: 'border-steel/60',
        bar: 'bg-steel-light',
        glow: '',
      };
    case 'HIIT':
      return {
        text: 'text-crimson-bright',
        bg: 'bg-crimson/20',
        border: 'border-crimson/50',
        bar: 'bg-crimson-bright',
        glow: '',
      };
    case 'Cycling':
      return {
        text: 'text-bone',
        bg: 'bg-charcoal',
        border: 'border-steel/60',
        bar: 'bg-steel',
        glow: '',
      };
    case 'Swimming':
      return {
        text: 'text-bone',
        bg: 'bg-charcoal',
        border: 'border-steel/60',
        bar: 'bg-steel-light',
        glow: '',
      };
    case 'Yoga':
      return {
        text: 'text-ash',
        bg: 'bg-charcoal',
        border: 'border-steel/60',
        bar: 'bg-ash',
        glow: '',
      };
    case 'Sports':
      return {
        text: 'text-brass',
        bg: 'bg-charcoal',
        border: 'border-brass/40',
        bar: 'bg-brass',
        glow: '',
      };
    case 'Walking':
      return {
        text: 'text-bone',
        bg: 'bg-charcoal',
        border: 'border-steel/60',
        bar: 'bg-steel/80',
        glow: '',
      };
    default:
      return {
        text: 'text-ash',
        bg: 'bg-charcoal',
        border: 'border-steel/40',
        bar: 'bg-steel/50',
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
    <GlassCard className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-steel/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-charcoal border border-steel/60 flex items-center justify-center text-steel-light shadow-steel-card">
            <PieChart className="w-4 h-4 text-crimson-bright" />
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-bone uppercase tracking-wide">
              TRAINING DISCIPLINE BREAKDOWN
            </h4>
            <span className="text-[10px] font-mono text-ash">
              ACTIVITY MATRIX & VOLUME DISTRIBUTION
            </span>
          </div>
        </div>

        <span className="text-xs font-mono text-ash">
          {activeDisciplines.length} / {data.length} ACTIVE DISCIPLINES
        </span>
      </div>

      {/* Zero State */}
      {totalWorkouts === 0 ? (
        <div className="py-8 text-center space-y-2">
          <p className="text-xs font-mono text-ash">
            NO TRAINING DISCIPLINES RECORDED YET
          </p>
          <p className="text-[11px] text-ash font-sans">
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
                className="p-3 rounded-lg bg-void/80 border border-steel/40 hover:border-steel/80 transition-colors space-y-2"
              >
                {/* Row Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-md ${colors.bg} ${colors.border} border flex items-center justify-center ${colors.text}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-orbitron font-bold text-xs text-bone uppercase">
                        {item.type}
                      </span>
                      <span className="text-[10px] font-mono text-ash ml-2">
                        {item.workouts} {item.workouts === 1 ? 'quest' : 'quests'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-ash flex items-center gap-1">
                      <Clock className="w-3 h-3 text-steel" />
                      {item.minutes}m
                    </span>
                    <span className="text-ash flex items-center gap-1">
                      <Flame className="w-3 h-3 text-crimson-bright" />
                      {item.calories} kcal
                    </span>
                    <span className={`font-orbitron font-bold text-xs ${colors.text} min-w-[36px] text-right`}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-charcoal rounded-sm overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.6, delay: 0.1 + idx * 0.05, ease: 'easeOut' }}
                    className={`h-full rounded-sm ${colors.bar}`}
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
