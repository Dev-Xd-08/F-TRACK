import express from 'express';
import { getFitnessIntelligence } from '../controllers/intelligenceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply JWT protection across intelligence endpoints
router.use(protect);

/**
 * @route   GET /api/intelligence
 * @desc    Get personal fitness intelligence, patterns, consistency, and next focus areas
 * @access  Private
 */
router.get('/', getFitnessIntelligence);

export default router;
