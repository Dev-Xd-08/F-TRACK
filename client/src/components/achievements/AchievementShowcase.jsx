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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-mythic/10 border border-gold-mythic/30 flex items-center justify-center text-gold-mythic shadow-[0_0_12px_rgba(255,184,0,0.25)]">
            <Trophy className="w-4 h-4 text-gold-mythic" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
              ACHIEVEMENT MATRIX
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-gold-mythic border border-slate-700">
                HUNTER BADGES
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Authentic milestone trophies unlocked exclusively from verified fitness telemetry
            </p>
          </div>
        </div>

        {/* Telemetry Summary Stats & Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="text-gold-mythic font-bold">{unlockedCount} / {totalAchievements}</span>
            <span className="text-slate-500">•</span>
            <span className="text-cyan-neon font-bold">+{totalEarnedXP} XP</span>
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-orbitron font-bold transition-all ${
                filter === 'all'
                  ? 'bg-gold-mythic/15 text-gold-mythic border border-gold-mythic/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ALL ({totalAchievements})
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-2.5 py-1 rounded text-[11px] font-orbitron font-bold transition-all ${
                filter === 'unlocked'
                  ? 'bg-matrix-neon/15 text-matrix-neon border border-matrix-neon/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              UNLOCKED ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-2.5 py-1 rounded text-[11px] font-orbitron font-bold transition-all ${
                filter === 'locked'
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LOCKED ({totalAchievements - unlockedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Achievement Cards */}
      {filteredAchievements.length === 0 ? (
        <GlassCard className="p-8 text-center text-xs font-mono text-slate-500">
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-obsidian border border-slate-800 hover:border-slate-700 text-xs font-orbitron font-bold text-slate-300 hover:text-gold-mythic transition-all shadow-md"
          >
            <span>{showAll ? 'COLLAPSE SHOWCASE' : `EXPAND ALL ${filteredAchievements.length} ACHIEVEMENTS`}</span>
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default AchievementShowcase;
