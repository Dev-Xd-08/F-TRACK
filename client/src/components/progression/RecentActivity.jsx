import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Trophy, 
  ArrowUpCircle, 
  Crown, 
  Clock, 
  Calendar,
  Sparkles,
  Activity,
  Award,
  CheckCircle2
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * RecentActivity Component (Stage 7 & 8)
 * Displays authentic chronological progression and record events from actual history
 */
export const RecentActivity = ({ events = [] }) => {
  const getEventBadge = (evt) => {
    switch (evt.type) {
      case 'QUEST_COMPLETED':
        return {
          icon: CheckCircle2,
          color: 'text-gold-mythic',
          border: 'border-gold-mythic/40',
          bg: 'bg-gold-mythic/10',
          tag: 'QUEST COMPLETE',
        };
      case 'NEW_RECORD_LONGEST_WORKOUT':
        return {
          icon: Clock,
          color: 'text-cyan-neon',
          border: 'border-cyan-neon/40',
          bg: 'bg-cyan-neon/10',
          tag: 'RECORD',
        };
      case 'NEW_RECORD_HIGHEST_CALORIES':
        return {
          icon: Flame,
          color: 'text-crimson-aura',
          border: 'border-crimson-aura/40',
          bg: 'bg-crimson-aura/10',
          tag: 'RECORD',
        };
      case 'NEW_RECORD_MOST_ACTIVE_WEEK':
        return {
          icon: Trophy,
          color: 'text-gold-mythic',
          border: 'border-gold-mythic/40',
          bg: 'bg-gold-mythic/10',
          tag: 'RECORD',
        };
      case 'LEVEL_UP':
        return {
          icon: ArrowUpCircle,
          color: 'text-violet-glow',
          border: 'border-violet-neon/40',
          bg: 'bg-violet-neon/10',
          tag: 'LEVEL UP',
        };
      case 'RANK_UP':
        return {
          icon: Crown,
          color: 'text-gold-mythic',
          border: 'border-gold-mythic/40',
          bg: 'bg-gold-mythic/10',
          tag: 'RANK UP',
        };
      case 'STREAK_UPDATED':
        return {
          icon: Flame,
          color: 'text-amber-400',
          border: 'border-amber-400/40',
          bg: 'bg-amber-400/10',
          tag: 'STREAK',
        };
      default:
        return {
          icon: Zap,
          color: 'text-cyan-neon',
          border: 'border-slate-700',
          bg: 'bg-slate-800/80',
          tag: 'QUEST',
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="font-orbitron font-bold text-sm text-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-glow" />
          PROGRESS HISTORY & ACTIVITY TIMELINE
        </h3>
        <span className="text-xs font-mono text-slate-500">
          LATEST {Math.min(events.length, 10)} EVENTS
        </span>
      </div>

      {(!events || events.length === 0) ? (
        <GlassCard className="p-6 text-center text-xs font-mono text-slate-500">
          No progression activity recorded yet. Complete a workout quest to initiate your history log.
        </GlassCard>
      ) : (
        <div className="space-y-2.5">
          {events.slice(0, 8).map((evt, idx) => {
            const badge = getEventBadge(evt);
            const Icon = badge.icon;
            const dateStr = evt.timestamp
              ? new Date(evt.timestamp).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';

            return (
              <motion.div
                key={`${evt.type}-${idx}-${evt.timestamp}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="p-3.5 rounded-xl bg-obsidian/75 border border-slate-800/90 hover:border-slate-700 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg ${badge.bg} border ${badge.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${badge.color}`} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-orbitron font-extrabold px-1.5 py-0.5 rounded border uppercase ${badge.bg} ${badge.color} ${badge.border}`}>
                        {badge.tag}
                      </span>
                      <h4 className="font-orbitron font-bold text-xs text-slate-200 truncate">
                        {evt.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 font-sans truncate mt-0.5">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] font-mono text-slate-500 block">
                    {dateStr}
                  </span>
                  {evt.xpGained > 0 && (
                    <span className="text-[10px] font-mono font-bold text-cyan-neon">
                      +{evt.xpGained} XP
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
