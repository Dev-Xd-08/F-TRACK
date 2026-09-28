import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Heart, PieChart, Info, CheckCircle2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * LoadCheckCard Component (Stage 20)
 * Non-medical workload signal and activity mix distribution.
 * Purely observational planning feedback with zero clinical diagnostic claims.
 */
export const LoadCheckCard = ({ loadCheck, activityBalance }) => {
  if (!loadCheck && !activityBalance) return null;

  const isHighVolume = loadCheck?.status === 'HIGH_VOLUME';

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-sm border flex items-center justify-center ${
              isHighVolume
                ? 'bg-amber-950/40 border-amber-600/70 text-amber-400'
                : 'bg-steel-800 border-steel-700 text-bone'
            }`}
          >
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold block">
              WORKLOAD & BALANCE TELEMETRY
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              {loadCheck?.heading || 'VOLUME PACING'}
            </h3>
          </div>
        </div>

        <span className="text-[10px] font-mono text-ash-500 uppercase tracking-widest">
          PLANNING FEEDBACK ONLY
        </span>
      </div>

      {/* Load Check Callout */}
      {loadCheck && (
        <div className="p-3.5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-orbitron font-bold text-xs uppercase text-bone">
              {loadCheck.message}
            </span>
          </div>
          <p className="text-xs font-sans text-ash-300 leading-relaxed">
            {loadCheck.suggestion}
          </p>
        </div>
      )}

      {/* Activity Mix Breakdown */}
      {activityBalance && activityBalance.hasData && activityBalance.mix.length > 0 && (
        <div className="space-y-2 pt-1 border-t border-steel-800">
          <span className="text-[10px] font-mono text-ash-400 uppercase tracking-widest block">
            RECENT MOVEMENT DISTRIBUTION:
          </span>

          <div className="space-y-1.5">
            {activityBalance.mix.map((item) => (
              <div key={item.activity} className="space-y-0.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-bone">{item.activity}</span>
                  <span className="text-ash-400">{item.percentage}% ({item.count} sessions)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-charcoal-950 overflow-hidden">
                  <div
                    className="h-full bg-crimson-600 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {activityBalance.observation && (
            <p className="text-xs font-sans text-ash-400 italic pt-1">
              Note: {activityBalance.observation}
            </p>
          )}
        </div>
      )}
    </GlassCard>
  );
};

export default LoadCheckCard;
