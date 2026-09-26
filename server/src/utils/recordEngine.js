import Workout from '../models/Workout.js';
import Progression from '../models/Progression.js';
import {
  isMongoConnected,
  getDevWorkouts,
  getDevProgression,
} from './devStore.js';
import { getUserProgressionData } from './progressionEngine.js';

/**
 * Helper to compute UTC Monday–Sunday week boundaries for a given date
 * @param {Date|string} dateInput
 * @returns {{ key: string, start: string, end: string }}
 */
export const getMondaySundayWeekBounds = (dateInput) => {
  const d = new Date(dateInput || Date.now());
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();
  const dayOfWeek = d.getUTCDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday

  // Calculate days to subtract to get to the preceding Monday
  // If Sunday (0), subtract 6 days. If Monday (1), subtract 0 days.
  const daysToMonday = (dayOfWeek + 6) % 7;
  const mondayDate = new Date(Date.UTC(year, month, day - daysToMonday));
  const sundayDate = new Date(Date.UTC(mondayDate.getUTCFullYear(), mondayDate.getUTCMonth(), mondayDate.getUTCDate() + 6));

  const toISODate = (dt) => {
    return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
  };

  const start = toISODate(mondayDate);
  const end = toISODate(sundayDate);
  return {
    key: `${start}_${end}`,
    start,
    end,
  };
};

/**
 * Pure calculation function: computes all personal records from real workout records
 * @param {Array} workouts - List of user workout documents / objects
 * @param {Object|null} progression - Stage 6 progression data (for streaks)
 * @returns {Object} Calculated Personal Record Matrix
 */
export const calculatePersonalRecords = (workouts = [], progression = null) => {
  if (!workouts || workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalActiveMinutes: 0,
      totalCaloriesBurned: 0,
      longestWorkout: null,
      highestCalories: null,
      mostActiveWeek: null,
      currentStreak: progression?.currentStreak || 0,
      longestStreak: progression?.longestStreak || 0,
      hasRecords: false,
    };
  }

  const totalWorkouts = workouts.length;
  let totalActiveMinutes = 0;
  let totalCaloriesBurned = 0;

  let maxDurationWorkout = null;
  let maxCalorieWorkout = null;
  const weekMap = {};

  for (const w of workouts) {
    const dur = Number(w.duration) || 0;
    const cal = Number(w.caloriesBurned) || 0;

    totalActiveMinutes += dur;
    totalCaloriesBurned += cal;

    // Evaluate longest duration
    if (!maxDurationWorkout || dur > (Number(maxDurationWorkout.duration) || 0)) {
      maxDurationWorkout = w;
    }

    // Evaluate highest calories
    if (!maxCalorieWorkout || cal > (Number(maxCalorieWorkout.caloriesBurned) || 0)) {
      maxCalorieWorkout = w;
    }

    // Weekly distribution (Monday–Sunday)
    const wDate = new Date(w.workoutDate || w.createdAt || Date.now());
    const bounds = getMondaySundayWeekBounds(wDate);
    if (!weekMap[bounds.key]) {
      weekMap[bounds.key] = {
        count: 0,
        start: bounds.start,
        end: bounds.end,
      };
    }
    weekMap[bounds.key].count += 1;
  }

  // Find most active week
  let peakWeek = null;
  for (const key of Object.keys(weekMap)) {
    if (!peakWeek || weekMap[key].count > peakWeek.count) {
      peakWeek = weekMap[key];
    }
  }

  const longestWorkout = maxDurationWorkout && Number(maxDurationWorkout.duration) > 0 ? {
    value: Number(maxDurationWorkout.duration),
    unit: 'minutes',
    workoutId: maxDurationWorkout._id?.toString() || null,
    activityType: maxDurationWorkout.activityType,
    workoutDate: maxDurationWorkout.workoutDate || maxDurationWorkout.createdAt,
  } : null;

  const highestCalories = maxCalorieWorkout && Number(maxCalorieWorkout.caloriesBurned) > 0 ? {
    value: Number(maxCalorieWorkout.caloriesBurned),
    unit: 'kcal',
    workoutId: maxCalorieWorkout._id?.toString() || null,
    activityType: maxCalorieWorkout.activityType,
    workoutDate: maxCalorieWorkout.workoutDate || maxCalorieWorkout.createdAt,
  } : null;

  const mostActiveWeek = peakWeek && peakWeek.count > 0 ? {
    count: peakWeek.count,
    start: peakWeek.start,
    end: peakWeek.end,
  } : null;

  return {
    totalWorkouts,
    totalActiveMinutes,
    totalCaloriesBurned,
    longestWorkout,
    highestCalories,
    mostActiveWeek,
    currentStreak: progression?.currentStreak || 0,
    longestStreak: progression?.longestStreak || 0,
    hasRecords: true,
  };
};

