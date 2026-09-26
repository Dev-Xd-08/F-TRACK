import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  CheckCheck,
  X,
  Dumbbell,
  Flame,
  Zap,
  CheckCircle2,
  Trophy,
  Crown,
  Clock,
  Sparkles,
  Shield,
  Radio,
  ArrowUpCircle,
  ExternalLink,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * Helper to format relative or short date
 * @param {Date|string} dateStr 
 */
const formatNotificationTime = (dateStr) => {
  if (!dateStr) return 'Just now';
  const now = new Date();
  const date = new Date(dateStr);
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Get category icon and styling by notification type
 */
const getTypeConfig = (type) => {
  switch (type) {
    case 'WORKOUT_REMINDER':
      return {
        icon: Dumbbell,
        label: 'WORKOUT QUEST',
        color: 'text-cyan-neon',
        bg: 'bg-cyan-neon/15',
        border: 'border-cyan-neon/40',
        badge: 'bg-cyan-neon/10 text-cyan-neon border-cyan-neon/30',
      };
    case 'STREAK_REMINDER':
      return {
        icon: Flame,
        label: 'STREAK ALERT',
        color: 'text-crimson-aura',
        bg: 'bg-crimson-aura/15',
        border: 'border-crimson-aura/40',
        badge: 'bg-crimson-aura/10 text-crimson-aura border-crimson-aura/30',
      };
    case 'QUEST_REMINDER':
      return {
        icon: Zap,
        label: 'QUEST MISSION',
        color: 'text-violet-glow',
        bg: 'bg-violet-neon/15',
        border: 'border-violet-neon/40',
        badge: 'bg-violet-neon/10 text-violet-glow border-violet-neon/30',
      };
    case 'QUEST_COMPLETED':
      return {
        icon: CheckCircle2,
        label: 'QUEST COMPLETE',
        color: 'text-gold-mythic',
        bg: 'bg-gold-mythic/15',
        border: 'border-gold-mythic/40',
        badge: 'bg-gold-mythic/10 text-gold-mythic border-gold-mythic/30',
      };
    case 'ACHIEVEMENT_UNLOCKED':
      return {
        icon: Trophy,
        label: 'ACHIEVEMENT',
        color: 'text-gold-mythic',
        bg: 'bg-gold-mythic/15',
        border: 'border-gold-mythic/40',
        badge: 'bg-gold-mythic/10 text-gold-mythic border-gold-mythic/30',
      };
    case 'RANK_PROGRESS':
      return {
        icon: Crown,
        label: 'RANK ASCENSION',
        color: 'text-violet-glow',
        bg: 'bg-violet-neon/15',
        border: 'border-violet-neon/40',
        badge: 'bg-violet-neon/10 text-violet-glow border-violet-neon/30',
      };
    default:
      return {
        icon: Bell,
        label: 'SYSTEM',
        color: 'text-slate-300',
        bg: 'bg-slate-800',
        border: 'border-slate-700',
        badge: 'bg-slate-800 text-slate-300 border-slate-700',
      };
  }
};

/**
 * Priority badge styling
 */
const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'HIGH':
      return (
        <span className="text-[9px] font-orbitron font-black px-1.5 py-0.5 rounded bg-crimson-aura/15 border border-crimson-aura/40 text-crimson-aura animate-pulse">
          HIGH PRIORITY
        </span>
      );
    case 'LOW':
      return (
        <span className="text-[9px] font-orbitron font-semibold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
          INFO
        </span>
      );
    case 'MEDIUM':
    default:
      return (
        <span className="text-[9px] font-orbitron font-semibold px-1.5 py-0.5 rounded bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon">
          ACTIVE
        </span>
      );
  }
};

/**
 * NotificationCenter Component (Stage 11)
 * Persistent Hunter Telemetry & Alerts Drawer
 */
