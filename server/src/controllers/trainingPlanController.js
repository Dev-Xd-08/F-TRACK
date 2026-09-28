import TrainingPlan from '../models/TrainingPlan.js';
import UserLifeContext from '../models/UserLifeContext.js';
import {
  isMongoConnected,
  getDevTrainingPlan,
  getDevTrainingPlanById,
  createDevTrainingPlan,
  updateDevTrainingPlan,
  deleteDevTrainingPlan,
  getDevLifeContext,
  setDevLifeContext,
} from '../utils/devStore.js';
import {
  generatePlanSchedule,
  getAdaptiveWeekStatus,
  calculateLoadCheck,
  calculateActivityBalance,
  fetchUserLifeContext,
} from '../utils/trainingPlanEngine.js';
import {
  calculatePersonalBaseline,
  calculateSelfComparison,
} from '../utils/baselineEngine.js';
import {
  getAdaptiveDailyRecommendation,
} from '../utils/adaptiveRecommendationEngine.js';

/**
 * @desc    Get active training plan and schedule
 * @route   GET /api/training-plan
 * @access  Private
 */
export const getActiveTrainingPlan = async (req, res) => {
  try {
    const userId = req.user._id;

    let plan = null;
    if (isMongoConnected()) {
      plan = await TrainingPlan.findOne({ user: userId, status: 'ACTIVE' }).lean();
    } else {
      plan = await getDevTrainingPlan(userId);
    }

    const weekStatus = await getAdaptiveWeekStatus(userId);

    return res.status(200).json({
      success: true,
      plan,
      weekStatus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve training plan.',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new training plan
 * @route   POST /api/training-plan
 * @access  Private
 */
export const createTrainingPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      weeklyTargetSessions = 3,
      preferredSessionDuration = 25,
      preferredDays = ['MON', 'WED', 'FRI'],
      minimumSessionDuration = 15,
      maximumSessionDuration = 45,
      focusAreas = ['Discipline', 'General Fitness'],
      activityType = 'General Training',
    } = req.body;

    const lifeCtx = await fetchUserLifeContext(userId);

    // Generate schedule
    const schedule = generatePlanSchedule({
      weeklyTargetSessions,
      preferredSessionDuration,
      preferredDays,
      focusAreas,
      lifeLoad: lifeCtx?.lifeLoad || 'NORMAL',
      activityType,
    });

    let newPlan = null;
    if (isMongoConnected()) {
      // Archive existing active plans
      await TrainingPlan.updateMany({ user: userId, status: 'ACTIVE' }, { status: 'ARCHIVED' });

      newPlan = await TrainingPlan.create({
        user: userId,
        name: name || 'Adaptive Weekly Training Plan',
        weeklyTargetSessions,
        preferredSessionDuration,
        preferredDays,
        minimumSessionDuration,
        maximumSessionDuration,
        focusAreas,
        status: 'ACTIVE',
        schedule,
      });
    } else {
      newPlan = await createDevTrainingPlan(userId, {
        name,
        weeklyTargetSessions,
        preferredSessionDuration,
        preferredDays,
        minimumSessionDuration,
        maximumSessionDuration,
        focusAreas,
        schedule,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Adaptive training plan established.',
      plan: newPlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create training plan.',
      error: error.message,
    });
  }
};

/**
 * @desc    Update training plan
 * @route   PUT /api/training-plan/:id
 * @access  Private
 */
export const updateTrainingPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const planId = req.params.id;
    const updates = req.body;

    const lifeCtx = await fetchUserLifeContext(userId);

    // If schedule preferences changed, regenerate schedule
    if (updates.weeklyTargetSessions || updates.preferredSessionDuration || updates.preferredDays) {
      updates.schedule = generatePlanSchedule({
        weeklyTargetSessions: updates.weeklyTargetSessions,
        preferredSessionDuration: updates.preferredSessionDuration,
        preferredDays: updates.preferredDays,
        lifeLoad: lifeCtx?.lifeLoad || 'NORMAL',
      });
    }

    let updatedPlan = null;
    if (isMongoConnected()) {
      updatedPlan = await TrainingPlan.findOneAndUpdate(
        { _id: planId, user: userId },
        updates,
        { new: true, runValidators: true }
      );
    } else {
      updatedPlan = await updateDevTrainingPlan(planId, userId, updates);
    }

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: 'Training plan not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Training plan updated.',
      plan: updatedPlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update training plan.',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete training plan
 * @route   DELETE /api/training-plan/:id
 * @access  Private
 */
export const deleteTrainingPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const planId = req.params.id;

    let deleted = false;
    if (isMongoConnected()) {
      const resDb = await TrainingPlan.findOneAndDelete({ _id: planId, user: userId });
      deleted = !!resDb;
    } else {
      deleted = await deleteDevTrainingPlan(planId, userId);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Training plan not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Training plan removed.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete training plan.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Adaptive Week Status
 * @route   GET /api/training-plan/adaptive-week
 * @access  Private
 */
export const getAdaptiveWeek = async (req, res) => {
  try {
    const userId = req.user._id;
    const weekStatus = await getAdaptiveWeekStatus(userId);

    return res.status(200).json({
      success: true,
      weekStatus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate adaptive week status.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Personal Baseline and Self-Comparison
 * @route   GET /api/training-plan/baseline
 * @access  Private
 */
export const getBaseline = async (req, res) => {
  try {
    const userId = req.user._id;

    const [baseline, selfComparison] = await Promise.all([
      calculatePersonalBaseline(userId),
      calculateSelfComparison(userId),
    ]);

    return res.status(200).json({
      success: true,
      baseline,
      selfComparison,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate personal baseline.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Adaptive Daily Recommendation with "Why This?"
 * @route   GET /api/training-plan/recommendation
 * @access  Private
 */
export const getDailyRecommendation = async (req, res) => {
  try {
    const userId = req.user._id;
    const recommendation = await getAdaptiveDailyRecommendation(userId);

    return res.status(200).json({
      success: true,
      recommendation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate daily recommendation.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Load Check and Activity Balance
 * @route   GET /api/training-plan/balance
 * @access  Private
 */
export const getLoadAndBalance = async (req, res) => {
  try {
    const userId = req.user._id;

    const [loadCheck, activityBalance] = await Promise.all([
      calculateLoadCheck(userId),
      calculateActivityBalance(userId),
    ]);

    return res.status(200).json({
      success: true,
      loadCheck,
      activityBalance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate load and activity balance.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get User Life Context (Life load & Availability)
 * @route   GET /api/training-plan/life-context
 * @access  Private
 */
export const getLifeContext = async (req, res) => {
  try {
    const userId = req.user._id;
    const lifeContext = await fetchUserLifeContext(userId);

    return res.status(200).json({
      success: true,
      lifeContext,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve life context.',
      error: error.message,
    });
  }
};

/**
 * @desc    Update Life Load ('LIGHT' | 'NORMAL' | 'BUSY' | 'VERY_BUSY')
 * @route   POST /api/training-plan/life-load
 * @access  Private
 */
export const updateLifeLoad = async (req, res) => {
  try {
    const userId = req.user._id;
    const { lifeLoad } = req.body;

    if (!['LIGHT', 'NORMAL', 'BUSY', 'VERY_BUSY'].includes(lifeLoad)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid life load specification. Must be LIGHT, NORMAL, BUSY, or VERY_BUSY.',
      });
    }

    let updated = null;
    if (isMongoConnected()) {
      updated = await UserLifeContext.findOneAndUpdate(
        { user: userId },
        { lifeLoad },
        { new: true, upsert: true }
      );
    } else {
      updated = await setDevLifeContext(userId, { lifeLoad });
    }

    return res.status(200).json({
      success: true,
      message: `Life load updated to ${lifeLoad}.`,
      lifeContext: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update life load.',
      error: error.message,
    });
  }
};

/**
 * @desc    Update Today's Available Minutes (5, 10, 15, 20, 30, 45, 60)
 * @route   POST /api/training-plan/availability
 * @access  Private
 */
export const updateAvailability = async (req, res) => {
  try {
    const userId = req.user._id;
    const { availableMinutes } = req.body;

    const num = Number(availableMinutes);
    if (![5, 10, 15, 20, 30, 45, 60].includes(num)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid availability. Choose 5, 10, 15, 20, 30, 45, or 60 minutes.',
      });
    }

    let updated = null;
    if (isMongoConnected()) {
      updated = await UserLifeContext.findOneAndUpdate(
        { user: userId },
        {
          todayAvailableMinutes: num,
          lastAvailabilityDate: new Date().toISOString().split('T')[0],
        },
        { new: true, upsert: true }
      );
    } else {
      updated = await setDevLifeContext(userId, {
        todayAvailableMinutes: num,
        lastAvailabilityDate: new Date().toISOString().split('T')[0],
      });
    }

    return res.status(200).json({
      success: true,
      message: `Today's available time set to ${num} minutes.`,
      lifeContext: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update availability.',
      error: error.message,
    });
  }
};
