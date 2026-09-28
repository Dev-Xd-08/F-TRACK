import React from 'react';
import { Target, TrendingUp, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * GoalMomentumCard Component (Stage 21)
 * Evaluates movement toward active fitness goals with real data.
 */
export const GoalMomentumCard = ({ goalMomentum }) => {
  if (!goalMomentum || goalMomentum.status === 'NO_GOALS') {
    return (
      <GlassCard glow="none" className="p-5 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-ash-400 uppercase tracking-wider">
          <Target className="w-4 h-4 text-steel-400" />
          <span>GOAL MOMENTUM</span>
        </div>
        <h4 className="font-orbitron font-bold text-sm sm:text-base text-bone uppercase">
          NO ACTIVE MISSIONS
        </h4>
        <p className="text-xs font-sans text-ash-400 leading-relaxed max-w-lg">
          {goalMomentum?.observation || 'Active goals anchor long-term momentum tracking. Create a goal in Mission Planning.'}
        </p>
      </GlassCard>
    );
  }

  const {
    activeGoalsCount = 0,
    goals = [],
    observation,
  } = goalMomentum;

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-bone">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold block">
              MISSION TELEMETRY
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              GOAL MOMENTUM
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-ash-400">
          {activeGoalsCount} ACTIVE MISSION{activeGoalsCount === 1 ? '' : 'S'}
        </span>
      </div>

      <p className="text-xs font-sans text-ash-300 leading-relaxed">
        {observation}
      </p>

      {/* Goal Items */}
      <div className="space-y-3 pt-1">
        {goals.map((g) => (
          <div key={g.id} className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-orbitron font-bold text-bone truncate">{g.title}</span>
              <span className="font-mono text-ash-400">{g.percentage}% ({g.currentValue} / {g.targetValue} {g.unit || ''})</span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-charcoal-900 overflow-hidden border border-steel-800/80">
              <div
                className="h-full bg-crimson-600 rounded-full"
                style={{ width: `${g.percentage}%` }}
              />
            </div>

            <p className="text-[11px] font-sans text-ash-400">
              {g.observation}
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default GoalMomentumCard;
