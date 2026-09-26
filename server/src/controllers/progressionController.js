import { getUserProgressionData } from '../utils/progressionEngine.js';

/**
 * @desc    Get progression profile for authenticated warrior
 * @route   GET /api/progression
 * @access  Private
 */
export const getProgression = async (req, res) => {
  try {
    const userId = req.user._id;
    const progression = await getUserProgressionData(userId);

    return res.status(200).json({
      success: true,
      progression,
    });
  } catch (error) {
    console.error(`[GET_PROGRESSION ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to access warrior ascension matrix.',
    });
  }
};

/**
 * @desc    Get progression ascension event history
 * @route   GET /api/progression/history
 * @access  Private
 */
export const getProgressionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const progression = await getUserProgressionData(userId);

    return res.status(200).json({
      success: true,
      count: (progression.events || []).length,
      events: progression.events || [],
    });
  } catch (error) {
    console.error(`[GET_PROGRESSION_HISTORY ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve warrior ascension event logs.',
    });
  }
};

export default {
  getProgression,
  getProgressionHistory,
};
