import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Clock, Edit3, ArrowRight, ShieldCheck } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';
import GlassCard from '../ui/GlassCard';

/**
 * TrainingPlanCard Component (Stage 20)
 * Displays the operator's active adaptive plan parameters.
 */
export const TrainingPlanCard = ({
  plan,
  onOpenBuilder,
}) => {
  if (!plan) {
    return (
      <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-crimson-400 flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold block">
                ADAPTIVE SYSTEM
              </span>
              <h4 className="font-orbitron font-bold text-sm sm:text-base text-bone uppercase">
                CALIBRATE TRAINING PLAN
              </h4>
              <p className="text-xs font-sans text-ash-400">
                Define your weekly cadence so F-TRACK can adapt to missed days and busy weeks.
              </p>
            </div>
          </div>

          <AnimeButton
            variant="crimson"
            size="sm"
            icon={ArrowRight}
            onClick={onOpenBuilder}
            className="flex-shrink-0"
          >
            ESTABLISH PLAN
          </AnimeButton>
        </div>
      </GlassCard>
    );
  }

  const {
    name = 'Adaptive Weekly Training Plan',
    weeklyTargetSessions = 3,
    preferredSessionDuration = 25,
    preferredDays = ['MON', 'WED', 'FRI'],
    focusAreas = ['Discipline & Consistency'],
  } = plan;

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-crimson-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-crimson-500 uppercase font-semibold block">
              TRAINING ARCHITECTURE
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              {name}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenBuilder}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-charcoal-800 border border-steel-700 text-xs font-mono text-ash-300 hover:text-bone hover:border-steel-600 transition-colors uppercase self-start sm:self-auto"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>CALIBRATE</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-sm bg-charcoal-950 border border-steel-800 space-y-0.5">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            WEEKLY TARGET
          </span>
          <div className="font-orbitron font-bold text-lg text-bone">
            {weeklyTargetSessions} SESSIONS
          </div>
        </div>

        <div className="p-3 rounded-sm bg-charcoal-950 border border-steel-800 space-y-0.5">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            PREFERRED DURATION
          </span>
          <div className="font-orbitron font-bold text-lg text-bone">
            {preferredSessionDuration} MIN
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3 rounded-sm bg-charcoal-950 border border-steel-800 space-y-0.5">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
            FOCUS EMPHASIS
          </span>
          <div className="font-mono text-xs text-bone truncate">
            {focusAreas[0] || 'Discipline'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap pt-1 text-xs font-mono">
        <span className="text-ash-400">PREFERRED DAYS:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {preferredDays.map((day) => (
            <span
              key={day}
              className="px-2 py-0.5 rounded-sm bg-steel-800 border border-steel-700 text-bone text-[11px] font-semibold"
            >
              {day}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export default TrainingPlanCard;
