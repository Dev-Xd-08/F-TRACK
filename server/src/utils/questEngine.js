import QuestProgress from '../models/QuestProgress.js';
import Workout from '../models/Workout.js';
import { QUEST_CATALOG, getQuestDefinition } from '../config/questCatalog.js';
import {
  isMongoConnected,
  getDevWorkouts,
  getDevQuestProgress,
  getUserDevQuestProgressList,
  upsertDevQuestProgress,
  getDevQuestHistory,
} from './devStore.js';
import { awardQuestProgression } from './progressionEngine.js';

/**
 * Determine UTC Daily Period bounds for a given timestamp
 * @param {Date|string} dateInput 
 * @returns {{ start: Date, end: Date, key: string }}
 */
export const getDailyPeriod = (dateInput = new Date()) => {
  const d = new Date(dateInput);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();

  const start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
  const key = `${start.toISOString().split('T')[0]}`;

  return { start, end, key };
};

/**
 * Determine UTC Weekly Period (Monday 00:00:00 -> Sunday 23:59:59) for a given timestamp
 * @param {Date|string} dateInput 
 * @returns {{ start: Date, end: Date, key: string }}
 */
export const getWeeklyPeriod = (dateInput = new Date()) => {
  const d = new Date(dateInput);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();
  const dayOfWeek = d.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  const daysToMonday = (dayOfWeek + 6) % 7;
  const start = new Date(Date.UTC(year, month, day - daysToMonday, 0, 0, 0, 0));
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + 6, 23, 59, 59, 999));
  const key = `${start.toISOString().split('T')[0]}_${end.toISOString().split('T')[0]}`;

  return { start, end, key };
};

/**
 * Format remaining time until period expiration
 * @param {Date} periodEnd 
 * @param {'DAILY'|'WEEKLY'} type 
 * @returns {string}
 */
export const formatTimeRemaining = (periodEnd, type) => {
  const diffMs = Math.max(0, new Date(periodEnd).getTime() - Date.now());
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (type === 'DAILY') {
    return hours > 0 ? `ENDS IN ${hours}H ${minutes}M` : `ENDS IN ${minutes}M`;
  }
  return days > 0 ? `ENDS IN ${days}D ${remainingHours}H` : `ENDS IN ${remainingHours}H ${minutes}M`;
};

/**
 * Retrieve user's workouts directly from MongoDB or devStore
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
const fetchUserWorkouts = async (userId) => {
  if (isMongoConnected()) {
    return await Workout.find({ user: userId }).lean();
  }
  return await getDevWorkouts(userId);
};

/**
 * Filter workouts within a specific datetime window
 * @param {Array} workouts 
 * @param {Date} start 
 * @param {Date} end 
 * @returns {Array}
 */
const filterWorkoutsInPeriod = (workouts, start, end) => {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  return workouts.filter((w) => {
    const wDate = new Date(w.workoutDate || w.createdAt).getTime();
    return wDate >= startTime && wDate <= endTime;
  });
};

/**
 * Calculate aggregated fitness metrics from a set of workouts
 * @param {Array} workouts 
 * @returns {{ workouts: number, duration: number, calories: number }}
 */
const calculatePeriodMetrics = (workouts = []) => {
  return {
    workouts: workouts.length,
    duration: workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0),
    calories: workouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0),
  };
};

/**
 * Retrieve existing QuestProgress record for (user, questId, periodStart)
 * @param {string} userId 
 * @param {string} questId 
 * @param {Date} periodStart 
 * @returns {Promise<Object|null>}
 */
const fetchQuestProgressRecord = async (userId, questId, periodStart) => {
  if (isMongoConnected()) {
    return await QuestProgress.findOne({
      user: userId,
      questId,
      periodStart,
    }).lean();
  }
  return await getDevQuestProgress(userId, questId, periodStart);
};

/**
 * Upsert QuestProgress record in MongoDB or devStore
 * @param {string} userId 
 * @param {Object} questData 
 * @returns {Promise<Object>}
 */
