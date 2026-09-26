import Workout from '../models/Workout.js';
import QuestProgress from '../models/QuestProgress.js';
import Achievement from '../models/Achievement.js';
import {
  isMongoConnected,
  getDevWorkouts,
  getDevQuestHistory,
  getDevAchievements,
} from './devStore.js';
import { getUserProgressionData } from './progressionEngine.js';
import { calculatePersonalRecords } from './recordEngine.js';
import { ACHIEVEMENT_CATALOG } from '../config/achievementCatalog.js';

const VALID_ACTIVITIES = [
  'Running',
  'Walking',
  'Cycling',
  'Gym',
  'Swimming',
  'Yoga',
  'HIIT',
  'Sports',
  'Other',
];

/**
 * Helper to format ISO Date string YYYY-MM-DD in UTC
 * @param {Date|string} d 
 * @returns {string}
 */
const toISODateUTC = (d) => {
  const date = new Date(d);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
};

/**
 * Calculate weekly period boundaries (Monday 00:00:00 -> Sunday 23:59:59 UTC)
 * @param {Date|string} dateInput 
 * @returns {{ start: Date, end: Date, key: string }}
 */
const getWeekPeriodUTC = (dateInput = new Date()) => {
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
 * Safely compute percentage change without dividing by zero
 * @param {number} current 
 * @param {number} previous 
 * @returns {number|null}
 */
const calculateSafePercentageChange = (current, previous) => {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Main analytics calculation engine aggregating authentic user telemetry
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
export const calculateAnalytics = async (userId) => {
  let workouts = [];
  let progression = null;
  let completedQuestHistory = [];
  let unlockedAchievements = [];

  if (isMongoConnected()) {
    workouts = await Workout.find({ user: userId }).sort({ workoutDate: -1, createdAt: -1 }).lean();
    progression = await getUserProgressionData(userId);
    completedQuestHistory = await QuestProgress.find({ user: userId, completed: true }).lean();
    unlockedAchievements = await Achievement.find({ user: userId, unlocked: true }).lean();
  } else {
    workouts = await getDevWorkouts(userId);
    progression = await getUserProgressionData(userId);
    completedQuestHistory = await getDevQuestHistory(userId);
    unlockedAchievements = await getDevAchievements(userId);
  }

  // 1. Summary Totals & Averages
  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);

  const averageWorkoutDuration = totalWorkouts > 0 
    ? Math.round((totalMinutes / totalWorkouts) * 10) / 10 
    : 0;

  const averageCaloriesPerWorkout = totalWorkouts > 0 
    ? Math.round((totalCalories / totalWorkouts) * 10) / 10 
    : 0;

  const currentStreak = progression?.currentStreak || 0;
  const longestStreak = progression?.longestStreak || 0;

  // 2. Weekly Activity (7-Day Rolling Calendar Window ending today in UTC)
  const todayUTC = new Date();
  const weeklyActivity = [];

  for (let i = 6; i >= 0; i--) {
    const dayDate = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() - i));
    const dayKey = toISODateUTC(dayDate);
    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });

    const dayWorkouts = workouts.filter((w) => {
      const wDate = new Date(w.workoutDate || w.createdAt);
      return toISODateUTC(wDate) === dayKey;
    });

    const dayMinutes = dayWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
    const dayCalories = dayWorkouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);

    weeklyActivity.push({
      date: dayKey,
      day: dayName,
      workouts: dayWorkouts.length,
      minutes: dayMinutes,
      calories: dayCalories,
    });
  }

  // 3. Weekly Comparison (This Week vs Previous Week)
  const currentWeek = getWeekPeriodUTC(todayUTC);
  const prevWeekMonday = new Date(currentWeek.start.getTime() - 7 * 24 * 60 * 60 * 1000);
  const previousWeek = getWeekPeriodUTC(prevWeekMonday);

  const currentWeekWorkouts = workouts.filter((w) => {
    const time = new Date(w.workoutDate || w.createdAt).getTime();
    return time >= currentWeek.start.getTime() && time <= currentWeek.end.getTime();
  });

  const previousWeekWorkouts = workouts.filter((w) => {
    const time = new Date(w.workoutDate || w.createdAt).getTime();
    return time >= previousWeek.start.getTime() && time <= previousWeek.end.getTime();
  });

  const currentWeekMetrics = {
    workouts: currentWeekWorkouts.length,
    minutes: currentWeekWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0),
    calories: currentWeekWorkouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0),
  };

  const previousWeekMetrics = {
    workouts: previousWeekWorkouts.length,
    minutes: previousWeekWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0),
    calories: previousWeekWorkouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0),
  };

  const weeklyComparison = {
    currentWeek: {
      periodStart: currentWeek.start.toISOString().split('T')[0],
      periodEnd: currentWeek.end.toISOString().split('T')[0],
      ...currentWeekMetrics,
    },
    previousWeek: {
      periodStart: previousWeek.start.toISOString().split('T')[0],
      periodEnd: previousWeek.end.toISOString().split('T')[0],
      ...previousWeekMetrics,
    },
    percentageChange: {
      workouts: calculateSafePercentageChange(currentWeekMetrics.workouts, previousWeekMetrics.workouts),
      minutes: calculateSafePercentageChange(currentWeekMetrics.minutes, previousWeekMetrics.minutes),
      calories: calculateSafePercentageChange(currentWeekMetrics.calories, previousWeekMetrics.calories),
    },
  };

  // 4. Six-Month Trend (Last 6 Calendar Months ending with current month)
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const mDate = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth() - i, 1));
    const targetYear = mDate.getUTCFullYear();
    const targetMonth = mDate.getUTCMonth();
    const monthLabel = mDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    const monthKey = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;

    const monthWorkouts = workouts.filter((w) => {
      const d = new Date(w.workoutDate || w.createdAt);
      return d.getUTCFullYear() === targetYear && d.getUTCMonth() === targetMonth;
    });

    const mMinutes = monthWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
    const mCalories = monthWorkouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);

    monthlyTrend.push({
      month: monthLabel,
      monthKey,
      workouts: monthWorkouts.length,
      minutes: mMinutes,
      calories: mCalories,
    });
  }

  // 5. Activity Breakdown (Grouped across known activity catalog)
  const activityBreakdown = VALID_ACTIVITIES.map((act) => {
    const actWorkouts = workouts.filter((w) => w.activityType === act);
    const count = actWorkouts.length;
    const minutes = actWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
    const calories = actWorkouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);
    const percentage = totalWorkouts > 0 ? Math.round((count / totalWorkouts) * 100) : 0;

    return {
      type: act,
      workouts: count,
      minutes,
      calories,
      percentage,
    };
  }).sort((a, b) => b.workouts - a.workouts);

  // 6. Personal Records (Reusing Stage 7 calculation directly)
  const personalRecords = calculatePersonalRecords(workouts, progression);

  // 7. Quest & Achievement Summaries
  const dailyQuestsCompleted = completedQuestHistory.filter((q) => q.periodType === 'DAILY').length;
  const weeklyQuestsCompleted = completedQuestHistory.filter((q) => q.periodType === 'WEEKLY').length;

  const totalAchievements = ACHIEVEMENT_CATALOG.length;
  const unlockedAchievementCount = unlockedAchievements.filter((a) => a.unlocked).length;

  return {
    summary: {
      totalWorkouts,
      totalMinutes,
      totalCalories,
      averageWorkoutDuration,
      averageCaloriesPerWorkout,
      currentStreak,
      longestStreak,
    },
    weeklyActivity,
    weeklyComparison,
    monthlyTrend,
    activityBreakdown,
    personalRecords,
    progression: {
      xp: progression?.xp || 0,
      level: progression?.level || 1,
      rank: progression?.rank || 'E',
      rankTitle: progression?.rankTitle || 'AWAKENING',
      currentStreak,
      longestStreak,
    },
    quests: {
      dailyCompleted: dailyQuestsCompleted,
      weeklyCompleted: weeklyQuestsCompleted,
      totalCompleted: completedQuestHistory.length,
    },
    achievements: {
      unlocked: unlockedAchievementCount,
      total: totalAchievements,
      percentage: Math.round((unlockedAchievementCount / totalAchievements) * 100),
    },
  };
};

export default {
  calculateAnalytics,
};
