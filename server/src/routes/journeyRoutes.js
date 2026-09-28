import express from 'express';
import { getJourneyTelemetry } from '../controllers/journeyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/telemetry', getJourneyTelemetry);

export default router;
