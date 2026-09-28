import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * ⚡ F-TRACK TEMPORARY DEVELOPMENT STORE
 * 
 * Provides an isolated, in-memory fallback during development when MongoDB
 * Atlas / local MongoDB is not yet running (econnrefused).
 * 
 * When MongoDB connects (readyState === 1), all operations automatically bypass
 * this fallback and utilize the real Mongoose models.
 * 
 * This file is purely for development testing and requires zero configuration.
 */

// In-Memory Collections (Isolated per server process, zero file persistence)
const devUsers = [];
const devWorkouts = [];
const devQuestProgress = [];
const devAchievements = [];
const devNotifications = [];
const devGoals = [];
const devPurposes = [];
const devReflections = [];
const devTrainingPlans = [];
const devWeeklyReflections = [];
const devLifeContexts = [];

/**
 * Check if real MongoDB is actively connected
 */
export const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

/* ─────────────────────────────────────────────────────────────
   USER FALLBACK OPERATIONS
───────────────────────────────────────────────────────────── */

export const findDevUserByEmail = async (email) => {
  const normalized = email.toLowerCase().trim();
  const user = devUsers.find((u) => u.email.toLowerCase() === normalized);
  if (!user) return null;

  return {
    ...user,
    matchPassword: async (enteredPassword) => {
      return await bcrypt.compare(enteredPassword, user.password);
    },
  };
};

export const findDevUserById = async (id) => {
  const user = devUsers.find((u) => u._id.toString() === id.toString());
  if (!user) return null;

  const { password, ...safeUser } = user;
  return safeUser;
};

export const createDevUser = async ({ name, email, password }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    _id: `dev_user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  devUsers.push(newUser);

  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
  };
};

/* ─────────────────────────────────────────────────────────────
   WORKOUT FALLBACK OPERATIONS
───────────────────────────────────────────────────────────── */

export const getDevWorkouts = async (userId) => {
  return devWorkouts
    .filter((w) => w.user && w.user.toString() === userId.toString())
    .sort((a, b) => new Date(b.workoutDate) - new Date(a.workoutDate));
};

export const getDevWorkoutById = async (id, userId) => {
  return devWorkouts.find(
    (w) => w._id.toString() === id.toString() && w.user.toString() === userId.toString()
  ) || null;
};

export const createDevWorkout = async ({
  userId,
  activityType,
  duration,
  caloriesBurned,
  workoutDate,
  notes,
}) => {
  const newWorkout = {
    _id: `dev_quest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user: userId,
    activityType,
    duration: Number(duration),
    caloriesBurned: Number(caloriesBurned),
    workoutDate: workoutDate ? new Date(workoutDate) : new Date(),
    notes: notes ? notes.trim() : '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  devWorkouts.push(newWorkout);
  return newWorkout;
};

export const updateDevWorkout = async (id, userId, updates) => {
  const index = devWorkouts.findIndex(
    (w) => w._id.toString() === id.toString() && w.user.toString() === userId.toString()
  );

  if (index === -1) return null;

  const current = devWorkouts[index];
  const updated = {
    ...current,
    activityType: updates.activityType ?? current.activityType,
    duration: updates.duration !== undefined ? Number(updates.duration) : current.duration,
    caloriesBurned: updates.caloriesBurned !== undefined ? Number(updates.caloriesBurned) : current.caloriesBurned,
    workoutDate: updates.workoutDate ? new Date(updates.workoutDate) : current.workoutDate,
    notes: updates.notes !== undefined ? updates.notes.trim() : current.notes,
    updatedAt: new Date(),
  };

  devWorkouts[index] = updated;
  return updated;
};

export const deleteDevWorkout = async (id, userId) => {
  const index = devWorkouts.findIndex(
    (w) => w._id.toString() === id.toString() && w.user.toString() === userId.toString()
  );

  if (index === -1) return false;

  devWorkouts.splice(index, 1);
  return true;
};

/* ─────────────────────────────────────────────────────────────
   HEALTH PROFILE FALLBACK OPERATIONS
───────────────────────────────────────────────────────────── */

const devHealthProfiles = {};

export const getDevHealthProfile = async (userId) => {
  const key = userId.toString();
  return devHealthProfiles[key] || null;
};

export const saveDevBMI = async (userId, bmiData) => {
  const key = userId.toString();
  if (!devHealthProfiles[key]) {
    devHealthProfiles[key] = { user: userId };
  }
  devHealthProfiles[key].latestBMI = {
    ...bmiData,
    calculatedAt: new Date(),
  };
  return devHealthProfiles[key];
};

