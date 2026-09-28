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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-obsidian border border-steel flex items-center justify-center text-crimson">
            <Trophy className="w-4 h-4 text-crimson" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-xs sm:text-sm text-offwhite flex items-center gap-2 tracking-wider">
              PERFORMANCE SPECIFICATION DOSSIER
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-charcoal text-ash border border-steel/60">
                VERIFIED RECORDS
              </span>
            </h3>
            <p className="text-[11px] text-ash font-sans">
              Calculated exclusively from authenticated workout quest history
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-ash uppercase">
            {hasRecords && totalWorkouts > 0 ? `${totalWorkouts} SESSIONS RECORDED` : 'ARCHIVE INITIALIZING'}
          </span>
        </div>
      </div>

      {/* Empty State Banner if no records yet */}
      {(!hasRecords || totalWorkouts === 0) ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-sm p-8 bg-charcoal border border-dashed border-steel text-center space-y-3 shadow-steel-card"
        >
          <div className="w-12 h-12 rounded-sm bg-obsidian border border-steel flex items-center justify-center mx-auto text-steel">
            <Award className="w-6 h-6 text-steel-light" />
          </div>
          <div className="space-y-1">
            <h4 className="font-orbitron font-bold text-sm text-offwhite uppercase tracking-wider">
              NO RECORDS LOGGED
            </h4>
            <p className="text-xs text-ash font-sans max-w-md mx-auto">
              Execute your first training mission to calibrate your personal performance dossier. 
              Peak duration, calorie burnout, and volume records will compile automatically.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-6 text-[11px] font-mono text-ash">
            <span>Workouts: 0</span>
            <span>•</span>
            <span>Active: 0 min</span>
            <span>•</span>
            <span>Burnout: 0 kcal</span>
          </div>
        </motion.div>
      ) : (
        /* Records Grid (4 Columns on Desktop, 2 on Tablet, 1 on Mobile) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Longest Workout */}
          <GlassCard glow="none" className="p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-ash uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-steel-light" />
                PEAK DURATION
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-obsidian border border-steel text-offwhite">
                MAX SESSION
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <p className="font-orbitron font-black text-3xl sm:text-4xl text-offwhite">
                  {longestWorkout ? longestWorkout.value : '--'}
                </p>
                <span className="text-xs font-mono text-ash">MINUTES</span>
              </div>
              <p className="text-[11px] font-mono text-ash truncate mt-1">
                {longestWorkout
                  ? `${longestWorkout.activityType} (${new Date(longestWorkout.workoutDate).toLocaleDateString()})`
                  : 'Pending recorded session'}
              </p>
            </div>

            <div className="pt-2 border-t border-steel/50 flex items-center justify-between text-[10px] font-mono text-ash">
              <span>SINGLE SESSION LIMIT</span>
              <span className="text-crimson font-bold">RECORD</span>
            </div>
          </GlassCard>

          {/* Card 2: Highest Calories Burned */}
          <GlassCard glow="none" className="p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-ash uppercase flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-crimson" />
                PEAK EXPENDITURE
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-obsidian border border-crimson/50 text-crimson">
                METABOLIC MAX
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <p className="font-orbitron font-black text-3xl sm:text-4xl text-crimson">
                  {highestCalories ? highestCalories.value.toLocaleString() : '--'}
                </p>
                <span className="text-xs font-mono text-ash">KCAL</span>
              </div>
              <p className="text-[11px] font-mono text-ash truncate mt-1">
                {highestCalories
                  ? `${highestCalories.activityType} (${new Date(highestCalories.workoutDate).toLocaleDateString()})`
                  : 'Pending recorded session'}
              </p>
            </div>

            <div className="pt-2 border-t border-steel/50 flex items-center justify-between text-[10px] font-mono text-ash">
              <span>ENERGY OUTPUT BURNOUT</span>
              <span className="text-crimson font-bold">MAX PR</span>
            </div>
          </GlassCard>

          {/* Card 3: Most Active Week */}
          <GlassCard glow="none" className="p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-ash uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-steel-light" />
                VOLUME CYCLE
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-obsidian border border-steel text-offwhite">
                WEEKLY PEAK
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <p className="font-orbitron font-black text-3xl sm:text-4xl text-offwhite">
                  {mostActiveWeek ? mostActiveWeek.count : '--'}
                </p>
                <span className="text-xs font-mono text-ash">SESSIONS</span>
              </div>
              <p className="text-[11px] font-mono text-ash truncate mt-1">
                {mostActiveWeek
                  ? `Week of ${mostActiveWeek.start}`
                  : 'Pending calendar week logs'}
              </p>
            </div>

            <div className="pt-2 border-t border-steel/50 flex items-center justify-between text-[10px] font-mono text-ash">
              <span>7-DAY SUSTAINED WORKLOAD</span>
              <span className="text-bone font-bold">CYCLE PR</span>
            </div>
          </GlassCard>

          {/* Card 4: Streak Mastery */}
          <GlassCard glow="none" className="p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-wider text-ash uppercase flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-crimson" />
                STREAK ENDURANCE
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-obsidian border border-steel text-offwhite">
                CURRENT
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <p className="font-orbitron font-black text-3xl sm:text-4xl text-bone">
                  {currentStreak}
                </p>
                <span className="text-xs font-mono text-ash">DAYS ACTIVE</span>
              </div>
              <p className="text-[11px] font-mono text-ash mt-1">
                Record endurance: <span className="text-offwhite font-bold">{longestStreak} days</span>
              </p>
            </div>

            <div className="pt-2 border-t border-steel/50 flex items-center justify-between text-[10px] font-mono text-ash">
              <span>DAILY CONTINUITY</span>
              <span className="text-crimson font-bold">RECORD</span>
            </div>
          </GlassCard>

        </div>
      )}
    </div>
  );
};

export default PersonalRecordMatrix;
