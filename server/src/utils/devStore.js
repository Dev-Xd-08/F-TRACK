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
    .filter((w) => w.user.toString() === userId.toString())
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

