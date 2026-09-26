import Notification from '../models/Notification.js';
import Workout from '../models/Workout.js';
import QuestProgress from '../models/QuestProgress.js';
import Achievement from '../models/Achievement.js';
import {
  isMongoConnected,
  createDevNotification,
  getDevNotifications,
  getDevUnreadNotificationCount,
  markDevNotificationRead,
  markAllDevNotificationsRead,
  getDevWorkouts,
  getDevQuestHistory,
  getDevAchievements,
} from './devStore.js';
import { getUserProgressionData } from './progressionEngine.js';
import { getUserQuests } from './questEngine.js';
import { getQuestDefinition } from '../config/questCatalog.js';
import { getAchievementDefinition } from '../config/achievementCatalog.js';

/**
 * Format ISO Date string YYYY-MM-DD in UTC
 * @param {Date|string} d 
 * @returns {string}
 */
const toISODateUTC = (d = new Date()) => {
  const date = new Date(d);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
};

/**
 * Create a persistent notification with duplicate protection
 * @param {string} userId 
 * @param {Object} notificationData 
 * @returns {Promise<{ notification: Object, created: boolean }>}
 */
export const createNotification = async (userId, {
  type,
  title,
  message,
  priority = 'MEDIUM',
  dedupKey,
  metadata = {},
}) => {
  if (!userId || !type || !title || !message || !dedupKey) {
    throw new Error('Missing required fields for notification creation.');
  }

  if (isMongoConnected()) {
    const existing = await Notification.findOne({
      user: userId,
      dedupKey,
    }).lean();

    if (existing) {
      return { notification: existing, created: false };
    }

    try {
      const created = await Notification.create({
        user: userId,
        type,
        title: title.trim(),
        message: message.trim(),
        priority,
        dedupKey: dedupKey.trim(),
        metadata: metadata || {},
      });
      return { notification: created.toObject(), created: true };
    } catch (err) {
      // Catch race condition MongoDB duplicate key error (E11000)
      if (err.code === 11000) {
        const raceExisting = await Notification.findOne({
          user: userId,
          dedupKey,
        }).lean();
        return { notification: raceExisting, created: false };
      }
      throw err;
    }
  } else {
    return await createDevNotification({
      userId,
      type,
      title,
      message,
      priority,
      dedupKey,
      metadata,
    });
  }
};

/**
 * Retrieve all notifications for the authenticated warrior, sorted chronologically descending
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export const getUserNotifications = async (userId) => {
  if (isMongoConnected()) {
    return await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
  } else {
    return await getDevNotifications(userId);
  }
};

/**
 * Retrieve count of unread notifications for the user
 * @param {string} userId 
 * @returns {Promise<number>}
 */
export const getUnreadCount = async (userId) => {
  if (isMongoConnected()) {
    return await Notification.countDocuments({
      user: userId,
      isRead: false,
    });
  } else {
    return await getDevUnreadNotificationCount(userId);
  }
};

/**
 * Mark a single notification as read
 * @param {string} userId 
 * @param {string} notificationId 
 * @returns {Promise<Object|null>}
 */
export const markNotificationRead = async (userId, notificationId) => {
  if (isMongoConnected()) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    ).lean();
  } else {
    return await markDevNotificationRead(notificationId, userId);
  }
};

/**
 * Mark all notifications for user as read
 * @param {string} userId 
 * @returns {Promise<number>}
 */
export const markAllNotificationsRead = async (userId) => {
  if (isMongoConnected()) {
    const res = await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );
    return res.modifiedCount;
  } else {
    return await markAllDevNotificationsRead(userId);
  }
};

/**
 * Smart evaluation of user state to generate relevant reminders and alerts
 * Completely deterministic and idempotent - never duplicates notifications
 * @param {string} userId 
 * @returns {Promise<void>}
 */
