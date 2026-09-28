import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Clock, 
  Dumbbell, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';

export const TodayTelemetry = ({ workouts = [], progression = null, quests = null }) => {
  // Determine if a date represents today in user's local calendar
  const isToday = (dateVal) => {
    if (!dateVal) return false;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return false;
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  // Derive today's metrics strictly from real records
  const todayWorkouts = workouts.filter((w) => isToday(w.workoutDate || w.createdAt));
  const todayCount = todayWorkouts.length;
  const todayMinutes = todayWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
  const todayCalories = todayWorkouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);

  // Daily quest completion from real quest system
  const dailyQuests = quests?.daily || [];
  const dailyCompletedCount = dailyQuests.filter((q) => q.completed).length;
  const dailyTotalCount = dailyQuests.length;
  const dailyPercent = dailyTotalCount > 0 ? Math.round((dailyCompletedCount / dailyTotalCount) * 100) : 0;

  // Streak status
  const currentStreak = progression?.currentStreak || 0;

  const todayDateString = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 space-y-5">
      {/* Header telemetry info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-obsidian border border-steel flex items-center justify-center text-crimson">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-xs sm:text-sm text-offwhite tracking-wider flex items-center gap-2">
              TODAY'S TELEMETRY HUD
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-charcoal text-ash border border-steel/60">
                {todayDateString}
              </span>
            </h3>
            <p className="text-[11px] font-mono text-ash">
              REAL-TIME ACTIVITY FOR CURRENT 24-HOUR CYCLE
            </p>
          </div>
        </div>

        {/* Live operational badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {todayCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold bg-charcoal border border-steel text-offwhite">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
              OPERATIONAL • {todayCount} {todayCount === 1 ? 'SESSION' : 'SESSIONS'} RECORDED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold bg-charcoal border border-steel/60 text-ash">
              <span className="w-1.5 h-1.5 rounded-full bg-steel" />
              STANDBY • ZERO SESSIONS RECORDED TODAY
            </span>
          )}
        </div>
      </div>

      {/* Real-time telemetry metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Workouts Today */}
        <div className="p-3.5 sm:p-4 rounded-sm bg-obsidian border border-steel/60 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-ash">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">TODAY'S QUESTS</span>
            <Dumbbell className="w-4 h-4 text-steel-light" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-orbitron font-black text-2xl sm:text-3xl text-offwhite">
                {todayCount}
              </span>
              <span className="text-[11px] font-mono text-ash">SESSIONS</span>
            </div>
            <p className="text-[10px] font-mono text-ash mt-0.5">
              {todayCount > 0 ? 'Training quests completed today' : 'No workouts logged today'}
            </p>
          </div>
        </div>

        {/* Metric 2: Active Minutes Today */}
        <div className="p-3.5 sm:p-4 rounded-sm bg-obsidian border border-steel/60 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-ash">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">ACTIVE MINUTES</span>
            <Clock className="w-4 h-4 text-steel-light" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-orbitron font-black text-2xl sm:text-3xl text-bone">
                {todayMinutes}
              </span>
              <span className="text-[11px] font-mono text-ash">MINS</span>
            </div>
            <p className="text-[10px] font-mono text-ash mt-0.5">
              {todayMinutes > 0 ? 'Total combat time today' : 'Ready for training activation'}
            </p>
          </div>
        </div>

        {/* Metric 3: Calories Burned Today */}
        <div className="p-3.5 sm:p-4 rounded-sm bg-obsidian border border-steel/60 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-ash">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">CALORIES TODAY</span>
            <Flame className="w-4 h-4 text-crimson" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-orbitron font-black text-2xl sm:text-3xl text-crimson">
                {todayCalories.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-ash">KCAL</span>
            </div>
            <p className="text-[10px] font-mono text-ash mt-0.5">
              {todayCalories > 0 ? 'Energy exerted in sessions' : 'Metabolic burn on standby'}
            </p>
          </div>
        </div>

        {/* Metric 4: Daily Quests & Streak */}
        <div className="p-3.5 sm:p-4 rounded-sm bg-obsidian border border-steel/60 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-ash">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">DAILY QUESTS</span>
            <CheckCircle2 className="w-4 h-4 text-steel-light" />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="font-orbitron font-black text-xl sm:text-2xl text-offwhite">
                  {dailyCompletedCount}
                </span>
                <span className="text-xs font-mono text-ash">/{dailyTotalCount}</span>
              </div>
              <span className="text-[10px] font-mono text-ash font-bold">
                {currentStreak}D STREAK
              </span>
            </div>
            {/* Quest Mini Progress Bar */}
            <div className="w-full h-1.5 bg-void rounded-none mt-2 overflow-hidden border border-steel/60">
              <div 
                className="h-full bg-gradient-to-r from-crimson-dark to-crimson transition-all duration-500"
                style={{ width: `${dailyPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick link action banner if zero workouts */}
      {todayCount === 0 && (
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border-t border-steel/50">
          <span className="text-ash font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
            No workout quests recorded today. Log a session to continue your ascension streak.
          </span>
          <Link
            to="/workouts"
            className="inline-flex items-center gap-1.5 font-orbitron font-bold text-bone hover:text-offwhite transition-colors uppercase text-[11px] whitespace-nowrap"
          >
            <span>+ RECORD TODAY'S QUEST</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </GlassCard>
  );
};

export default TodayTelemetry;
