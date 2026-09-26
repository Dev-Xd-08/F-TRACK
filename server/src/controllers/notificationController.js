import {
  evaluateUserNotifications,
  getUserNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../utils/notificationEngine.js';

/**
 * @desc    Get all notifications for the authenticated warrior
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Evaluates smart reminders and alerts deterministically (idempotent)
    await evaluateUserNotifications(userId);

    const notifications = await getUserNotifications(userId);
    const unreadCount = await getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error(`[GET_NOTIFICATIONS ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to access warrior notification matrix.',
    });
  }
};

/**
 * @desc    Get unread notification count
 * @route   GET /api/notifications/unread
 * @access  Private
 */
export const getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const unreadCount = await getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error(`[GET_UNREAD_COUNT ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve unread alerts count.',
    });
  }
};

/**
 * @desc    Mark a specific notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;

    const notification = await markNotificationRead(userId, notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification alert not found or does not belong to your hunter record.',
      });
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error(`[MARK_NOTIFICATION_READ ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to update notification status.',
    });
  }
};

/**
 * @desc    Mark all notifications as read for authenticated warrior
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const count = await markAllNotificationsRead(userId);

    return res.status(200).json({
      success: true,
      message: 'All notification alerts marked as read.',
      markedCount: count,
    });
  } catch (error) {
    console.error(`[MARK_ALL_NOTIFICATIONS_READ ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear unread notification alerts.',
    });
  }
};

export default {
  getNotifications,
  getUnreadNotificationCount,
  markAsRead,
  markAllAsRead,
};
