import {
  getJourneyMilestones,
  getReturnStatus,
  getTodayFocus,
  getGoalAdjustmentSuggestions,
  getHabitPatterns,
  getPlateauAnalysis,
  getGrowthSummary,
} from '../utils/journeyEngine.js';
import FitnessPurpose from '../models/FitnessPurpose.js';
import { isMongoConnected, getDevPurpose } from '../utils/devStore.js';

/**
 * @desc    Get comprehensive Journey Telemetry (Milestones, Return Status, Today Focus, Growth, Habit Patterns, Plateau)
 * @route   GET /api/journey/telemetry
 * @access  Private
 */
export const getJourneyTelemetry = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user purpose for purpose-aligned recommendations
    let userPurpose = null;
    if (isMongoConnected()) {
      userPurpose = await FitnessPurpose.findOne({ user: userId, active: true }).lean();
    } else {
      userPurpose = await getDevPurpose(userId);
    }

    const [
      milestones,
      returnStatus,
      todayFocus,
      goalAdjustment,
      habitPatterns,
      plateauAnalysis,
      growthSummary,
    ] = await Promise.all([
      getJourneyMilestones(userId),
      getReturnStatus(userId),
      getTodayFocus(userId, userPurpose),
      getGoalAdjustmentSuggestions(userId),
      getHabitPatterns(userId),
      getPlateauAnalysis(userId),
      getGrowthSummary(userId),
    ]);

    return res.status(200).json({
      success: true,
      telemetry: {
        milestones,
        returnStatus,
        todayFocus,
        goalAdjustment,
        habitPatterns,
        plateauAnalysis,
        growthSummary,
        purpose: userPurpose,
      },
    });
  } catch (error) {
    console.error(`[GET_JOURNEY_TELEMETRY ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to access journey telemetry.',
    });
  }
};
