import { calculateAnalytics } from '../utils/analyticsEngine.js';

/**
 * @desc    Get comprehensive fitness analytics and progress intelligence
 * @route   GET /api/analytics
 * @access  Private
 */
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const analytics = await calculateAnalytics(userId);

    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error(`[GET_ANALYTICS ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to access fitness analytics telemetry.',
    });
  }
};

export default {
  getAnalytics,
};
