import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, TrendingUp, GitCompare, Activity, ShieldCheck, Compass } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * DeepIntelligenceDashboard Component (Stage 21)
 * High-level intelligence entry point for the main Dashboard.
 * Displays momentum dimensions and a highlighted insight, with a direct link to the full /intelligence view.
 */
export const DeepIntelligenceDashboard = ({ intelligenceData }) => {
  if (!intelligenceData) return null;

  const {
    patterns = [],
    changes = {},
    personalMomentum = {},
    loadObservation = {},
    dataQuality = {},
  } = intelligenceData;

  const topPattern = patterns.find((p) => p.status === 'IMPROVING' || p.status === 'ACTIVE') || patterns[0];
  const dimensions = personalMomentum.dimensions || [];

  return (
    <section className="space-y-4">
      {/* Section Header with Link to Dedicated Intelligence Page */}
      <div className="flex items-center justify-between border-b border-steel-800 pb-2">
        <h3 className="font-orbitron font-bold text-xs sm:text-sm text-bone flex items-center gap-2 tracking-wider">
          <Brain className="w-4 h-4 text-crimson-500" />
          <span>DEEP PERSONAL INTELLIGENCE</span>
        </h3>
        <Link
          to="/intelligence"
          className="text-xs font-mono text-ash-400 hover:text-bone flex items-center gap-1 transition-colors"
        >
          <span>FULL INTELLIGENCE ARCHIVE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-4">
        {/* Momentum Dimension Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {dimensions.map((dim) => (
            <div
              key={dim.dimension}
              className="p-3 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-ash-400 uppercase tracking-wider block">
                  {dim.dimension}
                </span>
                <span className="text-[9px] font-mono text-emerald-400 uppercase">
                  {dim.state.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-[11px] font-sans text-ash-300 line-clamp-1">
                {dim.description}
              </p>
            </div>
          ))}
        </div>

        {/* Highlighted Insight Block */}
        <div className="p-4 rounded-sm bg-charcoal-950 border border-steel-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-crimson-500" />
              <span>KEY TELEMETRY PATTERN</span>
            </span>
            <span className="text-[10px] font-mono text-ash-500 uppercase">
              {topPattern?.title || 'CONSISTENCY TREND'}
            </span>
          </div>

          <p className="text-xs font-sans text-bone leading-relaxed">
            {topPattern?.observation || 'Recording sessions establishes behavioral rhythm and objective telemetry.'}
          </p>

          {changes?.summaryExplanation && (
            <p className="text-xs font-sans text-ash-400 pt-1 border-t border-steel-800/80">
              {changes.summaryExplanation}
            </p>
          )}
        </div>

        {/* Footer Link to Dedicated Route */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-steel-800 text-xs font-mono">
          <span className="text-ash-500">
            {dataQuality?.workoutCount || 0} SESSIONS ANALYZED ACROSS {dataQuality?.historyDays || 1} DAYS
          </span>
          <Link
            to="/intelligence"
            className="text-bone hover:text-crimson-400 flex items-center gap-1 transition-colors self-start sm:self-auto font-orbitron text-[11px]"
          >
            <span>EXPLORE WHAT CHANGED & ALL PATTERNS</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </GlassCard>
    </section>
  );
};

export default DeepIntelligenceDashboard;
