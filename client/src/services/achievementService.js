// Achievement System API Service for F-TRACK: FITNESS ASCENSION (Stage 9)

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper to retrieve stored JWT authorization header
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('ftrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch all Hunter Achievements with current progress and unlock status
 */
export const getAchievements = async () => {
  const response = await fetch(`${API_URL}/achievements`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve hunter achievement matrix.');
  }

  return data;
};

/**
 * Fetch chronological unlock history of achievements
 */
export const getAchievementHistory = async () => {
  const response = await fetch(`${API_URL}/achievements/history`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve achievement unlock history.');
  }

  return data;
};

export default {
  getAchievements,
  getAchievementHistory,
};
