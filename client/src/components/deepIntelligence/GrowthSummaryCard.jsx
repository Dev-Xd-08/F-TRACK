import React from 'react';
import { Compass, Footprints, Shield, Activity, Target, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * GrowthSummaryCard Component (Stage 21)
 * Long-term narrative grounding:
 * WHERE I STARTED • WHERE I AM • WHAT HAS CHANGED • WHAT I KEEP RETURNING TO • WHAT I AM BUILDING • WHAT COMES NEXT
 */
export const GrowthSummaryCard = ({ growthSummary }) => {
  if (!growthSummary || !growthSummary.hasData) {
    return (
      <GlassCard glow="none" className="p-5 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-ash-400 uppercase tracking-wider">
          <Compass className="w-4 h-4 text-steel-400" />
          <span>JOURNEY SUMMARY</span>
        </div>
        <h4 className="font-orbitron font-bold text-sm sm:text-base text-bone uppercase">
          JOURNEY SUMMARY COMPILING
        </h4>
        <p className="text-xs font-sans text-ash-400 leading-relaxed max-w-lg">
          Log workouts to generate your personal journey narrative.
        </p>
      </GlassCard>
    );
  }

  const {
    whereIStarted,
    whereIAm,
    whatHasChanged,
    whatIKeepReturningTo,
    whatIAmBuilding,
    whatComesNext,
  } = growthSummary;

  const sections = [
    {
      title: 'WHERE I STARTED',
      icon: Footprints,
      content: whereIStarted?.description,
      detail: `${whereIStarted?.date} • ${whereIStarted?.duration}m ${whereIStarted?.activity}`,
    },
    {
      title: 'WHERE I AM',
      icon: Shield,
      content: whereIAm?.description,
      detail: `${whereIAm?.totalWorkouts} sessions • ${whereIAm?.totalActiveMinutes} min • Level ${whereIAm?.level}`,
    },
    {
      title: 'WHAT HAS CHANGED',
      icon: Activity,
      content: whatHasChanged?.description,
    },
    {
      title: 'WHAT I KEEP RETURNING TO',
      icon: Compass,
      content: whatIKeepReturningTo?.description,
      detail: `Anchor discipline: ${whatIKeepReturningTo?.primaryActivity}`,
    },
    {
      title: 'WHAT I AM BUILDING',
      icon: Target,
      content: whatIAmBuilding?.description,
      detail: `${whatIAmBuilding?.activeGoalsCount} active mission targets`,
    },
    {
      title: 'WHAT COMES NEXT',
      icon: ArrowRight,
      content: whatComesNext?.description,
      detail: whatComesNext?.planName,
    },
  ];

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-bone">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold block">
              LONG-TERM TRAJECTORY
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              YOUR PERSONAL GROWTH NARRATIVE
            </h3>
          </div>
        </div>

        <span className="text-[10px] font-mono text-ash-500 uppercase tracking-widest">
          DOCUMENTED JOURNEY
        </span>
      </div>

      {/* 6 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sections.map((sec) => {
          const Icon = sec.icon;

          return (
            <div
              key={sec.title}
              className="p-4 rounded-sm bg-charcoal-950 border border-steel-800 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-crimson-400" />
                  {sec.title}
                </span>
                <p className="text-xs font-sans text-ash-300 leading-relaxed">
                  {sec.content}
                </p>
              </div>

              {sec.detail && (
                <span className="text-[10px] font-mono text-ash-500 block pt-1 border-t border-steel-800/80">
                  {sec.detail}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default GrowthSummaryCard;
