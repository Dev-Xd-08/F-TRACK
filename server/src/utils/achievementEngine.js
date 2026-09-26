import Achievement from '../models/Achievement.js';
import Workout from '../models/Workout.js';
import QuestProgress from '../models/QuestProgress.js';
import { ACHIEVEMENT_CATALOG, getAchievementDefinition } from '../config/achievementCatalog.js';
import {
  isMongoConnected,
  getDevWorkouts,
  getDevAchievement,
  getDevAchievements,
  upsertDevAchievement,
  getDevAchievementHistory,
  getDevQuestHistory,
} from './devStore.js';
import { getUserProgressionData, awardAchievementProgression } from './progressionEngine.js';
import { calculatePersonalRecords } from './recordEngine.js';

/**
 * Gather all authentic fitness telemetry for the user across workouts, progression, and quests
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
export const gatherUserTelemetry = async (userId) => {
  let workouts = [];
  let progression = null;
  let completedQuestCount = 0;

  if (isMongoConnected()) {
    workouts = await Workout.find({ user: userId }).lean();
    progression = await getUserProgressionData(userId);
    completedQuestCount = await QuestProgress.countDocuments({ user: userId, completed: true });
  } else {
    workouts = await getDevWorkouts(userId);
    progression = await getUserProgressionData(userId);
    const questHistory = await getDevQuestHistory(userId);
    completedQuestCount = questHistory.length;
  }

  const totalWorkouts = progression?.totalWorkouts ?? workouts.length;
  const totalCalories = progression?.totalCaloriesBurned ?? workouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);
  const totalMinutes = progression?.totalDurationMinutes ?? workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
  const maxStreak = Math.max(progression?.currentStreak || 0, progression?.longestStreak || 0);

  const personalRecords = calculatePersonalRecords(workouts, progression);
  const hasPR = personalRecords.hasRecords && (personalRecords.longestWorkout !== null || personalRecords.highestCalories !== null);

  const rankTier = progression?.rank || 'E';
  const isRankDOrHigher = rankTier !== 'E' || (progression?.level || 1) >= 8;

  return {
    workouts,
    progression,
    totalWorkouts,
    totalCalories,
    totalMinutes,
    maxStreak,
    hasPR: !!hasPR,
    completedQuestCount,
    isRankDOrHigher,
  };
};

/**
 * Fetch existing achievement record for user
 * @param {string} userId 
 * @param {string} achievementId 
 * @returns {Promise<Object|null>}
 */
const fetchAchievementRecord = async (userId, achievementId) => {
  if (isMongoConnected()) {
    return await Achievement.findOne({ user: userId, achievementId }).lean();
  }
  return await getDevAchievement(userId, achievementId);
};

/**
 * Persist achievement record in MongoDB or devStore
 * @param {string} userId 
 * @param {Object} achData 
 * @returns {Promise<Object>}
 */