export const evaluateUserNotifications = async (userId) => {
  let workouts = [];
  let progression = null;
  let completedQuests = [];
  let unlockedAchievements = [];

  if (isMongoConnected()) {
    workouts = await Workout.find({ user: userId }).sort({ workoutDate: -1, createdAt: -1 }).lean();
    progression = await getUserProgressionData(userId);
    completedQuests = await QuestProgress.find({ user: userId, completed: true }).lean();
    unlockedAchievements = await Achievement.find({ user: userId, unlocked: true }).lean();
  } else {
    workouts = await getDevWorkouts(userId);
    progression = await getUserProgressionData(userId);
    completedQuests = await getDevQuestHistory(userId);
    unlockedAchievements = await getDevAchievements(userId);
  }

  // Brand-New User Protection:
  // If user has zero workouts and no achievements, do NOT generate workout/streak reminders
  if (workouts.length === 0) {
    return;
  }

  const todayUTC = toISODateUTC(new Date());

  // 1. Check if user completed workout today in UTC
  const hasWorkoutToday = workouts.some((w) => {
    const wDate = new Date(w.workoutDate || w.createdAt);
    return toISODateUTC(wDate) === todayUTC;
  });

  // Workout Reminder: Only if user has workout history but has not trained today
  if (!hasWorkoutToday) {
    await createNotification(userId, {
      type: 'WORKOUT_REMINDER',
      title: 'DAILY QUEST WAITING',
      message: 'Your daily training chamber awaits. Complete a workout today to continue your ascension.',
      priority: 'MEDIUM',
      dedupKey: `workout-reminder:${todayUTC}`,
      metadata: { date: todayUTC },
    });
  }

  // 2. Streak Reminder: Active streak at risk if no workout today
  const currentStreak = progression?.currentStreak || 0;
  if (currentStreak > 0 && !hasWorkoutToday) {
    await createNotification(userId, {
      type: 'STREAK_REMINDER',
      title: 'STREAK AT RISK',
      message: `You have an active ${currentStreak}-day streak! Complete today's workout to protect your streak.`,
      priority: 'HIGH',
      dedupKey: `streak-reminder:${todayUTC}`,
      metadata: { streak: currentStreak, date: todayUTC },
    });
  }

  // 3. Quest Reminders: For active daily/weekly quests that are currently incomplete
  try {
    const activeQuests = await getUserQuests(userId);
    const incompleteQuests = [
      ...(activeQuests.daily || []).filter((q) => !q.completed),
      ...(activeQuests.weekly || []).filter((q) => !q.completed),
    ];

    for (const q of incompleteQuests) {
      const periodKey = q.periodType === 'DAILY' 
        ? (activeQuests.dailyPeriod?.key || todayUTC)
        : (activeQuests.weeklyPeriod?.key || 'current');

      await createNotification(userId, {
        type: 'QUEST_REMINDER',
        title: `QUEST AVAILABLE: ${q.title.toUpperCase()}`,
        message: q.description || `Your "${q.title}" quest is waiting for completion.`,
        priority: 'MEDIUM',
        dedupKey: `quest-reminder:${q.questId}:${periodKey}`,
        metadata: { questId: q.questId, periodType: q.periodType, periodKey },
      });
    }
  } catch (qErr) {
    console.error(`[QUEST_REMINDER EVALUATION ERROR] ${qErr.message}`);
  }

  // 4. Quest Completion Notifications
  for (const cq of completedQuests) {
    const questDef = getQuestDefinition(cq.questId);
    const questTitle = questDef?.title || cq.questId;
    const periodStr = cq.periodStart ? toISODateUTC(new Date(cq.periodStart)) : 'history';

    await createNotification(userId, {
      type: 'QUEST_COMPLETED',
      title: `QUEST COMPLETE: ${questTitle.toUpperCase()}`,
      message: `Quest objective fulfilled! You completed "${questTitle}".`,
      priority: 'MEDIUM',
      dedupKey: `quest-completed:${cq.questId}:${periodStr}`,
      metadata: { questId: cq.questId, periodStart: cq.periodStart },
    });
  }

  // 5. Achievement Unlock Notifications
  for (const ach of unlockedAchievements) {
    if (ach.unlocked) {
      const achDef = getAchievementDefinition(ach.achievementId);
      const achTitle = achDef?.title || ach.achievementId;

      await createNotification(userId, {
        type: 'ACHIEVEMENT_UNLOCKED',
        title: `ACHIEVEMENT UNLOCKED: ${achTitle.toUpperCase()}`,
        message: `New badge unlocked! "${achTitle}" has been added to your Hunter Archive.`,
        priority: 'HIGH',
        dedupKey: `achievement-unlocked:${ach.achievementId}`,
        metadata: { achievementId: ach.achievementId },
      });
    }
  }

  // 6. Rank Progress Notification
  if (progression && progression.rank && progression.rank !== 'E') {
    await createNotification(userId, {
      type: 'RANK_PROGRESS',
      title: `RANK ASCENDED: RANK ${progression.rank}`,
      message: `You have ascended to Rank ${progression.rank} (${progression.rankTitle || 'WARRIOR'}). Continue your training to unlock higher tiers.`,
      priority: 'HIGH',
      dedupKey: `rank-progress:${progression.rank}`,
      metadata: { rank: progression.rank, rankTitle: progression.rankTitle, level: progression.level },
    });
  }
};

export default {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  evaluateUserNotifications,
};
