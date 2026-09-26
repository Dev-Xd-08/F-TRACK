import Workout from '../models/Workout.js';
import {
  isMongoConnected,
  getDevWorkouts,
  getDevWorkoutById,
  createDevWorkout,
  updateDevWorkout,
  deleteDevWorkout,
} from '../utils/devStore.js';
import { awardWorkoutProgression } from '../utils/progressionEngine.js';

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
 * @desc    Get all workouts for authenticated warrior
 * @route   GET /api/workouts
 * @access  Private
 */
export const getWorkouts = async (req, res) => {
  try {
    const userId = req.user._id;
    let workouts;

    if (isMongoConnected()) {
      workouts = await Workout.find({ user: userId }).sort({ workoutDate: -1, createdAt: -1 });
    } else {
      workouts = await getDevWorkouts(userId);
    }

    return res.status(200).json({
      success: true,
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    console.error(`[GET_WORKOUTS ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve warrior training records.',
    });
  }
};

/**
 * @desc    Get single workout by ID
 * @route   GET /api/workouts/:id
 * @access  Private
 */
export const getWorkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const workoutId = req.params.id;
    let workout;

    if (isMongoConnected()) {
      workout = await Workout.findOne({ _id: workoutId, user: userId });
    } else {
      workout = await getDevWorkoutById(workoutId, userId);
    }

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Training quest not found or does not belong to your hunter record.',
      });
    }

    return res.status(200).json({
      success: true,
      workout,
    });
  } catch (error) {
    console.error(`[GET_WORKOUT ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve training quest details.',
    });
  }
};

/**
 * @desc    Create a new workout quest
 * @route   POST /api/workouts
 * @access  Private
 */
export const createWorkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { activityType, duration, caloriesBurned, workoutDate, notes } = req.body;

    // 1. Validation
    if (!activityType || !VALID_ACTIVITIES.includes(activityType)) {
      return res.status(400).json({
        success: false,
        message: `Valid activity type is required (${VALID_ACTIVITIES.join(', ')}).`,
      });
    }

    const numDuration = Number(duration);
    if (!duration || isNaN(numDuration) || numDuration <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Training duration must be a positive number greater than 0 minutes.',
      });
    }

    const numCalories = Number(caloriesBurned);
    if (caloriesBurned === undefined || caloriesBurned === null || isNaN(numCalories) || numCalories < 0) {
      return res.status(400).json({
        success: false,
        message: 'Calories burned must be 0 or a positive number.',
      });
    }

    const parsedDate = workoutDate ? new Date(workoutDate) : new Date();
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid training calendar date.',
      });
    }

    // 2. Creation
    let workout;
    if (isMongoConnected()) {
      workout = await Workout.create({
        user: userId,
        activityType,
        duration: numDuration,
        caloriesBurned: numCalories,
        workoutDate: parsedDate,
        notes: notes ? notes.trim() : '',
      });
    } else {
      workout = await createDevWorkout({
        userId,
        activityType,
        duration: numDuration,
        caloriesBurned: numCalories,
        workoutDate: parsedDate,
        notes: notes ? notes.trim() : '',
      });
    }

    // 3. Stage 6 Ascension Engine Progression Award
    let progressionUpdate = null;
    try {
      progressionUpdate = await awardWorkoutProgression(userId, workout);
    } catch (progErr) {
      console.error(`[PROGRESSION_ENGINE ERROR] ${progErr.message}`);
    }

    return res.status(201).json({
      success: true,
      message: 'Training quest completed and recorded in your ascension log.',
      workout,
      progression: progressionUpdate?.progression || null,
      events: progressionUpdate?.newEvents || [],
    });
  } catch (error) {
    console.error(`[CREATE_WORKOUT ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to record training quest.',
    });
  }
};

/**
 * @desc    Update an existing workout quest
 * @route   PUT /api/workouts/:id
 * @access  Private
 */
export const updateWorkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const workoutId = req.params.id;
    const { activityType, duration, caloriesBurned, workoutDate, notes } = req.body;

    // Check ownership & existence
    let existing;
    if (isMongoConnected()) {
      existing = await Workout.findOne({ _id: workoutId, user: userId });
    } else {
      existing = await getDevWorkoutById(workoutId, userId);
    }

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Training quest not found or access denied.',
      });
    }

    // Validation if updating fields
    const updates = {};

    if (activityType !== undefined) {
      if (!VALID_ACTIVITIES.includes(activityType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid activity type. Choose from: ${VALID_ACTIVITIES.join(', ')}`,
        });
      }
      updates.activityType = activityType;
    }

    if (duration !== undefined) {
      const numDuration = Number(duration);
      if (isNaN(numDuration) || numDuration <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Duration must be greater than 0 minutes.',
        });
      }
      updates.duration = numDuration;
    }

    if (caloriesBurned !== undefined) {
      const numCalories = Number(caloriesBurned);
      if (isNaN(numCalories) || numCalories < 0) {
        return res.status(400).json({
          success: false,
          message: 'Calories burned cannot be negative.',
        });
      }
      updates.caloriesBurned = numCalories;
    }

    if (workoutDate !== undefined) {
      const parsedDate = new Date(workoutDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid workout date format.',
        });
      }
      updates.workoutDate = parsedDate;
    }

    if (notes !== undefined) {
      updates.notes = typeof notes === 'string' ? notes.trim() : '';
    }

    let updatedWorkout;
    if (isMongoConnected()) {
      updatedWorkout = await Workout.findOneAndUpdate(
        { _id: workoutId, user: userId },
        updates,
        { new: true, runValidators: true }
      );
    } else {
      updatedWorkout = await updateDevWorkout(workoutId, userId, updates);
    }

    return res.status(200).json({
      success: true,
      message: 'Training quest updated successfully.',
      workout: updatedWorkout,
    });
  } catch (error) {
    console.error(`[UPDATE_WORKOUT ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update training quest.',
    });
  }
};

/**
 * @desc    Delete a workout quest
 * @route   DELETE /api/workouts/:id
 * @access  Private
 */
export const deleteWorkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const workoutId = req.params.id;

    let deleted;
    if (isMongoConnected()) {
      deleted = await Workout.findOneAndDelete({ _id: workoutId, user: userId });
    } else {
      deleted = await deleteDevWorkout(workoutId, userId);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Training quest not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Training quest abandoned and removed from ascension logs.',
    });
  } catch (error) {
    console.error(`[DELETE_WORKOUT ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete training quest.',
    });
  }
};
