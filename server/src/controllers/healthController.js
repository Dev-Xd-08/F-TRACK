import HealthProfile from '../models/HealthProfile.js';
import { calculateBMI, calculateCalories } from '../utils/healthCalculations.js';
import {
  isMongoConnected,
  getDevHealthProfile,
  saveDevBMI,
  saveDevCalories,
} from '../utils/devStore.js';

/**
 * @desc    Get user's latest health and body analysis profile
 * @route   GET /api/health/profile
 * @access  Private
 */
export const getHealthProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    let profile = null;

    if (isMongoConnected()) {
      profile = await HealthProfile.findOne({ user: userId });
    } else {
      profile = await getDevHealthProfile(userId);
    }

    return res.status(200).json({
      success: true,
      profile: profile || { latestBMI: null, latestCalories: null },
    });
  } catch (error) {
    console.error(`[GET_HEALTH_PROFILE ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve body analysis profile.',
    });
  }
};

/**
 * @desc    Calculate Body Mass Index (BMI) & update profile
 * @route   POST /api/health/bmi
 * @access  Private
 */
export const postBMI = async (req, res) => {
  try {
    const userId = req.user._id;
    const { heightCm, weightKg } = req.body;

    if (heightCm === undefined || weightKg === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Both height in cm and weight in kg are required.',
      });
    }

    // Perform standardized calculation & validation
    const result = calculateBMI(heightCm, weightKg);

    // Save latest calculation to profile
    if (isMongoConnected()) {
      await HealthProfile.findOneAndUpdate(
        { user: userId },
        { latestBMI: { ...result, calculatedAt: new Date() } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else {
      await saveDevBMI(userId, result);
    }

    return res.status(200).json({
      success: true,
      message: 'Body scan complete. BMI calculated successfully.',
      data: result,
    });
  } catch (error) {
    console.error(`[POST_BMI ERROR] ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message || 'Invalid body metric values provided.',
    });
  }
};

/**
 * @desc    Calculate BMR & TDEE Maintenance Calories & update profile
 * @route   POST /api/health/calories
 * @access  Private
 */
export const postCalories = async (req, res) => {
  try {
    const userId = req.user._id;
    const { age, sex, heightCm, weightKg, activityLevel } = req.body;

    if (!age || !sex || !heightCm || !weightKg || !activityLevel) {
      return res.status(400).json({
        success: false,
        message: 'All fields (age, sex, height, weight, activity level) are required.',
      });
    }

    // Perform standardized calculation & validation
    const result = calculateCalories({ age, sex, heightCm, weightKg, activityLevel });

    // Save latest calculation to profile
    if (isMongoConnected()) {
      await HealthProfile.findOneAndUpdate(
        { user: userId },
        { latestCalories: { ...result, calculatedAt: new Date() } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else {
      await saveDevCalories(userId, result);
    }

    return res.status(200).json({
      success: true,
      message: 'Calorie Core requirements synchronized successfully.',
      data: result,
    });
  } catch (error) {
    console.error(`[POST_CALORIES ERROR] ${error.message}`);
    return res.status(400).json({
      success: false,
      message: error.message || 'Invalid calorie calculation inputs.',
    });
  }
};
