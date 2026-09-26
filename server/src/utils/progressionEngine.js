import Progression from '../models/Progression.js';
import {
  isMongoConnected,
  getDevProgression,
  saveDevProgression,
  addDevProgressionEvent,
} from './devStore.js';

export const WORKOUT_XP_REWARD = 100;

/**
 * Calculate Level, Current Level XP, and Next Level Target from Total XP
 *
 * Formula:
 * Level N requires 100 * N XP to reach Level N + 1.
 * Total cumulative XP required to reach Level L:
 * totalXP(L) = 50 * (L - 1) * L
 *
 * Solving for L from totalXP:
 * 50 * L^2 - 50 * L - totalXP = 0
 * L = (1 + sqrt(1 + 0.08 * totalXP)) / 2
 * level = floor(L)
 */
export const calculateLevelFromXP = (totalXP = 0) => {
  const safeXP = Math.max(0, Number(totalXP) || 0);
  const calculatedLevel = Math.max(
    1,
    Math.floor((1 + Math.sqrt(1 + 0.08 * safeXP)) / 2)
  );

  const baseXPForCurrentLevel = 50 * (calculatedLevel - 1) * calculatedLevel;
  const currentLevelXP = safeXP - baseXPForCurrentLevel;
  const nextLevelXPRequired = 100 * calculatedLevel;
  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round((currentLevelXP / nextLevelXPRequired) * 100)
    )
  );

  return {
    level: calculatedLevel,
    currentLevelXP,
    nextLevelXPRequired,
    progressPercent,
    baseXPForCurrentLevel,
    totalXPToNextLevel: baseXPForCurrentLevel + nextLevelXPRequired,
  };
};

/**
 * Rank System Mapping
 * E: Levels 1–5   — AWAKENING
 * D: Levels 6–10  — INITIATE
 * C: Levels 11–20 — WARRIOR
 * B: Levels 21–35 — ELITE
 * A: Levels 36–50 — ASCENDANT
 * S: Levels 51+   — TRANSCENDENT
 */
export const getRankForLevel = (level = 1) => {
  const safeLevel = Math.max(1, Number(level) || 1);

  if (safeLevel >= 51) {
    return {
      rank: 'S',
      rankTitle: 'TRANSCENDENT',
      color: 'gold',
      minLevel: 51,
      maxLevel: Infinity,
      description: 'Beyond mortal limits. Mastery of ascension.',
    };
  }
  if (safeLevel >= 36) {
    return {
      rank: 'A',
      rankTitle: 'ASCENDANT',
      color: 'crimson',
      minLevel: 36,
      maxLevel: 50,
      description: 'Apex athletic warrior holding immense discipline.',
    };
  }
  if (safeLevel >= 21) {
    return {
      rank: 'B',
      rankTitle: 'ELITE',
      color: 'violet',
      minLevel: 21,
      maxLevel: 35,
      description: 'High-tier hunter commanding advanced conditioning.',
    };
  }
  if (safeLevel >= 11) {
    return {
      rank: 'C',
      rankTitle: 'WARRIOR',
      color: 'cyan',
      minLevel: 11,
      maxLevel: 20,
      description: 'Proven warrior forging unstoppable daily momentum.',
    };
  }
  if (safeLevel >= 8) {
    return {
      rank: 'D',
      rankTitle: 'INITIATE',
      color: 'emerald',
      minLevel: 8,
      maxLevel: 10,
      description: 'Focused disciple sharpening body and endurance.',
    };
  }
  return {
    rank: 'E',
    rankTitle: 'AWAKENING',
    color: 'slate',
    minLevel: 1,
    maxLevel: 7,
    description: 'The journey begins. Awakening physical potential.',
  };
};

/**
 * Evaluate Daily Workout Streak using Calendar Dates (UTC)
 */
