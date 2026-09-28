import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Clock, ArrowRight, HelpCircle, Shield, CheckCircle2, SlidersHorizontal, Moon } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';
import GlassCard from '../ui/GlassCard';

/**
 * AdaptiveRecommendation Component (Stage 20)
 * Recommends today's realistic training action with 100% transparent "Why this?" reasons.
 * Grants complete user control: [START] [CHANGE TIME] [REST TODAY].
 */
export const AdaptiveRecommendation = ({
  recommendation,
  onStartWorkout,
  onOpenAvailability,
  onRecordRest,
}) => {
  const [showBlueprint, setShowBlueprint] = useState(false);

  if (!recommendation) return null;

  const {
    title = 'TODAY’S ADAPTIVE DIRECTION',
    actionTitle = 'START SESSION',
    suggestedDuration = 25,
    activityType = 'General Training',
    trainedToday = false,
    warmup,
    mainWork,
    cooldown,
    reasons = [],
    alternatives = [],
  } = recommendation;

  const handleStart = (act = activityType, dur = suggestedDuration) => {
    if (onStartWorkout) {
      onStartWorkout({
        duration: dur,
        activityType: act,
        notes: `Adaptive Plan: ${dur} min ${act}`,
      });
    }
  };

  return (
    <GlassCard
      glow="none"
      className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card relative overflow-hidden"
    >
      {/* Accent border line */}
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
              ADAPTIVE LIFE RECOMMENDATION
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-ash-400">TARGET:</span>
            <span className="text-bone font-bold">{suggestedDuration} MINUTES</span>
          </div>
        </div>

        {/* Main Recommendation Content */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-orbitron font-bold text-lg sm:text-xl text-bone uppercase tracking-tight">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-xs font-mono text-crimson-400">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {suggestedDuration} MIN {activityType.toUpperCase()}
              </span>
            </div>
          </div>

          {/* User Controls: [START] [CHANGE TIME] [REST TODAY] */}
          <div className="flex flex-wrap items-center gap-2 pt-1 md:pt-0">
            {onOpenAvailability && (
              <button
                type="button"
                onClick={onOpenAvailability}
                className="px-3 py-2 rounded-sm bg-charcoal-800 border border-steel-700 text-xs font-mono text-ash-300 hover:text-bone hover:border-steel-600 transition-colors uppercase flex items-center gap-1.5"
                title="Change available time"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>CHANGE TIME</span>
              </button>
            )}

            {!trainedToday && onRecordRest && (
              <button
                type="button"
                onClick={onRecordRest}
                className="px-3 py-2 rounded-sm bg-charcoal-800 border border-steel-700 text-xs font-mono text-ash-300 hover:text-bone hover:border-steel-600 transition-colors uppercase flex items-center gap-1.5"
                title="Acknowledge rest day"
              >
                <Moon className="w-3.5 h-3.5 text-steel-400" />
                <span>REST TODAY</span>
              </button>
            )}

            <AnimeButton
              variant={trainedToday ? 'outline' : 'crimson'}
              size="sm"
              icon={ArrowRight}
              onClick={() => handleStart()}
            >
              {actionTitle}
            </AnimeButton>
          </div>
        </div>

        {/* 3-Phase Blueprint Snippet */}
        {(warmup || mainWork || cooldown) && (
          <div className="p-3 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1.5 text-xs font-sans">
            <div className="flex items-center justify-between text-[10px] font-mono text-ash-400 uppercase tracking-wider">
              <span>SESSION PACING BLUEPRINT</span>
              <button
                type="button"
                onClick={() => setShowBlueprint(!showBlueprint)}
                className="text-ash-400 hover:text-bone underline"
              >
                {showBlueprint ? 'HIDE' : 'VIEW PHASES'}
              </button>
            </div>

            {showBlueprint && (
              <div className="space-y-1 pt-1 text-ash-300">
                {warmup && <div>• <span className="font-mono text-bone font-semibold">WARM-UP:</span> {warmup}</div>}
                {mainWork && <div>• <span className="font-mono text-bone font-semibold">MAIN WORK:</span> {mainWork}</div>}
                {cooldown && <div>• <span className="font-mono text-bone font-semibold">COOL-DOWN:</span> {cooldown}</div>}
              </div>
            )}
          </div>
        )}

        {/* Transparent "Why This?" Rationale */}
        {reasons && reasons.length > 0 && (
          <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-ash-400">
              <HelpCircle className="w-3 h-3 text-steel-500" />
              <span>WHY THIS RECOMMENDATION?</span>
            </div>
            <ul className="space-y-1.5 text-xs font-sans text-ash-300 pl-1">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-steel-500 mt-2 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default AdaptiveRecommendation;
