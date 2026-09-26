import express from 'express';
import { getAchievements, getAchievementHistory } from '../controllers/achievementController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/achievements
 * @desc    Get all Hunter Achievements with current user unlock progress
 * @access  Private
 */
router.get('/', protect, getAchievements);

/**
 * @route   GET /api/achievements/history
 * @desc    Get chronologically unlocked achievement history
 * @access  Private
 */
router.get('/history', protect, getAchievementHistory);

export default router;
