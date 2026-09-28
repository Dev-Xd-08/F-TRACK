import WorkoutReflection from '../models/WorkoutReflection.js';
import {
  isMongoConnected,
  createDevReflection,
  getDevReflections,
} from '../utils/devStore.js';

/**
 * @desc    Save subjective post-workout reflection
 * @route   POST /api/reflections
 * @access  Private
 */
export const saveReflection = async (req, res) => {
  try {
    const userId = req.user._id;
    const { workoutId, effort, note, activityType, duration } = req.body;

    if (!effort) {
      return res.status(400).json({
        success: false,
        message: 'Please rate perceived session effort.',
      });
    }

    if (note && note.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Reflection note cannot exceed 500 characters.',
      });
    }

    if (isMongoConnected()) {
      const reflection = await WorkoutReflection.create({
        user: userId,
        workout: workoutId || null,
        effort,
        note: note ? note.trim() : '',
        activityType: activityType || 'Workout',
        duration: Number(duration) || 0,
      });

      return res.status(201).json({
        success: true,
        message: 'Workout reflection preserved.',
        reflection,
      });
    }

    const devReflection = await createDevReflection(userId, {
      workoutId,
      effort,
      note,
      activityType,
      duration,
    });

    return res.status(201).json({
      success: true,
      message: 'Workout reflection preserved.',
      reflection: devReflection,
    });
  } catch (error) {
    console.error(`[SAVE_REFLECTION ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to record session reflection.',
    });
  }
};

/**
 * @desc    Get user's recent reflections
 * @route   GET /api/reflections
 * @access  Private
 */
export const getReflections = async (req, res) => {
  try {
    const userId = req.user._id;

    if (isMongoConnected()) {
      const reflections = await WorkoutReflection.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      return res.status(200).json({
        success: true,
        count: reflections.length,
        reflections,
      });
    }

    const devReflections = await getDevReflections(userId);
    return res.status(200).json({
      success: true,
      count: devReflections.length,
      reflections: devReflections,
    });
  } catch (error) {
    console.error(`[GET_REFLECTIONS ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve session reflections.',
    });
  }
};
