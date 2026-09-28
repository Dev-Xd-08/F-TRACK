import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock, Sparkles, HelpCircle, ArrowRight, Shield } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';
import GlassCard from '../ui/GlassCard';
import QuickWorkoutPlanner from './QuickWorkoutPlanner';

/**
 * TodayFocus Component (Stage 19)
 * Empirically answers: "What should I do today?" with 100% transparent reasoning.
 * Never guesses or generates arbitrary advice; cites real weekly workouts, goals, and purpose.
 */
export const TodayFocus = ({ todayFocus, onStartWorkout, onApplyPlan }) => {
  const [plannerOpen, setPlannerOpen] = useState(false);

  if (!todayFocus) {
    return null;
  }

  const {
    title = "TODAY'S FOCUS: SUSTAINABLE DISCIPLINE",
    recommendedDuration = '20–30 MINUTE SESSION',
    trainedToday = false,
    sessionsThisWeek = 0,
    targetSessions = 3,
    reasons = [],
    actionText = "BEGIN TODAY'S SESSION",
  } = todayFocus;

  const handlePlanSelected = (planData) => {
    setPlannerOpen(false);
    if (onApplyPlan) {
      onApplyPlan(planData);
    } else if (onStartWorkout) {
      onStartWorkout(planData);
    }
  };

  return (
    <>
      <GlassCard
        glow="none"
        className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card relative overflow-hidden"
      >
        {/* Subtle accent border */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] ${
            trainedToday ? 'bg-steel-600' : 'bg-crimson-600'
          }`}
        />

        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-sm flex items-center justify-center ${
                  trainedToday
                    ? 'bg-steel-800 text-bone'
                    : 'bg-crimson-950/60 border border-crimson-800/80 text-crimson-400'
                }`}
              >
                {trainedToday ? <CheckCircle2 className="w-4 h-4" /> : <Target className="w-4 h-4" />}
              </div>
              <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold">
                DAILY TRAINING FOCUS & DIRECTION
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-ash-400">WEEKLY CADENCE:</span>
              <span className="text-bone font-bold">
                {sessionsThisWeek} / {targetSessions} SESSIONS
              </span>
            </div>
          </div>

          {/* Main Focus Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-orbitron font-bold text-lg sm:text-xl text-bone uppercase tracking-tight">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-crimson-400">
                <Clock className="w-3.5 h-3.5" />
                <span>RECOMMENDED DURATION: {recommendedDuration}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 md:pt-0">
              <button
                type="button"
                onClick={() => setPlannerOpen(true)}
                className="px-3 py-2 rounded-sm bg-charcoal-800 border border-steel-700 text-xs font-mono text-ash-300 hover:text-bone hover:border-steel-600 transition-colors uppercase"
              >
                TIME-BASED PLANNER
              </button>

              <AnimeButton
                variant={trainedToday ? 'outline' : 'crimson'}
                size="sm"
                icon={ArrowRight}
                onClick={() => onStartWorkout && onStartWorkout({ duration: 25, activityType: 'General Training' })}
              >
                {actionText}
              </AnimeButton>
            </div>
          </div>

          {/* Transparent Reasons Section ("Why this recommendation?") */}
          {reasons && reasons.length > 0 && (
            <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-ash-400">
                <HelpCircle className="w-3 h-3 text-steel-500" />
                <span>TRANSPARENT SYSTEM RATIONALE:</span>
              </div>
              <ul className="space-y-1.5 text-xs font-sans text-ash-300 pl-1">
                {reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-steel-500 mt-2 flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Quick Workout Planner Modal */}
      <QuickWorkoutPlanner
        isOpen={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        onSelectPlan={handlePlanSelected}
      />
    </>
  );
};

export default TodayFocus;
