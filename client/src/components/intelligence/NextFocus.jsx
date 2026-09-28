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
    <GlassCard glow="none" className="p-5 space-y-4 border-steel-700/60 bg-charcoal-900/90 shadow-steel-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-steel-800/80 border border-steel-700 flex items-center justify-center text-bone-200">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-bone-100 uppercase tracking-wide">
              STRATEGIC NEXT FOCUS
            </h4>
            <span className="text-[10px] font-mono text-ash-400">
              EVIDENCE-BASED TRAINING PRIORITIES (MAX 3)
            </span>
          </div>
        </div>

        <span className="text-xs font-mono text-ash-400">
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
            className="p-4 rounded bg-void/70 border border-steel-800 hover:border-steel-600 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group shadow-steel-card"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-orbitron font-extrabold px-1.5 py-0.5 rounded bg-steel-800 border border-steel-700 text-bone-200">
                  PRIORITY 0{idx + 1}
                </span>
                {item.priority === 'HIGH' && (
                  <span className="w-2 h-2 rounded-full bg-crimson-600" />
                )}
              </div>

              <h5 className="font-orbitron font-bold text-xs sm:text-sm text-bone-100 uppercase tracking-wide group-hover:text-crimson-400 transition-colors">
                {item.title}
              </h5>

              <div className="space-y-1">
                <span className="text-[9px] font-orbitron font-bold text-ash-500 uppercase tracking-wider block">
                  WHY THIS APPEARS:
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {item.reason}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-steel-800 flex items-center justify-between text-[10px] font-mono text-ash-500">
              <span className="flex items-center gap-1 text-ash-400">
                <CheckCircle2 className="w-3 h-3 text-steel-400" />
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
