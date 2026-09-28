import FitnessGoal from '../models/FitnessGoal.js';
import Workout from '../models/Workout.js';
import HealthProfile from '../models/HealthProfile.js';
import {
  isMongoConnected,
  createDevGoal,
  getDevGoals,
  getDevGoalById,
  updateDevGoal,
  deleteDevGoal,
  getDevWorkouts,
  getDevHealthProfile,
} from './devStore.js';
import { getUserProgressionData } from './progressionEngine.js';
import { createNotification } from './notificationEngine.js';

const VALID_GOAL_TYPES = ['WEIGHT', 'WORKOUTS', 'MINUTES', 'CALORIES', 'STREAK', 'CUSTOM'];

/**
 * Helper to default standard units by goal type
 */
const getDefaultUnit = (type) => {
  switch (type) {
    case 'WORKOUTS':
      return 'workouts';
    case 'MINUTES':
      return 'min';
    case 'CALORIES':
      return 'kcal';
    case 'STREAK':
      return 'days';
    case 'WEIGHT':
      return 'kg';
    case 'CUSTOM':
    default:
      return 'units';
  }
};

/**
 * Pure function: calculates dynamic progress from real empirical telemetry
 * @param {Object} goal 
 * @param {Array} workouts 
 * @param {Object|null} progression 
 * @param {Object|null} healthProfile 
 * @returns {Object} { currentValue, progressPercentage, status, completedAt, metadata }
 */
export const calculateGoalProgress = (goal, workouts = [], progression = null, healthProfile = null) => {
  const target = Number(goal.targetValue) || 1;
  const start = new Date(goal.startDate).getTime();
  const end = new Date(goal.targetDate).getTime();
  const now = Date.now();

  let currentValue = Number(goal.currentValue) || 0;
  let progressPercentage = 0;
  let metadata = { ...(goal.metadata || {}) };

  // Filter workouts falling within the goal's specific calendar window
  const periodWorkouts = workouts.filter((w) => {
    const t = new Date(w.workoutDate || w.createdAt).getTime();
    return t >= start && t <= end;
  });

  switch (goal.type) {
    case 'WORKOUTS': {
      currentValue = periodWorkouts.length;
      progressPercentage = Math.min(100, Math.max(0, Math.round((currentValue / target) * 100)));
      metadata.dataSource = `Empirical workouts in window: ${periodWorkouts.length} logged`;
      break;
    }
    case 'MINUTES': {
      currentValue = periodWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
      progressPercentage = Math.min(100, Math.max(0, Math.round((currentValue / target) * 100)));
      metadata.dataSource = `Empirical active minutes in window: ${currentValue} min`;
      break;
    }
    case 'CALORIES': {
      currentValue = periodWorkouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);
      progressPercentage = Math.min(100, Math.max(0, Math.round((currentValue / target) * 100)));
      metadata.dataSource = `Empirical calories burned in window: ${currentValue} kcal`;
      break;
    }
    case 'STREAK': {
      currentValue = progression?.currentStreak || 0;
      progressPercentage = Math.min(100, Math.max(0, Math.round((currentValue / target) * 100)));
      metadata.dataSource = `Current Stage 6 streak telemetry: ${currentValue} days`;
      break;
    }
    case 'WEIGHT': {
      const latestWeight = healthProfile?.latestBMI?.weightKg;
      if (!latestWeight) {
        currentValue = 0;
        progressPercentage = 0;
        metadata.dataSource = 'Health Profile Status: INSUFFICIENT_DATA (No scan on record)';
      } else {
        currentValue = latestWeight;
        const initial = Number(goal.initialValue) || latestWeight;

        if (initial === target) {
          progressPercentage = latestWeight === target ? 100 : 0;
        } else if (target < initial) {
          // Weight loss mission
          const diff = initial - latestWeight;
          const totalRequired = initial - target;
          progressPercentage = Math.min(100, Math.max(0, Math.round((diff / totalRequired) * 100)));
        } else {
          // Weight gain / muscle mass mission
          const diff = latestWeight - initial;
          const totalRequired = target - initial;
          progressPercentage = Math.min(100, Math.max(0, Math.round((diff / totalRequired) * 100)));
        }
        metadata.dataSource = `Latest scan: ${latestWeight} kg (Initial baseline: ${initial} kg)`;
      }
      break;
    }
    case 'CUSTOM':
    default: {
      currentValue = Number(goal.currentValue) || 0;
      progressPercentage = Math.min(100, Math.max(0, Math.round((currentValue / target) * 100)));
      metadata.dataSource = 'User-reported custom progress';
      break;
    }
  }

  // Determine status and completion/expiration state
  let status = goal.status || 'ACTIVE';
  let completedAt = goal.completedAt || null;

  if (progressPercentage >= 100) {
    status = 'COMPLETED';
    completedAt = completedAt || new Date();
  } else if (status === 'ACTIVE' && now > end) {
    status = 'EXPIRED';
  }

  return {
    currentValue,
    progressPercentage,
    status,
    completedAt,
    metadata,
  };
};

/**
 * Create a new personal fitness goal / mission
 * @param {string} userId 
 * @param {Object} goalData 
 * @returns {Promise<Object>}
 */