const persistQuestProgressRecord = async (userId, questData) => {
  if (isMongoConnected()) {
    const { questId, periodType, periodStart, periodEnd, currentValue, targetValue, completed, completedAt } = questData;
    return await QuestProgress.findOneAndUpdate(
      { user: userId, questId, periodStart },
      {
        $set: {
          periodType,
          periodEnd,
          currentValue,
          targetValue,
          completed,
          completedAt,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  return await upsertDevQuestProgress(userId, questData);
};

/**
 * Evaluate all user quests for the current active periods.
 * Calculates metrics from real workouts and detects newly completed quests.
 * 
 * @param {string} userId 
 * @param {{ allowXpAward: boolean }} options - If true, awards XP for state transitions (false -> true)
 * @returns {Promise<{ daily: Array, weekly: Array, newlyCompletedQuests: Array, questEvents: Array, progression: Object|null }>}
 */
export const evaluateUserQuests = async (userId, options = { allowXpAward: true }) => {
  const dailyPeriod = getDailyPeriod();
  const weeklyPeriod = getWeeklyPeriod();

  const allWorkouts = await fetchUserWorkouts(userId);
  const dailyWorkouts = filterWorkoutsInPeriod(allWorkouts, dailyPeriod.start, dailyPeriod.end);
  const weeklyWorkouts = filterWorkoutsInPeriod(allWorkouts, weeklyPeriod.start, weeklyPeriod.end);

  const dailyMetrics = calculatePeriodMetrics(dailyWorkouts);
  const weeklyMetrics = calculatePeriodMetrics(weeklyWorkouts);

  const dailyResults = [];
  const weeklyResults = [];
  const newlyCompletedQuests = [];

  for (const quest of QUEST_CATALOG) {
    const isDaily = quest.type === 'DAILY';
    const period = isDaily ? dailyPeriod : weeklyPeriod;
    const metrics = isDaily ? dailyMetrics : weeklyMetrics;

    const actualMetricValue = metrics[quest.metric] || 0;
    const isTargetMet = actualMetricValue >= quest.target;

    // Check historical progress record for this discrete period instance
    const existing = await fetchQuestProgressRecord(userId, quest.id, period.start);
    const wasCompleted = existing ? !!existing.completed : false;
    const isNewlyCompleted = !wasCompleted && isTargetMet;

    const completedAt = isTargetMet
      ? (existing?.completedAt ? new Date(existing.completedAt) : new Date())
      : null;

    // Persist progress record
    await persistQuestProgressRecord(userId, {
      questId: quest.id,
      periodType: quest.type,
      periodStart: period.start,
      periodEnd: period.end,
      currentValue: actualMetricValue,
      targetValue: quest.target,
      completed: isTargetMet,
      completedAt,
    });

    if (isNewlyCompleted) {
      newlyCompletedQuests.push(quest);
    }

    const clampedCurrent = Math.min(actualMetricValue, quest.target);
    const percentage = Math.min(100, Math.max(0, Math.round((actualMetricValue / quest.target) * 100)));

    const questView = {
      id: quest.id,
      type: quest.type,
      title: quest.title,
      description: quest.description,
      metric: quest.metric,
      target: quest.target,
      unit: quest.unit,
      xp: quest.xp,
      actualValue: actualMetricValue,
      currentValue: clampedCurrent,
      percentage,
      completed: isTargetMet,
      completedAt,
      periodStart: period.start,
      periodEnd: period.end,
      timeRemaining: formatTimeRemaining(period.end, quest.type),
    };

    if (isDaily) {
      dailyResults.push(questView);
    } else {
      weeklyResults.push(questView);
    }
  }

  // Award XP through central progression engine if newly completed and permitted
  let questEvents = [];
  let updatedProgression = null;

  if (options.allowXpAward && newlyCompletedQuests.length > 0) {
    const awardResult = await awardQuestProgression(userId, newlyCompletedQuests);
    questEvents = awardResult.newEvents || [];
    updatedProgression = awardResult.progression;
  }

  return {
    daily: dailyResults,
    weekly: weeklyResults,
    dailyPeriod,
    weeklyPeriod,
    newlyCompletedQuests,
    questEvents,
    progression: updatedProgression,
  };
};

/**
 * Get formatted quests for API presentation (Idempotent read - never awards new XP)
 * @param {string} userId 
 * @returns {Promise<{ daily: Array, weekly: Array, dailyPeriod: Object, weeklyPeriod: Object }>}
 */
export const getUserQuests = async (userId) => {
  // Pass allowXpAward: false to ensure GET requests are strictly read-only and idempotent
  const evaluation = await evaluateUserQuests(userId, { allowXpAward: false });
  return {
    daily: evaluation.daily,
    weekly: evaluation.weekly,
    dailyPeriod: evaluation.dailyPeriod,
    weeklyPeriod: evaluation.weeklyPeriod,
  };
};

/**
 * Retrieve completed quest history for the warrior
 * @param {string} userId 
 * @param {number} limit 
 * @returns {Promise<Array>}
 */
export const getUserQuestHistory = async (userId, limit = 20) => {
  let records = [];

  if (isMongoConnected()) {
    records = await QuestProgress.find({ user: userId, completed: true })
      .sort({ completedAt: -1, updatedAt: -1 })
      .limit(limit)
      .lean();
  } else {
    records = await getDevQuestHistory(userId);
  }

  return records.map((r) => {
    const def = getQuestDefinition(r.questId);
    return {
      _id: r._id,
      questId: r.questId,
      title: def?.title || r.questId,
      description: def?.description || '',
      type: r.periodType,
      metric: def?.metric || '',
      unit: def?.unit || '',
      target: r.targetValue,
      xp: def?.xp || (r.periodType === 'WEEKLY' ? 100 : 25),
      completedAt: r.completedAt || r.updatedAt,
      periodStart: r.periodStart,
      periodEnd: r.periodEnd,
    };
  });
};

export default {
  getDailyPeriod,
  getWeeklyPeriod,
  formatTimeRemaining,
  evaluateUserQuests,
  getUserQuests,
  getUserQuestHistory,
};
