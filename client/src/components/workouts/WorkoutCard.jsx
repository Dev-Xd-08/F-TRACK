import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Flame, 
  Clock, 
  Calendar, 
  Edit3, 
  Trash2, 
  Activity, 
  Compass, 
  Zap, 
  Trophy, 
  Heart 
} from 'lucide-react';

const ACTIVITY_META = {
  Running: {
    color: 'cyan',
    badge: 'bg-cyan-neon/10 text-cyan-neon border-cyan-neon/30',
    icon: Activity,
    border: 'border-cyan-neon/30 hover:border-cyan-neon/70',
    glow: 'hover:shadow-glow-cyan',
  },
  Walking: {
    color: 'cyan',
    badge: 'bg-cyan-neon/10 text-cyan-neon border-cyan-neon/30',
    icon: Compass,
    border: 'border-cyan-neon/30 hover:border-cyan-neon/70',
    glow: 'hover:shadow-glow-cyan',
  },
  Cycling: {
    color: 'violet',
    badge: 'bg-violet-neon/10 text-violet-glow border-violet-neon/30',
    icon: Zap,
    border: 'border-violet-neon/30 hover:border-violet-neon/70',
    glow: 'hover:shadow-glow-violet',
  },
  Gym: {
    color: 'gold',
    badge: 'bg-gold-mythic/10 text-gold-mythic border-gold-mythic/30',
    icon: Dumbbell,
    border: 'border-gold-mythic/30 hover:border-gold-mythic/70',
    glow: 'hover:shadow-glow-gold',
  },
  Swimming: {
    color: 'cyan',
    badge: 'bg-cyan-neon/10 text-cyan-neon border-cyan-neon/30',
    icon: Activity,
    border: 'border-cyan-neon/30 hover:border-cyan-neon/70',
    glow: 'hover:shadow-glow-cyan',
  },
  Yoga: {
    color: 'violet',
    badge: 'bg-violet-neon/10 text-violet-glow border-violet-neon/30',
    icon: Heart,
    border: 'border-violet-neon/30 hover:border-violet-neon/70',
    glow: 'hover:shadow-glow-violet',
  },
  HIIT: {
    color: 'crimson',
    badge: 'bg-crimson-aura/10 text-crimson-aura border-crimson-aura/30',
    icon: Flame,
    border: 'border-crimson-aura/30 hover:border-crimson-aura/70',
    glow: 'hover:shadow-glow-crimson',
  },
  Sports: {
    color: 'gold',
    badge: 'bg-gold-mythic/10 text-gold-mythic border-gold-mythic/30',
    icon: Trophy,
    border: 'border-gold-mythic/30 hover:border-gold-mythic/70',
    glow: 'hover:shadow-glow-gold',
  },
  Other: {
    color: 'slate',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: Dumbbell,
    border: 'border-slate-800 hover:border-slate-700',
    glow: '',
  },
};

export const WorkoutCard = ({ workout, onEdit, onDelete }) => {
  const meta = ACTIVITY_META[workout.activityType] || ACTIVITY_META.Other;
  const Icon = meta.icon;

  // Format date
  const formattedDate = new Date(workout.workoutDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        relative rounded-xl p-6 bg-obsidian/85 backdrop-blur-md
        border transition-all duration-300 flex flex-col justify-between
        ${meta.border} ${meta.glow} group overflow-hidden
      `}
    >
      {/* Sci-Fi Corner Cuts */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-slate-600 group-hover:border-cyan-neon transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-slate-600 group-hover:border-violet-neon transition-colors" />

      {/* Card Header: Activity Badge + Date + Action Buttons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border ${meta.badge}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-orbitron font-extrabold tracking-wider border ${meta.badge} uppercase`}>
                {workout.activityType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(workout)}
              className="p-1.5 rounded-sm border border-slate-700 hover:border-cyan-neon text-slate-400 hover:text-cyan-neon bg-void/80 transition-colors"
              title="Edit Quest"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(workout)}
              className="p-1.5 rounded-sm border border-slate-700 hover:border-crimson-aura text-slate-400 hover:text-crimson-aura bg-void/80 transition-colors"
              title="Abandon Quest"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quest Metric Numbers */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800/80 my-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-orbitron font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-neon" /> DURATION
            </span>
            <p className="font-orbitron font-black text-xl text-slate-100">
              {workout.duration} <span className="text-xs font-normal text-slate-400">MIN</span>
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-orbitron font-bold text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-crimson-aura" /> CALORIES
            </span>
            <p className="font-orbitron font-black text-xl text-crimson-aura">
              {workout.caloriesBurned} <span className="text-xs font-normal text-slate-400">KCAL</span>
            </p>
          </div>
        </div>

        {/* Optional Notes */}
        {workout.notes && (
          <p className="text-xs text-slate-400 font-sans italic line-clamp-2 my-2">
            "{workout.notes}"
          </p>
        )}
      </div>

      {/* Card Footer: Timestamp */}
      <div className="pt-3 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </span>
        <span className="text-matrix-neon font-orbitron text-[9px] tracking-wider uppercase">
          QUEST VERIFIED
        </span>
      </div>
    </motion.div>
  );
};

export default WorkoutCard;
