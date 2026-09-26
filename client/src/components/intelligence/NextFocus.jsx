import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * NextFocus Component (Stage 12)
 * Renders up to 3 evidence-based focus areas derived purely from real user telemetry
 */
export const NextFocus = ({ suggestions = [] }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <GlassCard glow="cyan" className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-neon/10 border border-cyan-neon/30 flex items-center justify-center text-cyan-neon shadow-[0_0_10px_rgba(0,245,255,0.2)]">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wide">
              STRATEGIC NEXT FOCUS
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              EVIDENCE-BASED TRAINING PRIORITIES (MAX 3)
            </span>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-neon">
          {suggestions.length} ACTIONABLE {suggestions.length === 1 ? 'AREA' : 'AREAS'}
        </span>
      </div>

      {/* Focus Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {suggestions.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="p-4 rounded-xl bg-void/60 border border-slate-800 hover:border-cyan-neon/40 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-orbitron font-extrabold px-1.5 py-0.5 rounded bg-cyan-neon/15 border border-cyan-neon/30 text-cyan-neon">
                  PRIORITY 0{idx + 1}
                </span>
                {item.priority === 'HIGH' && (
                  <span className="w-2 h-2 rounded-full bg-crimson-aura shadow-[0_0_6px_rgba(255,42,95,0.8)] animate-pulse" />
                )}
              </div>

              <h5 className="font-orbitron font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wide group-hover:text-cyan-neon transition-colors">
                {item.title}
              </h5>

              <div className="space-y-1">
                <span className="text-[9px] font-orbitron font-bold text-slate-500 uppercase tracking-wider block">
                  WHY THIS APPEARS:
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {item.reason}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1 text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-cyan-neon" />
                Empirical Telemetry
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

export default NextFocus;
