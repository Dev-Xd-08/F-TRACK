import express from 'express';
import { saveReflection, getReflections } from '../controllers/reflectionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getReflections)
  .post(saveReflection);

export default router;