export const createGoal = async (userId, goalData) => {
  const {
    title,
    description = '',
    type,
    targetValue,
    initialValue,
    unit,
    startDate = new Date(),
    targetDate,
  } = goalData;

  // Validation
  if (!title || !title.trim()) {
    throw new Error('Mission title is required.');
  }

  if (!type || !VALID_GOAL_TYPES.includes(type)) {
    throw new Error(`Valid mission type required (${VALID_GOAL_TYPES.join(', ')}).`);
  }

  const numTarget = Number(targetValue);
  if (!targetValue || isNaN(numTarget) || numTarget <= 0) {
    throw new Error('Target value must be a positive number greater than 0.');
  }

  const parsedStart = startDate ? new Date(startDate) : new Date();
  const parsedTarget = new Date(targetDate);

  if (isNaN(parsedTarget.getTime())) {
    throw new Error('A valid target deadline date is required.');
  }

  if (parsedTarget.getTime() < parsedStart.getTime()) {
    throw new Error('Target deadline date cannot precede the start date.');
  }

  const resolvedUnit = unit && unit.trim() ? unit.trim() : getDefaultUnit(type);

  // Fetch initial baseline telemetry
  let workouts = [];
  let healthProfile = null;
  let progression = null;

  if (isMongoConnected()) {
    workouts = await Workout.find({ user: userId }).lean();
    healthProfile = await HealthProfile.findOne({ user: userId }).lean();
    progression = await getUserProgressionData(userId);
  } else {
    workouts = await getDevWorkouts(userId);
    healthProfile = await getDevHealthProfile(userId);
    progression = await getUserProgressionData(userId);
  }

  let resolvedInitial = Number(initialValue) || 0;
  if (type === 'WEIGHT' && !resolvedInitial && healthProfile?.latestBMI?.weightKg) {
    resolvedInitial = healthProfile.latestBMI.weightKg;
  }

  const initialDraft = {
    title: title.trim(),
    description: description.trim(),
    type,
    targetValue: numTarget,
    currentValue: 0,
    initialValue: resolvedInitial,
    unit: resolvedUnit,
    startDate: parsedStart,
    targetDate: parsedTarget,
    status: 'ACTIVE',
    metadata: {},
  };

  const calculated = calculateGoalProgress(initialDraft, workouts, progression, healthProfile);

  const payload = {
    ...initialDraft,
    ...calculated,
  };

  if (isMongoConnected()) {
    const created = await FitnessGoal.create({
      user: userId,
      ...payload,
    });
    return created.toObject();
  } else {
    return await createDevGoal({
      userId,
      ...payload,
    });
  }
};

/**
 * Retrieve all goals for authenticated warrior with dynamic progress synchronization
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export const getUserGoals = async (userId) => {
  let goals = [];
  let workouts = [];
  let healthProfile = null;
  let progression = null;

  if (isMongoConnected()) {
    goals = await FitnessGoal.find({ user: userId }).sort({ createdAt: -1 }).lean();
    workouts = await Workout.find({ user: userId }).lean();
    healthProfile = await HealthProfile.findOne({ user: userId }).lean();
    progression = await getUserProgressionData(userId);
  } else {
    goals = await getDevGoals(userId);
    workouts = await getDevWorkouts(userId);
    healthProfile = await getDevHealthProfile(userId);
    progression = await getUserProgressionData(userId);
  }

  const updatedGoals = [];

  for (const g of goals) {
    const calculated = calculateGoalProgress(g, workouts, progression, healthProfile);

    // If goal status transitioned to COMPLETED during this check, trigger Stage 11 notification
    if (g.status === 'ACTIVE' && calculated.status === 'COMPLETED') {
      try {
        await createNotification(userId, {
          type: 'QUEST_COMPLETED',
          title: `MISSION COMPLETE: ${g.title.toUpperCase()}`,
          message: `Mission objective achieved! You reached ${g.targetValue} ${g.unit || ''} for "${g.title}".`,
          priority: 'HIGH',
          dedupKey: `goal-completed:${g._id.toString()}`,
          metadata: { goalId: g._id.toString(), type: g.type },
        });
      } catch (notifErr) {
        console.error(`[GOAL_COMPLETION_NOTIF ERROR] ${notifErr.message}`);
      }
    }

    // Persist changes if progress, status, or values shifted
    const hasChanged =
      g.currentValue !== calculated.currentValue ||
      g.progressPercentage !== calculated.progressPercentage ||
      g.status !== calculated.status;

    if (hasChanged) {
      if (isMongoConnected()) {
        await FitnessGoal.updateOne({ _id: g._id }, { $set: calculated });
      } else {
        await updateDevGoal(g._id, userId, calculated);
      }
    }

    updatedGoals.push({
      ...g,
      ...calculated,
    });
  }

  return updatedGoals;
};

/**
 * Retrieve single goal by ID with refreshed progress
 * @param {string} userId 
 * @param {string} goalId 
 * @returns {Promise<Object|null>}
 */
