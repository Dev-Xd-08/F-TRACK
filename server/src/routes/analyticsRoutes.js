import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/analytics
 * @desc    Get comprehensive fitness analytics and progress intelligence
 * @access  Private
 */
router.get('/', protect, getAnalytics);

export default router;
