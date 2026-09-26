import { calculateFitnessIntelligence } from '../utils/fitnessIntelligenceEngine.js';

/**
 * @desc    Get comprehensive personal fitness intelligence and smart insights
 * @route   GET /api/intelligence
 * @access  Private
 */
export const getFitnessIntelligence = async (req, res) => {
  try {
    const userId = req.user._id;
    const intelligence = await calculateFitnessIntelligence(userId);

    return res.status(200).json({
      success: true,
      intelligence,
    });
  } catch (error) {
    console.error(`[GET_FITNESS_INTELLIGENCE ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to access personal fitness intelligence matrix.',
    });
  }
};

export default {
  getFitnessIntelligence,
};
