import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getWeeklyReflections,
  getCurrentWeeklyReflection,
  saveWeeklyReflection,
} from '../controllers/weeklyReflectionController.js';

const router = express.Router();

// Protected endpoints
router.use(protect);

router.route('/')
  .get(getWeeklyReflections)
  .post(saveWeeklyReflection);

router.get('/current', getCurrentWeeklyReflection);

export default router;
