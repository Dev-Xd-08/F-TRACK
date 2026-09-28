import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Moon, Sparkles, AlertCircle, ArrowRight, RefreshCw, PenSquare } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';
import GlassCard from '../ui/GlassCard';

/**
 * AdaptiveWeekCard Component (Stage 20)
 * Visualizes the user's weekly training rhythm and adaptive rebalancing.
 * If a session is missed, never blames the user; demonstrates that the plan adjusts to real life.
 */
export const AdaptiveWeekCard = ({
  weekStatus,
  onOpenReflection,
  onOpenPlanBuilder,
  onStartWorkout,
}) => {
  if (!weekStatus) return null;

  const {
    targetSessions = 3,
    completedSessions = 0,
    daysRemainingInWeek = 0,
    lifeLoad = 'NORMAL',
    days = [],
    rebalanceNeeded = false,
    rebalanceMessage = null,
  } = weekStatus;

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-crimson-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-crimson-500 uppercase font-semibold block">
              ADAPTIVE WEEKLY ARCHITECTURE
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              YOUR TRAINING WEEK
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-ash-400">VOLUME:</span>
          <span className="text-bone font-bold">
            {completedSessions} / {targetSessions} SESSIONS
          </span>
          <span className="text-steel-600">•</span>
          <span className="text-ash-400">
            {daysRemainingInWeek} {daysRemainingInWeek === 1 ? 'DAY' : 'DAYS'} REMAIN
          </span>
        </div>
      </div>

      {/* Rebalance Banner if plan adapted */}
      {rebalanceNeeded && rebalanceMessage && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-sm bg-charcoal-950 border border-amber-600/50 space-y-1"
        >
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-amber-500 uppercase">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{rebalanceMessage.heading}</span>
          </div>
          <p className="text-xs font-sans text-ash-300 leading-relaxed">
            {rebalanceMessage.body}
          </p>
        </motion.div>
      )}

      {/* 7-Day Week Strip */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
        {days.map((day) => {
          const isDone = day.status === 'COMPLETED';
          const isToday = day.isToday;
          const isRest = day.status === 'REST_DAY';
          const isMissed = day.status === 'MISSED';

          let borderStyle = 'border-steel-800 bg-charcoal-950';
          let textColor = 'text-ash-400';

          if (isDone) {
            borderStyle = 'border-emerald-600/70 bg-emerald-950/20';
            textColor = 'text-emerald-300';
          } else if (isToday) {
            borderStyle = 'border-crimson-600 bg-crimson-950/30';
            textColor = 'text-bone';
          } else if (isMissed) {
            borderStyle = 'border-steel-800/80 bg-charcoal-950 opacity-60';
            textColor = 'text-ash-500';
          }

          return (
            <div
              key={day.dayOfWeek}
              className={`p-2 sm:p-2.5 rounded-sm border text-center transition-all ${borderStyle}`}
            >
              <span className="font-orbitron font-bold text-[11px] block text-bone mb-1">
                {day.dayOfWeek}
              </span>

              <div className="h-6 flex items-center justify-center">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isRest ? (
                  <Moon className="w-3.5 h-3.5 text-steel-500" />
                ) : isToday ? (
                  <span className="w-2 h-2 rounded-full bg-crimson-500 animate-pulse" />
                ) : isMissed ? (
                  <span className="text-[10px] font-mono text-ash-600">—</span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-steel-600" />
                )}
              </div>

              <span className={`text-[9px] font-mono block truncate ${textColor}`}>
                {isDone
                  ? `${day.workouts?.[0]?.duration || 25}m`
                  : isRest
                  ? 'REST'
                  : isMissed
                  ? 'PASSED'
                  : `${day.plannedDuration || 25}m`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-steel-800">
        <div className="flex items-center gap-2 text-xs font-mono text-ash-400">
          <span>LIFE LOAD:</span>
          <span className="text-bone font-bold">{lifeLoad}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onOpenPlanBuilder && (
            <button
              type="button"
              onClick={onOpenPlanBuilder}
              className="w-1/2 sm:w-auto px-3 py-2 rounded-sm bg-charcoal-800 border border-steel-700 text-xs font-mono text-ash-300 hover:text-bone hover:border-steel-600 transition-colors uppercase"
            >
              CALIBRATE PLAN
            </button>
          )}

          {onOpenReflection && (
            <AnimeButton
              variant="outline"
              size="sm"
              icon={PenSquare}
              onClick={onOpenReflection}
              className="w-1/2 sm:w-auto border-steel-600"
            >
              WEEKLY REVIEW
            </AnimeButton>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default AdaptiveWeekCard;