export const getGoalById = async (userId, goalId) => {
  let goal = null;
  let workouts = [];
  let healthProfile = null;
  let progression = null;

  if (isMongoConnected()) {
    goal = await FitnessGoal.findOne({ _id: goalId, user: userId }).lean();
    workouts = await Workout.find({ user: userId }).lean();
    healthProfile = await HealthProfile.findOne({ user: userId }).lean();
    progression = await getUserProgressionData(userId);
  } else {
    goal = await getDevGoalById(goalId, userId);
    workouts = await getDevWorkouts(userId);
    healthProfile = await getDevHealthProfile(userId);
    progression = await getUserProgressionData(userId);
  }

  if (!goal) return null;

  const calculated = calculateGoalProgress(goal, workouts, progression, healthProfile);

  if (
    goal.currentValue !== calculated.currentValue ||
    goal.progressPercentage !== calculated.progressPercentage ||
    goal.status !== calculated.status
  ) {
    if (isMongoConnected()) {
      await FitnessGoal.updateOne({ _id: goal._id }, { $set: calculated });
    } else {
      await updateDevGoal(goal._id, userId, calculated);
    }
  }

  return {
    ...goal,
    ...calculated,
  };
};

/**
 * Update goal configuration details
 * @param {string} userId 
 * @param {string} goalId 
 * @param {Object} updates 
 * @returns {Promise<Object|null>}
 */
export const updateGoal = async (userId, goalId, updates) => {
  const allowed = ['title', 'description', 'targetValue', 'targetDate', 'status', 'unit'];
  const safeUpdates = {};

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      safeUpdates[key] = updates[key];
    }
  }

  if (safeUpdates.targetValue !== undefined) {
    const val = Number(safeUpdates.targetValue);
    if (isNaN(val) || val <= 0) {
      throw new Error('Target value must be greater than 0.');
    }
    safeUpdates.targetValue = val;
  }

  if (safeUpdates.targetDate !== undefined) {
    const d = new Date(safeUpdates.targetDate);
    if (isNaN(d.getTime())) {
      throw new Error('Target deadline date is invalid.');
    }
    safeUpdates.targetDate = d;
  }

  let goal = null;
  if (isMongoConnected()) {
    goal = await FitnessGoal.findOneAndUpdate(
      { _id: goalId, user: userId },
      { $set: safeUpdates },
      { new: true }
    ).lean();
  } else {
    goal = await updateDevGoal(goalId, userId, safeUpdates);
  }

  if (!goal) return null;

  // Re-synchronize progress after update
  return await getGoalById(userId, goalId);
};

/**
 * Delete a goal (strictly user-scoped)
 * @param {string} userId 
 * @param {string} goalId 
 * @returns {Promise<boolean>}
 */
export const deleteGoal = async (userId, goalId) => {
  if (isMongoConnected()) {
    const res = await FitnessGoal.deleteOne({ _id: goalId, user: userId });
    return res.deletedCount > 0;
  } else {
    return await deleteDevGoal(goalId, userId);
  }
};

/**
 * Manually update progress for CUSTOM goals
 * @param {string} userId 
 * @param {string} goalId 
 * @param {number} value 
 * @returns {Promise<Object|null>}
 */
export const updateCustomGoalProgress = async (userId, goalId, value) => {
  const goal = await getGoalById(userId, goalId);
  if (!goal) return null;

  if (goal.type !== 'CUSTOM') {
    throw new Error('Manual progress updates are restricted to CUSTOM mission types. Measurable missions compute progress from empirical telemetry.');
  }

  const numVal = Number(value);
  if (isNaN(numVal) || numVal < 0) {
    throw new Error('Progress value must be 0 or a positive number.');
  }

  const target = Number(goal.targetValue) || 1;
  const progressPercentage = Math.min(100, Math.max(0, Math.round((numVal / target) * 100)));
  const isCompleted = progressPercentage >= 100;

  const updates = {
    currentValue: numVal,
    progressPercentage,
    status: isCompleted ? 'COMPLETED' : (goal.status === 'EXPIRED' ? 'EXPIRED' : 'ACTIVE'),
    completedAt: isCompleted ? (goal.completedAt || new Date()) : null,
  };

  if (isMongoConnected()) {
    await FitnessGoal.updateOne({ _id: goalId, user: userId }, { $set: updates });
  } else {
    await updateDevGoal(goalId, userId, updates);
  }

  if (isCompleted && goal.status !== 'COMPLETED') {
    try {
      await createNotification(userId, {
        type: 'QUEST_COMPLETED',
        title: `MISSION COMPLETE: ${goal.title.toUpperCase()}`,
        message: `Custom mission target achieved! You reached ${numVal} ${goal.unit || ''} for "${goal.title}".`,
        priority: 'HIGH',
        dedupKey: `goal-completed:${goalId}`,
        metadata: { goalId, type: 'CUSTOM' },
      });
    } catch (notifErr) {
      console.error(`[CUSTOM_GOAL_NOTIF ERROR] ${notifErr.message}`);
    }
  }

  return await getGoalById(userId, goalId);
};

export default {
  calculateGoalProgress,
  createGoal,
  getUserGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  updateCustomGoalProgress,
};
