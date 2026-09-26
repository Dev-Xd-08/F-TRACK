import { getUserAchievements, getUserAchievementHistory } from '../utils/achievementEngine.js';

/**
 * @desc    Get all Hunter Achievements with current user unlock progress
 * @route   GET /api/achievements
 * @access  Private
 */
export const getAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const achievementsData = await getUserAchievements(userId);

    return res.status(200).json({
      success: true,
      ...achievementsData,
    });
  } catch (error) {
    console.error(`[GET_ACHIEVEMENTS ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to access hunter achievement telemetry.',
    });
  }
};

/**
 * @desc    Get chronologically unlocked achievement history
 * @route   GET /api/achievements/history
 * @access  Private
 */
export const getAchievementHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await getUserAchievementHistory(userId);

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(`[GET_ACHIEVEMENT_HISTORY ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to access unlocked achievement history.',
    });
  }
};

export default {
  getAchievements,
  getAchievementHistory,
};
