import WeeklyReflection from '../models/WeeklyReflection.js';
import Workout from '../models/Workout.js';
import {
  isMongoConnected,
  getDevWeeklyReflections,
  getDevWeeklyReflectionByWeek,
  createOrUpdateDevWeeklyReflection,
  getDevWorkouts,
} from '../utils/devStore.js';

/**
 * Helper to calculate current week's Monday 00:00:00
 */
const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

/**
 * @desc    Get user's past weekly reflections
 * @route   GET /api/weekly-reflections
 * @access  Private
 */
export const getWeeklyReflections = async (req, res) => {
  try {
    const userId = req.user._id;

    let reflections = [];
    if (isMongoConnected()) {
      reflections = await WeeklyReflection.find({ user: userId })
        .sort({ weekStart: -1 })
        .lean();
    } else {
      reflections = await getDevWeeklyReflections(userId);
    }

    return res.status(200).json({
      success: true,
      reflections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve weekly reflections.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get reflection for the current active week
 * @route   GET /api/weekly-reflections/current
 * @access  Private
 */
export const getCurrentWeeklyReflection = async (req, res) => {
  try {
    const userId = req.user._id;
    const weekStart = getWeekStart();

    let reflection = null;
    if (isMongoConnected()) {
      reflection = await WeeklyReflection.findOne({
        user: userId,
        weekStart: {
          $gte: new Date(weekStart.getTime() - 1000 * 60 * 60),
          $lte: new Date(weekStart.getTime() + 1000 * 60 * 60),
        },
      }).lean();
    } else {
      reflection = await getDevWeeklyReflectionByWeek(userId, weekStart);
    }

    return res.status(200).json({
      success: true,
      reflection,
      weekStart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve current week reflection.',
      error: error.message,
    });
  }
};

/**
 * @desc    Save or update weekly reflection
 * @route   POST /api/weekly-reflections
 * @access  Private
 */
export const saveWeeklyReflection = async (req, res) => {
  try {
    const userId = req.user._id;
    const { wentWell, difficult, nextFocus, weekStartDate } = req.body;

    const weekStart = weekStartDate ? new Date(weekStartDate) : getWeekStart();
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    weekEnd.setHours(23, 59, 59, 999);

    // Calculate workouts completed in that week
    let sessionsCompleted = 0;
    if (isMongoConnected()) {
      sessionsCompleted = await Workout.countDocuments({
        user: userId,
        workoutDate: { $gte: weekStart, $lte: weekEnd },
      });
    } else {
      const workouts = await getDevWorkouts(userId);
      sessionsCompleted = workouts.filter((w) => {
        const d = new Date(w.workoutDate || w.createdAt);
        return d >= weekStart && d <= weekEnd;
      }).length;
    }

    let reflection = null;
    if (isMongoConnected()) {
      reflection = await WeeklyReflection.findOneAndUpdate(
        { user: userId, weekStart },
        {
          wentWell: wentWell ? wentWell.trim() : '',
          difficult: difficult ? difficult.trim() : '',
          nextFocus: nextFocus ? nextFocus.trim() : '',
          weekEnd,
          sessionsCompleted,
        },
        { new: true, upsert: true, runValidators: true }
      );
    } else {
      reflection = await createOrUpdateDevWeeklyReflection(userId, {
        weekStart,
        weekEnd,
        wentWell,
        difficult,
        nextFocus,
        sessionsCompleted,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Weekly reflection preserved in journey archive.',
      reflection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record weekly reflection.',
      error: error.message,
    });
  }
};
