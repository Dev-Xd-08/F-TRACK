import express from 'express';
import { getQuests, getQuestHistory } from '../controllers/questController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/quests
 * @desc    Get active Daily and Weekly quests with current progress
 * @access  Private
 */
router.get('/', protect, getQuests);

/**
 * @route   GET /api/quests/history
 * @desc    Get completed quest history archives
 * @access  Private
 */
router.get('/history', protect, getQuestHistory);

export default router;
