import React, { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../services/notificationService';
import NotificationCenter from './NotificationCenter';
import { useAuth } from '../../context/AuthContext';

/**
 * NotificationBell Component (Stage 11)
 * Interactive HUD notification bell with real-time unread badge & flyout drawer
 */
export const NotificationBell = ({ className = '' }) => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getUnreadCount();
      if (data && typeof data.unreadCount === 'number') {
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      // Gracefully handle unauthenticated or offline cases
    }
  }, [isAuthenticated]);

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await getNotifications();
      if (data && data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to load notifications', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCount();
    // Poll unread count periodically every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  const handleToggle = () => {
    if (!isOpen) {
      loadNotifications();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Failed to mark notification read', err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.warn('Failed to mark all notifications read', err.message);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <button
        onClick={handleToggle}
        className={`relative p-2 rounded-lg bg-obsidian/80 border border-slate-800 hover:border-cyan-neon/40 text-slate-300 hover:text-cyan-neon transition-all duration-200 group flex items-center justify-center ${className}`}
        aria-label="View notifications"
        title="Hunter Alerts & Reminders"
      >
        <Bell className="w-4 h-4 transition-transform group-hover:rotate-12" />

        {/* Dynamic Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 min-w-[18px] h-[18px] rounded-full bg-crimson-aura text-[10px] font-orbitron font-black text-white flex items-center justify-center border border-void shadow-[0_0_8px_rgba(255,42,95,0.7)] animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Flyout Drawer */}
      <NotificationCenter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </>
  );
};

export default NotificationBell;
