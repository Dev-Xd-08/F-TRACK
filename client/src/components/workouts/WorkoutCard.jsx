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
    color: 'steel',
    badge: 'bg-gunmetal text-offwhite border-steel',
    icon: Activity,
    border: 'border-steel hover:border-steel-light',
  },
  Walking: {
    color: 'steel',
    badge: 'bg-gunmetal text-offwhite border-steel',
    icon: Compass,
    border: 'border-steel hover:border-steel-light',
  },
  Cycling: {
    color: 'steel',
    badge: 'bg-gunmetal text-offwhite border-steel',
    icon: Zap,
    border: 'border-steel hover:border-steel-light',
  },
  Gym: {
    color: 'steel',
    badge: 'bg-gunmetal text-offwhite border-steel',
    icon: Dumbbell,
    border: 'border-steel hover:border-steel-light',
  },
  Swimming: {
    color: 'steel',
    badge: 'bg-gunmetal text-offwhite border-steel',
    icon: Activity,
    border: 'border-steel hover:border-steel-light',
  },
  Yoga: {
    color: 'steel',
    badge: 'bg-gunmetal text-offwhite border-steel',
    icon: Heart,
    border: 'border-steel hover:border-steel-light',
  },
  HIIT: {
    color: 'crimson',
    badge: 'bg-charcoal text-crimson border-crimson/50',
    icon: Flame,
    border: 'border-crimson/50 hover:border-crimson',
  },
  Sports: {
    color: 'steel',
    badge: 'bg-gunmetal text-offwhite border-steel',
    icon: Trophy,
    border: 'border-steel hover:border-steel-light',
  },
  Other: {
    color: 'steel',
    badge: 'bg-gunmetal text-ash border-steel',
    icon: Dumbbell,
    border: 'border-steel hover:border-steel-light',
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`
        relative rounded-sm p-5 bg-charcoal
        border transition-all duration-200 flex flex-col justify-between
        ${meta.border} shadow-steel-card group overflow-hidden
      `}
    >
      {/* Structural Corner Notch */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-steel-light group-hover:border-crimson transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-steel-light group-hover:border-steel transition-colors" />

      {/* Card Header: Mission Designation + Date + Action Buttons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-sm border ${meta.badge}`}>
              <Icon className="w-4 h-4 text-offwhite" />
            </div>
            <div>
              <span className={`px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold tracking-wider border ${meta.badge} uppercase`}>
                {workout.activityType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(workout)}
              className="p-1.5 rounded-sm border border-steel hover:border-steel-light text-ash hover:text-offwhite bg-obsidian transition-colors"
              title="Edit Mission"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(workout)}
              className="p-1.5 rounded-sm border border-steel hover:border-crimson text-ash hover:text-crimson bg-obsidian transition-colors"
              title="Abandon Mission"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mission Metrics */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-steel/50 my-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-ash flex items-center gap-1">
              <Clock className="w-3 h-3 text-steel-light" /> DURATION
            </span>
            <p className="font-orbitron font-black text-xl text-offwhite">
              {workout.duration} <span className="text-xs font-mono text-ash">MIN</span>
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-ash flex items-center gap-1">
              <Flame className="w-3 h-3 text-crimson" /> CALORIES
            </span>
            <p className="font-orbitron font-black text-xl text-crimson">
              {workout.caloriesBurned} <span className="text-xs font-mono text-ash">KCAL</span>
            </p>
          </div>
        </div>

        {/* Optional Notes */}
        {workout.notes && (
          <p className="text-xs text-ash font-sans italic line-clamp-2 my-2">
            "{workout.notes}"
          </p>
        )}
      </div>

      {/* Card Footer: Timestamp */}
      <div className="pt-3 mt-2 border-t border-steel/50 flex items-center justify-between text-[11px] font-mono text-ash">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-ash" />
          {formattedDate}
        </span>
        <span className="text-ash font-mono text-[9px] tracking-wider uppercase font-bold">
          MISSION VERIFIED
        </span>
      </div>
    </motion.div>
  );
};

export default WorkoutCard;
