// Smart Reminder & Notification API Service for F-TRACK: FITNESS ASCENSION (Stage 11)

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Retrieve authorization headers with stored JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('ftrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch all notifications for the authenticated warrior
 */
export const getNotifications = async () => {
  const response = await fetch(`${API_URL}/notifications`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve notifications.');
  }

  return data;
};

/**
 * Fetch unread notification count
 */
export const getUnreadCount = async () => {
  const response = await fetch(`${API_URL}/notifications/unread`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve unread count.');
  }

  return data;
};

/**
 * Mark a single notification as read
 * @param {string} id 
 */
export const markNotificationRead = async (id) => {
  const response = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to mark notification as read.');
  }

  return data;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async () => {
  const response = await fetch(`${API_URL}/notifications/read-all`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to mark all notifications as read.');
  }

  return data;
};

export default {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
};
