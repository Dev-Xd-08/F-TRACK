import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getDeepIntelligence,
  getPatterns,
  getChanges,
  getGrowthSummary,
} from '../controllers/deepPersonalIntelligenceController.js';

const router = express.Router();

// All deep intelligence endpoints require authentication
router.use(protect);

router.get('/', getDeepIntelligence);
router.get('/patterns', getPatterns);
router.get('/changes', getChanges);
router.get('/summary', getGrowthSummary);

export default router;