export const saveDevCalories = async (userId, calorieData) => {
  const key = userId.toString();
  if (!devHealthProfiles[key]) {
    devHealthProfiles[key] = { user: userId };
  }
  devHealthProfiles[key].latestCalories = {
    ...calorieData,
    calculatedAt: new Date(),
  };
  return devHealthProfiles[key];
};

/* ─────────────────────────────────────────────────────────────
   PROGRESSION FALLBACK OPERATIONS (Stage 6)
───────────────────────────────────────────────────────────── */

const devProgressions = {};

export const getDevProgression = async (userId) => {
  const key = userId.toString();
  if (!devProgressions[key]) {
    // Initialize default progression state
    devProgressions[key] = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // If user already had dev workouts logged, backfill initial progression
    const userWorkouts = devWorkouts.filter((w) => w.user.toString() === key);
    if (userWorkouts.length > 0) {
      const sorted = [...userWorkouts].sort((a, b) => new Date(a.workoutDate) - new Date(b.workoutDate));
      let totalXP = 0;
      let totalMinutes = 0;
      let totalCalories = 0;
      let streak = 0;
      let longest = 0;
      let lastDate = null;

      for (const w of sorted) {
        totalXP += 100;
        totalMinutes += Number(w.duration) || 0;
        totalCalories += Number(w.caloriesBurned) || 0;

        const wDate = new Date(w.workoutDate || w.createdAt);
        if (!lastDate) {
          streak = 1;
          longest = 1;
          lastDate = wDate;
        } else {
          const toDay = (d) => `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
          if (toDay(wDate) !== toDay(lastDate)) {
            const diff = Math.round((wDate - lastDate) / (1000 * 60 * 60 * 24));
            if (diff === 1) {
              streak += 1;
            } else if (diff > 1) {
              streak = 1;
            }
            longest = Math.max(longest, streak);
            lastDate = wDate;
          }
        }
      }

      // Calculate level from totalXP
      const level = Math.max(1, Math.floor((1 + Math.sqrt(1 + 0.08 * totalXP)) / 2));
      let rank = 'E';
      let rankTitle = 'AWAKENING';
      if (level >= 51) { rank = 'S'; rankTitle = 'TRANSCENDENT'; }
      else if (level >= 36) { rank = 'A'; rankTitle = 'ASCENDANT'; }
      else if (level >= 21) { rank = 'B'; rankTitle = 'ELITE'; }
      else if (level >= 11) { rank = 'C'; rankTitle = 'WARRIOR'; }
      else if (level >= 8) { rank = 'D'; rankTitle = 'INITIATE'; }
      else { rank = 'E'; rankTitle = 'AWAKENING'; }

      devProgressions[key] = {
        ...devProgressions[key],
        xp: totalXP,
        level,
        rank,
        rankTitle,
        currentStreak: streak,
        longestStreak: longest,
        lastWorkoutDate: lastDate,
        totalWorkouts: userWorkouts.length,
        totalDurationMinutes: totalMinutes,
        totalCaloriesBurned: totalCalories,
      };
    }
  }

  return devProgressions[key];
};

export const saveDevProgression = async (userId, updates) => {
  const current = await getDevProgression(userId);
  const key = userId.toString();
  devProgressions[key] = {
    ...current,
    ...updates,
    updatedAt: new Date(),
  };
  return devProgressions[key];
};

export const addDevProgressionEvent = async (userId, event) => {
  const current = await getDevProgression(userId);
  const key = userId.toString();
  const eventObj = {
    ...event,
    timestamp: event.timestamp || new Date(),
  };
  const updatedEvents = [eventObj, ...(current.events || [])].slice(0, 20);
  devProgressions[key] = {
    ...current,
    events: updatedEvents,
    updatedAt: new Date(),
  };
  return devProgressions[key];
};

/* ─────────────────────────────────────────────────────────────
   QUEST PROGRESS FALLBACK OPERATIONS
───────────────────────────────────────────────────────────── */

export const getDevQuestProgress = async (userId, questId, periodStart) => {
  const pStartTime = new Date(periodStart).getTime();
  return (
    devQuestProgress.find(
      (q) =>
        q.user.toString() === userId.toString() &&
        q.questId === questId &&
        new Date(q.periodStart).getTime() === pStartTime
    ) || null
  );
};

export const getUserDevQuestProgressList = async (userId, periodStart = null) => {
  return devQuestProgress.filter((q) => {
    const userMatch = q.user.toString() === userId.toString();
    if (!userMatch) return false;
    if (periodStart) {
      return new Date(q.periodStart).getTime() === new Date(periodStart).getTime();
    }
    return true;
  });
};

export const upsertDevQuestProgress = async (userId, questData) => {
  const { questId, periodType, periodStart, periodEnd, currentValue, targetValue, completed, completedAt } = questData;
  const pStartTime = new Date(periodStart).getTime();
  
  const existingIndex = devQuestProgress.findIndex(
    (q) =>
      q.user.toString() === userId.toString() &&
      q.questId === questId &&
      new Date(q.periodStart).getTime() === pStartTime
  );

  if (existingIndex >= 0) {
    devQuestProgress[existingIndex] = {
      ...devQuestProgress[existingIndex],
      currentValue,
      targetValue,
      completed,
      completedAt: completed ? (devQuestProgress[existingIndex].completedAt || completedAt || new Date()) : null,
      updatedAt: new Date(),
    };
    return devQuestProgress[existingIndex];
  } else {
    const newRecord = {
      _id: `dev_qp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user: userId.toString(),
      questId,
      periodType,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      currentValue,
      targetValue,
      completed: !!completed,
      completedAt: completed ? (completedAt || new Date()) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    devQuestProgress.push(newRecord);
    return newRecord;
  }
};

export const getDevQuestHistory = async (userId) => {
  return devQuestProgress
    .filter((q) => q.user.toString() === userId.toString() && q.completed)
    .sort((a, b) => new Date(b.completedAt || b.updatedAt) - new Date(a.completedAt || a.updatedAt));
};

/* ─────────────────────────────────────────────────────────────
   ACHIEVEMENT FALLBACK OPERATIONS
───────────────────────────────────────────────────────────── */

export const getDevAchievements = async (userId) => {
  return devAchievements.filter((a) => a.user.toString() === userId.toString());
};

export const getDevAchievement = async (userId, achievementId) => {
  return (
    devAchievements.find(
      (a) => a.user.toString() === userId.toString() && a.achievementId === achievementId
    ) || null
  );
};

export const upsertDevAchievement = async (userId, achievementData) => {
  const { achievementId, unlocked, unlockedAt, progressValue, targetValue, metadata } = achievementData;
  const existingIndex = devAchievements.findIndex(
    (a) => a.user.toString() === userId.toString() && a.achievementId === achievementId
  );

  if (existingIndex >= 0) {
    devAchievements[existingIndex] = {
      ...devAchievements[existingIndex],
      unlocked,
      unlockedAt: unlocked ? (devAchievements[existingIndex].unlockedAt || unlockedAt || new Date()) : null,
      progressValue,
      targetValue,
      metadata: metadata || devAchievements[existingIndex].metadata || {},
      updatedAt: new Date(),
    };
    return devAchievements[existingIndex];
  } else {
    const newRecord = {
      _id: `dev_ach_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user: userId.toString(),
      achievementId,
      unlocked: !!unlocked,
      unlockedAt: unlocked ? (unlockedAt || new Date()) : null,
      progressValue: Number(progressValue) || 0,
      targetValue: Number(targetValue) || 0,
      metadata: metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    devAchievements.push(newRecord);
    return newRecord;
  }
};

export const getDevAchievementHistory = async (userId) => {
  return devAchievements
    .filter((a) => a.user.toString() === userId.toString() && a.unlocked)
    .sort((a, b) => new Date(b.unlockedAt || b.updatedAt) - new Date(a.unlockedAt || a.updatedAt));
};

/* ─────────────────────────────────────────────────────────────
   NOTIFICATION FALLBACK OPERATIONS (Stage 11)
───────────────────────────────────────────────────────────── */

export const createDevNotification = async ({
  userId,
  type,
  title,
  message,
  priority = 'MEDIUM',
  dedupKey,
  metadata = {},
}) => {
  const existing = devNotifications.find(
    (n) => n.user.toString() === userId.toString() && n.dedupKey === dedupKey
  );
  if (existing) {
    return { notification: existing, created: false };
  }

  const newRecord = {
    _id: `dev_notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user: userId.toString(),
    type,
    title: title ? title.trim() : '',
    message: message ? message.trim() : '',
    priority,
    isRead: false,
    dedupKey,
    metadata: metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  devNotifications.push(newRecord);
  return { notification: newRecord, created: true };
};

export const getDevNotifications = async (userId) => {
  return devNotifications
    .filter((n) => n.user.toString() === userId.toString())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getDevUnreadNotificationCount = async (userId) => {
  return devNotifications.filter(
    (n) => n.user.toString() === userId.toString() && !n.isRead
  ).length;
};

export const markDevNotificationRead = async (id, userId) => {
  const notif = devNotifications.find(
    (n) => n._id.toString() === id.toString() && n.user.toString() === userId.toString()
  );
  if (!notif) return null;
  notif.isRead = true;
  notif.updatedAt = new Date();
  return notif;
};

export const markAllDevNotificationsRead = async (userId) => {
  let count = 0;
  devNotifications.forEach((n) => {
    if (n.user.toString() === userId.toString() && !n.isRead) {
      n.isRead = true;
      n.updatedAt = new Date();
      count++;
    }
  });
  return count;
};

/* ─────────────────────────────────────────────────────────────
   FITNESS GOALS FALLBACK OPERATIONS (Stage 13)
───────────────────────────────────────────────────────────── */

export const createDevGoal = async (goalData) => {
  const newGoal = {
    _id: `dev_goal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user: goalData.userId.toString(),
    title: goalData.title ? goalData.title.trim() : '',
    description: goalData.description ? goalData.description.trim() : '',
    type: goalData.type,
    targetValue: Number(goalData.targetValue),
    currentValue: Number(goalData.currentValue) || 0,
    initialValue: Number(goalData.initialValue) || 0,
    unit: goalData.unit ? goalData.unit.trim() : '',
    startDate: goalData.startDate ? new Date(goalData.startDate) : new Date(),
    targetDate: new Date(goalData.targetDate),
    status: goalData.status || 'ACTIVE',
    progressPercentage: Number(goalData.progressPercentage) || 0,
    completedAt: goalData.completedAt ? new Date(goalData.completedAt) : null,
    metadata: goalData.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  devGoals.push(newGoal);
  return newGoal;
};

export const getDevGoals = async (userId) => {
  return devGoals
    .filter((g) => g.user.toString() === userId.toString())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getDevGoalById = async (id, userId) => {
  return devGoals.find(
    (g) => g._id.toString() === id.toString() && g.user.toString() === userId.toString()
  ) || null;
};

export const updateDevGoal = async (id, userId, updates) => {
  const index = devGoals.findIndex(
    (g) => g._id.toString() === id.toString() && g.user.toString() === userId.toString()
  );

  if (index === -1) return null;

  const current = devGoals[index];
  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date(),
  };

  devGoals[index] = updated;
  return updated;
};

export const deleteDevGoal = async (id, userId) => {
  const index = devGoals.findIndex(
    (g) => g._id.toString() === id.toString() && g.user.toString() === userId.toString()
  );

  if (index === -1) return false;

  devGoals.splice(index, 1);
  return true;
};

/* ─────────────────────────────────────────────────────────────
   FITNESS PURPOSE FALLBACK OPERATIONS (Stage 19)
───────────────────────────────────────────────────────────── */

export const getDevPurpose = async (userId) => {
  return devPurposes.find(
    (p) => p.user.toString() === userId.toString() && p.active !== false
  ) || null;
};

export const createOrUpdateDevPurpose = async (userId, { purposeType, customPurpose, identityStatement, coreWhy, primaryMotivation, commitmentLevel, notes, active = true }) => {
  const existingIndex = devPurposes.findIndex(
    (p) => p.user.toString() === userId.toString()
  );

  if (existingIndex !== -1) {
    devPurposes[existingIndex] = {
      ...devPurposes[existingIndex],
      purposeType: purposeType || devPurposes[existingIndex].purposeType,
      customPurpose: customPurpose !== undefined ? customPurpose.trim() : devPurposes[existingIndex].customPurpose,
      identityStatement: identityStatement !== undefined ? identityStatement.trim() : devPurposes[existingIndex].identityStatement,
      coreWhy: coreWhy !== undefined ? coreWhy.trim() : devPurposes[existingIndex].coreWhy,
      primaryMotivation: primaryMotivation !== undefined ? primaryMotivation.trim() : devPurposes[existingIndex].primaryMotivation,
      commitmentLevel: commitmentLevel || devPurposes[existingIndex].commitmentLevel,
      notes: notes !== undefined ? notes.trim() : devPurposes[existingIndex].notes,
      active: active !== undefined ? active : true,
      updatedAt: new Date(),
    };
    return devPurposes[existingIndex];
  }

  const newPurpose = {
    _id: `dev_purpose_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user: userId.toString(),
    purposeType: purposeType || 'BUILD_DISCIPLINE',
    customPurpose: customPurpose ? customPurpose.trim() : '',
    identityStatement: identityStatement ? identityStatement.trim() : '',
    coreWhy: coreWhy ? coreWhy.trim() : '',
    primaryMotivation: primaryMotivation ? primaryMotivation.trim() : '',
    commitmentLevel: commitmentLevel || 'MODERATE',
    notes: notes ? notes.trim() : '',
    active: active !== undefined ? active : true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  devPurposes.push(newPurpose);
  return newPurpose;
};

export const deleteDevPurpose = async (userId) => {
  const index = devPurposes.findIndex(
    (p) => p.user.toString() === userId.toString()
  );

  if (index === -1) return false;
  devPurposes.splice(index, 1);
  return true;
};

/* ─────────────────────────────────────────────────────────────
   WORKOUT REFLECTION FALLBACK OPERATIONS (Stage 19)
───────────────────────────────────────────────────────────── */

export const createDevReflection = async (userId, { workoutId, effort, note, activityType, duration }) => {
  const newReflection = {
    _id: `dev_reflection_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user: userId.toString(),
    workout: workoutId ? workoutId.toString() : null,
    effort: effort || 'GOOD',
    note: note ? note.trim() : '',
    activityType: activityType || 'Workout',
    duration: Number(duration) || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  devReflections.push(newReflection);
  return newReflection;
};

export const getDevReflections = async (userId, limit = 50) => {
  return devReflections
    .filter((r) => r.user && r.user.toString() === userId.toString())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};

/* ─────────────────────────────────────────────────────────────
   TRAINING PLAN FALLBACK OPERATIONS (Stage 20)
───────────────────────────────────────────────────────────── */

export const getDevTrainingPlan = async (userId) => {
  return (
    devTrainingPlans.find(
      (p) => p.user && p.user.toString() === userId.toString() && p.status === 'ACTIVE'
    ) || null
  );
};

export const getDevTrainingPlanById = async (id, userId) => {
  return (
    devTrainingPlans.find(
      (p) => p._id.toString() === id.toString() && p.user && p.user.toString() === userId.toString()
    ) || null
  );
};

export const createDevTrainingPlan = async (userId, planData) => {
  // Deactivate any existing active plans for this user
  devTrainingPlans.forEach((p) => {
    if (p.user && p.user.toString() === userId.toString() && p.status === 'ACTIVE') {
      p.status = 'ARCHIVED';
      p.updatedAt = new Date();
    }
  });

  const newPlan = {
    _id: `dev_plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user: userId.toString(),
    name: planData.name || 'Adaptive Weekly Training Plan',
    purposeId: planData.purposeId || null,
    goalIds: planData.goalIds || [],
    weeklyTargetSessions: Number(planData.weeklyTargetSessions) || 3,
    preferredSessionDuration: Number(planData.preferredSessionDuration) || 25,
    preferredDays: planData.preferredDays || ['MON', 'WED', 'FRI'],
    minimumSessionDuration: Number(planData.minimumSessionDuration) || 15,
    maximumSessionDuration: Number(planData.maximumSessionDuration) || 45,
    focusAreas: planData.focusAreas || ['Discipline', 'General Fitness'],
    status: planData.status || 'ACTIVE',
    schedule: planData.schedule || [],
    startDate: planData.startDate ? new Date(planData.startDate) : new Date(),
    endDate: planData.endDate ? new Date(planData.endDate) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  devTrainingPlans.push(newPlan);
  return newPlan;
};

export const updateDevTrainingPlan = async (id, userId, updates) => {
  const index = devTrainingPlans.findIndex(
    (p) => p._id.toString() === id.toString() && p.user && p.user.toString() === userId.toString()
  );

  if (index === -1) return null;

  const current = devTrainingPlans[index];
  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date(),
  };

  devTrainingPlans[index] = updated;
  return updated;
};

export const deleteDevTrainingPlan = async (id, userId) => {
  const index = devTrainingPlans.findIndex(
    (p) => p._id.toString() === id.toString() && p.user && p.user.toString() === userId.toString()
  );

  if (index === -1) return false;
  devTrainingPlans.splice(index, 1);
  return true;
};

/* ─────────────────────────────────────────────────────────────
   WEEKLY REFLECTION FALLBACK OPERATIONS (Stage 20)
───────────────────────────────────────────────────────────── */

export const getDevWeeklyReflections = async (userId, limit = 20) => {
  return devWeeklyReflections
    .filter((r) => r.user && r.user.toString() === userId.toString())
    .sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart))
    .slice(0, limit);
};

export const getDevWeeklyReflectionByWeek = async (userId, weekStart) => {
  const targetTime = new Date(weekStart).setUTCHours(0, 0, 0, 0);
  return (
    devWeeklyReflections.find((r) => {
      if (!r.user || r.user.toString() !== userId.toString()) return false;
      const rTime = new Date(r.weekStart).setUTCHours(0, 0, 0, 0);
      return rTime === targetTime;
    }) || null
  );
};

export const createOrUpdateDevWeeklyReflection = async (userId, reflectionData) => {
  const weekStart = new Date(reflectionData.weekStart || Date.now());
  weekStart.setUTCHours(0, 0, 0, 0);

  const existingIndex = devWeeklyReflections.findIndex((r) => {
    if (!r.user || r.user.toString() !== userId.toString()) return false;
    const rTime = new Date(r.weekStart).setUTCHours(0, 0, 0, 0);
    return rTime === weekStart.getTime();
  });

  if (existingIndex >= 0) {
    devWeeklyReflections[existingIndex] = {
      ...devWeeklyReflections[existingIndex],
      wentWell: reflectionData.wentWell !== undefined ? reflectionData.wentWell.trim() : devWeeklyReflections[existingIndex].wentWell,
      difficult: reflectionData.difficult !== undefined ? reflectionData.difficult.trim() : devWeeklyReflections[existingIndex].difficult,
      nextFocus: reflectionData.nextFocus !== undefined ? reflectionData.nextFocus.trim() : devWeeklyReflections[existingIndex].nextFocus,
      sessionsCompleted: reflectionData.sessionsCompleted ?? devWeeklyReflections[existingIndex].sessionsCompleted,
      targetSessions: reflectionData.targetSessions ?? devWeeklyReflections[existingIndex].targetSessions,
      updatedAt: new Date(),
    };
    return devWeeklyReflections[existingIndex];
  }

  const newReflection = {
    _id: `dev_wk_refl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user: userId.toString(),
    weekStart,
    weekEnd: reflectionData.weekEnd ? new Date(reflectionData.weekEnd) : new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
    wentWell: reflectionData.wentWell ? reflectionData.wentWell.trim() : '',
    difficult: reflectionData.difficult ? reflectionData.difficult.trim() : '',
    nextFocus: reflectionData.nextFocus ? reflectionData.nextFocus.trim() : '',
    sessionsCompleted: Number(reflectionData.sessionsCompleted) || 0,
    targetSessions: Number(reflectionData.targetSessions) || 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  devWeeklyReflections.push(newReflection);
  return newReflection;
};

/* ─────────────────────────────────────────────────────────────
   USER LIFE CONTEXT FALLBACK OPERATIONS (Stage 20)
───────────────────────────────────────────────────────────── */

export const getDevLifeContext = async (userId) => {
  const found = devLifeContexts.find(
    (c) => c.user && c.user.toString() === userId.toString()
  );
  if (found) return found;

  const defaultContext = {
    _id: `dev_ctx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user: userId.toString(),
    lifeLoad: 'NORMAL',
    todayAvailableMinutes: 25,
    lastAvailabilityDate: new Date().toISOString().split('T')[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  devLifeContexts.push(defaultContext);
  return defaultContext;
};

export const setDevLifeContext = async (userId, updates) => {
  const index = devLifeContexts.findIndex(
    (c) => c.user && c.user.toString() === userId.toString()
  );

  if (index >= 0) {
    devLifeContexts[index] = {
      ...devLifeContexts[index],
      ...updates,
      updatedAt: new Date(),
    };
    return devLifeContexts[index];
  }

  const newContext = {
    _id: `dev_ctx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user: userId.toString(),
    lifeLoad: updates.lifeLoad || 'NORMAL',
    todayAvailableMinutes: updates.todayAvailableMinutes || 25,
    lastAvailabilityDate: updates.lastAvailabilityDate || new Date().toISOString().split('T')[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  devLifeContexts.push(newContext);
  return newContext;
};






