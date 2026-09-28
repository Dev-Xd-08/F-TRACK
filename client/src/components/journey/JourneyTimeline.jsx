import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Footprints, 
  Flame, 
  Award, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * Map milestone icon names to Lucide icons
 */
const getMilestoneIcon = (iconName) => {
  switch (iconName) {
    case 'Footprints':
      return Footprints;
    case 'Flame':
      return Flame;
    case 'Compass':
      return Compass;
    case 'Award':
      return Award;
    default:
      return Sparkles;
  }
};

/**
 * JourneyTimeline Component (Stage 19)
 * Reflective, chronological record of meaningful moments in the user's fitness path.
 * 100% real user milestones, no artificial achievements.
 */
export const JourneyTimeline = ({ milestones = [] }) => {
  const [expanded, setExpanded] = useState(false);

  if (!milestones || milestones.length === 0) {
    return (
      <GlassCard glow="none" className="p-6 border-steel-700 bg-charcoal-900 shadow-steel-card text-center space-y-3">
        <div className="w-12 h-12 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-ash-400 mx-auto">
          <Footprints className="w-6 h-6" />
        </div>
        <h4 className="font-orbitron font-bold text-sm text-bone uppercase tracking-wider">
          THE PATH IS UNWRITTEN
        </h4>
        <p className="text-xs font-sans text-ash-400 max-w-md mx-auto">
          Every journey begins with a single deliberate act. Log your first training session to engrave your inaugural milestone.
        </p>
      </GlassCard>
    );
  }

  const displayedMilestones = expanded ? milestones : milestones.slice(0, 4);

  return (
    <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-steel-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-crimson-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-crimson-500 uppercase font-semibold block">
              CHRONICLE OF RESOLVE
            </span>
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-bone uppercase tracking-tight">
              JOURNEY TIMELINE
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-ash-400 bg-charcoal-950 px-2.5 py-1 rounded-sm border border-steel-800">
          {milestones.length} {milestones.length === 1 ? 'MILESTONE' : 'MILESTONES'}
        </span>
      </div>

      {/* Timeline Rail */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-steel-800">
        {displayedMilestones.map((item, index) => {
          const Icon = getMilestoneIcon(item.icon);
          const isLatest = index === 0;

          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="relative group"
            >
              {/* Node indicator */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-sm border flex items-center justify-center transition-colors ${
                  isLatest
                    ? 'bg-crimson-950 border-crimson-600 text-crimson-400 shadow-sm'
                    : 'bg-charcoal-950 border-steel-700 text-ash-400 group-hover:border-steel-500'
                }`}
              >
                <Icon className="w-3 h-3" />
              </div>

              {/* Milestone Details */}
              <div className="p-3.5 sm:p-4 rounded-sm bg-charcoal-950 border border-steel-800 space-y-1.5 transition-colors group-hover:border-steel-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-orbitron font-bold text-bone tracking-wide uppercase">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-[10px] font-mono text-ash-400 uppercase">
                        — {item.subtitle}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-crimson-400 font-semibold self-start sm:self-auto">
                    {item.formattedDate}
                  </span>
                </div>

                <p className="text-xs font-sans text-ash-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expand / Collapse Toggle if more than 4 items */}
      {milestones.length > 4 && (
        <div className="pt-2 text-center border-t border-steel-800">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-ash-400 hover:text-bone uppercase transition-colors py-1"
          >
            {expanded ? (
              <>
                <span>SHOW LESS</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>VIEW ALL {milestones.length} MILESTONES</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </GlassCard>
  );
};

export default JourneyTimeline;
