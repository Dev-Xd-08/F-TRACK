import express from 'express';
import {
  getNotifications,
  getUnreadNotificationCount,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply JWT protection across all notification endpoints
router.use(protect);

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications and trigger smart evaluation
 * @access  Private
 */
router.get('/', getNotifications);

/**
 * @route   GET /api/notifications/unread
 * @desc    Get count of unread notifications
 * @access  Private
 */
router.get('/unread', getUnreadNotificationCount);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.patch('/read-all', markAllAsRead);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a specific notification as read
 * @access  Private
 */
router.patch('/:id/read', markAsRead);

export default router;