export const evaluateStreak = (
  lastWorkoutDate,
  newWorkoutDate = new Date(),
  currentStreak = 0,
  longestStreak = 0
) => {
  const safeCurrent = Math.max(0, Number(currentStreak) || 0);
  const safeLongest = Math.max(0, Number(longestStreak) || 0);

  const toISODate = (d) => {
    const date = new Date(d);
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  };

  const newDateObj = new Date(newWorkoutDate);
  const todayStr = toISODate(newDateObj);

  if (!lastWorkoutDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(safeLongest, 1),
      lastWorkoutDate: newDateObj,
      streakUpdated: true,
      isConsecutive: false,
      diffDays: null,
    };
  }

  const lastStr = toISODate(lastWorkoutDate);
  const todayMs = Date.UTC(
    new Date(todayStr).getUTCFullYear(),
    new Date(todayStr).getUTCMonth(),
    new Date(todayStr).getUTCDate()
  );
  const lastMs = Date.UTC(
    new Date(lastStr).getUTCFullYear(),
    new Date(lastStr).getUTCMonth(),
    new Date(lastStr).getUTCDate()
  );

  const diffDays = Math.round((todayMs - lastMs) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same calendar day: maintain existing streak, do not increment streak count
    return {
      currentStreak: safeCurrent,
      longestStreak: Math.max(safeLongest, safeCurrent),
      lastWorkoutDate: newDateObj,
      streakUpdated: false,
      isConsecutive: false,
      diffDays: 0,
    };
  } else if (diffDays === 1) {
    // Exactly consecutive day: increment streak
    const updated = safeCurrent + 1;
    return {
      currentStreak: updated,
      longestStreak: Math.max(safeLongest, updated),
      lastWorkoutDate: newDateObj,
      streakUpdated: true,
      isConsecutive: true,
      diffDays: 1,
    };
  } else if (diffDays > 1) {
    // Broken streak: reset to 1
    return {
      currentStreak: 1,
      longestStreak: Math.max(safeLongest, 1),
      lastWorkoutDate: newDateObj,
      streakUpdated: true,
      isConsecutive: false,
      diffDays,
    };
  } else {
    // Logged a past date: preserve streak state
    return {
      currentStreak: safeCurrent,
      longestStreak: Math.max(safeLongest, safeCurrent),
      lastWorkoutDate: new Date(lastWorkoutDate),
      streakUpdated: false,
      isConsecutive: false,
      diffDays,
    };
  }
};

/**
 * Retrieve User Progression with dynamic calculation overlay
 */
export const getUserProgressionData = async (userId) => {
  let doc;

  if (isMongoConnected()) {
    doc = await Progression.findOne({ user: userId });
    if (!doc) {
      doc = await Progression.create({
        user: userId,
        xp: 0,
        level: 1,
        rank: 'E',
        rankTitle: 'AWAKENING',
        currentStreak: 0,
        longestStreak: 0,
        lastWorkoutDate: null,
        totalWorkouts: 0,
        totalDurationMinutes: 0,
        totalCaloriesBurned: 0,
        events: [],
      });
    }
  } else {
    doc = await getDevProgression(userId);
  }

  // Calculate live level & rank stats
  const levelStats = calculateLevelFromXP(doc.xp);
  const rankInfo = getRankForLevel(levelStats.level);

  return {
    _id: doc._id,
    user: doc.user,
    xp: doc.xp,
    level: levelStats.level,
    currentLevelXP: levelStats.currentLevelXP,
    nextLevelXPRequired: levelStats.nextLevelXPRequired,
    progressPercent: levelStats.progressPercent,
    baseXPForCurrentLevel: levelStats.baseXPForCurrentLevel,
    totalXPToNextLevel: levelStats.totalXPToNextLevel,
    rank: rankInfo.rank,
    rankTitle: rankInfo.rankTitle,
    rankColor: rankInfo.color,
    currentStreak: doc.currentStreak || 0,
    longestStreak: doc.longestStreak || 0,
    lastWorkoutDate: doc.lastWorkoutDate,
    totalWorkouts: doc.totalWorkouts || 0,
    totalDurationMinutes: doc.totalDurationMinutes || 0,
    totalCaloriesBurned: doc.totalCaloriesBurned || 0,
    events: (doc.events || []).slice(0, 20),
    updatedAt: doc.updatedAt,
  };
};

/**
 * Award Progression upon successful Workout completion
 * Only called by POST /api/workouts (Protected from duplicate execution)
 */
