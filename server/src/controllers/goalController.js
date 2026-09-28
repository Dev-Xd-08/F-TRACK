import {
  createGoal,
  getUserGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  updateCustomGoalProgress,
} from '../utils/goalEngine.js';

/**
 * @desc    Get all fitness goals/missions for the authenticated warrior
 * @route   GET /api/goals
 * @access  Private
 */
export const getGoals = async (req, res) => {
  try {
    const userId = req.user._id;
    const goals = await getUserGoals(userId);

    const activeCount = goals.filter((g) => g.status === 'ACTIVE').length;
    const completedCount = goals.filter((g) => g.status === 'COMPLETED').length;
    const expiredCount = goals.filter((g) => g.status === 'EXPIRED').length;

    return res.status(200).json({
      success: true,
      count: goals.length,
      activeCount,
      completedCount,
      expiredCount,
      goals,
    });
  } catch (error) {
    console.error(`[GET_GOALS ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve warrior fitness missions.',
    });
  }
};

/**
 * @desc    Get single fitness mission by ID
 * @route   GET /api/goals/:id
 * @access  Private
 */
export const getGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const goalId = req.params.id;

    const goal = await getGoalById(userId, goalId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Fitness mission not found or does not belong to your hunter record.',
      });
    }

    return res.status(200).json({
      success: true,
      goal,
    });
  } catch (error) {
    console.error(`[GET_GOAL ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to access mission details.',
    });
  }
};

/**
 * @desc    Create a new fitness mission / goal
 * @route   POST /api/goals
 * @access  Private
 */
export const createNewGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const goal = await createGoal(userId, req.body);

    return res.status(201).json({
      success: true,
      message: 'Fitness mission created and synchronized in Mission Control.',
      goal,
    });
  } catch (error) {
    console.error(`[CREATE_GOAL ERROR] ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to initialize new fitness mission.',
    });
  }
};

/**
 * @desc    Update mission configuration details
 * @route   PUT /api/goals/:id
 * @access  Private
 */
export const updateGoalDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const goalId = req.params.id;

    const updated = await updateGoal(userId, goalId, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found or unauthorized to modify.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Fitness mission updated successfully.',
      goal: updated,
    });
  } catch (error) {
    console.error(`[UPDATE_GOAL ERROR] ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update mission configuration.',
    });
  }
};

/**
 * @desc    Delete a mission
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
export const removeGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const goalId = req.params.id;

    const deleted = await deleteGoal(userId, goalId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found or unauthorized to delete.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Fitness mission deleted from your hunter record.',
    });
  } catch (error) {
    console.error(`[DELETE_GOAL ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove fitness mission.',
    });
  }
};

/**
 * @desc    Force refresh progress for a specific goal
 * @route   POST /api/goals/:id/refresh
 * @access  Private
 */
export const refreshGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const goalId = req.params.id;

    const goal = await getGoalById(userId, goalId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Mission progress refreshed with empirical telemetry.',
      goal,
    });
  } catch (error) {
    console.error(`[REFRESH_GOAL ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to refresh mission progress.',
    });
  }
};

/**
 * @desc    Manually update progress for CUSTOM mission
 * @route   POST /api/goals/:id/progress
 * @access  Private
 */
export const updateProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const goalId = req.params.id;
    const { value } = req.body;

    const goal = await updateCustomGoalProgress(userId, goalId, value);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Custom mission progress updated.',
      goal,
    });
  } catch (error) {
    console.error(`[UPDATE_PROGRESS ERROR] ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update custom mission progress.',
    });
  }
};

export default {
  getGoals,
  getGoal,
  createNewGoal,
  updateGoalDetails,
  removeGoal,
  refreshGoal,
  updateProgress,
};
