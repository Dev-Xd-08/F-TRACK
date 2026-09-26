import { getUserQuests, getUserQuestHistory } from '../utils/questEngine.js';

/**
 * @desc    Get active Daily and Weekly quests with current progress
 * @route   GET /api/quests
 * @access  Private
 */
export const getQuests = async (req, res) => {
  try {
    const userId = req.user._id;
    const questsData = await getUserQuests(userId);

    return res.status(200).json({
      success: true,
      ...questsData,
    });
  } catch (error) {
    console.error(`[GET_QUESTS ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to access active quest board telemetry.',
    });
  }
};

/**
 * @desc    Get chronological quest completion history
 * @route   GET /api/quests/history
 * @access  Private
 */
export const getQuestHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await getUserQuestHistory(userId);

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(`[GET_QUEST_HISTORY ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to access completed quest archives.',
    });
  }
};

export default {
  getQuests,
  getQuestHistory,
};
