import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({
    type = 'INFO',
    title,
    message,
    xp = 0,
    meta = null,
    duration = 4500,
  }) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { id, type, title, message, xp, meta, duration };

    setToasts((prev) => [...prev.slice(-4), newToast]); // Keep up to 5 concurrent toasts max

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  // Convenience helper methods
  const toast = {
    rankUp: (newRank, title = 'RANK ASCENSION') =>
      addToast({
        type: 'RANK_UP',
        title,
        message: `Hunter Rank promoted to Rank ${newRank}! New status unlocked.`,
        duration: 5500,
      }),
    levelUp: (newLevel, title = 'ASCENSION LEVEL UP!') =>
      addToast({
        type: 'LEVEL_UP',
        title,
        message: `Ascended to Level ${newLevel}! Energy capacity expanded.`,
        duration: 5500,
      }),
    achievementUnlocked: (achTitle, xp = 50) =>
      addToast({
        type: 'ACHIEVEMENT_UNLOCKED',
        title: 'ACHIEVEMENT UNLOCKED',
        message: achTitle,
        xp,
        duration: 5000,
      }),
    questCompleted: (questTitle, xp = 25) =>
      addToast({
        type: 'QUEST_COMPLETED',
        title: 'QUEST COMPLETED',
        message: questTitle,
        xp,
        duration: 4500,
      }),
    personalRecord: (metricName, recordValue, unit = '') =>
      addToast({
        type: 'PERSONAL_RECORD',
        title: 'NEW PERSONAL RECORD',
        message: `${metricName}: ${recordValue} ${unit}`.trim(),
        meta: `${recordValue} ${unit}`.trim(),
        duration: 5000,
      }),
    goalCompleted: (goalTitle) =>
      addToast({
        type: 'GOAL_COMPLETED',
        title: 'MISSION COMPLETE',
        message: `Target achieved: "${goalTitle}"`,
        duration: 5000,
      }),
    streakMilestone: (days) =>
      addToast({
        type: 'STREAK_MILESTONE',
        title: 'STREAK MILESTONE',
        message: `${days} DAYS ACTIVE • CONSISTENCY PROTOCOL RECOGNIZED`,
        duration: 5000,
      }),
    workoutCompleted: (activityType, duration, xp = 100) =>
      addToast({
        type: 'WORKOUT_COMPLETED',
        title: 'QUEST COMPLETE',
        message: `${activityType} session (${duration}m) successfully logged.`,
        xp,
        duration: 4500,
      }),
    success: (title, message) =>
      addToast({ type: 'SUCCESS', title, message, duration: 4000 }),
    error: (title, message) =>
      addToast({ type: 'ERROR', title, message, duration: 5000 }),
    info: (title, message) =>
      addToast({ type: 'INFO', title, message, duration: 4000 }),
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