export const awardWorkoutProgression = async (userId, workout) => {
  const currentProgression = await getUserProgressionData(userId);

  const prevXP = currentProgression.xp;
  const prevLevel = currentProgression.level;
  const prevRank = currentProgression.rank;
  const prevStreak = currentProgression.currentStreak;

  // 1. Award +100 XP and aggregate training metrics
  const newXP = prevXP + WORKOUT_XP_REWARD;
  const newTotalWorkouts = (currentProgression.totalWorkouts || 0) + 1;
  const newTotalMinutes =
    (currentProgression.totalDurationMinutes || 0) + (Number(workout.duration) || 0);
  const newTotalCalories =
    (currentProgression.totalCaloriesBurned || 0) + (Number(workout.caloriesBurned) || 0);

  // 2. Compute new Level & Rank
  const levelStats = calculateLevelFromXP(newXP);
  const rankInfo = getRankForLevel(levelStats.level);

  // 3. Compute Streak
  const streakResult = evaluateStreak(
    currentProgression.lastWorkoutDate,
    workout.workoutDate || new Date(),
    currentProgression.currentStreak,
    currentProgression.longestStreak
  );

  // 4. Construct Progression Events
  const newEvents = [];

  // Primary Workout Complete Event
  newEvents.push({
    type: 'WORKOUT_COMPLETED',
    title: 'TRAINING QUEST COMPLETED',
    description: `+${WORKOUT_XP_REWARD} XP gained from ${workout.activityType} (${workout.duration}m)`,
    xpGained: WORKOUT_XP_REWARD,
    timestamp: new Date(),
  });

  // Level Up Event
  if (levelStats.level > prevLevel) {
    newEvents.push({
      type: 'LEVEL_UP',
      title: 'ASCENSION LEVEL UP!',
      description: `Ascended to Level ${levelStats.level}! Energy capacity expanded.`,
      newLevel: levelStats.level,
      timestamp: new Date(),
    });
  }

  // Rank Promotion Event
  if (rankInfo.rank !== prevRank) {
    newEvents.push({
      type: 'RANK_UP',
      title: 'HUNTER RANK PROMOTION!',
      description: `Promoted to Rank ${rankInfo.rank} — ${rankInfo.rankTitle}!`,
      newRank: rankInfo.rank,
      timestamp: new Date(),
    });
  }

  // Streak Updated Event
  if (streakResult.streakUpdated && streakResult.currentStreak > 1) {
    newEvents.push({
      type: 'STREAK_UPDATED',
      title: 'ASCENSION STREAK EXTENDED!',
      description: `${streakResult.currentStreak} Day Workout Streak Active! Keep the fire burning.`,
      streak: streakResult.currentStreak,
      timestamp: new Date(),
    });
  }

  // 5. Persist updates
  const updatePayload = {
    xp: newXP,
    level: levelStats.level,
    rank: rankInfo.rank,
    rankTitle: rankInfo.rankTitle,
    currentStreak: streakResult.currentStreak,
    longestStreak: streakResult.longestStreak,
    lastWorkoutDate: streakResult.lastWorkoutDate,
    totalWorkouts: newTotalWorkouts,
    totalDurationMinutes: newTotalMinutes,
    totalCaloriesBurned: newTotalCalories,
  };

  let updatedProgression;

  if (isMongoConnected()) {
    updatedProgression = await Progression.findOneAndUpdate(
      { user: userId },
      {
        $set: updatePayload,
        $push: {
          events: {
            $each: newEvents,
            $position: 0,
            $slice: 20,
          },
        },
      },
      { new: true, upsert: true }
    );
  } else {
    await saveDevProgression(userId, updatePayload);
    for (const evt of newEvents.reverse()) {
      await addDevProgressionEvent(userId, evt);
    }
  }

  const finalState = await getUserProgressionData(userId);

  return {
    progression: finalState,
    newEvents,
  };
};

/**
 * Award Progression upon newly completed Quests (Stage 8)
 * Only called when a quest state transitions from completed === false to true
 * Daily quest: +25 XP
 * Weekly quest: +100 XP
 * 
 * @param {string} userId
 * @param {Array} newlyCompletedQuests - Array of quest objects that transitioned to complete
 * @returns {Promise<{ progression: Object, newEvents: Array }>}
 */
export const awardQuestProgression = async (userId, newlyCompletedQuests = []) => {
  const currentProgression = await getUserProgressionData(userId);

  if (!newlyCompletedQuests || newlyCompletedQuests.length === 0) {
    return {
      progression: currentProgression,
      newEvents: [],
    };
  }

  const prevXP = currentProgression.xp;
  const prevLevel = currentProgression.level;
  const prevRank = currentProgression.rank;

  let totalQuestXP = 0;
  const newEvents = [];

  for (const quest of newlyCompletedQuests) {
    const xpReward = Number(quest.xp) || (quest.type === 'WEEKLY' ? 100 : 25);
    totalQuestXP += xpReward;

    newEvents.push({
      type: 'QUEST_COMPLETED',
      title: `QUEST COMPLETED: ${quest.title}`,
      description: `+${xpReward} XP • Completed ${quest.type.toLowerCase()} mission "${quest.title}"`,
      xpGained: xpReward,
      questId: quest.id,
      recordValue: quest.target,
      recordUnit: quest.unit || quest.metric,
      periodType: quest.type,
      timestamp: new Date(),
    });
  }

  const newXP = prevXP + totalQuestXP;
  const levelStats = calculateLevelFromXP(newXP);
  const rankInfo = getRankForLevel(levelStats.level);

  // Level Up Event
  if (levelStats.level > prevLevel) {
    newEvents.push({
      type: 'LEVEL_UP',
      title: 'ASCENSION LEVEL UP!',
      description: `Ascended to Level ${levelStats.level}! Energy capacity expanded.`,
      newLevel: levelStats.level,
      timestamp: new Date(),
    });
  }

  // Rank Promotion Event
  if (rankInfo.rank !== prevRank) {
    newEvents.push({
      type: 'RANK_UP',
      title: 'HUNTER RANK PROMOTION!',
      description: `Promoted to Rank ${rankInfo.rank} — ${rankInfo.rankTitle}!`,
      newRank: rankInfo.rank,
      timestamp: new Date(),
    });
  }

  const updatePayload = {
    xp: newXP,
    level: levelStats.level,
    rank: rankInfo.rank,
    rankTitle: rankInfo.rankTitle,
  };

  if (isMongoConnected()) {
    await Progression.findOneAndUpdate(
      { user: userId },
      {
        $set: updatePayload,
        $push: {
          events: {
            $each: newEvents,
            $position: 0,
            $slice: 20,
          },
        },
      },
      { new: true, upsert: true }
    );
  } else {
    await saveDevProgression(userId, updatePayload);
    for (const evt of [...newEvents].reverse()) {
      await addDevProgressionEvent(userId, evt);
    }
  }

  const finalState = await getUserProgressionData(userId);

  return {
    progression: finalState,
    newEvents,
  };
};

