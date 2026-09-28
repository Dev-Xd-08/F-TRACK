import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Filter
} from 'lucide-react';
import AchievementCard from './AchievementCard';
import GlassCard from '../ui/GlassCard';

/**
 * AchievementShowcase Component (Stage 9)
 * Displays Hunter Achievements & Badges with unlock telemetry and category filtering
 */
export const AchievementShowcase = ({ achievementsData }) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'unlocked' | 'locked'
  const [showAll, setShowAll] = useState(false);

  const achievements = achievementsData?.achievements || [];
  const totalAchievements = achievementsData?.totalAchievements || achievements.length || 14;
  const unlockedCount = achievementsData?.unlockedCount || achievements.filter((a) => a.unlocked).length;
  const totalEarnedXP = achievementsData?.totalEarnedXP || achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + (Number(a.xp) || 0), 0);
  const completionPercentage = achievementsData?.completionPercentage || Math.round((unlockedCount / (totalAchievements || 1)) * 100);

  const filteredAchievements = achievements.filter((ach) => {
    if (filter === 'unlocked') return ach.unlocked;
    if (filter === 'locked') return !ach.unlocked;
    return true;
  });

  // Display initial 6 or all when expanded
  const displayedAchievements = showAll ? filteredAchievements : filteredAchievements.slice(0, 6);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-obsidian border border-steel flex items-center justify-center text-offwhite">
            <Trophy className="w-4 h-4 text-steel-light" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-xs sm:text-sm text-offwhite flex items-center gap-2 tracking-wider">
              ACHIEVEMENT MATRIX
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-charcoal text-ash border border-steel/60">
                FORGED BADGES
              </span>
            </h3>
            <p className="text-[11px] text-ash font-sans">
              Milestone insignias forged exclusively from verified training telemetry
            </p>
          </div>
        </div>

        {/* Telemetry Summary Stats & Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-2.5 py-1 rounded-sm bg-obsidian border border-steel text-xs font-mono text-ash flex items-center gap-2">
            <span className="text-offwhite font-bold">{unlockedCount} / {totalAchievements}</span>
            <span className="text-steel">•</span>
            <span className="text-bone font-bold">+{totalEarnedXP} XP</span>
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-sm bg-obsidian border border-steel">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-sm text-[11px] font-mono font-bold transition-all ${
                filter === 'all'
                  ? 'bg-charcoal text-offwhite border border-steel'
                  : 'text-ash hover:text-offwhite'
              }`}
            >
              ALL ({totalAchievements})
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-2.5 py-1 rounded-sm text-[11px] font-mono font-bold transition-all ${
                filter === 'unlocked'
                  ? 'bg-charcoal text-offwhite border border-steel'
                  : 'text-ash hover:text-offwhite'
              }`}
            >
              FORGED ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-2.5 py-1 rounded-sm text-[11px] font-mono font-bold transition-all ${
                filter === 'locked'
                  ? 'bg-charcoal text-offwhite border border-steel'
                  : 'text-ash hover:text-offwhite'
              }`}
            >
              LOCKED ({totalAchievements - unlockedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Achievement Cards */}
      {filteredAchievements.length === 0 ? (
        <GlassCard glow="none" className="p-8 text-center text-xs font-mono text-ash">
          No achievements match the selected filter.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedAchievements.map((ach) => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      )}

      {/* View All / Collapse Button */}
      {filteredAchievements.length > 6 && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-charcoal border border-steel hover:border-steel-light text-xs font-mono font-bold text-ash hover:text-offwhite transition-all shadow-steel-card"
          >
            <span>{showAll ? 'COLLAPSE SHOWCASE' : `EXPAND ALL ${filteredAchievements.length} BADGES`}</span>
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default AchievementShowcase;
