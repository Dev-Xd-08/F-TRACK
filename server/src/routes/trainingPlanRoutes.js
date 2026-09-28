import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getActiveTrainingPlan,
  createTrainingPlan,
  updateTrainingPlan,
  deleteTrainingPlan,
  getAdaptiveWeek,
  getBaseline,
  getDailyRecommendation,
  getLoadAndBalance,
  getLifeContext,
  updateLifeLoad,
  updateAvailability,
} from '../controllers/trainingPlanController.js';

const router = express.Router();

// All training plan and adaptive life endpoints require authentication
router.use(protect);

router.route('/')
  .get(getActiveTrainingPlan)
  .post(createTrainingPlan);

router.route('/:id')
  .put(updateTrainingPlan)
  .delete(deleteTrainingPlan);

router.get('/schedule/adaptive-week', getAdaptiveWeek);
router.get('/metrics/baseline', getBaseline);
router.get('/advisory/recommendation', getDailyRecommendation);
router.get('/metrics/balance', getLoadAndBalance);
router.get('/context/life-load', getLifeContext);
router.post('/context/life-load', updateLifeLoad);
router.post('/context/availability', updateAvailability);

export default router;
