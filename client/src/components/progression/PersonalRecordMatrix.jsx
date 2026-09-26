import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Dumbbell, 
  Calendar, 
  Zap, 
  Crown, 
  Award,
  AlertCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * PersonalRecordMatrix Component (Stage 7)
 * Displays verified personal fitness records derived exclusively from real workout history.
 * No hardcoded stats, no fabricated numbers.
 */
export const PersonalRecordMatrix = ({ records }) => {
  const {
    totalWorkouts = 0,
    totalActiveMinutes = 0,
    totalCaloriesBurned = 0,
    longestWorkout = null,
    highestCalories = null,
    mostActiveWeek = null,
    currentStreak = 0,
    longestStreak = 0,
    hasRecords = false,
  } = records || {};

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-mythic/10 border border-gold-mythic/30 flex items-center justify-center text-gold-mythic shadow-[0_0_12px_rgba(255,184,0,0.25)]">
            <Trophy className="w-4 h-4 text-gold-mythic" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
              PERSONAL RECORD MATRIX
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-gold-mythic border border-slate-700">
                VERIFIED TELEMETRY
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Calculated exclusively from your authenticated workout quest history
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-500 uppercase">
            {hasRecords && totalWorkouts > 0 ? `${totalWorkouts} SESSIONS RECORDED` : 'INITIALIZING ARCHIVE'}
          </span>
        </div>
      </div>

      {/* Empty State Banner if no records yet */}
      {(!hasRecords || totalWorkouts === 0) ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8 bg-obsidian/70 border border-dashed border-slate-800 text-center space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <Award className="w-6 h-6 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="font-orbitron font-bold text-sm text-slate-200 uppercase tracking-wider">
              NO RECORDS YET
            </h4>
            <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
              Complete your first workout quest to begin building your personal record matrix. 
              Peak duration, calorie burnout, and weekly records will automatically calculate from real training data.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-6 text-[11px] font-mono text-slate-500">
            <span>Total Workouts: 0</span>
            <span>•</span>
            <span>Active Time: 0 min</span>
            <span>•</span>
            <span>Calories: 0 kcal</span>
          </div>
        </motion.div>
      ) : (
        /* Records Grid (4 Columns on Desktop, 2 on Tablet, 1 on Mobile) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Longest Workout */}
          <GlassCard glow="cyan" className="p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-neon" />
                LONGEST WORKOUT
              </span>
              <span className="text-[9px] font-orbitron font-bold px-1.5 py-0.5 rounded bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon">
                PEAK TIME
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <p className="font-orbitron font-black text-3xl text-cyan-neon">
                  {longestWorkout ? longestWorkout.value : '--'}
                </p>
                <span className="text-xs font-mono text-slate-400">MINUTES</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate mt-1">
                {longestWorkout
                  ? `${longestWorkout.activityType} (${new Date(longestWorkout.workoutDate).toLocaleDateString()})`
                  : 'Pending recorded session'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>SINGLE SESSION PEAK</span>
              <span className="text-cyan-neon font-bold">PR</span>
            </div>
          </GlassCard>

          {/* Card 2: Highest Calories Burned */}
          <GlassCard glow="crimson" className="p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-crimson-aura" />
                HIGHEST CALORIES
              </span>
              <span className="text-[9px] font-orbitron font-bold px-1.5 py-0.5 rounded bg-crimson-aura/10 border border-crimson-aura/30 text-crimson-aura">
                PEAK BURN
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <p className="font-orbitron font-black text-3xl text-crimson-aura">
                  {highestCalories ? highestCalories.value.toLocaleString() : '--'}
                </p>
                <span className="text-xs font-mono text-slate-400">KCAL</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate mt-1">
                {highestCalories
                  ? `${highestCalories.activityType} (${new Date(highestCalories.workoutDate).toLocaleDateString()})`
                  : 'Pending recorded session'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>METABOLIC POWER PR</span>
              <span className="text-crimson-aura font-bold">MAX</span>
            </div>
          </GlassCard>

          {/* Card 3: Most Active Week */}
          <GlassCard glow="gold" className="p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-mythic" />
                MOST ACTIVE WEEK
              </span>
              <span className="text-[9px] font-orbitron font-bold px-1.5 py-0.5 rounded bg-gold-mythic/15 border border-gold-mythic/40 text-gold-mythic">
                VOLUME PR
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <p className="font-orbitron font-black text-3xl text-gold-mythic">
                  {mostActiveWeek ? mostActiveWeek.count : '--'}
                </p>
                <span className="text-xs font-mono text-slate-400">WORKOUTS</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate mt-1">
                {mostActiveWeek
                  ? `Week of ${mostActiveWeek.start}`
                  : 'Pending calendar week logs'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>MON – SUN CYCLE</span>
              <span className="text-gold-mythic font-bold">RECORD</span>
            </div>
          </GlassCard>

          {/* Card 4: Streak Mastery */}
          <GlassCard glow="violet" className="p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-violet-glow" />
                STREAK MASTERY
              </span>
              <span className="text-[9px] font-orbitron font-bold px-1.5 py-0.5 rounded bg-violet-neon/10 border border-violet-neon/30 text-violet-glow">
                ACTIVE
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <p className="font-orbitron font-black text-3xl text-violet-glow">
                  {currentStreak}
                </p>
                <span className="text-xs font-mono text-slate-400">DAYS ACTIVE</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                All-time record: <span className="text-slate-200 font-bold">{longestStreak} days</span>
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>DAILY CONTINUITY</span>
              <span className="text-amber-400 font-bold">🔥 RECORD</span>
            </div>
          </GlassCard>

        </div>
      )}
    </div>
  );
};

export default PersonalRecordMatrix;
