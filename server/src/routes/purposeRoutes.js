import express from 'express';
import { getPurpose, savePurpose, removePurpose } from '../controllers/purposeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getPurpose)
  .post(savePurpose)
  .put(savePurpose)
  .delete(removePurpose);

export default router;
