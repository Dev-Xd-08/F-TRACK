import express from 'express';
import {
  getProgression,
  getProgressionHistory,
} from '../controllers/progressionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/progression
 * @desc    Get user's live Ascension level, rank, streak, and statistics
 * @access  Private
 */
router.get('/', protect, getProgression);

/**
 * @route   GET /api/progression/history
 * @desc    Get user's latest 20 progression events (Level Up, Rank Up, etc.)
 * @access  Private
 */
router.get('/history', protect, getProgressionHistory);

export default router;