const persistAchievementRecord = async (userId, achData) => {
  if (isMongoConnected()) {
    const { achievementId, unlocked, unlockedAt, progressValue, targetValue } = achData;
    return await Achievement.findOneAndUpdate(
      { user: userId, achievementId },
      {
        $set: {
          unlocked,
          unlockedAt,
          progressValue,
          targetValue,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  return await upsertDevAchievement(userId, achData);
};

/**
 * Evaluate all 14 Hunter Achievements against authentic user telemetry.
 * Detects newly unlocked achievements and triggers progression awards once.
 * 
 * @param {string} userId 
 * @param {{ allowXpAward: boolean }} options - If true, awards XP for new unlocks
 * @returns {Promise<{ achievements: Array, newlyUnlockedAchievements: Array, achievementEvents: Array, progression: Object|null }>}
 */
export const evaluateUserAchievements = async (userId, options = { allowXpAward: true }) => {
  const telemetry = await gatherUserTelemetry(userId);
  const {
    totalWorkouts,
    totalCalories,
    totalMinutes,
    maxStreak,
    hasPR,
    completedQuestCount,
    isRankDOrHigher,
  } = telemetry;

  const achievementViews = [];
  const newlyUnlockedAchievements = [];

  for (const ach of ACHIEVEMENT_CATALOG) {
    let actualMetricValue = 0;
    let isUnlocked = false;

    switch (ach.id) {
      case 'FIRST_STEP':
        actualMetricValue = totalWorkouts;
        isUnlocked = totalWorkouts >= 1;
        break;
      case 'TEN_WORKOUTS':
        actualMetricValue = totalWorkouts;
        isUnlocked = totalWorkouts >= 10;
        break;
      case 'TWENTY_FIVE_WORKOUTS':
        actualMetricValue = totalWorkouts;
        isUnlocked = totalWorkouts >= 25;
        break;
      case 'FIFTY_WORKOUTS':
        actualMetricValue = totalWorkouts;
        isUnlocked = totalWorkouts >= 50;
        break;
      case 'CALORIE_1000':
        actualMetricValue = totalCalories;
        isUnlocked = totalCalories >= 1000;
        break;
      case 'CALORIE_5000':
        actualMetricValue = totalCalories;
        isUnlocked = totalCalories >= 5000;
        break;
      case 'CALORIE_10000':
        actualMetricValue = totalCalories;
        isUnlocked = totalCalories >= 10000;
        break;
      case 'ACTIVE_500':
        actualMetricValue = totalMinutes;
        isUnlocked = totalMinutes >= 500;
        break;
      case 'STREAK_7':
        actualMetricValue = maxStreak;
        isUnlocked = maxStreak >= 7;
        break;
      case 'STREAK_30':
        actualMetricValue = maxStreak;
        isUnlocked = maxStreak >= 30;
        break;
      case 'RECORD_BREAKER':
        actualMetricValue = hasPR ? 1 : 0;
        isUnlocked = hasPR;
        break;
      case 'QUEST_HUNTER':
        actualMetricValue = completedQuestCount;
        isUnlocked = completedQuestCount >= 5;
        break;
      case 'QUEST_MASTER':
        actualMetricValue = completedQuestCount;
        isUnlocked = completedQuestCount >= 25;
        break;
      case 'RANK_UP':
        actualMetricValue = isRankDOrHigher ? 1 : 0;
        isUnlocked = isRankDOrHigher;
        break;
      default:
        actualMetricValue = 0;
        isUnlocked = false;
    }

    const existingRecord = await fetchAchievementRecord(userId, ach.id);
    const wasUnlocked = existingRecord ? !!existingRecord.unlocked : false;
    const isNewlyUnlocked = !wasUnlocked && isUnlocked;

    const unlockedAt = isUnlocked
      ? (existingRecord?.unlockedAt ? new Date(existingRecord.unlockedAt) : new Date())
      : null;

    const clampedProgress = Math.min(actualMetricValue, ach.target);
    const percentage = Math.min(100, Math.max(0, Math.round((actualMetricValue / ach.target) * 100)));

    // Persist evaluation
    await persistAchievementRecord(userId, {
      achievementId: ach.id,
      unlocked: isUnlocked,
      unlockedAt,
      progressValue: clampedProgress,
      targetValue: ach.target,
    });

    if (isNewlyUnlocked) {
      newlyUnlockedAchievements.push(ach);
    }

    achievementViews.push({
      id: ach.id,
      title: ach.title,
      description: ach.description,
      category: ach.category,
      metric: ach.metric,
      target: ach.target,
      unit: ach.unit,
      xp: ach.xp,
      icon: ach.icon,
      progressValue: clampedProgress,
      actualValue: actualMetricValue,
      percentage,
      unlocked: isUnlocked,
      unlockedAt,
    });
  }

  // Award XP via central progression engine
  let achievementEvents = [];
  let updatedProgression = null;

  if (options.allowXpAward && newlyUnlockedAchievements.length > 0) {
    const awardResult = await awardAchievementProgression(userId, newlyUnlockedAchievements);
    achievementEvents = awardResult.newEvents || [];
    updatedProgression = awardResult.progression;
  }

  return {
    achievements: achievementViews,
    newlyUnlockedAchievements,
    achievementEvents,
    progression: updatedProgression,
  };
};

/**
 * Get all achievements formatted for user dashboard presentation (Idempotent read)
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
export const getUserAchievements = async (userId) => {
  const result = await evaluateUserAchievements(userId, { allowXpAward: false });
  const totalAchievements = result.achievements.length;
  const unlockedCount = result.achievements.filter((a) => a.unlocked).length;
  const totalEarnedXP = result.achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + (Number(a.xp) || 0), 0);

  return {
    achievements: result.achievements,
    totalAchievements,
    unlockedCount,
    totalEarnedXP,
    completionPercentage: Math.round((unlockedCount / totalAchievements) * 100),
  };
};

/**
 * Retrieve chronologically unlocked achievements for history showcase
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export const getUserAchievementHistory = async (userId) => {
  let records = [];

  if (isMongoConnected()) {
    records = await Achievement.find({ user: userId, unlocked: true })
      .sort({ unlockedAt: -1, updatedAt: -1 })
      .lean();
  } else {
    records = await getDevAchievementHistory(userId);
  }

  return records.map((r) => {
    const def = getAchievementDefinition(r.achievementId);
    return {
      _id: r._id,
      achievementId: r.achievementId,
      title: def?.title || r.achievementId,
      description: def?.description || '',
      category: def?.category || 'GENERAL',
      xp: def?.xp || 50,
      icon: def?.icon || 'Award',
      unlockedAt: r.unlockedAt || r.updatedAt,
    };
  });
};

export default {
  gatherUserTelemetry,
  evaluateUserAchievements,
  getUserAchievements,
  getUserAchievementHistory,
};
