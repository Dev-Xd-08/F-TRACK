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
        color: 'text-bone-100',
        bg: 'bg-steel-800/80',
        border: 'border-steel-700',
        badge: 'bg-steel-800 border-steel-700 text-bone-200',
      };
    case 'STREAK_REMINDER':
      return {
        icon: Flame,
        label: 'STREAK ALERT',
        color: 'text-amber-400',
        bg: 'bg-amber-950/40',
        border: 'border-amber-800/50',
        badge: 'bg-amber-950/40 border-amber-800/50 text-amber-400',
      };
    case 'QUEST_REMINDER':
      return {
        icon: Zap,
        label: 'QUEST MISSION',
        color: 'text-bone-200',
        bg: 'bg-steel-800/80',
        border: 'border-steel-700',
        badge: 'bg-steel-800 border-steel-700 text-bone-200',
      };
    case 'QUEST_COMPLETED':
      return {
        icon: CheckCircle2,
        label: 'QUEST COMPLETE',
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/40',
        border: 'border-emerald-800/50',
        badge: 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400',
      };
    case 'ACHIEVEMENT_UNLOCKED':
      return {
        icon: Trophy,
        label: 'ACHIEVEMENT',
        color: 'text-amber-300',
        bg: 'bg-amber-950/40',
        border: 'border-amber-800/50',
        badge: 'bg-amber-950/40 border-amber-800/50 text-amber-300',
      };
    case 'RANK_PROGRESS':
      return {
        icon: Crown,
        label: 'RANK ASCENSION',
        color: 'text-crimson-400',
        bg: 'bg-crimson-950/40',
        border: 'border-crimson-800/50',
        badge: 'bg-crimson-950/40 border-crimson-800/50 text-crimson-300',
      };
    default:
      return {
        icon: Bell,
        label: 'SYSTEM',
        color: 'text-ash-300',
        bg: 'bg-steel-800',
        border: 'border-steel-700',
        badge: 'bg-steel-800 text-ash-300 border-steel-700',
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
        <span className="text-[9px] font-orbitron font-bold px-1.5 py-0.5 rounded bg-crimson-950/60 border border-crimson-800/60 text-crimson-400">
          HIGH PRIORITY
        </span>
      );
    case 'LOW':
      return (
        <span className="text-[9px] font-orbitron font-semibold px-1.5 py-0.5 rounded bg-steel-800/60 border border-steel-700 text-ash-400">
          INFO
        </span>
      );
    case 'MEDIUM':
    default:
      return (
        <span className="text-[9px] font-orbitron font-semibold px-1.5 py-0.5 rounded bg-steel-800/60 border border-steel-700 text-bone-200">
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
        className="relative z-50 w-full max-w-md bg-charcoal-900 border-l border-steel-700 shadow-2xl h-full flex flex-col justify-between overflow-hidden"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-steel-800 bg-charcoal-900 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-steel-800 border border-steel-700 flex items-center justify-center text-bone-100">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-sm text-bone-100 uppercase tracking-wider flex items-center gap-2">
                  NOTIFICATION CORE
                </h3>
                <span className="text-[10px] font-mono text-ash-400 tracking-widest uppercase">
                  HUNTER TELEMETRY & ALERTS
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded border border-steel-700 bg-steel-800/80 text-ash-400 hover:text-bone-100 hover:border-steel-600 transition-colors"
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
                  ? 'bg-crimson-950/60 border-crimson-800/60 text-crimson-400'
                  : 'bg-steel-800 border-steel-700 text-ash-400'
              }`}>
                {unreadCount} UNREAD
              </span>
              <span className="text-ash-500">
                {notifications.length} total alerts
              </span>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[11px] text-ash-400 hover:text-crimson-400 transition-colors flex items-center gap-1 font-orbitron font-bold"
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
                    ? 'bg-crimson-900/60 text-bone-100 border border-crimson-800/80'
                    : 'text-ash-400 hover:text-bone-100 bg-charcoal-800 border border-steel-800'
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
              <div className="w-14 h-14 rounded bg-charcoal-800 border border-steel-800 flex items-center justify-center text-ash-500">
                <BellOff className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h4 className="font-orbitron font-bold text-sm text-bone-200 uppercase tracking-wider">
                  NOTIFICATION CORE
                </h4>
                <p className="text-xs text-ash-400 font-mono">
                  No notifications yet.
                </p>
                <p className="text-[11px] text-ash-500 font-sans">
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
                  className={`p-3.5 rounded border transition-all cursor-pointer relative overflow-hidden group shadow-steel-card ${
                    isUnread
                      ? 'bg-charcoal-800/95 border-steel-600 hover:border-steel-500'
                      : 'bg-void/70 border-steel-800/80 opacity-75 hover:opacity-100 hover:border-steel-700'
                  }`}
                >
                  {/* Unread Pip */}
                  {isUnread && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-crimson-600" />
                  )}

                  <div className="flex items-start gap-3">
                    {/* Icon Avatar */}
                    <div className={`w-8 h-8 rounded ${cfg.bg} ${cfg.border} border flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
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

                      <h4 className={`font-orbitron font-bold text-xs uppercase tracking-wide ${isUnread ? 'text-bone-100' : 'text-ash-300'}`}>
                        {notif.title}
                      </h4>

                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-ash-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-steel-500" />
                          {formatNotificationTime(notif.createdAt)}
                        </span>

                        {isUnread && (
                          <span className="text-ash-400 font-orbitron font-semibold text-[9px] group-hover:text-crimson-400">
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
        <div className="p-3 border-t border-steel-800 bg-charcoal-900 text-center text-[10px] font-mono text-ash-500">
          <span>F-TRACK • NOTIFICATION ENGINE</span>
        </div>
      </motion.aside>
    </div>
  );
};

export default NotificationCenter;