/**
 * Detect record-breaking events when a new workout is created
 * Compares the new workout against previous workouts dataset
 * @param {Array} existingWorkouts - User's existing workouts before this creation
 * @param {Object} newWorkout - The newly created workout object
 * @returns {Array} Array of record-breaking event objects (0 or more)
 */
export const detectRecordBreakingEvents = (existingWorkouts = [], newWorkout) => {
  const previousRecords = calculatePersonalRecords(existingWorkouts, null);
  const newEvents = [];

  const newDuration = Number(newWorkout.duration) || 0;
  const newCalories = Number(newWorkout.caloriesBurned) || 0;

  // 1. Check Longest Workout record (strictly greater than previous peak)
  const prevDurationRecord = previousRecords.longestWorkout ? previousRecords.longestWorkout.value : 0;
  if (newDuration > prevDurationRecord && newDuration > 0) {
    newEvents.push({
      type: 'NEW_RECORD_LONGEST_WORKOUT',
      title: 'NEW RECORD: LONGEST WORKOUT',
      description: `New Personal Record: ${newDuration} min ${newWorkout.activityType} session!`,
      recordValue: newDuration,
      recordUnit: 'minutes',
      workoutId: newWorkout._id?.toString() || null,
      timestamp: new Date(),
    });
  }

  // 2. Check Highest Calories record (strictly greater than previous peak)
  const prevCalorieRecord = previousRecords.highestCalories ? previousRecords.highestCalories.value : 0;
  if (newCalories > prevCalorieRecord && newCalories > 0) {
    newEvents.push({
      type: 'NEW_RECORD_HIGHEST_CALORIES',
      title: 'NEW RECORD: HIGHEST CALORIES',
      description: `New Personal Record: ${newCalories.toLocaleString()} kcal burned in a single quest!`,
      recordValue: newCalories,
      recordUnit: 'kcal',
      workoutId: newWorkout._id?.toString() || null,
      timestamp: new Date(),
    });
  }

  // 3. Check Most Active Week record (strictly greater than previous peak week)
  const newWorkoutDate = new Date(newWorkout.workoutDate || newWorkout.createdAt || Date.now());
  const newWeekBounds = getMondaySundayWeekBounds(newWorkoutDate);

  let existingCountInNewWeek = 0;
  for (const w of existingWorkouts) {
    const wDate = new Date(w.workoutDate || w.createdAt || Date.now());
    const bounds = getMondaySundayWeekBounds(wDate);
    if (bounds.key === newWeekBounds.key) {
      existingCountInNewWeek += 1;
    }
  }

  const updatedWeekCount = existingCountInNewWeek + 1;
  const prevPeakWeekCount = previousRecords.mostActiveWeek ? previousRecords.mostActiveWeek.count : 0;

  if (updatedWeekCount > prevPeakWeekCount && updatedWeekCount > 0) {
    newEvents.push({
      type: 'NEW_RECORD_MOST_ACTIVE_WEEK',
      title: 'NEW RECORD: MOST ACTIVE WEEK',
      description: `Peak weekly volume record: ${updatedWeekCount} quests completed in week of ${newWeekBounds.start}!`,
      recordValue: updatedWeekCount,
      recordUnit: 'workouts',
      workoutId: newWorkout._id?.toString() || null,
      timestamp: new Date(),
    });
  }

  return newEvents;
};

/**
 * Retrieve User's Personal Record Matrix directly from database or devStore
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const getUserPersonalRecords = async (userId) => {
  let workouts = [];
  let progression = null;

  if (isMongoConnected()) {
    workouts = await Workout.find({ user: userId }).lean();
    progression = await getUserProgressionData(userId);
  } else {
    workouts = await getDevWorkouts(userId);
    progression = await getUserProgressionData(userId);
  }

  return calculatePersonalRecords(workouts, progression);
};

export default {
  getMondaySundayWeekBounds,
  calculatePersonalRecords,
  detectRecordBreakingEvents,
  getUserPersonalRecords,
};
