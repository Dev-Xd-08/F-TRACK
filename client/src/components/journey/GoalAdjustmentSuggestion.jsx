import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Check, ArrowRight, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';
import GlassCard from '../ui/GlassCard';
import { updateGoal } from '../../services/goalService';

/**
 * GoalAdjustmentSuggestion Component (Stage 19)
 * Detects chronic gaps between active goal frequency and real history.
 * Suggests sustainable target calibration without shaming or penalizing.
 */
export const GoalAdjustmentSuggestion = ({ goalAdjustment, onAdjustSuccess, onDismiss }) => {
  const [loading, setLoading] = useState(false);
  const [adjusted, setAdjusted] = useState(false);
  const [error, setError] = useState(null);

  if (!goalAdjustment || adjusted) {
    return null;
  }

  const {
    goalId,
    goalTitle = 'Weekly Training Volume',
    targetValue = 4,
    currentWeeklyAverage = 1.7,
    suggestedTarget = 2,
    heading = 'MISSION REVIEW & REALIGNMENT',
    message,
    recommendedAction = `ADJUST TARGET TO ${suggestedTarget} WORKOUTS/WEEK`,
  } = goalAdjustment;

  const handleApplyAdjustment = async () => {
    try {
      setLoading(true);
      setError(null);
      await updateGoal(goalId, { targetValue: suggestedTarget });
      setAdjusted(true);
      if (onAdjustSuccess) {
        onAdjustSuccess(suggestedTarget);
      }
    } catch (err) {
      setError(err.message || 'Failed to adjust mission target.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <GlassCard
        glow="none"
        className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card relative overflow-hidden"
      >
        {/* Subtle accent border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-600 via-amber-500/50 to-transparent" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-amber-500 flex-shrink-0 mt-0.5">
              <Scale className="w-5 h-5" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-semibold">
                  ADAPTIVE TARGET SUGGESTION
                </span>
                <span className="text-steel-600">•</span>
                <span className="text-[10px] font-mono text-ash-400">
                  {goalTitle}
                </span>
              </div>

              <h4 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-wide">
                {heading}
              </h4>

              <p className="text-xs sm:text-sm font-sans text-ash-300 max-w-2xl leading-relaxed">
                {message ||
                  `Your current routine is averaging ${currentWeeklyAverage} workouts per week (Target: ${targetValue}). Rather than forcing an unrealistic schedule, F-TRACK suggests calibrating to a sustainable baseline first.`}
              </p>

              {error && (
                <div className="text-xs font-mono text-crimson-400 pt-1">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0 pt-2 md:pt-0">
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-xs font-mono text-ash-500 hover:text-ash-300 px-3 py-2 transition-colors uppercase"
              >
                KEEP CURRENT
              </button>
            )}

            <AnimeButton
              variant="outline"
              size="md"
              icon={loading ? RefreshCw : ArrowRight}
              disabled={loading}
              className="w-full md:w-auto border-amber-600/60 text-bone hover:border-amber-500 hover:bg-amber-600/10"
              onClick={handleApplyAdjustment}
            >
              {loading ? 'CALIBRATING...' : recommendedAction}
            </AnimeButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default GoalAdjustmentSuggestion;
