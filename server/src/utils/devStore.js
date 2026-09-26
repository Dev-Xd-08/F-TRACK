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
