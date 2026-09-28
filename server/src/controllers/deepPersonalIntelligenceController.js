import { getDeepPersonalIntelligence } from '../utils/deepPersonalIntelligenceEngine.js';

/**
 * @desc    Get consolidated Deep Personal Intelligence telemetry
 * @route   GET /api/deep-intelligence
 * @access  Private
 */
export const getDeepIntelligence = async (req, res) => {
  try {
    const userId = req.user._id;
    const intelligence = await getDeepPersonalIntelligence(userId);

    return res.status(200).json({
      success: true,
      intelligence,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate deep personal intelligence.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get personal behavioral patterns
 * @route   GET /api/deep-intelligence/patterns
 * @access  Private
 */
export const getPatterns = async (req, res) => {
  try {
    const userId = req.user._id;
    const intelligence = await getDeepPersonalIntelligence(userId);

    return res.status(200).json({
      success: true,
      patterns: intelligence.patterns,
      dataQuality: intelligence.dataQuality,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve behavioral patterns.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get "What Changed?" multi-period comparative telemetry
 * @route   GET /api/deep-intelligence/changes
 * @access  Private
 */
export const getChanges = async (req, res) => {
  try {
    const userId = req.user._id;
    const intelligence = await getDeepPersonalIntelligence(userId);

    return res.status(200).json({
      success: true,
      changes: intelligence.changes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve comparative telemetry.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get long-term Personal Growth Summary
 * @route   GET /api/deep-intelligence/summary
 * @access  Private
 */
export const getGrowthSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const intelligence = await getDeepPersonalIntelligence(userId);

    return res.status(200).json({
      success: true,
      growthSummary: intelligence.growthSummary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve growth summary.',
      error: error.message,
    });
  }
};

export default {
  getDeepIntelligence,
  getPatterns,
  getChanges,
  getGrowthSummary,
};