export const NotificationCenter = ({
  isOpen,
  onClose,
  notifications = [],
  unreadCount = 0,
  onMarkRead,
  onMarkAllRead,
}) => {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'REMINDERS' | 'REWARDS'

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'REMINDERS') return n.type.includes('REMINDER');
    if (filter === 'REWARDS') return n.type === 'QUEST_COMPLETED' || n.type === 'ACHIEVEMENT_UNLOCKED' || n.type === 'RANK_PROGRESS';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-void/80 backdrop-blur-sm"
      />

      {/* Flyout Drawer */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative z-50 w-full max-w-md bg-void/95 border-l border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.9)] h-full flex flex-col justify-between overflow-hidden"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-obsidian/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-dark to-violet-dark border border-cyan-neon/40 flex items-center justify-center text-cyan-neon shadow-glow-cyan">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  NOTIFICATION CORE
                </h3>
                <span className="text-[10px] font-mono text-cyan-neon tracking-widest uppercase">
                  HUNTER TELEMETRY & ALERTS
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
              aria-label="Close notification center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-orbitron font-bold border ${
                unreadCount > 0
                  ? 'bg-cyan-neon/15 border-cyan-neon/40 text-cyan-neon animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}>
                {unreadCount} UNREAD
              </span>
              <span className="text-slate-500">
                {notifications.length} total alerts
              </span>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[11px] text-violet-glow hover:text-cyan-neon transition-colors flex items-center gap-1 font-orbitron font-bold"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>MARK ALL READ</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 pt-1 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'ALL' },
              { id: 'UNREAD', label: `UNREAD (${unreadCount})` },
              { id: 'REMINDERS', label: 'REMINDERS' },
              { id: 'REWARDS', label: 'REWARDS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? 'bg-cyan-neon/20 text-cyan-neon border border-cyan-neon/40 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 py-16">
              <div className="w-14 h-14 rounded-2xl bg-obsidian border border-slate-800 flex items-center justify-center text-slate-500">
                <BellOff className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h4 className="font-orbitron font-bold text-sm text-slate-200 uppercase tracking-wider">
                  NOTIFICATION CORE
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  No notifications yet.
                </p>
                <p className="text-[11px] text-slate-500 font-sans">
                  Complete activities to begin receiving system alerts.
                </p>
              </div>
            </div>
          ) : (
            /* Notification Cards */
            filteredNotifications.map((notif, idx) => {
              const cfg = getTypeConfig(notif.type);
              const Icon = cfg.icon;
              const isUnread = !notif.isRead;

              return (
                <motion.div
                  key={notif._id || notif.dedupKey || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  onClick={() => {
                    if (isUnread && onMarkRead) {
                      onMarkRead(notif._id);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isUnread
                      ? 'bg-obsidian/95 border-violet-neon/40 shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:border-cyan-neon/60'
                      : 'bg-void/70 border-slate-800/80 opacity-75 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  {/* Unread Glowing Pip */}
                  {isUnread && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-cyan-neon shadow-[0_0_8px_rgba(0,245,255,0.8)] animate-pulse" />
                  )}

                  <div className="flex items-start gap-3">
                    {/* Icon Avatar */}
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} ${cfg.border} border flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1 pr-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[9px] font-orbitron font-bold px-1.5 py-0.5 rounded border ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                        {getPriorityBadge(notif.priority)}
                      </div>

                      <h4 className={`font-orbitron font-bold text-xs uppercase tracking-wide ${isUnread ? 'text-slate-100' : 'text-slate-300'}`}>
                        {notif.title}
                      </h4>

                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-600" />
                          {formatNotificationTime(notif.createdAt)}
                        </span>

                        {isUnread && (
                          <span className="text-cyan-neon font-orbitron font-semibold text-[9px] group-hover:underline">
                            Click to mark read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-obsidian/80 text-center text-[10px] font-mono text-slate-500">
          <span>F-TRACK • SMART NOTIFICATION ENGINE (STAGE 11)</span>
        </div>
      </motion.aside>
    </div>
  );
};

export default NotificationCenter;