/**
 * Award Progression upon newly unlocked Achievements (Stage 9)
 * Only called when an achievement transitions from locked to unlocked
 * 
 * @param {string} userId
 * @param {Array} newlyUnlockedAchievements - Array of achievement objects
 * @returns {Promise<{ progression: Object, newEvents: Array }>}
 */
export const awardAchievementProgression = async (userId, newlyUnlockedAchievements = []) => {
  const currentProgression = await getUserProgressionData(userId);

  if (!newlyUnlockedAchievements || newlyUnlockedAchievements.length === 0) {
    return {
      progression: currentProgression,
      newEvents: [],
    };
  }

  const prevXP = currentProgression.xp;
  const prevLevel = currentProgression.level;
  const prevRank = currentProgression.rank;

  let totalAchievementXP = 0;
  const newEvents = [];

  for (const achievement of newlyUnlockedAchievements) {
    const xpReward = Number(achievement.xp) || 50;
    totalAchievementXP += xpReward;

    newEvents.push({
      type: 'ACHIEVEMENT_UNLOCKED',
      title: `ACHIEVEMENT UNLOCKED: ${achievement.title}`,
      description: `+${xpReward} XP • ${achievement.description}`,
      xpGained: xpReward,
      achievementId: achievement.id,
      recordValue: achievement.target,
      recordUnit: achievement.unit,
      timestamp: new Date(),
    });
  }

  const newXP = prevXP + totalAchievementXP;
  const levelStats = calculateLevelFromXP(newXP);
  const rankInfo = getRankForLevel(levelStats.level);

  // Level Up Event
  if (levelStats.level > prevLevel) {
    newEvents.push({
      type: 'LEVEL_UP',
      title: 'ASCENSION LEVEL UP!',
      description: `Ascended to Level ${levelStats.level}! Energy capacity expanded.`,
      newLevel: levelStats.level,
      timestamp: new Date(),
    });
  }

  // Rank Promotion Event
  if (rankInfo.rank !== prevRank) {
    newEvents.push({
      type: 'RANK_UP',
      title: 'HUNTER RANK PROMOTION!',
      description: `Promoted to Rank ${rankInfo.rank} — ${rankInfo.rankTitle}!`,
      newRank: rankInfo.rank,
      timestamp: new Date(),
    });
  }

  const updatePayload = {
    xp: newXP,
    level: levelStats.level,
    rank: rankInfo.rank,
    rankTitle: rankInfo.rankTitle,
  };

  if (isMongoConnected()) {
    await Progression.findOneAndUpdate(
      { user: userId },
      {
        $set: updatePayload,
        $push: {
          events: {
            $each: newEvents,
            $position: 0,
            $slice: 20,
          },
        },
      },
      { new: true, upsert: true }
    );
  } else {
    await saveDevProgression(userId, updatePayload);
    for (const evt of [...newEvents].reverse()) {
      await addDevProgressionEvent(userId, evt);
    }
  }

  const finalState = await getUserProgressionData(userId);

  return {
    progression: finalState,
    newEvents,
  };
};

export default {
  WORKOUT_XP_REWARD,
  calculateLevelFromXP,
  getRankForLevel,
  evaluateStreak,
  getUserProgressionData,
  awardWorkoutProgression,
  awardQuestProgression,
  awardAchievementProgression,
};
