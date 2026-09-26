import express from 'express';
import { getRecords } from '../controllers/recordController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/records
 * @desc    Get user's verified Personal Record Matrix
 * @access  Private
 */
router.get('/', protect, getRecords);

export default router;
