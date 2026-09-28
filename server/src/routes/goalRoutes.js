import express from 'express';
import {
  getGoals,
  getGoal,
  createNewGoal,
  updateGoalDetails,
  removeGoal,
  refreshGoal,
  updateProgress,
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply JWT protection across all goal endpoints
router.use(protect);

/**
 * @route   GET /api/goals
 * @desc    Get all fitness goals/missions for the authenticated warrior
 * @access  Private
 */
router.get('/', getGoals);

/**
 * @route   POST /api/goals
 * @desc    Create a new fitness goal
 * @access  Private
 */
router.post('/', createNewGoal);

/**
 * @route   GET /api/goals/:id
 * @desc    Get single goal by ID
 * @access  Private
 */
router.get('/:id', getGoal);

/**
 * @route   PUT /api/goals/:id
 * @desc    Update goal details
 * @access  Private
 */
router.put('/:id', updateGoalDetails);

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete a goal
 * @access  Private
 */
router.delete('/:id', removeGoal);

/**
 * @route   POST /api/goals/:id/refresh
 * @desc    Force refresh progress for a goal
 * @access  Private
 */
router.post('/:id/refresh', refreshGoal);

/**
 * @route   POST /api/goals/:id/progress
 * @desc    Update manual progress for CUSTOM goal
 * @access  Private
 */
router.post('/:id/progress', updateProgress);

export default router;
