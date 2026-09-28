import React from 'react';
import { PenSquare, Activity, MessageSquare, Tag } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import WhyThisInsight from './WhyThisInsight';

/**
 * ReflectionPatternCard Component (Stage 21)
 * Analyzes subjective perceived effort and recurring themes from user-submitted reflections.
 */
export const ReflectionPatternCard = ({ reflectionPatterns }) => {
  if (!reflectionPatterns || !reflectionPatterns.hasData) {
    return (
      <GlassCard glow="none" className="p-5 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-ash-400 uppercase tracking-wider">
          <PenSquare className="w-4 h-4 text-steel-400" />
          <span>REFLECTION PATTERNS</span>
        </div>
        <h4 className="font-orbitron font-bold text-sm sm:text-base text-bone uppercase">
          NO REFLECTION TELEMETRY
        </h4>
        <p className="text-xs font-sans text-ash-400 leading-relaxed max-w-lg">
          Rate effort or add notes after your workouts to unlock subjective fatigue and friction telemetry.
        </p>
      </GlassCard>
    );
  }

  const {
    workoutReflectionsCount = 0,
    weeklyReflectionsCount = 0,
    primaryPerceivedEffort,
    effortDistribution = {},
    recurringThemes = [],
    observation,
    evidence,
    meaning,
    nextStep,
  } = reflectionPatterns;

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-bone">
            <PenSquare className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold block">
              SUBJECTIVE TELEMETRY
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              PERCEIVED EFFORT & THEMES
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-ash-400">
          {workoutReflectionsCount} SESSION{workoutReflectionsCount === 1 ? '' : 'S'} • {weeklyReflectionsCount} WEEKLY REVIEW{weeklyReflectionsCount === 1 ? '' : 'S'}
        </span>
      </div>

      <p className="text-xs font-sans text-ash-300 leading-relaxed">
        {observation}
      </p>

      {/* Effort Distribution Grid */}
      {effortDistribution && (
        <div className="grid grid-cols-4 gap-2 pt-1">
          {Object.entries(effortDistribution).map(([level, count]) => (
            <div key={level} className="p-2.5 rounded-sm bg-charcoal-950 border border-steel-800 text-center">
              <span className="text-[10px] font-mono text-ash-400 block mb-0.5">{level}</span>
              <span className="font-orbitron font-bold text-base text-bone">{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recurring Challenge / Theme Tags */}
      {recurringThemes && recurringThemes.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase block">
            RECURRING THEMES IN REFLECTIONS:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {recurringThemes.map((t) => (
              <span
                key={t.topic}
                className="px-2.5 py-1 rounded-sm bg-charcoal-950 border border-steel-800 text-bone text-xs font-mono flex items-center gap-1.5"
              >
                <Tag className="w-3 h-3 text-crimson-400" />
                <span>{t.topic} ({t.occurrences}x)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Why This Insight Accordion */}
      <WhyThisInsight
        observation={observation}
        evidence={evidence}
        meaning={meaning}
        nextStep={nextStep}
      />
    </GlassCard>
  );
};

export default ReflectionPatternCard;
