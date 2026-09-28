import React from 'react';
import { Activity, TrendingUp, Calendar, Target, CheckCircle2, Shield } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const getDimensionIcon = (dim) => {
  switch (dim) {
    case 'CONSISTENCY':
      return TrendingUp;
    case 'PLAN FIT':
      return Calendar;
    case 'ACTIVITY CONTINUITY':
      return Activity;
    case 'GOAL MOVEMENT':
      return Target;
    default:
      return Shield;
  }
};

const getStateBadgeColor = (state) => {
  switch (state) {
    case 'IMPROVING':
    case 'TARGET_REACHED':
    case 'ACTIVE_CONTINUITY':
    case 'ACTIVE_GOALS':
      return 'text-emerald-400 border-emerald-600/50 bg-emerald-950/20';
    case 'STABLE':
    case 'BALANCED_FIT':
    case 'STEADY':
      return 'text-bone border-steel-700 bg-charcoal-800';
    case 'REBUILDING_RHYTHM':
    case 'ADAPTED':
    case 'RECENTLY_ESTABLISHED':
      return 'text-amber-400 border-amber-600/50 bg-amber-950/20';
    default:
      return 'text-ash-400 border-steel-800 bg-charcoal-950';
  }
};

/**
 * PersonalMomentum Component (Stage 21)
 * Multi-dimensional, transparent momentum telemetry.
 * Displays individual observable dimensions without hiding behind an arbitrary single score.
 */
export const PersonalMomentum = ({ momentum }) => {
  if (!momentum || !momentum.dimensions) return null;

  const { dimensions = [] } = momentum;

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-bone">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold block">
              TRAJECTORY MODEL
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              PERSONAL MOMENTUM
            </h3>
          </div>
        </div>

        <span className="text-[10px] font-mono text-ash-500 uppercase tracking-widest">
          TRANSPARENT 4-AXIS EVALUATION
        </span>
      </div>

      {/* 4 Dimension Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {dimensions.map((dim) => {
          const Icon = getDimensionIcon(dim.dimension);

          return (
            <div
              key={dim.dimension}
              className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-steel-400" />
                  {dim.dimension}
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm border uppercase ${getStateBadgeColor(dim.state)}`}>
                  {dim.state.replace(/_/g, ' ')}
                </span>
              </div>

              <p className="text-xs font-sans text-ash-300 line-clamp-2 leading-relaxed">
                {dim.description}
              </p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default PersonalMomentum;
