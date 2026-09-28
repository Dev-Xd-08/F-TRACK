import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, Flame, Zap } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export const WorkoutHUD = ({ workouts = [] }) => {
  // Compute metrics from real workout records
  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);

  // Compute Streak in consecutive active days
  const calculateStreak = () => {
    if (workouts.length === 0) return 0;

    // Extract unique sorted date strings (YYYY-MM-DD)
    const dates = Array.from(
      new Set(
        workouts.map((w) => new Date(w.workoutDate).toISOString().split('T')[0])
      )
    ).sort().reverse();

    if (dates.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If latest workout was neither today nor yesterday, streak is broken
    if (dates[0] !== today && dates[0] !== yesterday) {
      return 0;
    }

    let streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]);
      const prev = new Date(dates[i + 1]);
      const diffDays = Math.round((current - prev) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const streakDays = calculateStreak();

  const stats = [
    {
      label: 'TOTAL WORKOUTS',
      value: totalWorkouts,
      unit: 'QUESTS',
      icon: Dumbbell,
      iconColor: 'text-steel-light',
      textColor: 'text-bone',
      subtext: 'COMPLETED SESSIONS',
    },
    {
      label: 'TOTAL MINUTES',
      value: totalMinutes,
      unit: 'MINS',
      icon: Clock,
      iconColor: 'text-steel-light',
      textColor: 'text-bone',
      subtext: 'TIME IN COMBAT',
    },
    {
      label: 'CALORIES BURNED',
      value: totalCalories.toLocaleString(),
      unit: 'KCAL',
      icon: Flame,
      iconColor: 'text-crimson-bright',
      textColor: 'text-crimson-bright',
      subtext: 'METABOLIC EXPENDITURE',
    },
    {
      label: 'WARRIOR STREAK',
      value: streakDays,
      unit: 'DAYS',
      icon: Zap,
      iconColor: 'text-brass',
      textColor: 'text-brass',
      subtext: streakDays > 0 ? 'FLAME IGNITED' : 'TRAIN TODAY TO IGNITE',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <GlassCard className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-orbitron font-bold tracking-wider text-ash uppercase">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg bg-charcoal border border-steel/60 ${stat.iconColor} shadow-steel-card`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-orbitron font-black text-3xl sm:text-4xl ${stat.textColor}`}>
                    {stat.value}
                  </span>
                  <span className="text-xs font-orbitron font-bold text-ash">
                    {stat.unit}
                  </span>
                </div>
                <p className="text-[10px] text-ash font-mono tracking-wide mt-1">
                  {stat.subtext}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WorkoutHUD;
